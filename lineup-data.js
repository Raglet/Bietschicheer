// Shared stage lineup data + "now playing" logic.
// Used by lineup.html (full page) and index.html (live banner on the map).
// "Live" is matched by weekday (Fr/Sa) + time, so it works regardless of year.
// weekday: 5 = Friday, 6 = Saturday (Date.getDay()).

// ⚠️ TEST OVERRIDE – forces "now" so the live highlight can be tested off-festival.
// PRODUCTION: keep this null (uses the real clock).
// TO TEST: set a date matching a slot below, e.g.
//   const TEST_NOW = new Date("2026-06-26T19:30:00"); // Friday 19:30 → OrzBuzz live
const TEST_NOW = null;

const LINEUP = [
  { weekday: 5, day: "Fritag", start: "19:00", end: "20:00", act: "OrzBuzz" },
  { weekday: 5, day: "Fritag", start: "21:00", end: "22:00", act: "MAYA" },
  { weekday: 5, day: "Fritag", start: "23:00", end: "00:00", act: "WE2" },
  { weekday: 6, day: "Samstag", start: "12:00", end: "15:00", act: "Bietschibotsche" },
  { weekday: 6, day: "Samstag", start: "17:00", end: "18:00", act: "Mainstreet 47" },
  { weekday: 6, day: "Samstag", start: "19:00", end: "20:00", act: "The Kentucky Moonshiner" },
  { weekday: 6, day: "Samstag", start: "21:00", end: "22:00", act: "Jah on Holiday" },
  { weekday: 6, day: "Samstag", start: "23:00", end: "00:30", act: "Chrigu Blaser Guitar Explosion" },
];

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
