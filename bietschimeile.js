// Bietschimeile – digital stamp card
// State is stored client-side in localStorage (per device, no backend).

// Recommended order = array order. Order is only a suggestion; any bar can be
// collected at any time.
// logo is optional – bars without a logo file fall back to a bar icon.
const LOGO_DIR = "images/mitwirkende_logos_26/";
const BARS = [
  { id: "diebar",           name: "DIE BAR",                logo: LOGO_DIR + "02_diebar.png" },
  { id: "fc-raron",         name: "FC Raron",               logo: LOGO_DIR + "04_fc_raron.png" },
  { id: "rilke",            name: "Rilke",                  logo: LOGO_DIR + "17_restaurant_rilke.jpg" },
  { id: "heidnisch",        name: "Heidnischbier",          logo: LOGO_DIR + "06_heidnisch.png" },
  { id: "ehc",              name: "EHC Raron",              logo: LOGO_DIR + "03_ehc_raron.png" },
  { id: "bietschicheer",    name: "Verein Bietschicheer",   logo: LOGO_DIR + "22_Bietschicheer.png" },
  { id: "bietschichlepfer", name: "Bietschichlepfer",       logo: LOGO_DIR + "01_Bietschichlepfer.jpg" },
  { id: "jugendverein",     name: "Jugendverein Raron",     logo: LOGO_DIR + "11_JV_raro.png" },
  { id: "proraronia",       name: "Pro Raronia Historica und Kulturstiftung", logo: LOGO_DIR + "16_Pro Raronia Historica und Kulturstiftung.jpg" },
  { id: "hockeyladies",     name: "Hockeyladies",           logo: LOGO_DIR + "07_Hockeyladies.jpeg" },
  { id: "echo-raronia",     name: "Musikgesellschaft ECHO Raronia", logo: LOGO_DIR + "14_Musikgesellschaft ECHO Raronia.png" },
  { id: "vbc-raron",        name: "VBC Raron",              logo: LOGO_DIR + "21_vbc_raron.jpg" },
  { id: "jodlerverein",     name: "Jodlerverein Raron",     logo: LOGO_DIR + "09_Jodlerverein Raron.jpg" },
  { id: "stigma",           name: "Stigma",                 logo: LOGO_DIR + "19_stigma.jpg" },
];

const STORAGE_KEY = "bietschimeile.stamps";

function loadStamps() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStamps(stamps) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stamps));
}

// Handle an incoming scan (?b=<id>). Returns a feedback object for the toast.
function handleScan(stamps) {
  const params = new URLSearchParams(window.location.search);
  const scanned = params.get("b");
  if (!scanned) return null;

  // Strip the query so a refresh doesn't re-process and the URL stays clean.
  history.replaceState(null, "", window.location.pathname);

  const bar = BARS.find((b) => b.id === scanned);
  if (!bar) return { type: "error", text: "Unbekannter Code." };

  if (stamps.includes(bar.id)) {
    return { type: "info", text: `${bar.name} hast du schon gesammelt.` };
  }

  stamps.push(bar.id);
  saveStamps(stamps);
  return { type: "success", text: `Stempel von ${bar.name} gesammelt!`, justId: bar.id };
}

function showToast(feedback) {
  if (!feedback) return;
  const toast = document.getElementById("toast");
  toast.textContent = feedback.text;
  toast.className = "toast toast--" + feedback.type + " toast--visible";
  setTimeout(() => {
    toast.className = "toast toast--" + feedback.type;
  }, 3200);
}

function render(stamps, justId) {
  const grid = document.getElementById("stampGrid");
  grid.innerHTML = "";

  BARS.forEach((bar, index) => {
    const collected = stamps.includes(bar.id);
    const card = document.createElement("div");
    card.className = "stamp" + (collected ? " stamp--collected" : "");
    if (bar.id === justId) card.classList.add("stamp--just");

    // Not collected yet → tapping the stamp jumps to the bar on the map.
    if (!collected) {
      card.classList.add("stamp--clickable");
      card.addEventListener("click", () => {
        window.location.href = "index.html?bar=" + encodeURIComponent(bar.id);
      });
    }

    card.innerHTML = `
      <span class="stamp__order">${index + 1}</span>
      ${
        collected
          ? `<span class="stamp__check material-icons">check_circle</span>
             ${
               bar.logo
                 ? `<img class="stamp__logo" src="${encodeURI(bar.logo)}" alt="${bar.name}" />`
                 : `<span class="stamp__placeholder material-icons">sports_bar</span>`
             }`
          : `<span class="stamp__lock material-icons">lock</span>`
      }
      <span class="stamp__name">${bar.name}</span>
    `;
    grid.appendChild(card);
  });

  // Progress
  const count = stamps.filter((id) => BARS.some((b) => b.id === id)).length;
  const total = BARS.length;
  document.getElementById("progressCount").textContent = `${count} / ${total}`;
  document.getElementById("progressFill").style.width =
    (count / total) * 100 + "%";

  const complete = count === total;
  document.getElementById("doneBanner").hidden = !complete;
  return complete;
}

function openCelebration() {
  document.getElementById("celebration").classList.add("celebration--visible");
}
function closeCelebration() {
  document.getElementById("celebration").classList.remove("celebration--visible");
}

document.addEventListener("DOMContentLoaded", () => {
  const stamps = loadStamps();
  const feedback = handleScan(stamps);
  const justId = feedback && feedback.type === "success" ? feedback.justId : null;

  const complete = render(stamps, justId);
  showToast(feedback);

  // Auto-celebrate only when this scan completed the card.
  if (complete && justId) {
    setTimeout(openCelebration, 600);
  }

  document.getElementById("doneBanner").addEventListener("click", openCelebration);
  document
    .getElementById("celebrationClose")
    .addEventListener("click", closeCelebration);
});
