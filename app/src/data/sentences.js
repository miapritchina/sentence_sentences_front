// Bundled Jane Austen sentences (all public domain), used when no API is
// configured or the API is unreachable.
//
// Difficulty rules — a sentence qualifies only if:
//   - it is 40..90 characters long: long sentences contain so many letter
//     occurrences that almost every guess lands, and very short ones
//     ("Oh, well") are over in three guesses;
//   - it uses at most 17 distinct letters: the fewer distinct letters a
//     sentence has, the more of the alphabet is a miss, which is what makes
//     a round genuinely risky.
// Candidates violating the rules are dropped at load (with a dev warning),
// so new additions are checked automatically.

export const MIN_LENGTH = 40;
export const MAX_LENGTH = 90;
export const MAX_DISTINCT_LETTERS = 17;

export function meetsDifficulty(text) {
  const distinct = new Set(
    text.toLowerCase().split('').filter((ch) => ch >= 'a' && ch <= 'z')
  ).size;
  return (
    text.length >= MIN_LENGTH &&
    text.length <= MAX_LENGTH &&
    distinct <= MAX_DISTINCT_LETTERS
  );
}

const CANDIDATES = [
  {
    text: 'You pierce my soul. I am half agony, half hope.',
    author: 'Jane Austen',
    book: 'Persuasion',
  },
  {
    text: 'It is such a happiness when good people get together.',
    author: 'Jane Austen',
    book: 'Emma',
  },
  {
    text: 'There is no charm equal to tenderness of heart.',
    author: 'Jane Austen',
    book: 'Emma',
  },
  {
    text: 'To wish was to hope, and to hope was to expect.',
    author: 'Jane Austen',
    book: 'Sense and Sensibility',
  },
  {
    text: 'Everything nourishes what is strong already.',
    author: 'Jane Austen',
    book: 'Pride and Prejudice',
  },
  {
    text: 'Without music, life would be a blank to me.',
    author: 'Jane Austen',
    book: 'Emma',
  },
  {
    text: 'One cannot be always laughing at a man without now and then stumbling on something witty.',
    author: 'Jane Austen',
    book: 'Pride and Prejudice',
  },
  {
    text: 'My good opinion once lost is lost forever.',
    author: 'Jane Austen',
    book: 'Pride and Prejudice',
  },
  {
    text: 'Ah! There is nothing like staying at home, for real comfort.',
    author: 'Jane Austen',
    book: 'Emma',
  },
  {
    text: 'Nobody minds having what is too good for them.',
    author: 'Jane Austen',
    book: 'Mansfield Park',
  },
  {
    text: 'It is very difficult for the prosperous to be humble.',
    author: 'Jane Austen',
    book: 'Emma',
  },
  {
    text: 'Those who do not complain are never pitied.',
    author: 'Jane Austen',
    book: 'Pride and Prejudice',
  },
  {
    text: 'To be fond of dancing was a certain step towards falling in love.',
    author: 'Jane Austen',
    book: 'Pride and Prejudice',
  },
  {
    text: 'From this day you must be a stranger to one of your parents.',
    author: 'Jane Austen',
    book: 'Pride and Prejudice',
  },
  {
    text: 'There are people, who the more you do for them, the less they will do for themselves.',
    author: 'Jane Austen',
    book: 'Emma',
  },
  {
    text: 'I cannot speak well enough to be unintelligible.',
    author: 'Jane Austen',
    book: 'Northanger Abbey',
  },
  {
    text: 'What is right to be done cannot be done too soon.',
    author: 'Jane Austen',
    book: 'Emma',
  },
  {
    text: 'Human nature is so well disposed towards those who are in interesting situations.',
    author: 'Jane Austen',
    book: 'Emma',
  },
  {
    text: 'None of us want to be in calm waters all our lives.',
    author: 'Jane Austen',
    book: 'Persuasion',
  },
  {
    text: 'Every moment has its pleasures and its hope.',
    author: 'Jane Austen',
    book: 'Mansfield Park',
  },
  {
    text: 'Money can only give happiness where there is nothing else to give it.',
    author: 'Jane Austen',
    book: 'Sense and Sensibility',
  },
];

const SENTENCES = CANDIDATES.filter((s) => {
  const ok = meetsDifficulty(s.text);
  if (!ok && import.meta.env.DEV) {
    console.warn(`Sentence rejected by difficulty rules: "${s.text}"`);
  }
  return ok;
});

export default SENTENCES;
