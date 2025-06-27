// Provide a very small fallback implementation for the Choices library when
// external CDN assets cannot be loaded. This allows the dropdowns and tab
// navigation to work even without network access. The stub exposes the minimal
// API used in this project (constructor, destroy and clearStore).
if (typeof window !== 'undefined' && typeof window.Choices === 'undefined') {
  window.Choices = class {
    constructor(selector) {
      this.el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    }
    destroy() {}
    clearStore() {
      if (!this.el || !this.el.options) return;
      for (let i = this.el.options.length - 1; i > 0; i--) {
        this.el.remove(i);
      }
      this.el.selectedIndex = 0;
    }
  };
}

let data = {};

// Fixed carriage charge applied to all sales quotes
const SALES_CARRIAGE = 15.95;
// Labour pricing constants
const LABOUR_RATE = 30.5; // £15.25 per 0.5 hour
const DEFAULT_MIN_LABOUR_COST = 74.75;
let minLabourCost = DEFAULT_MIN_LABOUR_COST;
// Default charges applied to equipment (EQ) sales when no specific costs are provided
const DEFAULT_SETUP_COST = 100;
const DEFAULT_COMMISSION_COST = 50;
// Cost and default selling price for sales items
let salesData = {};

let quoteItems = [];
let salesItems = [];

// Track the optional charges for the currently selected sales item
let currentSetupCost = 0;
let currentCommissionCost = 0;

// Base carriage charge applied once per quote when "Supply Only" is selected
const CARRIAGE_CHARGE = 15.95;
let assetChoices, makeChoices, modelChoices, variantChoices, categoryChoices, repairChoices;
let salesAssetChoices, salesMakeChoices, salesModelChoices,
    salesVariantChoices, salesCategoryChoices, salesItemChoices;
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

  categoryChoices = new Choices("#categorySelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Category',
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
    placeholderValue: 'Select Make',
    allowHTML: false
  });

  salesModelChoices = new Choices("#salesModelSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Model',
    allowHTML: false
  });

  salesVariantChoices = new Choices("#salesVariantSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Variant',
    allowHTML: false
  });

  salesCategoryChoices = new Choices("#salesCategorySelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Category',
    allowHTML: false
  });

  salesItemChoices = new Choices("#salesItemSelect", {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Item',
    allowHTML: false
  });

    setupLabel = document.getElementById("setupLabel");
    commissionLabel = document.getElementById("commissionLabel");
    includeSetup = document.getElementById("includeSetup");
    includeCommission = document.getElementById("includeCommission");

  fetch('data.json')
    .then(r => r.json())
    .then(json => {
      data = json.repairs || {};
      salesData = json.sales || {};
      populateAssets();
      populateSalesAssets();
    })
    .catch(() => {
      populateAssets();
      populateSalesAssets();
    });

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
    categoryChoices.clearStore();
    repairChoices.clearStore();
    populateMakes();
    document.getElementById("makeSection").classList.remove("hidden");
    document.getElementById("modelSection").classList.add("hidden");
    document.getElementById("variantSection").classList.add("hidden");
    document.getElementById("categorySection").classList.add("hidden");
    document.getElementById("repairSection").classList.add("hidden");
    document.getElementById("labourSection").classList.add("hidden");
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    modelChoices.clearStore();
    variantChoices.clearStore();
    categoryChoices.clearStore();
    repairChoices.clearStore();
    populateModels();
    document.getElementById("modelSection").classList.remove("hidden");
    document.getElementById("variantSection").classList.add("hidden");
    document.getElementById("categorySection").classList.add("hidden");
    document.getElementById("repairSection").classList.add("hidden");
    document.getElementById("labourSection").classList.add("hidden");
  });

  document.getElementById("modelSelect").addEventListener("change", () => {
    variantChoices.clearStore();
    categoryChoices.clearStore();
    repairChoices.clearStore();
    populateVariants();
    document.getElementById("variantSection").classList.remove("hidden");
    document.getElementById("categorySection").classList.add("hidden");
    document.getElementById("repairSection").classList.add("hidden");
    document.getElementById("labourSection").classList.add("hidden");
  });

  document.getElementById("variantSelect").addEventListener("change", () => {
    categoryChoices.clearStore();
    repairChoices.clearStore();
    populateCategories();
    document.getElementById("categorySection").classList.remove("hidden");
    document.getElementById("repairSection").classList.add("hidden");
    document.getElementById("labourSection").classList.add("hidden");
  });

  document.getElementById("categorySelect").addEventListener("change", () => {
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
    const descBox = document.getElementById("serviceDesc");
    const descText = document.getElementById("serviceDescText");
    if (info && info.description) {
      descText.textContent = info.description;
      descBox.classList.remove("hidden");
    } else {
      descBox.classList.add("hidden");
    }
    document.getElementById("repairQty").value = 1;
    document.getElementById("labourSection").classList.remove("hidden");
  });

  document.getElementById("salesAssetSelect").addEventListener("change", () => {
    salesMakeChoices.clearStore();
    salesModelChoices.clearStore();
    salesVariantChoices.clearStore();
    salesCategoryChoices.clearStore();
    salesItemChoices.clearStore();
    populateSalesMakes();
    document.getElementById("salesMakeSection").classList.remove("hidden");
    document.getElementById("salesModelSection").classList.add("hidden");
    document.getElementById("salesVariantSection").classList.add("hidden");
    document.getElementById("salesCategorySection").classList.add("hidden");
    document.getElementById("salesItemSection").classList.add("hidden");
    includeSetup.checked = false;
    includeCommission.checked = false;
    document.getElementById("salesExtras").classList.add("hidden");
  });

  document.getElementById("salesMakeSelect").addEventListener("change", () => {
    salesModelChoices.clearStore();
    salesVariantChoices.clearStore();
    salesCategoryChoices.clearStore();
    salesItemChoices.clearStore();
    populateSalesModels();
    document.getElementById("salesModelSection").classList.remove("hidden");
    document.getElementById("salesVariantSection").classList.add("hidden");
    document.getElementById("salesCategorySection").classList.add("hidden");
    document.getElementById("salesItemSection").classList.add("hidden");
  });

  document.getElementById("salesModelSelect").addEventListener("change", () => {
    salesVariantChoices.clearStore();
    salesCategoryChoices.clearStore();
    salesItemChoices.clearStore();
    populateSalesVariants();
    document.getElementById("salesVariantSection").classList.remove("hidden");
    document.getElementById("salesCategorySection").classList.add("hidden");
    document.getElementById("salesItemSection").classList.add("hidden");
  });

  document.getElementById("salesVariantSelect").addEventListener("change", () => {
    salesCategoryChoices.clearStore();
    salesItemChoices.clearStore();
    populateSalesCategories();
    document.getElementById("salesCategorySection").classList.remove("hidden");
    document.getElementById("salesItemSection").classList.add("hidden");
  });

  document.getElementById("salesCategorySelect").addEventListener("change", () => {
    salesItemChoices.clearStore();
    populateSalesItems();
    document.getElementById("salesItemSection").classList.remove("hidden");
  });

  document.getElementById("salesItemSelect").addEventListener("change", () => {
    const asset = document.getElementById("salesAssetSelect").value;
    const make = document.getElementById("salesMakeSelect").value;
    const model = document.getElementById("salesModelSelect").value;
    const variant = document.getElementById("salesVariantSelect").value;
    const category = document.getElementById("salesCategorySelect").value;
    const item = document.getElementById("salesItemSelect").value;
    const info = salesData[asset]?.[make]?.[model]?.[variant]?.[category]?.[item];
    document.getElementById("salesDesc").value = info?.description || `${asset} - ${make} - ${model} - ${variant} - ${category} - ${item}`;
    const repairInfo = data[asset]?.[make]?.[model]?.[variant]?.[category]?.[item];
    currentSetupCost = 0;
    currentCommissionCost = 0;
    if (info) {
      document.getElementById("salesCost").value = info.cost.toFixed(2);
      const margin = ((info.price - info.cost) / info.cost) * 100;
      document.getElementById("salesMargin").value = margin.toFixed(2);
      document.getElementById("salesPrice").value = info.price.toFixed(2);

      const isEQ = repairInfo && repairInfo.part_number && repairInfo.part_number.startsWith("EQ");
      currentSetupCost = typeof info.setupCost !== "undefined" ? info.setupCost : (isEQ ? DEFAULT_SETUP_COST : 0);
      currentCommissionCost = typeof info.commissionCost !== "undefined" ? info.commissionCost : (isEQ ? DEFAULT_COMMISSION_COST : 0);

      if (currentSetupCost || currentCommissionCost) {
        document.getElementById("salesExtras").classList.remove("hidden");
        if (currentSetupCost) {
          setupLabel.classList.remove("hidden");
          includeSetup.checked = false;
          setupLabel.innerHTML = `<input type="checkbox" id="includeSetup" /> Include Setup (+£${currentSetupCost.toFixed(2)})`;
          includeSetup = document.getElementById("includeSetup");
        } else {
          setupLabel.classList.add("hidden");
          includeSetup.checked = false;
        }
        if (currentCommissionCost) {
          commissionLabel.classList.remove("hidden");
          includeCommission.checked = false;
          commissionLabel.innerHTML = `<input type="checkbox" id="includeCommission" /> Include Commission (+£${currentCommissionCost.toFixed(2)})`;
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
    const category = document.getElementById("categorySelect").value;
    const repair = document.getElementById("repairSelect").value;
    const labourHours = document.getElementById("labourHours").value;
    const qty = parseInt(document.getElementById("repairQty").value, 10) || 1;

    if (!asset || !make || !model || !variant || !category || !repair) return;

    const info = data[asset]?.[make]?.[model]?.[variant]?.[category]?.[repair];
    if (info && info.part_number && info.part_number.startsWith("EQ")) {
      alert("This item should be added using the Sales Order tab.");
      return;
    }

    quoteItems.push({ asset, make, model, variant, category, repair, labourHours, qty });
    renderQuote();
    document.getElementById("quoteSection").classList.remove("hidden");
    document.getElementById("downloadPDF").classList.remove("hidden");
    resetRepairFields();
  });

  document.getElementById("supplyOnly").addEventListener("change", renderQuote);
  document.getElementById("vatExempt").addEventListener("change", renderQuote);
  document.getElementById("overrideLabour").addEventListener("change", () => {
    const input = document.getElementById("customLabour");
    input.classList.toggle("hidden", !document.getElementById("overrideLabour").checked);
    renderQuote();
  });
  document.getElementById("customLabour").addEventListener("input", () => {
    if (document.getElementById("overrideLabour").checked) {
      renderQuote();
    }
  });
  document.getElementById("workDesc").addEventListener("input", renderQuote);
  document.getElementById("downloadPDF").addEventListener("click", generatePDF);

  document.getElementById("addSalesItem").addEventListener("click", () => {
    const asset = document.getElementById("salesAssetSelect").value;
    const make = document.getElementById("salesMakeSelect").value;
    const model = document.getElementById("salesModelSelect").value;
    const variant = document.getElementById("salesVariantSelect").value;
    const category = document.getElementById("salesCategorySelect").value;
    const item = document.getElementById("salesItemSelect").value;
    const descField = document.getElementById("salesDesc").value.trim();
    const cost = parseFloat(document.getElementById("salesCost").value);
    const margin = parseFloat(document.getElementById("salesMargin").value);
    const price = parseFloat(document.getElementById("salesPrice").value);
    const qty = parseInt(document.getElementById("salesQty").value, 10);
    const info = salesData[asset]?.[make]?.[model]?.[variant]?.[category]?.[item] || {};
    const setupSelected = includeSetup.checked && currentSetupCost;
    const commissionSelected = includeCommission.checked && currentCommissionCost;
    if (!asset || !make || !model || !variant || !category || !item || isNaN(cost) || isNaN(margin) || isNaN(price) || isNaN(qty)) return;
    const desc = descField || `${asset} - ${make} - ${model} - ${variant} - ${category} - ${item}`;
    salesItems.push({ asset, make, model, variant, category, itemName: item, desc, cost, margin, price, qty, setupSelected, commissionSelected, setupCost: currentSetupCost, commissionCost: currentCommissionCost });
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

function populateCategories() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const model = document.getElementById("modelSelect").value;
  const variant = document.getElementById("variantSelect").value;
  const categories = Object.keys(data[asset]?.[make]?.[model]?.[variant] || {});
  const select = document.getElementById("categorySelect");
  categoryChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Category</option>` +
    categories.map(c => `<option value="${c}">${c}</option>`).join("");
  categoryChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Category',
    allowHTML: false
  });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const model = document.getElementById("modelSelect").value;
  const variant = document.getElementById("variantSelect").value;
  const category = document.getElementById("categorySelect").value;
  const repairs = Object.keys(data[asset]?.[make]?.[model]?.[variant]?.[category] || {});
  const select = document.getElementById("repairSelect");
  repairChoices.destroy();
  select.innerHTML =
    `<option value="" disabled selected>Select Repair</option>` +
    repairs
      .map(r => {
        const info = data[asset]?.[make]?.[model]?.[variant]?.[category]?.[r];
        const isEq = info && info.part_number && info.part_number.startsWith("EQ");
        const label = isEq ? `${r} (Sales Order)` : r;
        return `<option value="${r}" ${isEq ? "disabled" : ""}>${label}</option>`;
      })
      .join("");
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
    placeholderValue: "Select Asset",
    allowHTML: false
  });
  salesMakeChoices.clearStore();
  salesModelChoices.clearStore();
  salesVariantChoices.clearStore();
  salesItemChoices.clearStore();
  document.getElementById("salesMakeSelect").innerHTML = "";
  document.getElementById("salesModelSelect").innerHTML = "";
  document.getElementById("salesVariantSelect").innerHTML = "";
  document.getElementById("salesItemSelect").innerHTML = "";
}

function populateSalesMakes() {
  const asset = document.getElementById("salesAssetSelect").value;
  const makes = Object.keys(salesData[asset] || {});
  const select = document.getElementById("salesMakeSelect");
  salesMakeChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Make</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join("");
  salesMakeChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: "Select Make",
    allowHTML: false
  });
  salesModelChoices.clearStore();
  salesVariantChoices.clearStore();
  salesItemChoices.clearStore();
  document.getElementById("salesModelSelect").innerHTML = "";
  document.getElementById("salesVariantSelect").innerHTML = "";
  document.getElementById("salesItemSelect").innerHTML = "";
}

function populateSalesModels() {
  const asset = document.getElementById("salesAssetSelect").value;
  const make = document.getElementById("salesMakeSelect").value;
  const models = Object.keys(salesData[asset]?.[make] || {});
  const select = document.getElementById("salesModelSelect");
  salesModelChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Model</option>` +
    models.map(m => `<option value="${m}">${m}</option>`).join("");
  salesModelChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: "Select Model",
    allowHTML: false
  });
  salesVariantChoices.clearStore();
  salesItemChoices.clearStore();
  document.getElementById("salesVariantSelect").innerHTML = "";
  document.getElementById("salesItemSelect").innerHTML = "";
}

function populateSalesVariants() {
  const asset = document.getElementById("salesAssetSelect").value;
  const make = document.getElementById("salesMakeSelect").value;
  const model = document.getElementById("salesModelSelect").value;
  const variants = Object.keys(salesData[asset]?.[make]?.[model] || {});
  const select = document.getElementById("salesVariantSelect");
  salesVariantChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Variant</option>` +
    variants.map(v => `<option value="${v}">${v}</option>`).join("");
  salesVariantChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: "Select Variant",
    allowHTML: false
  });
  salesCategoryChoices.clearStore();
  salesItemChoices.clearStore();
  document.getElementById("salesCategorySelect").innerHTML = "";
  document.getElementById("salesItemSelect").innerHTML = "";
}

function populateSalesCategories() {
  const asset = document.getElementById("salesAssetSelect").value;
  const make = document.getElementById("salesMakeSelect").value;
  const model = document.getElementById("salesModelSelect").value;
  const variant = document.getElementById("salesVariantSelect").value;
  const categories = Object.keys(salesData[asset]?.[make]?.[model]?.[variant] || {});
  const select = document.getElementById("salesCategorySelect");
  salesCategoryChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Category</option>` +
    categories.map(c => `<option value="${c}">${c}</option>`).join("");
  salesCategoryChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: "Select Category",
    allowHTML: false
  });
  salesItemChoices.clearStore();
  document.getElementById("salesItemSelect").innerHTML = "";
}

function populateSalesItems() {
  const asset = document.getElementById("salesAssetSelect").value;
  const make = document.getElementById("salesMakeSelect").value;
  const model = document.getElementById("salesModelSelect").value;
  const variant = document.getElementById("salesVariantSelect").value;
  const category = document.getElementById("salesCategorySelect").value;
  const items = Object.keys(salesData[asset]?.[make]?.[model]?.[variant]?.[category] || {});
  const select = document.getElementById("salesItemSelect");
  salesItemChoices.destroy();
  select.innerHTML = `<option value="" disabled selected>Select Item</option>` +
    items.map(i => `<option value="${i}">${i}</option>`).join("");
  salesItemChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: "Select Item",
    allowHTML: false
  });
}

function resetRepairFields() {
  document.getElementById("makeSection").classList.add("hidden");
  document.getElementById("modelSection").classList.add("hidden");
  document.getElementById("variantSection").classList.add("hidden");
  document.getElementById("categorySection").classList.add("hidden");
  document.getElementById("repairSection").classList.add("hidden");
  document.getElementById("labourSection").classList.add("hidden");
  document.getElementById("labourHours").value = "";
  document.getElementById("repairQty").value = 1;
  populateAssets();
  document.getElementById("makeSelect").innerHTML = "";
  document.getElementById("modelSelect").innerHTML = "";
  document.getElementById("variantSelect").innerHTML = "";
  document.getElementById("categorySelect").innerHTML = "";
  document.getElementById("repairSelect").innerHTML = "";
  makeChoices.clearStore();
  modelChoices.clearStore();
  variantChoices.clearStore();
  categoryChoices.clearStore();
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
  const items = [];
  quoteItems.forEach((item, idx) => {
    const info = data[item.asset][item.make][item.model][item.variant][item.category][item.repair];
    if (info.part_number && info.part_number.startsWith("EQ")) {
      return;
    }
    const hours = parseFloat(item.labourHours);
    const labourPerItem = isNaN(hours) ? 0 : hours * LABOUR_RATE;
    const labour = supplyOnly ? 0 : labourPerItem * item.qty;
    labourSubtotal += labour;
    items.push({ item, info, labour, labourPerItem, index: idx });
  });
  const carriageCharge = supplyOnly && items.length > 0 ? CARRIAGE_CHARGE : 0;

  if (!supplyOnly && items.length > 0) {
    const override = document.getElementById("overrideLabour").checked;
    const customVal = parseFloat(document.getElementById("customLabour").value);
    if (override && !isNaN(customVal)) {
      const diff = customVal - labourSubtotal;
      items[0].labour += diff;
      labourSubtotal = customVal;
    } else if (labourSubtotal < minLabourCost) {
      const diff = minLabourCost - labourSubtotal;
      items[0].labour += diff;
      labourSubtotal = minLabourCost;
    }
  }

  items.forEach(({ item, info, labour, index }) => {
    const materials = info.material_cost * item.qty;
    const total = labour + materials;
    subtotal += total;
    quoteLines.innerHTML += `
      <div class="quote-line">
        <p class="desc"><strong>${item.asset} → ${item.make} → ${item.model} → ${item.variant} → ${item.category} → ${item.repair}</strong></p>
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
    <p>Items: ${items.length}</p>
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

  // Use a consistent grey stroke colour for all outline boxes
  doc.setDrawColor(160);

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
  const items = [];
  quoteItems.forEach(item => {
    const info = data[item.asset][item.make][item.model][item.variant][item.category][item.repair];
    if (info.part_number && info.part_number.startsWith("EQ")) {
      return;
    }
    const hours = parseFloat(item.labourHours);
    const labourPerItem = isNaN(hours) ? 0 : hours * LABOUR_RATE;
    const labour = supplyOnlyFlag ? 0 : labourPerItem * item.qty;
    labourSubtotal += labour;
    items.push({ item, info, labour });
  });

  if (!supplyOnlyFlag && items.length > 0) {
    const override = document.getElementById("overrideLabour").checked;
    const customVal = parseFloat(document.getElementById("customLabour").value);
    if (override && !isNaN(customVal)) {
      const diff = customVal - labourSubtotal;
      items[0].labour += diff;
      labourSubtotal = customVal;
    } else if (labourSubtotal < minLabourCost) {
      const diff = minLabourCost - labourSubtotal;
      items[0].labour += diff;
      labourSubtotal = minLabourCost;
    }
  }

  items.forEach(({ item, info, labour }) => {
    const materials = info.material_cost * item.qty;
    const total = labour + materials;
    rows.push([
      `${item.asset} - ${item.make} - ${item.model} - ${item.variant}`,
      `${item.category} - ${item.repair}`,
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
    head: [["Asset", "Category/Repair", "Part#", "Qty", "Labour", "Materials", "Total"]],
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
    "This document is provided as an estimate only and is typically 95% accurate.",
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
        <p class="desc"><strong>${item.asset} → ${item.make} → ${item.model} → ${item.variant} → ${item.category} → ${item.itemName}</strong>${extras.length ? ` (${extras.join(', ')})` : ''}</p>
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

  // Use the same grey stroke colour for all outline boxes
  doc.setDrawColor(160);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

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
      `${item.asset} - ${item.make} - ${item.model} - ${item.variant} - ${item.category} - ${item.itemName}${descExtras}`,
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
    "This document is provided as an estimate and is valid for 30 days.",
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
