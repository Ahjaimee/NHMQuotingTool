const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": {
        labour_hours: 0.5,
        material_cost: 85.0,
        part_number: "OXBATT180"
      }
    }
  }
};

let assetChoices, makeChoices, repairChoices;

document.addEventListener("DOMContentLoaded", () => {
  const assetSelect = document.getElementById("assetSelect");
  const makeSelect = document.getElementById("makeSelect");
  const repairSelect = document.getElementById("repairSelect");

  // Populate Asset dropdown
  populateSelect(assetSelect, Object.keys(data));
  assetChoices = new Choices(assetSelect, { searchEnabled: true });

  assetSelect.addEventListener("change", () => {
    const asset = assetSelect.value;
    const makes = Object.keys(data[asset] || {});
    populateSelect(makeSelect, makes);
    if (makeChoices) makeChoices.destroy();
    makeChoices = new Choices(makeSelect, { searchEnabled: true });
    document.getElementById("makeSection").style.display = "block";
  });

  makeSelect.addEventListener("change", () => {
    const asset = assetSelect.value;
    const make = makeSelect.value;
    const repairs = Object.keys((data[asset] || {})[make] || {});
    populateSelect(repairSelect, repairs);
    if (repairChoices) repairChoices.destroy();
    repairChoices = new Choices(repairSelect, { searchEnabled: true });
    document.getElementById("repairSection").style.display = "block";
  });

  repairSelect.addEventListener("change", () => {
    const asset = assetSelect.value;
    const make = makeSelect.value;
    const repair = repairSelect.value;
    const info = data[asset][make][repair];

    document.getElementById("estimate").innerHTML = `
      <h3>Quote Summary</h3>
      <p><strong>Asset:</strong> ${asset}</p>
      <p><strong>Make:</strong> ${make}</p>
      <p><strong>Repair:</strong> ${repair}</p>
      <p><strong>Part Number:</strong> ${info.part_number}</p>
      <p><strong>Material Cost:</strong> £${info.material_cost.toFixed(2)}</p>
      <p><strong>Labour:</strong> £${(info.labour_hours * 45).toFixed(2)}</p>
    `;
  });
});

function populateSelect(select, options) {
  select.innerHTML = "";
  options.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    select.appendChild(opt);
  });
}
