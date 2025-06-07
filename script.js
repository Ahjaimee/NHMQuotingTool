const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": { labour_hours: 0.5, material_cost: 85.0, part_number: "OXBATT180" },
      "Handset Replacement": { labour_hours: 0.75, material_cost: 65.0, part_number: "OXHAND180" }
    }
  }
};

let quoteItems = [];

document.addEventListener("DOMContentLoaded", () => {
  const names = [
    "Terry Clarke", "Jayden Davis", "Ken McIntyre", "Phill Darkin",
    "Matthew Pons", "Ashley Henry", "Kelly Hart", "Andrea Oswald",
    "Jamie Baker", "Elliot Bowler-Lee", "Steve Cottee", "Elena McColl",
    "Paul McMullan", "Steven Webb"
  ];
  const randomName = names[Math.floor(Math.random() * names.length)];
  document.getElementById("customerName").placeholder = `e.g. ${randomName}`;

  populateAssets();

  const assetChoice = new Choices("#assetSelect", { searchEnabled: true, shouldSort: false });
  const makeChoice = new Choices("#makeSelect", { searchEnabled: true, shouldSort: false });
  const repairChoice = new Choices("#repairSelect", { searchEnabled: true, shouldSort: false });

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
    const asset = document.querySelector("#assetSelect").value;
    const make = document.querySelector("#makeSelect").value;
    const repair = document.querySelector("#repairSelect").value;

    if (!asset || !make || !repair) return;

    quoteItems.push({ asset, make, repair });
    showEstimate();
  });

  document.getElementById("supplyOnly").addEventListener("change", showEstimate);
  document.getElementById("vatExempt").addEventListener("change", showEstimate);
});

function populateAssets() {
  const assetSelect = document.getElementById("assetSelect");
  assetSelect.innerHTML = `<option value="">Select an asset</option>`;
  Object.keys(data).forEach(asset => {
    const opt = document.createElement("option");
    opt.value = asset;
    opt.textContent = asset;
    assetSelect.appendChild(opt);
  });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const makeSelect = document.getElementById("makeSelect");
  makeSelect.innerHTML = `<option value="">Select a make/model</option>`;
  if (data[asset]) {
    Object.keys(data[asset]).forEach(make => {
      const opt = document.createElement("option");
      opt.value = make;
      opt.textContent = make;
      makeSelect.appendChild(opt);
    });
  }
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repairSelect = document.getElementById("repairSelect");
  repairSelect.innerHTML = `<option value="">Select a repair</option>`;
  if (data[asset] && data[asset][make]) {
    Object.keys(data[asset][make]).forEach(repair => {
      const opt = document.createElement("option");
      opt.value = repair;
      opt.textContent = repair;
      repairSelect.appendChild(opt);
    });
  }
}

function removeItem(index) {
  quoteItems.splice(index, 1);
  showEstimate();
}

function showEstimate() {
  const quoteLines = document.getElementById("quoteLines");
  const estimateDiv = document.getElementById("estimate");
  const customerName = document.getElementById("customerName").value || "N/A";
  const quoteNumber = document.getElementById("quoteNumber").value || "N/A";
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  quoteLines.innerHTML = "";
  let subtotal = 0;

  quoteItems.forEach((item, i) => {
    const info = data[item.asset][item.make][item.repair];
    const labourCost = supplyOnly ? 0 : info.labour_hours * 45;
    const carriageCost = supplyOnly ? 15.95 : 0;
    const itemTotal = labourCost + info.material_cost + carriageCost;
    subtotal += itemTotal;

    quoteLines.innerHTML += `
      <div class="quote-line">
        <p><strong>${item.asset} → ${item.make} → ${item.repair}</strong></p>
        <p>Part #: ${info.part_number}</p>
        <p>Labour: ${supplyOnly ? "N/A" : `£${labourCost.toFixed(2)}`}</p>
        <p>Materials: £${info.material_cost.toFixed(2)}</p>
        ${supplyOnly ? `<p>Carriage: £${carriageCost.toFixed(2)}</p>` : ""}
        <button onclick="removeItem(${i})">Remove</button>
      </div>
    `;
  });

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const total = subtotal + vat;

  estimateDiv.innerHTML = `
    <h3>Quote Summary</h3>
    <p><strong>Customer:</strong> ${customerName}</p>
    <p><strong>Quote #:</strong> ${quoteNumber}</p>
    <p><strong>Items:</strong> ${quoteItems.length}</p>
    <hr>
    <p><strong>Subtotal (excl. VAT):</strong> £${subtotal.toFixed(2)}</p>
    <p><strong>VAT (${vatExempt ? "Exempt" : "20%"}):</strong> £${vat.toFixed(2)}</p>
    <p><strong>Total (incl. VAT): £${total.toFixed(2)}</strong></p>
  `;
}



