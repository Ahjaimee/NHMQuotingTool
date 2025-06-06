function showEstimate() {
  const asset = document.getElementById('assetSelect').value;
  const make = document.getElementById('makeSelect').value;
  const repair = document.getElementById('repairSelect').value;
  const estimateDiv = document.getElementById('estimate');

  const customerName = document.getElementById('customerName').value;
  const quoteNumber = document.getElementById('quoteNumber').value;

  if (!repair) return;

  const info = data[asset][make][repair];
  const labourRate = 45; // £ per hour
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
