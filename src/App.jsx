import { useCallback, useEffect, useState } from 'react';
import Gallows from './components/Gallows.jsx';
import SentenceBoard from './components/SentenceBoard.jsx';
import Keyboard from './components/Keyboard.jsx';
import { fetchSentence } from './api.js';

export const MAX_MISTAKES = 10;

const isLetter = (ch) => /^[a-z]$/i.test(ch);

export default function App() {
  const [sentence, setSentence] = useState(null);
  const [guessed, setGuessed] = useState(() => new Set());
  const [mistakes, setMistakes] = useState(0);
  const [loading, setLoading] = useState(true);

  const newGame = useCallback(async () => {
    setLoading(true);
    const next = await fetchSentence();
    setSentence(next);
    setGuessed(new Set());
    setMistakes(0);
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
      if (!letters.has(letter)) {
        setMistakes((m) => m + 1);
      }
    },
    [playing, guessed, letters]
  );

  // A hint reveals one letter from the sentence, at the cost of one life.
  const hint = useCallback(() => {
    if (!playing || mistakes >= MAX_MISTAKES - 1) return;
    const remaining = [...letters].filter((ch) => !guessed.has(ch));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setGuessed((prev) => new Set(prev).add(pick));
    setMistakes((m) => m + 1);
  }, [playing, mistakes, letters, guessed]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isLetter(e.key)) guess(e.key);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [guess]);

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
            {playing && (
              <button
                className="btn btn-ghost"
                onClick={hint}
                disabled={mistakes >= MAX_MISTAKES - 1}
                title="Reveal a letter (costs one life)"
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
        Sentences by Jane Austen · type or tap a letter to guess
      </footer>
    </div>
  );
}
