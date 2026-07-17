# Bangladesh Guesser — জেলাখুঁজি

A [Globle](https://globle-game.com/)-style geography guessing game for the **64 districts of
Bangladesh**. A hidden district is chosen at random; every guess is painted on a 2D map with a
heat color — the hotter the red, the closer you are (border-to-border distance, so a
neighboring district reads **0 km**). Practice mode only: unlimited games.

**Play:** just open `index.html` in any modern browser. It is a single self-contained file —
no server, no build step, works offline.

## Features

- **Bilingual UI** — full English and Bangla (বাংলা) interfaces, switchable any time.
  District names are shown in both scripts; Bengali numerals are used in Bangla mode.
- **Forgiving input** — type in either language. Misspellings are handled:
  - old/alternate spellings are aliases (Chittagong → Chattogram, Jessore → Jashore,
    Comilla → Cumilla, Bogra → Bogura, Nawabganj → Chapainawabganj, …),
  - a typo with one clearly-best match is accepted automatically ("komilla" → Cumilla,
    "ভুলা" → ভোলা) with an "interpreted as" note,
  - ambiguous input ("rang…") opens a *did-you-mean* list instead of guessing for you,
  - live autocomplete suggestions appear while typing (arrow keys + Enter to pick).
- **Globle-style feedback** — heat color per guess, border-to-border distance in km,
  direction arrow toward the target, closest-so-far stat, sorted guess list.
- **Extras** — one hint per game (reveals the division), give-up reveal, light/dark theme,
  keyboard shortcut `/` to focus the input.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole game (markup, styles, logic, and embedded map data) |
| `data/bgd-districts-simplified.geojson` | Source district boundaries (simplified) |
| `data/game-data.json` | Generated: names, centroids, geometry, distance matrix |
| `tools/build-data.mjs` | Regenerates `game-data.json` and re-injects it into `index.html` |

To rebuild the embedded data (e.g., after editing names/aliases in `tools/build-data.mjs`):

```
node tools/build-data.mjs
```

## Data & credits

- Boundaries: [geoBoundaries](https://www.geoboundaries.org/) ADM2 (BGD), sourced from the
  Bangladesh Bureau of Statistics / OCHA — CC BY 3.0 IGO. Geometry simplified with mapshaper.
- Distances are minimum border-to-border distances between simplified district polygons,
  precomputed into a 64×64 matrix at build time.
- Game concept inspired by [Globle](https://globle-game.com/) (The Abe Train).
"# Bangladesh-guess" 
