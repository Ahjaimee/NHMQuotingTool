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

window.addEventListener("DOMContentLoaded", () => {
  assetChoices = new Choices("#assetSelect", { searchEnabled: true, shouldSort: false });
  makeChoices = new Choices("#makeSelect", { searchEnabled: true, shouldSort: false });
  repairChoices = new Choices("#repairSelect", { searchEnabled: true, shouldSort: false });

  populateAssets();

  document.getElementById("assetSelect").addEventListener("change", () => {
    populateMakes();
    document.getElementById("makeSection").classList.remove("hidden");
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    populateRepairs();
    document.getElementById("repairSection").classList.remove("hidden");
  });

  document.getElementById("addItem").addEventListener("click", () => {
    const asset = document.getElementById("assetSelect").value;
    const make = document.getElementById("makeSelect").value;
    const repair = document.getElementById("repairSelect").value;

    if (!asset || !make || !repair) return;

    quoteItems.push({ asset, make, repair });
    renderQuote();
    document.getElementById("quoteSection").classList.remove("hidden");
  });

  document.getElementById("supplyOnly").addEventListener("change", renderQuote);
  document.getElementById("vatExempt").addEventListener("change", renderQuote);
  document.getElementById("downloadPDF").addEventListener("click", generatePDF);
});

function populateAssets() {
  const select = document.getElementById("assetSelect");
  const assets = Object.keys(data);
  assetChoices.destroy();
  select.innerHTML = `<option disabled selected>Select Asset</option>` + assets.map(a => `<option value="${a}">${a}</option>`).join("");
  assetChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const select = document.getElementById("makeSelect");
  const makes = data[asset] ? Object.keys(data[asset]) : [];
  makeChoices.destroy();
  select.innerHTML = `<option disabled selected>Select Make/Model</option>` + makes.map(m => `<option value="${m}">${m}</option>`).join("");
  makeChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const select = document.getElementById("repairSelect");
  const repairs = data[asset]?.[make] ? Object.keys(data[asset][make]) : [];
  repairChoices.destroy();
  select.innerHTML = `<option disabled selected>Select Repair</option>` + repairs.map(r => `<option value="${r}">${r}</option>`).join("");
  repairChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function renderQuote() {
  const quoteLines = document.getElementById("quoteLines");
  const estimate = document.getElementById("estimate");
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  quoteLines.innerHTML = "";
  let subtotal = 0;

  quoteItems.forEach((item, index) => {
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
        <button onclick="removeItem(${index})">Remove</button>
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

  document.getElementById("downloadPDF").style.display = quoteItems.length > 0 ? "block" : "none";
}

function removeItem(index) {
  quoteItems.splice(index, 1);
  renderQuote();
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logo = await fetch("nhm-logo.png").then(res => res.blob()).then(blob => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  });

  doc.addImage(logo, 'PNG', 15, 10, 40, 15);
  doc.setFontSize(16);
  doc.text("Quotation", 105, 20, { align: 'center' });
  doc.setFontSize(10);

  const name = document.getElementById("customerName").value || "(No name)";
  const number = document.getElementById("quoteNumber").value || "(No #)";
  doc.text(`Quote #: ${number}`, 15, 30);
  doc.text(`Customer: ${name}`, 15, 36);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 42);

  const rows = quoteItems.map(item => {
    const info = data[item.asset][item.make][item.repair];
    const labour = document.getElementById("supplyOnly").checked ? 0 : info.labour_hours * 45;
    const carriage = document.getElementById("supplyOnly").checked ? 15.95 : 0;
    const total = labour + info.material_cost + carriage;

    return [
      `${item.asset} - ${item.make}`,
      item.repair,
      info.part_number,
      `£${labour.toFixed(2)}`,
      `£${info.material_cost.toFixed(2)}`,
      `£${carriage.toFixed(2)}`,
      `£${total.toFixed(2)}`
    ];
  });

  doc.autoTable({
    startY: 50,
    head: [["Asset", "Repair", "Part#", "Labour", "Materials", "Carriage", "Total"]],
    body: rows
  });

  const subtotal = rows.reduce((sum, r) => sum + parseFloat(r[6].replace("£", "")), 0);
  const vat = document.getElementById("vatExempt").checked ? 0 : subtotal * 0.2;
  const total = subtotal + vat;

  const finalY = doc.lastAutoTable.finalY || 70;
  doc.text(`Subtotal: £${subtotal.toFixed(2)}`, 15, finalY + 10);
  doc.text(`VAT (${document.getElementById("vatExempt").checked ? "Exempt" : "20%"}): £${vat.toFixed(2)}`, 15, finalY + 16);
  doc.text(`Total: £${total.toFixed(2)}`, 15, finalY + 22);

  doc.save("NHM_Quote.pdf");
}
