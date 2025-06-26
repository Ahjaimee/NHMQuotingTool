# NHMQuotingTool
Simple tool for creating repair estimates and sales quotes for mobility equipment.

## Overview
Use the **Repair Estimate** tab when you need a price for fixing equipment. Use the
**Sales Order Quote** tab when selling new equipment. Enter the customer details,
pick the asset, and add any parts or items. The tool works out labour, materials,
carriage and VAT. When you're happy with the quote you can download it as a PDF.

### Repair quotes
* Labour is £15.25 for every half hour with a minimum charge of £74.75 per quote.
  You can override this if needed.
* Each quote shows a note saying it is about 95% accurate and must be approved
  before work starts.

### Sales quotes
* Prices shown exclude VAT unless you tick the **VAT Exempt** box.
* Sales items can include optional setup and commission charges if they are available.

## Recent Updates
* The sales tab now uses the same button style as the repair tab.
* PDF exports include a small footer message and use larger text so they are easier to read.
* When preparing a sales quote you can enter our cost and a profit margin; the tool
  calculates the customer price for you.
* Choosing a sales item fills in the cost and default price automatically and shows
  the profit margin so you can adjust it if required.
* Our cost field is read-only and prices on screen clearly show amounts without VAT.
* Labour is charged at £15.25 per half hour with a minimum of £74.75. This reminder
  now appears on the page.
* Both forms now include a **Category** dropdown after the variant field. Categories
  change based on the asset type. The sample data now focuses on one bath example.
* Repair quotes can include a short work description and a note that the estimate
  needs final approval.
* If you enter a work description it appears in its own box above the line items
  and in the PDF.
* PDF exports now have boxed sections and clearer notes at the bottom.
* You can override the default £74.75 minimum labour charge when preparing a repair quote.
* Repair dropdown lists show parts used for equipment sales in grey with an
  "Equipment Sales" tag.
* Added data for the Savaria Monarch Portable Overhead Hoist in both repair and sales lists.
* Added data for Drive DeVilbiss Casa/Classic FS beds.
* Added data for Drive DeVilbiss Sidhill Bradshaw beds.
* Item information now loads from a separate `data.json` file for easier updates.
* Site republished with the new changes.
* Sales items with part numbers starting with "EQ" now display optional Setup and
  Commission checkboxes so these charges can be added.
