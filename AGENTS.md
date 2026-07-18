# AGENTS.md

## Cursor Cloud specific instructions

Static, mobile-first DeFi feed PWA (vanilla HTML/CSS/JS + service worker). No build step, no dependencies, no tests. See `README.md` for the feature overview.

- Run locally by serving the repo root with any static server, e.g. `python3 -m http.server 8083`, then open the printed URL.
- The feed fetches live data at runtime from external APIs (DeFiLlama / CoinGecko), so it requires outbound network access to populate; with no network the page renders but the protocol list stays empty.
- There is nothing to install; the startup update script intentionally does nothing for this repo.
