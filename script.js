const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": { labour_hours: 0.5, material_cost: 85.0, part_number: "OXBATT180" },
      "Handset Replacement":  { labour_hours: 0.75, material_cost: 65.0, part_number: "OXHAND180" }
    }
  }
};

let quoteItems = [];
let assetChoices, makeChoices, repairChoices;
let assetSelect, makeSelect, repairSelect;
let supplyOnly, vatExempt, quoteNumber, customerName;
let pdfTableBody, pdfSubtotal, pdfVAT, pdfTotal, pdfQuoteNumber, pdfCustomerName;

document.addEventListener("DOMContentLoaded", () => {
  // Refs
  assetSelect     = document.getElementById("assetSelect");
  makeSelect      = document.getElementById("makeSelect");
  repairSelect    = document.getElementById("repairSelect");
  supplyOnly      = document.getElementById("supplyOnly");
  vatExempt       = document.getElementById("vatExempt");
  quoteNumber     = document.getElementById("quoteNumber");
  customerName    = document.getElementById("customerName");
  pdfTableBody    = document.getElementById("pdfTableBody");
  pdfSubtotal     = document.getElementById("pdfSubtotal");
  pdfVAT          = document.getElementById("pdfVAT");
  pdfTotal        = document.getElementById("pdfTotal");
  pdfQuoteNumber  = document.getElementById("pdfQuoteNumber");
  pdfCustomerName = document.getElementById("pdfCustomerName");

  // Placeholder for customer
  const names = ["Terry Clarke","Jayden Davis","Ken McIntyre","Phill Darkin","Matthew Pons","Ashley Henry","Kelly Hart","Andrea Oswald","Jamie Baker","Elliot Bowler-Lee","Steve Cottee","Elena McColl","Paul McMullan","Steven Webb"];
  customerName.placeholder = `e.g. ${names[Math.floor(Math.random()*names.length)]}`;

  // Init Choices.js
  assetChoices  = new Choices(assetSelect,  { searchEnabled: true, shouldSort: false });
  makeChoices   = new Choices(makeSelect,   { searchEnabled: true, shouldSort: false });
  repairChoices = new Choices(repairSelect, { searchEnabled: true, shouldSort: false });

  populateAssets();

  // Cascading selects
  assetSelect.addEventListener("change", () => {
    populateMakes();
    document.getElementById("makeSection").hidden = false;
  });
  makeSelect.addEventListener("change", () => {
    populateRepairs();
    document.getElementById("repairSection").hidden = false;
  });
  repairSelect.addEventListener("change", () => {
    document.getElementById("optionsSection").hidden = false;
  });

  // Live recalc
  supplyOnly.addEventListener("change", renderQuote);
  vatExempt.addEventListener("change", renderQuote);

  // Add item
  document.getElementById("addItem").addEventListener("click", () => {
    if (!assetSelect.value || !makeSelect.value || !repairSelect.value) return;
    quoteItems.push({
      asset:  assetSelect.value,
      make:   makeSelect.value,
      repair: repairSelect.value
    });
    resetForm();
    renderQuote();
  });

  // Download PDF
  document.getElementById("downloadPDF").addEventListener("click", () => {
    html2pdf()
      .from(document.getElementById("pdfContent"))
      .set({
        margin: 10,
        filename: `Quote_${quoteNumber.value || 'NoNumber'}.pdf`
      })
      .save();
  });
});

function populateAssets() {
  const opts = Object.keys(data);
  assetChoices.destroy();
  assetSelect.innerHTML = `<option value="" disabled selected>Select Asset</option>` +
    opts.map(a => `<option value="${a}">${a}</option>`).join("");
  assetChoices = new Choices(assetSelect, { searchEnabled: true, shouldSort: false });
}

function populateMakes() {
  const makes = data[assetSelect.value] ? Object.keys(data[assetSelect.value]) : [];
  makeChoices.destroy();
  makeSelect.innerHTML = `<option value="" disabled selected>Select Make/Model</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join("");
  makeChoices = new Choices(makeSelect, { searchEnabled: true, shouldSort: false });
}

function populateRepairs() {
  const repairs = data[assetSelect.value]?.[makeSelect.value]
    ? Object.keys(data[assetSelect.value][makeSelect.value])
    : [];
  repairChoices.destroy();
  repairSelect.innerHTML = `<option value="" disabled selected>Select Repair</option>` +
    repairs.map(r => `<option value="${r}">${r}</option>`).join("");
  repairChoices = new Choices(repairSelect, { searchEnabled: true, shouldSort: false });
}

function resetForm() {
  populateAssets();
  document.getElementById("makeSection").hidden    = true;
  document.getElementById("repairSection").hidden  = true;
  document.getElementById("optionsSection").hidden = true;
  supplyOnly.checked = vatExempt.checked = false;
}

function renderQuote() {
  pdfTableBody.innerHTML = "";
  let subtotal = 0;

  quoteItems.forEach(item => {
    const info = data[item.asset][item.make][item.repair];
    const labour  = supplyOnly.checked ? 0 : info.labour_hours * 45;
    const carriage= supplyOnly.checked ? 15.95 : 0;
    const lineTotal = labour + info.material_cost + carriage;
    subtotal += lineTotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.asset} → ${item.make} → ${item.repair}</td>
      <td>${info.part_number}</td>
      <td>£${labour.toFixed(2)}</td>
      <td>£${info.material_cost.toFixed(2)}</td>
      <td>£${carriage.toFixed(2)}</td>
      <td>£${lineTotal.toFixed(2)}</td>
    `;
    pdfTableBody.appendChild(tr);
  });

  const vat   = vatExempt.checked ? 0 : subtotal * 0.2;
  const total = subtotal + vat;

  pdfSubtotal.textContent      = `£${subtotal.toFixed(2)}`;
  pdfVAT.textContent           = `£${vat.toFixed(2)}`;
  pdfTotal.textContent         = `£${total.toFixed(2)}`;
  pdfQuoteNumber.textContent   = quoteNumber.value || "(No #)";
  pdfCustomerName.textContent  = customerName.value || "(No name)";
}
