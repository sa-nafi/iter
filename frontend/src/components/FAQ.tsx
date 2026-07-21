import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from './ui/utils'

const faqs = [
  {
    question: "What algorithms are supported?",
    answer: "We currently support root finding methods (Bisection, False Position, Newton-Raphson), linear system solvers (Jacobi, Gauss-Seidel, Gaussian Elimination), and interpolation techniques (Newton Forward/Backward, Lagrange). We are continuously adding more."
  },
  {
    question: "Is the platform free?",
    answer: "Iter is completely free for individual students and educators. We also offer a premium tier for institutions that require advanced LMS integrations and dedicated support."
  },
  {
    question: "Can teachers use it in classrooms?",
    answer: "Absolutely. Iter is designed with educators in mind. You can use it during live lectures to demonstrate convergence, or assign interactive exercises to students."
  },
  {
    question: "Can I export results?",
    answer: "Yes, you can export iteration tables as CSV files, and download generated plots and visualizations as high-quality PNGs or PDFs for use in your assignments or research papers."
  },
  {
    question: "Is the application mobile-friendly?",
    answer: "While the best experience for complex visualizations is on a desktop or tablet, our interface is fully responsive and allows you to run algorithms and view results on your smartphone."
  },
  {
    question: "Are visualizations interactive?",
    answer: "Yes. You can pan, zoom, and hover over data points on our graphs. You can also step through algorithms one iteration at a time to see exactly how the state changes geometrically."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn(
                  "border rounded-2xl overflow-hidden transition-colors duration-300",
                  isOpen ? "border-zinc-300 bg-zinc-50" : "border-zinc-200 bg-white hover:border-zinc-300"
                )}
              >
                <button
                  onClick={() => toggleOpen(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-zinc-900">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-zinc-500 transition-transform duration-300",
                      isOpen ? "rotate-180" : ""
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-zinc-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
