const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": {
        labour_hours: 0.5,
        material_cost: 85,
        part_number: "BAT-MID-180"
      },
      "Handset Replacement": {
        labour_hours: 0.7,
        material_cost: 65,
        part_number: "HND-MID-180"
      }
    }
  }
};

// Set random customer name placeholder
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
});


// Dropdown logic + estimator
let assetChoices, makeChoices, repairChoices;

document.addEventListener("DOMContentLoaded", () => {
  assetChoices = new Choices("#assetSelect", { searchEnabled: true });
  makeChoices = new Choices("#makeSelect", { searchEnabled: true });
  repairChoices = new Choices("#repairSelect", { searchEnabled: true });

  const assetOptions = Object.keys(data).map(asset => ({ value: asset, label: asset }));
  assetChoices.setChoices(assetOptions, 'value', 'label', true);

  document.getElementById("assetSelect").addEventListener("change", () => {
    const selectedAsset = document.getElementById("assetSelect").value;
    makeChoices.clearChoices();
    repairChoices.clearChoices();

    if (data[selectedAsset]) {
      const makeOptions = Object.keys(data[selectedAsset]).map(make => ({ value: make, label: make }));
      makeChoices.setChoices(makeOptions, 'value', 'label', true);
    }
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    const selectedAsset = document.getElementById("assetSelect").value;
    const selectedMake = document.getElementById("makeSelect").value;
    repairChoices.clearChoices();

    if (data[selectedAsset] && data[selectedAsset][selectedMake]) {
      const repairOptions = Object.keys(data[selectedAsset][selectedMake]).map(repair => ({ value: repair, label: repair }));
      repairChoices.setChoices(repairOptions, 'value', 'label', true);
    }
  });

  document.getElementById("repairSelect").addEventListener("change", showEstimate);
  document.getElementById("supplyOnly").addEventListener("change", showEstimate);
});

// Estimate preview logic
function showEstimate() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repair = document.getElementById("repairSelect").value;
  const customerName = document.getElementById("customerName").value;
  const quoteNumber = document.getElementById("quoteNumber").value;
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const estimateDiv = document.getElementById("estimate");

  if (!repair) {
    estimateDiv.innerHTML = "";
    return;
  }

  const info = data[asset][make][repair];
  const labourCost = supplyOnly ? 0 : info.labour_hours * 45;
  const carriageCost = supplyOnly ? 15.95 : 0;
  const total = labourCost + info.material_cost + carriageCost;

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
    <p><strong>Total: £${total.toFixed(2)}</strong></p>
  `;
}

// PDF download logic
document.addEventListener("DOMContentLoaded", () => {
  const pdfButton = document.getElementById("downloadPDF");
  pdfButton.addEventListener("click", () => {
    const estimate = document.getElementById("estimate");
    if (estimate.innerHTML.trim() === "") return;

    const opt = {
      margin:       0.5,
      filename:     'quote-estimate.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(estimate).set(opt).save();
  });
});


