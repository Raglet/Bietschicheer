var map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 46.311449, lng: 7.799834 }, // Dorfplatz Raron
    zoom: 14, // 18 für Fest
    mapId: 'a32a14914e374824'
  });

  // Bar-marker
  const bars = [
    [
        "Bar Cipolla",
        46.311364,
        7.800744,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Bar Cipolla</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Garage Diego Zenhäusern",
        46.311370,
        7.800530,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Garage Diego Zenhäusern</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Parkplatz Maxenhaus",
        46.311759,
        7.800428,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Parkplatz Maxenhaus</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Burgersaal",
        46.311560,
        7.800238,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Burgersaal</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Stall vis-a-vis Burgersaal",
        46.311605,
        7.800008,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Stall vis-a-vis Burgersaal</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Platz vor Jublagarage",
        46.311493,
        7.800209,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Platz vor Jublagarage</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Gemeinde Partylokal",
        46.311434,
        7.800057,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Gemeinde Partylokal</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Parking Gemeinde",
        46.311473,
        7.799713,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Parking Gemeinde</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Garage Chez Karlen",
        46.311291,
        7.799512,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Garage Chez Karlen</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Letzte Festung",
        46.311278,
        7.799399,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Letzte Festung</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Stall des Paten",
        46.311035,
        7.798849,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>Stall des Paten</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "LM LaserArt Eventtechnik",
        46.310865,
        7.799250,
        "images/Gastro_2.png",
        25, 
        25,
        '<h2>LM LaserArt Eventtechnik</h2><p><a href="">www.samisbest.com</a></p>'
    ],
  ]; 

  // Restaurant-marker
  const restaurants = [
    [
        "Restaurant Schmitta",
        46.311236,
        7.799061,
        "images/Gastro.png",
        25, 
        25,
        '<h2>Restaurant Schmitta</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Restaurant Rilke",
        46.310952,
        7.800120,
        "images/Gastro.png",
        25, 
        25,
        '<h2>Restaurant Rilke</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Beck",
        46.310503,
        7.799832,
        "images/Gastro.png",
        25, 
        25,
        '<h2>Beck</h2><p><a href="">www.samisbest.com</a></p>'
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
        "Dorfplatz",
        46.311394,
        7.799802,
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


  // Bühne-marker
  const stage = new google.maps.Marker({
    position: { lat: 46.311470, lng: 7.799396 },
    map: map,
    icon: {
        url: "images/Band.png",
        scaledSize: new google.maps.Size(38, 35),
        optimized: false 
    },
    
  });

  const stage_infowindow = new google.maps.InfoWindow({
    content: "<h3>Festprogramm</h3><p>18:00 - 20:00: Sam41<p>",
  });

  stage.addListener("click", () => {
    stage_infowindow.open({
      anchor: stage,
      map,
    });
  });


  // Sanität-marker
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
    content: "<h3>Sanität Raron</h3><p>Kontakt: 0906 666 69 69<p>",
  });

  sanität.addListener("click", () => {
    sanität_infowindow.open({
      anchor: sanität,
      map,
    });
  });

  google.maps.event.addListener(map, "zoom_changed", function() {
    if (map.getZoom() < 16) {
        sanität.setVisible(false);
    } else {
        sanität.setVisible(true);
    }
  });


  // Place markers on map
  for (let i = 0; i < bars.length; i++){
    const currMarker = bars[i]

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
    
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
        });
      });

      google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < 17) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
      });
  }

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
    
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
        });
      });

      google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < 17) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
      });
  }

  for (let i = 0; i < parking.length; i++){
    const currMarker = parking[i]

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

      google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < 14) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
      });
  }

  for (let i = 0; i < sanitaer.length; i++){
    const currMarker = sanitaer[i]

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

      google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < 17) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
      });
  }
}

window.initMap = initMap;