// ============================================================================
//  Admin tool – "Gäste" tab: manage the entry-staff guest counter
//  (counter/index.html + the Firestore "counter" collection).
//
//  The counter doc's ID *is* the staff password (see firestore.rules /
//  counter/counter.js) – creating the doc here is how the password gets
//  "set", and only admins can list the collection, so this tab is the only
//  place it's visible. The counts themselves live in named sub-counters
//  ("Tage", e.g. Fritag/Samstag) in the days/ subcollection; exactly one is
//  active at a time, toggled MANUALLY here – never by the clock, because the
//  festival runs past midnight. Staff taps go to the active day.
//
//  Normally there is exactly one counter (password); more are possible and
//  simply listed as extra sections.
// ============================================================================

(function () {
  const { el, button, iconButton, field, textInput } = AdminCore;

  // Same base-URL trick as tabs/qrcodes.js: admin/index.html lives one folder
  // down; counter/ is a folder (counter/index.html), so the short /counter
  // URL works on GitHub Pages (it 301s to /counter/).
  const COUNTER_URL = new URL("..", window.location.href).href + "counter";

  function counterRef(secret) {
    return window.Fb.db.collection("counter").doc(secret);
  }

  function daysCol(secret) {
    return counterRef(secret).collection("days");
  }

  async function getDays(secret) {
    const qs = await daysCol(secret).get();
    const days = qs.docs.map((d) => Object.assign({ id: d.id }, d.data()));
    days.sort((a, b) => {
      const am = a.created && a.created.toMillis ? a.created.toMillis() : 0;
      const bm = b.created && b.created.toMillis ? b.created.toMillis() : 0;
      return am - bm;
    });
    return days;
  }

  // Exactly one active day per counter: one batch flips them all.
  async function setActiveDay(secret, dayId) {
    const qs = await daysCol(secret).get();
    const batch = window.Fb.db.batch();
    qs.docs.forEach((d) => batch.update(d.ref, { active: d.id === dayId }));
    await batch.commit();
  }

  // ---- Password create/change form ------------------------------------------
  function openPasswordForm({ title, submitLabel, initialValue, onSubmit }) {
    const body = el("div", "entry-form");
    const pwField = textInput(initialValue || "", "z.B. zellwiediewilden");
    body.appendChild(field("Passwort (= Zugang für das Eingangs-Team)", pwField));
    body.appendChild(
      el(
        "p",
        "tab-hint",
        "Das Passwort ist gleichzeitig der Firestore-Dokumentname – es darf keinen Schrägstrich (/) enthalten und sollte nirgends sonst verwendet werden."
      )
    );

    const footer = el("div", "modal-footer-buttons");
    footer.appendChild(button("Abbrechen", "btn btn--outline", AdminCore.closeModal));
    footer.appendChild(
      button(submitLabel, "btn", async () => {
        const pw = pwField.value.trim();
        if (!pw || pw.includes("/")) {
          AdminCore.showToast("Bitte ein gültiges Passwort ohne / eingeben.", "error");
          return;
        }
        const existing = await AdminCore.getAllDocs("counter");
        if (existing.some((c) => c.id === pw)) {
          AdminCore.showToast("Diesen Zähler gibt es bereits.", "error");
          return;
        }
        await onSubmit(pw);
        AdminCore.closeModal();
      })
    );

    AdminCore.openModal({ title, body, footer });
  }

  // ---- "Gäste pro Stunde" chart (shared AdminCore.hoursChart) ---------------
  async function openHoursChart(secret, day) {
    const snap = await daysCol(secret).doc(day.id).get();
    const hours = (snap.exists && snap.data().hours) || {};
    const body = AdminCore.hoursChart(hours, {
      emptyText: "Noch keine Daten – der Verlauf füllt sich, sobald am Eingang gezählt wird.",
      footText: "Netto pro Stunde (inkl. −Korrekturen), Uhrzeit der zählenden Handys.",
    });

    const footer = el("div", "modal-footer-buttons");
    footer.appendChild(button("Schliessen", "btn btn--outline", AdminCore.closeModal));
    AdminCore.openModal({ title: `Gäste pro Stunde – ${day.name || day.id}`, body, footer });
  }

  // ---- Day rows -------------------------------------------------------------
  function dayRow(secret, day, countSpans, container) {
    const row = el("div", "entry");

    const icon = el(
      "span",
      "material-icons entry__img-placeholder",
      day.active ? "radio_button_checked" : "radio_button_unchecked"
    );
    if (day.active) icon.style.color = "#2e7d32";
    row.appendChild(icon);

    const main = el("div", "entry__main entry__main--column");
    main.appendChild(el("span", "entry__name", day.name || day.id));
    const countSpan = el("span", "entry__sub", `${day.count || 0} Gäste`);
    countSpans[day.id] = countSpan; // updated live by the days listener
    main.appendChild(countSpan);
    row.appendChild(main);

    const actions = el("div", "entry__actions");
    actions.appendChild(
      button(day.active ? "Deaktivieren" : "Aktivieren", "btn btn--outline btn--small", async () => {
        await setActiveDay(secret, day.active ? null : day.id);
        AdminCore.showToast(
          day.active ? `"${day.name}" deaktiviert – es wird nicht mehr gezählt.` : `"${day.name}" ist jetzt aktiv.`,
          "success"
        );
        render(container);
      })
    );
    actions.appendChild(
      iconButton("bar_chart", "Gäste pro Stunde", "", () => openHoursChart(secret, day))
    );
    actions.appendChild(
      iconButton("restart_alt", "Auf 0 zurücksetzen", "", async () => {
        if (!confirm(`"${day.name}" wirklich auf 0 zurücksetzen? Auch der Stunden-Verlauf wird gelöscht.`)) return;
        await daysCol(secret).doc(day.id).update({
          count: 0,
          hours: firebase.firestore.FieldValue.delete(),
        });
        AdminCore.showToast("Zähler zurückgesetzt.", "success");
      })
    );
    actions.appendChild(
      iconButton("delete", "Löschen", "icon-btn--delete", async () => {
        if (!confirm(`"${day.name}" wirklich löschen? Der Stand geht verloren.`)) return;
        await daysCol(secret).doc(day.id).delete();
        render(container);
      })
    );
    row.appendChild(actions);

    return row;
  }

  function openAddDayForm(secret, container) {
    const body = el("div", "entry-form");
    const nameField = textInput("", "z.B. Fritag");
    body.appendChild(field("Name", nameField));
    body.appendChild(
      el("p", "tab-hint", "Danach mit \"Aktivieren\" auswählen, wann auf diesen Tag gezählt wird – der Wechsel passiert nie automatisch.")
    );

    const footer = el("div", "modal-footer-buttons");
    footer.appendChild(button("Abbrechen", "btn btn--outline", AdminCore.closeModal));
    footer.appendChild(
      button("Erstellen", "btn", async () => {
        const name = nameField.value.trim();
        if (!name) {
          AdminCore.showToast("Bitte einen Namen eingeben.", "error");
          return;
        }
        await daysCol(secret).add({
          name,
          active: false,
          count: 0,
          created: firebase.firestore.FieldValue.serverTimestamp(),
        });
        AdminCore.closeModal();
        render(container);
      })
    );

    AdminCore.openModal({ title: "Tag hinzufügen", body, footer });
  }

  // ---- Password header row + section per counter -----------------------------
  async function counterSection(counter, container) {
    const section = el("div");
    const secret = counter.id;

    const head = el("div", "entry");
    head.appendChild(el("span", "material-icons entry__img-placeholder", "key"));
    const main = el("div", "entry__main entry__main--column");
    main.appendChild(el("span", "entry__name", `Passwort: ${secret}`));
    const totalSpan = el("span", "entry__sub", "…");
    main.appendChild(totalSpan);
    head.appendChild(main);

    const actions = el("div", "entry__actions");
    actions.appendChild(
      iconButton("edit", "Passwort ändern", "icon-btn--edit", () =>
        openPasswordForm({
          title: "Passwort ändern",
          submitLabel: "Ändern",
          initialValue: secret,
          onSubmit: async (pw) => {
            // New doc ID = new password; all days (counts + hourly breakdown)
            // move along in one batch. Staff phones with the old password
            // land back on the login screen.
            const qs = await daysCol(secret).get();
            const batch = window.Fb.db.batch();
            batch.set(counterRef(pw), { created: firebase.firestore.FieldValue.serverTimestamp() });
            qs.docs.forEach((d) => {
              batch.set(daysCol(pw).doc(d.id), d.data());
              batch.delete(d.ref);
            });
            batch.delete(counterRef(secret));
            await batch.commit();
            AdminCore.showToast("Passwort geändert.", "success");
            render(container);
          },
        })
      )
    );
    actions.appendChild(
      iconButton("delete", "Löschen", "icon-btn--delete", async () => {
        if (!confirm(`Zähler samt allen Tagen wirklich löschen? Das Passwort "${secret}" funktioniert danach nicht mehr.`)) return;
        const qs = await daysCol(secret).get();
        const batch = window.Fb.db.batch();
        qs.docs.forEach((d) => batch.delete(d.ref));
        batch.delete(counterRef(secret));
        await batch.commit();
        render(container);
      })
    );
    head.appendChild(actions);
    section.appendChild(head);

    // Day rows (static structure; counts + total update live below).
    const countSpans = {};
    const days = await getDays(secret);
    const listEl = el("div", "entry-list");
    listEl.style.marginTop = "10px";
    days.forEach((day) => listEl.appendChild(dayRow(secret, day, countSpans, container)));

    const addDay = el("div", "entry entry--add");
    addDay.appendChild(el("span", "material-icons entry-add__icon", "add"));
    addDay.appendChild(el("span", "entry-add__label", "Tag hinzufügen (z.B. Fritag, Samstag)"));
    addDay.addEventListener("click", () => openAddDayForm(secret, container));
    listEl.appendChild(addDay);
    section.appendChild(listEl);

    // One live listener per counter keeps every day count + the total fresh
    // while the tab is open; unsubscribes itself once the tab is re-rendered.
    const unsub = daysCol(secret).onSnapshot((qs) => {
      if (!totalSpan.isConnected) {
        unsub();
        return;
      }
      let total = 0;
      qs.docs.forEach((d) => {
        const data = d.data();
        total += data.count || 0;
        if (countSpans[d.id]) countSpans[d.id].textContent = `${data.count || 0} Gäste`;
      });
      totalSpan.textContent = `Total über alle Tage: ${total} Gäste`;
    });

    return section;
  }

  // ---- Tab render -----------------------------------------------------------
  async function render(container) {
    container.innerHTML = "";
    const toolbar = el("div", "tab-toolbar");
    toolbar.appendChild(
      el(
        "p",
        "tab-hint",
        "Gästezähler fürs Eingangs-Team (versteckte Seite, nirgends verlinkt). Pro Tag ein eigener Zähler – genau einer ist aktiv, und der Wechsel passiert nur hier, nie automatisch nach Uhrzeit."
      )
    );
    const toolbarActions = el("div", "tab-toolbar__actions");
    toolbarActions.appendChild(
      button("Zähler-URL kopieren", "btn btn--outline btn--small", () =>
        AdminCore.copyToClipboard(COUNTER_URL)
      )
    );
    toolbar.appendChild(toolbarActions);
    container.appendChild(toolbar);

    const counters = await AdminCore.getAllDocs("counter");
    for (const counter of counters) {
      const section = await counterSection(counter, container);
      section.style.marginBottom = "24px";
      container.appendChild(section);
    }

    const addRow = el("div", "entry entry--add");
    addRow.appendChild(el("span", "material-icons entry-add__icon", "add"));
    addRow.appendChild(el("span", "entry-add__label", "Zähler erstellen"));
    addRow.addEventListener("click", () =>
      openPasswordForm({
        title: "Zähler erstellen",
        submitLabel: "Erstellen",
        onSubmit: async (pw) => {
          await counterRef(pw).set({ created: firebase.firestore.FieldValue.serverTimestamp() });
          AdminCore.showToast("Zähler erstellt – jetzt Tage hinzufügen.", "success");
          render(container);
        },
      })
    );
    const addList = el("div", "entry-list");
    addList.appendChild(addRow);
    container.appendChild(addList);
  }

  AdminCore.registerTab({ id: "counter", label: "Gäste", icon: "groups", render });
})();
