import React from 'react';
import { Heart, Dumbbell, Brain, Apple, Radiation as Meditation, Users } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Heart,
      title: 'Coaching Bien-être',
      description: 'Programmes de bien-être complets adaptés à vos besoins et objectifs uniques.',
      features: ['Évaluation personnelle du bien-être', 'Séances de coaching 1-à-1', 'Plan de bien-être personnalisé'],
      price: '199€/mois',
      popular: false
    },
    {
      icon: Dumbbell,
      title: 'Entraînement Fitness',
      description: 'Guidance fitness professionnelle avec plans d\'entraînement personnalisés et conseils nutritionnels.',
      features: ['Séances d\'entraînement personnel', 'Planification nutritionnelle', 'Suivi des progrès', 'Conseils équipement'],
      price: '149€/mois',
      popular: true
    },
    {
      icon: Brain,
      title: 'Support Santé Mentale',
      description: 'Programmes de bien-être mental incluant gestion du stress et pratiques de pleine conscience.',
      features: ['Techniques de gestion du stress', 'Formation à la pleine conscience', 'Ressources santé mentale'],
      price: '99€/mois',
      popular: false
    },
    {
      icon: Apple,
      title: 'Conseils Nutritionnels',
      description: 'Conseil nutritionnel expert avec planification de repas et recommandations diététiques.',
      features: ['Planification de repas', 'Évaluation nutritionnelle', 'Recommandations de recettes', 'Listes de courses'],
      price: '79€/mois',
      popular: false
    },
    {
      icon: Meditation,
      title: 'Programmes Pleine Conscience',
      description: 'Pratiques de méditation et pleine conscience pour améliorer la clarté mentale et la paix intérieure.',
      features: ['Méditation guidée', 'Exercices de respiration', 'Techniques de pleine conscience'],
      price: '59€/mois',
      popular: false
    },
    {
      icon: Users,
      title: 'Support Communautaire',
      description: 'Rejoignez notre communauté bienveillante de personnes partageant les mêmes idées dans leur voyage bien-être.',
      features: ['Forums communautaires', 'Défis de groupe', 'Support entre pairs', 'Q&R avec experts'],
      price: '29€/mois',
      popular: false
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nos <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solutions de bien-être complètes conçues pour soutenir chaque aspect de votre parcours santé.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`relative bg-white p-8 rounded-xl shadow-lg card-hover border-2 ${
                service.popular ? 'border-emerald-500' : 'border-gray-100'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Plus Populaire
                  </span>
                </div>
              )}
              
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mb-6">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <ul className="space-y-3 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                <button className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  service.popular 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  Choisir le Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Vous ne savez pas quel service vous convient ? Laissez-nous vous aider à trouver la solution parfaite.
          </p>
          <button className="btn-secondary">
            Obtenir une Recommandation Personnalisée
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;