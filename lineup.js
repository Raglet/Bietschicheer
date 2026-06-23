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
      <div class="act__time">${item.start}<span>–</span>${item.end}</div>
      <div class="act__main">
        <span class="act__name">${item.act}</span>
        ${i === liveIdx ? `<span class="act__badge act__badge--live">● Jetzt live</span>` : ""}
        ${i === upNext ? `<span class="act__badge act__badge--next">Next</span>` : ""}
      </div>
    `;
    container.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  // Keep the live/next highlight current.
  setInterval(render, 30000);
});
