# Iter
**Interactive Mathematical Algorithms Visualizer**

Iter is a premium, modern platform designed to help students, teachers, and engineers learn and understand numerical methods. Through interactive visualizations, step-by-step execution, and convergence analysis, Iter provides a paradigm shift in how numerical methods are taught and understood.

## Features
- **Interactive Visualizations**: Real-time graphing and dynamic geometric interpretations.
- **Root Finding Methods**: Bisection, False Position, Newton-Raphson, and Secant methods.
- **Linear Systems**: Jacobi, Gauss-Seidel, and Gaussian Elimination algorithms.
- **Interpolation Techniques**: Newton Forward/Backward and Lagrange polynomials.
- **Iteration Tracking & Convergence**: Step-by-step state tracking and visual convergence analysis.

## Tech Stack
This project is built using a modern frontend ecosystem to ensure high performance and a premium SaaS aesthetic:
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Plotting**: Plotly.js (Lazy load this to avoid slow landing page load)
- **UI Components**: ShadCN/UI

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the local development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` to see the application in action.

### Production Build
To create a production-ready build:
```bash
npm run build
```
The optimized files will be generated in the `dist` folder.

## Design Philosophy
Iter uses a strict monochrome minimalist theme with a focus on typography (utilizing the Geist font), ample whitespace, smooth micro-animations, and glassmorphism effects to deliver an enterprise-grade user experience.
