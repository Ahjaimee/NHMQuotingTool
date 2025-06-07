const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": { labour_hours: 0.5, material_cost: 85.0, part_number: "OXBATT180" },
      "Handset Replacement": { labour_hours: 0.75, material_cost: 65.0, part_number: "OXHAND180" }
    }
  }
};

let quoteItems = [];
let assetChoices, makeChoices, repairChoices;

document.addEventListener("DOMContentLoaded", () => {
  const names = ["Terry Clarke", "Jayden Davis", "Ken McIntyre", "Phill Darkin", "Matthew Pons", "Ashley Henry", "Kelly Hart", "Andrea Oswald", "Jamie Baker", "Elliot Bowler-Lee", "Steve Cottee", "Elena McColl", "Paul McMullan", "Steven Webb"];
  document.getElementById("customerName").placeholder = `e.g. ${names[Math.floor(Math.random() * names.length)]}`;

  assetChoices = new Choices("#assetSelect", { searchEnabled: true, shouldSort: false });
  makeChoices = new Choices("#makeSelect", { searchEnabled: true, shouldSort: false });
  repairChoices = new Choices("#repairSelect", { searchEnabled: true, shouldSort: false });

  populateAssets();

  document.getElementById("assetSelect").addEventListener("change", () => {
    populateMakes();
    document.getElementById("makeSection").style.display = "block";
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    populateRepairs();
    document.getElementById("repairSection").style.display = "block";
  });

  document.getElementById("addItem").addEventListener("click", () => {
    const asset = document.getElementById("assetSelect").value;
    const make = document.getElementById("makeSelect").value;
    const repair = document.getElementById("repairSelect").value;
    if (!asset || !make || !repair) return;

    quoteItems.push({ asset, make, repair });
    renderQuote();

    document.getElementById("quoteSection").style.display = "block";
    document.getElementById("downloadPDF").style.display = "block";

    resetRepairFields();
  });

  document.getElementById("supplyOnly").addEventListener("change", renderQuote);
  document.getElementById("vatExempt").addEventListener("change", renderQuote);

  document.getElementById("downloadPDF").addEventListener("click", generatePDF);
});

function populateAssets() {
  const assets = Object.keys(data);
  const select = document.getElementById("assetSelect");

  assetChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Asset</option>${assets.map(a => `<option value="${a}">${a}</option>`).join("")}`;
  assetChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const makes = data[asset] ? Object.keys(data[asset]) : [];
  const select = document.getElementById("makeSelect");

  makeChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Make/Model</option>${makes.map(m => `<option value="${m}">${m}</option>`).join("")}`;
  makeChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repairs = data[asset]?.[make] ? Object.keys(data[asset][make]) : [];
  const select = document.getElementById("repairSelect");

  repairChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Repair</option>${repairs.map(r => `<option value="${r}">${r}</option>`).join("")}`;
  repairChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function resetRepairFields() {
  assetChoices.destroy();
  makeChoices.destroy();
  repairChoices.destroy();

  document.getElementById("assetSelect").innerHTML = "";
  document.getElementById("makeSelect").innerHTML = "";
  document.getElementById("repairSelect").innerHTML = "";

  assetChoices = new Choices("#assetSelect", { searchEnabled: true, shouldSort: false });
  makeChoices = new Choices("#makeSelect", { searchEnabled: true, shouldSort: false });
  repairChoices = new Choices("#repairSelect", { searchEnabled: true, shouldSort: false });

  populateAssets();

  document.getElementById("makeSection").style.display = "none";
  document.getElementById("repairSection").style.display = "none";
}

function renderQuote() {
  const quoteLines = document.getElementById("quoteLines");
  const estimate = document.getElementById("estimate");
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  quoteLines.innerHTML = "";
  let subtotal = 0;

  quoteItems.forEach((item, i) => {
    const info = data[item.asset][item.make][item.repair];
    const labour = supplyOnly ? 0 : info.labour_hours * 45;
    const carriage = supplyOnly ? 15.95 : 0;
    const lineTotal = labour + info.material_cost + carriage;
    subtotal += lineTotal;

    quoteLines.innerHTML += `
      <div class="quote-line">
        <p><strong>${item.asset} → ${item.make} → ${item.repair}</strong></p>
        <p>Part #: ${info.part_number}</p>
        <p>Labour: ${supplyOnly ? "N/A" : `£${labour.toFixed(2)}`}</p>
        <p>Materials: £${info.material_cost.toFixed(2)}</p>
        ${supplyOnly ? `<p>Carriage: £${carriage.toFixed(2)}</p>` : ""}
        <p><strong>Total: £${lineTotal.toFixed(2)}</strong></p>
        <button onclick="removeItem(${i})">Remove</button>
      </div>
    `;
  });

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const total = subtotal + vat;

  estimate.innerHTML = `
    <h3>Quote Summary</h3>
    <p><strong>Items:</strong> ${quoteItems.length}</p>
    <p><strong>Subtotal:</strong> £${subtotal.toFixed(2)}</p>
    <p><strong>VAT (${vatExempt ? "Exempt" : "20%"}):</strong> £${vat.toFixed(2)}</p>
    <p><strong>Total:</strong> £${total.toFixed(2)}</p>
  `;
}

function removeItem(index) {
  quoteItems.splice(index, 1);
  renderQuote();
  if (quoteItems.length === 0) {
    document.getElementById("quoteSection").style.display = "none";
    document.getElementById("downloadPDF").style.display = "none";
  }
}

function generatePDF() {
  const doc = new jspdf.jsPDF();
  const date = new Date().toLocaleDateString("en-GB");
  const customer = document.getElementById("customerName").value || "[Customer]";
  const quoteNo = document.getElementById("quoteNumber").value || "[Quote #]";
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  let subtotal = 0;
  const tableRows = quoteItems.map(item => {
    const info = data[item.asset][item.make][item.repair];
    const labour = supplyOnly ? 0 : info.labour_hours * 45;
    const carriage = supplyOnly ? 15.95 : 0;
    const total = labour + info.material_cost + carriage;
    subtotal += total;

    return [
      item.asset,
      item.make,
      item.repair,
      info.part_number,
      supplyOnly ? "N/A" : `£${labour.toFixed(2)}`,
      `£${info.material_cost.toFixed(2)}`,
      supplyOnly ? `£${carriage.toFixed(2)}` : "-",
      `£${total.toFixed(2)}`
    ];
  });

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const grandTotal = subtotal + vat;

  doc.setFontSize(14);
  doc.text("Estimated Quote", 14, 18);
  doc.setFontSize(10);
  doc.text(`Client: ${customer}`, 14, 26);
  doc.text(`Job No: ${quoteNo}`, 14, 31);
  doc.text(`Date: ${date}`, 14, 36);

  doc.autoTable({
    startY: 42,
    head: [["Asset", "Make", "Repair", "Part #", "Labour", "Materials", "Carriage", "Line Total"]],
    body: tableRows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [39, 72, 143] }
  });

  doc.text(`Subtotal: £${subtotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
  doc.text(`VAT (${vatExempt ? "Exempt" : "20%"}): £${vat.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 15);
  doc.text(`Total: £${grandTotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);

  doc.save("NHM_Quote.pdf");
}
