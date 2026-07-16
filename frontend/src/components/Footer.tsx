import { Code2, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">

          <div className="md:col-span-1 text-center md:text-left">
            <a href="#" className="text-xl font-bold tracking-tight text-zinc-900 inline-block mb-4">
              Itera<span className="text-zinc-400">.</span>
            </a>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto md:mx-0">
              An interactive platform for exploring numerical algorithms through real-time visualizations and step-by-step execution.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold text-zinc-900 mb-4 text-sm">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Features</a></li>
              <li><a href="#algorithms" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Algorithms</a></li>
              <li><a href="#faq" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold text-zinc-900 mb-4 text-sm">Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/docs" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Documentation</Link></li>
              <li><a href="https://numenlabs.tech/blog" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Blog</a></li>
              <li><a href="https://numenlabs.tech/" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">About Us</a></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold text-zinc-900 mb-4 text-sm">Connect</h4>
            <ul className="space-y-3">
              <li><a href="#contact" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Contact Us</a></li>
              <li><a href="https://github.com/sa-nafi" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors inline-flex items-center gap-2 justify-center md:justify-start w-full">
                <Code2 className="w-4 h-4" /> GitHub
              </a></li>
              <li><a href="https://linkedin.com/in/sa-nafi/" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors inline-flex items-center gap-2 justify-center md:justify-start w-full">
                <Globe className="w-4 h-4" /> LinkedIn
              </a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} Itera Platform. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
