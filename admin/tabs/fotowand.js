// ============================================================================
//  Admin tool – "Fotowand" tab: the guest photo-sharing link (external
//  Crowpyx album) promoted on the map via a bottom bar + camera button.
//
//  Just one Firestore doc: config/fotowand { url }. Empty/missing url = the
//  whole feature is hidden on the map – that's also the on/off switch (e.g.
//  when next year's album doesn't exist yet).
// ============================================================================

(function () {
  const { el, button, field, textInput } = AdminCore;

  async function render(container) {
    container.innerHTML = "";

    const toolbar = el("div", "tab-toolbar");
    toolbar.appendChild(
      el(
        "p",
        "tab-hint",
        "Link zur Foto-Sharing-App (Crowpyx) für alle Besucher:innen. Auf der Karte erscheint dafür eine Leiste unten + ein Kamera-Knopf. Feld leeren = Feature ausgeblendet."
      )
    );
    container.appendChild(toolbar);

    const doc = await window.Fb.db.collection("config").doc("fotowand").get();
    const url = (doc.exists && doc.data().url) || "";

    const row = el("div", "entry");
    const main = el("div", "entry__main entry__main--column");
    main.style.width = "100%";

    main.appendChild(
      el(
        "span",
        "entry__sub",
        url ? "Status: Aktiv – auf der Karte sichtbar." : "Status: Deaktiviert – kein Link hinterlegt."
      )
    );

    const urlInput = textInput(url, "https://app.crowpyx.com/join/…");
    urlInput.type = "url";
    const fieldWrap = field("Link zum Foto-Album", urlInput);
    fieldWrap.style.width = "100%";
    main.appendChild(fieldWrap);

    main.appendChild(
      button("Speichern", "btn", async () => {
        const value = urlInput.value.trim();
        if (value && !/^https?:\/\//.test(value)) {
          AdminCore.showToast("Bitte eine vollständige URL mit https:// eingeben.", "error");
          return;
        }
        await AdminCore.setDoc("config", "fotowand", { url: value });
        AdminCore.showToast(value ? "Fotowand-Link gespeichert." : "Fotowand deaktiviert.", "success");
        render(container);
      })
    );

    row.appendChild(main);
    container.appendChild(el("div", "entry-list")).appendChild(row);
  }

  AdminCore.registerTab({ id: "fotowand", label: "Fotowand", icon: "photo_camera", render });
})();
