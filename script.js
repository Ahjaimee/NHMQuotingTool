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

let assetChoices, makeChoices, repairChoices;

document.addEventListener("DOMContentLoaded", () => {
  // Setup searchable dropdowns
  assetChoices = new Choices('#assetSelect', { searchEnabled: true, itemSelectText: '' });
  makeChoices = new Choices('#makeSelect', { searchEnabled: true, itemSelectText: '' });
  repairChoices = new Choices('#repairSelect', { searchEnabled: true, itemSelectText: '' });

  // Populate asset dropdown
  const assetOptions = Object.keys(data).map(asset => ({
    value: asset,
    label: asset
  }));
  assetChoices.setChoices(assetOptions, 'value', 'label', true);

  document.getElementById('assetSelect').addEventListener('change', () => {
    const selectedAsset = document.getElementById('assetSelect').value;
    if (data[selectedAsset]) {
      const makes = Object.keys(data[selectedAsset]).map(make => ({
        value: make,
        label: make
      }));
      makeChoices.clearChoices();
      makeChoices.setChoices(makes, 'value', 'label', true);
      repairChoices.clearChoices();
    }
  });

  document.getElementById('makeSelect').addEventListener('change', () => {
    const selectedAsset = document.getElementById('assetSelect').value;
    const selectedMake = document.getElementById('makeSelect').value;
    if (data[selectedAsset] && data[selectedAsset][selectedMake]) {
      const repairs = Object.keys(data[selectedAsset][selectedMake]).map(repair => ({
        value: repair,
        label: repair
      }));
      repairChoices.clearChoices();
      repairChoices.setChoices(repairs, 'value', 'label', true);
    }
  });

  document.getElementById('repairSelect').addEventListener('change', showEstimate);
  document.getElementById('supplyOnly').addEventListener('change', showEstimate);
});

function showEstimate() {
  const asset = document.getElementById('assetSelect').value;
  const make = document.getElementById('makeSelect').value;
  const repair = document.getElementById('repairSelect').value;
  const estimateDiv = document.getElementById('estimate');

  const customerName = document.getElementById('customerName').value;
  const quoteNumber = document.getElementById('quoteNumber').value;
  const supplyOnly = document.getElementById('supplyOnly').checked;

  if (!repair) {
    estimateDiv.innerHTML = "";
    return;
  }

  const info = data[asset][make][repair];
  const labourRate = 45;
  const labourCost = supplyOnly ? 0 : info.labour_hours * labourRate;
  const carriageCost = supplyOnly ? 15.95 : 0;
  const materialCost = info.material_cost;
  const total = labourCost + materialCost + carriageCost;

  estimateDiv.innerHTML = `
    <h3>Quote Summary</h3>
    <p><strong>Customer:</strong> ${customerName || "N/A"}</p>
    <p><strong>Quote #:</strong> ${quoteNumber || "N/A"}</p>
    <p><strong>Asset:</strong> ${asset}</p>
    <p><strong>Make:</strong> ${make}</p>
    <p><strong>Repair:</strong> ${repair} (Part #${info.part_number})</p>
    <p>Labour: ${supplyOnly ? "N/A (Supply Only)" : `£${labourCost.toFixed(2)}`}</p>
    <p>Materials: £${materialCost.toFixed(2)}</p>
    ${supplyOnly ? `<p>Carriage: £${carriageCost.toFixed(2)}</p>` : ""}
    <p><strong>Total: £${total.toFixed(2)}</strong></p>
  `;
}


