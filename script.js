const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": { labour_hours: 0.5, material_cost: 85.0, part_number: "OXBATT180" },
      "Handset Replacement": { labour_hours: 0.75, material_cost: 65.0, part_number: "OXHAND180" }
    }
  }
};

let quoteItems = [];

// Base carriage charge applied once per quote when "Supply Only" is selected
const CARRIAGE_CHARGE = 15.95;
let assetChoices, makeChoices, repairChoices;

document.addEventListener("DOMContentLoaded", () => {
  assetChoices = new Choices("#assetSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Asset',
    allowHTML: false
  });

  makeChoices = new Choices("#makeSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Make/Model',
    allowHTML: false
  });

  repairChoices = new Choices("#repairSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Repair',
    allowHTML: false
  });

  populateAssets();

  document.getElementById("assetSelect").addEventListener("change", () => {
    makeChoices.clearStore();
    repairChoices.clearStore();
    populateMakes();
    document.getElementById("makeSection").classList.remove("hidden");
    document.getElementById("repairSection").classList.add("hidden");
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    repairChoices.clearStore();
    populateRepairs();
    document.getElementById("repairSection").classList.remove("hidden");
  });

  document.getElementById("addItem").addEventListener("click", () => {
    const asset = document.getElementById("assetSelect").value;
    const make = document.getElementById("makeSelect").value;
    const repair = document.getElementById("repairSelect").value;

    if (!asset || asset === "Select Asset" || !make || make === "Select Make/Model" || !repair || repair === "Select Repair") return;

    quoteItems.push({ asset, make, repair });
    renderQuote();
    document.getElementById("quoteSection").classList.remove("hidden");
    document.getElementById("downloadPDF").classList.remove("hidden");
    resetRepairFields();
  });

  document.getElementById("supplyOnly").addEventListener("change", renderQuote);
  document.getElementById("vatExempt").addEventListener("change", renderQuote);
  document.getElementById("downloadPDF").addEventListener("click", generatePDF);
});

function populateAssets() {
  const select = document.getElementById("assetSelect");
  assetChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Asset</option>` +
    Object.keys(data).map(a => `<option value="${a}">${a}</option>`).join("");
  assetChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Asset',
    allowHTML: false
  });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const makes = Object.keys(data[asset] || {});
  const select = document.getElementById("makeSelect");
  makeChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Make/Model</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join("");
  makeChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Make/Model',
    allowHTML: false
  });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repairs = Object.keys(data[asset]?.[make] || {});
  const select = document.getElementById("repairSelect");
  repairChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Repair</option>` +
    repairs.map(r => `<option value="${r}">${r}</option>`).join("");
  repairChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Repair',
    allowHTML: false
  });
}

function resetRepairFields() {
  document.getElementById("makeSection").classList.add("hidden");
  document.getElementById("repairSection").classList.add("hidden");
  populateAssets();
  document.getElementById("makeSelect").innerHTML = "";
  document.getElementById("repairSelect").innerHTML = "";
  makeChoices.clearStore();
  repairChoices.clearStore();
}

function renderQuote() {
  const quoteLines = document.getElementById("quoteLines");
  const estimate = document.getElementById("estimate");
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  quoteLines.innerHTML = "";
  let subtotal = 0;
  // Apply carriage only once per quote when "Supply Only" is selected
  const carriageCharge = supplyOnly && quoteItems.length > 0 ? CARRIAGE_CHARGE : 0;

  quoteItems.forEach((item, index) => {
    const info = data[item.asset][item.make][item.repair];
    const labour = supplyOnly ? 0 : info.labour_hours * 45;
    const total = labour + info.material_cost;
    subtotal += total;

    quoteLines.innerHTML += `
      <div class="quote-line">
        <p><strong>${item.asset} → ${item.make} → ${item.repair}</strong></p>
        <p>Part #: ${info.part_number}</p>
        <p>Labour: ${supplyOnly ? 'N/A' : `£${labour.toFixed(2)}`}</p>
        <p>Materials: £${info.material_cost.toFixed(2)}</p>
        <p><strong>Total: £${total.toFixed(2)}</strong></p>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  if (carriageCharge > 0) {
    subtotal += carriageCharge;
    quoteLines.innerHTML += `
      <div class="quote-line">
        <p><strong>Carriage</strong></p>
        <p><strong>Total: £${carriageCharge.toFixed(2)}</strong></p>
      </div>
    `;
  }

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const grandTotal = subtotal + vat;

  estimate.innerHTML = `
    <h3>Quote Summary</h3>
    <p>Items: ${quoteItems.length}</p>
    <p>Subtotal: £${subtotal.toFixed(2)}</p>
    <p>VAT (${vatExempt ? "Exempt" : "20%"}): £${vat.toFixed(2)}</p>
    <p><strong>Total: £${grandTotal.toFixed(2)}</strong></p>
  `;
}

function removeItem(index) {
  quoteItems.splice(index, 1);
  renderQuote();
  if (quoteItems.length === 0) {
    document.getElementById("downloadPDF").classList.add("hidden");
    document.getElementById("quoteSection").classList.add("hidden");
  }
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logo = await fetch("nhm-logo.png").then(r => r.blob()).then(blob => new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  }));

  const imgProps = doc.getImageProperties(logo);
  const logoWidth = 40;
  const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
  doc.addImage(logo, "PNG", 15, 10, logoWidth, logoHeight);
  doc.setFontSize(16);
  doc.text("Quoted Repair Estimator", 105, 20, { align: "center" });

  const name = document.getElementById("customerName").value || "(No name)";
  const number = document.getElementById("quoteNumber").value || "(No #)";
  doc.setFontSize(10);
  doc.text(`Quote #: ${number}`, 15, 32);
  doc.text(`Customer: ${name}`, 15, 38);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 44);

  const rows = quoteItems.map(item => {
    const info = data[item.asset][item.make][item.repair];
    const supplyOnly = document.getElementById("supplyOnly").checked;
    const labour = supplyOnly ? 0 : info.labour_hours * 45;
    const total = labour + info.material_cost;
    return [
      `${item.asset} - ${item.make}`,
      item.repair,
      info.part_number,
      `£${labour.toFixed(2)}`,
      `£${info.material_cost.toFixed(2)}`,
      `£${total.toFixed(2)}`
    ];
  });

  const carriageCharge = document.getElementById("supplyOnly").checked && rows.length > 0 ? CARRIAGE_CHARGE : 0;
  if (carriageCharge > 0) {
    rows.push(["Carriage", "", "", "", "", `£${carriageCharge.toFixed(2)}`]);
  }

  doc.autoTable({
    startY: 50,
    head: [["Asset", "Repair", "Part#", "Labour", "Materials", "Total"]],
    body: rows
  });

  const subtotal = rows.reduce((sum, r) => sum + parseFloat(r[5].replace("£", "")), 0);
  const vat = document.getElementById("vatExempt").checked ? 0 : subtotal * 0.2;
  const total = subtotal + vat;
  const finalY = doc.lastAutoTable.finalY || 60;

  const pageWidth = doc.internal.pageSize.getWidth();
  const rightMargin = pageWidth - 15;
  doc.text(`Subtotal: £${subtotal.toFixed(2)}`, rightMargin, finalY + 10, { align: "right" });
  doc.text(`VAT: £${vat.toFixed(2)}`, rightMargin, finalY + 16, { align: "right" });
  doc.text(`Total: £${total.toFixed(2)}`, rightMargin, finalY + 22, { align: "right" });

  doc.text(`Supply Only: ${document.getElementById("supplyOnly").checked ? "Yes" : "No"}`, 105, finalY + 10);
  doc.text(`VAT Exempt: ${document.getElementById("vatExempt").checked ? "Yes" : "No"}`, 105, finalY + 16);

  doc.save("NHM_Quote.pdf");
}
