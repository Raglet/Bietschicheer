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
    disableDefaultUI: true
  });

  // add informations about all locations in constants
  // Bar-marker
  const drink_bars = [


    [
      "Ecoumra",
      46.31137,
      7.80053,
      "images/bar.svg",
      25,
      25,
      `\
      <div class="images">\
      <img src="./images/logos/ecoumra.png" class="content-logo" alt="schrifft-Ecoumra"   />\
      <img src="./images/namen/ecoumbra.png" class="content-name" alt="logo Ecoumra"   />\
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
      "images/bar.svg",
      25,
      25,
      ` <div class="images">\
      <img src="./images/logos/mesi.jpg" class="content-logo" alt="logo Ecoumra"   />\
      <img src="./images/namen/mesireccas.png" class="content-logo" alt="schrifft-Ecoumra"   />\
      </div>\

        <div class="content-title-wrapper">\
        <h3 class="content-subtitle">by Guggenmusik </br> Mesireccas</h3>\
        </div>\
        <hr>\
        <p>
        <span  class="flex-section">
          <strong>Musik:</strong>
          <span >Vorgschmak verd </br> Mesireccas</span>
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
      "images/bar.svg",
      25,
      25,
      ` \
      <div class="images" >\

       <img src="./images/logos/cheer.png" class="content-logo" alt="logo Bietschicheer" style="height: 30px"  />\
       <img src="./images/namen/bietschich.png" class="content-name" alt="logo Ecoumra" style="width: 150px"  />\

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
      "images/bar.svg",
      25,
      25,
      ` \
      <div class="images">\
      <img src="./images/logos/ehc.png" class="content-logo" alt="logo EHC"  />\
      <img src="./images/namen/ehc.png" class="content-name" alt="logo EHC"  />\
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
      "images/bar.svg",
      25,
      25,
      ` \
      <div class="images">\

      <img src="./images/logos/kickers.png" class="content-logo" alt="logo Kickerbar"/>\
      <img src="./images/namen/12er.png" class="content-name" alt="schrifft-Ecoumra"   />\
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
      "images/bar.svg",
      25,
      25,
      ` \
      <div class="images">\

      <img src="./images/logos/stigma.jpg" class="content-logo" alt="logo EHC"  />\
      <img src="./images/namen/stigma.png" class="content-name" alt="schrifft-Ecoumra"   />\
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
      "images/bar.svg",
      25,
      25,
      ` \
      <div class="images">\
      <img src="./images/logos/heidnisch.jpg" class="content-logo" alt="logo heidnisch"   />\
      <img src="./images/namen/heidnisch.png" class="content-name" alt="schrifft-Ecoumra"   />\
      </div>
     <hr>\
     <p>\
     <span class="flex-section">   <strong>Musik:</strong> Beer-Beats  </span> \
     <p>\ `
     ,

    ],

    [
      "DIE BAR",
      46.309649,
      7.80025,
      "images/bar.svg",
      25,
      25,
      ' \
      <div class="images">\
      <img src="./images/logos/diebar.png" class="content-name" alt="logo-DieBar"  style="width: 150px" />\
      </div>\
     <div class="content-title-wrapper" ">\
     </div>\
     <hr>\
     <p>\
     <span class="flex-section" >   <strong>Musik:</strong> Blues and more </span>\
     </br> \
     <span class="flex-section" >   <strong>Essen:</strong> Croque Monsieur (ab 23:00) </span>\
     <p>\
     ',
    ],

    [
      "Pro Raronia Historica & Kulturstiftung",
      46.31177,
      7.800258,
      "images/bar.svg",
      25,
      25,
      `     \
      <div class="images">\
<div style="display:flex; flex-direction: column; margin:auto 0 ;">
<img src="./images/logos/proRaronia.jpg" class="content-logo" alt="Pro Raronia Historica"  />\
<img src="./images/logos/kulturStiftung.png" class="content-logo" alt="logo-kulturStiftung" style="width: 200px; height: auto; " />\
</div>\
      <img src="./images/namen/kulu.png" class="content-name" alt="logo Ecoumra" style="width: 150px;  "/>\
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
      "images/food.svg",
      25,
      25,
      ` \
      <div class="images">\

      <img src="./images/logos/valperca.png" class="content-logo" alt="logo valperca" style="height : 50px"  />\
      <img src="./images/namen/valp.png" class="content-name" alt="logo Ecoumra"   />\

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
          <ul style="list-style-type: "-" ; padding-left: 0;">
            <li>Egli-Knusperli mit Süsskartoffelpommes</li>
            <li>Eglibratwurst mit Brot</li>
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
    //   "images/food.svg",
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
      "images/food.svg",
      25,
      25,
      ` \
      <div class="images">\
    <img src="./images/logos/subieschmiede.jpeg" class="content-logo" alt="logo-subieschmiede"  style="height: 20px;"  />\
    <img src="./images/namen/subi.png" class="content-name" alt="logo Ecoumra" style="width: 150px;"  />\
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
      "images/food.svg",
      25,
      25,
      ' \
      <div class="images">\
      <img src="./images/logos/kochendeFrauen.png" class="content-logo" alt="logo-kochendeFrauen"  style="height: 50px;" />\
      <img src="./images/namen/kochendeFr.png" class="content-name" alt="logo Ecoumra"   style="width: 170px"/>\
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
      "images/food.svg",
      25,
      25,
      ` \
      <div class="images">\
      <img src="./images/logos/zenheusern.png" class="content-logo" alt="logo-zenheusern"  />\
      <img src="./images/namen/beck.png" class="content-name" alt="logo Ecoumra"  style="width: 150px" />\
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
      "images/restaurant.svg",
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
      "images/restaurant.svg",
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
      46.309912201169375, 7.800265191478576,
      "images/restaurant.svg",
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
    ["Schulhausplatz", 46.308303, 7.80164, "images/parking.svg", 25, 25],
  ];

  // Sanitär-marker
  const sanitaer = [
    ["Kreisel Dorf", 46.31152, 7.799844, "images/sanitaer.svg", 25, 25],

    ["Maxenhaus", 46.31159, 7.80053, "images/sanitaer.svg", 25, 25],

    ["Alte Post", 46.30978113328334, 7.800215312930417, "images/sanitaer.svg", 25, 25],
    ["Parking Schmitta", 46.31126252625926, 7.799326719832625 , "images/sanitaer.svg", 25, 25],
  ];

  // Nachmittagsprogramm-marker
  const afternoon = [
    [
      "Theaterverein Raron",
      46.31109,
      7.799986,
      "images/nachmittag.svg",
      25,
      25,
      ' \
     ` <div class="images">\
      <img src="./images/logos/theaterverein.png" class="content-logo" alt="logo-Theaterverein" style="height: 35px;"   />\
      <img src="./images/namen/theater.png" class="content-name" alt="schrifft-Ecoumra"  style="width: 160px;"   />\
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
    //   "images/nachmittag.svg",
    //   25,
    //   25,
    //   "<h3>Samariterverein Raron-St.German</h3>",
    // ],

    [
      "Jubla Raron",
      46.311382,
      7.800184,
      "images/nachmittag.svg",
      25,
      25,
      `  <div style="width : 265px "> \
      <div class="images">\
      <img src="./images/logos/jubla.png" class="content-logo" alt="logo-Theaterverein"   />\
      <img src="./images/namen/jubla.png" class="content-name" alt="logo Ecoumra"  style="width: 160px;"    />\
      </div>\

        <hr>\
        <p>
        <div style=" display: flex; flex-direction: column;">
          <span class="flex-section">
            <strong>Programm:</strong>
            <span class="food-list">
              <ul style="list-style-type: disc; padding-left: 40px;">
                <li>Schminken / Crazy Hair Styles</li>
                <li>Schnitzeljagd</li>
                <li>div. Kleine Spiele</li>
              </ul>
            </span>
          </span>
        </div>
      </p>
      `,
    ],

    [
      "Fluggruppe Oberwallis",
      46.31167210179692,
      7.8005441587539766,
      "images/nachmittag.svg",
      25,
      25,
      ` <div class="images">\
      <img src="./images/logos/fluggruppe.jpg" class="content-logo" alt="logo-Theaterverein"   />\
      <img src="./images/namen/fluggr.png" class="content-name" alt="schrifft-Ecoumra"   />\
      </div>\
        <div class="content-title-wrapper" style="width: 205px;" >\
        </div>\
        <hr>\
       <p> <span class="flex-section">     <strong>Programm: </strong>  Modelflugzeugbau  </span></p>
      `,
    ],
    [
      "Jubla Raron",
      46.31189681656011,
      7.800069928935517,
      "images/nachmittag.svg",
      25,
      25,
      '  <div class="images">\
      <img src="./images/logos/fluggruppe.jpg" class="content-logo" alt="logo-Theaterverein"   />\
      <img src="./images/namen/hüfp.png" class="content-name" alt="schrifft-Ecoumra"   />\
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
        url: "images/stage.png",
        scaledSize: new google.maps.Size(35, 35),
        optimized: false,
      },
      infoWindowContent: `
        <div class="images">\

        <img src="./images/namen/bühne.png" class="content-name" alt="logo Ecoumra"   />\
        </div>

        <div class="content-title-wrapper">\
        <h3 class="content-subtitle">Programm</h3>\
        </div>\
        <div class="lineup" >
        <p>Freitag</p>
        <img src="./images/namen/freit.png" class="content-name" alt="logo Ecoumra"  style="width: 200px; float: left ;" />\
        <p style="clear: left;">Samstag</p>        <img src="./images/namen/sams.png" class="content-name" alt="logo Ecoumra"   style="width: 280px ; float: left ;" />\

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
        url: "./images/trainStop.svg",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
      },
      infoWindowContent:
        '      \
        <div class="images">\
        <img src="./images/namen/zug.png" class="content-name" alt="logo Ecoumra"   />\
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
        url: "./images/busStop.svg",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
      },
      infoWindowContent: ` \
      <div class="images">\
      <img src="./images/namen/bus.png" class="content-name" alt="logo Ecoumra"   />\
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
        url: "images/sanitaet.svg",
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
        url: "images/info.svg",
        scaledSize: new google.maps.Size(30, 25),
        optimized: false,
      },
      infoWindowContent:
      `
      <img src="./images/namen/ticket.png" class="content-name" alt="logo Ecoumra"   style="float: center; width: 150px ;margin: auto;"/>\
      `,
      visibleDefault : true,
    },
  ];



  const atms = [
    {
      position: { lat: 46.30914985360714, lng: 7.799721723633649 },
      map: map,
      title: "Bankautomat Raiffeisen",
      icon: {
        url: "./images/atm.svg",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
        fillColor: "red",
      },
      infoWindowContent:
        '<div class="images">\
        <img src="./images/namen/bank.png" class="content-name" alt="logo Ecoumra"   />\
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
        url: "./images/atm.svg",
        scaledSize: new google.maps.Size(25, 25),
        optimized: false,
      },
      infoWindowContent:
        '<div class="images">\
        <img src="./images/namen/bank.png" class="content-name" alt="logo Ecoumra"   />\
        </div>\
         <div class="content-title-wrapper" style="margin-top : 0;"> \
      <h3 class="content-subtitle"> WKB</h3> \
         </div>  ',
    },
  ];

  // use API to add markers

  function createMarkers(locationArray, ) {
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
          if(object?.visibleDefault)   infoWindow.open({
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
