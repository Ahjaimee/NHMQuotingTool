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
  populateAssets();

  document.getElementById("assetSelect").addEventListener("change", () => {
    populateMakes();
    document.getElementById("makeSection").style.display = "block";
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    populateRepairs();
    document.getElementById("repairSection").style.display = "block";
  });

  document.getElementById("repairSelect").addEventListener("change", () => {
    document.getElementById("optionsSection").style.display = "block";
  });
});

function populateAssets() {
  const el = document.getElementById("assetSelect");
  el.innerHTML = "";

  Object.keys(data).forEach(asset => {
    const opt = document.createElement("option");
    opt.value = asset;
    opt.textContent = asset;
    el.appendChild(opt);
  });

  if (assetChoices) assetChoices.destroy();
  assetChoices = new Choices(el, { searchEnabled: true });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const el = document.getElementById("makeSelect");
  el.innerHTML = "";

  if (data[asset]) {
    Object.keys(data[asset]).forEach(make => {
      const opt = document.createElement("option");
      opt.value = make;
      opt.textContent = make;
      el.appendChild(opt);
    });
  }

  if (makeChoices) makeChoices.destroy();
  makeChoices = new Choices(el, { searchEnabled: true });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const el = document.getElementById("repairSelect");
  el.innerHTML = "";

  if (data[asset] && data[asset][make]) {
    Object.keys(data[asset][make]).forEach(repair => {
      const opt = document.createElement("option");
      opt.value = repair;
      opt.textContent = repair;
      el.appendChild(opt);
    });
  }

  if (repairChoices) repairChoices.destroy();
  repairChoices = new Choices(el, { searchEnabled: true });
}



