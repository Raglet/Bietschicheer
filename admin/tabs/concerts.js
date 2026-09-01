// ============================================================================
//  Admin tool – "Konzerte" tab: edit the Firestore "lineup" collection.
//  Writes are live immediately – no export/paste step.
// ============================================================================

(function () {
  const { el, button, iconButton, field, textInput } = AdminCore;

  // Fetched fresh on every render, then sorted chronologically (weekday,
  // then start time) – lineup.html relies on that order for day headings.
  async function getLineup() {
    const list = await AdminCore.getAllDocs("lineup");
    list.sort((a, b) => a.weekday - b.weekday || toMin(a.start) - toMin(b.start));
    return list;
  }

  function weekdayLabel(weekday) {
    const wd = LINEUP_WEEKDAYS.find((w) => w.weekday === weekday);
    return wd ? wd.day : "";
  }

  // ---- Entry row (mirrors the look of lineup.html's .act rows) --------------
  function entryRow(item, onEdit, onDelete) {
    const row = el("div", "entry");

    if (item.image) {
      const img = document.createElement("img");
      img.className = "entry__img";
      img.src = resolveLineupImage(item.image);
      img.alt = item.act;
      row.appendChild(img);
    }

    const time = el("div", "entry__time");
    time.innerHTML = `${item.start}<span>–</span>${item.end}`;
    row.appendChild(time);

    const main = el("div", "entry__main");
    main.appendChild(el("span", "entry__name", item.act || "(ohne Namen)"));
    row.appendChild(main);

    const actions = el("div", "entry__actions");
    actions.appendChild(iconButton("edit", "Bearbeiten", "icon-btn--edit", onEdit));
    actions.appendChild(iconButton("delete", "Löschen", "icon-btn--delete", onDelete));
    row.appendChild(actions);

    return row;
  }

  function addRow(onAdd) {
    const row = el("div", "entry entry--add");
    row.appendChild(el("span", "material-icons entry-add__icon", "add"));
    row.appendChild(el("span", "entry-add__label", "Konzert hinzufügen"));
    row.addEventListener("click", onAdd);
    return row;
  }

  // ---- Edit/add form (fields + a synced raw-JSON view) -----------------------
  function openEntryForm(item, onSave) {
    const isNew = !item;
    const draftItem = item
      ? AdminCore.deepClone(item)
      : { weekday: 5, day: "Fritag", start: "20:00", end: "21:00", act: "", image: "" };

    const body = el("div", "entry-form");

    const weekdaySelect = document.createElement("select");
    weekdaySelect.className = "field__input";
    LINEUP_WEEKDAYS.forEach((w) => {
      const opt = document.createElement("option");
      opt.value = w.weekday;
      opt.textContent = w.day;
      if (w.weekday === draftItem.weekday) opt.selected = true;
      weekdaySelect.appendChild(opt);
    });

    const startInput = document.createElement("input");
    startInput.type = "time";
    startInput.className = "field__input";
    startInput.value = draftItem.start || "";

    const endInput = document.createElement("input");
    endInput.type = "time";
    endInput.className = "field__input";
    endInput.value = draftItem.end || "";

    const nameInput = textInput(draftItem.act, "z.B. OrzBuzz");
    const imageInput = textInput(draftItem.image, "z.B. orzbuzz.webp?alt=media&token=... (oder volle URL)");

    const preview = document.createElement("img");
    preview.className = "form-preview";
    preview.alt = "Vorschau";
    function refreshPreview() {
      const val = imageInput.value.trim();
      if (val) {
        preview.src = resolveLineupImage(val);
        preview.hidden = false;
      } else {
        preview.hidden = true;
      }
    }
    refreshPreview();
    imageInput.addEventListener("input", refreshPreview);

    body.appendChild(field("Wochentag", weekdaySelect));
    body.appendChild(field("Von", startInput));
    body.appendChild(field("Bis", endInput));
    body.appendChild(field("Name", nameInput));
    body.appendChild(field("Bild-URL", imageInput));
    body.appendChild(preview);

    // ---- Raw JSON view: stays in sync with the fields, and can also be
    // pasted into to overwrite the fields (e.g. from a prepared snippet). ----
    const jsonDetails = document.createElement("details");
    jsonDetails.className = "json-details";
    const jsonSummary = document.createElement("summary");
    jsonSummary.textContent = "JSON";
    jsonDetails.appendChild(jsonSummary);
    const jsonTextarea = document.createElement("textarea");
    jsonTextarea.className = "json-textarea";
    jsonDetails.appendChild(jsonTextarea);
    const jsonApplyBtn = button("Aus JSON übernehmen", "btn btn--outline btn--small", () => {
      try {
        const parsed = JSON.parse(jsonTextarea.value);
        weekdaySelect.value = parsed.weekday;
        startInput.value = parsed.start || "";
        endInput.value = parsed.end || "";
        nameInput.value = parsed.act || "";
        imageInput.value = parsed.image || "";
        refreshPreview();
        AdminCore.showToast("Felder aus JSON übernommen.", "success");
      } catch {
        AdminCore.showToast("Ungültiges JSON.", "error");
      }
    });
    jsonDetails.appendChild(jsonApplyBtn);
    body.appendChild(jsonDetails);

    function currentEntry() {
      const weekday = Number(weekdaySelect.value);
      return {
        weekday,
        day: weekdayLabel(weekday),
        start: startInput.value || "00:00",
        end: endInput.value || "00:00",
        act: nameInput.value.trim(),
        image: imageInput.value.trim() || undefined,
      };
    }

    function syncJson() {
      jsonTextarea.value = JSON.stringify(currentEntry(), null, 2);
    }
    syncJson();
    [weekdaySelect, startInput, endInput, nameInput, imageInput].forEach((elm) =>
      elm.addEventListener("input", syncJson)
    );

    const footer = el("div", "modal-footer-buttons");
    footer.appendChild(button("Abbrechen", "btn btn--outline", AdminCore.closeModal));
    footer.appendChild(
      button("Speichern", "btn", () => {
        const entry = currentEntry();
        if (!entry.act) {
          AdminCore.showToast("Bitte einen Namen eingeben.", "error");
          return;
        }
        onSave(entry);
        AdminCore.closeModal();
      })
    );

    AdminCore.openModal({
      title: isNew ? "Konzert hinzufügen" : "Konzert bearbeiten",
      body,
      footer,
    });
  }

  // ---- Render -------------------------------------------------------------------
  async function render(container) {
    container.innerHTML = ""; // re-renders (after add/edit/delete) must replace, not append
    const list = await getLineup();

    const toolbar = el("div", "tab-toolbar");
    toolbar.appendChild(
      el("p", "tab-hint", "Konzerte – Änderungen werden sofort live gespeichert.")
    );
    container.appendChild(toolbar);

    const listEl = el("div", "entry-list");
    let currentDay = null;
    list.forEach((item) => {
      if (item.day !== currentDay) {
        currentDay = item.day;
        listEl.appendChild(el("h2", "day-heading", item.day));
      }
      listEl.appendChild(
        entryRow(
          item,
          () =>
            openEntryForm(item, async (updated) => {
              await AdminCore.updateDoc("lineup", item.id, updated);
              render(container);
            }),
          async () => {
            if (!confirm(`"${item.act}" wirklich löschen?`)) return;
            await AdminCore.deleteDoc("lineup", item.id);
            render(container);
          }
        )
      );
    });

    listEl.appendChild(
      addRow(() =>
        openEntryForm(null, async (entry) => {
          await AdminCore.addDoc("lineup", entry);
          render(container);
        })
      )
    );

    container.appendChild(listEl);
  }

  AdminCore.registerTab({ id: "concerts", label: "Konzerte", icon: "music_note", render });
})();
