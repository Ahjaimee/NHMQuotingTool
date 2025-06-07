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

    if (!asset || !make || !repair) {
      alert("Select all repair details before adding.");
      return;
    }

    quoteItems.push({ asset, make, repair });

    renderQuote();
    document.getElementById("quoteSection").style.display = "block";
    document.getElementById("downloadPDF").style.display = "block";

    resetRepairFields(); // reset dropdowns only, not checkboxes
  });

  document.getElementById("supplyOnly").addEventListener("change", renderQuote);
  document.getElementById("vatExempt").addEventListener("change", renderQuote);

  document.getElementById("downloadPDF").addEventListener("click", () => {
    html2pdf().from(document.getElementById("quoteSection")).set({
      margin: 0.5,
      filename: 'NHM_Quote.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();
  });
});

function populateAssets() {
  const select = document.getElementById("assetSelect");
  assetChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Asset</option>` +
    Object.keys(data).map(asset => `<option value="${asset}">${asset}</option>`).join("");
  assetChoices = new Choices(select, { searchEnabled: true, shouldSort: false });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const makes = Object.keys(data[asset]);
  const select = document.getElementById("makeSelect");
  makeChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Make/Model</option>` +
    makes.map(make => `<option value="${make}">${make}</option>`).join("");
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
  const container = document.getElementById("quoteLines");
  const estimate = document.getElementById("estimate");
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  container.innerHTML = "";
  let subtotal = 0;

  quoteItems.forEach((item, i) => {
    const info = data[item.asset][item.make][item.repair];
    const labour = supplyOnly ? 0 : info.labour_hours * 45;
    const carriage = supplyOnly ? 15.95 : 0;
    const total = labour + info.material_cost + carriage;
    subtotal += total;

    container.innerHTML += `
      <div class="quote-line">
        <p><strong>${item.asset} → ${item.make} → ${item.repair}</strong></p>
        <p>Part #: ${info.part_number}</p>
        <p>Labour: ${supplyOnly ? "N/A" : `£${labour.toFixed(2)}`}</p>
        <p>Materials: £${info.material_cost.toFixed(2)}</p>
        ${supplyOnly ? `<p>Carriage: £${carriage.toFixed(2)}</p>` : ""}
        <p><strong>Line Total: £${total.toFixed(2)}</strong></p>
        <button onclick="removeItem(${i})">Remove</button>
      </div>`;
  });

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const grandTotal = subtotal + vat;

  estimate.innerHTML = `
    <h3>Quote Summary</h3>
    <p><strong>Items:</strong> ${quoteItems.length}</p>
    <p><strong>Subtotal:</strong> £${subtotal.toFixed(2)}</p>
    <p><strong>VAT (${vatExempt ? "Exempt" : "20%"}):</strong> £${vat.toFixed(2)}</p>
    <p><strong>Total:</strong> £${grandTotal.toFixed(2)}</p>
  `;
}

function removeItem(i) {
  quoteItems.splice(i, 1);
  renderQuote();
  if (quoteItems.length === 0) {
    document.getElementById("downloadPDF").style.display = "none";
  }
}
