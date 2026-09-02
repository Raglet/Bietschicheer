// ============================================================================
//  One-time migration: brings every existing "location" doc up to the new
//  displayMode/content schema (see admin/tabs/map.js and script.js for the
//  live version of this logic – kept in sync by hand, this script isn't
//  imported by the running site).
//
//    1. `nachmittag` (string or array) -> `content` (string, "- item" lines
//       for what used to be an array) if `content` isn't already set; the
//       old `nachmittag` field is then deleted.
//    2. `displayMode` is backfilled (card set -> "image"; any content-ish
//       field set -> "custom"; else -> "none") for any doc that doesn't
//       already have one stored.
//
//  Uses the regular client SDK (no service-account/gcloud credentials
//  needed) – this only works while firestore.rules is temporarily set to
//  `allow read, write: if true` (see firestore.rules.seed-temp from the
//  earlier seed – same dance), since there's no interactive Google login
//  available in this environment. Re-deploy the real restrictive
//  firestore.rules immediately after running this.
//
//  Usage (run once, with the temporary open rules deployed):
//    node scripts/migrate-location-schema.js
//
//  Safe to re-run: docs that already have `displayMode` and no `nachmittag`
//  are left untouched (only genuinely-unmigrated docs get a write).
// ============================================================================

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, getDocs, writeBatch, deleteField } = require("firebase/firestore");

const app = initializeApp({
  apiKey: "AIzaSyCqFuiJ3p4Qs7Q0ZZX9gj9ozB01QoRPcUI",
  authDomain: "bietschicheer-39d5f.firebaseapp.com",
  projectId: "bietschicheer-39d5f",
});
const db = getFirestore(app);

function nachmittagToContent(value) {
  if (Array.isArray(value)) return value.map((item) => "- " + item).join("\n");
  return String(value);
}

const CONTENTISH_FIELDS = ["badge", "content", "subtitle", "link", "html", "getraenke", "musik", "essen", "special", "description"];
function inferDisplayMode(item) {
  if (item.displayMode) return item.displayMode;
  if (item.card) return "image";
  if (CONTENTISH_FIELDS.some((k) => item[k])) return "custom";
  return "none";
}

(async () => {
  const snap = await getDocs(collection(db, "location"));
  const batch = writeBatch(db);
  let changedCount = 0;

  snap.docs.forEach((d) => {
    const data = d.data();
    const updates = {};
    let changed = false;

    if (data.nachmittag !== undefined) {
      if (data.content === undefined) updates.content = nachmittagToContent(data.nachmittag);
      updates.nachmittag = deleteField();
      changed = true;
    }

    if (data.displayMode === undefined) {
      // Infer against the post-migration shape (data + the `content` update
      // above), so a doc that only had `nachmittag` still infers "custom".
      updates.displayMode = inferDisplayMode(Object.assign({}, data, updates));
      changed = true;
    }

    if (changed) {
      batch.update(doc(db, "location", d.id), updates);
      changedCount++;
      // Not JSON.stringify(updates) directly – deleteField() returns a
      // FieldValue sentinel that doesn't serialize meaningfully.
      const summary = Object.keys(updates)
        .map((k) => (k === "nachmittag" ? "nachmittag: <deleted>" : `${k}: ${JSON.stringify(updates[k])}`))
        .join(", ");
      console.log(`  ${data.name || d.id}: ${summary}`);
    }
  });

  if (changedCount) await batch.commit();
  console.log(`\nMigrated ${changedCount} of ${snap.size} location docs.`);
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
