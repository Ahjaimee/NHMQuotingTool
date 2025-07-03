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

// Padding used for all PDF tables for consistent styling
// Reduced from 6 to make table headers shorter
const TABLE_PADDING = 4;

// Brand colours used in PDFs
const BRAND_BLUE = [39, 72, 143];
const ACCENT_ORANGE = [245, 128, 32];

const COMPANY_NAME = "N H Maintenance Ltd";
const COMPANY_ADDRESS = "Consort House, Jubilee Road, Victoria Business Park, Burgess Hill, West Sussex, RH15 9TL";
const COMPANY_CONTACT = "01444 250 350";
const COMPANY_EMAIL = "sales@nhmaintenance.com";
const COMPANY_REG = "Limited Company registered in England and Wales with number 08462490";
const COMPANY_VAT = "VAT number: 427637085";

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
let overrideCarriage, customCarriage;

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
    overrideCarriage = document.getElementById("overrideCarriage");
    customCarriage = document.getElementById("customCarriage");

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
    document.getElementById("toolTitle").textContent = "Repair Estimate Tool";
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
  document.getElementById("downloadPDF").addEventListener("click", () => generatePDF(buildQuoteData()));

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
  document.getElementById("overrideCarriage").addEventListener("change", () => {
    const input = document.getElementById("customCarriage");
    input.classList.toggle("hidden", !document.getElementById("overrideCarriage").checked);
    renderSalesQuote();
  });
  document.getElementById("customCarriage").addEventListener("input", () => {
    if (document.getElementById("overrideCarriage").checked) {
      renderSalesQuote();
    }
  });
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
  const tableBody = document.getElementById("quoteLines");
  const summaryBox = document.getElementById("quoteSummary");
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

  tableBody.innerHTML = "";
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
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><button class="remove-btn" title="Remove item" onclick="removeItem(${index})">\u2716</button> ${item.asset} ${item.model}</td>
      <td>${info.description || `${item.category} - ${item.repair}`}</td>
      <td>${info.part_number}</td>
      <td class="num">${item.qty}</td>
      <td class="num">${supplyOnly ? 'N/A' : `£${labour.toFixed(2)}`}</td>
      <td class="num">£${materials.toFixed(2)}</td>
      <td class="num">£${total.toFixed(2)}</td>`;
    tableBody.appendChild(row);
  });

  if (carriageCharge > 0) {
    subtotal += carriageCharge;
    const row = document.createElement('tr');
    row.innerHTML = `<td>Carriage</td><td></td><td></td><td></td><td></td><td></td><td class="num">£${carriageCharge.toFixed(2)}</td>`;
    tableBody.appendChild(row);
  }

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const grandTotal = subtotal + vat;

  summaryBox.innerHTML = `
    <h3>Quote Summary</h3>
    <div class="summary-row"><span>Items</span><span>${items.length}</span></div>
    <div class="summary-row"><span>Subtotal</span><span>£${subtotal.toFixed(2)}</span></div>
    <div class="summary-row"><span>VAT</span><span>£${vat.toFixed(2)}</span></div>
    <div class="summary-row total"><span>Total</span><span>£${grandTotal.toFixed(2)}</span></div>
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


function buildQuoteData() {
  const customerName = document.getElementById("customerName").value || "";
  const customerPhone = document.getElementById("customerPhone").value || "";
  const customerEmail = document.getElementById("customerEmail").value || "";
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;
  const overrideLabour = document.getElementById("overrideLabour").checked;
  const customLabour = parseFloat(document.getElementById("customLabour").value);
  let items = [];
  let labourSubtotal = 0;
  quoteItems.forEach(q => {
    const info = data[q.asset][q.make][q.model][q.variant][q.category][q.repair];
    if (info.part_number && info.part_number.startsWith("EQ")) return;
    const hours = parseFloat(q.labourHours);
    const labourPerItem = isNaN(hours) ? 0 : hours * LABOUR_RATE;
    let labour = supplyOnly ? 0 : labourPerItem * q.qty;
    labourSubtotal += labour;
    const materials = info.material_cost * q.qty;
    items.push({
      asset: `${q.asset} ${q.model}`,
      model: info.description || `${q.category} - ${q.repair}`,
      part: info.part_number,
      qty: q.qty,
      labour,
      materials,
      total: labour + materials
    });
  });
  if (!supplyOnly && items.length > 0) {
    if (overrideLabour && !isNaN(customLabour)) {
      const diff = customLabour - labourSubtotal;
      items[0].labour += diff;
      items[0].total += diff;
      labourSubtotal = customLabour;
    } else if (labourSubtotal < minLabourCost) {
      const diff = minLabourCost - labourSubtotal;
      items[0].labour += diff;
      items[0].total += diff;
      labourSubtotal = minLabourCost;
    }
  }
  let subtotal = items.reduce((s, it) => s + it.total, 0);
  const carriageCharge = supplyOnly && items.length > 0 ? CARRIAGE_CHARGE : 0;
  if (carriageCharge) {
    subtotal += carriageCharge;
    items.push({ asset: "Carriage", model: "", part: "", qty: "", labour: 0, materials: 0, total: carriageCharge });
  }
  const vat = vatExempt ? 0 : subtotal * 0.2;
  const total = subtotal + vat;
  return { customerName, customerPhone, customerEmail, items, subtotal, vat, total };
}

async function generatePDF(quoteData) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const img = new Image();
  img.src = 'nhm-logo.png';
  try { await img.decode(); } catch(e) {}
  doc.addImage(img, 'PNG', 10, 10, 30, 30);

  // services tile left of company info
  const serviceLines = [
    { text: 'Medical Equipment:', header: true },
    { text: 'Sales' },
    { text: 'Service' },
    { text: 'Spares and repairs' },
    { text: 'Consultancy and technical support' },
    { text: 'Contract hire and loan' },
    { text: 'Storage' }
  ];
  const serviceWidths = serviceLines.map(l => {
    const base = doc.getTextWidth(l.text);
    return l.header ? base : doc.getTextWidth('+ ') + base;
  });
  const serviceWidth = Math.max(...serviceWidths) + 4;
  let serviceX; // positioned once infoX is known

  // company info tile on the right - width adjusts to longest line
  const pageWidth = doc.internal.pageSize.getWidth();
  const infoLines = [
    COMPANY_NAME,
    ...COMPANY_ADDRESS.split(', '),
    `T: ${COMPANY_CONTACT}`,
    `E: ${COMPANY_EMAIL}`
  ];
  const infoLineHeight = 4;
  const infoWidth = Math.max(...infoLines.map(l => doc.getTextWidth(l))) + 4;
  const infoX = pageWidth - infoWidth - 10;
  const infoHeight = infoLines.length * infoLineHeight + 4;

  // line height for services adjusted so bottom aligns with company info tile
  const serviceLineHeight = (infoHeight - 4) / serviceLines.length;
  const serviceHeight = serviceLines.length * serviceLineHeight + 4;

  // draw services tile now that we know infoX
  serviceX = Math.max(45, infoX - serviceWidth - 5);
  doc.setFillColor(255);
  doc.rect(serviceX, 10, serviceWidth, serviceHeight, 'F');
  doc.setFontSize(9);
  let sy = 12;
  serviceLines.forEach(l => {
    doc.setFont(undefined, l.header ? 'bold' : 'normal');
    if (l.header) {
      doc.setTextColor(...BRAND_BLUE);
      doc.text(l.text, serviceX + 2, sy);
    } else {
      doc.setTextColor(...ACCENT_ORANGE);
      doc.text('+', serviceX + 2, sy);
      doc.setTextColor(...BRAND_BLUE);
      doc.text(l.text, serviceX + 4 + doc.getTextWidth('+'), sy);
    }
    sy += serviceLineHeight;
  });
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0,0,0);
  doc.setFillColor(255);
  doc.rect(infoX, 10, infoWidth, infoHeight, 'F');
  doc.setFontSize(9);
  let tY = 12;
  infoLines.forEach((line, idx) => {
    const x = infoX + infoWidth - 2;
    if (idx === infoLines.length - 2) { // phone line
      const val = COMPANY_CONTACT;
      const valWidth = doc.getTextWidth(val);
      doc.setTextColor(...ACCENT_ORANGE);
      doc.text('T:', x - valWidth - doc.getTextWidth('T: ') , tY);
      doc.setTextColor(...BRAND_BLUE);
      doc.text(val, x, tY, { align: 'right' });
    } else if (idx === infoLines.length - 1) { // email line
      const val = COMPANY_EMAIL;
      const valWidth = doc.getTextWidth(val);
      doc.setTextColor(...ACCENT_ORANGE);
      doc.text('E:', x - valWidth - doc.getTextWidth('E: ') , tY);
      doc.setTextColor(...BRAND_BLUE);
      doc.text(val, x, tY, { align: 'right' });
    } else {
      doc.setTextColor(...BRAND_BLUE);
      doc.text(line, x, tY, { align: 'right' });
    }
    tY += infoLineHeight;
  });
  doc.setTextColor(0,0,0);

  const tileBottom = Math.max(10 + infoHeight, 10 + serviceHeight);
  let y = Math.max(45, tileBottom + 5);
  const estimateNumber = `E${Date.now().toString().slice(-6)}`;
  const today = new Date().toLocaleDateString('en-GB');
  const headerLines = [
    `Estimate Number: ${estimateNumber}`,
    `Date: ${today}`,
    `Customer: ${quoteData.customerName}`,
    `Phone: ${quoteData.customerPhone}`,
    `Email: ${quoteData.customerEmail}`
  ];
  const headerHeight = headerLines.length * 6 + 14;
  doc.setFillColor(255);
  doc.rect(10, y, 190, headerHeight, 'F');
  doc.setFontSize(14);
  doc.setTextColor(...BRAND_BLUE);
  doc.setFont(undefined, 'bold');
  doc.text('Repair Estimate', 12, y + 8);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0,0,0);
  let hy = y + 14;
  headerLines.forEach(line => {
    doc.text(line, 12, hy);
    hy += 6;
  });
  y += headerHeight + 6;

  // table of items using autotable for dynamic heights
  const body = quoteData.items.map(it => [it.asset, it.model, it.part,
    `£${it.labour.toFixed(2)}`, `£${it.materials.toFixed(2)}`, `£${it.total.toFixed(2)}`]);
  doc.autoTable({
    head: [['Model', 'Service', 'Part#', 'Labour', 'Materials', 'Total']],
    body,
    startY: y,
    styles: { lineColor: [150,150,150], lineWidth: 0.1, fontSize: 11 },
    headStyles: { fillColor: BRAND_BLUE, textColor: 255, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { textColor: 0 },
    margin: { left: 12, right: 10 },
    tableWidth: 188
  });

  y = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(12);
  doc.text('Subtotal:', 150, y);
  doc.text(`£${quoteData.subtotal.toFixed(2)}`, 200, y, { align: 'right' });
  y += 6;
  doc.text('VAT:', 150, y);
  doc.text(`£${quoteData.vat.toFixed(2)}`, 200, y, { align: 'right' });
  y += 6;
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...BRAND_BLUE);
  doc.text('Total:', 150, y);
  doc.text(`£${quoteData.total.toFixed(2)}`, 200, y, { align: 'right' });
  doc.setTextColor(0,0,0);
  doc.setFont(undefined, 'normal');

  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 15;

  const disclaimer =
    'This quotation is provided as a good-faith estimate for the repair of equipment and reflects approximately 95% of the anticipated total cost. Please note that this estimate is subject to change upon further inspection, parts availability, and during the formal approval process. No work will be carried out without your full knowledge and explicit approval of any changes to cost or scope. This estimate is not a final invoice and does not constitute a binding agreement until formally accepted.';
  const discLines = doc.splitTextToSize(disclaimer, pageWidth - 10);
  const discHeight = discLines.length * 5 + 5;
  let discY = footerY - discHeight - 2;
  doc.setFontSize(10);
  doc.setTextColor(...BRAND_BLUE);
  doc.setFont(undefined, 'bold');
  doc.text('Disclaimer:', pageWidth / 2, discY, { align: 'center' });
  doc.setFont(undefined, 'normal');
  doc.text(discLines, 5, discY + 5);

  doc.setFontSize(8);
  const centerX = doc.internal.pageSize.getWidth() / 2;
  const footerSegments = [
    { text: `${COMPANY_NAME} | ${COMPANY_ADDRESS} | `, color: BRAND_BLUE },
    { text: COMPANY_CONTACT, color: ACCENT_ORANGE },
    { text: ' | ', color: BRAND_BLUE },
    { text: COMPANY_EMAIL, color: ACCENT_ORANGE }
  ];
  const totalWidth = footerSegments.reduce((w, s) => w + doc.getTextWidth(s.text), 0);
  let fx = centerX - totalWidth / 2;
  footerSegments.forEach(seg => {
    doc.setTextColor(...seg.color);
    doc.text(seg.text, fx, footerY);
    fx += doc.getTextWidth(seg.text);
  });
  doc.setTextColor(...BRAND_BLUE);
  doc.text(`${COMPANY_REG} ${COMPANY_VAT}`, centerX, footerY + 5, { align: 'center' });

  doc.save(`NHM_Estimate_${estimateNumber}.pdf`);
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

  const carriage = overrideCarriage.checked ? parseFloat(customCarriage.value) || 0 : SALES_CARRIAGE;
  subtotal += carriage;
  if (salesItems.length > 0) {
    lines.innerHTML += `
      <div class="quote-line">
        <p><strong class="label">Carriage</strong><strong class="value">£${carriage.toFixed(2)}</strong></p>
      </div>
    `;
  }

  const vat = vatExempt ? 0 : subtotal * 0.2;
  const grandTotal = subtotal + vat;

  estimate.innerHTML = `
    <h3>Quote Summary</h3>
    <div class="summary-row"><span>Items</span><span>${salesItems.length}</span></div>
    <div class="summary-row"><span>Subtotal</span><span>£${subtotal.toFixed(2)}</span></div>
    <div class="summary-row"><span>VAT${vatExempt ? " (Exempt)" : ""}</span><span>£${vat.toFixed(2)}</span></div>
    <div class="summary-row total"><span>Total</span><span>£${grandTotal.toFixed(2)}</span></div>
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
  doc.setFont("helvetica", "normal");

  const img = new Image();
  img.src = 'nhm-logo.png';
  try { await img.decode(); } catch(e) {}
  doc.addImage(img, 'PNG', 10, 10, 30, 30);

  // services list under logo
  const services = [
    'Medical Equipment:',
    'Sales',
    'Service',
    'Spares and repairs',
    'Consultancy and technical support',
    'Contract hire and loan',
    'Storage'
  ];
  doc.setFontSize(9);
  doc.setTextColor(...BRAND_BLUE);
  let x = 45;
  let y = 12;
  services.forEach(line => { doc.text(line, x, y); y += 4; });

  // company info tile aligned right
  const infoX = 110;
  const infoWidth = 90;
  const infoLines = [
    COMPANY_NAME,
    ...COMPANY_ADDRESS.split(', '),
    COMPANY_CONTACT,
    COMPANY_EMAIL
  ];
  const infoLineHeight = 4;
  const infoHeight = infoLines.length * infoLineHeight + 4;
  doc.setFillColor(255);
  doc.rect(infoX, 10, infoWidth, infoHeight, 'F');
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  let tY = 12;
  infoLines.forEach(line => {
    doc.text(line, infoX + 2, tY);
    tY += infoLineHeight;
  });
  doc.setFont(undefined, 'normal');
  y = Math.max(y, tY) + 4;

  let quoteNo = document.getElementById('salesQuoteNumber').value.trim();
  if (!quoteNo) {
    const now = new Date();
    quoteNo = 'Q' +
      now.getFullYear().toString().slice(-2) +
      String(now.getMonth()+1).padStart(2,'0') +
      String(now.getDate()).padStart(2,'0') +
      String(now.getHours()).padStart(2,'0') +
      String(now.getMinutes()).padStart(2,'0') +
      String(now.getSeconds()).padStart(2,'0');
    document.getElementById('salesQuoteNumber').value = quoteNo;
  }

  doc.setFontSize(14);
  doc.setTextColor(...BRAND_BLUE);
  doc.text(`Quotation: ${quoteNo}`, 10, y);
  y += 8;

  function sectionHeader(title) {
    doc.setFillColor(255);
    doc.setTextColor(0,0,0);
    doc.setFont(undefined, 'bold');
    doc.rect(10, y, 190, 7, 'F');
    doc.text(title, 12, y + 5);
    doc.setFont(undefined, 'normal');
    y += 9;
  }

  sectionHeader('Customer Details');
  doc.setFontSize(10);
  const custName = document.getElementById('salesCustomerName').value || '';
  const address = document.getElementById('salesCustomerAddress').value || '';
  const custLines = [custName, ...address.split(/\n/)].filter(l => l);
  custLines.forEach(line => { doc.text(line, 12, y); y += 5; });

  sectionHeader('Quotation Details');
  const today = new Date().toLocaleDateString('en-GB');
  const preparedBy = document.getElementById('salesPreparedBy').value || '';
  doc.text(`Date: ${today}`, 12, y);
  doc.text(`Prepared by: ${preparedBy}`, 100, y);
  y += 7;

  sectionHeader('Job Description / Notes');
  const notes = document.getElementById('salesNotes').value || '';
  notes.split(/\n/).forEach(line => { doc.text(line, 12, y); y += 5; });

  sectionHeader('Quotation Lines');
  const vatExempt = document.getElementById('vatExemptSales').checked;
  const carriage = overrideCarriage.checked ? parseFloat(customCarriage.value) || 0 : SALES_CARRIAGE;
  let subtotal = 0;
  const body = [];
  salesItems.forEach(item => {
    let sell = item.price;
    if (item.setupSelected) sell += item.setupCost;
    if (item.commissionSelected) sell += item.commissionCost;
    const total = sell * item.qty;
    subtotal += total;
    body.push([item.desc, `£${sell.toFixed(2)}`, `£${total.toFixed(2)}`]);
  });
  subtotal += carriage;
  if (salesItems.length > 0) {
    body.push(['Carriage', '', `£${carriage.toFixed(2)}`]);
  }

  doc.autoTable({
    head: [['Description', 'Sell', 'Total (Ex VAT)']],
    body,
    startY: y,
    styles: { lineColor: [150,150,150], lineWidth: 0.1 },
    headStyles: { fillColor: 255, textColor: 0, fontStyle: 'bold', halign: 'center' },
    margin: { left: 10, right: 10 },
    tableWidth: 190
  });

  y = doc.lastAutoTable.finalY + 6;
  const vat = vatExempt ? 0 : subtotal * 0.2;
  const grandTotal = subtotal + vat;

  doc.autoTable({
    body: [
      ['Total Excluding VAT:', `£${subtotal.toFixed(2)}`],
      ['VAT Amount:', `£${vat.toFixed(2)}`],
      ['Grand Total:', `£${grandTotal.toFixed(2)}`]
    ],
    startY: y,
    theme: 'plain',
    styles: { lineColor: [150,150,150], lineWidth: 0.1 },
    columnStyles: { 0: { halign: 'right' }, 1: { halign: 'right' } },
    margin: { left: 120, right: 10 }
  });

  y = doc.lastAutoTable.finalY + 6;
  doc.setFontSize(9);
  if (vatExempt) {
    doc.text('VAT Exempt sale', 10, y);
    y += 4;
  }

  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 15;

  const disclaimer =
    'This quotation is provided as a good-faith estimate for the repair of equipment and reflects approximately 95% of the anticipated total cost. Please note that this estimate is subject to change upon further inspection, parts availability, and during the formal approval process. No work will be carried out without your full knowledge and explicit approval of any changes to cost or scope. This estimate is not a final invoice and does not constitute a binding agreement until formally accepted.';
  const pageWidth = doc.internal.pageSize.getWidth();
  const discLines = doc.splitTextToSize(disclaimer, pageWidth - 10);
  const discHeight = discLines.length * 5 + 5;
  let discY = footerY - discHeight - 2;
  doc.setFontSize(10);
  doc.setTextColor(...BRAND_BLUE);
  doc.setFont(undefined, 'bold');
  doc.text('Disclaimer:', pageWidth / 2, discY, { align: 'center' });
  doc.setFont(undefined, 'normal');
  doc.text(discLines, 5, discY + 5);

  doc.setFontSize(8);
  const centerX = doc.internal.pageSize.getWidth() / 2;
  const footerSegments = [
    { text: `${COMPANY_NAME} | ${COMPANY_ADDRESS} | `, color: BRAND_BLUE },
    { text: COMPANY_CONTACT, color: ACCENT_ORANGE },
    { text: ' | ', color: BRAND_BLUE },
    { text: COMPANY_EMAIL, color: ACCENT_ORANGE }
  ];
  const totalWidth = footerSegments.reduce((w, s) => w + doc.getTextWidth(s.text), 0);
  let fx = centerX - totalWidth / 2;
  footerSegments.forEach(seg => {
    doc.setTextColor(...seg.color);
    doc.text(seg.text, fx, footerY);
    fx += doc.getTextWidth(seg.text);
  });
  doc.setTextColor(...BRAND_BLUE);
  doc.text('Limited Company registered in England and Wales with number 08462490 VAT number: 427637085', centerX, footerY + 5, { align: 'center' });

  doc.save(`NHM_Sales_Quote_${quoteNo}.pdf`);
}

