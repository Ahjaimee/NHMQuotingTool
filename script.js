const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": {
        "part_number": "BATT-M180",
        "labour_hours": 1,
        "material_cost": 60
      },
      "Replace Castor": {
        "part_number": "CASTOR-M180",
        "labour_hours": 0.5,
        "material_cost": 20
      }
    }
  }
};

window.onload = loadAssets;

function loadAssets() {
  const assetSelect = document.getElementById('assetSelect');
  assetSelect.innerHTML = '<option value="">-- Select Asset --</option>';
  Object.keys(data).forEach(asset => {
    const option = document.createElement('option');
    option.value = asset;
    option.textContent = asset;
    assetSelect.appendChild(option);
  });

  assetSelect.onchange = loadMakes;
}

function loadMakes() {
  const asset = document.getElementById('assetSelect').value;
  const makeSelect = document.getElementById('makeSelect');
  makeSelect.innerHTML = '<option value="">-- Select Make/Model --</option>';
  document.getElementById('repairSelect').innerHTML = '';
  document.getElementById('estimate').innerHTML = '';

  if (!asset) return;

  Object.keys(data[asset]).forEach(make => {
    const option = document.createElement('option');
    option.value = make;
    option.textContent = make;
    makeSelect.appendChild(option);
  });

  makeSelect.onchange = loadRepairs;
}

function loadRepairs() {
  const asset = document.getElementById('assetSelect').value;
  const make = document.getElementById('makeSelect').value;
  const repairSelect = document.getElementById('repairSelect');
  repairSelect.innerHTML = '<option value="">-- Select Repair --</option>';
  document.getElementById('estimate').innerHTML = '';

  if (!make) return;

  Object.entries(data[asset][make]).forEach(([repair, info]) => {
    const option = document.createElement('option');
    option.value = repair;
    option.textContent = `${repair} (Part #${info.part_number})`;
    repairSelect.appendChild(option);
  });

  repairSelect.onchange = showEstimate;
}

function showEstimate() {
  const asset = document.getElementById('assetSelect').value;
  const make = document.getElementById('makeSelect').value;
  const repair = document.getElementById('repairSelect').value;
  const estimateDiv = document.getElementById('estimate');

  const customerName = document.getElementById('customerName').value;
  const quoteNumber = document.getElementById('quoteNumber').value;

  if (!repair) return;

  const info = data[asset][make][repair];
  const labourRate = 45;
  const labourCost = info.labour_hours * labourRate;
  const total = labourCost + info.material_cost;

  estimateDiv.innerHTML = `
    <h3>Quote Summary</h3>
    <p><strong>Customer:</strong> ${customerName || "N/A"}</p>
    <p><strong>Quote #:</strong> ${quoteNumber || "N/A"}</p>
    <p><strong>Asset:</strong> ${asset}</p>
    <p><strong>Make:</strong> ${make}</p>
    <p><strong>Repair:</strong> ${repair} (Part #${info.part_number})</p>
    <p>Labour: £${labourCost.toFixed(2)}</p>
    <p>Materials: £${info.material_cost.toFixed(2)}</p>
    <p><strong>Total: £${total.toFixed(2)}</strong></p>
  `;
}

