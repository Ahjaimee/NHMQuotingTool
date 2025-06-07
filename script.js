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

  // Populate asset options
  populateSelect(assetSelect, Object.keys(data));
  assetChoices = new Choices(assetSelect, { searchEnabled: true });

  assetSelect.addEventListener("change", () => {
    const selectedAsset = assetSelect.value;
    const makes = Object.keys(data[selectedAsset] || {});
    populateSelect(makeSelect, makes);
    if (makeChoices) makeChoices.destroy();
    makeChoices = new Choices(makeSelect, { searchEnabled: true });
    document.getElementById("makeSection").style.display = "block";
    document.getElementById("repairSection").style.display = "none";
    document.getElementById("optionsSection").style.display = "none";
    document.getElementById("estimate").innerHTML = "";
  });

  makeSelect.addEventListener("change", () => {
    const selectedAsset = assetSelect.value;
    const selectedMake = makeSelect.value;
    const repairs = Object.keys((data[selectedAsset] || {})[selectedMake] || {});
    populateSelect(repairSelect, repairs);
    if (repairChoices) repairChoices.destroy();
    repairChoices = new Choices(repairSelect, { searchEnabled: true });
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

function populateSelect(selectElement, options) {
  selectElement.innerHTML = "";
  options.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    selectElement.appendChild(opt);
  });
}

function showEstimate() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repair = document.getElementById("repairSelect").value;
  const customerName = document.getElementById("customer
::contentReference[oaicite:0]{index=0}
 
