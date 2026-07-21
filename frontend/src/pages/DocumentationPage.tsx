import { ArrowLeft, Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-zinc-200 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6">
            Documentation
          </h1>
          <p className="text-lg text-zinc-600 mb-12 max-w-2xl">
            Learn how to use Iter to master numerical methods through interactive visualizations and step-by-step calculations.
          </p>

          <div className="space-y-16">

            {/* Section 1: How to use the app */}
            <section className="scroll-mt-24" id="getting-started">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-zinc-900 text-white rounded-lg">
                  <Calculator className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">How to Use the App</h2>
              </div>
              <div className="prose prose-zinc prose-lg max-w-none text-zinc-600 space-y-4">
                <p>
                  Iter is designed to be intuitive. To get started, navigate to the <strong>Algorithms</strong> page and select a method from the dropdown menu in the calculator view.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Function <span className="font-serif italic">f(x)</span></strong>: Enter your mathematical expression. You can use standard operators (`+`, `-`, `*`, `/`, `^`) and functions like `sin(x)` or `exp(x)`.</li>
                  <li><strong>Bounds (<span className="font-serif italic">x<sub>l</sub></span> and <span className="font-serif italic">x<sub>u</sub></span>)</strong>: These define the initial interval. Ensure that the root lies between them (i.e., <span className="font-serif italic">f(x<sub>l</sub>)</span> and <span className="font-serif italic">f(x<sub>u</sub>)</span> have opposite signs).</li>
                  <li><strong>Tolerance (<span className="font-serif italic">ε</span>)</strong>: The desired accuracy of your root. The algorithm will stop when the error drops below this value.</li>
                  <li><strong>Max Iterations</strong>: A safety limit to prevent infinite loops if the algorithm fails to converge.</li>
                </ul>
                <p>
                  Once you hit <strong>Calculate Root</strong>, you can switch between the <strong>Graph Analysis</strong>, <strong>Results</strong>, and <strong>History</strong> tabs on the sidebar to explore the algorithmic steps.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
