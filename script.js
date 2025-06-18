const data = {
  "Bath": {
    "Parker": {
      "Rise & Tilt Bath": {
        "Standard": {
          "Oregon Ducting Waste Pipe Kit 1.2Mtr": {
            labour_hours: 0.5,
            material_cost: 47.59,
            part_number: "SPX271-0001",
          }
        }
      }
    }
  },
  "Profile Bed": {
    "Casa": {
      "Classic FS": {
        "Standard": {
          "CFS Headboard Wooden": {
            labour_hours: 0.5,
            material_cost: 150.33,
            part_number: "SPX055-0110",
          }
        }
      }
    },
    "Drive DeVilbiss": {
      "Sidhill / Bradshaw": {
        "Bradshaw Standard": {
          "Grab Handle for 1275 Bradshaw Standard Beds": {
            labour_hours: 0.5,
            material_cost: 134.0,
            part_number: "EQ212-0026",
          },
          "New Sidhil Bradshaw Standard Bed Light Oak": {
            labour_hours: 2,
            material_cost: 955.24,
            part_number: "EQ212-0007",
          }
        },
        "Bradshaw Bariatric": {
          "Grab Handle for Bradshaw Bariatric Bed": {
            labour_hours: 0.5,
            material_cost: 169.47,
            part_number: "EQ212-0022",
          },
          "Bradshaw Bari Kneebreak Inner Calf Section": {
            labour_hours: 0.8,
            material_cost: 246.47,
            part_number: "SPX212-0250",
          },
          "Bradshaw Bari Kneebreak Inner Thigh Section": {
            labour_hours: 0.8,
            material_cost: 154.43,
            part_number: "SPX212-0251",
          },
          "Bradshaw Bari Kneebreak Outer Platform Frame": {
            labour_hours: 0.8,
            material_cost: 209.8,
            part_number: "SPX212-0249",
          },
          "Bradshaw Bari Kneebreak Platform Assy Complete": {
            labour_hours: 1.5,
            material_cost: 761.62,
            part_number: "SPX212-0248",
          },
          "Bradshaw BARI Platform Length Extension Frame Only": {
            labour_hours: 1.2,
            material_cost: 375.65,
            part_number: "EQ212-0018",
          },
          "Bradshaw BARI Side Rail & Platform Length Extension Set": {
            labour_hours: 0.5,
            material_cost: 1124.55,
            part_number: "EQ212-0015",
          },
          "Bradshaw BARI VE Matress Extension Cushion": {
            labour_hours: 0,
            material_cost: 280.25,
            part_number: "EQ212-0020",
          }
        },
        "Bradshaw Junior": {
          "Acclaim Foam Mattress Junior bradshaw": {
            labour_hours: 0.2,
            material_cost: 398.0,
            part_number: "EQ212-0029",
          }
        },
        "Bradshaw Petite Low": {
          "Bradshaw Petite Low Profiling Bed (noRails)": {
            labour_hours: 2,
            material_cost: 1812.5,
            part_number: "EQ212-0027",
          },
          "Bradshaw Petite Side Rail (Single)": {
            labour_hours: 0.5,
            material_cost: 47.6,
            part_number: "EQ212-0028",
          }
        },
        "Bradshaw Low": {
          "New Sidhil Bradshaw Low Bed Light Oak": {
            labour_hours: 2,
            material_cost: 1200.06,
            part_number: "EQ212-0006",
          },
          "Twin Braked Castor 75mm - Bradshaw Low": {
            labour_hours: 0.3,
            material_cost: 49.17,
            part_number: "SPX212-0174",
          }
        }
      }
    }
  },
  "Portable Ceiling Hoist": {
    "Savaria": {
      "Monarch": {
        "Standard": {
          "Li-Ion Charger W/O Cord": {
            labour_hours: 0.5,
            material_cost: 118.32,
            part_number: "SPX323-0068",
          },
          "Power Cord UK for Charger": {
            labour_hours: 0.2,
            material_cost: 32.0,
            part_number: "SPX323-0096",
          },
          "Monarch Portable Hoist Pod 200kg": {
            labour_hours: 2,
            material_cost: 1595.88,
            part_number: "EQ323-0001",
          },
          "Handset Monarch": {
            labour_hours: 0.3,
            material_cost: 207.11,
            part_number: "SPX323-0117",
          },
          "Battery - Monarch": {
            labour_hours: 0.5,
            material_cost: 260.0,
            part_number: "SPX323-0119",
          },
          "Monarch Keypad Membrane Left Hand": {
            labour_hours: 0.6,
            material_cost: 66.81,
            part_number: "SPX323-0127",
          },
          "Monarch Keypad Membrane Right Hand": {
            labour_hours: 0.6,
            material_cost: 66.81,
            part_number: "SPX323-0128",
          },
          "Cable Retainer Monarch Portable": {
            labour_hours: 0.2,
            material_cost: 5.44,
            part_number: "SPX323-0130",
          },
          "Pcb Assy - Monarch": {
            labour_hours: 1,
            material_cost: 252.37,
            part_number: "SPX323-0083",
          },
          "Cabin Kit Monarch Portable": {
            labour_hours: 1.2,
            material_cost: 215.83,
            part_number: "SPX323-0095",
          },
          "Opemed Reacher Stick for Monarch Portable Hoist": {
            labour_hours: 0.4,
            material_cost: 162.45,
            part_number: "EQ323-0002",
          }
        }
      }
    }
  },
  "Hoist": {
    "Oxford": {
      "Major 200": {
        "Manual Spreader Bar": {
          "Sling Bar Replacement": {
            labour_hours: 1.0,
            material_cost: 100.0,
            part_number: "OM200-MSB",
          }
        },
        "Electrical Spreader Bar": {
          "Motor Replacement": {
            labour_hours: 1.5,
            material_cost: 200.0,
            part_number: "OM200-ESB",
          }
        }
      }
    }
  }
};

// Fixed carriage charge applied to all sales quotes
const SALES_CARRIAGE = 15.95;
// Labour pricing constants
const LABOUR_RATE = 30.5; // £15.25 per 0.5 hour
const DEFAULT_MIN_LABOUR_COST = 74.75;
let minLabourCost = DEFAULT_MIN_LABOUR_COST;
// Cost and default selling price for sales items
  const salesData = {
    "Hoist": {
      "Oxford Major 190": { cost: 600.0, price: 799.99, setupCost: 50.0, commissionCost: 25.0 },
      "Liko M220": { cost: 500.0, price: 699.99 }
    },
    "Wheelchair": {
      "Meyra iChair": { cost: 1200.0, price: 1500.0, commissionCost: 60.0 },
      "Invacare TDX": { cost: 950.0, price: 1200.0, setupCost: 80.0 }
    },
    "Profile Bed": {
      "Grab Handle for 1275 Bradshaw Standard Beds": { cost: 50.0, price: 134.0 },
      "Grab Handle for Bradshaw Bariatric Bed": { cost: 89.62, price: 169.47 },
      "Acclaim Foam Mattress Junior bradshaw": { cost: 246.0, price: 398.0 },
      "Bradshaw Bari Kneebreak Inner Calf Section": { cost: 0, price: 246.47 },
      "Bradshaw Bari Kneebreak Inner Thigh Section": { cost: 92.66, price: 154.43 },
      "Bradshaw Bari Kneebreak Outer Platform Frame": { cost: 104.29, price: 209.8 },
      "Bradshaw Bari Kneebreak Platform Assy Complete": { cost: 418.89, price: 761.62 },
      "Bradshaw BARI Platform Length Extension Frame Only": { cost: 227.85, price: 375.65 },
      "Bradshaw BARI Side Rail & Platform Length Extension Set": { cost: 543.2, price: 1124.55 },
      "Bradshaw BARI VE Matress Extension Cushion": { cost: 146.98, price: 280.25 },
      "Bradshaw Petite Low Profiling Bed (noRails)": { cost: 996.9, price: 1812.5 },
      "Bradshaw Petite Side Rail (Single)": { cost: 21.85, price: 47.6 },
      "New Sidhil Bradshaw Low Bed Light Oak": { cost: 734.3, price: 1200.06 },
      "New Sidhil Bradshaw Standard Bed Light Oak": { cost: 584.5, price: 955.24 },
      "Twin Braked Castor 75mm - Bradshaw Low": { cost: 10.64, price: 49.17 }
    },
    "Portable Ceiling Hoist": {
      "Li-Ion Charger W/O Cord": { cost: 39.0, price: 118.32 },
      "Power Cord UK for Charger": { cost: 10.0, price: 32.0 },
      "Monarch Portable Hoist Pod 200kg": { cost: 760.0, price: 1595.88 },
      "Handset Monarch": { cost: 69.0, price: 207.11 },
      "Battery - Monarch": { cost: 195.0, price: 260.0 },
      "Monarch Keypad Membrane Left Hand": { cost: 30.0, price: 66.81 },
      "Monarch Keypad Membrane Right Hand": { cost: 30.0, price: 66.81 },
      "Cable Retainer Monarch Portable": { cost: 2.0, price: 5.44 },
      "Pcb Assy - Monarch": { cost: 135.0, price: 252.37 },
      "Cabin Kit Monarch Portable": { cost: 120.0, price: 215.83 },
      "Opemed Reacher Stick for Monarch Portable Hoist": { cost: 99.0, price: 162.45 }
    }
  };

let quoteItems = [];
let salesItems = [];

// Base carriage charge applied once per quote when "Supply Only" is selected
const CARRIAGE_CHARGE = 15.95;
  let assetChoices, makeChoices, modelChoices, variantChoices, repairChoices;
  let salesAssetChoices, salesMakeChoices;
  let setupLabel, commissionLabel, includeSetup, includeCommission;

document.addEventListener("DOMContentLoaded", () => {
  assetChoices = new Choices("#assetSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Asset',
    allowHTML: false
  });

  makeChoices = new Choices("#makeSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Make',
    allowHTML: false
  });

  modelChoices = new Choices("#modelSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Model',
    allowHTML: false
  });

  variantChoices = new Choices("#variantSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Variant',
    allowHTML: false
  });

  repairChoices = new Choices("#repairSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Repair',
    allowHTML: false
  });

  salesAssetChoices = new Choices("#salesAssetSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Asset',
    allowHTML: false
  });

    salesMakeChoices = new Choices("#salesMakeSelect", {
      searchEnabled: true,
      shouldSort: false,
      placeholderValue: 'Select Make/Model',
      allowHTML: false
    });

    setupLabel = document.getElementById("setupLabel");
    commissionLabel = document.getElementById("commissionLabel");
    includeSetup = document.getElementById("includeSetup");
    includeCommission = document.getElementById("includeCommission");

  populateAssets();
  populateSalesAssets();

  document.getElementById("repairTab").addEventListener("click", () => {
    document.getElementById("repairTab").classList.add("active");
    document.getElementById("salesTab").classList.remove("active");
    document.getElementById("toolTitle").textContent = "Repair Quote Estimator";
    document.getElementById("quoteForm").classList.remove("hidden");
    document.getElementById("quoteSection").classList.add("hidden");
    document.getElementById("salesForm").classList.add("hidden");
    document.getElementById("salesQuoteSection").classList.add("hidden");
  });

  document.getElementById("salesTab").addEventListener("click", () => {
    document.getElementById("salesTab").classList.add("active");
    document.getElementById("repairTab").classList.remove("active");
    document.getElementById("toolTitle").textContent = "Sales Order Quote";
    document.getElementById("quoteForm").classList.add("hidden");
    document.getElementById("quoteSection").classList.add("hidden");
    document.getElementById("salesForm").classList.remove("hidden");
    document.getElementById("salesQuoteSection").classList.add("hidden");
  });

  document.getElementById("assetSelect").addEventListener("change", () => {
    makeChoices.clearStore();
    modelChoices.clearStore();
    variantChoices.clearStore();
    repairChoices.clearStore();
    populateMakes();
    document.getElementById("makeSection").classList.remove("hidden");
    document.getElementById("modelSection").classList.add("hidden");
    document.getElementById("variantSection").classList.add("hidden");
    document.getElementById("repairSection").classList.add("hidden");
    document.getElementById("labourSection").classList.add("hidden");
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    modelChoices.clearStore();
    variantChoices.clearStore();
    repairChoices.clearStore();
    populateModels();
    document.getElementById("modelSection").classList.remove("hidden");
    document.getElementById("variantSection").classList.add("hidden");
    document.getElementById("repairSection").classList.add("hidden");
    document.getElementById("labourSection").classList.add("hidden");
  });

  document.getElementById("modelSelect").addEventListener("change", () => {
    variantChoices.clearStore();
    repairChoices.clearStore();
    populateVariants();
    document.getElementById("variantSection").classList.remove("hidden");
    document.getElementById("repairSection").classList.add("hidden");
    document.getElementById("labourSection").classList.add("hidden");
  });

  document.getElementById("variantSelect").addEventListener("change", () => {
    repairChoices.clearStore();
    populateRepairs();
    document.getElementById("repairSection").classList.remove("hidden");
    document.getElementById("labourSection").classList.add("hidden");
  });

  document.getElementById("repairSelect").addEventListener("change", () => {
    const asset = document.getElementById("assetSelect").value;
    const make = document.getElementById("makeSelect").value;
    const model = document.getElementById("modelSelect").value;
    const variant = document.getElementById("variantSelect").value;
    const repair = document.getElementById("repairSelect").value;
    const info = data[asset]?.[make]?.[model]?.[variant]?.[repair];
    const labourInput = document.getElementById("labourHours");
    if (info && typeof info.labour_hours !== "undefined") {
      labourInput.value = info.labour_hours;
    } else {
      labourInput.value = "";
    }
    document.getElementById("repairQty").value = 1;
    document.getElementById("labourSection").classList.remove("hidden");
  });

  document.getElementById("salesAssetSelect").addEventListener("change", () => {
    salesMakeChoices.clearStore();
    populateSalesMakes();
    document.getElementById("salesMakeSection").classList.remove("hidden");
    includeSetup.checked = false;
    includeCommission.checked = false;
    document.getElementById("salesExtras").classList.add("hidden");
  });

  document.getElementById("salesMakeSelect").addEventListener("change", () => {
    const asset = document.getElementById("salesAssetSelect").value;
    const make = document.getElementById("salesMakeSelect").value;
    document.getElementById("salesDesc").value = `${asset} - ${make}`;
    const info = salesData[asset]?.[make];
    if (info) {
      document.getElementById("salesCost").value = info.cost.toFixed(2);
      const margin = ((info.price - info.cost) / info.cost) * 100;
      document.getElementById("salesMargin").value = margin.toFixed(2);
      document.getElementById("salesPrice").value = info.price.toFixed(2);
      if (info.setupCost || info.commissionCost) {
        document.getElementById("salesExtras").classList.remove("hidden");
        if (info.setupCost) {
          setupLabel.classList.remove("hidden");
          includeSetup.checked = false;
          setupLabel.innerHTML = `<input type="checkbox" id="includeSetup" /> Include Setup (+£${info.setupCost.toFixed(2)})`;
          includeSetup = document.getElementById("includeSetup");
        } else {
          setupLabel.classList.add("hidden");
          includeSetup.checked = false;
        }
        if (info.commissionCost) {
          commissionLabel.classList.remove("hidden");
          includeCommission.checked = false;
          commissionLabel.innerHTML = `<input type="checkbox" id="includeCommission" /> Include Commission (+£${info.commissionCost.toFixed(2)})`;
          includeCommission = document.getElementById("includeCommission");
        } else {
          commissionLabel.classList.add("hidden");
          includeCommission.checked = false;
        }
      } else {
        includeSetup.checked = false;
        includeCommission.checked = false;
        document.getElementById("salesExtras").classList.add("hidden");
      }
    }
  });

  function updatePriceFromMargin() {
    const cost = parseFloat(document.getElementById("salesCost").value);
    const margin = parseFloat(document.getElementById("salesMargin").value);
    if (!isNaN(cost) && !isNaN(margin)) {
      document.getElementById("salesPrice").value = (cost * (1 + margin / 100)).toFixed(2);
    }
  }

  function updateMarginFromPrice() {
    const cost = parseFloat(document.getElementById("salesCost").value);
    const price = parseFloat(document.getElementById("salesPrice").value);
    if (!isNaN(cost) && cost !== 0 && !isNaN(price)) {
      document.getElementById("salesMargin").value = (((price - cost) / cost) * 100).toFixed(2);
    }
  }

  document.getElementById("salesMargin").addEventListener("input", updatePriceFromMargin);
  document.getElementById("salesPrice").addEventListener("input", updateMarginFromPrice);

  document.getElementById("addItem").addEventListener("click", () => {
    const asset = document.getElementById("assetSelect").value;
    const make = document.getElementById("makeSelect").value;
    const model = document.getElementById("modelSelect").value;
    const variant = document.getElementById("variantSelect").value;
    const repair = document.getElementById("repairSelect").value;
    const labourHours = document.getElementById("labourHours").value;
    const qty = parseInt(document.getElementById("repairQty").value, 10) || 1;

    if (!asset || !make || !model || !variant || !repair) return;

    quoteItems.push({ asset, make, model, variant, repair, labourHours, qty });
    renderQuote();
    document.getElementById("quoteSection").classList.remove("hidden");
    document.getElementById("downloadPDF").classList.remove("hidden");
    resetRepairFields();
  });

  document.getElementById("supplyOnly").addEventListener("change", renderQuote);
  document.getElementById("vatExempt").addEventListener("change", renderQuote);
  document.getElementById("overrideLabour").addEventListener("change", () => {
    const input = document.getElementById("customLabour");
    if (document.getElementById("overrideLabour").checked) {
      input.classList.remove("hidden");
      const val = parseFloat(input.value);
      minLabourCost = isNaN(val) ? DEFAULT_MIN_LABOUR_COST : val;
    } else {
      input.classList.add("hidden");
      minLabourCost = DEFAULT_MIN_LABOUR_COST;
    }
    renderQuote();
  });
  document.getElementById("customLabour").addEventListener("input", () => {
    if (document.getElementById("overrideLabour").checked) {
      const val = parseFloat(document.getElementById("customLabour").value);
      minLabourCost = isNaN(val) ? DEFAULT_MIN_LABOUR_COST : val;
      renderQuote();
    }
  });
  document.getElementById("workDesc").addEventListener("input", renderQuote);
  document.getElementById("downloadPDF").addEventListener("click", generatePDF);

  document.getElementById("addSalesItem").addEventListener("click", () => {
    const asset = document.getElementById("salesAssetSelect").value;
    const make = document.getElementById("salesMakeSelect").value;
    const descField = document.getElementById("salesDesc").value.trim();
    const cost = parseFloat(document.getElementById("salesCost").value);
    const margin = parseFloat(document.getElementById("salesMargin").value);
    const price = parseFloat(document.getElementById("salesPrice").value);
    const qty = parseInt(document.getElementById("salesQty").value, 10);
    const info = salesData[asset]?.[make] || {};
    const setupSelected = includeSetup.checked && info.setupCost;
    const commissionSelected = includeCommission.checked && info.commissionCost;
    if (!asset || !make || isNaN(cost) || isNaN(margin) || isNaN(price) || isNaN(qty)) return;
    const desc = descField || `${asset} - ${make}`;
    salesItems.push({ asset, make, desc, cost, margin, price, qty, setupSelected, commissionSelected, setupCost: info.setupCost || 0, commissionCost: info.commissionCost || 0 });
    renderSalesQuote();
    document.getElementById("salesQuoteSection").classList.remove("hidden");
    document.getElementById("downloadSalesPDF").classList.remove("hidden");
    document.getElementById("salesDesc").value = "";
    document.getElementById("salesQty").value = 1;
    populateSalesAssets();
    document.getElementById("salesMakeSection").classList.add("hidden");
  });

  document.getElementById("vatExemptSales").addEventListener("change", renderSalesQuote);
  document.getElementById("downloadSalesPDF").addEventListener("click", generateSalesPDF);
});

function populateAssets() {
  const select = document.getElementById("assetSelect");
  assetChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Asset</option>` +
    Object.keys(data).map(a => `<option value="${a}">${a}</option>`).join("");
  assetChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Asset',
    allowHTML: false
  });
}

function populateMakes() {
  const asset = document.getElementById("assetSelect").value;
  const makes = Object.keys(data[asset] || {});
  const select = document.getElementById("makeSelect");
  makeChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Make</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join("");
  makeChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Make',
    allowHTML: false
  });
}

function populateModels() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const models = Object.keys(data[asset]?.[make] || {});
  const select = document.getElementById("modelSelect");
  modelChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Model</option>` +
    models.map(m => `<option value="${m}">${m}</option>`).join("");
  modelChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Model',
    allowHTML: false
  });
}

function populateVariants() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const model = document.getElementById("modelSelect").value;
  const variants = Object.keys(data[asset]?.[make]?.[model] || {});
  const select = document.getElementById("variantSelect");
  variantChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Variant</option>` +
    variants.map(v => `<option value="${v}">${v}</option>`).join("");
  variantChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Variant',
    allowHTML: false
  });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const model = document.getElementById("modelSelect").value;
  const variant = document.getElementById("variantSelect").value;
  const repairs = Object.keys(data[asset]?.[make]?.[model]?.[variant] || {});
  const select = document.getElementById("repairSelect");
  repairChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Repair</option>` +
    repairs.map(r => `<option value="${r}">${r}</option>`).join("");
  repairChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Repair',
    allowHTML: false
  });
}

function populateSalesAssets() {
  const select = document.getElementById("salesAssetSelect");
  salesAssetChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Asset</option>` +
    Object.keys(salesData).map(a => `<option value="${a}">${a}</option>`).join("");
  salesAssetChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Asset',
    allowHTML: false
  });
  salesMakeChoices.clearStore();
  document.getElementById("salesMakeSelect").innerHTML = "";
}

function populateSalesMakes() {
  const asset = document.getElementById("salesAssetSelect").value;
  const makes = Object.keys(salesData[asset] || {});
  const select = document.getElementById("salesMakeSelect");
  salesMakeChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Make/Model</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join("");
  salesMakeChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Make/Model',
    allowHTML: false
  });
}

function resetRepairFields() {
  document.getElementById("makeSection").classList.add("hidden");
  document.getElementById("modelSection").classList.add("hidden");
  document.getElementById("variantSection").classList.add("hidden");
  document.getElementById("repairSection").classList.add("hidden");
  document.getElementById("labourSection").classList.add("hidden");
  document.getElementById("labourHours").value = "";
  document.getElementById("repairQty").value = 1;
  populateAssets();
  document.getElementById("makeSelect").innerHTML = "";
  document.getElementById("modelSelect").innerHTML = "";
  document.getElementById("variantSelect").innerHTML = "";
  document.getElementById("repairSelect").innerHTML = "";
  makeChoices.clearStore();
  modelChoices.clearStore();
  variantChoices.clearStore();
  repairChoices.clearStore();
}

function renderQuote() {
  const quoteLines = document.getElementById("quoteLines");
  const estimate = document.getElementById("estimate");
  const descBox = document.getElementById("workDescription");
  const descValue = document.getElementById("workDesc").value.trim();
  if (descValue) {
    descBox.textContent = descValue;
    descBox.classList.remove("hidden");
  } else {
    descBox.classList.add("hidden");
  }
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  quoteLines.innerHTML = "";
  let subtotal = 0;
  let labourSubtotal = 0;
  const carriageCharge = supplyOnly && quoteItems.length > 0 ? CARRIAGE_CHARGE : 0;

  const items = quoteItems.map(item => {
    const info = data[item.asset][item.make][item.model][item.variant][item.repair];
    const hours = parseFloat(item.labourHours);
    const labourPerItem = isNaN(hours) ? 0 : hours * LABOUR_RATE;
    const labour = supplyOnly ? 0 : labourPerItem * item.qty;
    labourSubtotal += labour;
    return { item, info, labour, labourPerItem };
  });

  if (!supplyOnly && items.length > 0 && labourSubtotal < minLabourCost) {
    const diff = minLabourCost - labourSubtotal;
    items[0].labour += diff;
    labourSubtotal = minLabourCost;
  }

  items.forEach(({ item, info, labour }, index) => {
    const materials = info.material_cost * item.qty;
    const total = labour + materials;
    subtotal += total;
    quoteLines.innerHTML += `
      <div class="quote-line">
        <p class="desc"><strong>${item.asset} → ${item.make} → ${item.model} → ${item.variant} → ${item.repair}</strong></p>
        <p><span class="label">Part #:</span><span class="value">${info.part_number}</span></p>
        <p><span class="label">Qty:</span><span class="value">${item.qty}</span></p>
        <p><span class="label">Labour:</span><span class="value">${supplyOnly ? 'N/A' : `£${labour.toFixed(2)}`}</span></p>
        <p><span class="label">Materials:</span><span class="value">£${materials.toFixed(2)}</span></p>
        <p class="total-line"><strong class="label">Total:</strong><strong class="value">£${total.toFixed(2)}</strong></p>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  if (carriageCharge > 0) {
    subtotal += carriageCharge;
    quoteLines.innerHTML += `
      <div class="quote-line">
        <p><strong class="label">Carriage</strong><strong class="value">£${carriageCharge.toFixed(2)}</strong></p>
      </div>
    `;
  }

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const grandTotal = subtotal + vat;

  estimate.innerHTML = `
    <h3>Quote Summary</h3>
    <p>Items: ${quoteItems.length}</p>
    <p>Subtotal: £${subtotal.toFixed(2)}</p>
    <p>VAT (${vatExempt ? "Exempt" : "20%"}): £${vat.toFixed(2)}</p>
    <p><strong>Total: £${grandTotal.toFixed(2)}</strong></p>
  `;
}

function removeItem(index) {
  quoteItems.splice(index, 1);
  renderQuote();
  if (quoteItems.length === 0) {
    document.getElementById("downloadPDF").classList.add("hidden");
    document.getElementById("quoteSection").classList.add("hidden");
  }
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Logo as data URL
  const logo = await fetch("nhm-logo.png")
    .then(r => r.blob())
    .then(
      blob =>
        new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );

  // Header band
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, pageWidth, 25, "F");

  // Logo and title
  // Maintain logo aspect ratio by letting jsPDF calculate width
  doc.addImage(logo, "PNG", 10, 5, 0, 15);
  doc.setTextColor(39, 72, 143);
  doc.setFontSize(16);
  // Title displayed prominently at the top of the page
  doc.text("Quoted Repair Estimate", pageWidth / 2, 12, { align: "center" });
  doc.setTextColor(0, 0, 0);

  const infoStartY = 30;

  const name = document.getElementById("customerName").value || "(No name)";
  const email = document.getElementById("customerEmail").value || "";
  const phone = document.getElementById("customerPhone").value || "";
  const desc = document.getElementById("workDesc").value || "";
  const number = document.getElementById("quoteNumber").value || "(No #)";

  const infoLines = [
    `Quote #: ${number}`,
    `Customer: ${name}`,
    `Phone: ${phone || "(N/A)"}`,
    `Email: ${email || "(N/A)"}`,
    `Date: ${new Date().toLocaleDateString()}`
  ];

  doc.setFontSize(11);
  const lineHeight = 6;
  const infoBoxWidth = pageWidth - margin * 2;
  const infoBoxHeight = infoLines.length * lineHeight + 4;
  doc.rect(margin, infoStartY, infoBoxWidth, infoBoxHeight);
  infoLines.forEach((t, i) => {
    doc.text(t, margin + 2, infoStartY + lineHeight * (i + 1));
  });

  let infoY = infoStartY + infoBoxHeight + 6;

  if (desc) {
    const descLines = doc.splitTextToSize(desc, infoBoxWidth - 4);
    const descHeight = descLines.length * lineHeight + 4;
    doc.rect(margin, infoY, infoBoxWidth, descHeight);
    doc.text(descLines, margin + 2, infoY + lineHeight);
    infoY += descHeight + 6;
  }

  const tableStartY = infoY;

  const rows = [];
  let labourSubtotal = 0;
  const supplyOnlyFlag = document.getElementById("supplyOnly").checked;
  const items = quoteItems.map(item => {
    const info = data[item.asset][item.make][item.model][item.variant][item.repair];
    const hours = parseFloat(item.labourHours);
    const labourPerItem = isNaN(hours) ? 0 : hours * LABOUR_RATE;
    const labour = supplyOnlyFlag ? 0 : labourPerItem * item.qty;
    labourSubtotal += labour;
    return { item, info, labour };
  });

  if (!supplyOnlyFlag && items.length > 0 && labourSubtotal < minLabourCost) {
    const diff = minLabourCost - labourSubtotal;
    items[0].labour += diff;
    labourSubtotal = minLabourCost;
  }

  items.forEach(({ item, info, labour }) => {
    const materials = info.material_cost * item.qty;
    const total = labour + materials;
    rows.push([
      `${item.asset} - ${item.make} - ${item.model} - ${item.variant}`,
      item.repair,
      info.part_number,
      item.qty,
      `£${labour.toFixed(2)}`,
      `£${materials.toFixed(2)}`,
      `£${total.toFixed(2)}`
    ]);
  });

  const carriageCharge = document.getElementById("supplyOnly").checked && rows.length > 0 ? CARRIAGE_CHARGE : 0;
  if (carriageCharge > 0) {
    rows.push(["Carriage", "", "", "", "", "", `£${carriageCharge.toFixed(2)}`]);
  }

  doc.autoTable({
    startY: tableStartY,
    head: [["Asset", "Repair", "Part#", "Qty", "Labour", "Materials", "Total"]],
    body: rows,
    margin: { left: 15, right: 15 },
    theme: "grid",
    headStyles: { fillColor: [39, 72, 143], textColor: 255, halign: "center" },
    styles: {
      halign: "center",
      fontSize: 10,
      cellPadding: 3
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "left" },
      2: { halign: "center" },
      3: { halign: "center" }
    }
  });

  const subtotal = rows.reduce((sum, r) => sum + parseFloat(r[6].replace("£", "")), 0);
  const vat = document.getElementById("vatExempt").checked ? 0 : subtotal * 0.2;
  const total = subtotal + vat;
  const finalY = doc.lastAutoTable.finalY || 60;

  const summaryBoxWidth = 60;
  const summaryX = pageWidth - margin - summaryBoxWidth;
  const summaryY = finalY + 6;
  const summaryLines = [
    `Subtotal: £${subtotal.toFixed(2)}`,
    `VAT: £${vat.toFixed(2)}`,
    `Total: £${total.toFixed(2)}`
  ];
  const summaryHeight = summaryLines.length * lineHeight + 4;
  doc.rect(summaryX, summaryY, summaryBoxWidth, summaryHeight);
  summaryLines.forEach((t, i) => {
    doc.text(t, summaryX + summaryBoxWidth - 2, summaryY + lineHeight * (i + 1), { align: "right" });
  });

  let noteY = summaryY + summaryHeight + 8;
  const centreX = pageWidth / 2;
  if (document.getElementById("supplyOnly").checked) {
    doc.text("Supply Only: Yes", centreX, noteY, { align: "center" });
    noteY += 6;
  }
  if (document.getElementById("vatExempt").checked) {
    doc.text("VAT Exempt: Yes", centreX, noteY, { align: "center" });
    noteY += 6;
  }

  const disclaimerLines = [
    "This repair quote is an estimate only and typically 95% accurate.",
    "If you are happy with this estimate we can send a final",
    "quote for your approval before any work proceeds.",
    "Thank you for choosing NHM. Please contact us with any questions."
  ];
  const discHeight = disclaimerLines.length * lineHeight + 4;
  const discY = pageHeight - discHeight - margin;
  doc.setFontSize(10);
  doc.rect(margin, discY, pageWidth - margin * 2, discHeight);
  disclaimerLines.forEach((t, i) => {
    doc.text(t, pageWidth / 2, discY + lineHeight * (i + 1), { align: "center" });
  });

  doc.save("NHM_Quote.pdf");
}

function renderSalesQuote() {
  const lines = document.getElementById("salesQuoteLines");
  const estimate = document.getElementById("salesEstimate");
  const vatExempt = document.getElementById("vatExemptSales").checked;

  lines.innerHTML = "";
  let subtotal = 0;

  salesItems.forEach((item, index) => {
    let itemPrice = item.price;
    const extras = [];
    if (item.setupSelected) {
      itemPrice += item.setupCost;
      extras.push(`Setup +£${item.setupCost.toFixed(2)}`);
    }
    if (item.commissionSelected) {
      itemPrice += item.commissionCost;
      extras.push(`Commission +£${item.commissionCost.toFixed(2)}`);
    }
    const total = itemPrice * item.qty;
    subtotal += total;
    lines.innerHTML += `
      <div class="quote-line">
        <p class="desc"><strong>${item.asset} → ${item.make}</strong>${extras.length ? ` (${extras.join(', ')})` : ''}</p>
        <p><span class="label">Cost:</span><span class="value">£${item.cost.toFixed(2)}</span></p>
        <p><span class="label">Margin:</span><span class="value">${item.margin.toFixed(2)}%</span></p>
        <p><span class="label">Price (ex VAT):</span><span class="value">£${itemPrice.toFixed(2)}</span></p>
        <p><span class="label">Qty:</span><span class="value">${item.qty}</span></p>
        <p class="total-line"><strong class="label">Total:</strong><strong class="value">£${total.toFixed(2)}</strong></p>
        <button onclick="removeSalesItem(${index})">Remove</button>
      </div>
    `;
  });

  subtotal += SALES_CARRIAGE;
  if (salesItems.length > 0) {
    lines.innerHTML += `
      <div class="quote-line">
        <p><strong class="label">Carriage</strong><strong class="value">£${SALES_CARRIAGE.toFixed(2)}</strong></p>
      </div>
    `;
  }

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const grandTotal = subtotal + vat;

  estimate.innerHTML = `
    <h3>Quote Summary</h3>
    <p>Items: ${salesItems.length}</p>
    <p>Subtotal: £${subtotal.toFixed(2)}</p>
    <p>VAT (${vatExempt ? "Exempt" : "20%"}): £${vat.toFixed(2)}</p>
    <p><strong>Total: £${grandTotal.toFixed(2)}</strong></p>
  `;
}

function removeSalesItem(index) {
  salesItems.splice(index, 1);
  renderSalesQuote();
  if (salesItems.length === 0) {
    document.getElementById("downloadSalesPDF").classList.add("hidden");
    document.getElementById("salesQuoteSection").classList.add("hidden");
  }
}

async function generateSalesPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  const logo = await fetch("nhm-logo.png")
    .then(r => r.blob())
    .then(blob => new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));

  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, pageWidth, 25, "F");

  // Maintain logo aspect ratio by letting jsPDF calculate width
  doc.addImage(logo, "PNG", 10, 5, 0, 15);
  doc.setTextColor(39, 72, 143);
  doc.setFontSize(16);
  doc.text("Sales Order Quote", pageWidth / 2, 12, { align: "center" });
  doc.setTextColor(0, 0, 0);

  const infoStartY = 30;
  const name = document.getElementById("salesCustomerName").value || "(No name)";
  const email = document.getElementById("salesCustomerEmail").value || "";
  const phone = document.getElementById("salesCustomerPhone").value || "";
  const number = document.getElementById("salesQuoteNumber").value || "(No #)";
  const infoLines = [
    `Quote #: ${number}`,
    `Customer: ${name}`,
    `Phone: ${phone || "(N/A)"}`,
    `Email: ${email || "(N/A)"}`,
    `Date: ${new Date().toLocaleDateString()}`
  ];
  doc.setFontSize(11);
  const lineHeight = 6;
  const infoBoxWidth = pageWidth - margin * 2;
  const infoBoxHeight = infoLines.length * lineHeight + 4;
  doc.rect(margin, infoStartY, infoBoxWidth, infoBoxHeight);
  infoLines.forEach((t, i) => {
    doc.text(t, margin + 2, infoStartY + lineHeight * (i + 1));
  });
  let infoY = infoStartY + infoBoxHeight + 6;

  const tableStartY = infoY;

  const rows = salesItems.map(item => {
    let price = item.price;
    const extras = [];
    if (item.setupSelected) {
      price += item.setupCost;
      extras.push('Setup');
    }
    if (item.commissionSelected) {
      price += item.commissionCost;
      extras.push('Commission');
    }
    const descExtras = extras.length ? ` (${extras.join(' + ')})` : '';
    return [
      `${item.asset} - ${item.make}${descExtras}`,
      item.qty,
      `£${price.toFixed(2)}`,
      `£${(price * item.qty).toFixed(2)}`
    ];
  });

  if (rows.length > 0) {
    rows.push(["Carriage", "", "", `£${SALES_CARRIAGE.toFixed(2)}`]);
  }

  doc.autoTable({
    startY: tableStartY,
    head: [["Item", "Qty", "Price (ex VAT)", "Total"]],
    body: rows,
    margin: { left: 15, right: 15 },
    theme: "grid",
    headStyles: { fillColor: [39, 72, 143], textColor: 255, halign: "center" },
    styles: { halign: "center", fontSize: 10, cellPadding: 3 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: { 0: { halign: "left" } }
  });

  const subtotal = rows.reduce((sum, r) => sum + parseFloat(r[3].replace("£", "")), 0);
  const vat = document.getElementById("vatExemptSales").checked ? 0 : subtotal * 0.2;
  const total = subtotal + vat;
  const finalY = doc.lastAutoTable.finalY || 60;

  const summaryBoxWidth = 60;
  const summaryX = pageWidth - margin - summaryBoxWidth;
  const summaryY = finalY + 6;
  const summaryLines = [
    `Subtotal: £${subtotal.toFixed(2)}`,
    `VAT: £${vat.toFixed(2)}`,
    `Total: £${total.toFixed(2)}`
  ];
  const summaryHeight = summaryLines.length * lineHeight + 4;
  doc.rect(summaryX, summaryY, summaryBoxWidth, summaryHeight);
  summaryLines.forEach((t, i) => {
    doc.text(t, summaryX + summaryBoxWidth - 2, summaryY + lineHeight * (i + 1), { align: "right" });
  });

  const centreX = pageWidth / 2;
  if (document.getElementById("vatExemptSales").checked) {
    doc.text("VAT Exempt: Yes", centreX, summaryY + summaryHeight + 6, { align: "center" });
  }

  const disclaimerLines = [
    "All prices exclude VAT unless marked exempt.",
    "This quote is valid for 30 days.",
    "Thank you for choosing NHM. Please contact us with any questions."
  ];
  const discHeight = disclaimerLines.length * lineHeight + 4;
  const discY = pageHeight - discHeight - margin;
  doc.setFontSize(10);
  doc.rect(margin, discY, pageWidth - margin * 2, discHeight);
  disclaimerLines.forEach((t, i) => {
    doc.text(t, pageWidth / 2, discY + lineHeight * (i + 1), { align: "center" });
  });

  doc.save("NHM_Sales_Quote.pdf");
}
