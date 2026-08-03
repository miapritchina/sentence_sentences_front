const isLetter = (ch) => /^[a-z]$/i.test(ch);

export default function SentenceBoard({ text, guessed, revealAll }) {
  const words = text.split(/(\s+)/).filter((w) => w.trim().length > 0);

  return (
    <div className="sentence" aria-label="The sentence to guess">
      {words.map((word, wi) => (
        <span className="word" key={wi}>
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
                {revealed ? ch : ' '}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
