import SENTENCES from './data/sentences.js';

// Letter values are derived from how often each letter actually appears in
// the bundled corpus: the rarer the letter, the more it scores. Values are
// the letter's information content (-log2 of its frequency), shifted and
// scaled into a friendly 1..~16 range.
const counts = {};
let total = 0;
for (const s of SENTENCES) {
  for (const ch of s.text.toLowerCase()) {
    if (ch >= 'a' && ch <= 'z') {
      counts[ch] = (counts[ch] || 0) + 1;
      total += 1;
    }
  }
}

export const LETTER_VALUES = {};
for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
  const freq = (counts[letter] || 0.5) / total;
  LETTER_VALUES[letter] = Math.max(1, Math.round((-Math.log2(freq) - 2.5) * 2));
}

// The first guesses are worth the most — spending them on safe common
// letters wastes the bonus.
export function turnMultiplier(guessCount) {
  if (guessCount < 3) return 3;
  if (guessCount < 6) return 2;
  return 1;
}

// Consecutive correct guesses build a modest multiplier, capped at x2.
export function streakMultiplier(streak) {
  return Math.min(1 + 0.25 * streak, 2);
}

// A miss costs points too, but missing on a rare letter was a bold play and
// is priced gentler than missing on a common one.
export function missPenalty(letter) {
  return Math.min(16, Math.max(4, 18 - LETTER_VALUES[letter]));
}

export function guessPoints(letter, occurrences, guessCount, streak) {
  return Math.round(
    LETTER_VALUES[letter] *
      occurrences *
      turnMultiplier(guessCount) *
      streakMultiplier(streak)
  );
}
