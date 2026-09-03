// Shared stage lineup data + "now playing" logic.
// Used by lineup.html (full page) and index.html (live banner on the map).
// "Live" is matched by weekday (Fr/Sa) + time, so it works regardless of year.
// weekday: 5 = Friday, 6 = Saturday (Date.getDay()).

// ⚠️ TEST OVERRIDE – forces "now" so the live highlight can be tested off-festival.
// PRODUCTION: keep this null (uses the real clock).
// TO TEST: set a date matching a slot below, e.g.
//   const TEST_NOW = new Date("2026-06-26T19:30:00"); // Friday 19:30 → OrzBuzz live
const TEST_NOW = null;

// Base URL of the band posters (Firebase storage); `image` is optional per
// act – a filename (+ optional query string) resolved against LINEUP_IMG_DIR,
// same rule as `image`/`card` in locations-data.js (a value containing "://"
// is used as-is). Resolve with resolveLineupImage().
const LINEUP_IMG_DIR = "https://firebasestorage.googleapis.com/v0/b/jakobloehrer-portfolio.firebasestorage.app/o/projects%2Fbietschicheer%2Flinup%2F";

function resolveLineupImage(image) {
  return image.includes("://") ? image : LINEUP_IMG_DIR + image;
}

// LINEUP used to be hardcoded here. It now lives in the Firestore "lineup"
// collection (one document per act) and is fetched at runtime via
// window.Fb.fetchLineup() (firebase-init.js), which also sorts it into
// chronological (weekday, then start time) order. Edit the data through the
// admin tool (admin/index.html).

function getNow() {
  return TEST_NOW || new Date();
}

function toMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// Returns [startMin, endMin]; endMin > 1440 means the slot crosses midnight.
function slotMinutes(item) {
  let s = toMin(item.start);
  let e = toMin(item.end);
  if (e <= s) e += 1440; // e.g. 23:00 -> 00:30
  return [s, e];
}

function isLive(item, now) {
  const wd = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const [s, e] = slotMinutes(item);

  // Same-day portion (up to midnight)
  if (wd === item.weekday && nowMin >= s && nowMin < Math.min(e, 1440)) return true;

  // Carry-over into the following day (for past-midnight slots)
  if (e > 1440 && wd === (item.weekday + 1) % 7 && nowMin < e - 1440) return true;

  return false;
}

// The act currently playing, or null.
function getLiveAct(now) {
  return LINEUP.find((item) => isLive(item, now)) || null;
}

// Index of the next upcoming act on today's festival day (or -1).
function nextIndex(now) {
  const wd = now.getDay();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let best = -1;
  let bestStart = Infinity;
  LINEUP.forEach((item, i) => {
    if (item.weekday !== wd) return;
    const s = toMin(item.start);
    if (s > nowMin && s < bestStart) {
      bestStart = s;
      best = i;
    }
  });
  return best;
}
