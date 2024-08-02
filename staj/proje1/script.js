let birimIdCounter = 1;
let firmaIdCounter = 1;

document.getElementById("birimButton").addEventListener("click", () => {
    document.getElementById("birimTableContainer").style.display = "block";
    document.getElementById("firmaTableContainer").style.display = "none";});

document.getElementById("firmaButton").addEventListener("click", () => {
    document.getElementById("birimTableContainer").style.display = "none";
    document.getElementById("firmaTableContainer").style.display = "block";});

document.getElementById("birimAddButton").addEventListener("click", () => {
    document.getElementById("birimForm").style.display = "block";});

document.getElementById("firmaAddButton").addEventListener("click", () => {
    document.getElementById("firmaForm").style.display = "block";});

document.getElementById("birimForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const ad = document.getElementById("birimAd").value;
    addBirimRow(ad);
    this.reset();
    this.style.display = "none";});

document.getElementById("firmaForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const ad = document.getElementById("firmaAd").value;
    addFirmaRow(ad);
    this.reset();
    this.style.display = "none";});

function addBirimRow(ad) {
    const table = document.getElementById("myBirimTable");
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    cell1.textContent = birimIdCounter.toString().padStart(2, '0');
    cell2.textContent = ad;
    cell2.contentEditable = "true";
    cell3.innerHTML = `<button onclick="editRow(this)">Düzenle</button> <button onclick="deleteRow(this)">Sil</button>`;
    birimIdCounter++;
}

function addFirmaRow(ad) {
    const table = document.getElementById("myFirmaTable");
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    cell1.textContent = firmaIdCounter.toString().padStart(2, '0');
    cell2.textContent = ad;
    cell2.contentEditable = "true";
    cell3.innerHTML = `<button onclick="editRow(this)">Düzenle</button> <button onclick="deleteRow(this)">Sil</button>`;
    firmaIdCounter++;
}

function editRow(button) {
    const row = button.parentElement.parentElement;
    const cell = row.cells[1];
    cell.contentEditable = "true";
    cell.focus();
    cell.addEventListener("blur", () => saveChanges(cell));
}

function saveChanges(cell) {
    const newValue = cell.textContent.trim();
    if (newValue === "") {
        deleteRow(cell.parentElement); }}

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    const table = row.parentElement;
    table.removeChild(row);
    updateIds(table);}

function updateIds(table) {
    const rows = table.querySelectorAll("tr");
    let id = 1;
    rows.forEach(row => {
        const cell = row.cells[0];
        if (cell) {
            cell.textContent = id.toString().padStart(2, '0');
            id++; }});
    if (table.id === "myBirimTable") {
        birimIdCounter = id;
    } else if (table.id === "myFirmaTable") {
        firmaIdCounter = id;}}
