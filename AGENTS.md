# Agent Instructions & Project Conventions

Welcome to the **Itera** codebase. If you are an AI Agent tasked with building new features, algorithms, or UI components, you **must strictly adhere** to the following rules and patterns to maintain the project's premium aesthetic and technical standards.

## 1. Design & UI Aesthetics
- **Theme**: We use a strict Vercel/Linear-inspired minimalist monochrome theme. Stick to `zinc-50` through `zinc-900`. Use white space generously.
- **Typography**: The project uses the `Geist` font family. Use `tracking-tight` on headings and keep body text highly legible.
- **Components**: The project uses `shadcn/ui`. For any new interactive elements (dropdowns, inputs, buttons, tables), use the pre-configured Shadcn components in `frontend/src/components/ui/` rather than building them from scratch.
- **Animations**: Use `framer-motion` for micro-animations and page transitions (e.g. `AnimatePresence` with `opacity` and `y` offsets).
- **Alignment & Structure**: Layouts often use a two-column structure (e.g., config on left, results on right). Ensure pixel-perfect alignment. Watch out for default paddings inside base components that can misalign elements.

## 2. Architecture & Code Splitting
- **Lazy Loading is Mandatory**: Algorithm pages (like `BisectionPage`) heavily depend on massive libraries (`plotly.js`, `mathjs`, `jspdf`). These pages **MUST** be lazily loaded in `App.tsx` using `React.lazy()`.
- **Suspense Strategy**: Place the `<Suspense>` boundary directly around the lazy element *inside* the `<Route element={...}>` prop (e.g., `element={<Suspense fallback={<PageLoader />}><LazyPage /></Suspense>}`). If you wrap the whole `<Routes>` in `<Suspense>`, React Router will freeze the UI via concurrent rendering transitions instead of showing the loading spinner.

## 3. Mathematical Operations (`mathjs`)
- **Evaluation**: Use `mathjs` to parse function strings. Evaluate them securely using `node.evaluate({ x })`.
- **Optimization**: Do not re-evaluate `f(x)` redundantly inside recursive loops. Cache the result and reuse it when bounds shift.
- **Safety**: When checking if a root exists between two bounds `a` and `b`, **NEVER** use `f(a) * f(b) < 0`. This will cause floating-point overflow to `Infinity` for large numbers and break the check. Always use `Math.sign(f(a)) !== Math.sign(f(b))`.

## 4. Graphing & Data Export
- **Plotly Integration**: When rendering `react-plotly.js` `<Plot />` components, if you need to export the graph, apply the `divId` prop directly to the `<Plot divId="my-plot" />`. Do **NOT** rely on a wrapper `div`'s ID, as `Plotly.downloadImage` strictly requires the DOM element managed directly by Plotly.
- **PDF Generation**: Use `jspdf` and `jspdf-autotable`. Use monospace fonts (`courier`) inside the tables so numerical outputs align perfectly.

## 5. Typescript & Imports
- **Type Imports**: The `tsconfig.json` enforces `verbatimModuleSyntax: true`. You must explicitly use `import type { TypeName } from '...'` when importing types/interfaces.
- **Aliases**: Use `@/` for absolute imports resolving to `src/` (e.g., `@/components/ui/button`).

Follow these guidelines faithfully, and the application will remain fast, beautiful, and stable!
