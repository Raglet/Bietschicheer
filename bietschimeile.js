// Bietschimeile – digital stamp card
// State is stored client-side in localStorage (per device, no backend).

// Recommended order = array order. Order is only a suggestion; any bar can be
// collected at any time.
// LOGO_DIR comes from locations-data.js (loaded first); don't redeclare it here.
const BARS = [
  { id: "diebar",           name: "DIE BAR",                logo: LOGO_DIR + "02_diebar.png" },
  { id: "fc-raron",         name: "FC Raron",               logo: LOGO_DIR + "04_fc_raron.png" },
  { id: "rilke",            name: "Rilke",                  logo: LOGO_DIR + "17_restaurant_rilke.jpg" },
  { id: "heidnisch",        name: "Heidnischbier",          logo: LOGO_DIR + "06_heidnisch.png" },
  { id: "ehc",              name: "EHC Raron",              logo: LOGO_DIR + "03_ehc_raron.png" },
  { id: "bietschicheer",    name: "Verein Bietschicheer",   logo: LOGO_DIR + "22_Bietschicheer.png" },
  { id: "bietschichlepfer", name: "Bietschichlepfer",       logo: LOGO_DIR + "01_Bietschichlepfer.jpg" },
  { id: "jugendverein",     name: "Jugendverein Raron",     logo: LOGO_DIR + "11_JV_raro.png" },
  { id: "proraronia",       name: "Pro Raronia Historica und Kulturstiftung", logo: LOGO_DIR + "16_Pro Raronia Historica und Kulturstiftung.jpg" },
  { id: "hockeyladies",     name: "Hockeyladies",           logo: LOGO_DIR + "07_Hockeyladies.jpeg" },
  { id: "echo-raronia",     name: "Musikgesellschaft ECHO Raronia", logo: LOGO_DIR + "14_Musikgesellschaft ECHO Raronia.png" },
  { id: "vbc-raron",        name: "VBC Raron",              logo: LOGO_DIR + "21_vbc_raron.jpg" },
  { id: "jodlerverein",     name: "Jodlerverein Raron",     logo: LOGO_DIR + "09_Jodlerverein Raron.jpg" },
  { id: "stigma",           name: "Stigma",                 logo: LOGO_DIR + "19_stigma.jpg" },
];

const STORAGE_KEY = "bietschimeile.stamps";

function loadStamps() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStamps(stamps) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps));
}

// Handle an incoming scan (?b=<id>). Returns a feedback object for the toast.
function handleScan(stamps) {
  const params = new URLSearchParams(window.location.search);
  const scanned = params.get("b");
  if (!scanned) return null;

  // Strip the query so a refresh doesn't re-process and the URL stays clean.
  history.replaceState(null, "", window.location.pathname);

  const bar = BARS.find((b) => b.id === scanned);
  if (!bar) return { type: "error", text: "Unbekannter Code." };

  if (stamps.includes(bar.id)) {
    return { type: "info", text: `${bar.name} hast du schon gesammelt.` };
  }

  stamps.push(bar.id);
  saveStamps(stamps);
  return { type: "success", text: `Stempel von ${bar.name} gesammelt!`, justId: bar.id };
}

function showToast(feedback) {
  if (!feedback) return;
  const toast = document.getElementById("toast");
  toast.textContent = feedback.text;
  toast.className = "toast toast--" + feedback.type + " toast--visible";
  setTimeout(() => {
    toast.className = "toast toast--" + feedback.type;
  }, 3200);
}

function render(stamps, justId) {
  const grid = document.getElementById("stampGrid");
  grid.innerHTML = "";

  BARS.forEach((bar, index) => {
    const collected = stamps.includes(bar.id);
    const card = document.createElement("div");
    card.className = "stamp" + (collected ? " stamp--collected" : "");
    if (bar.id === justId) card.classList.add("stamp--just");

    // Not collected yet → tapping the stamp jumps to the bar on the map.
    if (!collected) {
      card.classList.add("stamp--clickable");
      card.addEventListener("click", () => {
        window.location.href = "index.html?bar=" + encodeURIComponent(bar.id);
      });
    }

    card.innerHTML = `
      <span class="stamp__order">${index + 1}</span>
      ${
        collected
          ? `<span class="stamp__check material-icons">check_circle</span>
             ${
               bar.logo
                 ? `<img class="stamp__logo" src="${encodeURI(bar.logo)}" alt="${bar.name}" />`
                 : `<span class="stamp__placeholder material-icons">sports_bar</span>`
             }`
          : `<span class="stamp__lock material-icons">lock</span>`
      }
      <span class="stamp__name">${bar.name}</span>
    `;
    grid.appendChild(card);
  });

  // Progress
  const count = stamps.filter((id) => BARS.some((b) => b.id === id)).length;
  const total = BARS.length;
  document.getElementById("progressCount").textContent = `${count} / ${total}`;
  document.getElementById("progressFill").style.width =
    (count / total) * 100 + "%";

  const complete = count === total;
  document.getElementById("doneBanner").hidden = !complete;
  return complete;
}

function openCelebration() {
  document.getElementById("celebration").classList.add("celebration--visible");
}
function closeCelebration() {
  document.getElementById("celebration").classList.remove("celebration--visible");
}

// ---------------------------------------------------------------------------
// First-visit tutorial: a mini map that animates the recommended route.
// ---------------------------------------------------------------------------
const TUTORIAL_KEY = "bietschimeile.tutorialSeen";
const GOOGLE_MAPS_KEY = "AIzaSyCXJdwDBQfk1lCSww2v3pM9ApCxynbKMoQ";

let mapsPromise = null;

function loadGoogleMaps() {
  if (window.google && window.google.maps && window.google.maps.geometry) {
    return Promise.resolve();
  }
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src =
      "https://maps.googleapis.com/maps/api/js?key=" +
      GOOGLE_MAPS_KEY +
      "&libraries=geometry";
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return mapsPromise;
}

// Route points in the recommended (BARS) order, coords from LOCATIONS.
function routeLatLngs() {
  return BARS.map((bar) => {
    const loc = LOCATIONS.find((l) => l.name === bar.name);
    return loc ? new google.maps.LatLng(loc.lat, loc.lng) : null;
  }).filter(Boolean);
}

function buildTutorialMap() {
  const latLngs = routeLatLngs();
  if (!latLngs.length) return;

  const map = new google.maps.Map(document.getElementById("tutorialMap"), {
    disableDefaultUI: true,
    gestureHandling: "none",
    keyboardShortcuts: false,
    clickableIcons: false,
    styles: MAP_STYLE,
  });

  const bounds = new google.maps.LatLngBounds();
  latLngs.forEach((ll) => bounds.extend(ll));
  map.fitBounds(bounds, 44);

  latLngs.forEach((ll, i) => {
    new google.maps.Marker({
      position: ll,
      map,
      label: { text: String(i + 1), color: "#fff", fontSize: "12px", fontWeight: "700" },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#663f5e",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
      zIndex: 2,
    });
  });

  // 1) show the full overview, 2) zoom in to the first bar, 3) run the arrows.
  google.maps.event.addListenerOnce(map, "idle", () => {
    setTimeout(() => {
      map.setZoom(18);
      map.setCenter(latLngs[0]);
      // Wait until the zoomed-in view has rendered, then start the arrows.
      google.maps.event.addListenerOnce(map, "idle", () => {
        animateRoute(map, latLngs, true);
      });
    }, 1000);
  });
}

function animateRoute(map, latLngs, follow) {
  const line = new google.maps.Polyline({
    map,
    path: [latLngs[0]],
    strokeColor: "#4384a2",
    strokeOpacity: 0.9,
    strokeWeight: 4,
    zIndex: 1,
    icons: [
      {
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3.5,
          fillColor: "#4384a2",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 1,
        },
        offset: "100%",
      },
    ],
  });

  // Constant speed: spread a total duration across segments by their distance,
  // so the arrow moves at the same visual pace over short and long hops.
  const TOTAL_MS = 9000; // total travel time for the whole route
  const dist = google.maps.geometry.spherical;
  const segDist = latLngs
    .slice(0, -1)
    .map((ll, i) => dist.computeDistanceBetween(ll, latLngs[i + 1]));
  const totalDist = segDist.reduce((a, b) => a + b, 0) || 1;
  const segDurations = segDist.map((d) => (d / totalDist) * TOTAL_MS);

  let seg = 0;
  let segStart = null;

  function frame(ts) {
    if (seg >= latLngs.length - 1) return;
    if (segStart === null) segStart = ts;
    const t = Math.min(1, (ts - segStart) / segDurations[seg]);
    const head = google.maps.geometry.spherical.interpolate(
      latLngs[seg],
      latLngs[seg + 1],
      t
    );
    line.setPath(latLngs.slice(0, seg + 1).concat([head]));
    if (follow) map.setCenter(head); // camera follows the arrow head
    if (t >= 1) {
      seg++;
      segStart = null;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function openTutorial() {
  document.getElementById("tutorial").classList.add("tutorial--visible");
  // Build fresh each time so the route re-animates (also on replay).
  loadGoogleMaps().then(buildTutorialMap).catch(() => {});
}

function closeTutorial() {
  document.getElementById("tutorial").classList.remove("tutorial--visible");
  localStorage.setItem(TUTORIAL_KEY, "1");
}

document.addEventListener("DOMContentLoaded", () => {
  const stamps = loadStamps();
  const feedback = handleScan(stamps);
  const justId = feedback && feedback.type === "success" ? feedback.justId : null;

  const complete = render(stamps, justId);
  showToast(feedback);

  // Auto-celebrate only when this scan completed the card.
  if (complete && justId) {
    setTimeout(openCelebration, 600);
  }

  document.getElementById("doneBanner").addEventListener("click", openCelebration);
  document
    .getElementById("celebrationClose")
    .addEventListener("click", closeCelebration);

  // Tutorial: replay button + auto-show on first visit.
  document.getElementById("tutorialOpen").addEventListener("click", openTutorial);
  document.getElementById("tutorialClose").addEventListener("click", closeTutorial);
  // Auto-show on first visit, but not when the user just scanned a bar QR.
  if (!feedback && !localStorage.getItem(TUTORIAL_KEY)) {
    openTutorial();
  }
});
