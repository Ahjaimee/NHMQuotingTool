# NHMQuotingTool
Tool for estimating repair and sales quotes for mobility equipment.

### Recent Updates
- Styled the sales quote buttons to match the repair tab.
- PDFs now include a short footer message and slightly larger text for a cleaner look.
- Sales quotes now support entering our cost, setting a profit margin and automatically
  calculating the customer price.
- When a sales item is chosen its configured cost and default selling price are loaded
  automatically. The tool calculates the profit margin between those values and shows
  it in an editable field so the margin or final price can be adjusted on the fly.
- Cost on sales items is now read-only and the customer price fields and quote output
  explicitly show values excluding VAT.
- Labour rate is £15.25 per 0.5 hours with a £74.75 minimum labour charge per
  quote. The page now displays this requirement instead of listing it on quotes.
- The repair and sales forms now include a "Category" dropdown between the
  variant and item fields. Categories depend on the selected asset type. Existing
  demo data was replaced with a single Bath example using these categories.
- Repair quotes now include an optional work description and a disclaimer that
  the estimate is typically 95% accurate and subject to final approval before
  any work is carried out.
- When a work description is provided, the on-page quote now displays it in a
  dedicated "Description of work(s)" box above the line items.
- PDFs now show this description in a matching box when text is entered.
- PDF exports redesigned with boxed sections and clearer disclaimers at the bottom.
- Added an option to override the default £74.75 minimum labour charge when
  preparing a repair quote.
- Repair dropdown now shows equipment sales parts in grey with an
  "Equipment Sales" tag.
- Added data for Savaria Monarch Portable Overhead Hoist in both repair and sales sections.
- Added asset data for Drive DeVilbiss Casa/Classic FS beds.
- Added asset data for Drive DeVilbiss Sidhill Bradshaw beds.
- Asset data is now loaded from a separate `data.json` file for easier updates.
- Republished new site
