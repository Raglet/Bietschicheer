# Bietschicheer – Project Context for Claude

## Corporate Design (CI/CD)

Follow this design system for anything user-facing. The tokens live in `:root` in `style.css`.

### Colours

Always use these CSS variables (defined in `style.css`) — never hardcode the hex:

| Variable                | Hex       | Role              |
|-------------------------|-----------|-------------------|
| `--primär-hell`         | `#996f91` | Hellviolett (primary light) |
| `--primär-dunkel`       | `#663f5e` | Dunkelviolett (primary dark) |
| `--hintergrund-dunkel`  | `#404040` | Background dark   |
| `--hintergrund-hell`    | `#a5a5a5` | Background light  |
| `--hintergrund-neutral` | `#e1e1e1` | Background neutral|
| `--sekundär-hell`       | `#4384a2` | Secondary light   |
| `--sekundär-dunkel`     | `#364954` | Secondary dark    |

Colour usage:
- **Titel & Übertitel/Headings** → Dunkelviolett (`--primär-dunkel`).
- **Fliesstext (body)** → black (`#000`).
- **Highlights** → Hellviolett (`--primär-hell`).
- **Digital screens** (anything not printed) use a grey background (`--hintergrund-neutral`); the brand header bar uses `--primär-dunkel` with white text.
- In JS (Google Maps styling) use the `C` object / `MAP_STYLE` in `locations-data.js` (CSS vars can't be used there).

### Typography — Montserrat (weights loaded: 300;400;500;600;800)

| Role        | Font                    | Weight |
|-------------|-------------------------|--------|
| Titel       | Montserrat ExtraBold    | 800    |
| Heading 1   | Montserrat SemiBold     | 600    |
| Heading 2   | Montserrat Medium       | 500    |
| Fliesstext  | Montserrat (Regular)    | 400    |
| Subtext     | Montserrat Light        | 300    |

Base element styles in `style.css` apply this: `h1`/`.titel`=800, `h2`=600, `h3`=500, `body`/`p`=400, `.subtext`=300, `.highlight`=Hellviolett. When the Google Fonts link is changed, keep weights `300;400;500;600;800`.

### Buttons

Only a very small rounding, almost square — use `border-radius: var(--btn-radius)` (`3px`). (The circular map control bubbles and icon buttons are the exception.)

### Logo (`images/bietschicheer/`)

- `Bietschicheer_26_logo_sekundär.png` — **the logo to use in this app** (a graphic, no text). Purple mountains on transparent bg → only place it on light/grey backgrounds (it's invisible on the dark purple header). Currently top-left on the map (`.brand-logo`).
- `Bietschicheer_26_logo_pimär.png` — primary logo (not used in the app).
- `Bietschicheer26_slogan.png` — slogan graphic, add where a slogan fits.

### Language & wording

- All UI text is **German**, addressing the user informally (**per Du**).
- **Gendern with a colon**: e.g. `Präsident:in`, `Mitarbeiter:in`, `Besucher:in`.

## Stack

- Vanilla HTML / CSS / JS (no framework)
- Google Maps JavaScript API (`script.js`)
- Material Design Components Web (MDC) for dialogs and icons
- Font: Montserrat (Google Fonts)

## Pages

- `index.html` — interactive Google Maps page with markers for bars, food, stage, parking, etc.
- `bietschimeile.html` — "Bietschimeile" digital stamp card, accessible via the path-icon bubble (top-right of map). Logic in `bietschimeile.js`.
- `lineup.html` — stage lineup with a live "Jetzt live" / "als Nächstes" highlight, accessible from the stage marker popup on the map. Page rendering in `lineup.js`.
- `lineup-data.js` — shared lineup data (`LINEUP` array) + "now playing" logic (`getLiveAct`, `isLive`, `getNow`, `nextIndex`). Loaded by both `lineup.html` and `index.html`. Live state is matched by weekday (Fr=5/Sa=6) + time, so it works regardless of year. Contains a `TEST_NOW` override for off-festival testing (set to `null` for production).
- `index.html` shows a fixed "Jetzt live" banner at the top while a band plays (driven by `lineup-data.js`); when visible it pushes the right-side floating buttons down by `--banner-h`.

## Bietschimeile stamp card

- A digital stamp card for visiting every bar. State lives in `localStorage` (key `bietschimeile.stamps`) — per-device, no backend, intentionally cheatable (festival fun feature).
- Bars + recommended order are defined in the `BARS` array in `bietschimeile.js`.
- Collecting a stamp: a printed QR code at each bar links to `bietschimeile.html?b=<id>`; the phone's native camera opens it, the `b` param is consumed, the stamp is saved, and the query string is stripped. Order is **not** enforced — the numbers are only a suggested route.
- Collecting all bars shows a celebration overlay (placeholder for a future reward).
- First visit shows a tutorial overlay: a mini Google Map that animates an arrow along the recommended route (the `BARS` order), using coordinates from `LOCATIONS` (matched by `name`). Shown once (localStorage key `bietschimeile.tutorialSeen`); the header "?" button replays it. The Maps API is lazy-loaded only when the tutorial opens (`loadGoogleMaps()` in `bietschimeile.js`).
- The map (`index.html`) reflects collected stamps: clicking a bar marker appends a "✓ Stempel gesammelt" badge to the bottom of its InfoWindow if that bar's stamp is collected. The marker name → stamp id link is `BAR_NAME_TO_STAMP` in `script.js`. NOTE: the map's `LOCATIONS` list is still the old bar lineup, so only bars present in both (Bietschicheer, EHC, Stigma, Heidnischbier, DIE BAR, Pro Raronia) can show the badge until `LOCATIONS` is updated to the new `BARS` list.

## Map markers (LOCATIONS)

- Participant markers (bars, food, Programm) are data-driven from the `LOCATIONS` array in **`locations-data.js`** (shared: loaded by both `index.html` and `bietschimeile.html`). Each entry: `name`, `lat`, `lng`, `type` (`bar`/`food`/`programm`/`restaurant` → icon via `TYPE_ICONS`), and optional `image`, `badge`, `by`, `getraenke`, `musik`, `essen`, `nachmittag`, `description`, `logoStyle`. `buildInfoContent()` (in `script.js`) turns an entry into the InfoWindow HTML — never hand-write marker HTML.
- `image`: a plain filename resolves from `images/mitwirkende_logos_26/` (`LOGO_DIR`); a value with a `/` (e.g. `logos/foo.png`) resolves from `images/` directly; can be an array for multiple logos. `musik`/`essen` accept a string or an array (array → dash bullet list).
- Infrastructure markers (restaurants, WC, parking, ATM, bus/train, stage, info) are still defined as inline arrays/objects inside `initMap` — not part of `LOCATIONS`.
- Map start position + zoom: the `center` / `zoom` options in `initMap` (`script.js`).

## Where to edit content

- Bars/food/Programm on the map → `LOCATIONS` in `locations-data.js` (shared by the map and the stamp-card tutorial).
- Stamp-card bars + order → `BARS` in `bietschimeile.js`.
- Stage lineup + set times → `LINEUP` in `lineup-data.js`.
- Brand colours → `:root` variables in `style.css` (and the `C` object in `script.js` for the Google Maps style).
- `TEST_NOW` in `lineup-data.js` must be `null` in production.

## Assets & folders

- `icons/` — marker icons and UI SVGs (`bar.svg`, `food.svg`, `nachmittag.svg`, `restaurant.svg`, `parking.svg`, `sanitaer.svg`, `sanitaet.svg`, `atm.svg`, `info.svg`, `busStop.svg`, `trainStop.svg`, `stage.png`, `path.svg`).
- `images/mitwirkende_logos_26/` — current participant logos (2026). Default folder for `LOCATIONS` / `BARS` `image` filenames. Files are prefixed by their id, e.g. `02_diebar.png`, `22_Bietschicheer.png` (note: some filenames contain spaces / umlauts, which is why paths are run through `encodeURI`).
- `images/logos/` — older logo set; referenced from `LOCATIONS` with a leading `logos/` (e.g. `logos/ehc.png`).
- `images/` — other imagery (`favicon.svg`, etc.).

## Example LOCATIONS entry

```js
{
  name: "DIE BAR", lat: 46.309649, lng: 7.80025, type: "bar",
  image: "02_diebar.png",                 // from images/mitwirkende_logos_26/
  badge: "diebar",                        // purple name badge
  musik: "Blues and more",
  essen: ["Croque Monsieur", "Veganer Gurkendip"], // array -> bullet list
}
```

## Running & deployment

- No build step. Open `index.html` directly, or serve the folder (e.g. `python -m http.server`) for local testing.
- Deployed as static files on GitHub Pages. Geolocation ("Du bist hier") and QR scanning need HTTPS, which Pages provides; they won't prompt on `file://`.
- The Google Maps API key is inline in `index.html` (`maps.googleapis.com/...&key=`).

## UI Conventions

- Floating action buttons (top-right): 48×48px white circles, `box-shadow: 0 2px 6px rgba(0,0,0,0.3)`, `border-radius: 50%`
- Icons: Material Icons (`<span class="material-icons">`) or SVGs from `icons/`
- Shared styles live in `style.css`; page-specific styles go in a `<style>` block in that page's `<head>`