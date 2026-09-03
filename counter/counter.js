// ============================================================================
//  Gästezähler (counter/index.html, served at /counter) – hidden page for
//  entry staff to count guests.
//
//  Data model: the doc ID of counter/{secret} *is* the staff password (see
//  firestore.rules: `get` needs the exact ID, `list` is admin-only – so the
//  password appears nowhere in this file, the rules, or the repo). The actual
//  counts live in named sub-counters ("Tage", e.g. Fritag/Samstag) in the
//  days/ subcollection; exactly one has `active: true`, toggled MANUALLY by
//  admins in the "Gäste" tab (never by the clock – the festival runs past
//  midnight, so "Freitag" only ends when an admin says so). Staff taps go to
//  the active day; with no active day the buttons are disabled.
//
//  Every tap writes FieldValue.increment(n) – atomic, so several staff phones
//  counting at once never lose a tap – and every phone shows the same live
//  count via onSnapshot. The entered password is kept in localStorage
//  ("counter.pw") so staff only type it once per device.
// ============================================================================

(function () {
  const PW_KEY = "counter.pw";

  const loginScreen = document.getElementById("loginScreen");
  const counterScreen = document.getElementById("counterScreen");
  const logoutButton = document.getElementById("logoutButton");
  const countLabel = document.getElementById("countLabel");
  const countValue = document.getElementById("countValue");
  const inactiveHint = document.getElementById("inactiveHint");
  const loginError = document.getElementById("loginError");
  const pwInput = document.getElementById("pwInput");
  const countButtons = document.querySelectorAll(".count-btn");

  let unsubscribe = null;
  let activeDayId = null;
  let currentCount = 0;

  function getSavedPw() {
    try {
      return localStorage.getItem(PW_KEY);
    } catch {
      return null;
    }
  }

  function savePw(pw) {
    try {
      localStorage.setItem(PW_KEY, pw);
    } catch {}
  }

  // ---- Toast ----------------------------------------------------------------
  let toastTimer = null;
  function showToast(text, isError) {
    const toast = document.getElementById("toast");
    clearTimeout(toastTimer);
    toast.textContent = text;
    toast.className = "toast toast--visible" + (isError ? " toast--error" : "");
    toastTimer = setTimeout(() => {
      toast.className = "toast" + (isError ? " toast--error" : "");
    }, 3200);
  }

  // ---- Screens --------------------------------------------------------------
  function showLogin(message) {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    try {
      localStorage.removeItem(PW_KEY);
    } catch {}
    counterScreen.hidden = true;
    logoutButton.hidden = true;
    loginScreen.hidden = false;
    loginError.textContent = message || "";
    window.Fb.hideLoadingOverlay();
  }

  function showCounter() {
    loginScreen.hidden = true;
    counterScreen.hidden = false;
    logoutButton.hidden = false;
    window.Fb.hideLoadingOverlay();
  }

  function renderActiveDay(day) {
    if (day) {
      activeDayId = day.id;
      currentCount = day.count || 0;
      countLabel.textContent = "Gäste bisher – " + (day.name || "");
      countValue.textContent = String(currentCount);
      countValue.classList.remove("count-value--bump");
      void countValue.offsetWidth; // restart the bump animation
      countValue.classList.add("count-value--bump");
      inactiveHint.hidden = true;
      countButtons.forEach((b) => (b.disabled = false));
    } else {
      activeDayId = null;
      currentCount = 0;
      countLabel.textContent = "Kein Zähler aktiv";
      countValue.textContent = "–";
      inactiveHint.hidden = false;
      countButtons.forEach((b) => (b.disabled = true));
    }
  }

  // ---- Live counter ---------------------------------------------------------
  function counterRef(pw) {
    return window.Fb.db.collection("counter").doc(pw);
  }

  function startCounter(pw) {
    unsubscribe = counterRef(pw)
      .collection("days")
      .onSnapshot(
        (qs) => {
          const days = qs.docs.map((d) => Object.assign({ id: d.id }, d.data()));
          renderActiveDay(days.find((d) => d.active) || null);
          showCounter();
        },
        () => {
          showLogin("Verbindung fehlgeschlagen – bitte neu anmelden.");
        }
      );
  }

  // Bucket key for the per-hour breakdown ("hours" map on the day doc),
  // e.g. "2026-09-11_20" – phone-local time, sorts chronologically as a string.
  function hourKey() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}`;
  }

  function change(delta) {
    const pw = getSavedPw();
    if (!pw || !activeDayId) return;
    // firestore.rules rejects a count below 0 – clamp the correction instead.
    if (delta < 0 && currentCount + delta < 0) delta = -currentCount;
    if (delta === 0) return;
    const inc = firebase.firestore.FieldValue.increment(delta);
    // Not awaited: latency compensation updates the snapshot (and the shown
    // count) instantly; offline taps queue and sync when back online. If an
    // admin switches the active day meanwhile, queued taps still land on the
    // day they were counted for.
    counterRef(pw)
      .collection("days")
      .doc(activeDayId)
      .update({ count: inc, ["hours." + hourKey()]: inc })
      .catch(() => showToast("Speichern fehlgeschlagen – nochmals versuchen.", true));
  }

  // ---- Login ----------------------------------------------------------------
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const pw = pwInput.value.trim();
    if (!pw) return;
    loginError.textContent = "";
    try {
      const snap = await counterRef(pw).get();
      if (!snap.exists) {
        loginError.textContent = "Falsches Passwort.";
        return;
      }
      savePw(pw);
      pwInput.value = "";
      startCounter(pw);
    } catch {
      loginError.textContent = "Verbindung fehlgeschlagen – bitte nochmals versuchen.";
    }
  });

  logoutButton.addEventListener("click", () => showLogin());

  countButtons.forEach((btn) => {
    btn.addEventListener("click", () => change(parseInt(btn.dataset.delta, 10)));
  });

  // ---- Boot -----------------------------------------------------------------
  const saved = getSavedPw();
  if (saved) {
    // Straight to the live listener (works from cache when offline). The days
    // listener can't tell a wrong password from "no days yet" (both are just
    // an empty list), so re-validate the parent doc in the background – if the
    // password was deleted/changed in the admin tool, drop back to the login.
    startCounter(saved);
    counterRef(saved)
      .get()
      .then((s) => {
        if (!s.exists) showLogin("Das Passwort ist nicht mehr gültig – bitte neu anmelden.");
      })
      .catch(() => {}); // offline – keep going from cache
  } else {
    showLogin();
  }
})();
