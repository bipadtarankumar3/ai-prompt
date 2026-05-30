'use client';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Transformation from './components/Transformation';
import HowItWorks from './components/HowItWorks';
import FeatureGrid from './components/FeatureGrid';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import SeoHeader from './components/SeoHeader';

export default function Home() {
  return (
    <main>
      <SeoHeader pageKey="home" />
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Problem Section */}
      <Problem />

      {/* Solution Section (Transformation Before/After) */}
      <Transformation />

      {/* How It Works */}
      <HowItWorks />

      {/* Features Section */}
      <FeatureGrid />

      {/* Testimonials (Social Proof) */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA Banner */}
      <FinalCta />

      <Footer />
    </main>
  );
}
