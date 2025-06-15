const data = {
  "Mobile Hoist": {
    "Oxford Midi 180": {
      "Replacement Battery": { labour_hours: 0.5, material_cost: 85.0, part_number: "OXBATT180" },
      "Handset Replacement": { labour_hours: 0.75, material_cost: 65.0, part_number: "OXHAND180" }
    }
  }
};

// Fixed carriage charge applied to all sales quotes
const SALES_CARRIAGE = 15.95;
const salesData = {
  "Hoist": {
    "Oxford Major 190": 799.99,
    "Liko M220": 699.99
  },
  "Wheelchair": {
    "Meyra iChair": 1500.0,
    "Invacare TDX": 1200.0
  }
};

let quoteItems = [];
let salesItems = [];

// Base carriage charge applied once per quote when "Supply Only" is selected
const CARRIAGE_CHARGE = 15.95;
let assetChoices, makeChoices, repairChoices;
let salesAssetChoices, salesMakeChoices;

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
    placeholderValue: 'Select Make/Model',
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
    document.getElementById("toolTitle").textContent = "Sales Quote";
    document.getElementById("quoteForm").classList.add("hidden");
    document.getElementById("quoteSection").classList.add("hidden");
    document.getElementById("salesForm").classList.remove("hidden");
    document.getElementById("salesQuoteSection").classList.add("hidden");
  });

  document.getElementById("assetSelect").addEventListener("change", () => {
    makeChoices.clearStore();
    repairChoices.clearStore();
    populateMakes();
    document.getElementById("makeSection").classList.remove("hidden");
    document.getElementById("repairSection").classList.add("hidden");
  });

  document.getElementById("makeSelect").addEventListener("change", () => {
    repairChoices.clearStore();
    populateRepairs();
    document.getElementById("repairSection").classList.remove("hidden");
  });

  document.getElementById("salesAssetSelect").addEventListener("change", () => {
    salesMakeChoices.clearStore();
    populateSalesMakes();
    document.getElementById("salesMakeSection").classList.remove("hidden");
  });

  document.getElementById("salesMakeSelect").addEventListener("change", () => {
    const asset = document.getElementById("salesAssetSelect").value;
    const make = document.getElementById("salesMakeSelect").value;
    document.getElementById("salesDesc").value = `${asset} - ${make}`;
  });

  document.getElementById("addItem").addEventListener("click", () => {
    const asset = document.getElementById("assetSelect").value;
    const make = document.getElementById("makeSelect").value;
    const repair = document.getElementById("repairSelect").value;

    if (!asset || asset === "Select Asset" || !make || make === "Select Make/Model" || !repair || repair === "Select Repair") return;

    quoteItems.push({ asset, make, repair });
    renderQuote();
    document.getElementById("quoteSection").classList.remove("hidden");
    document.getElementById("downloadPDF").classList.remove("hidden");
    resetRepairFields();
  });

  document.getElementById("supplyOnly").addEventListener("change", renderQuote);
  document.getElementById("vatExempt").addEventListener("change", renderQuote);
  document.getElementById("downloadPDF").addEventListener("click", generatePDF);

  document.getElementById("addSalesItem").addEventListener("click", () => {
    const asset = document.getElementById("salesAssetSelect").value;
    const make = document.getElementById("salesMakeSelect").value;
    const descField = document.getElementById("salesDesc").value.trim();
    const price = salesData[asset]?.[make];
    const qty = parseInt(document.getElementById("salesQty").value, 10);
    if (!asset || !make || price === undefined || isNaN(qty)) return;
    const desc = descField || `${asset} - ${make}`;
    salesItems.push({ asset, make, desc, price, qty });
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
  select.innerHTML = `<option value="" disabled selected>Select Make/Model</option>` +
    makes.map(m => `<option value="${m}">${m}</option>`).join("");
  makeChoices = new Choices(select, {
    searchEnabled: true,
    shouldSort: false,
    placeholderValue: 'Select Make/Model',
    allowHTML: false
  });
}

function populateRepairs() {
  const asset = document.getElementById("assetSelect").value;
  const make = document.getElementById("makeSelect").value;
  const repairs = Object.keys(data[asset]?.[make] || {});
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
  document.getElementById("repairSection").classList.add("hidden");
  populateAssets();
  document.getElementById("makeSelect").innerHTML = "";
  document.getElementById("repairSelect").innerHTML = "";
  makeChoices.clearStore();
  repairChoices.clearStore();
}

function renderQuote() {
  const quoteLines = document.getElementById("quoteLines");
  const estimate = document.getElementById("estimate");
  const supplyOnly = document.getElementById("supplyOnly").checked;
  const vatExempt = document.getElementById("vatExempt").checked;

  quoteLines.innerHTML = "";
  let subtotal = 0;
  // Apply carriage only once per quote when "Supply Only" is selected
  const carriageCharge = supplyOnly && quoteItems.length > 0 ? CARRIAGE_CHARGE : 0;

  quoteItems.forEach((item, index) => {
    const info = data[item.asset][item.make][item.repair];
    const labour = supplyOnly ? 0 : info.labour_hours * 45;
    const total = labour + info.material_cost;
    subtotal += total;

    quoteLines.innerHTML += `
      <div class="quote-line">
        <p class="desc"><strong>${item.asset} → ${item.make} → ${item.repair}</strong></p>
        <p><span class="label">Part #:</span><span class="value">${info.part_number}</span></p>
        <p><span class="label">Labour:</span><span class="value">${supplyOnly ? 'N/A' : `£${labour.toFixed(2)}`}</span></p>
        <p><span class="label">Materials:</span><span class="value">£${info.material_cost.toFixed(2)}</span></p>
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
  const number = document.getElementById("quoteNumber").value || "(No #)";
  doc.setFontSize(11);
  let infoY = infoStartY;
  doc.text(`Quote #: ${number}`, 15, infoY);
  infoY += 6;
  doc.text(`Customer: ${name}`, 15, infoY);
  infoY += 6;
  // Always include contact fields so they appear on the PDF even when blank
  doc.text(`Phone: ${phone || "(N/A)"}`, 15, infoY);
  infoY += 6;
  doc.text(`Email: ${email || "(N/A)"}`, 15, infoY);
  infoY += 6;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, infoY);
  const tableStartY = infoY + 8;

  const rows = quoteItems.map(item => {
    const info = data[item.asset][item.make][item.repair];
    const supplyOnly = document.getElementById("supplyOnly").checked;
    const labour = supplyOnly ? 0 : info.labour_hours * 45;
    const total = labour + info.material_cost;
    return [
      `${item.asset} - ${item.make}`,
      item.repair,
      info.part_number,
      `£${labour.toFixed(2)}`,
      `£${info.material_cost.toFixed(2)}`,
      `£${total.toFixed(2)}`
    ];
  });

  const carriageCharge = document.getElementById("supplyOnly").checked && rows.length > 0 ? CARRIAGE_CHARGE : 0;
  if (carriageCharge > 0) {
    rows.push(["Carriage", "", "", "", "", `£${carriageCharge.toFixed(2)}`]);
  }

  doc.autoTable({
    startY: tableStartY,
    head: [["Asset", "Repair", "Part#", "Labour", "Materials", "Total"]],
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
      2: { halign: "center" }
    }
  });

  const subtotal = rows.reduce((sum, r) => sum + parseFloat(r[5].replace("£", "")), 0);
  const vat = document.getElementById("vatExempt").checked ? 0 : subtotal * 0.2;
  const total = subtotal + vat;
  const finalY = doc.lastAutoTable.finalY || 60;

  const rightMargin = pageWidth - 15;
  let sumY = finalY + 10;
  doc.setFontSize(11);
  doc.text(`Subtotal: £${subtotal.toFixed(2)}`, rightMargin, sumY, { align: "right" });
  sumY += 6;
  doc.text(`VAT: £${vat.toFixed(2)}`, rightMargin, sumY, { align: "right" });
  sumY += 6;
  doc.text(`Total: £${total.toFixed(2)}`, rightMargin, sumY, { align: "right" });

  const centreX = pageWidth / 2;
  doc.text(`Supply Only: ${document.getElementById("supplyOnly").checked ? "Yes" : "No"}`, centreX, finalY + 10, { align: "center" });
  doc.text(`VAT Exempt: ${document.getElementById("vatExempt").checked ? "Yes" : "No"}`, centreX, finalY + 16, { align: "center" });

  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.text("Thank you for choosing NHM. Please contact us with any questions.", centreX, footerY, { align: "center" });

  doc.save("NHM_Quote.pdf");
}

function renderSalesQuote() {
  const lines = document.getElementById("salesQuoteLines");
  const estimate = document.getElementById("salesEstimate");
  const vatExempt = document.getElementById("vatExemptSales").checked;

  lines.innerHTML = "";
  let subtotal = 0;

  salesItems.forEach((item, index) => {
    const total = item.price * item.qty;
    subtotal += total;
    lines.innerHTML += `
      <div class="quote-line">
        <p class="desc"><strong>${item.asset} → ${item.make}</strong></p>
        <p><span class="label">Price:</span><span class="value">£${item.price.toFixed(2)}</span></p>
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
  doc.text("Sales Quote", pageWidth / 2, 12, { align: "center" });
  doc.setTextColor(0, 0, 0);

  const infoStartY = 30;
  const name = document.getElementById("salesCustomerName").value || "(No name)";
  const email = document.getElementById("salesCustomerEmail").value || "";
  const phone = document.getElementById("salesCustomerPhone").value || "";
  const number = document.getElementById("salesQuoteNumber").value || "(No #)";
  doc.setFontSize(11);
  let infoY = infoStartY;
  doc.text(`Quote #: ${number}`, 15, infoY);
  infoY += 6;
  doc.text(`Customer: ${name}`, 15, infoY);
  infoY += 6;
  doc.text(`Phone: ${phone || "(N/A)"}`, 15, infoY);
  infoY += 6;
  doc.text(`Email: ${email || "(N/A)"}`, 15, infoY);
  infoY += 6;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, infoY);
  const tableStartY = infoY + 8;

  const rows = salesItems.map(item => [
    `${item.asset} - ${item.make}`,
    item.qty,
    `£${item.price.toFixed(2)}`,
    `£${(item.price * item.qty).toFixed(2)}`
  ]);

  if (rows.length > 0) {
    rows.push(["Carriage", "", "", `£${SALES_CARRIAGE.toFixed(2)}`]);
  }

  doc.autoTable({
    startY: tableStartY,
    head: [["Item", "Qty", "Price", "Total"]],
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

  const rightMargin = pageWidth - 15;
  let sumY = finalY + 10;
  doc.setFontSize(11);
  doc.text(`Subtotal: £${subtotal.toFixed(2)}`, rightMargin, sumY, { align: "right" });
  sumY += 6;
  doc.text(`VAT: £${vat.toFixed(2)}`, rightMargin, sumY, { align: "right" });
  sumY += 6;
  doc.text(`Total: £${total.toFixed(2)}`, rightMargin, sumY, { align: "right" });

  const centreX = pageWidth / 2;
  doc.text(`VAT Exempt: ${document.getElementById("vatExemptSales").checked ? "Yes" : "No"}`, centreX, finalY + 10, { align: "center" });

  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.text("Thank you for choosing NHM. Please contact us with any questions.", centreX, footerY, { align: "center" });

  doc.save("NHM_Sales_Quote.pdf");
}
