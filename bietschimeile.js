// Bietschimeile – digital stamp card
// State is stored client-side in localStorage (per device, no backend).

// Every LOCATIONS entry with type "bar" gets a stamp slot + QR code
// automatically (see admin/tabs/qrcodes.js) – populated after the Firestore
// fetch in bootstrapData(). Sorted by an optional `order` field (set via the
// admin Karte tab), falling back to alphabetical for entries without one.
let BARS = [];

function sortBars(list) {
  return list.slice().sort((a, b) => {
    const ao = a.order ?? Infinity;
    const bo = b.order ?? Infinity;
    return ao - bo || a.name.localeCompare(b.name);
  });
}

// Logo for a stamp = the (first) `image` of the bar's own LOCATIONS entry.
// resolveLogo() (locations-data.js) applies the same resolution rule as the map.
function barLogo(bar) {
  const image = [].concat(bar.image || [])[0];
  return image ? resolveLogo(image) : null;
}

const STORAGE_KEY = "bietschimeile.stamps";
const REDEEMED_KEY = "bietschimeile.redeemed";
// Set once the "all stamps collected" event has been reported to the admin
// tracker (stampstats/_completed) – so it counts each device only once.
const COMPLETED_REPORTED_KEY = "bietschimeile.completedReported";

// Admin tracker (admin "Stempel" tab): queue an event and report it right
// away; never awaited, never fatal (see flushPendingScans in firebase-init.js).
function reportStampEvent(id) {
  try {
    window.Fb.queueScanEvent(id);
    window.Fb.flushPendingScans().catch(() => {});
  } catch {
    /* tracking is best-effort */
  }
}

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

function render(stamps) {
  const grid = document.getElementById("stampGrid");
  grid.innerHTML = "";

  BARS.forEach((bar, index) => {
    const collected = stamps.includes(bar.id);
    const card = document.createElement("div");
    card.className = "stamp" + (collected ? " stamp--collected" : "");

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
               barLogo(bar)
                 ? `<img class="stamp__logo" src="${encodeURI(barLogo(bar))}" alt="${bar.name}" />`
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

  const complete = total > 0 && count === total;
  document.getElementById("doneBanner").hidden = !complete;
  if (complete && !localStorage.getItem(COMPLETED_REPORTED_KEY)) {
    localStorage.setItem(COMPLETED_REPORTED_KEY, "1");
    reportStampEvent(window.Fb.STAMP_EVENT_COMPLETED);
  }
  return complete;
}

// ---------------------------------------------------------------------------
// Drink-redemption reward modal (replaces the old "Geile Laffer!" trophy
// screen). Opened repeatably from #doneBanner; only "Getränk einlösen"
// (pressed by bar staff) permanently marks the card redeemed.
// ---------------------------------------------------------------------------
function openRewardModal() {
  document.getElementById("rewardModal").classList.add("reward-modal--visible");
}
function closeRewardModal() {
  document.getElementById("rewardModal").classList.remove("reward-modal--visible");
}

function isRedeemed() {
  return !!localStorage.getItem(REDEEMED_KEY);
}

// Once redeemed, the stamp card (progress + grid) is gone for good on this
// device – replaced by a small thank-you block. Toggled via inline styles,
// not the `hidden` attribute, since `.content`/`.redeemed-state` don't need
// a `[hidden]` CSS guard this way.
function showRedeemedState() {
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("redeemedState").style.display = "flex";
  document.getElementById("tutorialOpen").style.display = "none";
}

function redeemDrink() {
  localStorage.setItem(REDEEMED_KEY, "1");
  reportStampEvent(window.Fb.STAMP_EVENT_REDEEMED);
  closeRewardModal();
  showRedeemedState();
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

// Route points in the recommended (BARS) order.
function routeLatLngs() {
  return BARS.map((bar) => new google.maps.LatLng(bar.lat, bar.lng));
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

async function bootstrapData() {
  try {
    // Retry any scan/event still queued from an earlier, failed report.
    window.Fb.flushPendingScans().catch(() => {});

    if (isRedeemed()) {
      showRedeemedState();
      window.Fb.hideLoadingOverlay();
      return;
    }

    const { LOCATIONS: locs } = await window.Fb.fetchLocationsSplit();
    window.LOCATIONS = locs;
    BARS = sortBars(locs.filter((l) => l.type === "bar"));
    window.Fb.hideLoadingOverlay();

    const stamps = loadStamps();
    render(stamps);

    document.getElementById("doneBanner").addEventListener("click", openRewardModal);
    document.getElementById("rewardModalClose").addEventListener("click", closeRewardModal);
    document.getElementById("redeemButton").addEventListener("click", redeemDrink);

    // Tutorial: replay button + auto-show on first visit.
    document.getElementById("tutorialOpen").addEventListener("click", openTutorial);
    document.getElementById("tutorialClose").addEventListener("click", closeTutorial);
    if (!localStorage.getItem(TUTORIAL_KEY)) {
      openTutorial();
    }
  } catch (err) {
    console.error("Datenladung fehlgeschlagen:", err);
    window.Fb.showLoadingError(bootstrapData);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bootstrapData();
});
