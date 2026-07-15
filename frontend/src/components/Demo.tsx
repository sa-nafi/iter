import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export default function Demo() {
  return (
    <section id="demo" className="py-24 bg-zinc-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-zinc-800/50 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-zinc-800/50 blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-3xl p-8 md:p-12 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
            >
              Ready to see it in action?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-zinc-400"
            >
              Try our interactive playground directly in your browser. No installation or configuration required.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-zinc-900 rounded-2xl font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-5 h-5 fill-current" />
                Launch Playground
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
