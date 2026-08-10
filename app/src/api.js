import SENTENCES, { meetsDifficulty } from './data/sentences.js';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchSentence() {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL.replace(/\/$/, '')}/quotes`);
      if (res.ok) {
        const text = await res.json();
        // API sentences must pass the same difficulty rules as bundled ones.
        if (typeof text === 'string' && text.trim() && meetsDifficulty(text.trim())) {
          return { text: text.trim(), author: null, book: null };
        }
      }
    } catch {
      // fall through to the bundled sentences
    }
  }
  return SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
}
