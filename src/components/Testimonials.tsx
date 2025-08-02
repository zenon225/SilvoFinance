import React, { useState } from 'react';
import { Star, Quote, TrendingUp, Calendar, Clock, Send, CheckCircle, User, Mail, Phone, Plus, X } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pack: '',
    investment: '',
    testimonial: '',
    rating: 5
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
  };

  const testimonials = [
    {
      name: 'Aminata Traoré',
      role: 'Commerçante',
      content: 'Mini Starter : 10 000 FCFA investis, 20 000 FCFA récupérés en 40 jours ! Voir 250 FCFA s\'ajouter chaque jour était magique.',
      investment: 10000,
      profit: 10000,
      period: '40 jours',
      dailyGain: 250,
      pack: 'Mini Starter',
      rating: 5,
      verified: true
    },
    {
      name: 'Moussa Diallo',
      role: 'Ingénieur',
      content: 'Pack Croissance incroyable ! 25 000 FCFA transformés en 50 000 FCFA en 40 jours. Les 625 FCFA quotidiens ont changé ma vie.',
      investment: 25000,
      profit: 25000,
      period: '40 jours',
      dailyGain: 625,
      pack: 'Pack Croissance',
      rating: 5,
      verified: true
    },
    {
      name: 'Fatou Sow',
      role: 'Médecin',
      content: 'Starter : 50 000 FCFA investis, 100 000 FCFA récupérés en 40 jours ! Voir 1 250 FCFA s\'accumuler quotidiennement était motivant.',
      investment: 50000,
      profit: 50000,
      period: '40 jours',
      dailyGain: 1250,
      pack: 'Starter',
      rating: 5,
      verified: true
    },
    {
      name: 'Ibrahim Koné',
      role: 'Entrepreneur',
      content: 'Pack Essentiel exceptionnel ! 100 000 FCFA sont devenus 200 000 FCFA en 40 jours. Les 2 500 FCFA quotidiens ont dépassé mes attentes.',
      investment: 100000,
      profit: 100000,
      period: '40 jours',
      dailyGain: 2500,
      pack: 'Essentiel',
      rating: 5,
      verified: true
    },
    {
      name: 'Aïcha Camara',
      role: 'Directrice',
      content: 'Pack Business fantastique ! 250 000 FCFA transformés en 500 000 FCFA en 40 jours. Voir 6 250 FCFA quotidiens était surréaliste.',
      investment: 250000,
      profit: 250000,
      period: '40 jours',
      dailyGain: 6250,
      pack: 'Business',
      rating: 5,
      verified: true
    },
    {
      name: 'Ousmane Bah',
      role: 'Consultant',
      content: 'Pack Premium révolutionnaire ! 500 000 FCFA sont devenus 1 000 000 FCFA en 40 jours. Les 12 500 FCFA quotidiens ont transformé ma fortune.',
      investment: 500000,
      profit: 500000,
      period: '40 jours',
      dailyGain: 12500,
      pack: 'Premium',
      rating: 5,
      verified: true
    }
  ];

  const packs = [
    'Mini Starter',
    'Pack Croissance', 
    'Starter',
    'Essentiel',
    'Business',
    'Premium',
    'Élite'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
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
        pack: '',
        investment: '',
        testimonial: '',
        rating: 5
      });
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setIsSubmitted(false);
        setShowSubmissionForm(false);
      }, 3000);
    }, 2000);
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Témoignages de Nos <span className="gradient-text">Investisseurs</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les succès réels de nos clients avec la nouvelle formule 2,5% par jour sur 40 jours.
            <span className="block mt-2 text-lg font-semibold text-green-600">
              💰 Tous ont doublé leur capital en 40 jours avec des gains quotidiens !
            </span>
          </p>

          {/* Bouton pour ajouter un témoignage */}
          <div className="mt-8">
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Partager Mon Témoignage</span>
            </button>
          </div>
        </div>

        {/* Intégration Trustpilot */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Noté Excellent sur Trustpilot</h3>
            
            {/* Widget Trustpilot simulé */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-green-500 fill-current" />
                ))}
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-gray-900">4.8/5</div>
                <div className="text-sm text-gray-600">Basé sur 2,847 avis</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Recommandent Silvo Finance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.9/5</div>
                <div className="text-sm text-gray-600">Service Client</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                <div className="text-sm text-gray-600">Facilité d'utilisation</div>
              </div>
            </div>

            {/* Logo Trustpilot */}
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <span className="text-sm">Vérifié par</span>
              <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">
                Trustpilot
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg card-hover relative border-l-4 border-green-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Badge du pack */}
              <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {testimonial.pack}
              </div>

              {/* Badge vérifié */}
              {testimonial.verified && (
                <div className="absolute -top-3 -left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Vérifié</span>
                </div>
              )}

              <Quote className="w-8 h-8 text-blue-600 mb-4" />
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Résultats d'investissement */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4 border border-green-200">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Investissement:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(testimonial.investment)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Période:
                  </span>
                  <span className="font-medium text-blue-600">{testimonial.period}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t pt-2">
                  <span className="text-gray-600">Total récupéré:</span>
                  <span className="font-bold text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {formatCurrency(testimonial.investment * 2)}
                  </span>
                </div>
              </div>

              {/* Gains quotidiens */}
              <div className="bg-yellow-50 p-3 rounded-lg mb-6 border border-yellow-200">
                <div className="flex items-center mb-1">
                  <Calendar className="w-4 h-4 mr-2 text-yellow-600" />
                  <span className="font-semibold text-yellow-800 text-sm">Gains quotidiens</span>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-700">+{formatCurrency(testimonial.dailyGain)}</div>
                  <div className="text-xs text-yellow-600">chaque jour pendant {testimonial.period}</div>
                </div>
              </div>
              
              {/* Profil client sans photo */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-900 font-semibold">4,8/5</span>
            <span className="text-gray-600">sur plus de 2 847 avis Trustpilot</span>
          </div>
          
          {/* Résumé de la nouvelle formule */}
          <div className="bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-lg max-w-4xl mx-auto">
            <h4 className="font-bold text-gray-900 mb-4">🎯 Nouvelle formule révolutionnaire :</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm">
              <div className="text-center p-2 bg-white rounded-lg">
                <div className="font-semibold text-green-600">Mini Starter</div>
                <div className="text-xs text-gray-600">10K → 20K FCFA</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <div className="font-semibold text-blue-600">Croissance</div>
                <div className="text-xs text-gray-600">25K → 50K FCFA</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <div className="font-semibold text-indigo-600">Starter</div>
                <div className="text-xs text-gray-600">50K → 100K FCFA</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <div className="font-semibold text-purple-600">Essentiel</div>
                <div className="text-xs text-gray-600">100K → 200K FCFA</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <div className="font-semibold text-yellow-600">Business</div>
                <div className="text-xs text-gray-600">250K → 500K FCFA</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <div className="font-semibold text-pink-600">Premium</div>
                <div className="text-xs text-gray-600">500K → 1M FCFA</div>
              </div>
              <div className="text-center p-2 bg-white rounded-lg">
                <div className="font-semibold text-red-600">Élite</div>
                <div className="text-xs text-gray-600">1M → 2M FCFA</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <div className="text-center">
                <div className="font-semibold text-gray-800">🔥 Formule magique</div>
                <div className="text-lg font-bold text-green-600">2,5% × 40 jours = 100% de bénéfice</div>
                <div className="text-sm text-gray-600 mt-1">Tous les packs doublent votre capital !</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de soumission de témoignage */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Bouton fermer */}
            <button
              onClick={() => setShowSubmissionForm(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300 z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Quote className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Partagez Votre Expérience</h2>
                <p className="text-gray-600">Aidez d'autres investisseurs en partageant votre témoignage</p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Merci pour votre témoignage !</h3>
                  <p className="text-green-600 mb-4">
                    Votre témoignage a été soumis avec succès. Il sera vérifié et publié sous 24h.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700">
                      💡 Votre témoignage sera également publié sur notre page Trustpilot après vérification.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations personnelles */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Votre nom complet"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+225 07 XX XX XX XX"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="pack" className="block text-sm font-medium text-gray-700 mb-2">
                        Pack d'investissement *
                      </label>
                      <select
                        id="pack"
                        name="pack"
                        value={formData.pack}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionnez votre pack</option>
                        {packs.map((pack, index) => (
                          <option key={index} value={pack}>{pack}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="investment" className="block text-sm font-medium text-gray-700 mb-2">
                      Montant investi (FCFA)
                    </label>
                    <input
                      type="number"
                      id="investment"
                      name="investment"
                      value={formData.investment}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 100000"
                    />
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre note *
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className={`w-8 h-8 ${
                            star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors duration-200`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {formData.rating}/5 étoiles
                      </span>
                    </div>
                  </div>

                  {/* Témoignage */}
                  <div>
                    <label htmlFor="testimonial" className="block text-sm font-medium text-gray-700 mb-2">
                      Votre témoignage *
                    </label>
                    <textarea
                      id="testimonial"
                      name="testimonial"
                      value={formData.testimonial}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Partagez votre expérience avec Silvo Finance..."
                    ></textarea>
                  </div>

                  {/* Bouton de soumission */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Publier Mon Témoignage</span>
                      </>
                    )}
                  </button>

                  {/* Note légale */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-blue-800">
                      En soumettant ce témoignage, vous acceptez qu'il soit publié sur notre site web et nos plateformes partenaires comme Trustpilot. Vos informations personnelles resteront confidentielles.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;