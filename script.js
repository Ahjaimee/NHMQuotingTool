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
const choices = {};

document.addEventListener("DOMContentLoaded", () => {
  [
    "assetSelect","makeSelect","repairSelect",
    "supplyOnly","vatExempt","customerName",
    "quoteNumber","quoteSection","pdfQuoteNumber",
    "pdfCustomerName","pdfTableBody","pdfSubtotal",
    "pdfVAT","pdfTotal","addItem","downloadPDF","pdfContent"
  ].forEach(id => refs[id] = document.getElementById(id));

  const names = ["Terry Clarke","Jayden Davis","Ken McIntyre","Phill Darkin","Matthew Pons","Ashley Henry","Kelly Hart","Andrea Oswald","Jamie Baker","Elliot Bowler-Lee","Steve Cottee","Elena McColl","Paul McMullan","Steven Webb"];
  refs.customerName.placeholder = `e.g. ${names[Math.floor(Math.random()*names.length)]}`;

  choices.asset  = new Choices(refs.assetSelect,  { searchEnabled:true,shouldSort:false });
  choices.make   = new Choices(refs.makeSelect,   { searchEnabled:true,shouldSort:false });
  choices.repair = new Choices(refs.repairSelect,{ searchEnabled:true,shouldSort:false });

  populateAssets();
  refs.quoteSection.hidden = false;

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

  refs.supplyOnly.addEventListener("change", renderQuote);
  refs.vatExempt.addEventListener("change", renderQuote);

  refs.addItem.addEventListener("click", () => {
    if (!refs.assetSelect.value || !refs.makeSelect.value || !refs.repairSelect.value) return;

    quoteItems.push({
      asset:  refs.assetSelect.value,
      make:   refs.makeSelect.value,
      repair: refs.repairSelect.value
    });

    resetForm();
    renderQuote();
  });

  refs.downloadPDF.addEventListener("click", () => {
    refs.pdfContent.style.visibility = "visible";
    refs.pdfContent.style.position = "static";

    html2pdf()
      .from(refs.pdfContent)
      .set({ margin:10, filename:`Quote_${refs.quoteNumber.value||'No#'}.pdf` })
      .save()
      .then(() => {
        refs.pdfContent.style.visibility = "hidden";
        refs.pdfContent.style.position = "absolute";
        refs.pdfContent.style.left = "-9999px";
      });
  });
});

function populateAssets() {
  const assets = Object.keys(data);
  choices.asset.destroy();
  refs.assetSelect.innerHTML = `<option value="" disabled selected>Select Asset</option>` +
    assets.map(a => `<option value="${a}">${a}</option>`).join("");
  choices.asset = new Choices(refs.assetSelect, { searchEnabled: true, shouldSort: false });
}

function populateMakes() {
  const asset = refs.assetSelect.value;
  const makes = data[asset] ? Object.keys(data[asset]) : [];
  choices.make.destroy();
  refs.makeSelect.innerHTML = `<option value="" disabled selected>Select Make/Model</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join("");
  choices.make = new Choices(refs.makeSelect, { searchEnabled: true, shouldSort: false });
}

function populateRepairs() {
  const asset = refs.assetSelect.value;
  const make = refs.makeSelect.value;
  const repairs = data[asset]?.[make] ? Object.keys(data[asset][make]) : [];
  choices.repair.destroy();
  refs.repairSelect.innerHTML = `<option value="" disabled selected>Select Repair</option>` +
    repairs.map(r => `<option value="${r}">${r}</option>`).join("");
  choices.repair = new Choices(refs.repairSelect, { searchEnabled: true, shouldSort: false });
}

function resetForm() {
  populateAssets();
  choices.make.setChoiceByValue("");
  choices.repair.setChoiceByValue("");

  document.getElementById("makeSection").hidden = true;
  document.getElementById("repairSection").hidden = true;
}

function renderQuote() {
  refs.pdfTableBody.innerHTML = "";
  let subtotal = 0;

  quoteItems.forEach(item => {
    const info = data[item.asset][item.make][item.repair];
    const labour   = refs.supplyOnly.checked ? 0 : info.labour_hours * 45;
    const carriage = refs.supplyOnly.checked ? 15.95 : 0;
    const line     = labour + info.material_cost + carriage;
    subtotal += line;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.asset} → ${item.make} → ${item.repair}</td>
      <td>${info.part_number}</td>
      <td>£${labour.toFixed(2)}</td>
      <td>£${info.material_cost.toFixed(2)}</td>
