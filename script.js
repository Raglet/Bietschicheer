var map;
var currentInfoWindow = null;

// "Du bist hier" – live GPS tracking state
let userMarker = null;
let accuracyCircle = null;
let locationWatchId = null;

// Bietschimeile stamp card – read collected stamps so the map can reflect
// them. Stamps are stored (and QR-coded) by a location doc's own Firestore
// `id` (see bietschimeile.js / admin/tabs/qrcodes.js), so no separate
// name->id mapping table is needed here anymore.

function getCollectedStamps() {
  try {
    const raw = localStorage.getItem("bietschimeile.stamps");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Brand colours (C) and the Google Maps style (MAP_STYLE) live in
// locations-data.js (loaded first), shared with the Bietschimeile tutorial.

// LOCATIONS, LOGO_DIR and TYPE_ICONS live in locations-data.js
// (shared between the map and the Bietschimeile tutorial; loaded first).

// Bubble icons — SVG files are untouched; each icon is wrapped in a coloured
// circle at runtime via a data-URI. Content markers use primärDunkel (purple),
// infrastructure markers use sekundärDunkel (blue-grey).
const ICON_PATH_DATA = {
  bar:       'M226-108v-73h218v-228L100-781v-73h760v73L517-409v228h218v73H226Zm53-587h402l84-82H195l84 82Zm201 218 135-145H346l134 145Zm0 0Z',
  food:      'M80-558v-40q0-109 105-175.5T480-840q190 0 295 66.5T880-598v40H80Zm62-60h676q-3-69-96.5-115.5T480-780q-148 0-242.5 46.5T142-618ZM80-382v-60q33 0 57.5-22t78.5-22q54 0 71.5 22t58.5 22q41 0 60.5-22t73.5-22q54 0 73.5 22t60.5 22q41 0 58.5-22t71.5-22q54 0 78.5 22t57.5 22v60q-54 0-74.5-22T744-426q-41 0-58.5 22T614-382q-54 0-73.5-22T480-426q-41 0-60.5 22T346-382q-54 0-71.5-22T216-426q-41 0-61.357 22T80-382Zm60 262q-24 0-42-18t-18-42v-128h800v128q0 24-18 42t-42 18H140Zm0-60h680v-68H140v68Zm0-68h680-680Zm2-370h676-676Z',
  nachmittag:'m241-80 52-119q-17-12-30.5-23.5T235-248q-8 4-17.5 6t-17.5 2q-32 0-54.5-22.5T123-317q0-20 9.5-37.5T156-380q-7-25-11-50t-4-51q0-27 3.5-51.5T156-582q-14-10-23.5-26.5T123-645q0-32 22.5-54.5T200-722q8 0 17 2t17 6q35-36 76.5-60t92.5-37q5-32 26.5-50.5T480-880q29 0 51 19t26 50q51 13 96 34.5t79 59.5q7-2 14-3.5t14-1.5q32 0 54.5 22.5T837-645q0 22-9.5 38T804-582q8 26 11.5 50t3.5 51q0 26-3.5 50.5T804-381q17 11 25 29t8 35q0 32-22.5 54.5T760-240q-8 0-17.5-2t-16.5-6q-13 14-27 26t-30 23l51 119h-57l-42-92q-17 6-32 11t-32 10q-5 33-26.5 51T480-82q-29 0-50.5-18T403-151q-17-5-32.5-10T341-173l-44 93h-56Zm74-170 71-155q-14-16-21-34.5t-7-40.5q0-50 37.5-86t87.5-36q50 0 84.5 36t34.5 86q0 22-6.5 40.5T574-405l71 155q11-8 22.5-17.5T689-288q-2-6-4-13.5t-2-15.5q0-27 18-49t50-28q7-20 10.5-42t3.5-45q0-24-3.5-45.5T752-568q-30-4-49.5-26T683-645q0-9 1.5-16t4.5-15q-32-31-67-51t-79-32q-8 13-24.5 23T480-726q-22 0-38-10t-25-23q-44 12-80.5 32T271-674q4 8 5 14.5t1 14.5q0 32-20.5 52.5T209-568q-7 20-10.5 41.5T195-481q0 23 3.5 45t10.5 42q32 6 50 28t18 49q0 9-1.5 16t-3.5 12q10 11 20.5 20.5T315-250Zm45 27q12 5 26.5 10.5T417-203q11-14 26-23.5t37-9.5q22 0 38.5 9.5T543-203q17-4 30.5-9t24.5-10l-65-151q-12 8-26 11.5t-28 3.5q-14 0-28-4t-26-12l-65 151Zm120-195q26 0 44-18t18-44q0-26-18-44t-44-18q-26 0-44 18t-18 44q0 26 18 44t44 18Zm0-62Z',
  restaurant:'M285-80v-368q-52-11-88.5-52.5T160-600v-280h60v280h65v-280h60v280h65v-280h60v280q0 58-36.5 99.5T345-448v368h-60Zm415 0v-320H585v-305q0-79 48-127t127-48v800h-60Z',
  parking:   'M240-120v-720h288q98 0 165 67t67 165q0 98-67 165t-165 67H360v256H240Zm120-376h168q48 0 80-32t32-80q0-48-32-80t-80-32H360v224Z',
  sanitaer:  'M202-67v-309h-56v-230q0-31.888 23.618-55.444T224.952-685h115.332Q372-685 395.5-661.444T419-606v230h-56v309H202Zm80.08-672q-32.08 0-54.58-22.42-22.5-22.421-22.5-54.5 0-32.08 22.42-54.58 22.421-22.5 54.5-22.5 32.08 0 54.58 22.42 22.5 22.421 22.5 54.5 0 32.08-22.42 54.58-22.421 22.5-54.5 22.5ZM634-67v-248H526l88-316q8.378-25.185 29.817-39.593Q665.257-685 693.829-685q28.571 0 50.155 14.407Q765.569-656.185 774-631l88 316H755v248H634Zm60.08-672q-32.08 0-54.58-22.42-22.5-22.421-22.5-54.5 0-32.08 22.42-54.58 22.421-22.5 54.5-22.5 32.08 0 54.58 22.42 22.5 22.421 22.5 54.5 0 32.08-22.42 54.58-22.421 22.5-54.5 22.5Z',
  sanitaet:  'M137-64q-28.725 0-50.862-22.138Q64-108.275 64-137v-519q0-28.725 22.138-50.862Q108.275-729 137-729h169v-100q0-28.725 22.138-50.862Q350.275-902 379-902h202q28.725 0 50.862 22.138Q654-857.725 654-829v100h169q28.725 0 50.862 22.138Q896-684.725 896-656v519q0 28.725-22.138 50.862Q851.725-64 823-64H137Zm0-73h686v-519H137v519Zm242-592h202v-100H379v100ZM137-137v-519 519Zm307-223v120h73v-120h120v-73H517v-120h-73v120H324v73h120Z',
  busStop:   'M242-111q-14 0-24.5-8T207-139.343V-225q-29-17-41.5-47.5T153-336v-403q0-78 77-113t251-35q168 0 247 36.112Q807-814.775 807-739v403q0 33-12.5 63.5T753-225v85.657Q753-127 742.5-119t-24.5 8h-23.491Q681-111 670-119t-11-21v-53H301v53q0 13-10.925 21T265-111h-23Zm238-656h260-522 262Zm180 298H218h524-82Zm-146-65h524v-168H218v168Zm107.176 228q24.324 0 41.074-16.926Q383-339.853 383-364.176q0-24.324-16.926-41.074Q349.147-422 324.824-422q-24.324 0-41.074 16.926Q267-388.147 267-363.824q0 24.324 16.926 41.074Q300.853-306 325.176-306Zm310 0q24.324 0 41.074-16.926Q693-339.853 693-364.176q0-24.324-16.927-41.074Q659.147-422 634.824-422q-24.324 0-41.074 16.926Q577-388.147 577-363.824q0 24.324 16.927 41.074Q610.853-306 635.176-306ZM218-767h522q-25-25-94-40t-166-15q-115 0-180.5 13.5T218-767Zm82 509h360.374Q695-258 718.5-285.706q23.5-27.707 23.5-62.725V-469H218v120.784Q218-313 241.5-285.5T300-258Z',
  trainStop: 'M153-335v-385.857q0-43.143 18.81-74.502 18.811-31.36 59-51.5Q271-867 333-877t147-10q86 0 147.353 9.125 61.353 9.125 101.5 29T788-797.315q19 31.686 19 76.315v386q0 60.314-41.843 102.157Q723.314-191 663-191l61 61v22h-74l-83-83H394l-82.5 83H236v-22l61-61q-60.314 0-102.157-41.843Q153-274.686 153-335Zm327-487q-121 0-175 15t-77 44h505q-19-26-78.5-42.5T480-822ZM218-548h234v-150H218v150Zm445 65H218h524-79Zm-146-65h225v-150H517v150ZM334.209-309Q357-309 374.5-326.709q17.5-17.71 17.5-40.5Q392-390 374.291-407.5q-17.71-17.5-40.5-17.5Q311-425 293.5-407.291q-17.5 17.71-17.5 40.5Q276-344 293.709-326.5q17.71 17.5 40.5 17.5Zm292 0Q649-309 666.5-326.709q17.5-17.71 17.5-40.5Q684-390 666.291-407.5q-17.71-17.5-40.5-17.5Q603-425 585.5-407.291q-17.5 17.71-17.5 40.5Q568-344 585.709-326.5q17.71 17.5 40.5 17.5ZM297-251h366.404Q697-251 719.5-275.283 742-299.567 742-335v-148H218v148.47q0 34.53 22.283 59.03Q262.567-251 297-251Zm183-512h253-505 252Z',
  atm:       'M453-274h60v-45h48q15 0 24.5-12t9.5-27v-114.745q0-16.255-9.5-27.755T561-512H425v-69h170v-60h-82v-45h-60v45h-49q-15 0-27 12t-12 28.117v113.766Q365-471 377-461.5t27 9.5h131v73H365v60h88v45ZM140-148q-28.725 0-50.862-22.137Q67-192.275 67-221v-518q0-28.725 22.138-50.862Q111.275-812 140-812h680q28.725 0 50.862 22.138Q893-767.725 893-739v518q0 28.725-22.138 50.863Q848.725-148 820-148H140Zm0-73h680v-518H140v518Zm0 0v-518 518Z',
  info:      'M453-280h60v-240h-60v240Zm26.982-314q14.018 0 23.518-9.2T513-626q0-14.45-9.482-24.225-9.483-9.775-23.5-9.775-14.018 0-23.518 9.775T447-626q0 13.6 9.482 22.8 9.483 9.2 23.5 9.2Zm.284 514q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Zm.234-60Q622-140 721-239.5t99-241Q820-622 721.188-721 622.375-820 480-820q-141 0-240.5 98.812Q140-622.375 140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z',
};

function makeBubbleIcon(pathData, bgColor) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="${bgColor}"/><svg x="6" y="6" width="28" height="28" viewBox="0 -960 960 960"><path fill="white" d="${pathData}"/></svg></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

const BUBBLE_ICONS = {
  bar:        makeBubbleIcon(ICON_PATH_DATA.bar,        C.sekundärHell),
  food:       makeBubbleIcon(ICON_PATH_DATA.food,       C.primärDunkel),
  programm:   makeBubbleIcon(ICON_PATH_DATA.nachmittag, C.primärHell),
  restaurant: makeBubbleIcon(ICON_PATH_DATA.restaurant, C.primärHell),
  parking:    makeBubbleIcon(ICON_PATH_DATA.parking,    C.sekundärDunkel),
  sanitaer:   makeBubbleIcon(ICON_PATH_DATA.sanitaer,   C.sekundärDunkel),
  sanitaet:   makeBubbleIcon(ICON_PATH_DATA.sanitaet,   C.sekundärDunkel),
  busStop:    makeBubbleIcon(ICON_PATH_DATA.busStop,    C.sekundärDunkel),
  trainStop:  makeBubbleIcon(ICON_PATH_DATA.trainStop,  C.sekundärDunkel),
  atm:        makeBubbleIcon(ICON_PATH_DATA.atm,        C.sekundärDunkel),
  info:       makeBubbleIcon(ICON_PATH_DATA.info,       C.sekundärDunkel),
};

// resolveLogo() / resolveCard() live in locations-data.js (loaded first),
// shared with the Bietschimeile tutorial and the admin tool.

// Render a "Musik:"/"Essen:" detail; an array becomes a dash bullet list.
function infoField(label, value) {
  if (!value) return "";
  if (Array.isArray(value)) {
    const items = value.map((v) => `<li>${v}</li>`).join("");
    return `<p><span class="flex-section"><strong>${label}:</strong></span><span class="food-list"><ul>${items}</ul></span></p>`;
  }
  return `<p><span class="flex-section"><strong>${label}:</strong> ${value}</span></p>`;
}

// What tapping a marker does – "image" (open the designed `card` overlay),
// "none" (icon only) or "custom" (a popup built by buildCustomPinContent()).
// Legacy docs saved before this existed have no `displayMode` stored, so
// this infers the same behaviour they already had (mirrors the identical
// helper in admin/tabs/map.js, used there to preselect the admin dropdown).
const CONTENTISH_FIELDS = ["badge", "content", "subtitle", "link", "html", "getraenke", "musik", "essen", "special", "description"];
function inferDisplayMode(loc) {
  if (loc.displayMode) return loc.displayMode;
  if (loc.card) return "image";
  if (CONTENTISH_FIELDS.some((k) => loc[k])) return "custom";
  return "none";
}

// Small authoring syntax for the `content` field: "**bold**" inline, lines
// starting with "- " become a bullet list, other non-blank lines are
// paragraphs. Used only when displayMode is "custom".
function renderContent(text) {
  const bold = (s) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  let html = "";
  let listItems = [];
  const flushList = () => {
    if (listItems.length) {
      html += `<ul class="pin-content__list">${listItems.join("")}</ul>`;
      listItems = [];
    }
  };
  String(text)
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }
      if (trimmed.startsWith("- ")) {
        listItems.push(`<li>${bold(trimmed.slice(2))}</li>`);
      } else {
        flushList();
        html += `<p>${bold(trimmed)}</p>`;
      }
    });
  flushList();
  return html;
}

// Build the popup HTML for displayMode: "custom" – unifies what used to be
// two separate functions (participant-marker fields + infrastructure fields,
// e.g. Bühne's `link` button or a train/bus `html` timetable both still work
// here), plus the two new toggles and the generic `content` block.
function buildCustomPinContent(loc) {
  const logoStyle = loc.logoStyle ? ` style="${loc.logoStyle}"` : "";
  const logos = []
    .concat(loc.image || [])
    .map(
      (img) =>
        `<img src="${encodeURI(resolveLogo(img))}" class="content-logo" alt="${loc.name}"${logoStyle} />`
    )
    .join("");

  const showTitle = loc.displayTitle !== false;
  const badge = showTitle && (loc.badge || loc.name) ? `<span class="name-badge">${loc.badge || loc.name}</span>` : "";
  const by = showTitle && loc.by
    ? `<div class="content-title-wrapper"><h3 class="content-subtitle">by ${loc.by}</h3></div>`
    : "";
  const subtitle = showTitle && loc.subtitle
    ? `<div class="content-title-wrapper" style="margin-top: 0;"><h3 class="content-subtitle">${loc.subtitle}</h3></div>`
    : "";
  const link = loc.link
    ? `<div class="lineup"><a href="${loc.link.href}" class="lineup-link">${loc.link.text}</a></div>`
    : "";

  const details =
    infoField("Getränke", loc.getraenke) +
    infoField("Musik", loc.musik) +
    infoField("Essen", loc.essen) +
    infoField("Special", loc.special);
  const description = loc.description ? `<p>${loc.description}</p>` : "";
  const showContent = loc.displayContent !== false;
  const content = showContent && loc.content ? `<div class="pin-content">${renderContent(loc.content)}</div>` : "";
  const html = loc.html || "";
  const body = details + description + content + html;

  // Nothing to show -> no popup (icon-only marker).
  if (!logos && !badge && !by && !subtitle && !link && !body) return "";

  return `<div class="images">${logos}${badge}</div>${by}${subtitle}${link}${body ? `<hr>${body}` : ""}`;
}

// Turn a LOCATIONS entry into the array shape createMarkers expects.
function locationToMarker(loc) {
  const mode = inferDisplayMode(loc);
  const customIcon = loc.type === "custom" && window.CUSTOM_ICONS && window.CUSTOM_ICONS[loc.id];
  return [
    loc.name,
    loc.lat,
    loc.lng,
    customIcon || BUBBLE_ICONS[loc.type] || BUBBLE_ICONS.bar,
    22,
    22,
    mode === "custom" ? buildCustomPinContent(loc) : "",
    mode === "image" && loc.card ? resolveCard(loc.card) : null, // designed info card -> opened as overlay instead of the popup
    loc.id, // Firestore doc id -> used for the Bietschimeile stamp-collected check
    loc.type, // only "bar" entries show a stamp-collected badge at all
    mode, // "image" | "none" | "custom" -> what tapping the marker does
  ];
}

// ---- Info card overlay ----------------------------------------------------
// Markers with a `card` open the designed card image full-screen; the text
// InfoWindow is only used for entries without a card.
const cardOverlay = document.getElementById("cardOverlay");
const cardOverlayImg = document.getElementById("cardOverlayImg");
const cardOverlayStamp = document.getElementById("cardOverlayStamp");
const cardOverlaySpinner = document.getElementById("cardOverlaySpinner");
const CLOSE_ZOOM = 19; // "zoomed in" level closeCard() settles on (maxZoom is 20, blurry beyond)
let cardMarkerPosition = null; // where to pan/zoom to once the card is closed

function openCard(url, name, isBar, stampCollected, position) {
  if (currentInfoWindow != null) currentInfoWindow.close();
  cardMarkerPosition = position || null;

  // The card image (Firebase Storage) can take a moment to load – show a
  // spinner in its place until it (or a broken load) resolves.
  cardOverlayImg.classList.add("card-overlay__img--loading");
  cardOverlaySpinner.hidden = false;
  cardOverlayImg.onload = cardOverlayImg.onerror = () => {
    cardOverlayImg.classList.remove("card-overlay__img--loading");
    cardOverlaySpinner.hidden = true;
  };

  cardOverlayImg.src = url;
  cardOverlayImg.alt = name;

  // Only bars are part of the Bietschimeile stamp card – other entries get
  // no badge at all, a bar always gets one (collected or not).
  cardOverlayStamp.hidden = !isBar;
  if (isBar) {
    cardOverlayStamp.textContent = stampCollected ? "✓ Stempel gesammelt" : "Stempel noch nicht gesammelt";
    cardOverlayStamp.classList.toggle("stamp-collected-badge--pending", !stampCollected);
  }
  cardOverlay.hidden = false;
}

function closeCard() {
  cardOverlay.hidden = true;
  cardOverlayImg.removeAttribute("src"); // stop loading / free memory

  // Centre + zoom in on the bar the card belonged to, so closing it (e.g.
  // after tapping an uncollected stamp from the Bietschimeile grid) leaves
  // you looking right at that spot on the map.
  if (cardMarkerPosition) {
    map.panTo(cardMarkerPosition);
    if (map.getZoom() < CLOSE_ZOOM) map.setZoom(CLOSE_ZOOM);
    cardMarkerPosition = null;
  }
}

document.getElementById("cardOverlayClose").addEventListener("click", closeCard);
cardOverlay.addEventListener("click", (e) => {
  if (e.target === cardOverlay) closeCard(); // tap on the backdrop
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !cardOverlay.hidden) closeCard();
});

// Stage bubble: white glyph on a coloured circle (vector re-drawing of
// icons/stage.png), same shape as makeBubbleIcon but with its own colours.
function makeStageBubble(glyphColor, bgColor) {
  const g = `<g fill="${glyphColor}" stroke="${glyphColor}">
<path stroke="none" d="M8 84 Q258 -46 509 84 V108 Q509 118 499 118 H18 Q8 118 8 108 Z"/>
<rect stroke="none" x="8" y="143" width="30" height="270"/><rect stroke="none" x="60" y="143" width="30" height="270"/>
<rect stroke="none" x="427" y="143" width="30" height="270"/><rect stroke="none" x="479" y="143" width="30" height="270"/>
<path fill="none" stroke-width="16" stroke-linejoin="round" d="M38 165 L60 187 L38 209 L60 231 L38 253 L60 275 L38 297 L60 319 L38 341 L60 363 L38 385"/>
<path fill="none" stroke-width="16" stroke-linejoin="round" d="M479 165 L457 187 L479 209 L457 231 L479 253 L457 275 L479 297 L457 319 L479 341 L457 363 L479 385"/>
<rect stroke="none" x="140" y="143" width="20" height="36"/><path stroke="none" d="M118 207 A32 32 0 0 1 182 207 Z"/>
<rect stroke="none" x="248" y="143" width="20" height="36"/><path stroke="none" d="M226 207 A32 32 0 0 1 290 207 Z"/>
<rect stroke="none" x="356" y="143" width="20" height="36"/><path stroke="none" d="M334 207 A32 32 0 0 1 398 207 Z"/>
<circle stroke="none" cx="214" cy="303" r="28"/><path fill="none" stroke-width="22" stroke-linecap="round" d="M232 320 L288 340"/>
<rect stroke="none" x="250" y="335" width="22" height="78"/>
<rect stroke="none" x="8" y="437" width="152" height="72" rx="6"/><rect stroke="none" x="187" y="437" width="145" height="72" rx="6"/><rect stroke="none" x="357" y="437" width="152" height="72" rx="6"/>
</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="${bgColor}"/><svg x="8" y="8" width="24" height="24" viewBox="0 0 517 517">${g}</svg></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

// Icon + size per INFRASTRUCTURE type (see locations-data.js).
const INFRA_ICONS = {
  stage:    { url: makeStageBubble("white", C.buehneHintergrund), size: 50 },
  info:     { url: BUBBLE_ICONS.info,     size: 20 },
  sanitaet: { url: BUBBLE_ICONS.sanitaet, size: 20 },
  wc:       { url: BUBBLE_ICONS.sanitaer, size: 20 },
  parking:  { url: BUBBLE_ICONS.parking,  size: 20 },
  atm:      { url: BUBBLE_ICONS.atm,      size: 20 },
  bus:      { url: BUBBLE_ICONS.busStop,  size: 20 },
  train:    { url: BUBBLE_ICONS.trainStop, size: 20 },
};

// ---- "custom" location type: an admin-chosen Material Symbols icon --------
// A Maps marker `icon` must be a static image URL, and an SVG data-URI used
// that way is decoded in an isolated context with no access to the page's
// loaded web fonts (unlike ICON_PATH_DATA's baked-in paths above, a
// <text font-family="Material Symbols Outlined"> inside such an SVG would
// just silently fall back to a system font). Rasterizing with <canvas> in
// the *document* context – which does have the font – sidesteps that: by
// the time it's exported to a data URI it's already pixels.
const CUSTOM_ICON_BG = C.primärDunkel;

function drawCustomIcon(iconName) {
  const size = 40;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  ctx.fillStyle = CUSTOM_ICON_BG;
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = '22px "Material Symbols Outlined"';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(iconName || "place", size / 2, size / 2 + 1);
  return canvas.toDataURL("image/png");
}

// Pre-generates every "custom"-type icon up front (called once from
// bootstrapData(), before initMap() runs) so locationToMarker() can do a
// plain synchronous lookup afterwards instead of every marker needing to
// await its own icon.
async function buildCustomIcons(entries) {
  const customEntries = entries.filter((loc) => loc.type === "custom");
  if (!customEntries.length) return {};
  try {
    await document.fonts.load('22px "Material Symbols Outlined"');
  } catch {
    /* draw anyway – worst case the glyph falls back to a system font */
  }
  const icons = {};
  customEntries.forEach((loc) => {
    icons[loc.id] = drawCustomIcon(loc.iconName);
  });
  return icons;
}

// Turn an INFRASTRUCTURE entry into the object shape createMarkers expects.
// (Infrastructure markers stay visible at every zoom level. `type: "custom"`
// is a "location"-kind MARKER_TYPES entry, so it never ends up here – no
// custom-icon lookup needed on this path.)
function infraToMarker(loc) {
  const icon = INFRA_ICONS[loc.type] || INFRA_ICONS.info;
  const mode = inferDisplayMode(loc);
  const content = mode === "custom" ? buildCustomPinContent(loc) : "";
  return {
    position: { lat: loc.lat, lng: loc.lng },
    map: map,
    title: loc.name,
    icon: {
      url: icon.url,
      scaledSize: new google.maps.Size(icon.size, icon.size),
      optimized: false,
    },
    // Consumed by createMarkers()'s object-branch below; underscore-prefixed
    // so they read clearly as "not a real google.maps.Marker option" (Maps
    // silently ignores unknown keys, same as the existing infoWindowContent).
    _displayMode: mode,
    _cardUrl: mode === "image" && loc.card ? resolveCard(loc.card) : null,
    _name: loc.name,
    ...(content ? { infoWindowContent: content } : {}),
  };
}

const button = document.getElementById("mapButton");
const dialog = new mdc.dialog.MDCDialog(
  document.getElementById("settingsDialog")
);

// Add event listener to the button to open the dialog on click
button.addEventListener("click", () => {
  dialog.open();
});

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 46.31093284838397, lng: 7.800514723358967}, // Startplatz
    zoom: 17.45, // 18 für Fest
    maxZoom: 20, // no closer than this – tiles only get blurry beyond
    disableDefaultUI: true,
    styles: MAP_STYLE,
  });

  // Participant markers (bars, food, Programm) come from the LOCATIONS list.
  const locationMarkers = LOCATIONS.map(locationToMarker);

  // Registry of created markers (by name) so we can open one programmatically,
  // e.g. when arriving from the stamp card via ?bar=<id>.
  const mapMarkers = {};

  // Infrastructure markers (Bühne, WC, Sanität, Parkplatz, Info, Bankomat,
  // Bus/Zug) come from the INFRASTRUCTURE list in locations-data.js.
  const infraMarkers = INFRASTRUCTURE.map(infraToMarker);

  // use API to add markers
  function createMarkers(locationArray) {
    if (!Array.isArray(locationArray)) {
      console.error("Input is not an array.");
      return;
    }

    if (locationArray.length === 0) {
      console.warn("Input array is empty.");
      return;
    }

    if (
      typeof google === "undefined" ||
      typeof google.maps === "undefined" ||
      typeof google.maps.Marker === "undefined"
    ) {
      console.error("Google Maps API or Marker class is not available.");
      return;
    }

    // Check if the array contains objects (for the first element)
    const isArrayOfObjects =
      typeof locationArray[0] === "object" &&
      locationArray[0] !== null &&
      !Array.isArray(locationArray[0]);

    if (isArrayOfObjects) {
      // Code to create markers from an array of objects (INFRASTRUCTURE)
      locationArray.forEach((object) => {
        const marker = new google.maps.Marker(object);

        // displayMode: "image" -> the card overlay, same as participant markers.
        if (object._displayMode === "image" && object._cardUrl) {
          marker.addListener("click", () => {
            openCard(object._cardUrl, object._name, false, false, marker.getPosition());
          });
          return;
        }

        if (object?.infoWindowContent) {
          const infoWindow = new google.maps.InfoWindow({
            content: object.infoWindowContent,
          });

          marker.addListener("click", () => {
            if (currentInfoWindow != null) {
              currentInfoWindow.close();
            }
            infoWindow.open({
              anchor: marker,
              map,
            });
            currentInfoWindow = infoWindow;
          });
          if (object?.visibleDefault)
            infoWindow.open({
              anchor: marker,
              map,
            });

          google.maps.event.addListener(map, "click", function () {
            infoWindow.close(map, marker);
          });
        }
        // else displayMode "none" (or "image" with no card set) -> icon only.
      });
    } else {
      // Code to create markers from an array of arrays (normal array)
      for (let i = 0; i < locationArray.length; i++) {
        const currMarker = locationArray[i];

        const marker = new google.maps.Marker({
          position: { lat: currMarker[1], lng: currMarker[2] },
          map: map,
          title: currMarker[0],
          icon: {
            url: currMarker[3],
            glyphColor: "white",
            scaledSize: new google.maps.Size(currMarker[4], currMarker[5]),
            optimized: false,
          },
        });

        // displayMode drives everything below: "image" only ever reads
        // currMarker[7] (the card URL), "custom" only ever reads currMarker[6]
        // (the popup HTML) – "none" (or "image" with no card set) gets no
        // listener at all, same as a genuinely empty marker used to.
        const mode = currMarker[10];
        const hasContent = mode === "image" ? !!currMarker[7] : mode === "custom" ? !!currMarker[6] : false;

        if (hasContent) {
          const infowindow = new google.maps.InfoWindow({
            content: currMarker[6],
          });

          const openInfo = () => {
            if (currentInfoWindow != null) {
              currentInfoWindow.close();
            }

            // Reflect the Bietschimeile stamp status (read fresh on each
            // open) – only bars are part of the stamp card at all.
            const isBar = currMarker[9] === "bar";
            const stampCollected = isBar && getCollectedStamps().includes(currMarker[8]);

            // Designed info card -> show it as an overlay instead.
            if (mode === "image") {
              openCard(currMarker[7], currMarker[0], isBar, stampCollected, marker.getPosition());
              return;
            }

            let content = currMarker[6];
            if (isBar) {
              content += `<div class="stamp-collected-badge${stampCollected ? "" : " stamp-collected-badge--pending"}">${
                stampCollected ? "✓ Stempel gesammelt" : "Stempel noch nicht gesammelt"
              }</div>`;
            }
            infowindow.setContent(content);

            infowindow.open({
              anchor: marker,
              map,
            });
            currentInfoWindow = infowindow;
          };

          marker.addListener("click", openInfo);
          mapMarkers[currMarker[8]] = { marker, openInfo };

          google.maps.event.addListener(map, "click", function () {
            infowindow.close(map, marker);
          });

          google.maps.event.addListener(map, "zoom_changed", function () {
            if (map.getZoom() < 17) {
              marker.setVisible(false);
            } else {
              marker.setVisible(true);
            }
          });
        }
      }
    }
  }

  createMarkers(locationMarkers);
  createMarkers(infraMarkers);

  // Arriving from the stamp card (?bar=<id>, id = the bar's Firestore doc
  // id) → open that bar's popup.
  const requestedBar = new URLSearchParams(location.search).get("bar");
  if (requestedBar) {
    const entry = mapMarkers[requestedBar];
    if (entry) {
      map.panTo(entry.marker.getPosition());
      entry.openInfo();
    }
    history.replaceState(null, "", location.pathname);

    // Arriving here straight from a QR scan (404.html) – if that was the
    // last missing stamp, head to the Bietschimeile page after a moment so
    // the visitor sees the "Fertig!" banner and can claim their drink.
    const bars = (window.LOCATIONS || []).filter((loc) => loc.type === "bar");
    const collected = getCollectedStamps();
    const allCollected = bars.length > 0 && bars.every((bar) => collected.includes(bar.id));
    if (allCollected) {
      setTimeout(() => {
        location.href = "bietschimeile.html";
      }, 1600);
    }
  }

  document
    .getElementById("locateButton")
    .addEventListener("click", trackUserLocation);

  window.Fb.hideLoadingOverlay();
}

// "Du bist hier" – live GPS position of the visitor (triggered by the button).
function trackUserLocation() {
  if (!navigator.geolocation) {
    alert("Standortbestimmung wird von diesem Gerät nicht unterstützt."); 
    return;
  }

  // Already tracking → just re-center on the last known position.
  if (locationWatchId !== null) {
    if (userMarker) map.panTo(userMarker.getPosition());
    return;
  }

  locationWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const latLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const firstFix = !userMarker;

      if (firstFix) {
        userMarker = new google.maps.Marker({
          position: latLng,
          map,
          title: "Du bischt genau hie",
          zIndex: 9999,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: C.sekundärHell,
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        });

        accuracyCircle = new google.maps.Circle({
          map,
          center: latLng,
          fillColor: C.sekundärHell,
          fillOpacity: 0.12,
          strokeColor: C.sekundärHell,
          strokeOpacity: 0.3,
          strokeWeight: 1,
          clickable: false,
          zIndex: 1,
        });
      } else {
        userMarker.setPosition(latLng);
        accuracyCircle.setCenter(latLng);
      }

      accuracyCircle.setRadius(pos.coords.accuracy);
      if (firstFix) map.panTo(latLng);
    },
    (err) => {
      console.warn("Geolocation error:", err.message);
      alert("Standort konnte nicht ermittelt werden. Bitte Standortfreigabe erlauben."); 
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
  );
}

// ---------------------------------------------------------------------------
// Fotowand – guest photo sharing (external Crowpyx album; the link lives in
// config/fotowand in Firestore, editable via the admin "Fotowand" tab; no
// url configured → everything stays hidden). The bottom promo bar and the
// camera FAB both open a small branded intro modal whose button opens the
// album in a new tab. Dismissing the bar (×) swaps it for the FAB only for
// the current page view – deliberately NOT persisted, the bar reappears on
// every reload as the feature's promotion.
// ---------------------------------------------------------------------------
function initFotowand(cfg) {
  const url = cfg && cfg.url;
  if (!url) return;
  const bar = document.getElementById("fotowandBar");
  const fab = document.getElementById("fotowandButton");
  const overlay = document.getElementById("fotowandOverlay");
  if (!bar || !fab || !overlay) return;

  document.getElementById("fotowandOpenLink").href = url;

  bar.hidden = false;

  const openModal = () => {
    overlay.hidden = false;
  };
  bar.addEventListener("click", openModal);
  fab.addEventListener("click", openModal);

  document.getElementById("fotowandBarClose").addEventListener("click", (e) => {
    e.stopPropagation(); // the × must not also open the modal
    bar.hidden = true;
    fab.hidden = false;
  });

  const closeModal = () => {
    overlay.hidden = true;
  };
  document.getElementById("fotowandClose").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

// Live banner – shown at the top of the map while a band is playing.
function updateLiveBanner() {
  const banner = document.getElementById("liveBanner");
  if (!banner) return;

  const live = getLiveAct(getNow());
  if (live) {
    banner.querySelector(".live-banner__text").textContent =
      "Gat am live am spilu:: " + live.act; 
    banner.hidden = false;
    document.body.classList.add("banner-visible");
  } else {
    banner.hidden = true;
    document.body.classList.remove("banner-visible");
  }
}

// ---------------------------------------------------------------------------
// Data bootstrap: fetch LOCATIONS/INFRASTRUCTURE/LINEUP from Firestore, then
// start the Google Maps script (its callback=initMap builds the markers) –
// mirrors the lazy-load pattern bietschimeile.js already uses for its
// tutorial map, so initMap() itself needs no changes at all.
// ---------------------------------------------------------------------------
function loadGoogleMapsScript() {
  const s = document.createElement("script");
  s.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyCXJdwDBQfk1lCSww2v3pM9ApCxynbKMoQ&v=beta&callback=initMap";
  s.onerror = () => window.Fb.showLoadingError(bootstrapData);
  document.head.appendChild(s);
}

async function bootstrapData() {
  try {
    const [{ LOCATIONS: locs, INFRASTRUCTURE: infra }, lineup, fotowand] = await Promise.all([
      window.Fb.fetchLocationsSplit(),
      window.Fb.fetchLineup(),
      window.Fb.fetchFotowand(), // never throws – null just hides the feature
    ]);
    window.LOCATIONS = locs;
    window.INFRASTRUCTURE = infra;
    window.LINEUP = lineup;
    // type: "custom" is always "location"-kind (MARKER_TYPES), never in
    // INFRASTRUCTURE – see buildCustomIcons() for why this must finish
    // before locationToMarker() runs (a Maps marker icon can't be a live
    // font glyph, only a static image, so it's rasterized up front here).
    window.CUSTOM_ICONS = await buildCustomIcons(locs);
    loadGoogleMapsScript();
    updateLiveBanner();
    setInterval(updateLiveBanner, 30000);
    initFotowand(fotowand);
  } catch (err) {
    console.error("Datenladung fehlgeschlagen:", err);
    window.Fb.showLoadingError(bootstrapData);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bootstrapData();

  // After 5s on the map, slide in a hint about the Bietschimeile (stays until tapped).
  const meileHint = document.getElementById("meileHint");
  if (meileHint) {
    const meileHintText = meileHint.querySelector(".meile-hint__text");
    if (meileHintText) {
      meileHintText.textContent = getCollectedStamps().length
        ? "Hie geits zer Bietschimeile!"
        : "Kännsch scho die Bietschimeile?";
    }
    setTimeout(() => meileHint.classList.add("meile-hint--visible"), 5000);
    // The "×" dismisses the hint without following the link to the Bietschimeile.
    const meileHintClose = document.getElementById("meileHintClose");
    if (meileHintClose) {
      meileHintClose.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        meileHint.classList.remove("meile-hint--visible");
      });
    }
  }
});

window.initMap = initMap;
