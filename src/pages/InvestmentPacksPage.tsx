import React from 'react';
import Header from '../components/Header';
import InvestmentPacks from '../components/InvestmentPacks';
import Footer from '../components/Footer';

const InvestmentPacksPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="pt-16 md:pt-20">
        <InvestmentPacks />
      </div>
      <Footer />
    </>
  );
};

export default InvestmentPacksPage;