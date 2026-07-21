import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Iter completely changed how I approach numerical analysis. Being able to step through the Newton-Raphson method and see the tangent line visually hit the x-axis made the math finally click for me.",
    author: "Alex Rivera",
    role: "Computer Science Student",
    initials: "AR"
  },
  {
    quote: "I use this platform in all my lectures now. It saves me from drawing inaccurate graphs on the whiteboard and instantly captures the students' attention. The convergence analysis tools are especially brilliant.",
    author: "Dr. Sarah Chen",
    role: "Mathematics Lecturer",
    initials: "SC"
  },
  {
    quote: "When solving complex linear systems for my structural analysis class, the matrix solver visualization helped me understand exactly where error propagation occurs. An invaluable tool.",
    author: "James Holden",
    role: "Engineering Student",
    initials: "JH"
  }
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight"
          >
            Trusted by academia
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col"
            >
              <Quote className="w-8 h-8 text-zinc-200 mb-6" />
              <p className="text-zinc-600 leading-relaxed mb-8 flex-1">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-900">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-zinc-900 text-sm">{testimonial.author}</div>
                  <div className="text-zinc-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
