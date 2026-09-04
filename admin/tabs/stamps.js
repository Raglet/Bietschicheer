// ============================================================================
//  Admin tool – "Stempel" tab: live tracker of how often each bar's
//  Bietschimeile stamp has been collected.
//
//  Source: the Firestore "stampstats" collection – one doc per bar, keyed by
//  the bar's "location" doc id (= the stamp id encoded in its QR code):
//  { scans, hours: {"YYYY-MM-DD_HH": n} }. 404.html queues every stamp a
//  device collects for the FIRST time, and the map page reports the queue
//  (flushPendingScans() in firebase-init.js). Re-scans of an already
//  collected stamp are not counted, so `scans` ≈ distinct phones per bar.
//  It's an anonymous, per-device count of a deliberately cheatable fun
//  feature – a good indicator, not an audited number.
//
//  Two extra docs with the same shape track the card as a whole (reported by
//  bietschimeile.js): stampstats/_completed (all stamps collected on a
//  device, once per device) and stampstats/_redeemed ("Getränk einlösen"
//  pressed). Shown as the two highlighted rows above the bar list.
// ============================================================================

(function () {
  const { el, button, iconButton } = AdminCore;

  function statsCol() {
    return window.Fb.db.collection("stampstats");
  }

  async function getBars() {
    const all = await AdminCore.getAllDocs("location");
    return all
      .filter((item) => item.type === "bar")
      .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.name.localeCompare(b.name));
  }

  // The two whole-card events, rendered like bars but with an icon, a
  // different unit word and no relative bar.
  const EVENTS = [
    {
      id: window.Fb.STAMP_EVENT_COMPLETED,
      name: "Alle Stempel gesammelt",
      icon: "emoji_events",
      unit: "Handys mit voller Karte",
      chartTitle: "Volle Karten pro Stunde",
      chartFoot: "Handys, die in dieser Stunde den letzten Stempel gesammelt haben.",
    },
    {
      id: window.Fb.STAMP_EVENT_REDEEMED,
      name: "Getränk eingelöst",
      icon: "local_bar",
      unit: "Getränke eingelöst",
      chartTitle: "Eingelöste Getränke pro Stunde",
      chartFoot: "Wann bar-seitig „Getränk einlösen“ gedrückt wurde.",
    },
  ];

  // ---- "… pro Stunde" chart ----------------------------------------------------
  async function openHoursChart(item) {
    const snap = await statsCol().doc(item.id).get();
    const hours = (snap.exists && snap.data().hours) || {};
    const body = AdminCore.hoursChart(hours, {
      emptyText: "Noch keine Daten – der Verlauf füllt sich mit den ersten Scans.",
      footText: item.chartFoot || "Neu gesammelte Stempel pro Stunde, Uhrzeit der scannenden Handys.",
    });
    const footer = el("div", "modal-footer-buttons");
    footer.appendChild(button("Schliessen", "btn btn--outline", AdminCore.closeModal));
    AdminCore.openModal({
      title: item.chartTitle || `Stempel pro Stunde – ${item.name}`,
      body,
      footer,
    });
  }

  // ---- Row ------------------------------------------------------------------
  // `item` is a bar (location doc) or one of EVENTS. Returns the row plus the
  // live-updated parts (count text + optional relative bar).
  function entryRow(item) {
    const row = el("div", "entry" + (item.icon ? " entry--stat" : ""));

    const logo = item.icon ? null : [].concat(item.image || [])[0];
    if (logo) {
      const img = document.createElement("img");
      img.className = "entry__img entry__img--square";
      img.src = AdminCore.resolveLogo(logo);
      img.alt = item.name;
      row.appendChild(img);
    } else {
      const icon = el("span", "material-icons entry__img-placeholder", item.icon || "verified");
      if (item.icon) icon.style.color = "var(--primär-dunkel)";
      row.appendChild(icon);
    }

    const main = el("div", "entry__main entry__main--column");
    main.appendChild(el("span", "entry__name", item.name));
    const countSpan = el("span", "entry__sub", "…");
    main.appendChild(countSpan);
    let fill = null;
    if (!item.icon) {
      const track = el("div", "stamp-track");
      fill = el("div", "stamp-track__bar");
      track.appendChild(fill);
      main.appendChild(track);
    }
    row.appendChild(main);

    const actions = el("div", "entry__actions");
    actions.appendChild(iconButton("bar_chart", "Verlauf pro Stunde", "", () => openHoursChart(item)));
    actions.appendChild(
      iconButton("restart_alt", "Auf 0 zurücksetzen", "", async () => {
        if (!confirm(`Zähler „${item.name}“ wirklich auf 0 zurücksetzen? Auch der Stunden-Verlauf wird gelöscht.`)) return;
        await statsCol().doc(item.id).delete();
        AdminCore.showToast("Zähler zurückgesetzt.", "success");
      })
    );
    row.appendChild(actions);

    return { row, countSpan, fill };
  }

  // ---- Tab render -------------------------------------------------------------
  async function render(container) {
    container.innerHTML = "";

    const toolbar = el("div", "tab-toolbar");
    toolbar.appendChild(
      el(
        "p",
        "tab-hint",
        "Wie viele Karten voll sind, wie viele Getränke eingelöst wurden und wie oft der Stempel jeder Bar gesammelt wurde (jedes Handy zählt pro Bar einmal). Aktualisiert sich live."
      )
    );
    const toolbarActions = el("div", "tab-toolbar__actions");
    toolbarActions.appendChild(
      button("Alle zurücksetzen", "btn btn--outline btn--small", async () => {
        if (!confirm("Wirklich alle Stempel-Zähler auf 0 zurücksetzen?")) return;
        const qs = await statsCol().get();
        const batch = window.Fb.db.batch();
        qs.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        AdminCore.showToast("Alle Zähler zurückgesetzt.", "success");
      })
    );
    toolbar.appendChild(toolbarActions);
    container.appendChild(toolbar);

    // Summary: total bar scans + the bar(s) with the fewest (the ones to promote).
    const summary = el("p", "stamp-summary", "…");
    container.appendChild(summary);

    // Whole-card events first (highlighted), then one row per bar.
    const rows = {};
    const eventList = el("div", "entry-list");
    eventList.style.marginBottom = "16px";
    EVENTS.forEach((ev) => {
      const parts = entryRow(ev);
      rows[ev.id] = parts;
      eventList.appendChild(parts.row);
    });
    container.appendChild(eventList);

    const bars = await getBars();
    const listEl = el("div", "entry-list");
    if (!bars.length) {
      listEl.appendChild(
        el("p", "tab-hint", "Keine Bars vorhanden – Bars werden im Tab „Karte“ mit Typ „Bar“ angelegt.")
      );
    }
    bars.forEach((bar) => {
      const parts = entryRow(bar);
      rows[bar.id] = parts;
      listEl.appendChild(parts.row);
    });
    container.appendChild(listEl);

    // One live listener keeps every count fresh while the tab is open;
    // unsubscribes itself once the tab has been re-rendered.
    const unsub = statsCol().onSnapshot(
      (qs) => {
        if (!summary.isConnected) {
          unsub();
          return;
        }
        const counts = {};
        qs.docs.forEach((d) => (counts[d.id] = d.data().scans || 0));
        EVENTS.forEach((ev) => {
          const n = counts[ev.id] || 0;
          rows[ev.id].countSpan.textContent = `${n} ${ev.unit}`;
        });
        const values = bars.map((b) => counts[b.id] || 0);
        const max = Math.max(...values, 1);
        let total = 0;
        bars.forEach((bar, i) => {
          const n = values[i];
          total += n;
          rows[bar.id].countSpan.textContent = `${n} Stempel gesammelt`;
          rows[bar.id].fill.style.width = `${(n / max) * 100}%`;
        });
        if (!bars.length) {
          summary.textContent = "";
          return;
        }
        const min = Math.min(...values);
        const least = bars.filter((b, i) => values[i] === min).map((b) => b.name);
        summary.textContent =
          `Total: ${total} Stempel` + (total ? ` · am wenigsten: ${least.join(", ")} (${min})` : "");
      },
      (err) => {
        console.error(err);
        summary.textContent = "Zähler konnten nicht geladen werden.";
      }
    );
  }

  AdminCore.registerTab({ id: "stamps", label: "Stempel", icon: "verified", render });
})();
