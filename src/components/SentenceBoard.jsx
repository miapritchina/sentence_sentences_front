import { useLayoutEffect, useRef } from 'react';

const isLetter = (ch) => /^[a-z]$/i.test(ch);

export default function SentenceBoard({ text, guessed, revealAll }) {
  const words = text.split(/(\s+)/).filter((w) => w.trim().length > 0);
  const ref = useRef(null);

  // Shrink the sentence's font until it fits the space the board was given,
  // so even the longest sentence never forces the page to scroll.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = '';
      let size = parseFloat(getComputedStyle(el).fontSize);
      const board = el.parentElement;
      let guard = 40;
      while (
        guard-- > 0 &&
        size > 8 &&
        board.scrollHeight > board.clientHeight + 1
      ) {
        size *= 0.94;
        el.style.fontSize = `${size}px`;
      }
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [text]);

  return (
    <div className="sentence" aria-label="The sentence to guess" ref={ref}>
      {words.map((word, wi) => {
        const complete = word
          .split('')
          .every((ch) => !isLetter(ch) || revealAll || guessed.has(ch.toLowerCase()));
        return (
          <span className={`word ${complete ? 'word-complete' : ''}`} key={wi}>
            {word.split('').map((ch, ci) => {
              if (!isLetter(ch)) {
                return (
                  <span className="cell cell-punct" key={ci}>
                    {ch}
                  </span>
                );
              }
              const shown = guessed.has(ch.toLowerCase());
              const revealed = shown || revealAll;
              return (
                <span
                  key={ci}
                  className={`cell cell-letter ${
                    revealed ? (shown ? 'cell-revealed' : 'cell-missed') : 'cell-hidden'
                  }`}
                >
                  {revealed ? ch : ' '}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
}
