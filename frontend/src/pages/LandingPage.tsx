import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Features from '../components/Features'
import Algorithms from '../components/Algorithms'
import Demo from '../components/Demo'
import Comparison from '../components/Comparison'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        <Stats />
        <Features />
        <Algorithms />
        <Demo />
        <Comparison />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
