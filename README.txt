# Jewelry Quote (Web Version)
===========================

**NEW:** A Next.js version is available in the `jewelry-quote-next` folder.

This is a pure front-end jewelry quote calculator tool.
How to Open:
1) Double-click `index.html` directly (works in most browsers)
2) Or use a local static server (Recommended, avoids some browser restrictions):
   - VSCode Live Server
   - Python: `python -m http.server 8000` then open `http://localhost:8000/`

File Description:
- index.html  Quote Calculator (Main Page)
- test.html   Online Test Page (Regression Testing/Sample Data)
- app.js      Calculation Logic + Price Catalog (CATALOG)
- style.css   Styles

To customize with your real business prices:
- Open `app.js`, edit `CATALOG.coloredGems` / `CATALOG.diamond.base` / `CATALOG.metals` / `CATALOG.treatments`
- If you have your own "Melee Diamond mm→ct conversion table", replace `CATALOG.meleeMmToCt`

Features:
- Multi-line Stones: Mix Main Stone/Side Stone (Colored Gems/Diamonds)
- Colored Gems: Type + Grade + Treatment Multiplier (Heated/No Heat/Filled, etc.)
- Diamonds: Simplified 4C Auto Price (carat bracket + color + clarity) + Cut/Fluorescence Multiplier
- Side Stones: Diameter(mm) × Quantity auto-estimates ct (Common for round melee diamonds)
- Metal: Material + Weight + Loss Rate + Extra Fee; Supports Auto/Manual Price per Gram
- Labor/Packaging/Profit/Tax; Copy Quote to Clipboard
