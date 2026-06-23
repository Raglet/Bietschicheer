# Bietschicheer Interactive Map

A web application built with the Google Maps JavaScript API that shows the terrain and locations of the various bars, stages, food stands and services at the Bietschicheer event. It also includes a digital stamp card ("Bietschimeile") and a stage lineup with a live "now playing" indicator.

## Website

The website for this project can be found at [https://raglet.github.io/Bietschicheer/](https://raglet.github.io/Bietschicheer/). You can interact with the map by zooming in/out, dragging to navigate, and clicking markers to see more information about each location.

## Pages

- **`index.html`** — the interactive map with markers for bars, food, stage, restaurants, parking, WC, ATMs, ÖV stops, etc. Includes the live lineup banner and the floating action buttons.
- **`bietschimeile.html`** — the "Bietschimeile" digital stamp card. Reached via the path-icon bubble in the top-right of the map.
- **`lineup.html`** — the stage lineup with a live "Jetzt live" / "als Nächstes" highlight. Reached from the stage marker on the map.

## Features

- **Map markers & InfoWindows** — each location has a marker; clicking it opens an InfoWindow with the name, logo and details (music, food, etc.).
- **"Du bist hier" location** — a button (bottom of the top-right stack) shows the visitor's live GPS position on the map. Requires HTTPS and location permission.
- **Bietschimeile stamp card** — a digital pub-crawl stamp card. Each bar has a printed QR code linking to `bietschimeile.html?b=<id>`; scanning it with the phone's camera collects that stamp. Progress is stored per-device in `localStorage` (no backend), the order is only a recommendation, and collecting every stamp triggers a celebration screen.
- **Live lineup** — `lineup.html` lists the full Friday/Saturday programme and highlights the act currently on stage. A matching floating banner appears on the map while a band is playing. The live state is matched by weekday + time, so it works regardless of the year.
- **Brand styling** — a custom Google Maps style and a shared colour palette (CSS variables) keep the look consistent across pages.

## Technology

- **Vanilla HTML / CSS / JavaScript** — no framework or build step; the site is served as static files (GitHub Pages).
- **Google Maps JavaScript API** — map, markers, InfoWindows and custom map styling (`script.js`).
- **Material Components Web (MDC)** — dialogs and Material Icons.
- **Montserrat** (Google Fonts) — typography.

## Project structure

| File | Purpose |
|------|---------|
| `index.html` / `script.js` | Map page and all marker/InfoWindow logic, the live banner and locate button |
| `bietschimeile.html` / `bietschimeile.js` | Stamp card page, logic and the first-visit route tutorial |
| `lineup.html` / `lineup.js` | Lineup page rendering |
| `locations-data.js` | Shared location data (`LOCATIONS`), brand colours (`C`) and the Google Maps style (`MAP_STYLE`); used by the map and the stamp-card tutorial |
| `lineup-data.js` | Shared lineup data + "now playing" logic (used by the lineup page and the map banner) |
| `style.css` | Shared styles, the colour palette and typography (Corporate Design) CSS variables |
| `icons/`, `images/` | Marker icons and logos |

## Editing content

Most updates are done by editing one of these data lists — no HTML required:

- **Bars / food / Programm on the map** → the `LOCATIONS` array in `locations-data.js`. Each entry has `name`, `lat`, `lng`, `type` (`bar`/`food`/`programm`/`restaurant`) and optional `image`, `badge`, `by`, `getraenke`, `musik`, `essen`, `nachmittag`, `description`. The InfoWindow popup is generated automatically. Logo `image` is just the filename (from `images/mitwirkende_logos_26/`).
- **Stamp-card bars** → the `BARS` array in `bietschimeile.js`.
- **Stage lineup** → the `LINEUP` array in `lineup-data.js`.
- **Map start position / zoom** → the `center` and `zoom` options in `initMap` (`script.js`).
- **Colours** → the `:root` CSS variables in `style.css`.

> Before going live, set `TEST_NOW` in `lineup-data.js` back to `null` (it's a testing override for the live-lineup highlight).

## Credits

This application was created by Samuel Zurbriggen, Jakob Löhrer and Lukas Zurbriggen for the Bietschicheer event.

Thanks to the following resources:

- [Google Maps JavaScript API documentation](https://developers.google.com/maps/documentation/javascript/overview)
- [Material Components Web](https://github.com/material-components/material-components-web)
