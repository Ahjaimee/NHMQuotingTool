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
let refs = {};

document.addEventListener("DOMContentLoaded", () => {
  // cache DOM refs
  refs = {
    asset:    document.getElementById("assetSelect"),
    make:     document.getElementById("makeSelect"),
    repair:   document.getElementById("repairSelect"),
    supply:   document.getElementById("supplyOnly"),
    vat:      document.getElementById("vatExempt"),
    cust:     document.getElementById("customerName"),
    quoteNo:  document.getElementById("quoteNumber"),
    quoteSec: document.getElementById("quoteSection"),
    pdfNum:   document.getElementById("pdfQuoteNumber"),
    pdfCust:  document.getElementById("pdfCustomerName"),
    tbody:    document.getElementById("pdfTableBody"),
    sub:      document.getElementById("pdfSubtotal"),
    vatOut:   document.getElementById("pdfVAT"),
    tot:      document.getElementById("pdfTotal"),
  };

  // placeholder
  const names = ["Terry Clarke","Jayden Davis","Ken McIntyre","Phill Darkin","Matthew Pons","Ashley Henry","Kelly Hart","Andrea Oswald","Jamie Baker","Elliot Bowler-Lee","Steve Cottee","Elena McColl","Paul McMullan","Steven Webb"];
  refs.cust.placeholder = `e.g. ${names[Math.floor(Math.random()*names.length)]}`;

  // init Choices.js
  assetChoices  = new Choices(refs.asset,  { searchEnabled: true, shouldSort: false });
  makeChoices   = new Choices(refs.make,   { searchEnabled: true, shouldSort: false });
  repairChoices = new Choices(refs.repair,{ searchEnabled: true, shouldSort: false });

  // first load
  populateAssets();

  // hide quote section until we add an item
  refs.quoteSec.hidden = true;

  // cascade
  refs.asset.addEventListener("change", () => { populateMakes();   refs.make.parentNode.hidden   = false; });
  refs.make .addEventListener("change", () => { populateRepairs(); refs.repair.parentNode.hidden = false; });
  refs.repair.addEventListener("change", () => { refs.supply.parentNode.parentNode.hidden = false; });

  // live update toggles
  refs.supply.addEventListener("change", renderQuote);
  refs.vat   .addEventListener("change", renderQuote);

  // add item
  document.getElementById("addItem").addEventListener("click", () => {
    if (!refs.asset.value || !refs.make.value || !refs.repair.value) return;
    quoteItems.push({
      asset:  refs.asset.value,
      make:   refs.make.value,
      repair: refs.repair.value
    });
    refs.quoteSec.hidden = false;
    resetForm();
    renderQuote();
  });

  // download
  document.getElementById("downloadPDF").addEventListener("click", () => {
    html2pdf()
      .from(document.getElementById("pdfContent"))
      .set({ margin:10, filename:`Quote_${refs.quoteNo.value||'No#'}.pdf` })
      .save();
  });
});

function populateAssets() {
  const opts = Object.keys(data);
  assetChoices.destroy();
  refs.asset.innerHTML = `<option value="" disabled selected>Select Asset</option>`
    + opts.map(a => `<option value="${a}">${a}</option>`).join("");
  assetChoices = new Choices(refs.asset, { searchEnabled: true, shouldSort: false });
}

function populateMakes() {
  const arr = data[refs.asset.value] ? Object.keys(data[refs.asset.value]) : [];
  makeChoices.destroy();
  refs.make.innerHTML = `<option value="" disabled selected>Select Make/Model</option>`
    + arr.map(m => `<option value="${m}">${m}</option>`).join("");
  makeChoices = new Choices(refs.make, { searchEnabled: true, shouldSort: false });
}

function populateRepairs() {
  const arr = data[refs.asset.value]?.[refs.make.value]
    ? Object.keys(data[refs.asset.value][refs.make.value])
    : [];
  repairChoices.destroy();
  refs.repair.innerHTML = `<option value="" disabled selected>Select Repair</option>`
    + arr.map(r => `<option value="${r}">${r}</option>`).join("");
  repairChoices = new Choices(refs.repair, { searchEnabled: true, shouldSort: false });
}

function resetForm() {
  populateAssets();
  document.getElementById("makeSection").hidden   = true;
  document.getElementById("repairSection").hidden = true;
  document.getElementById("optionsSection").hidden= true;
  refs.supply.checked = refs.vat.checked = false;
}

function renderQuote() {
  refs.tbody.innerHTML = "";
  let subtotal = 0;

  quoteItems.forEach(item => {
    const info = data[item.asset][item.make][item.repair];
    const labour  = refs.supply.checked ? 0 : info.labour_hours * 45;
    const carriage= refs.supply.checked ? 15.95 : 0;
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
    refs.tbody.appendChild(tr);
  });

  const vatAmt = refs.vat.checked ? 0 : subtotal * 0.2;
  const total  = subtotal + vatAmt;

  refs.sub.textContent   = `£${subtotal.toFixed(2)}`;
  refs.vatOut.textContent= `£${vatAmt.toFixed(2)}`;
  refs.tot.textContent   = `£${total.toFixed(2)}`;
  refs.pdfNum.textContent= refs.quoteNo.value || "(No #)";
  refs.pdfCust.textContent= refs.cust.value    || "(No name)";
}
