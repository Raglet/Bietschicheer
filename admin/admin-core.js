// ============================================================================
//  Admin tool – shared plumbing.
//
//  All content (Konzerte, Karte, Admins) lives in Firestore (collections
//  "lineup" / "location" / "admins" – see firebase-init.js) and is written
//  directly by this tool: edits are live immediately, no export/paste step.
//  Access is gated by Firebase Auth Google Sign-In (see admin.js) plus the
//  "admins" collection allowlist (checkAdminAccess below).
//
//  Tabs register themselves via AdminCore.registerTab({...}) – see
//  tabs/concerts.js, tabs/map.js, tabs/admins.js. New tabs can be added the
//  same way without touching this file.
// ============================================================================

// Lineup weekdays (see lineup-data.js: weekday 5 = Friday, 6 = Saturday).
const LINEUP_WEEKDAYS = [
  { weekday: 5, day: "Fritag" },
  { weekday: 6, day: "Samstag" },
];

// Same Google Maps key already inlined in index.html / bietschimeile.js –
// used here for a small Static Maps coordinate-preview image only.
const GOOGLE_STATIC_MAPS_KEY = "AIzaSyCXJdwDBQfk1lCSww2v3pM9ApCxynbKMoQ";

const AdminCore = (() => {
  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  // ---- Firestore CRUD (shared by every tab) ----------------------------------
  // Firestore rejects `undefined` field values outright – the tab forms build
  // entries like `{ image: value || undefined }` for "field not set", so every
  // write strips those keys first. Also strips a stray `id` key (entries
  // fetched via getAllDocs carry one; it must never be written into the
  // document's own data, or it could later shadow the real Firestore ID).
  function sanitizeWrite(data) {
    const out = {};
    Object.keys(data).forEach((k) => {
      if (k !== "id" && data[k] !== undefined) out[k] = data[k];
    });
    return out;
  }

  async function getAllDocs(collectionName) {
    const snap = await window.Fb.db.collection(collectionName).get();
    return snap.docs.map((d) => Object.assign({}, d.data(), { id: d.id }));
  }

  async function addDoc(collectionName, data) {
    const ref = await window.Fb.db.collection(collectionName).add(sanitizeWrite(data));
    return ref.id;
  }

  async function setDoc(collectionName, id, data) {
    await window.Fb.db.collection(collectionName).doc(id).set(sanitizeWrite(data));
  }

  // Full replace of an existing document by id (not a partial Firestore
  // `.update()` merge) – a field the admin blanks out in the form must
  // actually disappear from the document, matching the old array-replace
  // behaviour this tool had before Firestore.
  async function updateDoc(collectionName, id, data) {
    await window.Fb.db.collection(collectionName).doc(id).set(sanitizeWrite(data));
  }

  async function deleteDoc(collectionName, id) {
    await window.Fb.db.collection(collectionName).doc(id).delete();
  }

  // ---- Toast ----------------------------------------------------------------
  let toastTimer = null;
  function showToast(text, type = "info") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = text;
    toast.className = "toast toast--" + type + " toast--visible";
    toastTimer = setTimeout(() => {
      toast.className = "toast toast--" + type;
    }, 3200);
  }

  // ---- Generic modal ---------------------------------------------------------
  function openModal({ title, body, footer }) {
    const overlay = document.getElementById("modalOverlay");
    document.getElementById("modalTitle").textContent = title;
    const bodyEl = document.getElementById("modalBody");
    const footerEl = document.getElementById("modalFooter");
    bodyEl.innerHTML = "";
    footerEl.innerHTML = "";
    if (body) bodyEl.appendChild(body);
    if (footer) footerEl.appendChild(footer);
    overlay.hidden = false;
  }

  function closeModal() {
    document.getElementById("modalOverlay").hidden = true;
  }

  // ---- Clipboard --------------------------------------------------------------
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("In Zwischenablage kopiert!", "success");
    } catch {
      showToast("Kopieren fehlgeschlagen – bitte manuell markieren.", "error");
    }
  }

  // ---- Auth / admin allowlist -------------------------------------------------
  function currentEmail() {
    const user = window.Fb.auth.currentUser;
    return user ? user.email : null;
  }

  async function signInWithGoogle() {
    const result = await window.Fb.auth.signInWithPopup(window.Fb.googleProvider);
    return result.user.email;
  }

  // Checks the signed-in email against the Firestore "admins" collection
  // (doc ID = email). Signs the user out again if they're not an admin.
  async function checkAdminAccess(email) {
    const doc = await window.Fb.db.collection("admins").doc(email).get();
    if (!doc.exists) {
      await window.Fb.auth.signOut();
      return false;
    }
    return true;
  }

  function logout() {
    return window.Fb.auth.signOut();
  }

  // ---- Logo resolution -------------------------------------------------------
  // resolveLogo() (locations-data.js) returns a path relative to the SITE
  // ROOT (e.g. "images/mitwirkende_logos_26/x.png") – correct from index.html
  // / bietschimeile.html, which live there, but admin.html lives one folder
  // down. resolveCard()/resolveLineupImage() are unaffected: they resolve
  // against an absolute Firebase URL. Tabs must use this wrapper, not the
  // bare global resolveLogo(), for any <img> shown on the admin page.
  function resolveLogo(image) {
    return "../" + window.resolveLogo(image);
  }

  // ---- Small DOM helpers, shared by every tab module ------------------------
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(text, className, onClick) {
    const btn = el("button", className, text);
    btn.type = "button";
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
  }

  function iconButton(icon, label, className, onClick) {
    const btn = el("button", "icon-btn " + (className || ""));
    btn.type = "button";
    btn.setAttribute("aria-label", label);
    btn.innerHTML = `<span class="material-icons">${icon}</span>`;
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
  }

  function field(labelText, inputEl) {
    const wrap = el("label", "field");
    wrap.appendChild(el("span", "field__label", labelText));
    wrap.appendChild(inputEl);
    return wrap;
  }

  function textInput(value, placeholder) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "field__input";
    input.value = value || "";
    if (placeholder) input.placeholder = placeholder;
    return input;
  }

  // <label class="field field--checkbox"><input type="checkbox">labelText</label>
  function checkbox(labelText, checked) {
    const wrap = el("label", "field field--checkbox");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "field__checkbox";
    input.checked = !!checked;
    wrap.appendChild(input);
    wrap.appendChild(el("span", "field__checkbox-label", labelText));
    return wrap; // wrap.querySelector("input") reads/sets the checked state
  }

  // ---- Tab registry -------------------------------------------------------
  const tabs = [];
  let activeTabId = null;

  function registerTab(tab) {
    tabs.push(tab);
  }

  function initTabs(navId, contentId) {
    const nav = document.getElementById(navId);
    nav.innerHTML = "";
    tabs.forEach((tab) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "admin-tab";
      btn.dataset.tabId = tab.id;
      btn.innerHTML = `${tab.icon ? `<span class="material-icons">${tab.icon}</span>` : ""}<span>${tab.label}</span>`;
      btn.addEventListener("click", () => activateTab(tab.id, navId, contentId));
      nav.appendChild(btn);
    });
    activateTab(tabs[0]?.id, navId, contentId);
  }

  function activateTab(id, navId = "adminTabs", contentId = "tabContent") {
    activeTabId = id;
    document.querySelectorAll(`#${navId} .admin-tab`).forEach((btn) => {
      btn.classList.toggle("admin-tab--active", btn.dataset.tabId === id);
    });
    const content = document.getElementById(contentId);
    content.innerHTML = "";
    const tab = tabs.find((t) => t.id === id);
    if (tab) tab.render(content);
  }

  return {
    deepClone,
    getAllDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    showToast,
    openModal,
    closeModal,
    copyToClipboard,
    currentEmail,
    signInWithGoogle,
    checkAdminAccess,
    logout,
    registerTab,
    initTabs,
    activateTab,
    resolveLogo,
    el,
    button,
    iconButton,
    field,
    textInput,
    checkbox,
  };
})();
