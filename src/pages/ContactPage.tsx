import React from 'react';
import Header from '../components/Header';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="pt-16 md:pt-20">
        <Contact />
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;