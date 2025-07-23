import { useState } from 'react'
import HeroSection from './pages/HeroSection'
import './App.css'
import FeaturesSection from './pages/FeaturesSection'
import AboutSection from './components/AboutSection'
import TestimonialsSection from './components/TestimonialSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

function App() {

  return (
    <div className="">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default App
