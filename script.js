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

function populateAssets() {
  const assets = Object.keys(data);
  const select = document.getElementById("assetSelect");
  assetChoices?.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Asset</option>${assets.map(a => `<option value="${a}">${a}</option>`).join("")}`;
  assetChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const makes = data[asset] ? Object.keys(data[asset]) : [];
  const select = document.getElementById("makeSelect");
  makeChoices?.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Make/Model</option>${makes.map(m => `<option value="${m}">${m}</option>`).join("")}`;
  makeChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repairs = data[asset]?.[make] ? Object.keys(data[asset][make]) : [];
  const select = document.getElementById("repairSelect");
  repairChoices?.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Repair</option>${repairs.map(r => `<option value="${r}">${r}</option>`).join("")}`;
  repairChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function resetRepairFields() {
  document.getElementById("makeSection").style.display = "none";
  document.getElementById("repairSection").style.display = "none";
  populateAssets();
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
    document.getElementById("downloadPDF").style.display = "none";
  }
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const logo = new Image();
  logo.src = "nhm-logo.png";

  logo.onload = () => {
    doc.addImage(logo, "PNG", 10, 10, 40, 20);
    doc.setFontSize(18);
    doc.text("Quotation Estimate", 60, 20);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 60, 28);

    let y = 40;
    quoteItems.forEach((item, i) => {
      const info = data[item.asset][item.make][item.repair];
      const labour = document.getElementById("supplyOnly").checked ? 0 : info.labour_hours * 45;
      const carriage = document.getElementById("supplyOnly").checked ? 15.95 : 0;
      const lineTotal = labour + info.material_cost + carriage;

      doc.text(`Item ${i + 1}: ${item.asset} → ${item.make} → ${item.repair}`, 10, y);
      doc.text(`Part #: ${info.part_number}`, 12, y + 6);
      doc.text(`Materials: £${info.material_cost.toFixed(2)}`, 12, y + 12);
      if (!document.getElementById("supplyOnly").checked)
        doc.text(`Labour: £${labour.toFixed(2)}`, 12, y + 18);
      if (document.getElementById("supplyOnly").checked)
        doc.text(`Carriage: £${carriage.toFixed(2)}`, 12, y + 18);
      doc.text(`Line Total: £${lineTotal.toFixed(2)}`, 12, y + 24);
      y += 36;
    });

    const estimateBox = document.getElementById("estimate").innerText.split("\n");
    estimateBox.forEach((line, idx) => {
      doc.text(line, 10, y + (idx * 8));
    });

    doc.save("NHM_Quote.pdf");
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const names = ["Terry Clarke","Jayden Davis","Ken McIntyre","Phill Darkin","Matthew Pons","Ashley Henry","Kelly Hart","Andrea Oswald","Jamie Baker","Elliot Bowler-Lee","Steve Cottee","Elena McColl","Paul McMullan","Steven Webb"];
  document.getElementById("customerName").placeholder = `e.g. ${names[Math.floor(Math.random()*names.length)]}`;

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

  document.getElementById("repairSelect").addEventListener("change", () => {
    document.getElementById("optionsSection").style.display = "block";
  });

  document.getElementById("addItem").addEventListener("click", () => {
    const asset = document.getElementById("assetSelect").value;
    const make = document.getElementById("makeSelect").value;
    const repair = document.getElementById("repairSelect").value;

    if (!asset || !make || !repair) {
      alert("Please select all fields.");
      return;
    }

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
