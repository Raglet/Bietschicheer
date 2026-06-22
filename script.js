var map;
var currentInfoWindow = null;

const C = {
  primärHell:         "#996f91",
  primärDunkel:       "#663f5e",
  hintergrundDunkel:  "#404040",
  hintergrundHell:    "#a5a5a5",
  hintergrundNeutral: "#e1e1e1",
  sekundärHell:       "#4384a2",
  sekundärDunkel:     "#364954",
};

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
    disableDefaultUI: true,
    styles: [
      { featureType: "poi",     stylers: [{ visibility: "off" }] },
      { featureType: "transit", stylers: [{ visibility: "off" }] },

      // Land & buildings
      { featureType: "landscape",           elementType: "geometry.fill",   stylers: [{ color: C.hintergrundNeutral }] },
      { featureType: "landscape.man_made",  elementType: "geometry.fill",   stylers: [{ color: C.hintergrundNeutral }] },
      { featureType: "landscape.man_made",  elementType: "geometry.stroke", stylers: [{ color: C.primärDunkel }] },

      // Water
      { featureType: "water", elementType: "geometry.fill",    stylers: [{ color: C.sekundärHell }] },
      { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: C.sekundärDunkel }] },

      // Roads
      { featureType: "road",         elementType: "geometry.fill",    stylers: [{ color: C.primärHell}] },
      { featureType: "road",         elementType: "geometry.stroke",  stylers: [{ color: C.hintergrundHell }] },
      { featureType: "road.highway", elementType: "geometry.fill",    stylers: [{ color: C.hintergrundNeutral }] },
      { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },

      // Administrative labels
      { featureType: "administrative", elementType: "labels.text.fill",   stylers: [{ color: C.primärDunkel }] },
      { featureType: "administrative", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
    ]
  });

  // add informations about all locations in constants
  // Bar-marker
  const drink_bars = [
    [
      "Ecoumra",
      46.31137,
      7.80053,
      "icons/bar.svg",
      25,
      25,
      `\
      <div class="images">\
      <img src="./images/logos/ecoumra.png" class="content-logo" alt="schrifft-Ecoumra"   />\
      <span class="name-badge">ecoumbra</span>\
      </div>\
      <div class="content-title-wrapper">\
      <h3 class="content-subtitle">by Ecoumra</h3>\
      </div>\
      <hr>\
      <p ><span class="flex-section"> <strong>Musik:</strong> Lounge Musik </span> <p> \
        `,
    ],

    [
      "Mesireccas",
      46.311434,
      7.800057,
      "icons/bar.svg",
      25,
      25,
      ` <div class="images">\
      <img src="./images/logos/mesi.jpg" class="content-logo" alt="logo Ecoumra"   />\
      <span class="name-badge">mesireccas</span>\
      </div>\

        <div class="content-title-wrapper">\
        <h3 class="content-subtitle">by Guggenmusik </br> Mesireccas</h3>\
        </div>\
        <hr>\
        <p>
        <span  class="flex-section">
          <strong>Musik:</strong>
          <span >Vorgschmack verd </br> Mesireccas</span>
        </span>
        <br/>
        <span class="flex-section" >
          <strong>Essen:</strong>
          <span class="flex-section" >Hot-Dog (ab 23:00)</span>
        </span>
      </p>

        `,
    ],

    [
      "Bietschicheer",
      46.311553,
      7.799596,
      "icons/bar.svg",
      25,
      25,
      ` \
      <div class="images" >\

       <img src="./images/logos/cheer.png" class="content-logo" alt="logo Bietschicheer" style="height: 30px"  />\
       <span class="name-badge">bietschich</span>\

       </div>\
      <div class="content-title-wrapper">\
      <h3 class="content-subtitle">by Verein </br> Bietschicheer</h3>\
      </div>\
      <hr>\
      <p>\
      <span class="flex-section" >   <strong>Essen:</strong> Curryreis </span>\
      <p>\
      `,
    ],

    [
      "EHC-Raron",
      46.311291,
      7.799512,
      "icons/bar.svg",
      25,
      25,
      ` \
      <div class="images">\
      <img src="./images/logos/ehc.png" class="content-logo" alt="logo EHC"  />\
      <span class="name-badge">ehc</span>\
      </div>\
     <div class="content-title-wrapper">\
      </div>\
     <hr>\
     <p>\
     <span class="flex-section" >   <strong >Musik:</strong> Party Sound </span>\
     <p>\
     `,
    ],

    [
      "Kickers Raron",
      46.311364,
      7.800744,
      "icons/bar.svg",
      25,
      25,
      ` \
      <div class="images">\

      <img src="./images/logos/kickers.png" class="content-logo" alt="logo Kickerbar"/>\
      <span class="name-badge">12er</span>\
      </div>\
      <div class="content-title-wrapper">\
      <h3 class="content-subtitle">by Kickers Raron</h3>\
      </div>\
      <hr>\
      <p>\
      <span class="flex-section" >  <strong>Musik:</strong> Chriz und Queer </span>\
      <p>`,
    ],

    [
      "Stigma Crew",
      46.310865,
      7.79925,
      "icons/bar.svg",
      25,
      25,
      ` \
      <div class="images">\

      <img src="./images/logos/stigma.jpg" class="content-logo" alt="logo EHC"  />\
      <span class="name-badge">stigma</span>\
      </div>\
      <div class="content-title-wrapper">\
      <h3 class="content-subtitle">by Stigma  Crew</h3>\
      </div>\
      <hr>\
      <p>\
      <span class="flex-section" >    <strong>Musik:</strong> elektronische </br> Tanzmusik  </span> \
      </br> \
      <span class="flex-section" >   <strong>Essen:</strong> Hot-Dog (ab 23:00)  </span>\
      <p>\
     `,
    ],

    [
      "Heidnischbier",
      46.311334,
      7.799821,
      "icons/bar.svg",
      25,
      25,
      ` \
      <div class="images">\
      <img src="./images/logos/heidnisch.jpg" class="content-logo" alt="logo heidnisch"   />\
      <span class="name-badge">heidnisch</span>\
      </div>
     <hr>\
     <p>\
     <span class="flex-section">   <strong>Musik:</strong> Beer-Beats  </span> \
     <p>\ `,
    ],

    [
      "DIE BAR",
      46.309649,
      7.80025,
      "icons/bar.svg",
      25,
      25,
      ` \
      <div class="images">\
      <span class="name-badge">diebar</span>\
      </div>\
     <div class="content-title-wrapper" ">\
     </div>\
     <hr>\
     <p>\
     <span class="flex-section">  <strong>Musik:</strong> Blues and more </span>\
 <div style="display: flex; flex-direction: column;">

     <span class="flex-section">
     <strong style="font-weight: bold;">Essen:</strong>
     <span class="food-list">
       <ul style="list-style-type: "-" ; padding-left: wre !important; 	">
         <li>Croque Monsieur</li>
         <li>Veganer Gurkendip</li>
       </ul>
     </span>
     </div>
     </p>\
     `,
    ],

    [
      "Pro Raronia Historica & Kulturstiftung",
      46.31177,
      7.800258,
      "icons/bar.svg",
      25,
      25,
      `     \
      <div class="images">\
<div style="display:flex; flex-direction: column; margin:auto 0 ;">
<img src="./images/logos/proRaronia.jpg" class="content-logo" alt="Pro Raronia Historica"  />\
<img src="./images/logos/kulturStiftung.png" class="content-logo" alt="logo-kulturStiftung" style="width: 200px; height: auto; " />\
</div>\
      <span class="name-badge">kulu</span>\
      </div>\

   <div class="content-title-wrapper">\
     <h3 class="content-subtitle">by Pro Raronia Historica </br> & Kulturstiftung</h3>\
      </div>\
     <hr>\<p>
     <span class="flex-section">   <strong>Essen:</strong> Lachsbrötchen </span> \
</p>
     `,
    ],
  ];

  // Bar-marker
  const food_bars = [
    [
      "Valperca Foodtruck",
      46.31169,
      7.8004,
      "icons/food.svg",
      25,
      25,
      ` \
      <div class="images" >\

      <img src="./images/logos/valperca.png" class="content-logo" alt="logo valperca" style="height : 50px"  />\
      <span class="name-badge">valp</span>\

      </div>\
      <div class="content-title-wrapper" >\
      <h2 class="content-subtitle">by Valperca </h2>\
      </div>\
      <hr>\
      <p>
      <div style="display: flex; flex-direction: column">
      <span class="flex-section">
        <strong>Essen:</strong>
        <span class="food-list">
          <ul style="list-style-type: "-" ; padding-left: 0 ;">
            <li >Egli-Knusperli mit Pommes</li>
            <li>Eglibratwurst</li>
          </ul>
        </span>
      </span>
      <div>
    </p>



      \
      `,
    ],

    // [
    //   "Burgersaal",
    //   46.31156,
    //   7.800238,
    //   "icons/food.svg",
    //   25,
    //   25,
    //   '<h2>103 - Mittagstisch für Senioren am Samstag</h2>\
    //       <h3 style="margin-block-end: 3px;">Öffnungszeiten</h3>\
    //       <p style="margin-block-start: 3px;">Samstag: 11:00 Uhr - 14:00 Uhr</p>\
    //       <p>Preis: CHF 400.-</p>\
    //       Status: Reserviert',
    // ],

    [
      "Subieschmiede",
      46.311605,
      7.800008,
      "icons/food.svg",
      25,
      25,
      ` \
      <div class="images">\
    <img src="./images/logos/subieschmiede.jpeg" class="content-logo" alt="logo-subieschmiede"  style="height: 20px;"  />\
    <span class="name-badge">subi</span>\
    </div>\
  <div class="content-title-wrapper" >\
      <h3 class="content-subtitle">by Subieschmiede </h3>\
      </div>\
      <hr>\
      <p>
      <div style="display: flex; flex-direction: column;">
        <span class="flex-section">
          <strong>Essen:</strong>
          <span class="food-list">
            <ul style="list-style-type: "-"; padding-left: 0;">
              <li>Kaffee & Kuchen</li>
              <li>Snacks aller Art</li>
            </ul>
          </span>
        </span>
      </div>
    </p>

    `,
    ],

    [
      "Kochende Frauen",
      46.3117,
      7.80016,
      "icons/food.svg",
      25,
      25,
      ' \
      <div class="images">\
      <img src="./images/logos/kochendeFrauen.png" class="content-logo" alt="logo-kochendeFrauen"  style="height: 50px;" />\
      <span class="name-badge">kochendeFr</span>\
      </div>\
      <div class="content-title-wrapper" >\
      <h3 class="content-subtitle">by Kochende Frauen</h3>\
      </div>\
      <hr>\
      <p>\
    <span class="flex-section">  <strong>Essen:</strong> Bratwurst / Schübling mit Salat </span> \
      <p>\
       ',
    ],
    [
      "Bäckerei Zenhäusern",
      46.310503,
      7.799832,
      "icons/food.svg",
      25,
      25,
      ` \
      <div class="images">\
      <img src="./images/logos/zenheusern.png" class="content-logo" alt="logo-zenheusern"  />\
      <span class="name-badge">beck</span>\
      </div>\
      <div class="content-title-wrapper"   >\
      <h3 class="content-subtitle">by Bäckerei </br>  Zenhäusern Raron</h3>\
      </div>\
      <hr>\
      <p>\
      <span class="flex-section">   <strong>Musik: </strong> Volkstümliche Musik  </span>
      </br>
      <span class="flex-section">     <strong>Essen: </strong>  Raclette  </span>
      </p>\
      </div>\
           `,
    ],
  ];

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
      "Restaurant Rilke",
      46.310952,
      7.80012,
      "icons/restaurant.svg",
      25,
      25,
      ' \
      <div class="content-title-wrapper" style="margin-top: 0;">\
      <h2 class="content-title">Restaurant Rilke</h2>\
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

  // Nachmittagsprogramm-marker
  const afternoon = [
    [
      "Theaterverein Raron",
      46.31109,
      7.799986,
      "icons/nachmittag.svg",
      25,
      25,
      ' \
     ` <div class="images">\
      <img src="./images/logos/theaterverein.png" class="content-logo" alt="logo-Theaterverein" style="height: 35px;"   />\
      <span class="name-badge">theater</span>\
      </div>\
        <div class="content-title-wrapper" >\
        <h3 class="content-subtitle">by Theaterverein </br> Raron</h3>\
        </div>\
        <hr>\
        <p style="max-width: 200px">\
          Zeig uns dein schauspielerisches Talent! \
          </br> \
          Lass dich auf der Bühne ablichten. \
          </br> \
          <p>\
        </div> \
         ',
    ],

    // [
    //   "Samariterverein Raron-St.German",
    //   46.311773,
    //   7.800416,
    //   "icons/nachmittag.svg",
    //   25,
    //   25,
    //   "<h3>Samariterverein Raron-St.German</h3>",
    // ],

    [
      "Jubla Raron",
      46.311382,
      7.800184,
      "icons/nachmittag.svg",
      25,
      25,
      `  <div style="width : 200px "> \
      <div class="images">\
      <img src="./images/logos/jubla.png" class="content-logo" alt="logo-Theaterverein"   />\
      <span class="name-badge">jubla</span>\
      </div>\

        <hr>\
        <p>
        Spiel und spass für die ganze Familie! </br>
        Spiele Spiele, lass dich schminken oder eine verrückte Frisur machen, nimm an einer Schatzsuche teil und noch vieles mehr. </p>      `,
    ],

    [
      "Fluggruppe Oberwallis",
      46.31167210179692,
      7.8005441587539766,
      "icons/nachmittag.svg",
      25,
      25,
      ` <div class="images">\
      <img src="./images/logos/fluggruppe.jpg" class="content-logo" alt="logo-Theaterverein"   />\
      <span class="name-badge">fluggr</span>\
      </div>\
        <div class="content-title-wrapper" style="width: 205px;" >\
        </div>\
        <hr>\
        <p style="max-width: 200px">\
        Baue dein eigenes Modellflugzeug! \
        <p>\
      `,
    ],
    [
      "Jubla Raron",
      46.31189681656011,
      7.800069928935517,
      "icons/nachmittag.svg",
      25,
      25,
      '  <div class="images">\
      <img src="./images/logos/fluggruppe.jpg" class="content-logo" alt="logo-Theaterverein"   />\
      <span class="name-badge">hüfp</span>\
      </div>\
        <div class="content-title-wrapper" >\
        <h3 class="content-subtitle">by Fluggruppe</br> Oberwallis</h3>\
        </div>\
         ',
    ],
  ];

  // Bühne-marker ////////////////////////////////////////
  const stage = [
    {
      position: { lat: 46.31136, lng: 7.799596 },
      map: map,
      icon: {
        url: "icons/stage.png",
        scaledSize: new google.maps.Size(35, 35),
        optimized: false,
      },
      infoWindowContent: `
        <div class="images">\

        <span class="name-badge">bühne</span>\
        </div>

        <div class="content-title-wrapper">\
        <h3 class="content-subtitle">Programm</h3>\
        </div>\
        <div class="lineup" >
        <p>Freitag</p>
        <span class="name-badge">freitag</span>\
        <p style="clear: left;">Samstag</p>        <span class="name-badge">samstag</span>\

 </div>


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
         \
         \
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
      // infoWindowContent:
      //   "<h3>Sanität Raron</h3><p>Samariterverein Raron-St.German<p>",
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
      <span class="name-badge">ticket</span>\
      `,
      visibleDefault: true,
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

          google.maps.event.addListener(map, "zoom_changed", function () {
            // if (map.getZoom() < 17 || !categoryToggles[categoryName]) {
            //   marker.setVisible(false);
            // } else {
            //   marker.setVisible(true);
            // }
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
  //       createMarkers(drink_bars, "drink_bars");
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
  // function     createMarkersForCategory(category) {
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
  createMarkers(drink_bars);
  createMarkers(food_bars);
  createMarkers(restaurants);
  createMarkers(parking);
  createMarkers(atms);
  createMarkers(info);
}

window.initMap = initMap;
