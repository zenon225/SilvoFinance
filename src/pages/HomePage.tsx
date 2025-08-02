import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LiveTransactions from '../components/LiveTransactions';
import About from '../components/About';
import InvestmentPacks from '../components/InvestmentPacks';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <LiveTransactions />
      <About />
      <InvestmentPacks />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
};

export default HomePage;