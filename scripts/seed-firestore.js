// ============================================================================
//  One-time seed: pushes the pre-Firestore LOCATIONS/INFRASTRUCTURE/LINEUP/
//  ADMIN_ACCOUNTS content (previously hardcoded in locations-data.js/
//  lineup-data.js/admin/admin-data.js) into Firestore.
//
//  Uses the regular client SDK (no service-account/gcloud credentials
//  needed) – this only works while firestore.rules is temporarily set to
//  `allow read, write: if true` (see firestore.rules.seed-temp), since on a
//  brand-new project the "admins" collection is still empty and the real
//  rules' isAdmin() check would reject every write. Re-deploy the real
//  restrictive firestore.rules immediately after running this.
//
//  Usage (run once, with the temporary open rules deployed):
//    npm install firebase
//    node scripts/seed-firestore.js
//
//  Safe to re-run: it always resets these 3 collections to the data below
//  (deletes existing docs first), so running it twice doesn't duplicate.
// ============================================================================

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  getDocs,
  writeBatch,
} = require("firebase/firestore");

const app = initializeApp({
  apiKey: "AIzaSyCqFuiJ3p4Qs7Q0ZZX9gj9ozB01QoRPcUI",
  authDomain: "bietschicheer-39d5f.firebaseapp.com",
  projectId: "bietschicheer-39d5f",
});
const db = getFirestore(app);

const LOCATIONS = [
  // ---- Bars ----
  {
    name: "Bietschichlepfer", lat: 46.31151443559874, lng: 7.8001323816423875, type: "bar",
    card: "Bietschichlepfaer.png?alt=media&token=7879707b-2351-47a5-9915-9d4d4e2822f3",
    image: "01_Bietschichlepfer.jpg", badge: "Bietschichlepfer",
    getraenke: "Getränke, Bier, Wein, Spirituosen, Apérol Spritz",
    essen: "Schnitzeltaschen",
  },
  {
    name: "DIE BAR", lat: 46.30962800155923, lng: 7.8002302321185, type: "bar",
    card: "DieBar.png?alt=media&token=f079e5c5-5122-4046-8272-f7d93c8775a8",
    image: "02_diebar.png", badge: "DIE BAR",
    getraenke: "Getränke, Bier, Wein, Smirnoff, Bellini",
    essen: "Croque Monsieur",
  },
  {
    name: "EHC Raron", lat: 46.311331108691256, lng: 7.799467795611433, type: "bar",
    card: "EHC.png?alt=media&token=2a250112-0faf-4426-90fd-91399071b13c",
    image: "03_ehc_raron.png", badge: "EHC Raron",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
  },
  {
    name: "FC Raron", lat: 46.31049280712476, lng: 7.79987723781509, type: "bar",
    card: "Fc.png?alt=media&token=56a4c5d1-3fea-4384-a80c-43efec4d2c85",
    image: "fc-stuebli.png", badge: "FC Stübli", by: "FC Raron",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
    essen: "Raclette",
  },
  {
    name: "Hockeyladies", lat: 46.31146302389808, lng: 7.800450401491779, type: "bar",
    card: "Hockeyladies.png?alt=media&token=964523c4-35de-44d4-aa7f-88228a047e0c",
    image: "07_Hockeyladies.jpeg", badge: "Hockeyladies",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
  },
  {
    name: "Jodlerverein Raron", lat: 46.311346178911926, lng: 7.799897813783402, type: "bar",
    card: "Jodler.png?alt=media&token=6deb361a-48b6-4acd-8758-8d6fc6b6abe2",
    image: "09_Jodlerverein Raron.jpg", badge: "Jodlerverein Raron",
    getraenke: "Getränke, Bier, Wein",
    essen: "Jodler Hot Dog",
  },
  {
    name: "Jugendverein Raron", lat: 46.31168736554792, lng: 7.800432357820134, type: "bar",
    card: "Jugi.png?alt=media&token=657ca680-cf5e-44ab-9e17-86a2912c78ec",
    image: "11_JV_raro.png", badge: "Jugendverein Raron",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
    special: "Darts, Bierpong, Karaoke",
    nachmittag: "evtl. Karaoke",
  },
  {
    name: "Musikgesellschaft ECHO Raronia", lat: 46.311385969602426, lng: 7.800647290204041, type: "bar",
    card: "Echo%20Raronia.png?alt=media&token=0f23cfe7-b34f-4d1f-8d03-eb00a5fab115",
    image: "14_Musikgesellschaft ECHO Raronia.png", badge: "Fäschtbar", by: "Musikgesellschaft ECHO Raronia",
    getraenke: "Getränke, Wein, Bier, Spirituosen",
    special: "Beerpong",
  },
  {
    name: "Pro Raronia Historica und Kulturstiftung", lat: 46.311553383839446, lng: 7.800373715850603, type: "bar",
    card: "Kultur.png?alt=media&token=2fb0048a-d0bb-4685-8f66-450918c97875",
    image: "16_Pro Raronia Historica und Kulturstiftung.jpg", badge: "Pro Raronia Historica und Kulturstiftung",
    getraenke: "Getränke, Apéro, Mineral",
    essen: "Lachsbrötli",
  },
  {
    name: "Rilke", lat: 46.3109564296631, lng: 7.800158161006201, type: "restaurant",
    image: "17_restaurant_rilke.jpg", badge: "Rilke",
  },
  {
    name: "Stigma", lat: 46.31039571641613, lng: 7.801409922436901, type: "bar",
    card: "Stigma.png?alt=media&token=be15d14e-250b-4bde-8748-3dff00203e05",
    image: "19_stigma.jpg", badge: "Stigma",
    getraenke: "Getränke, Bier, Wein, Spirituosen",
    essen: "Toast",
  },
  {
    name: "VBC Raron", lat: 46.31138934715919, lng: 7.800936913138532, type: "bar",
    card: "VBC.png?alt=media&token=21993c8c-9e3d-4f00-8dce-bbd9814834eb",
    image: "21_vbc_raron.jpg", badge: "Container Dirty 6", by: "VBC Raron",
    getraenke: "Shots, Apéritive, Gins, Smirnoff und Bier, Getränke",
    essen: "Pasta by Angelo Spadaro",
    nachmittag: "Kinderdisco von 16.00–18.00 Uhr",
  },
  {
    name: "Verein Bietschicheer", lat: 46.31182658390863, lng: 7.79954216439577, type: "bar",
    card: "Bietschicheer.png?alt=media&token=f8a92986-1066-4f35-a86d-08013922f7ef",
    image: "22_Bietschicheer.png", badge: "Verein Bietschicheer",
    getraenke: "Getränke, Wein, Bier, Apérol, Spirituosen",
    essen: "Vegetarische Spezialitäten",
  },

  // ---- Food ----
  {
    name: "Hope Factory", lat: 46.31114053115375, lng: 7.799983521264717, type: "food",
    card: "Hope.png?alt=media&token=9f8f213f-f845-421c-900f-93bdddbacfbe",
    image: "8_Hope_weiss.png", badge: "Hope Factory",
    logoStyle: "background-color: var(--sekundär-dunkel); padding: 8px; border-radius: var(--btn-radius);",
    essen: ["Popcorn", "Kalte Lust (Glace)"],
    nachmittag: ["Kinderschminken", "Kinderfrisuren", "Ballwerfen", "Bobbycar-Rennen"],
  },
  {
    name: "Kochende Frauen", lat: 46.31172319780942, lng: 7.800030885933981, type: "food",
    card: "KochendeFR.png?alt=media&token=0f49ec42-91b4-49f7-8eba-3bfcc6e8c1dd",
    image: "12_kochende frauen.png", badge: "Kochende Frauen",
    essen: ["Kuchen", "Schweinsplätzli", "Käseschübling", "Russischer Salat"],
  },
  {
    name: "Schaf und Meh", lat: 46.31174033496966, lng: 7.800339883958716, type: "food",
    card: "Schaf%26Meh.png?alt=media&token=6bb14d01-cbec-4a93-b6ca-0fc943b02195",
    image: "18_Wirtschaft Schaf & Meh.svg", badge: "Schaf und Meh",
    getraenke: "Getränke?",
    essen: ["Pullet Lamb Bread", "Pullet Pork Bread"],
  },
  {
    name: "Valperca", lat: 46.311956885895995, lng: 7.800001564953533, type: "food",
    card: "Valperca.png?alt=media&token=ef788576-a942-4a10-b4a1-d79d14e049c7",
    image: "20_Valperca_claim.svg", badge: "Valperca",
    getraenke: "Getränke, kein Alkohol",
    essen: ["Knusperli mit Süsskartoffelpommes", "Poke Bowl"],
  },

  // ---- Nachmittagsprogramm ----
  {
    name: "Fluggruppe Oberwallis", lat: 46.31062249847992, lng: 7.8000676746626585, type: "programm",
    card: "Fluggrupe.png?alt=media&token=3a7ddf69-af14-40d8-b283-d57e8f2498a0",
    image: "5_flugruppe_OVS.jpg", badge: "Fluggruppe Oberwallis",
    nachmittag: "Basteln Modellflugzeuge + Hüpfburg",
  },
  {
    name: "Nachmittagsprogramm", lat: 46.31148, lng: 7.7995, type: "programm",
    image: "10_jubhla_weiss.png", badge: "Nachmittagsprogramm",
    logoStyle: "background-color: var(--sekundär-dunkel); padding: 8px; border-radius: var(--btn-radius);",
    nachmittag: [
      "Jubla Raron: Minigames & Glitzertattoos",
      "Line Dance Oberwallis: Workshop und Auftritte",
      "16.00–18.00 Uhr: Kinderdisco in der VBC Bar (Container Dirty 6)",
      "16.30 Uhr: Line Dancers Workshop",
      "17.00 Uhr: Chummucheer-Verkündigung",
    ],
  },
];

const INFRASTRUCTURE = [
  {
    name: "Bühne", lat: 46.31154857855296, lng: 7.799623317488572, type: "stage",
    link: { text: "z ganz Line Up alüägu →", href: "lineup.html" },
  },
  {
    name: "Tickets und Info", lat: 46.30956299819405, lng: 7.800245046467818, type: "info",
    badge: "Tickets und Info",
  },
  { name: "Sanität", lat: 46.311635, lng: 7.800258, type: "sanitaet" },
  { name: "Kreisel Dorf",     lat: 46.31152,           lng: 7.799844,          type: "wc" },
  { name: "Maxenhaus",        lat: 46.31159,           lng: 7.80053,           type: "wc" },
  { name: "Alte Post",        lat: 46.30978113328334,  lng: 7.800215312930417, type: "wc" },
  { name: "Parking Schmitta", lat: 46.31126252625926,  lng: 7.799326719832625, type: "wc" },
  { name: "Schulhausplatz", lat: 46.308303, lng: 7.80164, type: "parking" },
  {
    name: "Bankautomat Raiffeisen", lat: 46.30914985360714, lng: 7.799721723633649, type: "atm",
    badge: "bank", subtitle: "Raiffeisen",
  },
  {
    name: "Bankautomat WKB", lat: 46.307804743765814, lng: 7.800516896599212, type: "atm",
    badge: "bank", subtitle: "WKB",
  },
  {
    name: "Bahnhof Raron", lat: 46.30616248915186, lng: 7.801530337347227, type: "train",
    badge: "zug",
    html: `
      <p>An- und Abreise mit dem Regio stündlich ab Brig und St. Maurice.</p>
      <p><strong>Fahrplan Abreise</strong></p>
      <p>Richtung Susten</p>
      <ul>
        <li>23:48 Uhr letzter Zug</li>
        <li>4:48 Uhr erster Zug</li>
      </ul>
      <p>Richtung Brig</p>
      <ul>
        <li>00:41 Uhr letzter Zug</li>
        <li>5:40 Uhr erster Zug</li>
      </ul>`,
  },
  {
    name: "Busstation Bergheim", lat: 46.30356892349157, lng: 7.8014837184476145, type: "bus",
    badge: "bus",
    html: `
      <p><strong>Fahrplan</strong></p>
      <p>Richtung Susten</p>
      <ul>
        <li>ca. 02:00 Uhr (Bettmobil)</li>
        <li>ca. 03:30 Uhr (Steiner Reisen)</li>
      </ul>
      <p>Richtung Brig</p>
      <ul>
        <li>ca. 02:30 Uhr (Steiner Reisen)</li>
        <li>ca. 03:45 Uhr (Bettmobil)</li>
      </ul>`,
  },
];

const LINEUP = [
  { weekday: 5, day: "Fritag", start: "19:00", end: "20:00", act: "OrzBuzz",
    image: "orzbuzz.webp?alt=media&token=a45b3190-ed99-4f30-a985-c0c1ddee0465" },
  { weekday: 5, day: "Fritag", start: "21:00", end: "22:00", act: "MÄYÄ",
    image: "maya.webp?alt=media&token=a38d1307-824e-45a2-9cc8-45eeaf536cbf" },
  { weekday: 5, day: "Fritag", start: "23:00", end: "00:00", act: "WE2",
    image: "we2.webp?alt=media&token=c1dee2ec-979c-40ce-bdab-6c78e34ac511" },
  { weekday: 6, day: "Samstag", start: "11:00", end: "14:00", act: "Bietschibotsche",
    image: "WhatsApp%20Image%202026-07-31%20at%2010.27.07(1).jpeg?alt=media&token=efaa406a-a2db-426d-922d-150428986a73" },
  { weekday: 6, day: "Samstag", start: "15:00", end: "16:00", act: "Mainstreet 47",
    image: "WhatsApp%20Image%202026-07-31%20at%2010.27.07.jpeg?alt=media&token=184af8df-600d-4abd-9be8-893d7acbfb99" },
  { weekday: 6, day: "Samstag", start: "16:30", end: "17:00", act: "Line Dance Workshop",
    image: "Kopie%20von%20Sponsoren%20und%20Lineup.jpg?alt=media&token=40d50b63-955f-45c0-a2ee-47951e20dc8b" },
  { weekday: 6, day: "Samstag", start: "19:00", end: "20:00", act: "Kentucky Moonshiners",
    image: "WhatsApp%20Image%202026-07-31%20at%2010.27.08.jpeg?alt=media&token=e2a81601-bee3-4dea-943a-fcdebb4e1e1e" },
  { weekday: 6, day: "Samstag", start: "21:00", end: "22:00", act: "Jah on Holiday",
    image: "WhatsApp%20Image%202026-07-31%20at%2010.27.08(1).jpeg?alt=media&token=bbd29a7a-a6d2-4f73-b643-605cf21e43a3" },
  { weekday: 6, day: "Samstag", start: "23:00", end: "00:30", act: "Chrigu Blaser",
    image: "WhatsApp%20Image%202026-07-31%20at%2010.27.08(2).jpeg?alt=media&token=853c5723-d3ca-4894-8273-f12c321b202c" },
];

const ADMINS = [
  { email: "bietschicheer3942@gmail.com", fixed: true },
  { email: "loehrer.jakob@gmail.com", fixed: true },
  { email: "lauraemiliegrand@gmail.com", fixed: true },
  { email: "lukas_zur@hotmail.com", fixed: true },
];

async function resetCollection(name) {
  const snap = await getDocs(collection(db, name));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

async function seedAutoId(collectionName, docs) {
  await resetCollection(collectionName);
  const batch = writeBatch(db);
  docs.forEach((data) => batch.set(doc(collection(db, collectionName)), data));
  await batch.commit();
  console.log(`  ${collectionName}: ${docs.length} docs`);
}

async function seedById(collectionName, docs, idField) {
  await resetCollection(collectionName);
  const batch = writeBatch(db);
  docs.forEach((data) => batch.set(doc(db, collectionName, data[idField]), data));
  await batch.commit();
  console.log(`  ${collectionName}: ${docs.length} docs`);
}

(async () => {
  console.log("Seeding Firestore project bietschicheer-39d5f ...");
  await seedAutoId("location", LOCATIONS.concat(INFRASTRUCTURE));
  await seedAutoId("lineup", LINEUP);
  await seedById("admins", ADMINS, "email");
  console.log("Done.");
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
