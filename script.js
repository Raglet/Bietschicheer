var map;
var currentInfoWindow = null;

// "Du bist hier" – live GPS tracking state
let userMarker = null;
let accuracyCircle = null;
let locationWatchId = null;

// Bietschimeile stamp card – read collected stamps so the map can reflect them.
// Maps a map marker's name to its stamp id (see BARS in bietschimeile.js).
const BAR_NAME_TO_STAMP = {
  "Bietschichlepfer": "bietschichlepfer",
  "DIE BAR": "diebar",
  "EHC Raron": "ehc",
  "FC Raron": "fc-raron",
  "Heidnischbier": "heidnisch",
  "Hockeyladies": "hockeyladies",
  "Jodlerverein Raron": "jodlerverein",
  "Jugendverein Raron": "jugendverein",
  "Musikgesellschaft ECHO Raronia": "echo-raronia",
  "Pro Raronia Historica und Kulturstiftung": "proraronia",
  "Rilke": "rilke",
  "Stigma": "stigma",
  "VBC Raron": "vbc-raron",
  "Verein Bietschicheer": "bietschicheer",
};

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

// Resolve a logo value: a plain filename comes from LOGO_DIR; a value with a
// slash is taken from images/ directly (for the older images/logos/ files).
function resolveLogo(image) {
  return image.includes("/") ? "images/" + image : LOGO_DIR + image;
}

// Render a "Musik:"/"Essen:" detail; an array becomes a dash bullet list.
function infoField(label, value) {
  if (!value) return "";
  if (Array.isArray(value)) {
    const items = value.map((v) => `<li>${v}</li>`).join("");
    return `<p><span class="flex-section"><strong>${label}:</strong></span><span class="food-list"><ul>${items}</ul></span></p>`;
  }
  return `<p><span class="flex-section"><strong>${label}:</strong> ${value}</span></p>`;
}

// Build the InfoWindow HTML for a LOCATIONS entry.
function buildInfoContent(loc) {
  const logoStyle = loc.logoStyle ? ` style="${loc.logoStyle}"` : "";
  const logos = []
    .concat(loc.image || [])
    .map(
      (img) =>
        `<img src="${encodeURI(resolveLogo(img))}" class="content-logo" alt="${loc.name}"${logoStyle} />`
    )
    .join("");

  const badge = loc.badge ? `<span class="name-badge">${loc.badge}</span>` : "";
  const by = loc.by
    ? `<div class="content-title-wrapper"><h3 class="content-subtitle">by ${loc.by}</h3></div>`
    : "";

  const details =
    infoField("Getränke", loc.getraenke) +
    infoField("Musik", loc.musik) +
    infoField("Essen", loc.essen) +
    infoField("Nachmittag", loc.nachmittag);
  const description = loc.description ? `<p>${loc.description}</p>` : "";
  const body = details || description ? `<hr>${details}${description}` : "";

  return `<div class="images">${logos}${badge}</div>${by}${body}`;
}

// Turn a LOCATIONS entry into the array shape createMarkers expects.
function locationToMarker(loc) {
  return [
    loc.name,
    loc.lat,
    loc.lng,
    BUBBLE_ICONS[loc.type] || BUBBLE_ICONS.bar,
    22,
    22,
    buildInfoContent(loc),
  ];
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
    disableDefaultUI: true,
    styles: MAP_STYLE,
  });

  // Participant markers (bars, food, Programm) come from the LOCATIONS list.
  const locationMarkers = LOCATIONS.map(locationToMarker);

  // Registry of created markers (by name) so we can open one programmatically,
  // e.g. when arriving from the stamp card via ?bar=<id>.
  const mapMarkers = {};

  // Restaurant-marker
  const restaurants = [
    [
      "Restaurant Schmitta",
      46.311236,
      7.799061,
      BUBBLE_ICONS.restaurant,
      22,
      22,
      ' \
      <div class="content-title-wrapper" style="margin-top: 0;">\
      <h2 class="content-title">Restaurant Schmitta</h2>\
      </div>\
           ',
    ],



    [
      "Kapitel 7",
      46.309912201169375,
      7.800265191478576,
      BUBBLE_ICONS.restaurant,
      22,
      22,
      ' \
      <div class="content-title-wrapper" style="margin-top: 0;">\
      <h2 class="content-title">Restaurant Kapitel 7</h2>\
      </div>\
           ',
    ],
  ];

  // Parking-marker
  const parking = [
    ["Schulhausplatz", 46.308303, 7.80164, BUBBLE_ICONS.parking, 20, 20],
  ];

  // Sanitär-marker
  const sanitaer = [
    ["Kreisel Dorf", 46.31152, 7.799844, BUBBLE_ICONS.sanitaer, 20, 20],

    ["Maxenhaus", 46.31159, 7.80053, BUBBLE_ICONS.sanitaer, 20, 20],

    [
      "Alte Post",
      46.30978113328334,
      7.800215312930417,
      BUBBLE_ICONS.sanitaer,
      20,
      20,
    ],
    [
      "Parking Schmitta",
      46.31126252625926,
      7.799326719832625,
      BUBBLE_ICONS.sanitaer,
      20,
      20,
    ],
  ];

  // Bühne-marker
  const stage = [
    {
      position: { lat: 46.31154857855296, lng: 7.799623317488572},
      map: map,
      icon: {
        url: "icons/stage.png",
        scaledSize: new google.maps.Size(35, 35),
        optimized: false,
      },
      infoWindowContent: `
        <div class="lineup">\
          <a href="lineup.html" class="lineup-link">z ganz Line Up alüägu →</a>\
        </div>\
`,
    },
  ];

  const busStops = [
    {
      position: { lat: 46.30616248915186, lng: 7.801530337347227 },
      map: map,
      title: "Bahnhof Raron",
      icon: {
        url: BUBBLE_ICONS.trainStop,
        scaledSize: new google.maps.Size(20, 20),
        optimized: false,
      },
      infoWindowContent:
        '      \
        <div class="images">\
        <span class="name-badge">zug</span>\
        </div>\
        <hr>\
        <p>An- und Abreise mit dem Regio stündlich ab Brig und St. Maurice.  </p> \
        <p>  <strong> Fahrplan Abreise</strong> </p> \
        <p> Richtung Susten  </p>\
        <ul> \
        <li>23:48 Uhr lezter Zug </li> \
        <li>4:48 Uhr erster Zug </li> \
        </ul> \
        <p> Richtung Brig </br></p>\
        <ul> \
        <li>00:41 Uhr lezter Zug </li> \
        <li>5:40 Uhr erster Zug </li> \
        </ul> </p> \
       ',
    },
    {
      position: { lat: 46.30356892349157, lng: 7.8014837184476145 },
      map: map,
      title: "Busstation Bergheim",
      icon: {
        url: BUBBLE_ICONS.busStop,
        scaledSize: new google.maps.Size(20, 20),
        optimized: false,
      },
      infoWindowContent: ` \
      <div class="images">\
      <span class="name-badge">bus</span>\
      </div>\
      <hr>\
     <p><strong>Fahrplan </strong></p>  \
      <p>Richtung Susten</p>
      <ul>
        <li> ca. 02:00 Uhr (Bettmobil)</li>
        <li> ca. 03:30 Uhr (Steiner Reisen)</li>
          </ul>
          <p>Richtung Brig</ul> </p>
<ul>
          <li> ca. 02:30 Uhr (Steiner Reisen)</li>
                  <li> ca. 03:45 Uhr (Bettmobil)</li>
                </ul>`,
    },
  ];

  const sanitaet = [
    {
      position: { lat: 46.311635, lng: 7.800258 },
      map: map,
      icon: {
        url: BUBBLE_ICONS.sanitaet,
        scaledSize: new google.maps.Size(20, 20),
        optimized: false,
      },
    },
  ];

  const info = [
    {
      position: { lat: 46.31079761450369, lng: 7.800021996320716 },
      map: map,
      icon: {
        url: BUBBLE_ICONS.info,
        scaledSize: new google.maps.Size(20, 20),
        optimized: false,
      },
      infoWindowContent: `
      <span class="name-badge">Tickets und Info</span>\
      `,
    },
  ];

  const atms = [
    {
      position: { lat: 46.30914985360714, lng: 7.799721723633649 },
      map: map,
      title: "Bankautomat Raiffeisen",
      icon: {
        url: BUBBLE_ICONS.atm,
        scaledSize: new google.maps.Size(20, 20),
        optimized: false,
      },
      infoWindowContent:
        '<div class="images">\
        <span class="name-badge">bank</span>\
        </div>\
         <div class="content-title-wrapper" style="margin-top: 0 "> \
      <h3 class="content-subtitle">Raiffeisen</h3> \
        </div>  ',
    },
    {
      position: { lat: 46.307804743765814, lng: 7.800516896599212 },
      map: map,
      title: "Bankautomat WKB",
      icon: {
        url: BUBBLE_ICONS.atm,
        scaledSize: new google.maps.Size(20, 20),
        optimized: false,
      },
      infoWindowContent:
        '<div class="images">\
        <span class="name-badge">bank</span>\
        </div>\
         <div class="content-title-wrapper" style="margin-top : 0;"> \
      <h3 class="content-subtitle"> WKB</h3> \
         </div>  ',
    },
  ];

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
      // Code to create markers from an array of objects
      locationArray.forEach((object) => {
        const marker = new google.maps.Marker(object);

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

        if (currMarker[6]) {
          const infowindow = new google.maps.InfoWindow({
            content: currMarker[6],
          });

          const openInfo = () => {
            if (currentInfoWindow != null) {
              currentInfoWindow.close();
            }

            // Reflect the Bietschimeile stamp status (read fresh on each open).
            const stampId = BAR_NAME_TO_STAMP[currMarker[0]];
            let content = currMarker[6];
            if (stampId && getCollectedStamps().includes(stampId)) {
              content +=
                '<div class="stamp-collected-badge">✓ Stempel gesammelt</div>';
            }
            infowindow.setContent(content);

            infowindow.open({
              anchor: marker,
              map,
            });
            currentInfoWindow = infowindow;
          };

          marker.addListener("click", openInfo);
          mapMarkers[currMarker[0]] = { marker, openInfo };

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
  createMarkers(stage);
  createMarkers(sanitaer);
  createMarkers(sanitaet);
  createMarkers(busStops);
  createMarkers(restaurants);
  createMarkers(parking);
  createMarkers(atms);
  createMarkers(info);

  // Arriving from the stamp card (?bar=<id>) → open that bar's popup.
  const requestedBar = new URLSearchParams(location.search).get("bar");
  if (requestedBar) {
    const name = Object.keys(BAR_NAME_TO_STAMP).find(
      (n) => BAR_NAME_TO_STAMP[n] === requestedBar
    );
    const entry = name && mapMarkers[name];
    if (entry) {
      map.panTo(entry.marker.getPosition());
      entry.openInfo();
    }
    history.replaceState(null, "", location.pathname);
  }

  document
    .getElementById("locateButton")
    .addEventListener("click", trackUserLocation);
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

document.addEventListener("DOMContentLoaded", () => {
  updateLiveBanner();
  setInterval(updateLiveBanner, 30000);

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
