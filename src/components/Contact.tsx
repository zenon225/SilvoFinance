import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, MessageSquare, Headphones, Globe, Shield } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    investmentInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        investmentInterest: ''
      });
      
      // Réinitialiser après 3 secondes
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+225 07 XX XX XX XX', '+225 05 XX XX XX XX'],
      description: 'Lun-Ven: 8h-18h, Sam: 9h-15h'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@silvo-finance.com', 'support@silvo-finance.com'],
      description: 'Réponse sous 2h en moyenne'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Plateau, Abidjan', 'Côte d\'Ivoire'],
      description: 'Siège social et bureau principal'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: ['Lun-Ven: 8h00-18h00', 'Sam: 9h00-15h00'],
      description: 'Support 24/7 en ligne'
    }
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Chat en Direct',
      description: 'Assistance immédiate avec nos conseillers',
      availability: '24/7',
      color: 'bg-blue-500'
    },
    {
      icon: Headphones,
      title: 'Support Téléphonique',
      description: 'Appelez-nous pour un conseil personnalisé',
      availability: 'Lun-Sam 8h-18h',
      color: 'bg-green-500'
    },
    {
      icon: Mail,
      title: 'Support Email',
      description: 'Envoyez-nous vos questions détaillées',
      availability: 'Réponse sous 2h',
      color: 'bg-purple-500'
    },
    {
      icon: Globe,
      title: 'Centre d\'Aide',
      description: 'FAQ et guides complets',
      availability: 'Disponible 24/7',
      color: 'bg-orange-500'
    }
  ];

  const investmentOptions = [
    'Pack Découverte (10K - 50K XOF)',
    'Pack Starter (50K - 150K XOF)',
    'Pack Croissance (150K - 500K XOF)',
    'Pack Performance (500K - 1.5M XOF)',
    'Pack Elite (1.5M - 5M XOF)',
    'Pack Prestige (5M - 20M XOF)',
    'Conseil personnalisé'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Contactez-Nous</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
              Notre équipe d'experts est à votre disposition pour vous accompagner dans vos projets d'investissement.
              <span className="block mt-2 text-base md:text-lg font-semibold text-green-300">
                🚀 Support multilingue 24/7 • Réponse garantie sous 2h
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Formulaire de contact */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Envoyez-nous un Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      placeholder="+225 07 XX XX XX XX"
                    />
                  </div>

                  <div>
                    <label htmlFor="investmentInterest" className="block text-sm font-medium text-gray-700 mb-2">
                      Pack d'intérêt
                    </label>
                    <select
                      id="investmentInterest"
                      name="investmentInterest"
                      value={formData.investmentInterest}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    >
                      <option value="">Sélectionnez un pack</option>
                      {investmentOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="Objet de votre message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:text-base ${
                    isSubmitted 
                      ? 'bg-green-500 text-white' 
                      : isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Message envoyé !</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Envoyer le Message</span>
                    </>
                  )}
                </button>
              </form>

              {isSubmitted && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-800 font-medium text-sm md:text-base">
                      Merci ! Votre message a été envoyé avec succès. Nous vous répondrons sous 2h.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6 md:space-y-8">
            {/* Coordonnées */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Nos Coordonnées</h3>
              <div className="space-y-4 md:space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{info.title}</h4>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-700 text-sm md:text-base">{detail}</p>
                      ))}
                      <p className="text-xs md:text-sm text-gray-500 mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canaux de support */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Canaux de Support</h3>
              <div className="space-y-3 md:space-y-4">
                {supportChannels.map((channel, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-6 h-6 md:w-8 md:h-8 ${channel.color} rounded-full flex items-center justify-center`}>
                        <channel.icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">{channel.title}</h4>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">{channel.description}</p>
                    <p className="text-xs text-blue-600 font-medium">{channel.availability}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sécurité et confiance */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 md:p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-600 mr-2" />
                <h3 className="text-base md:text-lg font-bold text-gray-900">Sécurité & Confiance</h3>
              </div>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  Régulé par la BCEAO
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  Données cryptées SSL
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  Capital garanti à 100%
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2 flex-shrink-0" />
                  Support multilingue 24/7
                </li>
              </ul>
            </div>

            {/* Horaires détaillés */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Horaires d'Ouverture</h3>
              <div className="space-y-3">
                {[
                  { day: 'Lundi - Vendredi', hours: '8h00 - 18h00', status: 'Ouvert' },
                  { day: 'Samedi', hours: '9h00 - 15h00', status: 'Ouvert' },
                  { day: 'Dimanche', hours: 'Fermé', status: 'Support en ligne uniquement' }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">{schedule.day}</p>
                      <p className="text-xs md:text-sm text-gray-600">{schedule.hours}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      schedule.status === 'Ouvert' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section FAQ rapide */}
        <div className="mt-12 md:mt-16 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Questions Fréquentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                question: 'Quel est l\'investissement minimum ?',
                answer: 'L\'investissement minimum est de 10 000 XOF avec le Pack Découverte.'
              },
              {
                question: 'Les rendements sont-ils garantis ?',
                answer: 'Oui, tous nos rendements sont garantis et votre capital est protégé à 100%.'
              },
              {
                question: 'Quand puis-je retirer mes gains ?',
                answer: 'Vous pouvez retirer vos gains à la fin de la période d\'investissement choisie.'
              },
              {
                question: 'Y a-t-il des frais cachés ?',
                answer: 'Non, aucun frais caché. Tous les coûts sont inclus dans nos packs.'
              },
              {
                question: 'Comment suivre mes investissements ?',
                answer: 'Via votre dashboard personnel avec suivi en temps réel de vos gains quotidiens.'
              },
              {
                question: 'Le support est-il disponible 24/7 ?',
                answer: 'Oui, notre support en ligne est disponible 24h/24 et 7j/7.'
              }
            ].map((faq, index) => (
              <div key={index} className="p-3 md:p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">{faq.question}</h4>
                <p className="text-xs md:text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;