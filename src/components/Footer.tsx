import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import logo from '../images/logo_silvofinance.png';

const Footer: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const footerLinks = {
    'Entreprise': [
      { name: 'À Propos', href: '#about' },
      { name: 'Notre Équipe', href: '#team' }
    ],
    'Investissement': [
      { name: 'Packs d\'Investissement', href: '#investment-packs' },
      { name: 'Stratégies', href: '#strategies' },
      { name: 'Performances', href: '#performance' },
      { name: 'Calculateur', href: '#calculator' }
    ],
    'Support': [
      { name: 'Centre d\'Aide', href: '#help' },
      { name: 'FAQ', href: '#faq' },
      { name: 'Contact', href: '/contact', isRoute: true }
    ],
    'Légal': [
      { name: 'Conditions d\'Utilisation', href: '#terms' },
      { name: 'Politique de Confidentialité', href: '#privacy' },
      { name: 'Mentions Légales', href: '#legal' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Marque */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="Silvo Finance Logo"
                  className={`max-h-16 md:max-h-24 w-auto transition-all duration-300 ${isScrolled ? '' : 'brightness-0 invert'}`}
                />
              </div>
              <span className="text-2xl font-bold">Silvo Finance</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Plateforme d'investissement de nouvelle génération offrant des solutions 
              financières innovantes en FCFA pour maximiser vos rendements en toute sécurité.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="text-gray-400">contact@silvo-finance.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500" />
                <span className="text-gray-400">+41 79 123 4959</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="text-gray-400">Rue du Rhône 45, 1204 Genève Suisse</span>
              </div>
            </div>
          </div>

          {/* Liens */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.isRoute ? (
                      <Link 
                        to={link.href}
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-left"
                      >
                        {link.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2024 Silvo Finance. Tous droits réservés. | Régulé par la BCEAO
          </p>
          
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;