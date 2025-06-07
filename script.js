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

    resetRepairFields();
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

function resetRepairFields() {
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
}

function removeItem(index) {
  quoteItems.splice(index, 1);
  renderQuote();
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logo = await fetch("nhm-logo.png").then(r => r.blob()).then(blob => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  });

  doc.addImage(logo, 'PNG', 15, 10, 40, 15);
  doc.setFontSize(18);
  doc.text("Quotation", 105, 20, { align: "center" });

  const date = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 15, 30);

  const rows = quoteItems.map(item => {
    const info = data[item.asset][item.make][item.repair];
    const labour = document.getElementById("supplyOnly").checked ? 0 : info.labour_hours * 45;
    const carriage = document.getElementById("supplyOnly").checked ? 15.95 : 0;
    const total = labour + info.material_cost + carriage;

    return [
      `${item.asset} - ${item.make}`,
      item.repair,
      info.part_number,
      labour.toFixed(2),
      info.material_cost.toFixed(2),
      carriage.toFixed(2),
      total.toFixed(2)
    ];
  });

  doc.autoTable({
    head: [["Asset", "Repair", "Part#", "Labour", "Materials", "Carriage", "Total"]],
    body: rows,
    startY: 40,
    styles: { fontSize: 10 }
  });

  doc.save("NHM_Quote.pdf");
}
