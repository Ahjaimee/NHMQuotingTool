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

  const assetSelect = document.getElementById("assetSelect");
  const makeSelect = document.getElementById("makeSelect");
  const repairSelect = document.getElementById("repairSelect");

  // Asset dropdown
  assetChoices = new Choices(assetSelect, {
    searchEnabled: true,
    shouldSort: false,
    placeholder: true,
    itemSelectText: "",
  });

  const assets = Object.keys(data).map(asset => ({
    value: asset,
    label: asset
  }));

  assetChoices.setChoices(assets, 'value', 'label', true);

  assetSelect.addEventListener("change", () => {
    const selectedAsset = assetSelect.value;
    const makes = Object.keys(data[selectedAsset]);

    if (makeChoices) makeChoices.destroy();
    makeChoices = new Choices(makeSelect, {
      searchEnabled: true,
      shouldSort: false,
      placeholder: true,
      itemSelectText: "",
    });

    makeChoices.setChoices(
      makes.map(make => ({ value: make, label: make })),
      'value', 'label', true
    );

    document.getElementById("makeSection").style.display = "block";
    document.getElementById("repairSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "none";
    document.getElementById("estimate").innerHTML = "";
  });

  makeSelect.addEventListener("change", () => {
    const selectedAsset = assetSelect.value;
    const selectedMake = makeSelect.value;
    const repairs = Object.keys(data[selectedAsset][selectedMake]);

    if (repairChoices) repairChoices.destroy();
    repairChoices = new Choices(repairSelect, {
      searchEnabled: true,
      shouldSort: false,
      placeholder: true,
      itemSelectText: "",
    });

    repairChoices.setChoices(
      repairs.map(repair => ({ value: repair, label: repair })),
      'value', 'label', true
    );

    document.getElementById("repairSection").style.display = "block";
    document.getElementById("optionsSection").style.display = "none";
    document.getElementById("estimate").innerHTML = "";
  });

  repairSelect.addEventListener("change", () => {
    document.getElementById("optionsSection").style.display = "block";
    showEstimate();
  });

  document.getElementById("supplyOnly").addEventListener("change", showEstimate);
  document.getElementById("vatExempt").addEventListener("change", showEstimate);
});

function showEstimate() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repair = document.getElementById("repairSelect").value;
  const customerName = document.getElementById("customerName").value;
  const quoteNumber = document.getElementById("quoteNumber").value;
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  if (!asset || !make || !repair) return;

  const info = data[asset][make][repair];
  const labour = supplyOnly ? 0 : info.labour_hours * 45;
  const carriage = supplyOnly ? 15.95 : 0;
  const subtotal = labour + info.material_cost + carriage;
  const vat = vatExempt ? 0 : subtotal * 0.2;
  const total = subtotal + vat;

  document.getElementById("estimate").innerHTML = `
    <h3>Quote Summary</h3>
    <p><strong>Customer:</strong> ${customerName || "N/A"}</p>
    <p><strong>Quote #:</strong> ${quoteNumber || "N/A"}</p>
    <p><strong>Asset:</strong> ${asset}</p>
    <p><strong>Make:</strong> ${make}</p>
    <p><strong>Repair:</strong> ${repair} (Part #${info.part_number})</p>
    <p>Labour: ${supplyOnly ? "N/A (Supply Only)" : `£${labour.toFixed(2)}`}</p>
    <p>Materials: £${info.material_cost.toFixed(2)}</p>
    ${supplyOnly ? `<p>Carriage: £${carriage.toFixed(2)}</p>` : ""}
    <hr>
    <p><strong>Subtotal (excl. VAT):</strong> £${subtotal.toFixed(2)}</p>
    <p><strong>VAT (${vatExempt ? "Exempt" : "20%"}):</strong> £${vat.toFixed(2)}</p>
    <p><strong>Total (incl. VAT): £${total.toFixed(2)}</strong></p>
  `;
}

