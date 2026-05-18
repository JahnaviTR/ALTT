const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");

uploadBox.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        console.log("File selected:", file.name);
        processFile(file);
    }
});

// 🔹 TEMP detection (replace later with PDF logic)
function processFile(file) {

    const detectedForms = [
        "Form 1041",
        "Schedule K-1",
        "Form 4952",
        "Form 8995"
    ];

    displayForms(detectedForms);
}

// 🔹 Display forms
function displayForms(forms) {

    const container = document.getElementById("formsContainer");
    container.innerHTML = "";

    forms.forEach(form => {

        const formCard = document.createElement("div");
        formCard.classList.add("form-box");

        formCard.innerHTML = `
            <label>
                <input type="checkbox" class="form-checkbox" value="${form}">
                ${form}
            </label>
        `;

        container.appendChild(formCard);
    });
}
``
