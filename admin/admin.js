// ============================================================================
//  Admin tool – bootstrap: Google Sign-In gate + starts the tab framework.
//  Tabs (concerts.js / map.js / admins.js) have already self-registered via
//  AdminCore.registerTab() by the time this file runs (script order in
//  admin/index.html), so this file only needs to wire up sign-in/sign-out and call
//  AdminCore.initTabs() once the signed-in Google account is a registered
//  admin (Firestore "admins" collection).
// ============================================================================

function showApp() {
  document.getElementById("loginScreen").hidden = true;
  document.getElementById("adminApp").hidden = false;
  document.getElementById("logoutButton").hidden = false;
  AdminCore.initTabs("adminTabs", "tabContent");
}

function showLogin(errorText) {
  document.getElementById("loginScreen").hidden = false;
  document.getElementById("adminApp").hidden = true;
  document.getElementById("logoutButton").hidden = true;
  const errorEl = document.getElementById("loginError");
  if (errorText) {
    errorEl.textContent = errorText;
    errorEl.hidden = false;
  } else {
    errorEl.hidden = true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const signInButton = document.getElementById("googleSignIn");

  window.Fb.auth.onAuthStateChanged(async (user) => {
    if (!user) {
      showLogin();
      return;
    }
    const isAdmin = await AdminCore.checkAdminAccess(user.email);
    if (isAdmin) {
      showApp();
    } else {
      showLogin("Dieses Google-Konto ist nicht als Admin registriert.");
    }
  });

  signInButton.addEventListener("click", async () => {
    signInButton.disabled = true;
    try {
      await AdminCore.signInWithGoogle();
      // onAuthStateChanged (above) picks up the result and shows the app
      // (or the "not an admin" error, which also signs the account out).
    } catch (err) {
      showLogin(err.message || "Anmeldung fehlgeschlagen.");
    } finally {
      signInButton.disabled = false;
    }
  });

  document.getElementById("logoutButton").addEventListener("click", () => {
    AdminCore.logout();
  });

  document.getElementById("modalClose").addEventListener("click", AdminCore.closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") AdminCore.closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !document.getElementById("modalOverlay").hidden) AdminCore.closeModal();
  });
});
