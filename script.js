let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 46.311449, lng: 7.799834 }, // Dorfplatz Raron
    zoom: 18, // 18 für Fest
    mapId: 'a32a14914e374824'
  });

  // Bar-marker

  const bars = [
    [
        "Bar Cipolla",
        46.311364,
        7.800744,
        "images/bar.png",
        25, 
        25,
        '<h2>Bar Cipolla</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Garage Diego Zenhäusern",
        46.311370,
        7.800530,
        "images/bar.png",
        25, 
        25,
        '<h2>Garage Diego Zenhäusern</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Parkplatz Maxenhaus",
        46.311759,
        7.800428,
        "images/bar.png",
        25, 
        25,
        '<h2>Parkplatz Maxenhaus</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Burgersaal",
        46.311585,
        7.800238,
        "images/bar.png",
        25, 
        25,
        '<h2>Burgersaal</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Stall vis-a-vis Burgersaal",
        46.311605,
        7.800008,
        "images/bar.png",
        25, 
        25,
        '<h2>Stall vis-a-vis Burgersaal</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Platz vor Jublagarage",
        46.311493,
        7.800209,
        "images/bar.png",
        25, 
        25,
        '<h2>Platz vor Jublagarage</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Gemeinde Partylokal",
        46.311434,
        7.800057,
        "images/bar.png",
        25, 
        25,
        '<h2>Gemeinde Partylokal</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Parking Gemeinde",
        46.311473,
        7.799713,
        "images/bar.png",
        25, 
        25,
        '<h2>Parking Gemeinde</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Restaurant Rilke",
        46.310952,
        7.800120,
        "images/bar.png",
        25, 
        25,
        '<h2>Restaurant Rilke</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Garage Chez Karlen",
        46.311291,
        7.799512,
        "images/bar.png",
        25, 
        25,
        '<h2>Garage Chez Karlen</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Letzte Festung",
        46.311278,
        7.799399,
        "images/bar.png",
        25, 
        25,
        '<h2>Letzte Festung</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Stall des Paten",
        46.311035,
        7.798849,
        "images/bar.png",
        25, 
        25,
        '<h2>Stall des Paten</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "LM LaserArt Eventtechnik",
        46.310865,
        7.799250,
        "images/bar.png",
        25, 
        25,
        '<h2>LM LaserArt Eventtechnik</h2><p><a href="">www.samisbest.com</a></p>'
    ],

    [
        "Beck",
        46.310503,
        7.799832,
        "images/bar.png",
        25, 
        25,
        '<h2>Beck</h2><p><a href="">www.samisbest.com</a></p>'
    ],
  ]; 

  for (let i = 0; i < bars.length; i++){
    const currMarker = bars[i]

    const marker = new google.maps.Marker({
        position: { lat: currMarker[1], lng: currMarker[2] },
        map: map,
        title: currMarker[0],
        icon: {
            url: currMarker[3],
            scaledSize: new google.maps.Size(currMarker[4], currMarker[5]),
            optimized: true 
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
  }

  // Bühne-marker
  const stage = new google.maps.Marker({
    position: { lat: 46.311470, lng: 7.799396 },
    map: map,
    icon: {
        url: "images/Bühne.png",
        scaledSize: new google.maps.Size(30, 25),
        optimized: true 
    },
  });
}

window.initMap = initMap;