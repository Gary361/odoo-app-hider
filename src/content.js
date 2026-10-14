// Blendet Odoo-Apps per CSS aus. Die Regeln bleiben aktiv, auch wenn Odoo
// das Startmenü neu rendert, deshalb ist kein Eingreifen ins DOM nötig.
const STYLE_ID = "odoo-app-hider-style";

function applyHidden(hidden) {
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    (document.head || document.documentElement).appendChild(style);
  }
  style.textContent = hidden
    .map((id) => {
      const sel = `.o_app[data-menu-xmlid="${CSS.escape(id)}"]`;
      // Die Spalte um die Kachel mit ausblenden, damit das Raster nachrückt.
      return `.o_apps > div:has(> ${sel}), ${sel} { display: none !important; }`;
    })
    .join("\n");
}

function loadAndApply() {
  chrome.storage.sync.get({ hiddenApps: [] }, ({ hiddenApps }) => applyHidden(hiddenApps));
}

// Alle sichtbaren Apps einsammeln, damit das Popup sie auflisten kann.
let lastSignature = "";
function collectApps() {
  const apps = [...document.querySelectorAll(".o_app[data-menu-xmlid]")].map((el) => ({
    id: el.dataset.menuXmlid,
    name: (el.querySelector(".o_caption")?.textContent || el.textContent || "").trim(),
  }));
  if (!apps.length) return;
  const signature = apps.map((a) => a.id).join("|");
  if (signature === lastSignature) return;
  lastSignature = signature;
  chrome.storage.local.set({ knownApps: apps });
}

let pending = null;
const observer = new MutationObserver(() => {
  if (pending) return;
  pending = setTimeout(() => {
    pending = null;
    collectApps();
  }, 300);
});

loadAndApply();
document.addEventListener("DOMContentLoaded", () => {
  collectApps();
  observer.observe(document.body, { childList: true, subtree: true });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.hiddenApps) applyHidden(changes.hiddenApps.newValue || []);
});
