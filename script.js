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
    TYPE_ICONS[loc.type] || TYPE_ICONS.bar,
    25,
    25,
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
      "icons/restaurant.svg",
      25,
      25,
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
      "icons/restaurant.svg",
      25,
      25,
      ' \
      <div class="content-title-wrapper" style="margin-top: 0;">\
      <h2 class="content-title">Restaurant Kapitel 7</h2>\
      </div>\
           ',
    ],
  ];

  // Parking-marker
  const parking = [
    ["Schulhausplatz", 46.308303, 7.80164, "icons/parking.svg", 25, 25],
  ];

  // Sanitär-marker
  const sanitaer = [
    ["Kreisel Dorf", 46.31152, 7.799844, "icons/sanitaer.svg", 25, 25],

    ["Maxenhaus", 46.31159, 7.80053, "icons/sanitaer.svg", 25, 25],

    [
      "Alte Post",
      46.30978113328334,
      7.800215312930417,
      "icons/sanitaer.svg",
      25,
      25,
    ],
    [
      "Parking Schmitta",
      46.31126252625926,
      7.799326719832625,
      "icons/sanitaer.svg",
      25,
      25,
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
          <a href="lineup.html" class="lineup-link">Lineup ansehen →</a>\
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
        url: "icons/trainStop.svg",
        scaledSize: new google.maps.Size(25, 25),
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
        url: "icons/busStop.svg",
        scaledSize: new google.maps.Size(25, 25),
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
        url: "icons/sanitaet.svg",
        scaledSize: new google.maps.Size(30, 25),
        optimized: false,
      },
    },
  ];

  const info = [
    {
      position: { lat: 46.31079761450369, lng: 7.800021996320716 },
      map: map,
      icon: {
        url: "icons/info.svg",
        scaledSize: new google.maps.Size(30, 25),
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
        url: "icons/atm.svg",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
        fillColor: "red",
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
        url: "icons/atm.svg",
        scaledSize: new google.maps.Size(25, 25),
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
          title: "Du bist hier",
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
      locationWatchId = null;
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
      "Jetzt live: " + live.act;
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
    meileHint.textContent = getCollectedStamps().length
      ? "Hier gehts zur Bietschimeile"
      : "Kennst du schon die Bietschimeile?";
    setTimeout(() => meileHint.classList.add("meile-hint--visible"), 5000);
    meileHint.addEventListener("click", () =>
      meileHint.classList.remove("meile-hint--visible")
    );
  }
});

window.initMap = initMap;
