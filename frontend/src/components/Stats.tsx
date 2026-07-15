import { motion } from 'framer-motion'

const stats = [
  { value: '10+', label: 'Algorithms' },
  { value: 'Real-Time', label: 'Visualization' },
  { value: 'Step-by-Step', label: 'Execution' },
  { value: 'Built for', label: 'Students & Teachers' },
]

export default function Stats() {
  return (
    <section className="py-12 bg-white border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-zinc-100">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col items-center justify-center text-center ${index !== 0 ? 'pl-8' : ''}`}
            >
              <div className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 text-sm md:text-base font-medium text-zinc-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
