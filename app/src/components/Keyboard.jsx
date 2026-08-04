import { LETTER_VALUES } from '../scoring.js';

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

export default function Keyboard({ guessed, letters, onGuess }) {
  return (
    <div className="keyboard" aria-label="Letter keyboard">
      {ROWS.map((row) => (
        <div className="keyboard-row" key={row}>
          {row.split('').map((letter) => {
            const used = guessed.has(letter);
            const hit = used && letters.has(letter);
            return (
              <button
                key={letter}
                className={`key ${used ? (hit ? 'key-hit' : 'key-miss') : ''}`}
                onClick={() => onGuess(letter)}
                disabled={used}
                aria-label={
                  used
                    ? `${letter}, already guessed`
                    : `Guess letter ${letter}, worth ${LETTER_VALUES[letter]} points`
                }
              >
                {letter}
                {!used && <span className="key-value">{LETTER_VALUES[letter]}</span>}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
