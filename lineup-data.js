// Shared stage lineup data + "now playing" logic.
// Used by lineup.html (full page) and index.html (live banner on the map).
// "Live" is matched by weekday (Fr/Sa) + time, so it works regardless of year.
// weekday: 5 = Friday, 6 = Saturday (Date.getDay()).

// ⚠️ TEST OVERRIDE – forces "now" so the live highlight can be tested off-festival.
// PRODUCTION: keep this null (uses the real clock).
// TO TEST: set a date matching a slot below, e.g.
//   const TEST_NOW = new Date("2026-06-26T19:30:00"); // Friday 19:30 → OrzBuzz live
const TEST_NOW = null;

// Base URL of the band posters (Firebase storage); `image` is optional per act.
const LINEUP_IMG_DIR = "https://firebasestorage.googleapis.com/v0/b/jakobloehrer-portfolio.firebasestorage.app/o/projects%2Fbietschicheer%2Flinup%2F";

const LINEUP = [
  { weekday: 5, day: "Fritag", start: "19:00", end: "20:00", act: "OrzBuzz",
    image: LINEUP_IMG_DIR + "orzbuzz.webp?alt=media&token=a45b3190-ed99-4f30-a985-c0c1ddee0465" },
  { weekday: 5, day: "Fritag", start: "21:00", end: "22:00", act: "MÄYÄ",
    image: LINEUP_IMG_DIR + "maya.webp?alt=media&token=a38d1307-824e-45a2-9cc8-45eeaf536cbf" },
  { weekday: 5, day: "Fritag", start: "23:00", end: "00:00", act: "WE2",
    image: LINEUP_IMG_DIR + "we2.webp?alt=media&token=c1dee2ec-979c-40ce-bdab-6c78e34ac511" },
  { weekday: 6, day: "Samstag", start: "11:00", end: "14:00", act: "Bietschibotsche",
    image: LINEUP_IMG_DIR + "WhatsApp%20Image%202026-07-31%20at%2010.27.07(1).jpeg?alt=media&token=efaa406a-a2db-426d-922d-150428986a73" },
  { weekday: 6, day: "Samstag", start: "15:00", end: "16:00", act: "Mainstreet 47",
    image: LINEUP_IMG_DIR + "WhatsApp%20Image%202026-07-31%20at%2010.27.07.jpeg?alt=media&token=184af8df-600d-4abd-9be8-893d7acbfb99" },
  { weekday: 6, day: "Samstag", start: "16:30", end: "17:00", act: "Line Dance Workshop",
    image: LINEUP_IMG_DIR + "Kopie%20von%20Sponsoren%20und%20Lineup.jpg?alt=media&token=40d50b63-955f-45c0-a2ee-47951e20dc8b" },
  { weekday: 6, day: "Samstag", start: "19:00", end: "20:00", act: "Kentucky Moonshiners",
    image: LINEUP_IMG_DIR + "WhatsApp%20Image%202026-07-31%20at%2010.27.08.jpeg?alt=media&token=e2a81601-bee3-4dea-943a-fcdebb4e1e1e" },
  { weekday: 6, day: "Samstag", start: "21:00", end: "22:00", act: "Jah on Holiday",
    image: LINEUP_IMG_DIR + "WhatsApp%20Image%202026-07-31%20at%2010.27.08(1).jpeg?alt=media&token=bbd29a7a-a6d2-4f73-b643-605cf21e43a3" },
  { weekday: 6, day: "Samstag", start: "23:00", end: "00:30", act: "Chrigu Blaser",
    image: LINEUP_IMG_DIR + "WhatsApp%20Image%202026-07-31%20at%2010.27.08(2).jpeg?alt=media&token=853c5723-d3ca-4894-8273-f12c321b202c" },
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
