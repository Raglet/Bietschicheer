// Lineup page rendering. Data + "now playing" logic live in lineup-data.js.

function render() {
  const now = getNow();
  const liveIdx = LINEUP.findIndex((item) => isLive(item, now));
  const upNext = liveIdx === -1 ? nextIndex(now) : -1;

  const container = document.getElementById("lineup");
  container.innerHTML = "";

  let currentDay = null;
  LINEUP.forEach((item, i) => {
    if (item.day !== currentDay) {
      currentDay = item.day;
      const heading = document.createElement("h2");
      heading.className = "day-heading";
      heading.textContent = item.day;
      container.appendChild(heading);
    }

    const row = document.createElement("div");
    row.className = "act";
    if (i === liveIdx) row.classList.add("act--live");
    if (i === upNext) row.classList.add("act--next");

    row.innerHTML = `
      ${
        item.image
          ? `<img class="act__img" src="${resolveLineupImage(item.image)}" alt="${item.act}" loading="lazy" />`
          : ""
      }
      <div class="act__time">${item.start}<span>–</span>${item.end}</div>
      <div class="act__main">
        <span class="act__name">${item.act}</span>
        ${i === liveIdx ? `<span class="act__badge act__badge--live">● Jetzt live</span>` : ""}
        ${i === upNext ? `<span class="act__badge act__badge--next">Next</span>` : ""}
      </div>
    `;

    // Tap a row with a poster -> show it full-screen.
    if (item.image) {
      row.classList.add("act--has-image");
      row.setAttribute("role", "button");
      row.setAttribute("tabindex", "0");
      row.setAttribute("aria-label", `${item.act} – Poster anzeigen`);
      const open = () => openPoster(resolveLineupImage(item.image), item.act);
      row.addEventListener("click", open);
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    }
    container.appendChild(row);
  });
}

// ---- Poster overlay (same look as the info cards on the map) ----
const posterOverlay = document.getElementById("cardOverlay");
const posterOverlayImg = document.getElementById("cardOverlayImg");
const posterOverlaySpinner = document.getElementById("cardOverlaySpinner");

function openPoster(url, name) {
  // The poster image (Firebase Storage) can take a moment to load – show a
  // spinner in its place until it (or a broken load) resolves.
  posterOverlayImg.classList.add("card-overlay__img--loading");
  posterOverlaySpinner.hidden = false;
  posterOverlayImg.onload = posterOverlayImg.onerror = () => {
    posterOverlayImg.classList.remove("card-overlay__img--loading");
    posterOverlaySpinner.hidden = true;
  };

  posterOverlayImg.src = url;
  posterOverlayImg.alt = name;
  posterOverlay.hidden = false;
}

function closePoster() {
  posterOverlay.hidden = true;
  posterOverlayImg.removeAttribute("src");
}

async function bootstrapData() {
  try {
    window.LINEUP = await window.Fb.fetchLineup();
    window.Fb.hideLoadingOverlay();
    render();
    // Keep the live/next highlight current.
    setInterval(render, 30000);
  } catch (err) {
    console.error("Datenladung fehlgeschlagen:", err);
    window.Fb.showLoadingError(bootstrapData);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cardOverlayClose").addEventListener("click", closePoster);
  posterOverlay.addEventListener("click", (e) => {
    if (e.target === posterOverlay) closePoster();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !posterOverlay.hidden) closePoster();
  });

  bootstrapData();
});
