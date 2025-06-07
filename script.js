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

let assetChoices, makeChoices, repairChoices;

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

  // Populate and initialize the first dropdown
  populateAssets();

  document.getElementById("assetSelect").addEventListener("change", () => {
    populateMakes();
    document.getElementById("makeSection").style.display = "block";
    document.getElementById("repairSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "none";
    document.getElementById("estimate").innerHTML = "";
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    populateRepairs();
    document.getElementById("repairSection").style.display = "block";
    document.getElementById("optionsSection").style.display = "none";
    document.getElementById("estimate").innerHTML = "";
  });

  document.getElementById("repairSelect").addEventListener("change", () => {
    showEstimate();
    document.getElementById("optionsSection").style.display = "block";
  });

  document.getElementById("supplyOnly").addEventListener("change", showEstimate);
  document.getElementById("vatExempt").addEventListener("change", showEstimate);
});

function populateAssets() {
  const el = document.getElementById("assetSelect");
  el.innerHTML = "";
  Object.keys(data).forEach(asset => {
    const opt = document.createElement("option");
    opt.value = asset;
    opt.textContent = asset;
    el.appendChild(opt);
  });

  // Destroy existing Choices instance if any
  if (assetChoices) assetChoices.destroy();
  assetChoices = new Choices(el, { searchEnabled: true });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const el = document.getElementById("makeSelect");
  el.innerHTML = "";

  if (data[asset]) {
    Object.keys(data[asset]).forEach(make => {
      const opt = document.createElement("option");
      opt.value = make;
      opt.textContent = make;
      el.appendChild(opt);
    });
  }

  if (makeChoices) makeChoices.destroy();
  makeChoices = new Choices(el, { searchEnabled: true });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const el = document.getElementById("repairSelect");
  el.innerHTML = "";

  if (data[asset] && data[asset][make]) {
    Object.keys(data[asset][make]).forEach(repair => {
      const opt = document.createElement("option");
      opt.value = repair;
      opt.textContent = repair;
      el.appendChild(opt);
    });
  }

  if (repairChoices) repairChoices.destroy();
  repairChoices = new Choices(el, { searchEnabled: true });
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






