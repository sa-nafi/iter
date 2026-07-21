import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'

const traditional = [
  'Static formulas on paper',
  'Manual, error-prone calculations',
  'Difficult to track iteration states',
  'Limited geometric intuition',
  'Hard to visualize convergence'
]

const iter = [
  'Interactive dynamic visualizations',
  'Real-time execution & recalculation',
  'Step-by-step state tracking',
  'Clear geometric & algebraic intuition',
  'Visual convergence analysis'
]

export default function Comparison() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight"
          >
            Why use Iter?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-600"
          >
            A paradigm shift in how numerical methods are taught and understood.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 md:p-10"
          >
            <h3 className="text-xl font-semibold text-zinc-900 mb-6">Traditional Learning</h3>
            <ul className="space-y-4">
              {traditional.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-red-100 p-1 rounded-full shrink-0">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-zinc-600">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Iter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl shadow-zinc-900/20"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              Iter Platform <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full ml-2 font-medium">New</span>
            </h3>
            <ul className="space-y-4">
              {iter.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-emerald-500/20 p-1 rounded-full shrink-0">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-zinc-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
