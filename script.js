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

let quoteItems = [];
let assetChoices, makeChoices, repairChoices;

document.addEventListener("DOMContentLoaded", () => {
  const names = [
    "Terry Clarke", "Jayden Davis", "Ken McIntyre", "Phill Darkin",
    "Matthew Pons", "Ashley Henry", "Kelly Hart", "Andrea Oswald",
    "Jamie Baker", "Elliot Bowler-Lee", "Steve Cottee", "Elena McColl",
    "Paul McMullan", "Steven Webb"
  ];

  document.getElementById("customerName").placeholder =
    `e.g. ${names[Math.floor(Math.random() * names.length)]}`;

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

    if (!asset || !make || !repair) return;

    quoteItems.push({ asset, make, repair });
    showEstimate();

    // Reset form
    populateAssets();
    makeChoices.clearChoices();
    repairChoices.clearChoices();

    document.getElementById("makeSection").style.display = "none";
    document.getElementById("repairSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "none";

    document.getElementById("supplyOnly").checked = false;
    document.getElementById("vatExempt").checked = false;
  });

  document.getElementById("supplyOnly").addEventListener("change", showEstimate);
  document.getElementById("vatExempt").addEventListener("change", showEstimate);
});

function populateAssets() {
  const assets = Object.keys(data);

  assetChoices.clearChoices();
  assetChoices.setChoices(
    [
      { value: '', label: 'Select Asset', selected: true, disabled: true },
      ...assets.map(a => ({ value: a, label: a }))
    ],
    'value',
    'label',
    false
  );

  assetChoices.setChoiceByValue('');
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const makes = data[asset] ? Object.keys(data[asset]) : [];

  makeChoices.clearChoices();
  makeChoices.setChoices(makes.map(m => ({ value: m, label: m })), 'value', 'label', true);
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repairs = data[asset]?.[make] ? Object.keys(data[asset][make]) : [];

  repairChoices.clearChoices();
  repairChoices.setChoices(repairs.map(r => ({ value: r, label: r })), 'value', 'label', true);
}

function removeItem(index) {
  quoteItems.splice(index, 1);
  showEstimate();
}

function showEstimate() {
  const quoteLines = document.getElementById("quoteLines");
  const estimateDiv = document.getElementById("estimate");
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  quoteLines.innerHTML = "";
  let subtotal = 0;

  quoteItems.forEach((item, i) => {
    const info = data[item.asset][item.make][item.repair];
    const labour = supplyOnly ? 0 : info.labour_hours * 45;
    const carriage = supplyOnly ? 15.95 : 0;
    const itemTotal = labour + info.material_cost + carriage;
    subtotal += itemTotal;

    quoteLines.innerHTML += `
      <div class="quote-line">
        <p><strong>${item.asset} → ${item.make} → ${item.repair}</strong></p>
        <p>Part #: ${info.part_number}</p>
        <p>Labour: ${supplyOnly ? "N/A" : `£${labour.toFixed(2)}`}</p>
        <p>Materials: £${info.material_cost.toFixed(2)}</p>
        ${supplyOnly ? `<p>Carriage: £${carriage.toFixed(2)}</p>` : ""}
        <button onclick="removeItem(${i})">Remove</button>
      </div>
    `;
  });

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const total = subtotal + vat;

  estimateDiv.innerHTML = `
    <h3>Quote Summary</h3>
    <p><strong>Items:</strong> ${quoteItems.length}</p>
    <p><strong>Subtotal (excl. VAT):</strong> £${subtotal.toFixed(2)}</p>
    <p><strong>VAT (${vatExempt ? "Exempt" : "20%"}):</strong> £${vat.toFixed(2)}</p>
    <p><strong>Total (incl. VAT):</strong> £${total.toFixed(2)}</p>
  `;
}
