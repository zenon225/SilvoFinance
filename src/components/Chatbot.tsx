import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis l\'assistant virtuel de Silvo Finance. Comment puis-je vous aider aujourd\'hui ?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses: { [key: string]: string } = {
    'bonjour': 'Bonjour ! Bienvenue chez Silvo Finance. Je peux vous aider avec vos questions sur nos packs d\'investissement, les rendements, ou toute autre information.',
    'salut': 'Salut ! Comment puis-je vous aider avec vos investissements aujourd\'hui ?',
    'hello': 'Hello ! Welcome to Silvo Finance. How can I help you today?',
    'pack': 'Nous proposons 6 packs d\'investissement :\n\n• Pack Découverte (10K-50K XOF) - 150% en 1 mois\n• Pack Starter (50K-150K XOF) - 200% en 2 mois\n• Pack Croissance (150K-500K XOF) - 280% en 3 mois\n• Pack Performance (500K-1.5M XOF) - 400% en 4 mois\n• Pack Elite (1.5M-5M XOF) - 550% en 5 mois\n• Pack Prestige (5M-20M XOF) - 750% en 6 mois\n\nQuel pack vous intéresse ?',
    'rendement': 'Nos rendements sont garantis et varient selon le pack :\n\n📈 Pack Découverte : 150% en 1 mois\n📈 Pack Starter : 200% en 2 mois\n📈 Pack Croissance : 280% en 3 mois\n📈 Pack Performance : 400% en 4 mois\n📈 Pack Elite : 550% en 5 mois\n📈 Pack Prestige : 750% en 6 mois\n\nTous les gains sont visibles quotidiennement !',
    'minimum': 'L\'investissement minimum est de 10 000 XOF avec notre Pack Découverte. C\'est parfait pour commencer et découvrir notre plateforme !',
    'sécurité': 'Votre sécurité est notre priorité :\n\n🔒 Cryptage SSL 256-bit\n🏦 Régulé par la BCEAO\n💰 Capital garanti à 100%\n🛡️ Conformité PCI DSS\n📞 Support 24/7\n\nVos investissements sont totalement sécurisés.',
    'paiement': 'Nous acceptons plusieurs méthodes de paiement via Flutterwave :\n\n💳 Cartes Visa/Mastercard/Verve\n📱 Orange Money, MTN, Moov\n🏦 Virements bancaires\n📟 Codes USSD\n\nTous les paiements sont sécurisés et instantanés !',
    'retrait': 'Les retraits sont simples et rapides :\n\n⚡ Retraits instantanés via Mobile Money\n🏦 Virements bancaires (1-3h)\n💰 Aucun frais de retrait\n📱 Disponible 24/7\n\nVous récupérez votre capital + bénéfices à la fin de la période.',
    'contact': 'Vous pouvez nous contacter :\n\n📧 Email : contact@silvo-finance.com\n📞 Téléphone : +225 07 XX XX XX XX\n💬 Chat en direct (ici même)\n🕐 Support 24/7 disponible\n\nNotre équipe répond sous 2h maximum !',
    'inscription': 'Pour vous inscrire :\n\n1️⃣ Cliquez sur "S\'inscrire" en haut\n2️⃣ Remplissez vos informations\n3️⃣ Choisissez votre pack d\'investissement\n4️⃣ Effectuez votre paiement sécurisé\n5️⃣ Suivez vos gains quotidiens !\n\nC\'est simple et rapide !',
    'parrainage': 'Notre programme de parrainage vous fait gagner 10% sur chaque investissement de vos filleuls !\n\n💰 10% de commission immédiate\n🎯 Niveaux Bronze, Argent, Or, Platine\n🎁 Bonus jusqu\'à 500K XOF\n👥 Parrainez autant que vous voulez\n\nPartagez votre code et gagnez plus !',
    'aide': 'Je peux vous aider avec :\n\n📊 Informations sur les packs\n💰 Calculs de rendements\n🔐 Questions de sécurité\n💳 Méthodes de paiement\n📞 Coordonnées de contact\n🎁 Programme de parrainage\n\nQue souhaitez-vous savoir ?'

  };

  const getQuickReplies = () => [
    'Voir les packs',
    'Rendements garantis',
    'Comment investir',
    'Sécurité',
    'Contact'
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Recherche de mots-clés dans le message
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    // Réponses spécifiques pour certaines questions
    if (message.includes('combien') && (message.includes('gagner') || message.includes('profit'))) {
      return 'Vos gains dépendent du pack choisi :\n\n💰 Avec 10K XOF (Pack Découverte) : +15K XOF en 1 mois\n💰 Avec 100K XOF (Pack Starter) : +200K XOF en 2 mois\n💰 Avec 200K XOF (Pack Croissance) : +560K XOF en 3 mois\n\nUtilisez notre calculateur pour voir vos gains exacts !';
    }

    if (message.includes('temps') || message.includes('durée') || message.includes('période')) {
      return 'Nos périodes d\'investissement sont flexibles :\n\n⏱️ 1 mois (Pack Découverte)\n⏱️ 2 mois (Pack Starter)\n⏱️ 3 mois (Pack Croissance)\n⏱️ 4 mois (Pack Performance)\n⏱️ 5 mois (Pack Elite)\n⏱️ 6 mois (Pack Prestige)\n\nChoisissez selon vos objectifs !';
    }

    if (message.includes('risque') || message.includes('danger')) {
      return 'Nos investissements sont sécurisés :\n\n✅ Capital garanti à 100%\n✅ Rendements contractuels\n✅ Régulation BCEAO\n✅ Assurance complète\n✅ Transparence totale\n\nAucun risque de perte de capital !';
    }

    // Réponse par défaut
    return 'Je ne suis pas sûr de comprendre votre question. Voici ce que je peux vous expliquer :\n\n📊 Nos packs d\'investissement\n💰 Les rendements garantis\n🔐 La sécurité de vos fonds\n💳 Les méthodes de paiement\n📞 Comment nous contacter\n\nOu tapez "aide" pour voir toutes les options !';
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simuler le temps de réponse du bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
      >
        <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />
        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">!</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] max-w-sm md:max-w-md lg:max-w-lg h-[70vh] md:h-[600px] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 md:p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">Assistant Silvo Finance</h3>
            <p className="text-xs text-blue-100">En ligne • Répond instantanément</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3 md:w-4 md:h-4" /> : <Minimize2 className="w-3 h-3 md:w-4 md:h-4" />}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
          >
            <X className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {message.isBot ? <Bot className="w-3 h-3 md:w-4 md:h-4" /> : <User className="w-3 h-3 md:w-4 md:h-4" />}
                  </div>
                  <div className={`p-2 md:p-3 rounded-lg ${
                    message.isBot 
                      ? 'bg-white text-gray-800 border border-gray-200' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="text-xs md:text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                  <div className="bg-white p-2 md:p-3 rounded-lg border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-600 mb-2">Suggestions :</p>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {getQuickReplies().map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors duration-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 px-2 md:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs md:text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              💬 Support instantané • Réponses automatiques 24/7
            </p>
          </div>
        </>
      )}

      {isMinimized && (
        <div className="p-3 md:p-4 bg-white">
          <p className="text-xs md:text-sm text-gray-600 text-center">
            Chat minimisé • Cliquez pour agrandir
          </p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;