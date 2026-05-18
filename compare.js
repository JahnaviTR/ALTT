/**
 * Compare Screen Logic (PDF + XML)
 * - Accepts any file type (no restrictions yet)
 * - Supports click-to-upload and drag-and-drop
 * - Stores file references for future API integration
 * - Validates both files before proceeding
 * - Updates UI instantly with file name + success styling
 *
 * Future extensibility hooks:
 * - strict type validation (.pdf / .xml)
 * - multi-file upload
 * - auto-detect forms
 * - navigate to results screen
 * - integrate AI comparison engine via API
 */

// State (kept minimal + extensible)
const state = {
  pdfFile: null,
  xmlFile: null
};

// Elements
const pdfZone = document.getElementById("pdfZone");
const xmlZone = document.getElementById("xmlZone");

const pdfInput = document.getElementById("pdfInput");
const xmlInput = document.getElementById("xmlInput");

const pdfSecondary = document.getElementById("pdfSecondary");
const xmlSecondary = document.getElementById("xmlSecondary");

const pdfStatus = document.getElementById("pdfStatus");
const xmlStatus = document.getElementById("xmlStatus");

const startBtn = document.getElementById("startBtn");
startBtn.disabled = true;   // ✅ place immediately after variable declaration
const messageEl = document.getElementById("message");

// ---------- Helpers ----------
function prettySize(bytes) {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let idx = 0;
  let v = bytes;
  while (v >= 1024 && idx < units.length - 1) {
    v /= 1024;
    idx++;
  }
  return `${v.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

function setMessage(text, kind = "") {
  messageEl.textContent = text || "";
  messageEl.classList.remove("error", "success");
  if (kind) messageEl.classList.add(kind);
}

function setZoneSuccess(zoneEl, statusEl, secondaryEl, file) {
  zoneEl.classList.add("success");

  const name = file.name;
  secondaryEl.innerHTML = `✅ ${name}`;  // ✅ tick added

  statusEl.textContent = `File ready for comparison`;
}

function clearZone(zoneEl, statusEl, secondaryEl) {
  zoneEl.classList.remove("success");
  secondaryEl.textContent = "No file selected";
  statusEl.textContent = "";
}

function assignFile(kind, file) {
  if (kind === "pdf") {
    state.pdfFile = file;
    setZoneSuccess(pdfZone, pdfStatus, pdfSecondary, file);
  } else if (kind === "xml") {
    state.xmlFile = file;
    setZoneSuccess(xmlZone, xmlStatus, xmlSecondary, file);
  }
  updateButtonState();
}

function updateButtonState() {
  if (state.pdfFile && state.xmlFile) {
    startBtn.disabled = false;
  } else {
    startBtn.disabled = true;
  }
}

// ---------- Click + keyboard triggers ----------
function openPicker(inputEl) {
  // Reset value so selecting same file again still triggers change event
  inputEl.value = "";
  inputEl.click();
}

function wireClickAndKeyboard(zoneEl, inputEl) {
  zoneEl.addEventListener("click", () => openPicker(inputEl));
  zoneEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker(inputEl);
    }
  });
}

wireClickAndKeyboard(pdfZone, pdfInput);
wireClickAndKeyboard(xmlZone, xmlInput);

// ---------- Input change handlers ----------
pdfInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
  if (file) assignFile("pdf", file);
});

xmlInput.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
  if (file) assignFile("xml", file);
});

// ---------- Drag & drop ----------
function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function wireDragDrop(zoneEl, kind) {
  const onDragEnter = (e) => {
    preventDefaults(e);
    zoneEl.classList.add("dragOver");
  };

  const onDragOver = (e) => {
    preventDefaults(e);
    zoneEl.classList.add("dragOver");
  };

  const onDragLeave = (e) => {
    preventDefaults(e);
    // only remove if leaving the zone fully
    if (e.target === zoneEl) zoneEl.classList.remove("dragOver");
  };

  const onDrop = (e) => {
    preventDefaults(e);
    zoneEl.classList.remove("dragOver");

    const dt = e.dataTransfer;
    const file = dt && dt.files && dt.files[0] ? dt.files[0] : null;
    if (file) assignFile(kind, file);
  };

  ["dragenter", "dragover"].forEach(evt => zoneEl.addEventListener(evt, onDragEnter));
  ["dragleave"].forEach(evt => zoneEl.addEventListener(evt, onDragLeave));
  zoneEl.addEventListener("drop", onDrop);

  // Safety: prevent browser from opening file if dropped outside
  ["dragenter", "dragover", "dragleave", "drop"].forEach(evt => {
    document.body.addEventListener(evt, preventDefaults, false);
  });
}

wireDragDrop(pdfZone, "pdf");
wireDragDrop(xmlZone, "xml");

// ---------- Start button validation ----------
startBtn.addEventListener("click", () => {
  setMessage("");

  const missing = [];
  if (!state.pdfFile) missing.push("PDF");
  if (!state.xmlFile) missing.push("XML");

  if (missing.length) {
    setMessage(`Please upload the missing file(s): ${missing.join(" and ")}.`, "error");
    if (!state.pdfFile) pdfZone.focus();
    else xmlZone.focus();
    return;
  }

  // ✅ STEP 3 — LOADER STARTS HERE
  startBtn.disabled = true;
  startBtn.innerHTML = "Processing <span class='loader'></span>";

  setMessage("Processing files… Please wait.", "success");

  // ✅ Simulate backend processing (later replaced with API)
  setTimeout(() => {

    // ✅ STEP 4 — NAVIGATION
    window.location.href = "results.html";

  }, 2000);  // simulate delay
});

  // Placeholder for next step processing / API integration
  setMessage("Files validated. Starting comparison… (placeholder)", "success");

  // Example payload stub (future API)
  const payload = {
    pdf: { name: state.pdfFile.name, size: state.pdfFile.size, type: state.pdfFile.type },
    xml: { name: state.xmlFile.name, size: state.xmlFile.size, type: state.xmlFile.type }
  };

  // You can replace this with: upload to backend, call AI chain, navigate to results screen
  console.log("Start Comparison payload (placeholder):", payload);

  // If you want to simulate navigation later:
  // window.location.href = "results.html";
});

// ---------- Optional: dev-only reset helper (keep for future flows) ----------
window.__compareDebugReset = function () {
  state.pdfFile = null;
  state.xmlFile = null;
  clearZone(pdfZone, pdfStatus, pdfSecondary);
  clearZone(xmlZone, xmlStatus, xmlSecondary);
  setMessage("");
};

	