import { motion } from 'framer-motion'
import { Hash, Network, Maximize2 } from 'lucide-react'

const categories = [
  {
    title: 'Root Finding',
    description: 'Algorithms designed to find the zeroes of continuous functions.',
    icon: Hash,
    algorithms: ['Bisection Method', 'False Position Method', 'Newton-Raphson Method']
  },
  {
    title: 'Linear Systems',
    description: 'Iterative and direct methods for solving systems of linear equations.',
    icon: Network,
    algorithms: ['Jacobi Method', 'Gauss-Seidel Method', 'Gaussian Elimination']
  },
  {
    title: 'Interpolation',
    description: 'Techniques for constructing new data points within the range of a discrete set of known data points.',
    icon: Maximize2,
    algorithms: ['Newton Forward', 'Newton Backward', 'Lagrange Interpolation']
  }
]

export default function Algorithms() {
  return (
    <section id="algorithms" className="py-24 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight"
            >
              Supported Algorithms
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-zinc-600"
            >
              A growing library of numerical methods, each accompanied by interactive visualizations and detailed theoretical breakdowns.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors flex items-center gap-1 shrink-0"
          >
            View Full Library &rarr;
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col bg-zinc-50 rounded-2xl p-8 border border-zinc-200/60"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-zinc-100">
                    <Icon className="w-6 h-6 text-zinc-900" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900">{category.title}</h3>
                </div>
                <p className="text-sm text-zinc-500 mb-8 flex-1">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.algorithms.map((algo, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-zinc-200 text-zinc-700 shadow-sm"
                    >
                      {algo}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
