// Two-file Upload Screen Logic (PDF + XML)

const qaUpload = {
  pdf: null,
  xml: null
};

function isValidFile(file, kind) {
  if (!file) return false;

  const name = (file.name || "").toLowerCase();

  if (kind === "pdf") {
    return name.endsWith(".pdf") || file.type === "application/pdf";
  }

  if (kind === "xml") {
    return name.endsWith(".xml") || file.type === "text/xml" || file.type === "application/xml";
  }

  return false;
}

function setCardState(cardEl, nameEl, file, kind) {
  // reset states first
  cardEl.classList.remove("is-error");
  cardEl.classList.remove("is-selected");

  if (!file) {
    nameEl.textContent = "No file selected";
    return;
  }

  if (!isValidFile(file, kind)) {
    nameEl.textContent = "Unsupported file type";
    cardEl.classList.add("is-error");
    return;
  }

  // valid
  nameEl.textContent = file.name;
  cardEl.classList.add("is-selected");
  qaUpload[kind] = file;

  // Fire an event when both files are ready (no UI clutter)
  if (qaUpload.pdf && qaUpload.xml) {
    window.dispatchEvent(
      new CustomEvent("qa:files-selected", { detail: { pdf: qaUpload.pdf, xml: qaUpload.xml } })
    );
  }
}

function wireUploadCard({ cardId, inputId, nameId, kind }) {
  const cardEl = document.getElementById(cardId);
  const inputEl = document.getElementById(inputId);
  const nameEl = document.getElementById(nameId);

  // Click opens file picker
  const openPicker = () => inputEl.click();
  cardEl.addEventListener("click", openPicker);

  // Keyboard support (Enter / Space)
  cardEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  });

  // When user selects via picker
  inputEl.addEventListener("change", () => {
    const file = inputEl.files && inputEl.files[0];
    setCardState(cardEl, nameEl, file, kind);
  });

  // Drag & Drop support
  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  ["dragenter", "dragover"].forEach((evt) => {
    cardEl.addEventListener(evt, (e) => {
      prevent(e);
      cardEl.classList.add("is-dragover");
    });
  });

  ["dragleave", "dragend", "drop"].forEach((evt) => {
    cardEl.addEventListener(evt, (e) => {
      prevent(e);
      cardEl.classList.remove("is-dragover");
    });
  });

  cardEl.addEventListener("drop", (e) => {
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    setCardState(cardEl, nameEl, file, kind);

    // Keep input in sync so the user can re-open picker and see current file name in native UI (optional)
    if (file && isValidFile(file, kind)) {
      // Note: setting input.files programmatically is restricted in most browsers (security).
      // We keep state in qaUpload + UI only.
    }
  });
}

// Initialize both cards
wireUploadCard({ cardId: "pdfCard", inputId: "pdfInput", nameId: "pdfName", kind: "pdf" });
wireUploadCard({ cardId: "xmlCard", inputId: "xmlInput", nameId: "xmlName", kind: "xml" });

// Optional: demo listener (kept silent; remove if you want zero logs)
window.addEventListener("qa:files-selected", (e) => {
  // Both files are selected: e.detail.pdf and e.detail.xml
  // console.log("Ready:", e.detail.pdf.name, e.detail.xml.name);
});
