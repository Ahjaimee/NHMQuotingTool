const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": { labour_hours: 0.5, material_cost: 85.0, part_number: "OXBATT180" },
      "Handset Replacement":  { labour_hours: 0.75, material_cost: 65.0, part_number: "OXHAND180" }
    }
  }
};

let quoteItems = [];
const refs = {};
let choices = {};

document.addEventListener("DOMContentLoaded", () => {
  // Cache elements
  [
    "assetSelect","makeSelect","repairSelect",
    "supplyOnly","vatExempt","customerName",
    "quoteNumber","quoteSection","pdfQuoteNumber",
    "pdfCustomerName","pdfTableBody","pdfSubtotal",
    "pdfVAT","pdfTotal","addItem","downloadPDF"
  ].forEach(id => refs[id] = document.getElementById(id));

  // Random placeholder
  const names = ["Terry Clarke","Jayden Davis","Ken McIntyre","Phill Darkin","Matthew Pons","Ashley Henry","Kelly Hart","Andrea Oswald","Jamie Baker","Elliot Bowler-Lee","Steve Cottee","Elena McColl","Paul McMullan","Steven Webb"];
  refs.customerName.placeholder = `e.g. ${names[Math.floor(Math.random()*names.length)]}`;

  // Init Choices.js
  choices.asset  = new Choices(refs.assetSelect,  { searchEnabled:true,shouldSort:false });
  choices.make   = new Choices(refs.makeSelect,   { searchEnabled:true,shouldSort:false });
  choices.repair = new Choices(refs.repairSelect,{ searchEnabled:true,shouldSort:false });

  populateAssets();
  refs.quoteSection.hidden = true;

  // Cascading selects
  refs.assetSelect.addEventListener("change", () => {
    populateMakes();
    document.getElementById("makeSection").hidden = false;
  });
  refs.makeSelect.addEventListener("change", () => {
    populateRepairs();
    document.getElementById("repairSection").hidden = false;
  });
  refs.repairSelect.addEventListener("change", () => {
    document.getElementById("optionsSection").hidden = false;
  });

  // Live recalc
  refs.supplyOnly.addEventListener("change", renderQuote);
  refs.vatExempt.addEventListener("change", renderQuote);

  // Add item
  refs.addItem.addEventListener("click", () => {
    const a = refs.assetSelect.value, m = refs.makeSelect.value, r = refs.repairSelect.value;
    if (!a||!m||!r) return;
    quoteItems.push({ asset: a, make: m, repair: r });
    refs.quoteSection.hidden = false;
    resetForm();
    renderQuote();
  });

  // Download PDF
  refs.downloadPDF.addEventListener("click", () => {
    html2pdf()
      .from(document.getElementById("pdfContent"))
      .set({ margin:10, filename:`Quote_${refs.quoteNumber.value||'No#'}.pdf` })
      .save();
  });
});

function populateAssets() {
  const opts = Object.keys(data);
  choices.asset.destroy();
  refs.assetSelect.innerHTML = `<option value="" disabled selected>Select Asset</option>`
    + opts.map(a=>`<option value="${a}">${a}</option>`).join("");
  choices.asset = new Choices(refs.assetSelect, { searchEnabled:true,shouldSort:false });
}

function populateMakes() {
  const arr = data[refs.assetSelect.value] ? Object.keys(data[refs.assetSelect.value]) : [];
  choices.make.destroy();
  refs.makeSelect.innerHTML = `<option value="" disabled selected>Select Make/Model</option>`
    + arr.map(m=>`<option value="${m}">${m}</option>`).join("");
  choices.make = new Choices(refs.makeSelect, { searchEnabled:true,shouldSort:false });
}

function populateRepairs() {
  const arr = data[refs.assetSelect.value]?.[refs.makeSelect.value]
    ? Object.keys(data[refs.assetSelect.value][refs.makeSelect.value]) : [];
  choices.repair.destroy();
  refs.repairSelect.innerHTML = `<option value="" disabled selected>Select Repair</option>`
    + arr.map(r=>`<option value="${r}">${r}</option>`).join("");
  choices.repair = new Choices(refs.repairSelect, { searchEnabled:true,shouldSort:false });
}

function resetForm() {
  populateAssets();
  document.getElementById("makeSection").hidden    = true;
  document.getElementById("repairSection").hidden  = true;
  document.getElementById("optionsSection").hidden = true;
  refs.supplyOnly.checked = refs.vatExempt.checked = false;
}

function renderQuote() {
  refs.pdfTableBody.innerHTML = "";
  let subtotal = 0;

  quoteItems.forEach(item => {
    const info = data[item.asset][item.make][item.repair];
    const labour  = refs.supplyOnly.checked ? 0 : info.labour_hours * 45;
    const carriage= refs.supplyOnly.checked ? 15.95 : 0;
    const line    = labour + info.material_cost + carriage;
    subtotal += line;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.asset} → ${item.make} → ${item.repair}</td>
      <td>${info.part_number}</td>
      <td>£${labour.toFixed(2)}</td>
      <td>£${info.material_cost.toFixed(2)}</td>
      <td>£${carriage.toFixed(2)}</td>
      <td>£${line.toFixed(2)}</td>
    `;
    refs.pdfTableBody.appendChild(tr);
  });

  const vatAmt = refs.vatExempt.checked ? 0 : subtotal * 0.2;
  const total  = subtotal + vatAmt;

  refs.pdfSubtotal.textContent     = `£${subtotal.toFixed(2)}`;
  refs.pdfVAT.textContent          = `£${vatAmt.toFixed(2)}`;
  refs.pdfTotal.textContent        = `£${total.toFixed(2)}`;
  refs.pdfQuoteNumber.textContent  = refs.quoteNumber.value || "(No #)";
  refs.pdfCustomerName.textContent = refs.customerName.value  || "(No name)";
}
