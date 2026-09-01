// ============================================================================
//  Admin tool – "Admins" tab: manage the Firestore "admins" allowlist
//  (doc ID = email). Authentication itself is Google Sign-In (see admin.js) –
//  this collection only decides which signed-in Google accounts are allowed
//  in; there is no app-managed password.
// ============================================================================

(function () {
  const { el, button, iconButton, field, textInput } = AdminCore;

  function getAdmins() {
    return AdminCore.getAllDocs("admins");
  }

  function openAddForm(container) {
    const body = el("div", "entry-form");
    const emailInput = textInput("", "name@example.com");
    emailInput.type = "email";
    body.appendChild(field("E-Mail (Google-Konto)", emailInput));
    body.appendChild(el("p", "tab-hint", "Muss ein Google-Konto sein – die Person meldet sich damit über \"Mit Google anmelden\" an."));

    const footer = el("div", "modal-footer-buttons");
    footer.appendChild(button("Abbrechen", "btn btn--outline", AdminCore.closeModal));
    footer.appendChild(
      button("Admin hinzufügen", "btn", async () => {
        const email = emailInput.value.trim();
        if (!email.includes("@")) {
          AdminCore.showToast("Bitte eine gültige E-Mail eingeben.", "error");
          return;
        }
        const list = await getAdmins();
        if (list.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
          AdminCore.showToast("Diese E-Mail ist bereits registriert.", "error");
          return;
        }
        await AdminCore.setDoc("admins", email, { email, fixed: false });
        AdminCore.closeModal();
        render(container);
      })
    );

    AdminCore.openModal({ title: "Admin hinzufügen", body, footer });
  }

  function adminRow(admin, container) {
    const row = el("div", "entry");

    row.appendChild(el("span", "material-icons entry__img-placeholder", "account_circle"));

    const main = el("div", "entry__main entry__main--column");
    main.appendChild(el("span", "entry__name", admin.email));
    main.appendChild(el("span", "entry__sub", admin.fixed ? "Fix registriert" : "Hinzugefügt"));
    row.appendChild(main);

    if (!admin.fixed) {
      const actions = el("div", "entry__actions");
      actions.appendChild(
        iconButton("delete", "Löschen", "icon-btn--delete", async () => {
          if (!confirm(`Admin ${admin.email} wirklich löschen?`)) return;
          await AdminCore.deleteDoc("admins", admin.id);
          render(container);
        })
      );
      row.appendChild(actions);
    }

    return row;
  }

  function addRow(onAdd) {
    const row = el("div", "entry entry--add");
    row.appendChild(el("span", "material-icons entry-add__icon", "add"));
    row.appendChild(el("span", "entry-add__label", "Admin hinzufügen"));
    row.addEventListener("click", onAdd);
    return row;
  }

  async function render(container) {
    container.innerHTML = ""; // re-renders (after add/delete) must replace, not append
    const toolbar = el("div", "tab-toolbar");
    toolbar.appendChild(
      el("p", "tab-hint", "Adminverwaltung – wer hier steht, kann sich mit diesem Google-Konto anmelden. Änderungen sind sofort live.")
    );
    container.appendChild(toolbar);

    const listEl = el("div", "entry-list");
    const admins = await getAdmins();
    admins.forEach((admin) => listEl.appendChild(adminRow(admin, container)));
    listEl.appendChild(addRow(() => openAddForm(container)));
    container.appendChild(listEl);
  }

  AdminCore.registerTab({ id: "admins", label: "Admins", icon: "admin_panel_settings", render });
})();
