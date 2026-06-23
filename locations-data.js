// ============================================================================
//  Shared location data – used by the map (script.js) and the Bietschimeile
//  tutorial (bietschimeile.js).
//  LOCATIONS – edit this list to add/change bars, food stands & Programm.
// ----------------------------------------------------------------------------
//  Fields per entry:
//    name        marker title (also used for the stamp-card match)
//    lat, lng    coordinates
//    type        "bar" | "food" | "programm" | "restaurant" -> marker icon
//    image       logo filename (resolved from images/mitwirkende_logos_26/).
//                A value containing "/" (e.g. "logos/foo.png") is taken from
//                images/ directly. Can be an array for several logos. Optional.
//    badge       text shown in the purple name badge. Optional.
//    by          "by …" subtitle. Optional.
//    getraenke   string or array (array -> bullet list). Optional.
//    musik       string or array (array -> bullet list). Optional.
//    essen       string or array (array -> bullet list). Optional.
//    nachmittag  string or array (array -> bullet list). Optional.
//    description free text paragraph. Optional.
//    logoStyle   extra inline CSS for the logo(s), e.g. "height: 30px". Optional.
// ============================================================================
const LOGO_DIR = "images/mitwirkende_logos_26/";

const TYPE_ICONS = {
  bar: "icons/bar.svg",
  food: "icons/food.svg",
  programm: "icons/nachmittag.svg",
  restaurant: "icons/restaurant.svg",
};

const LOCATIONS = [
  // ---- Bars ----
  {
    name: "Bietschichlepfer", lat: 46.31151443559874, lng: 7.8001323816423875, type: "bar",
    image: "01_Bietschichlepfer.jpg", badge: "Bietschichlepfer",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
    essen: "Schnitzeltaschen",
  },
  {
    name: "DIE BAR", lat: 46.30962800155923, lng: 7.8002302321185, type: "bar",
    image: "02_diebar.png", badge: "DIE BAR",
    getraenke: "Getränke, Bier, Wein, Smirnoff, Bellini",
    essen: "Croque Monsieur",
  },
  {
    name: "EHC Raron", lat: 46.311331108691256, lng: 7.799467795611433, type: "bar",
    image: "03_ehc_raron.png", badge: "EHC Raron",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
  },
  {
    name: "FC Raron", lat: 46.31049280712476, lng: 7.79987723781509, type: "bar",
    image: "04_fc_raron.png", badge: "FC Raron",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
  },
  {
    name: "Heidnischbier", lat: 46.311346178911926, lng: 7.799897813783402, type: "bar",
    image: "06_heidnisch.png", badge: "Heidnischbier",
    getraenke: "Rarner Piär",
  },
  {
    name: "Hockeyladies", lat: 46.31146302389808, lng: 7.800450401491779, type: "bar",
    image: "07_Hockeyladies.jpeg", badge: "Hockeyladies",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
  },
  {
    name: "Jodlerverein Raron", lat: 46.31120407629646, lng: 7.80084840023755, type: "bar",
    image: "09_Jodlerverein Raron.jpg", badge: "Jodlerverein Raron",
    getraenke: "Getränke, Bier, Wein",
    essen: "Jodler Hot Dog",
  },
  {
    name: "Jugendverein Raron", lat: 46.31168736554792, lng: 7.800432357820134, type: "bar",
    image: "11_JV_raro.png", badge: "Jugendverein Raron",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
  },
  {
    name: "Musikgesellschaft ECHO Raronia", lat: 46.31144307559207, lng: 7.80069283210855, type: "bar",
    image: "14_Musikgesellschaft ECHO Raronia.png", badge: "Musikgesellschaft ECHO Raronia",
    getraenke: "Getränke, Wein, Spirituosen",
  },
  {
    name: "Pro Raronia Historica und Kulturstiftung", lat: 46.311553383839446, lng: 7.800373715850603, type: "bar",
    image: "16_Pro Raronia Historica und Kulturstiftung.jpg", badge: "Pro Raronia Historica und Kulturstiftung",
    getraenke: "Getränke, Apéro, Mineral",
    essen: "Lachsbrötli",
  },
  {
    name: "Rilke", lat: 46.3109564296631, lng: 7.800158161006201, type: "restaurant",
    image: "17_restaurant_rilke.jpg", badge: "Rilke",
    essen: "Grillade",
  },
  {
    name: "Stigma", lat: 46.31039571641613, lng: 7.801409922436901, type: "bar",
    image: "19_stigma.jpg", badge: "Stigma",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
  },
  {
    name: "VBC Raron", lat: 46.31138934715919, lng: 7.800936913138532, type: "bar",
    image: "21_vbc_raron.jpg", badge: "VBC Raron",
    getraenke: "Shots, Apéritive, Gins, Smirnoff und Bier, Getränke",
  },
  {
    name: "Verein Bietschicheer", lat: 46.31182658390863, lng: 7.79954216439577, type: "bar",
    image: "22_Bietschicheer.png", badge: "Verein Bietschicheer",
    getraenke: "Getränke, Wein, Bier, Apérol, Spirituosen",
  },

  // ---- Food ----
  {
    name: "Hope Factory", lat: 46.31114053115375, lng: 7.799983521264717, type: "food",
    image: "8_Hope_weiss.png", badge: "Hope Factory",
    essen: ["Popcorn", "Kleine Lust (Glace)"],
  },
  {
    name: "Kochende Frauen", lat: 46.31172319780942, lng: 7.800030885933981, type: "food",
    image: "12_kochende frauen.png", badge: "Kochende Frauen",
    essen: "Schübling und Salat",
  },
  {
    name: "Schaf und Meh", lat: 46.31174033496966, lng: 7.800339883958716, type: "food",
    image: "18_Wirtschaft Schaf & Meh.svg", badge: "Schaf und Meh",
    getraenke: "Getränke?",
    essen: ["Pullet Lamb Bread", "Pullet Pork Bread"],
  },
  {
    name: "Valperca", lat: 46.311956885895995, lng: 7.800001564953533, type: "food",
    image: "20_Valperca_claim.svg", badge: "Valperca",
    getraenke: "Getränke, kein Alkohol",
    essen: ["Knusperli mit Süsskartoffelpommes", "Poke Bowl"],
  },

  // ---- Nachmittagsprogramm ----
  {
    name: "Fluggruppe Oberwallis", lat: 46.31062249847992, lng: 7.8000676746626585, type: "programm",
    image: "5_flugruppe_OVS.jpg", badge: "Fluggruppe Oberwallis",
    description: "Basteln Modellflugzeuge + Hüpfburg",
  },
];

// Brand colours for Google Maps JS styling (CSS variables can't be used here).
const C = {
  primärHell:         "#996f91",
  primärDunkel:       "#663f5e",
  hintergrundDunkel:  "#404040",
  hintergrundHell:    "#a5a5a5",
  hintergrundNeutral: "#e1e1e1",
  sekundärHell:       "#4384a2",
  sekundärDunkel:     "#364954",
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
