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

let assetChoices;

document.addEventListener("DOMContentLoaded", () => {
  const assetSelect = document.getElementById("assetSelect");

  // Add options to select
  Object.keys(data).forEach(asset => {
    const option = document.createElement("option");
    option.value = asset;
    option.textContent = asset;
    assetSelect.appendChild(option);
  });

  // Initialize Choices.js
  assetChoices = new Choices(assetSelect, { searchEnabled: true });
});




