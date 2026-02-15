import React from 'react';
import ProductCard from '../../components/common/ProductCard';
import PerfumeHero from '../../components/user/HeroSection';
import UseCategory from '../../hooks/UseCategory';
import CategoryCard from '../../components/common/CategoryCard';
import CategorySection from '../../components/common/CategorySection';
const Home = () => {
    return (
        <>
            <PerfumeHero />
            <ProductCard />
            <CategorySection />
        </>
    );
}

export default Home;
