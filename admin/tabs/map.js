// ============================================================================
//  Admin tool – "Karte" tab: edit the Firestore "location" collection (one
//  document per point – bars/food/programm/restaurant/custom AND stage/wc/
//  sanitaet/parking/info/atm/bus/train all live in this single collection;
//  MARKER_TYPES in locations-data.js says which "kind" each `type` belongs
//  to). Writes are live immediately – no export/paste step.
//
//  Every entry keeps whatever extra fields it already has (badge, getraenke,
//  link, html, ...) – this tab only ever touches the fields it has UI for,
//  so richer entries aren't stripped down when re-saved.
// ============================================================================

(function () {
  const { el, button, iconButton, field, textInput, checkbox } = AdminCore;

  // "Most common" displayMode per type, used only as the *default* for a
  // brand-new entry – admins can always override it (see openEntryForm).
  const DEFAULT_DISPLAY_MODE_BY_TYPE = {
    bar: "image",
    food: "image",
    restaurant: "image",
    programm: "custom",
    stage: "custom",
    info: "custom",
    atm: "custom",
    bus: "custom",
    train: "custom",
    wc: "none",
    sanitaet: "none",
    parking: "none",
    custom: "custom",
  };
  function defaultDisplayModeForType(type) {
    return DEFAULT_DISPLAY_MODE_BY_TYPE[type] || "custom";
  }

  const CONTENTISH_FIELDS = ["badge", "content", "subtitle", "link", "html", "getraenke", "musik", "essen", "special", "description"];
  // Legacy docs (or anything saved before this feature existed) have no
  // stored displayMode – infer it the same way script.js does at render time,
  // so the form's dropdown starts on whatever the entry already effectively does.
  function inferDisplayMode(item) {
    if (item.displayMode) return item.displayMode;
    if (item.card) return "image";
    if (CONTENTISH_FIELDS.some((k) => item[k])) return "custom";
    return "none";
  }

  const DISPLAY_MODE_LABELS = {
    image: "Bild anzeigen",
    none: "Nichts anzeigen",
    custom: "Custom Pin",
  };

  function getLocation() {
    return AdminCore.getAllDocs("location");
  }

  function firstImage(item) {
    return [].concat(item.image || [])[0] || "";
  }

  function typeLabel(type) {
    const t = MARKER_TYPES[type];
    return t ? `${t.emoji} ${t.name}` : type;
  }

  // ---- Row -------------------------------------------------------------------
  function entryRow(item, isStage, onEdit, onDelete) {
    const row = el("div", "entry");

    const logo = firstImage(item);
    if (logo) {
      const img = document.createElement("img");
      img.className = "entry__img entry__img--square";
      img.src = AdminCore.resolveLogo(logo);
      img.alt = item.name;
      row.appendChild(img);
    } else {
      row.appendChild(el("span", "material-icons entry__img-placeholder", "place"));
    }

    const main = el("div", "entry__main entry__main--column");
    main.appendChild(el("span", "entry__name", item.name));
    const sub =
      `${typeLabel(item.type)} · ${item.lat.toFixed(5)}, ${item.lng.toFixed(5)}` +
      ` · ${DISPLAY_MODE_LABELS[inferDisplayMode(item)]}` +
      (item.order !== undefined ? ` · #${item.order}` : "");
    main.appendChild(el("span", "entry__sub", sub));
    row.appendChild(main);

    if (item.card) {
      const card = document.createElement("img");
      card.className = "entry__card-preview";
      card.src = resolveCard(item.card);
      card.alt = "Card";
      row.appendChild(card);
    }

    const actions = el("div", "entry__actions");
    actions.appendChild(iconButton("edit", "Bearbeiten", "icon-btn--edit", onEdit));
    if (isStage) {
      const lock = iconButton("lock", "Die Bühne kann nicht gelöscht werden", "icon-btn--disabled");
      lock.disabled = true;
      actions.appendChild(lock);
    } else {
      actions.appendChild(iconButton("delete", "Löschen", "icon-btn--delete", onDelete));
    }
    row.appendChild(actions);

    return row;
  }

  function addRow(onAdd) {
    const row = el("div", "entry entry--add");
    row.appendChild(el("span", "material-icons entry-add__icon", "add"));
    row.appendChild(el("span", "entry-add__label", "Punkt hinzufügen"));
    row.addEventListener("click", onAdd);
    return row;
  }

  // ---- Edit/add form ------------------------------------------------------------
  function openEntryForm(item, onSave) {
    const isNew = !item;
    const draftItem = item
      ? AdminCore.deepClone(item)
      : { name: "", lat: 46.3109, lng: 7.8, type: "bar", image: "", card: "" };

    const body = el("div", "entry-form");

    const nameInput = textInput(draftItem.name, "z.B. DIE BAR");

    const typeSelect = document.createElement("select");
    typeSelect.className = "field__input";
    Object.keys(MARKER_TYPES).forEach((type) => {
      const opt = document.createElement("option");
      opt.value = type;
      opt.textContent = typeLabel(type);
      if (type === draftItem.type) opt.selected = true;
      typeSelect.appendChild(opt);
    });

    const coordsWrap = el("div", "coords-row");
    const coordsInput = textInput(
      draftItem.lat !== undefined ? `${draftItem.lat}, ${draftItem.lng}` : "",
      "46.310620, 7.800069"
    );
    coordsInput.className += " field__input--coords";
    const coordsHelp = iconButton("help_outline", "Vorschau auf der Karte anzeigen", "icon-btn--help");
    coordsWrap.appendChild(coordsInput);
    coordsWrap.appendChild(coordsHelp);

    const coordsPreview = el("div", "coords-preview");
    coordsPreview.hidden = true;
    coordsHelp.addEventListener("click", () => {
      const parsed = parseCoords(coordsInput.value);
      if (!parsed) {
        AdminCore.showToast("Bitte gültige Koordinaten eingeben (Lat, Lng).", "error");
        return;
      }
      coordsPreview.hidden = !coordsPreview.hidden;
      if (!coordsPreview.hidden) renderCoordsPreview(coordsPreview, parsed);
    });

    const imageInput = textInput(firstImage(draftItem), "z.B. 02_diebar.png");
    const cardInput = textInput(draftItem.card, "z.B. DieBar.png?alt=media&token=... (optional)");
    const orderInput = textInput(
      draftItem.order !== undefined ? String(draftItem.order) : "",
      "z.B. 1 (nur für Bars, Bietschimeile-Route/Reihenfolge)"
    );

    const logoPreview = document.createElement("img");
    logoPreview.className = "form-preview form-preview--small";
    const cardPreview = document.createElement("img");
    cardPreview.className = "form-preview";

    function refreshPreviews() {
      const img = imageInput.value.trim();
      logoPreview.hidden = !img;
      if (img) logoPreview.src = AdminCore.resolveLogo(img);
      const card = cardInput.value.trim();
      cardPreview.hidden = !card;
      if (card) cardPreview.src = resolveCard(card);
    }
    refreshPreviews();
    imageInput.addEventListener("input", refreshPreviews);
    cardInput.addEventListener("input", refreshPreviews);

    // ---- Klick-Verhalten (displayMode) -----------------------------------------
    const displayModeSelect = document.createElement("select");
    displayModeSelect.className = "field__input";
    Object.keys(DISPLAY_MODE_LABELS).forEach((mode) => {
      const opt = document.createElement("option");
      opt.value = mode;
      opt.textContent = DISPLAY_MODE_LABELS[mode];
      displayModeSelect.appendChild(opt);
    });
    displayModeSelect.value = inferDisplayMode(draftItem);
    let displayModeTouched = false;
    displayModeSelect.addEventListener("change", () => {
      displayModeTouched = true;
      updateCustomPinVisibility();
    });
    // For a brand-new entry, changing "Typ" re-suggests its default
    // Klick-Verhalten – unless the admin already picked one deliberately.
    typeSelect.addEventListener("change", () => {
      if (isNew && !displayModeTouched) {
        displayModeSelect.value = defaultDisplayModeForType(typeSelect.value);
      }
      updateIconNameVisibility();
      updateCustomPinVisibility();
    });

    // ---- Custom-Pin-only fields --------------------------------------------------
    const displayTitleCheckbox = checkbox("Titel anzeigen", draftItem.displayTitle !== false);
    const logoStyleInput = textInput(draftItem.logoStyle, "z.B. background-color: var(--sekundär-dunkel); padding: 8px;");
    const contentTextarea = document.createElement("textarea");
    contentTextarea.className = "content-textarea";
    contentTextarea.placeholder = '**fett** für fett, Zeilen mit "- " für eine Liste';
    contentTextarea.value = draftItem.content || "";
    const displayContentCheckbox = checkbox("Inhalt anzeigen", draftItem.displayContent !== false);

    const customPinFields = el("div", "custom-pin-fields");
    customPinFields.appendChild(displayTitleCheckbox);
    customPinFields.appendChild(field("Logo-Style", logoStyleInput));
    customPinFields.appendChild(field("Inhalt", contentTextarea));
    customPinFields.appendChild(displayContentCheckbox);

    function updateCustomPinVisibility() {
      customPinFields.hidden = displayModeSelect.value !== "custom";
    }
    updateCustomPinVisibility();

    // ---- "custom" type only: Material Symbols icon name + live preview --------
    const iconNameInput = textInput(draftItem.iconName, "z.B. celebration, local_bar, star");
    const iconNamePreview = el("span", "material-symbols-outlined icon-name-preview");
    const iconNameWrap = el("div", "icon-name-wrap");
    iconNameWrap.appendChild(field("Icon (Material Symbols Name)", iconNameInput));
    iconNameWrap.appendChild(iconNamePreview);
    const iconPickerLink = document.createElement("a");
    iconPickerLink.href = "https://fonts.google.com/icons?icon.set=Material+Symbols&icon.style=Outlined";
    iconPickerLink.target = "_blank";
    iconPickerLink.rel = "noopener";
    iconPickerLink.className = "tab-hint";
    iconPickerLink.textContent = "Icon-Namen durchsuchen ↗";
    iconNameWrap.appendChild(iconPickerLink);

    function refreshIconPreview() {
      iconNamePreview.textContent = iconNameInput.value.trim() || "help";
    }
    refreshIconPreview();
    iconNameInput.addEventListener("input", refreshIconPreview);

    function updateIconNameVisibility() {
      iconNameWrap.hidden = typeSelect.value !== "custom";
    }
    updateIconNameVisibility();

    body.appendChild(field("Name", nameInput));
    body.appendChild(field("Typ", typeSelect));
    body.appendChild(iconNameWrap);
    body.appendChild(field("Koordinaten", coordsWrap));
    body.appendChild(coordsPreview);
    body.appendChild(field("Logo", imageInput));
    body.appendChild(logoPreview);
    body.appendChild(field("Card", cardInput));
    body.appendChild(cardPreview);
    body.appendChild(field("Klick-Verhalten", displayModeSelect));
    body.appendChild(customPinFields);
    body.appendChild(field("Reihenfolge (Bietschimeile)", orderInput));

    const footer = el("div", "modal-footer-buttons");
    footer.appendChild(button("Abbrechen", "btn btn--outline", AdminCore.closeModal));
    footer.appendChild(
      button("Speichern", "btn", () => {
        if (!nameInput.value.trim()) {
          AdminCore.showToast("Bitte einen Namen eingeben.", "error");
          return;
        }
        const parsed = parseCoords(coordsInput.value);
        if (!parsed) {
          AdminCore.showToast("Bitte gültige Koordinaten eingeben (Lat, Lng).", "error");
          return;
        }
        const merged = Object.assign({}, draftItem, {
          name: nameInput.value.trim(),
          type: typeSelect.value,
          lat: parsed.lat,
          lng: parsed.lng,
          displayMode: displayModeSelect.value,
        });
        if (imageInput.value.trim()) merged.image = imageInput.value.trim();
        else delete merged.image;
        if (cardInput.value.trim()) merged.card = cardInput.value.trim();
        else delete merged.card;
        const orderVal = orderInput.value.trim();
        if (orderVal) {
          const n = Number(orderVal);
          if (Number.isNaN(n)) {
            AdminCore.showToast("Reihenfolge muss eine Zahl sein.", "error");
            return;
          }
          merged.order = n;
        } else delete merged.order;

        if (typeSelect.value === "custom" && iconNameInput.value.trim()) merged.iconName = iconNameInput.value.trim();
        else delete merged.iconName;

        if (displayModeSelect.value === "custom") {
          merged.displayTitle = displayTitleCheckbox.querySelector("input").checked;
          merged.displayContent = displayContentCheckbox.querySelector("input").checked;
          if (logoStyleInput.value.trim()) merged.logoStyle = logoStyleInput.value.trim();
          else delete merged.logoStyle;
          if (contentTextarea.value.trim()) merged.content = contentTextarea.value.trim();
          else delete merged.content;
        } else {
          delete merged.displayTitle;
          delete merged.displayContent;
        }

        onSave(merged);
        AdminCore.closeModal();
      })
    );

    AdminCore.openModal({ title: isNew ? "Punkt hinzufügen" : "Punkt bearbeiten", body, footer });
  }

  function parseCoords(text) {
    const parts = text.split(",").map((s) => parseFloat(s.trim()));
    if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
    return { lat: parts[0], lng: parts[1] };
  }

  function renderCoordsPreview(container, { lat, lng }) {
    container.innerHTML = "";
    const img = document.createElement("img");
    img.className = "coords-preview__img";
    img.alt = "Kartenausschnitt";
    img.src = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=320x180&maptype=roadmap&markers=color:0x663f5e%7C${lat},${lng}&key=${GOOGLE_STATIC_MAPS_KEY}`;
    img.onerror = () => {
      container.innerHTML = "";
      const link = document.createElement("a");
      link.href = `https://www.google.com/maps?q=${lat},${lng}`;
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "coords-preview__link";
      link.textContent = "In Google Maps öffnen ↗";
      container.appendChild(link);
    };
    container.appendChild(img);
  }

  // ---- Render -------------------------------------------------------------------
  async function render(container) {
    container.innerHTML = ""; // re-renders (after add/edit/delete) must replace, not append

    const toolbar = el("div", "tab-toolbar");
    toolbar.appendChild(
      el(
        "p",
        "tab-hint",
        "Karte (Bars/Food/Programm/Custom-Pins + Bühne/WC/Sanität/Parkplatz/Info/Bankomat/Bus/Zug) – Änderungen werden sofort live gespeichert. Andere Felder (Getränke, Link, Fahrplan, ...) bleiben beim Bearbeiten erhalten."
      )
    );
    container.appendChild(toolbar);

    const listEl = el("div", "entry-list");
    const all = await getLocation();

    all.forEach((item) => {
      const isStage = item.type === "stage";
      listEl.appendChild(
        entryRow(
          item,
          isStage,
          () =>
            openEntryForm(item, async (updated) => {
              await AdminCore.updateDoc("location", item.id, updated);
              render(container);
            }),
          async () => {
            if (!confirm(`"${item.name}" wirklich löschen?`)) return;
            await AdminCore.deleteDoc("location", item.id);
            render(container);
          }
        )
      );
    });

    listEl.appendChild(
      addRow(() =>
        openEntryForm(null, async (entry) => {
          await AdminCore.addDoc("location", entry);
          render(container);
        })
      )
    );

    container.appendChild(listEl);
  }

  AdminCore.registerTab({ id: "map", label: "Karte", icon: "map", render });
})();
