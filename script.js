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
    document.getElementById("makeSection").hidden = false;
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    populateRepairs();
    document.getElementById("repairSection").hidden = false;
  });

  document.getElementById("repairSelect").addEventListener("change", () => {
    document.getElementById("optionsSection").hidden = false;
  });

  document.getElementById("addItem").addEventListener("click", () => {
    const asset = document.getElementById("assetSelect").value;
    const make = document.getElementById("makeSelect").value;
    const repair = document.getElementById("repairSelect").value;

    if (!asset || !make || !repair) return;

    quoteItems.push({ asset, make, repair });
    renderQuote();
    document.getElementById("quoteSection").hidden = false;

    populateAssets();
    makeChoices.clearStore();
    repairChoices.clearStore();

    document.getElementById("makeSection").hidden = true;
    document.getElementById("repairSection").hidden = true;
  });

  document.getElementById("supplyOnly").addEventListener("change", renderQuote);
  document.getElementById("vatExempt").addEventListener("change", renderQuote);

  document.getElementById("downloadPDF").addEventListener("click", () => {
    const content = document.getElementById("pdfContent");
    content.style.visibility = "visible";
    content.style.position = "static";

    html2pdf()
      .from(content)
      .save()
      .then(() => {
        content.style.visibility = "hidden";
        content.style.position = "absolute";
        content.style.left = "-9999px";
      });
  });
});

function populateAssets() {
  const select = document.getElementById("assetSelect");
  assetChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Asset</option>` +
    Object.keys(data).map(a => `<option value="${a}">${a}</option>`).join("");
  assetChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const makes = Object.keys(data[asset]);
  const select = document.getElementById("makeSelect");
  makeChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Make</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join("");
  makeChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repairs = Object.keys(data[asset][make]);
  const select = document.getElementById("repairSelect");
  repairChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Repair</option>` +
    repairs.map(r => `<option value="${r}">${r}</option>`).join("");
  repairChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function renderQuote() {
  const quoteLines = document.getElementById("quoteLines");
  const tableBody = document.getElementById("pdfTableBody");
  const subtotalEl = document.getElementById("pdfSubtotal");
  const vatEl = document.getElementById("pdfVAT");
  const totalEl = document.getElementById("pdfTotal");

  quoteLines.innerHTML = "";
  tableBody.innerHTML = "";

  let subtotal = 0;

  quoteItems.forEach(item => {
    const info = data[item.asset][item.make][item.repair];
    const labour = document.getElementById("supplyOnly").checked ? 0 : info.labour_hours * 45;
    const carriage = document.getElementById("supplyOnly").checked ? 15.95 : 0;
    const lineTotal = labour + info.material_cost + carriage;
    subtotal += lineTotal;

    quoteLines.innerHTML += `
      <div class="quote-line">
        <p><strong>${item.asset} → ${item.make} → ${item.repair}</strong></p>
        <p>Part #: ${info.part_number}</p>
        <p>Labour: ${labour ? `£${labour.toFixed(2)}` : "N/A"}</p>
        <p>Materials: £${info.material_cost.toFixed(2)}</p>
        ${carriage ? `<p>Carriage: £${carriage.toFixed(2)}</p>` : ""}
      </div>
    `;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.asset} → ${item.make} → ${item.repair}</td>
      <td>${info.part_number}</td>
      <td>£${labour.toFixed(2)}</td>
      <td>£${info.material_cost.toFixed(2)}</td>
      <td>£${carriage.toFixed(2)}</td>
      <td>£${lineTotal.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });

  const vat = document.getElementById("vatExempt").checked ? 0 : subtotal * 0.2;
  const total = subtotal + vat;

  document.getElementById("estimate").innerHTML = `
    <h3>Quote Summary</h3>
    <p><strong>Subtotal:</strong> £${subtotal.toFixed(2)}</p>
    <p><strong>VAT:</strong> £${vat.toFixed(2)}</p>
    <p><strong>Total:</strong> £${total.toFixed(2)}</p>
  `;

  subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
  vatEl.textContent = `£${vat.toFixed(2)}`;
  totalEl.textContent = `£${total.toFixed(2)}`;
}
