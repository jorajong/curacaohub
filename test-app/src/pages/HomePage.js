import React from 'react';
import Hero from '../components/Hero';
import FeaturedProperties from '../components/FeaturedProperties';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </main>
  );
}

export default HomePage;
