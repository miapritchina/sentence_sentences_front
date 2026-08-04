# Sentence Sentences

A literary hangman game: a sentence from Jane Austen is hidden behind blanks, and you
reveal it one letter at a time. Ten wrong guesses and the sentence slips away.

Built with [React](https://react.dev) and [Vite](https://vitejs.dev).

The app source lives in `app/`. The `index.html`, `assets/`, and `favicon.svg`
at the repository root are the build output, committed automatically by CI so
GitHub Pages (which serves the branch root) always has the built site — don't
edit them by hand.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default [localhost:5173](http://localhost:5173)).

## Production build

```bash
npm run build
npm run preview
```

The static site is emitted to `dist/` and can be deployed to any static host.

## Configuration

By default the game plays from a bundled collection of Jane Austen sentences.
To fetch sentences from the [sentence_sentences](https://github.com/miapritchina/sentence_sentences)
backend instead, set the API base URL at build time:

```bash
VITE_API_URL=https://your-backend.example.com npm run build
```

The app calls `GET {VITE_API_URL}/quotes` and falls back to the bundled sentences
if the API is unreachable.

## How to play

- Type a letter, or tap it on the on-screen keyboard.
- Correct guesses reveal every occurrence of the letter; wrong guesses draw
  one more stroke of the gallows.
- The **Hint** button reveals a letter for you — at the cost of one life.
