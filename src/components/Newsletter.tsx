import React, { useState } from 'react';
import { Mail, Send, TrendingUp } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'appel API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail('');
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="slide-up">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Analyses de Marché Exclusives
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Recevez nos analyses de marché hebdomadaires, conseils d'experts et opportunités 
            d'investissement exclusives directement dans votre boîte mail.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse email"
                required
                className="flex-1 px-6 py-4 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isSubmitted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-blue-600 hover:bg-gray-100 hover:scale-105'
                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Inscription...</span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Inscrit !</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>S'inscrire</span>
                  </>
                )}
              </button>
            </div>
          </form>
          
          <p className="text-blue-200 text-sm mt-4">
            Analyses gratuites • Pas de spam • Désabonnement facile
          </p>

          <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">12-42%</div>
              <div className="text-blue-200 text-sm">Rendement Moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">2.5B+ XOF</div>
              <div className="text-blue-200 text-sm">Actifs Sous Gestion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">8000+</div>
              <div className="text-blue-200 text-sm">Investisseurs Actifs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;