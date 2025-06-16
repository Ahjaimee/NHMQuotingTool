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
- Added repair options for Parker Rise & Tilt baths and Casa Classic FS beds
  while removing the placeholder Oxford Midi hoist entries.
- Repair quotes now include an optional work description and a disclaimer that
  the estimate is typically 95% accurate and subject to final approval before
  any work is carried out.
- When a work description is provided, the on-page quote now displays it in a
  dedicated "Description of work(s)" box above the line items.
- PDFs now show this description in a matching box when text is entered.
