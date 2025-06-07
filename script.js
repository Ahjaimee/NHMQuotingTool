document.addEventListener("DOMContentLoaded", () => {
  const names = [
    "Terry Clarke", "Jayden Davis", "Ken McIntyre", "Phill Darkin",
    "Matthew Pons", "Ashley Henry", "Kelly Hart", "Andrea Oswald",
    "Jamie Baker", "Elliot Bowler-Lee", "Steve Cottee", "Elena McColl",
    "Paul McMullan", "Steven Webb"
  ];
  const randomName = names[Math.floor(Math.random() * names.length)];
  document.getElementById("customerName").placeholder = `e.g. ${randomName}`;
  document.getElementById("quoteNumber").placeholder = "e.g. Q12345";

  document.getElementById("assetSelect").addEventListener("change", populateMakes);
  document.getElementById("makeSelect").addEventListener("change", populateRepairs);
  document.getElementById("repairSelect").addEventListener("change", showEstimate);
  document.getElementById("supplyOnly").addEventListener("change", showEstimate);
  document.getElementById("vatExempt").addEventListener("change", showEstimate);

  populateAssets();
});

const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": {
        labour_hours: 0.5,
        material_cost: 85.0,
        part_number: "OXBATT180"
      },
      "Handset Replacement": {
        labour_hours: 0.75,
        material_cost: 65.0,
        part_number: "OXHAND180"
      }
    }
  }
};

function populateAssets() {
  const assetSelect = new Choices("#assetSelect");
  const assetTypes = Object.keys(data);
  assetSelect.setChoices(assetTypes.map(type => ({ value: type, label: type })), 'value', 'label', true);
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const makeSelect = new Choices("#makeSelect", { removeItemButton: false });
  const makes = Object.keys(data[asset] || {});
  makeSelect.clearChoices();
  makeSelect.setChoices(makes.map(make => ({ value: make, label: make })), 'value', 'label', true);
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repairSelect = new Choices("#repairSelect", { removeItemButton: false });
  const repairs = Object.keys((data[asset] && data[asset][make]) || {});
  repairSelect.clearChoices();
  repairSelect.setChoices(repairs.map(repair => ({ value: repair, label: repair })), 'value', 'label', true);
}

function showEstimate() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repair = document.getElementById("repairSelect").value;
  const customerName = document.getElementById("customerName").value;
  const quoteNumber = document.getElementById("quoteNumber").value;
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;
  const estimateDiv = document.getElementById("estimate");

  if (!repair) {
    estimateDiv.innerHTML = "";
    return;
  }

  const info = data[asset][make][repair];
  const labourCost = supplyOnly ? 0 : info.labour_hours * 45;
  const carriageCost = supplyOnly ? 15.95 : 0;
  const subtotal = labourCost + info.material_cost + carriageCost;
  const vat = vatExempt ? 0 : subtotal * 0.2;
  const total = subtotal + vat;

  estimateDiv.innerHTML = `
    <h3>Quote Summary</h3>
    <p><strong>Customer:</strong> ${customerName || "N/A"}</p>
    <p><strong>Quote #:</strong> ${quoteNumber || "N/A"}</p>
    <p><strong>Asset:</strong> ${asset}</p>
    <p><strong>Make:</strong> ${make}</p>
    <p><strong>Repair:</strong> ${repair} (Part #${info.part_number})</p>
    <p>Labour: ${supplyOnly ? "N/A (Supply Only)" : `£${labourCost.toFixed(2)}`}</p>
    <p>Materials: £${info.material_cost.toFixed(2)}</p>
    ${supplyOnly ? `<p>Carriage: £${carriageCost.toFixed(2)}</p>` : ""}
    <hr>
    <p><strong>Subtotal (excl. VAT):</strong> £${subtotal.toFixed(2)}</p>
    <p><strong>VAT (${vatExempt ? "Exempt" : "20%"}):</strong> £${vat.toFixed(2)}</p>
    <p><strong>Total (incl. VAT): £${total.toFixed(2)}</strong></p>
  `;
}



