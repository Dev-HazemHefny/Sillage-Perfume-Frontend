import React from 'react';
import PerfumeHero from '../../components/user/HeroSection';
import CategorySection from '../../components/common/CategorySection';
import FeaturedProducts from '../../components/user/FeaturedProducts';
import Newsletter from '../../components/user/Newsletter';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
      <PerfumeHero />
      <CategorySection />
      <FeaturedProducts />
      <Newsletter />
    </div>
  );
}

export default Home;