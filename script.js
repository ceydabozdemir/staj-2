document.addEventListener('DOMContentLoaded', () => {
    loadBirimData();
    loadFirmaData();
    loadVeriData();
    console.log(loadVeriData(), "My data ulan")

    document.getElementById('birimButton').addEventListener('click', () => showTable('birim'));
    document.getElementById('firmaButton').addEventListener('click', () => showTable('firma'));
    document.getElementById('veriButton').addEventListener('click', () => {
        showTable('veri');
        updateBirimDropdown();
        updateFirmaDropdown();
    });

    document.getElementById('birimAddButton').addEventListener('click', () => toggleForm('birim', true));
    document.getElementById('firmaAddButton').addEventListener('click', () => toggleForm('firma', true));

    document.getElementById('birimForm').addEventListener('submit', handleBirimFormSubmit);
    document.getElementById('firmaForm').addEventListener('submit', handleFirmaFormSubmit);

    document.getElementById('veriEkleButton').addEventListener('click', addVeriRow);
    document.querySelector('#myVeriTable').addEventListener('click', handleVeriActions);
});

function showTable(table) {
    document.getElementById('birimTableContainer').style.display = (table === 'birim') ? 'block' : 'none';
    document.getElementById('firmaTableContainer').style.display = (table === 'firma') ? 'block' : 'none';
    document.getElementById('veriTableContainer').style.display = (table === 'veri') ? 'block' : 'none';
}

function toggleForm(formType, show) {
    document.getElementById(`${formType}Form`).style.display = show ? 'block' : 'none';
}

function handleBirimFormSubmit(e) {
    e.preventDefault();
    const ad = document.getElementById('birimAd').value;
    addBirimRow(ad);
    this.reset();
    toggleForm('birim', false);
}

function handleFirmaFormSubmit(e) {
    e.preventDefault();
    const ad = document.getElementById('firmaAd').value;
    addFirmaRow(ad);
    this.reset();
    toggleForm('firma', false);
}

function addBirimRow(ad) {
    const table = document.getElementById("myBirimTable");
    const row = table.insertRow();
    row.innerHTML = `
        <td>${birimIdCounter.toString().padStart(2, '0')}</td>
        <td contenteditable="true">${ad}</td>
        <td>
            <button onclick="editRow(this)">Düzenle</button>
            <button onclick="deleteRow(this)">Sil</button>
        </td>
    `;
    birimIdCounter++;
    saveBirimData();
    updateBirimDropdown();
}

let birimIdCounter = 1;
let firmaIdCounter = 1;

function addFirmaRow(ad) {
    const table = document.getElementById("myFirmaTable");
    const row = table.insertRow();
    row.innerHTML = `
        <td>${firmaIdCounter.toString().padStart(2, '0')}</td>
        <td contenteditable="true">${ad}</td>
        <td>
            <button onclick="editRow(this)">Düzenle</button>
            <button onclick="deleteRow(this)">Sil</button>
        </td>
    `;
    firmaIdCounter++;
    saveFirmaData();
    updateFirmaDropdown(); // Dropdown'ı güncelle
}

function editRow(button) {
    const cell = button.parentElement.parentElement.cells[1];
    cell.contentEditable = "true";
    cell.focus();
    cell.addEventListener("blur", () => saveChanges(cell));
}

function saveChanges(cell) {
    const newValue = cell.textContent.trim();
    if (newValue === "") {
        deleteRow(cell.parentElement);
    } else {
        saveBirimData();
        saveFirmaData();
    }
    updateBirimDropdown();
    updateFirmaDropdown(); // Dropdown'ı güncelle
}

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    const table = row.parentElement;
    table.removeChild(row);
    updateIds(table);
    saveBirimData();
    saveFirmaData();
    updateBirimDropdown();
    updateFirmaDropdown(); // Dropdown'ı güncelle
}

function updateIds(table) {
    const rows = table.querySelectorAll("tbody tr");
    let idCounter = 1;
    rows.forEach(row => {
        row.cells[0].textContent = idCounter.toString().padStart(2, '0');
        idCounter++;
    });
    if (table.id === "myBirimTable") {
        birimIdCounter = idCounter;
    } else if (table.id === "myFirmaTable") {
        firmaIdCounter = idCounter;
    }
}

function saveBirimData() {
    const table = document.getElementById("myBirimTable");
    const data = Array.from(table.querySelectorAll('tbody tr')).map(row => ({
        id: row.cells[0].textContent,
        ad: row.cells[1].textContent
    }));
    localStorage.setItem('birimData', JSON.stringify(data));
}

function saveFirmaData() {
    const table = document.getElementById("myFirmaTable");
    const data = Array.from(table.querySelectorAll('tbody tr')).map(row => ({
        id: row.cells[0].textContent,
        ad: row.cells[1].textContent
    }));
    console.log(data, "My data ulan 3")
    localStorage.setItem('firmaData', JSON.stringify(data));
}

function saveVeriData() {
    const table = document.getElementById('myVeriTable');
    const data = Array.from(table.querySelectorAll('tbody tr')).map(row => Array.from(row.cells).map(cell => cell.textContent));
    localStorage.setItem('veriData', JSON.stringify(data));
}

function loadBirimData() {
    const data = JSON.parse(localStorage.getItem('birimData')) || [];
    data.forEach(item => addBirimRow(item.ad));
}

function loadFirmaData() {
    const data = JSON.parse(localStorage.getItem('firmaData')) || [];
    data.forEach(item => addFirmaRow(item.ad));
    updateFirmaDropdown(); // Firma dropdown'unu güncelle
}

function loadVeriData() {
    const data = JSON.parse(localStorage.getItem('veriData')) || [];
    console.log(data, "My data ukan 2")
    const veriTable = document.getElementById('myVeriTable');
    data.forEach(item => {
        const newRow = veriTable.insertRow();
        item.forEach((cellText, index) => {
            const cell = newRow.insertCell(index);
            cell.textContent = cellText;
        });
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        actionButtons.innerHTML = `
            <button class="editVeri">Düzenle</button>
            <button class="saveVeri" style="display:none">Kaydet</button>
            <button class="deleteVeri">Sil</button>
        `;
        newRow.appendChild(actionButtons);
        toggleEditMode(newRow, true);
    });
}

function toggleEditMode(row, isEditing) {
    const cells = row.getElementsByTagName('td');
    for (let i = 0; i < cells.length - 1; i++) {
        cells[i].contentEditable = isEditing;
        cells[i].classList.toggle('editable', isEditing);
    }
    row.querySelector('.action-buttons .editVeri').style.display = isEditing ? 'none' : 'inline-block';
    row.querySelector('.action-buttons .saveVeri').style.display = isEditing ? 'inline-block' : 'none';
}

function addVeriRow() {
    const myVeriTable = document.getElementById('myVeriTable').getElementsByTagName('tbody')[0];
    const newRow = myVeriTable.insertRow();
    for (let i = 0; i < 15; i++) {
        newRow.insertCell(i).innerHTML = '<input type="text">';
    }
    const actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';
    actionButtons.innerHTML = `
        <button class="editVeri">Düzenle</button>
        <button class="saveVeri" style="display:none">Kaydet</button>
        <button class="deleteVeri">Sil</button>
    `;
    newRow.appendChild(actionButtons);
    toggleEditMode(newRow, true);
}

function handleVeriActions(e) {
    if (e.target.classList.contains('editVeri')) {
        toggleEditMode(e.target.closest('tr'), true);
    } else if (e.target.classList.contains('saveVeri')) {
        toggleEditMode(e.target.closest('tr'), false);
        saveVeriData();
    } else if (e.target.classList.contains('deleteVeri')) {
        e.target.closest('tr').remove();
        saveVeriData();
    }
}

function updateBirimDropdown() {
    const dropdown = document.getElementById('veriDepartman');
    dropdown.innerHTML = ''; // Önceki seçenekleri temizle
    const rows = JSON.parse(localStorage.getItem('birimData')) || []; // Veriyi al
    rows.forEach(element => { // Her bir öğe için döngü
        const option = document.createElement('option');
        option.value = element.id; // ID değeri
        option.textContent = element.ad; // Adı
        dropdown.appendChild(option); // Seçeneği ekle
    });
}

function updateFirmaDropdown() {
    const dropdown = document.getElementById('veriFirmaAd');
    console.log(dropdown.ariaCurrent)
    dropdown.innerHTML = '';
    const rows = JSON.parse(localStorage.getItem('firmaData')) || [];
    console.log(rows)
    // rows.forEach(row => {
    rows.map(element => {
        const option = document.createElement('option');
        option.value = element.id;
        option.textContent = element.ad;
        dropdown.appendChild(option);
    })
        // const option = document.createElement('option');
        // option.value = rows[0].id;
        // option.textContent = rows[0].ad;
        // dropdown.appendChild(option);
    // });
$(function() {

    $('#veriDepartman').multiselect({
      includeSelectAllOption: true
    });
  
    $('#veriDepartman').click(function() {
      alert($('#veriDepartman').val());
    });
  });
}