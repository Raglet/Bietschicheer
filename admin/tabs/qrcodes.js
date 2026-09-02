// ============================================================================
//  Admin tool – "QR-Codes" tab: every "location" doc with type "bar" gets a
//  stamp QR code automatically (see bietschimeile.js / 404.html for the scan
//  flow). This tab lists them and lets you copy the URL/QR image or download
//  a branded A4 PDF (single bar, or all bars as one multi-page PDF).
//
//  Uses two CDN libraries loaded in admin.html: qrcodejs (global `QRCode`)
//  to render the QR image, and jsPDF (global `window.jspdf.jsPDF`) to build
//  the PDF.
// ============================================================================

(function () {
  const { el, button, iconButton } = AdminCore;

  // Derived from wherever admin.html is actually being served (".." from
  // admin/admin.html is the site root, where index.html/404.html/bar-<id>
  // live) – so QR codes always match the current deployment, whatever
  // domain that is. Note: if this admin page is opened on localhost, the
  // encoded URL is localhost too and won't be scannable by a phone – open
  // the real deployed admin page to generate printable QR codes.
  const SITE_BASE_URL = new URL("..", window.location.href).href;

  async function getBars() {
    const all = await AdminCore.getAllDocs("location");
    return all
      .filter((item) => item.type === "bar")
      .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.name.localeCompare(b.name));
  }

  function barUrl(bar) {
    return SITE_BASE_URL + "bar-" + bar.id;
  }

  function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "bar";
  }

  // Renders a QR code (via qrcodejs, off-screen) and resolves with a PNG data URL.
  function renderQrDataUrl(text, size) {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      document.body.appendChild(container);
      new QRCode(container, {
        text,
        width: size,
        height: size,
        correctLevel: QRCode.CorrectLevel.H,
      });
      // qrcodejs draws into a <canvas> synchronously, but give the browser a
      // tick to be safe across implementations before reading it back out.
      setTimeout(() => {
        const canvas = container.querySelector("canvas");
        const dataUrl = canvas ? canvas.toDataURL("image/png") : container.querySelector("img").src;
        document.body.removeChild(container);
        resolve(dataUrl);
      }, 50);
    });
  }

  function imageUrlToDataUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  // ---- PDF (one full A4 page per bar) ----------------------------------------
  const PRIMAER_DUNKEL = [102, 63, 94];
  const SEKUNDAER_DUNKEL = [54, 73, 84];

  async function drawBarPdfPage(doc, bar) {
    const pageWidth = 210; // A4, mm
    const pageHeight = 297;
    const centerX = pageWidth / 2;

    // Decorative frame so the page reads as one designed poster, not a
    // small block floating in a lot of empty margin.
    doc.setDrawColor(...PRIMAER_DUNKEL);
    doc.setLineWidth(1.2);
    doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 4, 4, "S");

    try {
      const logo = await imageUrlToDataUrl("../icons/bietschimeile.png");
      doc.addImage(logo, "PNG", centerX - 21, 20, 42, 42);
    } catch {
      /* logo is a nice-to-have, skip silently if it fails to load */
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMAER_DUNKEL);
    doc.setFontSize(32);
    doc.text("Bietschimeile", centerX, 82, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(...SEKUNDAER_DUNKEL);
    doc.text("Sammle alli Stämpel für es Gratis-Getränk", centerX, 92, { align: "center" });

    // Bar name as a purple name-badge pill, matching the in-app popup style.
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(22);
    const label = bar.name.toUpperCase();
    const textWidth = doc.getTextWidth(label);
    const pillWidth = Math.max(textWidth + 28, 90);
    const pillHeight = 20;
    const pillX = centerX - pillWidth / 2;
    const pillY = 104;
    doc.setFillColor(...PRIMAER_DUNKEL);
    doc.rect(pillX, pillY, pillWidth, pillHeight, "F");
    doc.setTextColor(255, 255, 255);
    doc.text(label, centerX, pillY + pillHeight / 2 + 3, { align: "center" });

    const qrSize = 124;
    const qrTop = 138;
    const qrDataUrl = await renderQrDataUrl(barUrl(bar), 1024);
    doc.addImage(qrDataUrl, "PNG", centerX - qrSize / 2, qrTop, qrSize, qrSize);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(...SEKUNDAER_DUNKEL);
    doc.text("Scan mit em Handy für din digitale Stämpel", centerX, qrTop + qrSize + 12, { align: "center" });

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("bietschicheer.ch", centerX, pageHeight - 14, { align: "center" });
  }

  async function downloadBarPdf(bar) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    await drawBarPdfPage(doc, bar);
    doc.save(sanitizeFilename(bar.name) + "-qrcode.pdf");
  }

  async function downloadAllPdf(bars) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    for (let i = 0; i < bars.length; i++) {
      if (i > 0) doc.addPage();
      await drawBarPdfPage(doc, bars[i]);
    }
    doc.save("Bietschimeile-QR-Codes.pdf");
  }

  async function copyQrImage(bar) {
    try {
      const dataUrl = await renderQrDataUrl(barUrl(bar), 512);
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      AdminCore.showToast("QR-Code kopiert!", "success");
    } catch {
      AdminCore.showToast("Kopieren nicht unterstützt – bitte PDF herunterladen.", "error");
    }
  }

  // ---- Row --------------------------------------------------------------------
  function entryRow(bar) {
    const row = el("div", "entry");

    const logo = [].concat(bar.image || [])[0];
    if (logo) {
      const img = document.createElement("img");
      img.className = "entry__img entry__img--square";
      img.src = AdminCore.resolveLogo(logo);
      img.alt = bar.name;
      row.appendChild(img);
    } else {
      row.appendChild(el("span", "material-icons entry__img-placeholder", "qr_code_2"));
    }

    const main = el("div", "entry__main entry__main--column");
    main.appendChild(el("span", "entry__name", bar.name));
    main.appendChild(el("span", "entry__sub", barUrl(bar)));
    row.appendChild(main);

    const actions = el("div", "entry__actions");
    actions.appendChild(iconButton("link", "URL kopieren", "icon-btn--edit", () => AdminCore.copyToClipboard(barUrl(bar))));
    actions.appendChild(iconButton("qr_code_2", "QR-Code kopieren", "icon-btn--edit", () => copyQrImage(bar)));
    actions.appendChild(iconButton("download", "PDF herunterladen", "icon-btn--edit", () => downloadBarPdf(bar)));
    row.appendChild(actions);

    return row;
  }

  async function render(container) {
    container.innerHTML = "";
    const bars = await getBars();

    const toolbar = el("div", "tab-toolbar");
    toolbar.appendChild(
      el(
        "p",
        "tab-hint",
        `Ein QR-Code pro Bar (type="bar" in der Karte), führt zu ${SITE_BASE_URL}bar-<id>. Wird automatisch aktuell gehalten, wenn Bars in der Karte hinzugefügt/entfernt werden.` +
          (location.hostname === "localhost" || location.hostname === "127.0.0.1"
            ? " ⚠️ Läuft grad auf localhost – diese QR-Codes sind nicht scannbar. Für echte Codes die Admin-Seite auf der echten Domain öffnen."
            : "")
      )
    );
    const actions = el("div", "tab-toolbar__actions");
    const downloadAllBtn = button("Alle QR-Codes herunterladen", "btn", async () => {
      downloadAllBtn.disabled = true;
      try {
        await downloadAllPdf(bars);
      } finally {
        downloadAllBtn.disabled = false;
      }
    });
    if (!bars.length) downloadAllBtn.disabled = true;
    actions.appendChild(downloadAllBtn);
    toolbar.appendChild(actions);
    container.appendChild(toolbar);

    const listEl = el("div", "entry-list");
    if (!bars.length) {
      listEl.appendChild(el("p", "tab-hint", "Noch keine Bars in der Karte (Typ \"Bar\") vorhanden."));
    } else {
      bars.forEach((bar) => listEl.appendChild(entryRow(bar)));
    }
    container.appendChild(listEl);
  }

  AdminCore.registerTab({ id: "qrcodes", label: "QR-Codes", icon: "qr_code_2", render });
})();
