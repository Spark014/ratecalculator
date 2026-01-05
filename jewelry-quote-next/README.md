# Jewelry Quote (Next.js Version)

This is a Next.js port of the Jewelry Quote calculator.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features

-   **Quote Calculator:** Main interface at `/`.
-   **Test Page:** Automated regression tests at `/test`.
-   **Data Persistence:** Saves state to `localStorage` (compatible with the vanilla JS version).

## Project Structure

-   `src/app`: App Router pages (`page.tsx`, `test/page.tsx`).
-   `src/components`: React components (`QuoteCalculator`, `StoneRow`, etc.).
-   `src/hooks`: Custom hooks (`useQuote`).
-   `src/lib`: Core logic and types (`catalog.ts`, `calculations.ts`, `types.ts`).
