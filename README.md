# Cascade

Cascade is a browser-only Klondike solitaire played on a fixed felt table. This
build uses Draw Three: clicking the stock turns up to three cards onto the waste,
with only the frontmost waste card playable, and the waste recycles when the
stock runs out.

The goal is the classic one: build the four foundations from Ace to King by suit.
Tableau columns build downward in alternating colors, and only Kings can fill
empty columns. When the last card reaches a foundation, the cards launch into a
victory cascade over the table.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite prints the local URL. The game runs entirely in the browser with no backend,
network service, art assets, or audio files.

## Production Build

```sh
npm run build
```

The static site is emitted to `dist/`, with `dist/index.html` as the entry point.
You can serve that directory from any static host.

## Controls

Use a mouse, pen, or touch. Click the stock to turn cards. Drag face-up tableau
cards or runs, the waste's front card, or a foundation's top card onto legal
targets. Double-click a playable waste card or the lowest face-up card in a
column to send it to a foundation when it belongs there.

Menus use pointer/touch, or the keyboard: `ArrowUp`/`W`, `ArrowDown`/`S`,
`Enter`/`Space`, and `Escape`. The HUD buttons start a new game, return to the
title screen, and toggle sound.

## Checks

```sh
npm run typecheck
npm run lint
npm run format
npm test
```
