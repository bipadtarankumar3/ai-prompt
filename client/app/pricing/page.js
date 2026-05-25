'use client';

import Navbar from '../components/Navbar';
import PricingCard from '../components/PricingCard';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-12">
        <PricingCard />
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
