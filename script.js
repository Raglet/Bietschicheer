var map;

// create var for current infowindow and declare it zero
var currentInfoWindow = null;


function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 46.311449, lng: 7.799834 }, // Dorfplatz Raron
    zoom: 18, // 18 für Fest
    mapId: 'a32a14914e374824'
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
        '<h2>Bar Cipolla</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 12:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 300.-</p>\
        Status: Frei'
    ],

    [
        "Garage Armando",
        46.311370,
        7.800530,
        "images/bar.png",
        25, 
        25,
        '<h2>Garage Armando</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 18:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 300.-</p>\
        Status: Frei'
    ],

    [
        "Gemeinde Partylokal",
        46.311434,
        7.800057,
        "images/bar.png",
        25, 
        25,
        '<h2>Gemeinde Partylokal</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 18:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 400.-</p>\
        Status: Frei'
    ],

    [
        "Parking Gemeinde",
        46.311473,
        7.799713,
        "images/bar.png",
        25, 
        25,
        '<h2>Parking Gemeinde</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 400.-</p>\
        Status: Reserviert - Verein Bietschicheer'
    ],

    [
        "Garage Chez Karlen",
        46.311291,
        7.799512,
        "images/bar.png",
        25, 
        25,
        '<h2>Garage Chez Karlen</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 12:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 400.-</p>\
        Status: Frei'
    ],

    [
        "Letzte Festung",
        46.311278,
        7.799399,
        "images/bar.png",
        25, 
        25,
        '<h2>Letzte Festung</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 12:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 400.-</p>\
        Status: Reserviert'
    ],

    [
        "Stall des Paten",
        46.311035,
        7.798849,
        "images/bar.png",
        25, 
        25,
        '<h2>Stall des Paten</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 18:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 300.-</p>\
        Status: Frei'
    ],

    [
        "LM LaserArt Eventtechnik",
        46.310865,
        7.799250,
        "images/bar.png",
        25, 
        25,
        '<h2>LM LaserArt Eventtechnik</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 18:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 300.-</p>\
        Status: Reserviert'
    ],

    [
      "Piärboy Heidnisch",
      46.311090,
      7.799996,
      "images/bar.png",
      25, 
      25,
      '<h2>Piärboy Heidnisch</h2>\
      <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
      <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 12:00 Uhr - bis fertig</p>\
      <p>Preis: CHF 300.-</p>\
      Status: Reserviert'
  ],
  ]; 

    // Bar-marker
    const food_bars = [
      [
          "Parkplatz Maxenhaus",
          46.311729,
          7.800288,
          "images/Gastro.png",
          25, 
          25,
          '<h2>Parkplatz Maxenhaus</h2>\
          <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
          <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
          <p>Preis: CHF 400.-</p>\
          Status: Reserviert'
      ],
  
      [
          "Burgersaal",
          46.311560,
          7.800238,
          "images/Gastro.png",
          25, 
          25,
          '<h2>Burgersaal</h2>\
          <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
          <p style="margin-block-start: 3px;">Samstag: 11:00 Uhr - 14:00 Uhr</p>\
          <p>Preis: CHF 400.-</p>\
          Status: Reserviert'
      ],
  
      [
          "Stall vis-a-vis Burgersaal",
          46.311605,
          7.800008,
          "images/Gastro.png",
          25, 
          25,
          '<h2>Stall vis-a-vis Burgersaal</h2>\
          <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
          <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
          <p>Preis: CHF 400.-</p>\
          Status: Frei'
      ],
  
      [
          "Platz vor Jublagarage",
          46.311493,
          7.800209,
          "images/Gastro.png",
          25, 
          25,
          '<h2>Platz vor Jublagarage</h2>\
          <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
          <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
          <p>Preis: CHF 400.-</p>\
          Status: Frei'
      ],

      [
        "Pöschtli",
        46.309649,
        7.800250,
        "images/Gastro.png",
        25, 
        25,
        '<h2>Pöschtli</h2>\
        <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
        <p style="margin-block-start: 3px;">Freitag: 18:00 Uhr - bis fertig<br>Samstag: 11:00 Uhr - bis fertig</p>\
        <p>Preis: CHF 300.-</p>\
        Status: Reserviert'
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
        '<h2>Restaurant Schmitta</h2><br><h3>Öffnungszeiten</h3><p>Freitag: 18:00 Uhr - bis fertig<br>Samstag: 12:00 Uhr - bis fertig</p>'
    ],

    [
        "Restaurant Rilke",
        46.310952,
        7.800120,
        "images/Restaurant.png",
        25, 
        25,
        '<h2>Restaurant Rilke</h2><br><h3>Öffnungszeiten</h3><p>Freitag: 18:00 Uhr - bis fertig<br>Samstag: 12:00 Uhr - bis fertig</p>'
    ],

    [
        "Bäckerei Zenhäusern",
        46.310503,
        7.799832,
        "images/Restaurant.png",
        25, 
        25,
        '<h2>Bäckerei Zenhäusern</h2><br><h3>Öffnungszeiten</h3><p>Freitag: 18:00 Uhr - 22:00 Uhr<br>Samstag: 12:00 Uhr - 22:00 Uhr</p>'
    ],

    [
      "Kapitel 7",
      46.309854,
      7.800280,
      "images/Restaurant.png",
      25, 
      25,
      '<h2>Kapitel 7</h2><br><h3>Öffnungszeiten</h3><p>Freitag: 18:00 Uhr - 22:00 Uhr<br>Samstag: 12:00 Uhr - 22:00 Uhr</p>'
    ],
  ];

  // Parking-marker
  const parking = [
    [
        "Schulhausplatz",
        46.308303,
        7.801640,
        "images/parking.png",
        25, 
        25,
    ],

    [
        "Kirchplatz",
        46.310218,
        7.802364,
        "images/parking.png",
        25, 
        25,
    ],
  ];

  // Sanitär-marker
  const sanitaer = [
    [
        "Kreisel Dorf",
        46.311320,
        7.799844,
        "images/Sanitär.png",
        25, 
        25,
    ],

    [
        "Maxenhaus",
        46.311650,
        7.800419,
        "images/Sanitär.png",
        25, 
        25,
    ],

    [
        "Parking Schmitta",
        46.311034,
        7.799100,
        "images/Sanitär.png",
        25, 
        25,
    ],
  ];



// use API to add markers

// Bühne-marker ////////////////////////////////////////
  const stage = new google.maps.Marker({
    position: { lat: 46.311470, lng: 7.799396 },
    map: map,
    icon: {
        url: "images/Band.png",
        scaledSize: new google.maps.Size(38, 35),
        optimized: false 
    },
    
  });

// Info Window
  const stage_infowindow = new google.maps.InfoWindow({
    content: 
    '<h3>Festprogramm</h3>\
    <h3 style="margin-block-end: 3px;">Freitag</h3>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">19:00 Uhr - 20:00 Uhr: TBA</p>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">18:00 Uhr - 20:00 Uhr: TBA</p>\
    <p style="margin-block-start: 3px;">22:30 Uhr - 24:00 Uhr: TBA</p>\
    <h3 style="margin-block-end: 3px;">Samstag</h3>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">14:00 Uhr - 16:00 Uhr: TBA</p>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">16:00 Uhr - 17:00 Uhr: Mini Playback Show by Jubla</p>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">19:00 Uhr - 20:00 Uhr: TBA</p>\
    <p style="margin-block-start: 3px; margin-block-end: 3px;">20:00 Uhr - 21:30 Uhr: TBA</p>\
    <p style="margin-block-start: 3px;">22:30 Uhr - 24:00 Uhr: TBA</p>',
  });

// open Info Window
  stage.addListener("click", () => {
    if (currentInfoWindow != null) { // check if other infowindow is open
    currentInfoWindow.close(); // if other infowindow is open, close it
    }
    stage_infowindow.open({
      anchor: stage,
      map,
    });
    currentInfoWindow = stage_infowindow; // declare new infowindow
  });

    // close on click on map
    google.maps.event.addListener(map, 'click', function(){
      stage_infowindow.close(map, sanität);
      });


  // Sanität-marker ////////////////////////////////////////
  const sanität = new google.maps.Marker({
    position: { lat: 46.311635, lng: 7.800258 },
    map: map,
    icon: {
        url: "images/Sanität.png",
        scaledSize: new google.maps.Size(30, 25),
        optimized: false 
    },
    
  });

  const sanität_infowindow = new google.maps.InfoWindow({
    content: "<h3>Sanität Raron</h3><p>Samariterverein Raron-St.German<p>",
  });

  // Infowindow: open by click
  sanität.addListener("click", () => {
    if (currentInfoWindow != null) { // check if other infowindow is open
      currentInfoWindow.close(); // if other infowindow is open, close it
    }
    sanität_infowindow.open({
      anchor: sanität,
      map,
    });
    currentInfoWindow = sanität_infowindow; // declare new infowindow
  });

      // close on click on map
      google.maps.event.addListener(map, 'click', function(){
        sanität_infowindow.close(map, sanität);
       });

  google.maps.event.addListener(map, "zoom_changed", function() {
    if (map.getZoom() < 16) {
        sanität.setVisible(false);
    } else {
        sanität.setVisible(true);
    }
  });


  // Place bar markers on map ////////////////////////////////////////
  for (let i = 0; i < drink_bars.length; i++){
    const currMarker = drink_bars[i]

    const marker = new google.maps.Marker({
        position: { lat: currMarker[1], lng: currMarker[2] },
        map: map,
        title: currMarker[0],
        icon: {
            url: currMarker[3],
            scaledSize: new google.maps.Size(currMarker[4], currMarker[5]),
            optimized: false 
        },
      });
    
      const infowindow = new google.maps.InfoWindow({
        content: currMarker[6],
      });
    
      // Infowindow: open by click
      marker.addListener("click", () => {
        if (currentInfoWindow != null) { // check if other infowindow is open
          currentInfoWindow.close(); // if other infowindow is open, close it
        }
        infowindow.open({
          anchor: marker,
          map,
        });
        currentInfoWindow = infowindow; // declare new infowindow

      });

      // close on click on map
      google.maps.event.addListener(map, 'click', function(){
        infowindow.close(map, marker);
       });

      google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < 17) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
      });
  }

 // Place Food markers on map ////////////////////////////////////////

  for (let i = 0; i < food_bars.length; i++){
    const currMarker = food_bars[i]

    const marker = new google.maps.Marker({
        position: { lat: currMarker[1], lng: currMarker[2] },
        map: map,
        title: currMarker[0],
        icon: {
            url: currMarker[3],
            scaledSize: new google.maps.Size(currMarker[4], currMarker[5]),
            optimized: false 
        },
      });
    
      const infowindow = new google.maps.InfoWindow({
        content: currMarker[6],
      });

    // Infowindow: open by click
      marker.addListener("click", () => {
        if (currentInfoWindow != null) { // check if other infowindow is open
          currentInfoWindow.close(); // if other infowindow is open, close it
        }
        infowindow.open({
          anchor: marker,
          map,
        });
        currentInfoWindow = infowindow; // declare new infowindow
      });

      // close on click on map
      google.maps.event.addListener(map, 'click', function(){
        infowindow.close(map, marker);
       });

      google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < 17) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
      });
  }

// Place restaurant markers on map ////////////////////////////////////////

  for (let i = 0; i < restaurants.length; i++){
    const currMarker = restaurants[i]

    const marker = new google.maps.Marker({
        position: { lat: currMarker[1], lng: currMarker[2] },
        map: map,
        title: currMarker[0],
        icon: {
            url: currMarker[3],
            scaledSize: new google.maps.Size(currMarker[4], currMarker[5]),
            optimized: false 
        },
      });
    
      const infowindow = new google.maps.InfoWindow({
        content: currMarker[6],
      });
    
      // Infowindow: open by click
      marker.addListener("click", () => {
        if (currentInfoWindow != null) { // check if other infowindow is open
          currentInfoWindow.close(); // if other infowindow is open, close it
        }
        infowindow.open({
          anchor: marker,
          map,
        });
        currentInfoWindow = infowindow; // declare new infowindow
      });

      // close on click on map
      google.maps.event.addListener(map, 'click', function(){
        infowindow.close(map, marker);
       });

      google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < 17) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
      });
  }

// Place parking markers on map ////////////////////////////////////////

// Iterate over the `parking` array using a for loop
for (let i = 0; i < parking.length; i++){
  // Get the current parking marker object from the `parking` array
  const currMarker = parking[i];

  // Create a new Google Maps marker object
  const marker = new google.maps.Marker({
      position: { lat: currMarker[1], lng: currMarker[2] }, // Set the marker's position using latitude and longitude values
      map: map, // Set the marker's map to be the specified `map`
      title: currMarker[0], // Set the marker's title to the first value in the `currMarker` array
      icon: { // Set the marker's icon using the `currMarker` array values
          url: currMarker[3], // Set the URL of the icon image
          scaledSize: new google.maps.Size(currMarker[4], currMarker[5]), // Set the size of the icon image
          optimized: false // Disable icon image optimization
      }
  });

  // Add a listener to the map's zoom_changed event
  google.maps.event.addListener(map, "zoom_changed", function() {
      // If the map's zoom level is less than 14, hide the marker
      if (map.getZoom() < 14) {
          marker.setVisible(false);
      // Otherwise, show the marker
      } else {
          marker.setVisible(true);
      }
  });
}




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
    icon: { // Set the marker's icon using the `currMarker` array values
      url: currMarker[3], // Set the URL of the icon image
      scaledSize: new google.maps.Size(currMarker[4], currMarker[5]), // Set the size of the icon image
      optimized: false // Disable icon image optimization
    }
  });

  // Add a listener to the map's zoom_changed event
  google.maps.event.addListener(map, "zoom_changed", function() {
    // If the map's zoom level is less than 17, hide the marker
    if (map.getZoom() < 17) {
      marker.setVisible(false);
    // Otherwise, show the marker
    } else {
      marker.setVisible(true);
    }
  });
}

}

window.initMap = initMap;