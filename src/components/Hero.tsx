import React, { useState } from 'react';
import { ArrowRight, TrendingUp, Shield, Award, MessageCircle } from 'lucide-react';
import AuthModal from './AuthModal';
import { useChatbot } from './ChatbotProvider';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { openChatbot } = useChatbot();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleInvestClick = () => {
  if (isAuthenticated) {
    // Scroll vers la section des packs
    const element = document.getElementById('investment-packs');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  } else {
    // Ouvre le modal d'authentification
    setIsAuthModalOpen(true);
  }
};

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
        {/* Arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900">
          <div className="absolute inset-0 bg-black/30"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
            }}
          ></div>
        </div>

        {/* Éléments flottants */}
        <div className="absolute top-20 left-4 md:left-10 w-16 h-16 md:w-20 md:h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 md:right-10 w-24 h-24 md:w-32 md:h-32 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        {/* Contenu */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
          <div className="fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Investissez
              <span className="block gradient-text">Intelligemment</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
              Nouveaux packs révolutionnaires ! Rendement de 2,5% par jour sur 40 jours.
              <span className="block mt-2 text-sm sm:text-base md:text-lg text-green-300 font-semibold">
                🔥 Doublez votre capital en 40 jours • Commencez avec 10 000 FCFA
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 md:mb-8 lg:mb-12 px-4">
              <button 
                onClick={handleInvestClick}
                className="btn-primary flex items-center space-x-2 group text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center"
              >
                <span>Commencer à Investir</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button 
                onClick={openChatbot}
                className="btn-secondary flex items-center space-x-2 group text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Poser une Question</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-white/80 px-4 mb-6 md:mb-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">2,5% - 4 %</div>
                <div className="text-xs sm:text-sm">Par Jour Garanti</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">40 jours</div>
                <div className="text-xs sm:text-sm">Période Fixe</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">100% - 160%</div>
                <div className="text-xs sm:text-sm">Capital Doublé</div>
              </div>
            </div>

            {/* Exemples concrets pour différents packs */}
            <div className="mt-6 md:mt-8 lg:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto px-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-green-300 mb-2">Mini Starter</h3>
                <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                  <div>10 000 FCFA → 20 000 FCFA</div>
                  <div className="text-yellow-300">+500 FCFA/jour • 40 jours</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-blue-300 mb-2">Pack Croissance</h3>
                <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                  <div>25 000 FCFA → 52 500 FCFA</div>
                  <div className="text-yellow-300">+1312,5 FCFA/jour • 40 jours</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-purple-300 mb-2">Pack Élite</h3>
                <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                  <div>1 000 000 FCFA → 20 000 000 FCFA</div>
                  <div className="text-yellow-300">+65 000 FCFA/jour • 40 jours</div>
                </div>
              </div>
            </div>

            {/* Highlight de la nouvelle formule */}
            <div className="mt-6 md:mt-8 lg:mt-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-xl p-4 md:p-6 max-w-3xl mx-auto border border-green-400/30">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">🔥 Nouvelle Formule Révolutionnaire</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-300">2,5%</div>
                  <div className="text-sm text-white/80">Rendement quotidien</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-300">40 jours</div>
                  <div className="text-sm text-white/80">Période unique</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-300">×2</div>
                  <div className="text-sm text-white/80">Capital doublé</div>
                </div>
              </div>
              <p className="text-white/90 mt-4 text-sm md:text-base">
                💡 <strong>Formule simple :</strong> 2,5% × 40 jours = 100% de bénéfice garanti !
              </p>
            </div>

            {/* Call-to-action pour le chat */}
            <div className="mt-6 md:mt-8 lg:mt-12 bg-white/10 backdrop-blur-md rounded-xl p-4 max-w-2xl mx-auto">
              <p className="text-white/90 mb-4 text-sm sm:text-base">
                💬 <strong>Des questions ?</strong> Notre assistant virtuel est là pour vous aider !
              </p>
              <button
                onClick={openChatbot}
                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                Discuter maintenant
              </button>
            </div>
          </div>
        </div>

        {/* Indicateur de défilement */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 md:h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Modal d'authentification */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="register"
      />
    </>
  );
};

export default Hero;