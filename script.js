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

document.addEventListener("DOMContentLoaded", () => {
  const assetSelect = document.getElementById('assetSelect');
  const makeSelect = document.getElementById('makeSelect');
  const repairSelect = document.getElementById('repairSelect');

  for (let asset in data) {
    const option = document.createElement('option');
    option.value = asset;
    option.textContent = asset;
    assetSelect.appendChild(option);
  }

  assetSelect.addEventListener('change', () => {
    makeSelect.innerHTML = '<option value="">-- Select Make --</option>';
    repairSelect.innerHTML = '<option value="">-- Select Repair --</option>';
    const selectedAsset = assetSelect.value;

    if (data[selectedAsset]) {
      for (let make in data[selectedAsset]) {
        const option = document.createElement('option');
        option.value = make;
        option.textContent = make;
        makeSelect.appendChild(option);
      }
    }
  });

  makeSelect.addEventListener('change', () => {
    repairSelect.innerHTML = '<option value="">-- Select Repair --</option>';
    const selectedAsset = assetSelect.value;
    const selectedMake = makeSelect.value;

    if (data[selectedAsset] && data[selectedAsset][selectedMake]) {
      for (let repair in data[selectedAsset][selectedMake]) {
        const option = document.createElement('option');
        option.value = repair;
        option.textContent = repair;
        repairSelect.appendChild(option);
      }
    }
  });

  repairSelect.addEventListener('change', showEstimate);
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


