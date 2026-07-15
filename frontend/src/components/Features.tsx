import { motion } from 'framer-motion'
import { Activity, Calculator, Grid, ListOrdered, TrendingUp, Compass, Target, Download } from 'lucide-react'

const features = [
  { name: 'Interactive Visualizations', icon: Activity, description: 'See algorithms come to life with real-time graphing and dynamic geometric interpretations.' },
  { name: 'Root Finding Methods', icon: Target, description: 'Explore Bisection, Newton-Raphson, and Secant methods with visual convergence paths.' },
  { name: 'Matrix Solvers', icon: Grid, description: 'Solve linear systems using Jacobi, Gauss-Seidel, and Gaussian Elimination algorithms.' },
  { name: 'Iteration Tracking', icon: ListOrdered, description: 'Monitor step-by-step changes in variables with detailed iteration tables.' },
  { name: 'Numerical Integration', icon: Calculator, description: 'Understand trapezoidal and Simpson’s rules with shaded area visualizations.' },
  { name: 'Interpolation Techniques', icon: Compass, description: 'Fit curves to data points using Newton Forward, Backward, and Lagrange polynomials.' },
  { name: 'Convergence Analysis', icon: TrendingUp, description: 'Analyze error reduction and convergence rates with interactive plotting tools.' },
  { name: 'Export Results', icon: Download, description: 'Download iteration data, generated plots, and analysis reports in CSV or PDF formats.' },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-zinc-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight"
          >
            Powerful tools for numerical analysis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-600"
          >
            Everything you need to build a strong intuition for numerical methods, neatly packaged in a modern interface.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-300 group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-6 group-hover:bg-zinc-900 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{feature.name}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
