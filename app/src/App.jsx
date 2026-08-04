import { useCallback, useEffect, useState } from 'react';
import Gallows from './components/Gallows.jsx';
import SentenceBoard from './components/SentenceBoard.jsx';
import Keyboard from './components/Keyboard.jsx';
import { fetchSentence } from './api.js';
import {
  guessPoints,
  missPenalty,
  turnMultiplier,
  streakMultiplier,
} from './scoring.js';

export const MAX_MISTAKES = 10;

const isLetter = (ch) => /^[a-z]$/i.test(ch);

export default function App() {
  const [sentence, setSentence] = useState(null);
  const [guessed, setGuessed] = useState(() => new Set());
  const [mistakes, setMistakes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [guessCount, setGuessCount] = useState(0);
  const [lastGain, setLastGain] = useState(null);

  const newGame = useCallback(async () => {
    setLoading(true);
    const next = await fetchSentence();
    setSentence(next);
    setGuessed(new Set());
    setMistakes(0);
    setScore(0);
    setStreak(0);
    setGuessCount(0);
    setLastGain(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    newGame();
  }, [newGame]);

  const letters = sentence
    ? new Set(
        sentence.text
          .toLowerCase()
          .split('')
          .filter((ch) => isLetter(ch))
      )
    : new Set();

  const won = sentence && [...letters].every((ch) => guessed.has(ch));
  const lost = mistakes >= MAX_MISTAKES;
  const playing = sentence && !won && !lost && !loading;

  const guess = useCallback(
    (rawLetter) => {
      const letter = rawLetter.toLowerCase();
      if (!playing || guessed.has(letter)) return;
      setGuessed((prev) => new Set(prev).add(letter));
      if (letters.has(letter)) {
        const occurrences = sentence.text
          .toLowerCase()
          .split('')
          .filter((ch) => ch === letter).length;
        const pts = guessPoints(letter, occurrences, guessCount, streak);
        setScore((s) => s + pts);
        setStreak((k) => k + 1);
        setLastGain({ value: pts, id: letter + guessCount });
      } else {
        const penalty = missPenalty(letter);
        setScore((s) => Math.max(0, s - penalty));
        setStreak(0);
        setLastGain({ value: -penalty, id: letter + guessCount });
        setMistakes((m) => m + 1);
      }
      setGuessCount((c) => c + 1);
    },
    [playing, guessed, letters, sentence, guessCount, streak]
  );

  // A hint reveals one letter from the sentence, at the cost of one life.
  // It earns no points and breaks the streak.
  const hint = useCallback(() => {
    if (!playing || mistakes >= MAX_MISTAKES - 1) return;
    const remaining = [...letters].filter((ch) => !guessed.has(ch));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setGuessed((prev) => new Set(prev).add(pick));
    setMistakes((m) => m + 1);
    setStreak(0);
  }, [playing, mistakes, letters, guessed]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isLetter(e.key)) guess(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [guess]);

  const turnMult = turnMultiplier(guessCount);
  const streakMult = streakMultiplier(streak);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Sentence Sentences</h1>
        <p className="subtitle">
          A literary hangman — reveal the sentence one letter at a time.
        </p>
      </header>

      <main className="game">
        <section className="stage">
          <Gallows mistakes={mistakes} won={won} />
          <div className="status">
            <div className="lives" aria-label={`${MAX_MISTAKES - mistakes} lives remaining`}>
              {Array.from({ length: MAX_MISTAKES }, (_, i) => (
                <span
                  key={i}
                  className={`life ${i < MAX_MISTAKES - mistakes ? 'life-full' : 'life-lost'}`}
                />
              ))}
            </div>
            <div className="score-line">
              <span className="score" aria-label={`Score ${score}`}>
                {score}
                {lastGain && (
                  <span
                    key={lastGain.id}
                    className={`score-delta ${lastGain.value >= 0 ? 'score-delta-plus' : 'score-delta-minus'}`}
                  >
                    {lastGain.value >= 0 ? `+${lastGain.value}` : lastGain.value}
                  </span>
                )}
              </span>
              {playing && turnMult > 1 && (
                <span className="score-chip" title="First guesses score more">
                  opening ×{turnMult}
                </span>
              )}
              {playing && streak >= 2 && (
                <span className="score-chip score-chip-streak" title="Consecutive correct guesses">
                  streak ×{streakMult}
                </span>
              )}
            </div>
            {playing && (
              <button
                className="btn btn-ghost"
                onClick={hint}
                disabled={mistakes >= MAX_MISTAKES - 1}
                title="Reveal a letter (costs one life, breaks your streak)"
              >
                Hint · costs a life
              </button>
            )}
          </div>
        </section>

        <section className="board">
          {loading ? (
            <p className="loading">Choosing a sentence…</p>
          ) : (
            <>
              <SentenceBoard
                text={sentence.text}
                guessed={guessed}
                revealAll={lost}
              />
              {(won || lost) && (
                <div className={`outcome ${won ? 'outcome-win' : 'outcome-loss'}`}>
                  <p className="outcome-message">
                    {won ? 'Beautifully done — you saved the sentence!' : 'The sentence slipped away…'}
                  </p>
                  <p className="final-score">Final score: {score}</p>
                  {sentence.author && (
                    <p className="attribution">
                      — {sentence.author}
                      {sentence.book ? `, ${sentence.book}` : ''}
                    </p>
                  )}
                  <button className="btn btn-primary" onClick={newGame}>
                    Play another sentence
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {!loading && !won && !lost && (
          <Keyboard guessed={guessed} letters={letters} onGuess={guess} />
        )}
      </main>

      <footer className="footer">
        Sentences by Jane Austen · rare letters score more · early guesses count extra
      </footer>
    </div>
  );
}
