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

- `Bietschicheer_26_logo_sekundär.png` — **the logo to use in this app** (a graphic, no text). Purple mountains on transparent bg → only place it on light/grey backgrounds (it's invisible on the dark purple header). Currently top-left on the map (`.brand-logo`, an `<a>` linking to https://www.bietschicheer.ch in a new tab).
- `Bietschicheer_26_logo_pimär.png` — primary logo (not used in the app).
- `Bietschicheer26_slogan.png` — slogan graphic, add where a slogan fits.

### Language & wording

- All UI text is **German**, addressing the user informally (**per Du**).
- **Gendern with a colon**: e.g. `Präsident:in`, `Mitarbeiter:in`, `Besucher:in`.

## Stack

- Vanilla HTML / CSS / JS (no framework, no build step)
- Google Maps JavaScript API (`script.js`)
- Material Design Components Web (MDC) for dialogs and icons
- Font: Montserrat (Google Fonts)
- Firebase Firestore (content) + Firebase Auth Google Sign-In (admin login) via the "compat" CDN build (`firebase-*-compat.js`, classic `<script>` tags, not ES modules) – see "Data & admin (Firebase)" below.

## Pages

- `index.html` — interactive Google Maps page with markers for bars, food, stage, parking, etc.
- `bietschimeile.html` — "Bietschimeile" digital stamp card, accessible via the path-icon bubble (top-right of map). Logic in `bietschimeile.js`.
- `404.html` — the QR-code scan landing page (GitHub Pages 404-fallback trick). See "Bietschimeile stamp card" below — not linked from anywhere in the UI, only reached via a printed QR code.
- `lineup.html` — stage lineup with a live "Jetzt live" / "als Nächstes" highlight, accessible from the stage marker popup on the map. Page rendering in `lineup.js`; acts with an `image` show a poster thumbnail and open the poster full-screen on tap (reuses the `.card-overlay` styles from `style.css`).
- `lineup-data.js` — shared lineup helpers/constants (`LINEUP_IMG_DIR`, `resolveLineupImage`, "now playing" logic: `getLiveAct`, `isLive`, `getNow`, `nextIndex`, `toMin`). Loaded by both `lineup.html` and `index.html`. The `LINEUP` array itself is fetched from Firestore at runtime (see below) — this file no longer hardcodes it. Live state is matched by weekday (Fr=5/Sa=6) + time, so it works regardless of year. Contains a `TEST_NOW` override for off-festival testing (set to `null` for production).
- `index.html` shows a fixed "Jetzt live" banner at the top while a band plays (driven by `lineup-data.js`); when visible it pushes the right-side floating buttons down by `--banner-h`.

## Bietschimeile stamp card

- A digital stamp card for visiting every bar. State lives in `localStorage` — collected stamps under key `bietschimeile.stamps`, whether the drink reward was redeemed under `bietschimeile.redeemed` — per-device, no backend, intentionally cheatable (festival fun feature).
- **Bars are data-driven, not a separate list**: `bietschimeile.js`'s `bootstrapData()` computes `BARS = LOCATIONS.filter(l => l.type === "bar")` after the Firestore fetch, sorted by an optional `order` field (set via the admin Karte tab; entries without it sort alphabetically after any explicitly ordered ones). A bar gets a stamp slot + QR code automatically the moment it's added in the admin tool — no separate array to keep in sync. The stamp id **is** the bar's Firestore `location` doc id (used identically for the QR-code URL, the `localStorage` entry, and the map's stamp-collected check) — one unified id space, replacing the old `BARS`/`BAR_NAME_TO_STAMP` slug system.
- **Collecting a stamp (QR flow)**: each bar's QR code (admin "QR-Codes" tab, `admin/tabs/qrcodes.js`) encodes `https://raglet.github.io/Bietschicheer/bar-<id>`. GitHub Pages has no server-side routing, so this relies on the standard custom-`404.html` trick: **`404.html`** (repo root) is served by Pages for any path with no matching file, with the real requested URL still shown in the browser; it extracts the trailing `bar-<id>` segment, writes the stamp to `localStorage` (no Firebase dependency — kept fast/offline-safe), then redirects straight to `index.html?bar=<id>` — reusing the map's existing `?bar=` deep link (`script.js`), which pans to that marker and opens its card/InfoWindow, now showing "✓ Stempel gesammelt" since the stamp was just saved.
- Completing the card shows `#doneBanner`, which opens a reward modal (`.reward-modal*` in `bietschimeile.html`, replacing the old "Geile Laffer!" trophy screen) offering a free drink at the Bietschicheer bar; **"Getränk einlösen"** is meant to be pressed by bar staff, not the customer. Pressing it sets `bietschimeile.redeemed` and permanently swaps the whole stamp-card UI (progress + grid) for a small thank-you block (`#redeemedState`) on every future visit — by design, there's no in-UI way back (clearing `localStorage` would reset it, but regular users won't know to).
- First visit shows a tutorial overlay: a mini Google Map that animates an arrow along the (now data-driven) `BARS` route. Shown once (localStorage key `bietschimeile.tutorialSeen`); the header "?" button replays it. The Maps API is lazy-loaded only when the tutorial opens (`loadGoogleMaps()` in `bietschimeile.js`).
- The map (`index.html`) reflects collected stamps: clicking a bar marker appends a "✓ Stempel gesammelt" badge to the bottom of its InfoWindow if that bar's stamp is collected, checked directly via the marker's own Firestore id (`locationToMarker()`/`createMarkers()` in `script.js` — no separate name→id mapping).

## Guest counter (Gästezähler)

- **`counter/index.html`** + **`counter/counter.js`** — a hidden, unlinked page for entry staff to count guests: big live total, `+1` / `+3` / `+5` / `+10` buttons and a `−1`/`−3`/`−5`/`−10` correction row. Staff reach it only via the short URL `…/counter` (a folder with `index.html`, so GitHub Pages serves `/counter` → `/counter/`; copyable in the admin "Gäste" tab). Asset/script paths inside are `../`-relative.
- **Data model — named day counters, manually switched**: `counter/{secret}` (the parent doc, just a password anchor) holds a **`days/` subcollection** — one doc per named sub-counter (e.g. "Fritag"/"Samstag"): `{ name, active, count, hours, created }`. Exactly one day is `active` at a time, toggled **manually** in the admin "Gäste" tab — deliberately never by the clock, because the festival runs past midnight ("Freitag" ends when an admin says so). Staff taps go to the active day; with no active day the staff page disables its buttons and shows a hint. Taps use `FieldValue.increment()` (atomic — several staff phones never lose a tap) and every phone shows the active day's name + count live via an `onSnapshot` on `days/`.
- **Hourly breakdown**: every tap also increments a per-hour bucket in the day doc's `hours` map (`{"YYYY-MM-DD_HH": n}`, phone-local time, keys sort chronologically as strings — `hourKey()` in `counter/counter.js`). The admin tab's bar-chart button shows it per day as "Gäste pro Stunde" (net incl. corrections); a day's "Zurücksetzen" zeroes `count` and `FieldValue.delete()`s `hours`.
- **The password is the parent doc ID** — it appears nowhere in code, rules, or repo. `firestore.rules`: `get` on `counter/{secret}` and read/update under its `days/` need the exact ID; `list` of the counter collection and all create/delete are admin-only; public day updates may only change `count`/`hours` (enforced via `diff().affectedKeys()` — `name`/`active` are untouchable, count int ≥ 0; `counter.js` clamps corrections so no day goes below 0). Wrong password on the page = `get` returns a non-existent doc (the days listener alone can't tell wrong password from "no days yet" — both are an empty list — hence the background parent re-check on boot). Changing the password = one batch moving the parent + all day docs to the new ID; staff phones with the old password fall back to the login screen.
- The entered password is cached per device in localStorage key `counter.pw` (staff type it once); the header logout button clears it.
- Admin **"Gäste" tab** (`admin/tabs/counter.js`): per counter a password header row (live total over all days, change password, delete) plus its day rows (live count, Aktivieren/Deaktivieren, per-day hourly chart, reset, delete, add day). Normally one counter (password) exists; more are possible and listed as extra sections.

## Fotowand (guest photo sharing)

- The guests' photo-sharing app is **external** (Crowpyx, e.g. `https://app.crowpyx.com/join/<code>`; it sends `X-Frame-Options: DENY`, so embedding is impossible by design) — the map page promotes it as its own "Fotowand" feature and links out.
- The link lives in Firestore doc **`config/fotowand`** `{ url }` (rules: `config/*` public read, admin write), fetched in `bootstrapData()` via `Fb.fetchFotowand()` (swallows all errors → never blocks the map). **Empty/missing url = the whole feature is hidden** — that's the on/off switch, editable in the admin "Fotowand" tab (`admin/tabs/fotowand.js`).
- UI on `index.html` (`initFotowand()` in `script.js`, styles `.fotowand-*` in `style.css`): a bottom promo bar (centered pill at `bottom: 34px`, deliberately not full-width so Google's map attribution stays visible) and a camera FAB in the right-hand button stack. Both open a small branded intro modal whose "Los geht's!" button opens the album in a new tab. The bar's × swaps it for the FAB only for the current page view — deliberately not persisted, so the bar reappears on every reload as the feature's promotion.

## Map markers (LOCATIONS)

- Participant markers (bars, food, Programm, custom) are data-driven from `window.LOCATIONS` — fetched from Firestore at runtime (see "Data & admin" below), split out of the single `location` collection via `MARKER_TYPES` in **`locations-data.js`**. Each entry: `name`, `lat`, `lng`, `type` (`bar`/`food`/`programm`/`restaurant`/`custom` → icon via `TYPE_ICONS`), and optional `image`, `badge`, `by`, `getraenke`, `musik`, `essen`, `special`, `description`, `logoStyle`, `order` (Bietschimeile route sort, bars only).
- **`displayMode`** — `"image"` | `"none"` | `"custom"` — explicitly controls what tapping the marker does; set per-entry in the admin Karte tab ("Klick-Verhalten"). Missing on a doc (shouldn't happen after the one-time migration, but legacy/imported data might) → `inferDisplayMode()` (duplicated identically in `script.js` and `admin/tabs/map.js` — keep both in sync) falls back to: `card` set → `"image"`; any of `badge`/`content`/`subtitle`/`link`/`html`/`getraenke`/`musik`/`essen`/`special`/`description` set → `"custom"`; else → `"none"`.
  - `"image"`: tapping opens the designed `card` (optional URL, built from `CARD_DIR` in `locations-data.js`, a 1080×1350 PNG on Firebase Storage) full-screen in `#cardOverlay` (`openCard()`/`closeCard()` in `script.js`, markup in `index.html`, styles `.card-overlay*` in `style.css`); the "✓ Stempel gesammelt" chip is shown under the card for bars. No `card` set → same as `"none"`.
  - `"none"`: icon only, no popup, no click listener at all (e.g. WC/Sanität/Parkplatz by default).
  - `"custom"`: tapping opens a popup built by `buildCustomPinContent()` (`script.js`) — logo(s)+`logoStyle`, `getraenke`/`musik`/`essen`/`special` (bars/food), `subtitle`/`link: {text, href}`/`html` (infra, e.g. Bühne's "zur Lineup" button or a train/bus timetable), and the generic `content` field (see below). `displayTitle`/`displayContent` (booleans, default `true` when absent) individually show/hide the badge/title and the `content` block.
- **`content`** — string, only rendered when `displayMode` is `"custom"` and `displayContent` isn't `false`. Small authoring syntax via `renderContent()` (`script.js`): `**bold**` inline, lines starting with `"- "` become a bullet list. This replaced the old bar/food/programm-only `nachmittag` field (migrated once via `scripts/migrate-location-schema.js`, not part of the running site).
- Restaurants (e.g. Rilke) are `location` documents with `type: "restaurant"`.
- **`type: "custom"`** — a fully generic pin: `iconName` is a Material Symbols Outlined ligature name (e.g. `celebration`), rasterized onto the marker via `<canvas>` at runtime (`buildCustomIcon()`/`buildCustomIcons()` in `script.js`, pre-generated into `window.CUSTOM_ICONS` inside `bootstrapData()` before `initMap()` runs — a live font glyph can't be used directly as a Maps marker `icon`, which must be a static image URL; an SVG-data-URI approach like `ICON_PATH_DATA`'s baked paths doesn't work either, since that rendering context has no access to the page's loaded web fonts). Needs the `Material Symbols Outlined` Google Font, loaded in `index.html` and `admin/index.html` (the latter for the admin form's live icon-name preview).
- Infrastructure markers (stage, WC, Sanität, parking, info, ATM, bus/train) are the other split of `window.INFRASTRUCTURE` from the same `location` collection (`MARKER_TYPES[type].kind === "infra"`), icon via `INFRA_ICONS` in `script.js`, and go through the exact same `displayMode` system above (`infraToMarker()`/`createMarkers()` in `script.js`) — they stay visible at every zoom level and are not part of the stamp card, but otherwise behave identically (a WC defaults to `"none"`, Bühne/Info/ATM/Bus/Zug default to `"custom"`).
- Map start position + zoom: the `center` / `zoom` options in `initMap` (`script.js`).

## Data & admin (Firebase)

- All festival content is stored in **Firestore** (project `bietschicheer-39d5f`), fetched fresh on every page load — there is no build step and no caching layer, so a change is live for a visitor on their next page load/refresh.
  - `lineup` collection — one document per lineup act (was the `LINEUP` array). Fields: `weekday`, `day`, `start`, `end`, `act`, optional `image`.
  - `location` collection — one document per map point, **both** `LOCATIONS` and `INFRASTRUCTURE` together (was two separate arrays; `MARKER_TYPES` in `locations-data.js` says which `type` belongs to which "kind"). Same fields as before per entry.
  - `admins` collection — the admin-login allowlist, doc ID = email, `{ email, fixed }`. Purely authorization — see below.
- `firebase-init.js` (repo root) is the shared bridge: initializes the Firebase compat SDK and exposes `window.Fb` (`db`, `auth`, `googleProvider`, `fetchLocationsSplit()`, `fetchLineup()`, `fetchAdmins()`, plus `hideLoadingOverlay()`/`showLoadingError()` for the `#loadingOverlay` spinner every public page shows while its fetch is in flight). Loaded via the classic (non-module) `firebase-*-compat.js` CDN scripts, **not** the modular ESM SDK — mixing `type="module"` with this site's plain blocking `<script>` tags would run it in the wrong order (module scripts are deferred).
- `index.html`/`script.js`: the Google Maps API script is no longer statically included — it's injected dynamically (`loadGoogleMapsScript()` in `script.js`) only after `window.Fb.fetchLocationsSplit()`/`fetchLineup()` resolve, so `initMap()`'s `callback=initMap` still fires with real data already in `window.LOCATIONS`/`INFRASTRUCTURE`/`LINEUP`.
- **Admin tool** (`admin/index.html`, reachable at the short URL `…/admin` — folder-index trick, same as `counter/`; renamed from `admin/admin.html`) edits Firestore directly — writes are live immediately, no export/copy/paste/commit step (that workflow from an earlier iteration is gone). Login is **Firebase Auth Google Sign-In**, not a password: after sign-in, the tool checks the `admins` collection for a doc matching the signed-in email (`AdminCore.checkAdminAccess`); if absent, it signs the account back out. There is no app-managed password anywhere in this tool anymore.
  - `admin-core.js` — Firestore CRUD wrappers (`getAllDocs`/`addDoc`/`setDoc`/`updateDoc`/`deleteDoc`, all funnelled through `sanitizeWrite()` which strips `undefined` fields Firestore would reject and a stray `id` key), the tab registry, shared DOM helpers (`el`/`button`/`iconButton`/`field`/`textInput`/`checkbox`), and shared modal/toast helpers.
  - `admin/tabs/concerts.js` edits `lineup`, `admin/tabs/map.js` edits `location` (the Bühne/`type: "stage"` entry can't be deleted, enforced both in the UI and in `firestore.rules`; "Klick-Verhalten" + the Custom-Pin/Material-Symbols-icon fields described above live here), `admin/tabs/admins.js` edits the `admins` allowlist (no password fields — just email + whether it's one of the 4 fixed/permanent accounts), `admin/tabs/qrcodes.js` lists every `type: "bar"` entry's stamp QR code (copy URL/QR image, download a branded A4 PDF per bar or all at once — via the CDN libraries `qrcodejs`/`jsPDF` added in `admin/index.html`).
- `firestore.rules` (repo root) — public read on `lineup`/`location`, writes restricted to signed-in emails present in `admins`; deploy with `firebase deploy --only firestore:rules --project bietschicheer-39d5f` after editing.
- `scripts/seed-firestore.js` — one-off `firebase-admin` script that seeded the 3 collections from the original hardcoded arrays. Not part of the running site; only needed again for a from-scratch Firestore reset.
- `scripts/migrate-location-schema.js` — one-off script that backfilled `displayMode` and converted `nachmittag`→`content` on every `location` doc when that system was introduced. Also not part of the running site; only needed again if a from-scratch reset re-seeds pre-`displayMode` data.

## Where to edit content

- Bars/food/Programm/infrastructure/custom pins on the map → the `location` collection in Firestore, via the admin tool's "Karte" tab (or directly in the Firebase Console). Includes "Klick-Verhalten" (Bild/Nichts/Custom Pin anzeigen) and, for Custom Pin, title/logo-style/content toggles.
- Stamp-card bars → automatic, any `location` entry with `type: "bar"`; only the optional Bietschimeile route `order` is separately editable (same "Karte" tab).
- Bar QR codes (copy URL/image, download PDF) → the admin tool's "QR-Codes" tab.
- Stage lineup + set times → the `lineup` collection in Firestore, via the admin tool's "Konzerte" tab.
- Admin allowlist → the `admins` collection in Firestore, via the admin tool's "Admins" tab.
- Fotowand link (Crowpyx photo sharing) → `config/fotowand` in Firestore, via the admin tool's "Fotowand" tab; empty = feature hidden on the map.
- Brand colours → `:root` variables in `style.css` (and the `C` object in `locations-data.js` for the Google Maps style).
- `TEST_NOW` in `lineup-data.js` must be `null` in production.

## Assets & folders

- `icons/` — marker icons and UI SVGs (`bar.svg`, `food.svg`, `nachmittag.svg`, `restaurant.svg`, `parking.svg`, `sanitaer.svg`, `sanitaet.svg`, `atm.svg`, `info.svg`, `busStop.svg`, `trainStop.svg`, `path.svg`; `stage.png` is the original of the stage glyph, which is now drawn as a vector bubble in `makeStageBubble()` in `script.js` — white glyph, `C.buehneHintergrund` background).
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
  displayMode: "image",                   // no `card` set here -> degrades to no popup
}
```

## Example custom-pin entry

```js
{
  name: "Chindergarte-Spili", lat: 46.31160, lng: 7.79980, type: "custom",
  iconName: "celebration",                // Material Symbols Outlined ligature name
  displayMode: "custom",
  displayTitle: true, badge: "Chindergarte-Spili",
  displayContent: true,
  content: "**Ab 14 Uhr geöffnet**\n- Hüpfburg\n- Kinderschminken",
}
```

## Running & deployment

- No build step. Open `index.html` directly, or serve the folder (e.g. `python -m http.server`) for local testing — Firestore reads work fine over `file://`/`http://localhost`, but Google Sign-In (`admin/index.html`) needs the origin listed under Firebase Console → Authentication → Settings → Authorized domains (`localhost` is allowed by default).
- Deployed as static files on GitHub Pages. Geolocation ("Du bist hier") and QR scanning need HTTPS, which Pages provides; they won't prompt on `file://`. The deployed domain must also be added to Firebase's Authorized domains, or Google Sign-In will fail there.
- The Google Maps API key is inline in `index.html` (`maps.googleapis.com/...&key=`) and in `bietschimeile.js`.
- The Firebase config (project `bietschicheer-39d5f`) is inline in `firebase-init.js` — it's a public client key by design (Firestore/Auth access control is enforced by `firestore.rules` + the `admins` allowlist, not by hiding this config).

## UI Conventions

- Floating action buttons (top-right): 48×48px white circles, `box-shadow: 0 2px 6px rgba(0,0,0,0.3)`, `border-radius: 50%`
- Icons: Material Icons (`<span class="material-icons">`) or SVGs from `icons/`
- Shared styles live in `style.css`; page-specific styles go in a `<style>` block in that page's `<head>`