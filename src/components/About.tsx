import React from 'react';
import { Shield, TrendingUp, Award, Users } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Sécurité Maximale',
      description: 'Vos investissements sont protégés par des protocoles de sécurité de niveau bancaire et des assurances complètes.'
    },
    {
      icon: TrendingUp,
      title: 'Rendements Exceptionnels',
      description: 'Notre nouvelle formule génère 2,5% de rendement quotidien garanti pendant 40 jours, doublant votre capital.'
    },
    {
      icon: Award,
      title: 'Expertise Reconnue',
      description: 'Une équipe de gestionnaires certifiés avec plus de 20 ans d\'expérience sur les marchés financiers.'
    },
    {
      icon: Users,
      title: 'Support Dédié',
      description: 'Un conseiller personnel vous accompagne tout au long de votre parcours d\'investissement.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi Choisir <span className="gradient-text">Silvo Finance</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous combinons innovation technologique et expertise financière pour offrir 
            2,5% de rendement quotidien garanti en FCFA avec des gains visibles chaque jour.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg card-hover text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="slide-up">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Votre Succès Financier Commence Ici
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Chez Silvo Finance, nous croyons que chacun mérite d'accéder aux meilleures 
              opportunités d'investissement. Notre approche révolutionnaire vous permet de 
              doubler votre capital en seulement 40 jours avec 2,5% de gains quotidiens.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Rendement garanti de 2,5% par jour pendant 40 jours',
                'Capital doublé automatiquement (100% de bénéfice)',
                'Gains quotidiens visibles dans votre dashboard',
                'Investissement minimum accessible : 10 000 FCFA',
                'Aucun frais caché, transparence totale',
                'Retrait immédiat à la fin des 40 jours',
                'Support client multilingue 24/7 (Français/Anglais)',
                'Sécurité bancaire et régulation BCEAO'
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <button className="btn-primary">En Savoir Plus</button>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
                alt="Investissement Professionnel"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-lg">+100%</span>
            </div>
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-sm">40 jours</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;