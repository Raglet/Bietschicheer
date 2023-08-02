var map;

// create var for current infowindow and declare it zero
var currentInfoWindow = null;

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

  // use API to add markers

  // Bühne-marker ////////////////////////////////////////
  const stage = new google.maps.Marker({
    position: { lat: 46.31136, lng: 7.799596 },
    map: map,
    icon: {
      url: "images/Band.png",
      scaledSize: new google.maps.Size(38, 35),
      optimized: false,
    },
  });

  // Info Window
  const stage_infowindow = new google.maps.InfoWindow({
    content:
      '<h3 style="margin-block-end: 3px;">Freitag - 01.09.2023</h3>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">18:30 Uhr - 20:00 Uhr: TripleH-B </p>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">21:00 Uhr - 22:00 Uhr: Riverbanks</p>\
    <p style="margin-block-start: 3px;">23:00 Uhr - 00:00 Uhr: The Unwritten Story</p>\
    <h3 style="margin-block-end: 3px;">Samstag - 02.09.2023</h3>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">12:00 Uhr - 15:00 Uhr: Bietschibotsche</p>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">15:30 Uhr - 16:00 Uhr: Jodlerklub</p>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">17:00 Uhr - 18:00 Uhr: Mini Playback Show by Jubla</p>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">19:00 Uhr - 20:00 Uhr: Kentucky Moonshiners</p>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">21:00 Uhr - 22:00 Uhr: Madstone</p>\
    <p style="margin-block-start: 3px;">23:00 Uhr - 00:30 Uhr: Whole Lotta DC</p>',
  });

  // open Info Window
  stage.addListener("click", () => {
    if (currentInfoWindow != null) {
      // check if other infowindow is open
      currentInfoWindow.close(); // if other infowindow is open, close it
    }
    stage_infowindow.open({
      anchor: stage,
      map,
    });
    currentInfoWindow = stage_infowindow; // declare new infowindow
  });

  // close on click on map
  google.maps.event.addListener(map, "click", function () {
    stage_infowindow.close(map, sanität);
  });

  // Sanität-marker ////////////////////////////////////////
  const sanität = new google.maps.Marker({
    position: { lat: 46.311635, lng: 7.800258 },
    map: map,
    icon: {
      url: "images/Sanität.png",
      scaledSize: new google.maps.Size(30, 25),
      optimized: false,
    },
  });

  const sanität_infowindow = new google.maps.InfoWindow({
    content: "<h3>Sanität Raron</h3><p>Samariterverein Raron-St.German<p>",
  });

  // Infowindow: open by click
  sanität.addListener("click", () => {
    if (currentInfoWindow != null) {
      // check if other infowindow is open
      currentInfoWindow.close(); // if other infowindow is open, close it
    }
    sanität_infowindow.open({
      anchor: sanität,
      map,
    });
    currentInfoWindow = sanität_infowindow; // declare new infowindow
  });

  // close on click on map
  google.maps.event.addListener(map, "click", function () {
    sanität_infowindow.close(map, sanität);
  });

  google.maps.event.addListener(map, "zoom_changed", function () {
    if (map.getZoom() < 16) {
      sanität.setVisible(false);
    } else {
      sanität.setVisible(true);
    }
  });

  // Nachschub-marker ////////////////////////////////////////
  const supplies = new google.maps.Marker({
    position: { lat: 46.31149, lng: 7.8002 },
    map: map,
    icon: {
      url: "images/supplies.png",
      scaledSize: new google.maps.Size(25, 25),
      optimized: false,
    },
  });

  const supplies_infowindow = new google.maps.InfoWindow({
    content: "<h3>Nachschub</h3>",
  });

  // Infowindow: open by click
  supplies.addListener("click", () => {
    if (currentInfoWindow != null) {
      // check if other infowindow is open
      currentInfoWindow.close(); // if other infowindow is open, close it
    }
    supplies_infowindow.open({
      anchor: supplies,
      map,
    });
    currentInfoWindow = supplies_infowindow; // declare new infowindow
  });

  // close on click on map
  google.maps.event.addListener(map, "click", function () {
    supplies_infowindow.close(map, supplies);
  });

  google.maps.event.addListener(map, "zoom_changed", function () {
    if (map.getZoom() < 17) {
      supplies.setVisible(false);
    } else {
      supplies.setVisible(true);
    }
  });

  // Place bar markers on map ////////////////////////////////////////
  for (let i = 0; i < drink_bars.length; i++) {
    const currMarker = drink_bars[i];

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

    const infowindow = new google.maps.InfoWindow({
      content: currMarker[6],
    });

    // Infowindow: open by click
    marker.addListener("click", () => {
      if (currentInfoWindow != null) {
        // check if other infowindow is open
        currentInfoWindow.close(); // if other infowindow is open, close it
      }
      infowindow.open({
        anchor: marker,
        map,
      });
      currentInfoWindow = infowindow; // declare new infowindow
    });

    // close on click on map
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

  // Place Food markers on map ////////////////////////////////////////

  for (let i = 0; i < food_bars.length; i++) {
    const currMarker = food_bars[i];

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

    const infowindow = new google.maps.InfoWindow({
      content: currMarker[6],
    });

    // Infowindow: open by click
    marker.addListener("click", () => {
      if (currentInfoWindow != null) {
        // check if other infowindow is open
        currentInfoWindow.close(); // if other infowindow is open, close it
      }
      infowindow.open({
        anchor: marker,
        map,
      });
      currentInfoWindow = infowindow; // declare new infowindow
    });

    // close on click on map
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

  // Place restaurant markers on map ////////////////////////////////////////

  for (let i = 0; i < restaurants.length; i++) {
    const currMarker = restaurants[i];

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

    const infowindow = new google.maps.InfoWindow({
      content: currMarker[6],
    });

    // Infowindow: open by click
    marker.addListener("click", () => {
      if (currentInfoWindow != null) {
        // check if other infowindow is open
        currentInfoWindow.close(); // if other infowindow is open, close it
      }
      infowindow.open({
        anchor: marker,
        map,
      });
      currentInfoWindow = infowindow; // declare new infowindow
    });

    // close on click on map
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

  // Place parking markers on map ////////////////////////////////////////

  // Iterate over the `parking` array using a for loop
  for (let i = 0; i < parking.length; i++) {
    // Get the current parking marker object from the `parking` array
    const currMarker = parking[i];

    // Create a new Google Maps marker object
    const marker = new google.maps.Marker({
      position: { lat: currMarker[1], lng: currMarker[2] }, // Set the marker's position using latitude and longitude values
      map: map, // Set the marker's map to be the specified `map`
      title: currMarker[0], // Set the marker's title to the first value in the `currMarker` array
      icon: {
        // Set the marker's icon using the `currMarker` array values
        url: currMarker[3], // Set the URL of the icon image
        scaledSize: new google.maps.Size(currMarker[4], currMarker[5]), // Set the size of the icon image
        optimized: false, // Disable icon image optimization
      },
    });

    // Add a listener to the map's zoom_changed event
    google.maps.event.addListener(map, "zoom_changed", function () {
      // If the map's zoom level is less than 14, hide the marker
      if (map.getZoom() < 14) {
        marker.setVisible(false);
        // Otherwise, show the marker
      } else {
        marker.setVisible(true);
      }
    });
  }

  // Place ATM markers
  // Create
  const atms = [
    {
      position: { lat: 46.30914985360714, lng: 7.799721723633649 },
      map: map,
      title: "Bankomat Raiffeisen",
      icon: {
        url: "./images/atm.png",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
      },
      infoWindowContent: "<h3>Bankomat Raiffeisen</h3>",
    },
    {
      position: { lat: 46.307804743765814, lng: 7.800516896599212 },
      map: map,
      title: "Bankomat WKB",
      icon: {
        url: "./images/atm.png",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
      },
      infoWindowContent: "<h3>Bankomat WKB</h3>",
    },
  ];

  atms.forEach((atm) => {
    const marker = new google.maps.Marker(atm);
    const infoWindow = new google.maps.InfoWindow({
      content: atm.infoWindowContent,
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

  // Place öV-Stop markers
  // Create Object
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
      infoWindowContent:
        "  <h3>Bussstation Bergheim</h3>        <h4>Fahrplan:</h4>        <h5>Samstag</h5>        <ul>          <li><b>Richtung Susten</b> ca. 02:00 Uhr (Bettmobil)</li>          <li><b>Richtung Susten</b> ca. 03:30 Uhr (Steiner Reisen)</li>          <li><b>Richtung Brig</b> ca. 02:30 Uhr (Steiner Reisen)</li>          <li><b>Richtung Brig</b> ca. 03:45 Uhr (Bettmobil)</li>        </ul>        <h5>Sonntag</h5>        <ul>          <li><b>Richtung Susten</b> ca. 02:00 Uhr (Bettmobil)</li>          <li><b>Richtung Susten</b> ca. 03:30 Uhr (Steiner Reisen)</li>          <li><b>Richtung Brig</b> ca. 02:30 Uhr (Steiner Reisen)</li>        <li><b>Richtung Brig</b> ca. 03:45 Uhr (Bettmobil)</li>       </ul>",
    },
  ];

  busStops.forEach((atm) => {
    const marker = new google.maps.Marker(atm);
    const infoWindow = new google.maps.InfoWindow({
      content: atm.infoWindowContent,
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

  // Places toilet markers
  // Iterate over the `sanitaer` array using a for loop
  for (let i = 0; i < sanitaer.length; i++) {
    // Get the current toilet marker object from the `sanitaer` array
    const currMarker = sanitaer[i];

    // Create a new Google Maps marker object
    const marker = new google.maps.Marker({
      position: { lat: currMarker[1], lng: currMarker[2] }, // Set the marker's position using latitude and longitude values
      map: map, // Set the marker's map to be the specified `map`
      title: currMarker[0], // Set the marker's title to the first value in the `currMarker` array
      icon: {
        // Set the marker's icon using the `currMarker` array values
        url: currMarker[3], // Set the URL of the icon image
        scaledSize: new google.maps.Size(currMarker[4], currMarker[5]), // Set the size of the icon image
        optimized: false, // Disable icon image optimization
      },
    });

    // Add a listener to the map's zoom_changed event
    google.maps.event.addListener(map, "zoom_changed", function () {
      // If the map's zoom level is less than 17, hide the marker
      if (map.getZoom() < 17) {
        marker.setVisible(false);
        // Otherwise, show the marker
      } else {
        marker.setVisible(true);
      }
    });
  }

  // Places Nachmittags-Programm markers
  // Iterate over the `afternoon` array using a for loop
  for (let i = 0; i < afternoon.length; i++) {
    const currMarker = afternoon[i];

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

    const infowindow = new google.maps.InfoWindow({
      content: currMarker[6],
    });

    // Infowindow: open by click
    marker.addListener("click", () => {
      if (currentInfoWindow != null) {
        // check if other infowindow is open
        currentInfoWindow.close(); // if other infowindow is open, close it
      }
      infowindow.open({
        anchor: marker,
        map,
      });
      currentInfoWindow = infowindow; // declare new infowindow
    });

    // close on click on map
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

window.initMap = initMap;
