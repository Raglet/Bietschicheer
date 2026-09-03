// ============================================================================
//  Shared location data – used by the map (script.js) and the Bietschimeile
//  tutorial (bietschimeile.js).
//
//  LOCATIONS/INFRASTRUCTURE themselves are no longer hardcoded here – they
//  live in the Firestore "location" collection (one document per point,
//  fetched via window.Fb.fetchLocationsSplit() in firebase-init.js) and are
//  edited through the admin tool (admin/index.html). This file only keeps
//  the shared constants/helpers every page needs synchronously.
// ----------------------------------------------------------------------------
//  Fields per "location" document:
//    name        marker title (also used for the stamp-card match)
//    lat, lng    coordinates
//    type        see MARKER_TYPES below -> marker icon + location/infra kind
//    image       logo filename (resolved from images/mitwirkende_logos_26/).
//                A value containing "/" (e.g. "logos/foo.png") is taken from
//                images/ directly. Can be an array for several logos. Optional.
//    badge       text shown in the purple name badge. Optional.
//    by          "by …" subtitle. Optional.
//    getraenke   string or array (array -> bullet list). Optional.
//    musik       string or array (array -> bullet list). Optional.
//    essen       string or array (array -> bullet list). Optional.
//    special     string or array (array -> bullet list), e.g. Darts, Bierpong. Optional.
//    description free text paragraph. Optional.
//    logoStyle   extra inline CSS for the logo(s), e.g. "height: 30px". Optional.
//    order       number, bar-type entries only – Bietschimeile stamp-grid /
//                tutorial-route sort order. Entries without it sort after,
//                alphabetically by name. Optional.
//    card        Filename (+ optional query string) of the designed info card
//                (1080x1350 PNG), resolved against CARD_DIR – same rule as
//                `image` (a value containing "://" is used as-is). Used when
//                displayMode is "image". Resolve with resolveCard().
//    subtitle, link{text,href}, html   infrastructure-only fields (Bühne,
//                WC, Sanität, Parkplatz, Info, Bankomat, Bus/Zug), still
//                shown (alongside `content`) whenever displayMode is "custom".
//    displayMode  "image" | "none" | "custom" – what tapping the marker does:
//                open the `card` full-screen, do nothing (icon only), or open
//                a popup built from badge/logo/content/(getraenke etc.)/
//                subtitle/link/html. Missing on legacy docs -> script.js
//                infers it the same way the admin form does (card set ->
//                "image"; any content-ish field set -> "custom"; else "none").
//    displayTitle, displayContent   booleans, only meaningful when
//                displayMode is "custom" – show/hide the badge/title and the
//                `content` block respectively. Default true when absent.
//    content     string, only rendered when displayMode is "custom" and
//                displayContent isn't false. Small syntax: "**bold**" inline,
//                lines starting with "- " become a bullet list. Replaces the
//                old bar/food/programm-only `nachmittag` field.
//    iconName    Material Symbols Outlined ligature name (e.g. "celebration"),
//                type: "custom" only – rendered onto the marker at runtime
//                (see buildCustomIcon() in script.js) since it can't be one
//                of the pre-baked icons in ICON_PATH_DATA.
// ============================================================================
const LOGO_DIR = "images/mitwirkende_logos_26/";
// Base URL of the designed info cards (Firebase storage).
const CARD_DIR = "https://firebasestorage.googleapis.com/v0/b/jakobloehrer-portfolio.firebasestorage.app/o/projects%2Fbietschicheer%2Fvereine%2F";

const TYPE_ICONS = {
  bar: "icons/bar.svg",
  food: "icons/food.svg",
  programm: "icons/nachmittag.svg",
  restaurant: "icons/restaurant.svg",
};

// Single source of truth for every possible `type` value of a "location"
// Firestore document: German label + emoji (used by the admin tool's "Typ"
// dropdown) and `kind` ("location" vs "infra"), which is how the public
// pages split the one Firestore collection back into LOCATIONS/INFRASTRUCTURE
// (see window.Fb.fetchLocationsSplit() in firebase-init.js).
const MARKER_TYPES = {
  bar:        { name: "Bar",                emoji: "🍺", kind: "location" },
  food:       { name: "Essensstand",         emoji: "🍔", kind: "location" },
  programm:   { name: "Nachmittagsprogramm", emoji: "🎈", kind: "location" },
  restaurant: { name: "Restaurant",          emoji: "🍽️", kind: "location" },
  stage:      { name: "Bühne",               emoji: "🎤", kind: "infra" },
  wc:         { name: "WC",                  emoji: "🚻", kind: "infra" },
  sanitaet:   { name: "Sanität",             emoji: "⛑️", kind: "infra" },
  parking:    { name: "Parkplatz",           emoji: "🅿️", kind: "infra" },
  info:       { name: "Info",                emoji: "ℹ️", kind: "infra" },
  atm:        { name: "Bankomat",            emoji: "🏧", kind: "infra" },
  bus:        { name: "Bus",                 emoji: "🚌", kind: "infra" },
  train:      { name: "Zug / Bahnhof",       emoji: "🚆", kind: "infra" },
  custom:     { name: "Benutzerdefiniert",   emoji: "📍", kind: "location" },
};

// Resolve a logo value: a plain filename comes from LOGO_DIR; a value with a
// slash is taken from images/ directly (for the older images/logos/ files).
// Shared by the map (script.js), the stamp card (bietschimeile.js) and the
// admin tool.
function resolveLogo(image) {
  return image.includes("/") ? "images/" + image : LOGO_DIR + image;
}

// Resolve a `card` value against CARD_DIR (a full URL is used as-is).
function resolveCard(card) {
  return card.includes("://") ? card : CARD_DIR + card;
}

// LOCATIONS + INFRASTRUCTURE used to be hardcoded here. They now live in
// the Firestore "location" collection (one document per point) and are
// fetched at runtime via window.Fb.fetchLocationsSplit() (firebase-init.js),
// which splits the collection back into these two names using MARKER_TYPES
// above. Edit the data through the admin tool (admin/index.html).


// Brand colours for Google Maps JS styling (CSS variables can't be used here).
const C = {
  primärHell:         "#996f91",
  primärDunkel:       "#663f5e",
  hintergrundDunkel:  "#404040",
  hintergrundHell:    "#a5a5a5",
  hintergrundNeutral: "#e1e1e1",
  sekundärHell:       "#4384a2",
  sekundärDunkel:     "#364954",
  buehneHintergrund:  "#4a4185", // Bühne-marker background (script.js: makeStageBubble)
};

// Shared Google Maps style – used by the main map (script.js) and the
// Bietschimeile tutorial map (bietschimeile.js).
const MAP_STYLE = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },

  // Land & buildings
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: C.hintergrundNeutral }] },
  { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: C.hintergrundNeutral }] },
  { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: C.primärDunkel }] },

  // Water
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: C.sekundärHell }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: C.sekundärDunkel }] },

  // Roads
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: C.primärHell }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: C.hintergrundHell }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: C.hintergrundNeutral }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },

  // Administrative labels
  { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: C.primärDunkel }] },
  { featureType: "administrative", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
];
