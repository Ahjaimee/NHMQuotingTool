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
  // Add placeholder names
  const names = ["Jamie Baker", "Andrea Oswald", "Ken McIntyre"];
  document.getElementById("customerName").placeholder = `e.g. ${names[Math.floor(Math.random() * names.length)]}`;
  document.getElementById("quoteNumber").placeholder = "e.g. Q12345";

  // Populate and initialize Choices
  const assetEl = document.getElementById("assetSelect");
  const makeEl = document.getElementById("makeSelect");
  const repairEl = document.getElementById("repairSelect");

  populate(assetEl, Object.keys(data));
  assetChoices = new Choices(assetEl, { searchEnabled: true });

  assetEl.addEventListener("change", () => {
    const selectedAsset = assetEl.value;
    const makes = Object.keys(data[selectedAsset] || {});
    populate(makeEl, makes);
    if (makeChoices) makeChoices.destroy();
    makeChoices = new Choices(makeEl, { searchEnabled: true });
    document.getElementById("makeSection").style.display = "block";
    document.getElementById("repairSection").style.display = "none";
  });

  makeEl.addEventListener("change", () => {
    const selectedAsset = assetEl.value;
    const selectedMake = makeEl.value;
    const repairs = Object.keys((data[selectedAsset] || {})[selectedMake] || {});
    populate(repairEl, repairs);
    if (repairChoices) repairChoices.destroy();
    repairChoices = new Choices(repairEl, { searchEnabled: true });
    document.getElementById("repairSection").style.display = "block";
  });

  repairEl.addEventListener("change", () => {
    document.getElementById("optionsSection").style.display = "block";
    showEstimate();
  });

  document.getElementById("supplyOnly").addEventListener("change", showEstimate);
  document.getElementById("vatExempt").addEventListener("change", showEstimate);
});

function populate(selectEl, items) {
  selectEl.innerHTML = "";
  items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    selectEl.appendChild(opt);
  });
}

function showEstimate() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repair = document.getElementById("repairSelect").value;
  const info = (((data[asset] || {})[make] || {})[repair]);

  if (!info) return;

  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;
  const labour = supplyOnly ? 0 : info.labour_hours * 45;
  const carriage = supplyOnly ? 15.95 : 0;
  const subtotal = labour + info.material_cost + carriage;
  const vat = vatExempt ? 0 : subtotal * 0.2;
  const total = subtotal + vat;

  document.getElementById("estimate").innerHTML = `
    <h3>Quote Summary</h3>
    <p>Repair: ${repair}</p>
    <p>Part #: ${info.part_number}</p>
    <p>Labour: £${labour.toFixed(2)}</p>
    <p>Materials: £${info.material_cost.toFixed(2)}</p>
    ${carriage ? `<p>Carriage: £${carriage.toFixed(2)}</p>` : ""}
    <p>Subtotal: £${subtotal.toFixed(2)}</p>
    <p>VAT: £${vat.toFixed(2)}</p>
    <p><strong>Total: £${total.toFixed(2)}</strong></p>
  `;
}
