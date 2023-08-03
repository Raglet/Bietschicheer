var map;

// create var for current infowindow and declare it zero
var currentInfoWindow = null;

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
    center: { lat: 46.311049, lng: 7.799834 }, // Dorfplatz Raron
    zoom: 18, // 18 für Fest
    mapId: "a32a14914e374824",
  });

  // add informations about all locations in constants
  // Bar-marker
  const drink_bars = [
    [
      "Bar Cipolla",
      46.311364,
      7.800744,
      "images/bar.png",
      25,
      25,
      "<h2>1 - Reserve</h2>\
        Status: Frei",
    ],

    [
      "Garage Armando",
      46.31137,
      7.80053,
      "images/bar.png",
      25,
      25,
      '<h2>2 - Gewerbeverein Ecoumbra</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 18:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 300.-</p>\
        Status: Reserivert',
    ],

    [
      "Gemeinde Partylokal",
      46.311434,
      7.800057,
      "images/bar.png",
      25,
      25,
      '<h2>3 - Guggenmusik Mesireccas</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 18:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 400.-</p>\
        Status: Reserivert',
    ],

    [
      "Parking Gemeinde",
      46.311553,
      7.799596,
      "images/bar.png",
      25,
      25,
      '<h2>4 - Verein Bietschicheer</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - 00:00 Uhr</p>\
        <p>Preis: CHF 400.-</p>\
        Status: Reserviert',
    ],

    [
      "Garage Chez Karlen",
      46.311291,
      7.799512,
      "images/bar.png",
      25,
      25,
      '<h2>5 - EHC Raron</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 18:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 400.-</p>\
        Status: Reserviert',
    ],

    [
      "Stall des Paten",
      46.311035,
      7.798849,
      "images/bar.png",
      25,
      25,
      '<h2>6 - 12ter Man  </h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 18:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 300.-</p>\
        Status: Reserviert',
    ],

    [
      "LM LaserArt Eventtechnik",
      46.310865,
      7.79925,
      "images/bar.png",
      25,
      25,
      '<h2>8 - Verein Stigma Elektronmit</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 18:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 300.-</p>\
        Status: Reserviert',
    ],

    [
      "Piärboy Heidnisch",
      46.311334,
      7.799821,
      "images/bar.png",
      25,
      25,
      '<h2>9 - Heidnischbier AG</h2>\
      <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
      <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
      <p>Preis: CHF 400.-</p>\
      Status: Reserviert',
    ],

    [
      "Pöschtli",
      46.309649,
      7.80025,
      "images/bar.png",
      25,
      25,
      '<h2>10 - DIE BAR</h2>\
    <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
    <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 19:00 Uhr - bis fertig</p>\
    <p>Preis: CHF 300.-</p>\
    Status: Reserviert',
    ],
  ];

  // Bar-marker
  const food_bars = [
    [
      "Parkplatz Maxenhaus 1",
      46.31169,
      7.8004,
      "images/Gastro.png",
      25,
      25,
      '<h2>101 - Valperca (Foodtruck)</h2>\
          <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
          <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
          <p>Preis: CHF 400.-</p>\
          Status: Reserviert',
    ],

    [
      "Parkplatz Maxenhaus 2",
      46.31177,
      7.800258,
      "images/Gastro.png",
      25,
      25,
      '<h2>102 - Pro Raronia Historica und Kulturstiftung</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 400.-</p>\
        Status: Reserviert',
    ],

    [
      "Burgersaal",
      46.31156,
      7.800238,
      "images/Gastro.png",
      25,
      25,
      '<h2>103 - Mittagstisch für Senioren am Samstag</h2>\
          <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
          <p style="margin-block-start: 3px;">Samstag: 11:00 Uhr - 14:00 Uhr</p>\
          <p>Preis: CHF 400.-</p>\
          Status: Reserviert',
    ],

    [
      "Stall vis-a-vis Burgersaal",
      46.311605,
      7.800008,
      "images/Gastro.png",
      25,
      25,
      '<h2>104 - Subieschmiede KLG</h2>\
          <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
          <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
          <p>Preis: CHF 400.-</p>\
          Status: Reserviert',
    ],

    [
      "Bänkli",
      46.3117,
      7.80016,
      "images/Gastro.png",
      25,
      25,
      '<h2>105 - Verein Kochende Frauen Raron</h2>\
          <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
          <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
          <p>Preis: CHF 400.-</p>\
          Status: Reserviert',
    ],
  ];

  // Restaurant-marker
  const restaurants = [
    [
      "Restaurant Schmitta",
      46.311236,
      7.799061,
      "images/Restaurant.png",
      25,
      25,
      "<h2>201</h2>\
        <h2>Restaurant Schmitta</h2>\
        <h3>Öffnungszeiten</h3><p>Freitag: 18:00 Uhr - bis fertig<br>Samstag: 12:00 Uhr - bis fertig</p>",
    ],

    [
      "Restaurant Rilke",
      46.310952,
      7.80012,
      "images/Restaurant.png",
      25,
      25,
      "<h2>202</h2>\
        <h2>Restaurant Rilke</h2>\
        <h3>Öffnungszeiten</h3><p>Freitag: 18:00 Uhr - bis fertig<br>Samstag: 12:00 Uhr - bis fertig</p>",
    ],

    [
      "Bäckerei Zenhäusern",
      46.310503,
      7.799832,
      "images/Restaurant.png",
      25,
      25,
      "<h2>203</h2>\
        <h2>Bäckerei Zenhäusern</h2>\
        <h3>Öffnungszeiten</h3><p>Freitag: 18:00 Uhr - 22:00 Uhr<br>Samstag: 12:00 Uhr - 22:00 Uhr</p>",
    ],

    [
      "Kapitel 7",
      46.309854,
      7.80028,
      "images/Restaurant.png",
      25,
      25,
      "<h2>204</h2>\
      <h2>Restaurant Kapitel 7</h2>\
      <h3>Öffnungszeiten</h3><p>Freitag: 18:00 Uhr - 22:00 Uhr<br>Samstag: 12:00 Uhr - 22:00 Uhr</p>",
    ],
  ];

  // Parking-marker
  const parking = [
    ["Schulhausplatz", 46.308303, 7.80164, "images/parking.png", 25, 25],

    ["Kirchplatz", 46.310218, 7.802364, "images/parking.png", 25, 25],
  ];

  // Sanitär-marker
  const sanitaer = [
    ["Kreisel Dorf", 46.31152, 7.799844, "images/Sanitär.png", 25, 25],

    ["Maxenhaus", 46.31159, 7.80053, "images/Sanitär.png", 25, 25],

    ["Parking Schmitta", 46.311034, 7.7991, "images/Sanitär.png", 25, 25],
  ];

  // Nachmittagsprogramm-marker
  const afternoon = [
    [
      "Air Zermatt",
      46.31136,
      7.799399,
      "images/brochure.png",
      25,
      25,
      "<h3>Air Zermatt</h3>",
    ],

    [
      "Theaterverein Raron",
      46.31109,
      7.799986,
      "images/brochure.png",
      25,
      25,
      "<h3>Theaterverein Raron</h3>",
    ],

    [
      "Samariterverein Raron-St.German",
      46.311773,
      7.800416,
      "images/brochure.png",
      25,
      25,
      "<h3>Samariterverein Raron-St.German</h3>",
    ],

    [
      "Jubla Raron",
      46.311382,
      7.800184,
      "images/brochure.png",
      25,
      25,
      "<h3>Jubla Raron</h3>",
    ],

    [
      "Jubla Raron",
      46.311533,
      7.799399,
      "images/brochure.png",
      25,
      25,
      "<h3>Jubla Raron</h3>",
    ],
  ];

  // Bühne-marker ////////////////////////////////////////
  const stage = [
    {
      position: { lat: 46.31136, lng: 7.799596 },
      map: map,
      icon: {
        url: "images/Band.png",
        scaledSize: new google.maps.Size(38, 35),
        optimized: false,
      },
      infoWindowContent: `<h3>Freitag - 01.09.2023</h3>
      <p>18:30 Uhr - 20:00 Uhr: TripleH-B </p>
      <p>21:00 Uhr - 22:00 Uhr: Riverbanks</p>
      <p>23:00 Uhr - 00:00 Uhr: The Unwritten Story</p>
      <h3>Samstag - 02.09.2023</h3>
      <p>12:00 Uhr - 15:00 Uhr: Bietschibotsche</p>
      <p>15:30 Uhr - 16:00 Uhr: Jodlerklub</p>
      <p>17:00 Uhr - 18:00 Uhr: Mini Playback Show by Jubla</p>
      <p>19:00 Uhr - 20:00 Uhr: Kentucky Moonshiners</p>
      <p>21:00 Uhr - 22:00 Uhr: Madstone</p>
      <p>23:00 Uhr - 00:30 Uhr: Whole Lotta DC</p>`,
    },
  ];

  const busStops = [
    {
      position: { lat: 46.30616248915186, lng: 7.801530337347227 },

      map: map,
      title: "Bahnhof Raron",
      icon: {
        url: "./images/trainStop.png",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
      },
      infoWindowContent:
        "<h3>Bahnhof Raron</h3>  <p>An- und Abreise mit dem Regio stündlich ab Brig und St. Maurice. </br> <a href='https://www.sbb.ch/de'>Hier geht's zum Fahrplan.</a>  </p> ",
    },
    {
      position: { lat: 46.30356892349157, lng: 7.8014837184476145 },
      map: map,
      title: "Busstation Bergheim",
      icon: {
        url: "./images/busStop.png",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
      },
      infoWindowContent: `  <h3>Bussstation Bergheim</h3>       <h4>Fahrplan:</h4>        <h5>Samstag</h5>        <ul>
                <li><b>Richtung Susten</b> ca. 02:00 Uhr (Bettmobil)</li>
                 <li><b>Richtung Susten</b> ca. 03:30 Uhr (Steiner Reisen)</li>          <li><b>Richtung Brig</b> ca. 02:30 Uhr (Steiner Reisen)</li>
                  <li> <b>Richtung Brig</b> ca. 03:45 Uhr (Bettmobil)</li>        </ul>
                      <h5>Sonntag</h5>        <ul>          <li><b>Richtung Susten</b> ca. 02:00 Uhr (Bettmobil)</li>
                <li><b>Richtung Susten</b> ca. 03:30 Uhr (Steiner Reisen)</li>
                  <li><b>Richtung Brig</b> ca. 02:30 Uhr (Steiner Reisen)</li>
                    <li><b>Richtung Brig</b> ca. 03:45 Uhr (Bettmobil)</li>       </ul>`,
    },
  ];

  const sanitaet = [
    {
      position: { lat: 46.311635, lng: 7.800258 },
      map: map,
      icon: {
        url: "images/Sanität.png",
        scaledSize: new google.maps.Size(30, 25),
        optimized: false,
      },
      infoWindowContent:
        "<h3>Sanität Raron</h3><p>Samariterverein Raron-St.German<p>",
    },
  ];

  // Nachschub-marker ////////////////////////////////////////
  const supplies = [
    {
      position: { lat: 46.31149, lng: 7.8002 },
      map: map,
      icon: {
        url: "images/supplies.png",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
      },
      infoWindowContent: "<h3>Nachschub</h3>",
    },
  ];
  // Place ATM markers
  // Create
  const atms = [
    {
      position: { lat: 46.30914985360714, lng: 7.799721723633649 },
      map: map,
      title: "Bankautomat Raiffeisen",
      icon: {
        url: "./images/atm.png",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
        fillColor: "red"

      },
      infoWindowContent: "<h3>Bankautomat Raiffeisen</h3>",
    },
    {
      position: { lat: 46.307804743765814, lng: 7.800516896599212 },
      map: map,
      title: "Bankautomat WKB",
      icon: {
        url: "./images/atm.png",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
      },
      infoWindowContent: "<h3>Bankautomat WKB</h3>",
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
        const infoWindow = new google.maps.InfoWindow({
          content: object.infoWindowContent,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        google.maps.event.addListener(map, "zoom_changed", function () {
          // If the map's zoom level is less than 17, hide the marker
          if (map.getZoom() < 17) {
            marker.setVisible(false);
          } else {
            // Otherwise, show the marker
            marker.setVisible(true);
          }
        });
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

            scaledSize: new google.maps.Size(currMarker[4], currMarker[5]),
            optimized: false,
          },
        });

        if (currMarker[6]) {
          const infowindow = new google.maps.InfoWindow({
            content: currMarker[6],
          });

          marker.addListener("click", () => {
            if (currentInfoWindow != null) {
              currentInfoWindow.close();
            }
            infowindow.open({
              anchor: marker,
              map,
            });
            currentInfoWindow = infowindow;
          });

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

  //   // Create an object to store the toggle status for each category
  // const categoryToggles = {
  //   drink_bars: true,
  //   food_bars: true,
  //   sanitaer: true,
  //   afternoon: true,
  //   stage: true,
  //   sanitaet: true,
  //   busStops: true,
  //   supplies: true,
  //   restaurants: true,
  //   parking: true,
  //   atms: true,
  //   // Add other categories here and set their initial toggle status
  // };

  // // Function to toggle markers based on category

  //   const markers = {
  //     drink_bars: [],
  //     food_bars: [],
  //     sanitaer: [],
  //     afternoon: [],
  //     stage: [],
  //     sanitaet: [],
  //     busStops: [],
  //     supplies: [],
  //     restaurants: [],
  //     parking: [],
  //     atms: [],
  //   };
  //     // Add other marker categories here

  //     function toggleMarkers(category, toggleStatus) {
  //       if (markers[category]) {
  //         markers[category].forEach((marker) => {
  //           marker.setVisible(toggleStatus);
  //         });
  //       }
  //     }

  // // Function to handle toggle button state and show/hide markers accordingly
  // function handleToggleButtons() {
  //   const drinkBarsToggle = document.getElementById('drinkBarsToggle');
  //   const foodBarsToggle = document.getElementById('foodBarsToggle');
  //   const sanitaerToggle = document.getElementById('sanitaerToggle');
  //   const afternoonToggle = document.getElementById('afternoonToggle');
  //   const stageToggle = document.getElementById('stageToggle');
  //   const sanitaetToggle = document.getElementById('sanitaetToggle');
  //   const busStopsToggle = document.getElementById('busStopsToggle');
  //   const suppliesToggle = document.getElementById('suppliesToggle');
  //   const restaurantsToggle = document.getElementById('restaurantsToggle');
  //   const parkingToggle = document.getElementById('parkingToggle');
  //   const atmsToggle = document.getElementById('atmsToggle');
  //   // Add other toggle buttons as needed

  //   // Add event listeners for each toggle button to update the toggle status
  //   drinkBarsToggle.addEventListener('change', (event) => {
  //     categoryToggles['drink_bars'] = event.target.checked;
  //     if (event.target.checked) {
  //       createMarkers(drink_bars);
  //     }
  //   });

  //   foodBarsToggle.addEventListener('change', (event) => {
  //     categoryToggles['food_bars'] = event.target.checked;
  //     if (event.target.checked) {
  //       createMarkers(food_bars);
  //     }

  //   });

  //   sanitaerToggle.addEventListener('change', (event) => {
  //     categoryToggles['sanitaer'] = event.target.checked;
  //     toggleMarkers('sanitaer', event.target.checked);
  //   });

  //   afternoonToggle.addEventListener('change', (event) => {
  //     categoryToggles['afternoon'] = event.target.checked;
  //     toggleMarkers('afternoon', event.target.checked);
  //   });

  //   stageToggle.addEventListener('change', (event) => {
  //     categoryToggles['stage'] = event.target.checked;
  //     toggleMarkers('stage', event.target.checked);
  //   });

  //   sanitaetToggle.addEventListener('change', (event) => {
  //     categoryToggles['sanitaet'] = event.target.checked;
  //     toggleMarkers('sanitaet', event.target.checked);
  //   });

  //   busStopsToggle.addEventListener('change', (event) => {
  //     categoryToggles['busStops'] = event.target.checked;
  //     toggleMarkers('busStops', event.target.checked);
  //   });

  //   suppliesToggle.addEventListener('change', (event) => {
  //     categoryToggles['supplies'] = event.target.checked;
  //     toggleMarkers('supplies', event.target.checked);
  //   });

  //   restaurantsToggle.addEventListener('change', (event) => {
  //     categoryToggles['restaurants'] = event.target.checked;
  //     toggleMarkers('restaurants', event.target.checked);
  //   });

  //   parkingToggle.addEventListener('change', (event) => {
  //     categoryToggles['parking'] = event.target.checked;
  //     toggleMarkers('parking', event.target.checked);
  //   });

  //   atmsToggle.addEventListener('change', (event) => {
  //     categoryToggles['atms'] = event.target.checked;
  //     toggleMarkers('atms', event.target.checked);
  //   })

  // }

  // // Add event listener for dialog open event
  // dialog.listen('MDCDialog:opened', () => {
  //   // Call the function to handle toggle buttons when the dialog is opened
  //   handleToggleButtons();
  // });

  // // Function to create markers for a given category if the toggle is set to true
  // function createMarkersForCategory(category) {
  //   if (categoryToggles[category]) {
  //     switch (category) {
  //       case 'sanitaer':
  //         markers['sanitaer'] = createMarkers(sanitaer);
  //         break;
  //       case 'afternoon':
  //         markers['afternoon'] = createMarkers(afternoon);
  //         break;
  //       case 'stage':
  //         markers['stage'] = createMarkers(stage);
  //         break;
  //       case 'sanitaet':
  //         markers['sanitaet'] = createMarkers(sanitaet);
  //         break;
  //       case 'busStops':
  //         markers['busStops'] = createMarkers(busStops);
  //         break;
  //       case 'supplies':
  //         markers['supplies'] = createMarkers(supplies);
  //         break;
  //       case 'drink_bars':
  //         markers['drink_bars'] = createMarkers(drink_bars);
  //         break;
  //       case 'food_bars':
  //         markers['food_bars'] = createMarkers(food_bars);
  //         break;
  //       case 'restaurants':
  //         markers['restaurants'] = createMarkers(restaurants);
  //         break;
  //       case 'parking':
  //         markers['parking'] = createMarkers(parking);
  //         break;
  //       case 'atms':
  //         markers['atms'] = createMarkers(atms);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }

  // // Create markers for each category if the corresponding toggle is set to true
  // createMarkersForCategory('sanitaer');
  // createMarkersForCategory('afternoon');
  // createMarkersForCategory('stage');
  // createMarkersForCategory('sanitaet');
  // createMarkersForCategory('busStops');
  // createMarkersForCategory('supplies');
  // createMarkersForCategory('drink_bars');
  // createMarkersForCategory('food_bars');
  // createMarkersForCategory('restaurants');
  // createMarkersForCategory('parking');
  // createMarkersForCategory('atms');

  createMarkers(sanitaer);
  createMarkers(afternoon);
  createMarkers(stage);
  createMarkers(sanitaet);
  createMarkers(busStops);
  createMarkers(supplies);
  createMarkers(drink_bars);
  createMarkers(food_bars);
  createMarkers(restaurants);
  createMarkers(parking);
  createMarkers(atms);
}

window.initMap = initMap;
