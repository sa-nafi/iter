import { motion } from 'framer-motion'
import { ArrowRight, Activity, Table as TableIcon, LineChart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-100/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 leading-[1.1]">
                Visualize Numerical <br className="hidden md:block" />
                Methods Like <span className="text-zinc-400">Never Before</span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="mt-6 text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto lg:mx-0">
                An interactive platform for exploring numerical algorithms through real-time visualizations, convergence analysis, and step-by-step execution.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            >
              <Link to="/algorithms/bisection" className="flex items-center justify-center gap-2 bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg">
                Explore Algorithms
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/docs" className="flex items-center justify-center gap-2 bg-white text-zinc-900 border border-zinc-200 px-8 py-3.5 rounded-xl font-medium hover:bg-zinc-50 transition-all shadow-sm">
                View Documentation
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 w-full max-w-2xl lg:max-w-none perspective-1000"
          >
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 overflow-hidden transform hover:-translate-y-1 transition-transform duration-500">
              {/* Mockup Header */}
              <div className="bg-zinc-50 border-b border-zinc-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-300" />
                  <div className="w-3 h-3 rounded-full bg-zinc-300" />
                  <div className="w-3 h-3 rounded-full bg-zinc-300" />
                </div>
                <div className="mx-auto bg-white border border-zinc-200 rounded-md px-24 py-1 text-xs text-zinc-400">
                  Newton-Raphson Method
                </div>
              </div>
              
              {/* Mockup Body */}
              <div className="p-6 grid grid-cols-3 gap-4">
                {/* Graph Area */}
                <div className="col-span-3 sm:col-span-2 min-h-[12rem] bg-zinc-50 rounded-xl border border-zinc-100 p-4 relative overflow-hidden flex items-center justify-center">
                  <Activity className="w-8 h-8 text-zinc-300 absolute top-4 left-4" />
                  {/* Fake curve */}
                  <svg viewBox="0 0 100 50" className="w-full h-full stroke-zinc-900 stroke-2 fill-none stroke-[0.5]">
                    <path d="M 0 50 Q 30 20 50 25 T 100 0" />
                    {/* Tangent line */}
                    <line x1="30" y1="50" x2="60" y2="0" className="stroke-zinc-400 stroke-[0.5] stroke-dasharray-2" />
                    <circle cx="50" cy="25" r="1.5" className="fill-zinc-900" />
                  </svg>
                </div>
                
                {/* Stats / Controls */}
                <div className="col-span-3 sm:col-span-1 flex flex-col gap-4">
                  <div className="flex-1 bg-zinc-50 rounded-xl border border-zinc-100 p-4">
                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                      <LineChart className="w-4 h-4" />
                      <span className="text-xs font-medium">Error</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">0.0001</div>
                    <div className="text-xs text-zinc-500 mt-1">Tolerance met</div>
                  </div>
                  <div className="flex-1 bg-zinc-50 rounded-xl border border-zinc-100 p-4">
                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                      <TableIcon className="w-4 h-4" />
                      <span className="text-xs font-medium">Iteration</span>
                    </div>
                    <div className="text-2xl font-bold text-zinc-900">4</div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2">
                      <div className="bg-zinc-900 h-1.5 rounded-full w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
