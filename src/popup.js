const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const summaryEl = document.getElementById("summary");
const filterEl = document.getElementById("filter");

let apps = [];
let hidden = new Set();

function render() {
  const q = filterEl.value.trim().toLowerCase();
  listEl.textContent = "";
  emptyEl.hidden = apps.length > 0;
  filterEl.hidden = apps.length === 0;

  for (const app of apps) {
    if (q && !app.name.toLowerCase().includes(q)) continue;
    const visible = !hidden.has(app.id);
    const li = document.createElement("li");
    li.className = visible ? "" : "off";
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = visible;
    box.addEventListener("change", () => toggle(app.id, box.checked));
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = app.name;
    label.append(box, name);
    li.append(label);
    listEl.append(li);
  }

  const visibleCount = apps.filter((a) => !hidden.has(a.id)).length;
  summaryEl.textContent = apps.length ? `${visibleCount} von ${apps.length} sichtbar` : "";
}

function save() {
  chrome.storage.sync.set({ hiddenApps: [...hidden] });
}

function toggle(id, visible) {
  visible ? hidden.delete(id) : hidden.add(id);
  save();
  render();
}

document.getElementById("showAll").addEventListener("click", () => {
  hidden.clear();
  save();
  render();
});
filterEl.addEventListener("input", render);

chrome.storage.local.get({ knownApps: [] }, ({ knownApps }) => {
  apps = knownApps;
  chrome.storage.sync.get({ hiddenApps: [] }, ({ hiddenApps }) => {
    hidden = new Set(hiddenApps);
    render();
  });
});
