const pdfCard = document.getElementById("pdfCard");
const xmlCard = document.getElementById("xmlCard");
const pdfInput = document.getElementById("pdfInput");
const xmlInput = document.getElementById("xmlInput");
const pdfPill  = document.getElementById("pdfPill");
const xmlPill  = document.getElementById("xmlPill");
const continueBtn = document.getElementById("continueBtn");

function openPicker(inputEl) {
  inputEl.value = ""; // allow reselect same file
  inputEl.click();
}

function setPill(pillEl, file) {
  if (!file) {
    pillEl.textContent = "No file selected";
    pillEl.classList.remove("has-file");
    return;
  }
  pillEl.textContent = file.name;
  pillEl.classList.add("has-file");
}

function updateContinue() {
  const hasPdf = pdfInput.files && pdfInput.files.length > 0;
  const hasXml = xmlInput.files && xmlInput.files.length > 0;
  continueBtn.disabled = !(hasPdf && hasXml);
}

// Click + keyboard open
function bindCard(cardEl, inputEl) {
  cardEl.addEventListener("click", () => openPicker(inputEl));
  cardEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker(inputEl);
    }
  });
}

bindCard(pdfCard, pdfInput);
bindCard(xmlCard, xmlInput);

// Change handlers
pdfInput.addEventListener("change", () => {
  setPill(pdfPill, pdfInput.files[0]);
  updateContinue();
});

xmlInput.addEventListener("change", () => {
  setPill(xmlPill, xmlInput.files[0]);
  updateContinue();
});

// Drag & drop (bonus)
function bindDragDrop(cardEl, inputEl, pillEl, allowedExt) {
  cardEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    cardEl.classList.add("is-dragover");
  });

  cardEl.addEventListener("dragleave", () => {
    cardEl.classList.remove("is-dragover");
  });

  cardEl.addEventListener("drop", (e) => {
    e.preventDefault();
    cardEl.classList.remove("is-dragover");

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;

    const ok = allowedExt.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!ok) {
      alert(`Please drop a valid ${allowedExt.join(" / ")} file.`);
      return;
    }

    // Set file into input (works in modern browsers)
    const dt = new DataTransfer();
    dt.items.add(file);
    inputEl.files = dt.files;

    setPill(pillEl, file);
    updateContinue();
  });
}

bindDragDrop(pdfCard, pdfInput, pdfPill, [".pdf"]);
bindDragDrop(xmlCard, xmlInput, xmlPill, [".xml"]);

// Continue action (wire to next step)
continueBtn.addEventListener("click", () => {
  const pdfFile = pdfInput.files[0];
  const xmlFile = xmlInput.files[0];

  // Example: store names for next screen
  sessionStorage.setItem("pdfFilename", pdfFile?.name || "");
  sessionStorage.setItem("xmlFilename", xmlFile?.name || "");

  // TODO: navigate to next screen
  alert("PDF and XML selected. Next screen can start comparison.");
});
``