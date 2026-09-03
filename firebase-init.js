// ============================================================================
//  Firebase bridge – shared by the public pages (index.html, lineup.html,
//  bietschimeile.html) and the admin tool (admin/index.html).
//
//  Loaded as a classic (non-module) script, right after the 3 Firebase
//  "compat" CDN scripts (firebase-app-compat.js / firestore-compat.js /
//  auth-compat.js) and after locations-data.js (needs MARKER_TYPES). Exposes
//  everything the rest of the site needs as window.Fb, so script.js/lineup.js
//  /bietschimeile.js/admin/*.js can all stay plain classic scripts instead of
//  becoming ES modules (which would run in the wrong order relative to them –
//  see the migration plan for why).
// ============================================================================

var firebaseConfig = {
  apiKey: "AIzaSyCqFuiJ3p4Qs7Q0ZZX9gj9ozB01QoRPcUI",
  authDomain: "bietschicheer-39d5f.firebaseapp.com",
  projectId: "bietschicheer-39d5f",
  storageBucket: "bietschicheer-39d5f.firebasestorage.app",
  messagingSenderId: "561682032609",
  appId: "1:561682032609:web:b921d5a87c19ee96add4a0",
  measurementId: "G-0E1PGE2P1Y",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();
var googleProvider = new firebase.auth.GoogleAuthProvider();

// ---- Reads (public pages + admin) ------------------------------------------

// Fetches the "location" collection (bars/food/programm/restaurant AND
// stage/wc/sanitaet/parking/info/atm/bus/train in one collection – see
// MARKER_TYPES in locations-data.js) and splits it back into the
// LOCATIONS/INFRASTRUCTURE shape the rest of the site already expects.
async function fetchLocationsSplit() {
  const snap = await db.collection("location").get();
  const all = snap.docs.map((d) => Object.assign({}, d.data(), { id: d.id }));
  const LOCATIONS = all.filter((x) => (MARKER_TYPES[x.type] || {}).kind === "location");
  const INFRASTRUCTURE = all.filter((x) => (MARKER_TYPES[x.type] || {}).kind === "infra");
  return { LOCATIONS, INFRASTRUCTURE };
}

// Fetches the "lineup" collection, sorted chronologically (weekday, then
// start time) – lineup.html/the admin tool rely on that order.
async function fetchLineup() {
  const snap = await db.collection("lineup").get();
  const list = snap.docs.map((d) => Object.assign({}, d.data(), { id: d.id }));
  list.sort((a, b) => a.weekday - b.weekday || toMin(a.start) - toMin(b.start));
  return list;
}

// Fetches the Fotowand config (config/fotowand: { url } – the guest
// photo-sharing link promoted on the map, see initFotowand() in script.js).
// A missing doc, empty url, or failed read just means "feature hidden", so
// errors are swallowed – this must never block the map from loading.
async function fetchFotowand() {
  try {
    const doc = await db.collection("config").doc("fotowand").get();
    return doc.exists ? doc.data() : null;
  } catch {
    return null;
  }
}

// Fetches the "admins" collection (admin tool only).
async function fetchAdmins() {
  const snap = await db.collection("admins").get();
  return snap.docs.map((d) => Object.assign({}, d.data(), { id: d.id }));
}

// ---- Loading overlay helpers (public pages) --------------------------------
// Each of index.html/lineup.html/bietschimeile.html has a
// <div id="loadingOverlay" class="data-loading"> with a .data-loading__text
// and a hidden .data-loading__retry button (see style.css: .data-loading*).

function hideLoadingOverlay() {
  const el = document.getElementById("loadingOverlay");
  if (el) el.hidden = true;
}

function showLoadingError(retryFn) {
  const el = document.getElementById("loadingOverlay");
  if (!el) return;
  el.classList.add("data-loading--error");
  const text = el.querySelector(".data-loading__text");
  if (text) text.textContent = "Verbindung fehlgeschlagen.";
  const retry = el.querySelector(".data-loading__retry");
  if (retry) {
    retry.hidden = false;
    retry.onclick = retryFn || (() => location.reload());
  }
}

window.Fb = {
  db,
  auth,
  googleProvider,
  fetchLocationsSplit,
  fetchLineup,
  fetchFotowand,
  fetchAdmins,
  hideLoadingOverlay,
  showLoadingError,
};
