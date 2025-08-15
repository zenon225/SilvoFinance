import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
} from "lucide-react";

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
      id: "1",
      text: `Bonjour ! Je suis l'assistant virtuel de Silvo Finance. Voici ce que je peux vous expliquer :

      📊 Nos packs d'investissement (tapez "packs")
      💰 Les rendements garantis (tapez "rendement")
      🔐 La sécurité de vos fonds (tapez "sécurité")
      💳 Les méthodes de paiement (tapez "paiement")
      📞 Comment nous contacter (tapez "contact")
      🎁 Programme de parrainage (tapez "parrainage")

      Comment puis-je vous aider aujourd'hui ?`,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses: { [key: string]: string } = {
    bonjour:
      "Bonjour ! Bienvenue chez Silvo Finance. Je peux vous aider avec vos questions sur nos packs d'investissement, les rendements, ou toute autre information.",
    salut:
      "Salut ! Comment puis-je vous aider avec vos investissements aujourd'hui ?",
    hello: "Hello ! Welcome to Silvo Finance. How can I help you today?",
    pack: "Nous proposons 6 packs d'investissement :\n\n• Pack Découverte (10K-50K XOF) - 150% en 1 mois\n• Pack Starter (50K-150K XOF) - 200% en 2 mois\n• Pack Croissance (150K-500K XOF) - 280% en 3 mois\n• Pack Performance (500K-1.5M XOF) - 400% en 4 mois\n• Pack Elite (1.5M-5M XOF) - 550% en 5 mois\n• Pack Prestige (5M-20M XOF) - 750% en 6 mois\n\nQuel pack vous intéresse ?",
    rendement:
      "Nos rendements sont garantis et varient selon le pack :\n\n📈 Pack Découverte : 150% en 1 mois\n📈 Pack Starter : 200% en 2 mois\n📈 Pack Croissance : 280% en 3 mois\n📈 Pack Performance : 400% en 4 mois\n📈 Pack Elite : 550% en 5 mois\n📈 Pack Prestige : 750% en 6 mois\n\nTous les gains sont visibles quotidiennement !",
    minimum:
      "L'investissement minimum est de 10 000 XOF avec notre Pack Découverte. C'est parfait pour commencer et découvrir notre plateforme !",
    sécurité:
      "Votre sécurité est notre priorité :\n\n🔒 Cryptage SSL 256-bit\n🏦 Régulé par la BCEAO\n💰 Capital garanti à 100%\n🛡️ Conformité PCI DSS\n📞 Support 24/7\n\nVos investissements sont totalement sécurisés.",
    paiement:
      "Nous acceptons plusieurs méthodes de paiement via Flutterwave :\n\n💳 Cartes Visa/Mastercard/Verve\n📱 Orange Money, MTN, Moov\n🏦 Virements bancaires\n📟 Codes USSD\n\nTous les paiements sont sécurisés et instantanés !",
    inscription:
      "Pour vous inscrire :\n\n1️⃣ Cliquez sur \"S'inscrire\" en haut\n2️⃣ Remplissez vos informations\n3️⃣ Choisissez votre pack d'investissement\n4️⃣ Effectuez votre paiement sécurisé\n5️⃣ Suivez vos gains quotidiens !\n\nC'est simple et rapide !",
    aide: "Je peux vous aider avec :\n\n📊 Informations sur les packs\n💰 Calculs de rendements\n🔐 Questions de sécurité\n💳 Méthodes de paiement\n📞 Coordonnées de contact\n🎁 Programme de parrainage\n\nQue souhaitez-vous savoir ?",
    "silvo finance":
      "SILVO FINANCE est une plateforme d'investissements proposant des packs adaptés à différents profils et objectifs financiers.",
    "types de packs":
      "Nous proposons plusieurs packs : Bronze, Argent, Or, et Platine, chacun avec des niveaux de rendement et de durée différents.",
    "créer un compte":
      'Pour créer un compte, cliquez sur "Inscription" en haut à droite, puis suivez les étapes pour entrer vos informations.',
    "rendement pack argent":
      "Le pack Argent offre un rendement estimé de 12% annuel, avec une fréquence de paiement mensuelle.",
    parrainage:
      "En parrainant un proche, vous gagnez une commission de 5% sur son premier investissement. Un code unique vous est attribué.",
    "sécurité données":
      "Oui, vos données sont sécurisées selon les normes RGPD. Notre système utilise un chiffrement AES 256 bits.",
    "retrait fonds":
      "Les retraits peuvent être effectués en fonction des conditions du pack choisi. Certains packs ont une durée minimale d'engagement.",
    "moyens de paiement":
      "Nous acceptons les virements bancaires, cartes Visa/Mastercard, et Mobile Money (Orange, MTN).",
    "mot de passe oublié":
      'Cliquez sur "Mot de passe oublié" dans la section de connexion pour réinitialiser via votre email ou numéro de téléphone.',
    "enregistrement légal":
      "Oui, nous sommes enregistrés au registre du commerce et régulés par les autorités financières ivoiriennes.",
    "détermination rendement":
      "Le rendement dépend du pack d'investissement choisi et du montant que vous investissez. En général, plus vous investissez, plus votre rendement potentiel est élevé.",
    "investissement élevé":
      "Oui, un montant plus élevé augmente votre potentiel de gains, surtout lorsqu'il est associé à un pack premium comme Or ou Platine.",
    "impact montant":
      "Un montant plus conséquent permet d'activer des taux préférentiels dans certains packs, augmentant ainsi la performance globale de votre placement.",
    "maximiser gains":
      "Les packs Or et Platine sont conçus pour les investisseurs souhaitant maximiser leurs rendements, surtout avec des montants importants.",
    "rendement packs":
      "Non, chaque pack a un rendement spécifique. Les packs supérieurs offrent des rendements plus élevés, surtout pour les montants conséquents.",
    "historique silvo":
      "SILVO FINANCE existe depuis 8 ans. D'abord implantée en Suisse, nous sommes présents en Afrique depuis 3 ans pour accompagner les investisseurs locaux.",
    localisation:
      "Nous sommes une entreprise suisse avec une présence active en Afrique depuis 3 ans. Cette double implantation garantit rigueur, sécurité et proximité.",
    fiabilité:
      "Oui, SILVO FINANCE est une entreprise suisse fondée il y a 8 ans. Notre présence en Afrique depuis 3 ans renforce notre engagement auprès des clients.",
    "pourquoi silvo":
      "Notre expertise suisse et notre implantation africaine nous permettent d'offrir des solutions fiables, adaptées et transparentes à tout investisseur.",
    startup:
      "Non, nous sommes une entreprise établie depuis 8 ans. Notre développement en Afrique témoigne de notre croissance et de notre vision à long terme.",
    mission:
      "Notre mission est d'aider chaque investisseur à faire croître son capital en toute sécurité, grâce à des solutions transparentes et performantes.",
    "investir afrique":
      "Absolument. SILVO FINANCE est présente sur le continent africain depuis 3 ans et accompagne des milliers d'investisseurs locaux.",
    "pack bronze":
      "Le pack Bronze est une solution d'entrée de gamme pour découvrir l'investissement chez SILVO FINANCE avec un rendement stable et un ticket modéré.",
    "montant minimum":
      "Oui. Le montant minimum dépend du pack choisi. Par exemple, le pack Bronze commence à partir de 50 000 FCFA.",
    "suivi investissements":
      "Votre tableau de bord personnel vous permet de suivre en temps réel vos placements, les rendements, et l'évolution de votre portefeuille.",
    régulation:
      "Oui, nous sommes enregistrés comme entreprise en Suisse et nous opérons dans le respect des lois locales en Afrique.",
    risque:
      "Tout investissement comporte un risque. Chez SILVO FINANCE, nous proposons des packs adaptés à différents niveaux de prudence et d'objectifs.",
    "pack populaire":
      "Le pack Argent est souvent choisi par nos clients car il offre un bon équilibre entre rendement et accessibilité.",
    "augmenter gains":
      "Pour maximiser vos gains, vous pouvez choisir un pack avec un rendement élevé et investir un montant plus conséquent.",
    "bureaux physiques":
      "Oui, SILVO FINANCE dispose de bureaux en Suisse ainsi qu'en Afrique, pour accueillir les clients qui souhaitent un accompagnement personnalisé.",
    "problème technique":
      "Notre support client est disponible pour résoudre tout souci technique rapidement. Il suffit de nous contacter via la messagerie intégrée ou par téléphone.",
    "plusieurs packs":
      "Oui, vous pouvez diversifier vos placements en sélectionnant plusieurs packs selon vos objectifs. Cela permet d'optimiser vos rendements.",
    "durée packs":
      "Chaque pack a une durée précise : Bronze (3 mois), Argent (6 mois), Or (12 mois), Platine (24 mois). Vous choisissez selon votre horizon d'investissement.",
    "partenaires locaux":
      "Oui, SILVO FINANCE collabore avec des institutions et acteurs financiers locaux pour garantir l'efficacité et la conformité des placements.",
    suisse:
      "Être basée en Suisse nous permet de garantir un haut niveau de sécurité financière, de transparence et de conformité internationale.",
    "réinvestir gains":
      "Oui, vous pouvez réinvestir vos gains dans un nouveau pack ou les cumuler avec un montant additionnel pour optimiser vos rendements.",
    "fréquence paiements":
      "La fréquence dépend du pack choisi : mensuelle pour Argent et Or, trimestrielle pour Bronze, et semestrielle pour Platine.",
    "arrêt investissement":
      "Certains packs permettent une sortie anticipée, mais cela peut affecter votre rendement. Vérifiez les conditions spécifiques à chaque pack.",
    simulation:
      "Oui, un outil de simulation est disponible sur notre site pour estimer vos gains selon le pack et le montant investi.",
    contact:
      "Vous pouvez nous joindre par téléphone, e-mail ou via le chat en ligne. Nos équipes sont disponibles du lundi au samedi, de 9h à 18h (GMT).",
    "rendements garantis":
      "Non, les rendements sont estimés selon les performances du marché et la stratégie du pack. Plus le montant est élevé, plus les perspectives sont optimisées.",
    "différence silvo":
      "Notre solidité suisse, notre implantation africaine, et nos packs évolutifs font de SILVO FINANCE un acteur unique dans l'univers des placements.",
    portefeuille:
      "C'est l'ensemble de vos placements chez SILVO FINANCE, que vous pouvez gérer dans votre espace client via un tableau de bord clair et intuitif.",
    "avantages platine":
      "Le pack Platine offre un rendement premium sur 24 mois, avec des taux préférentiels accessibles aux gros montants investis.",
    "fiabilité long terme":
      "Oui. Avec 8 ans d'existence et une base suisse solide, nous avons prouvé notre fiabilité. Notre expansion en Afrique renforce notre vision durable.",
    "sécurité capital":
      "Le capital investi est protégé par des mécanismes de gestion rigoureux. Nous adoptons des standards suisses et des pratiques financières locales.",
    "pack or":
      "Oui, le pack Or convient à ceux qui veulent un bon rendement sur 1 an avec un ticket intermédiaire. Il équilibre performance et accessibilité.",
    "licence afrique":
      "Oui, nous opérons légalement avec les agréments requis dans chaque pays où nous sommes actifs, en conformité avec les normes locales.",
    commission:
      "Vous obtenez une commission pour chaque investissement réalisé par un filleul grâce à votre lien ou code de parrainage. Elle varie selon le pack choisi.",
    "changer pack":
      "En général, un changement de pack se fait en fin de cycle. Toutefois, des options de réallocation peuvent être proposées selon votre profil.",
  };

  const getQuickReplies = () => [
    "Types de packs",
    "Rendement pack Argent",
    "Sécurité des données",
    "Moyens de paiement",
    "Contact support",
    "Montant minimum",
    "Durée des packs",
    "Pack Platine",
    "Parrainage",
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Vérifie d'abord les correspondances exactes
    if (predefinedResponses[message]) {
      return predefinedResponses[message];
    }

    // Recherche de mots-clés dans le message
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    // Réponses spécifiques pour certaines questions
    if (
      message.includes("combien") &&
      (message.includes("gagner") || message.includes("profit"))
    ) {
      return "Vos gains dépendent du pack choisi :\n\n💰 Avec 10K XOF (Pack Découverte) : +15K XOF en 1 mois\n💰 Avec 100K XOF (Pack Starter) : +200K XOF en 2 mois\n💰 Avec 200K XOF (Pack Croissance) : +560K XOF en 3 mois\n\nUtilisez notre calculateur pour voir vos gains exacts !";
    }

    // Réponse par défaut améliorée
    return `Je ne suis pas sûr de comprendre votre question. Voici ce que je peux vous expliquer :
  
   📊 Nos packs d'investissement (tapez "types de packs")
  💰 Les rendements garantis (tapez "rendement")
  🔐 La sécurité de vos fonds (tapez "sécurité")
  💳 Les méthodes de paiement (tapez "paiement")
  📞 Comment nous contacter (tapez "contact")
  🎁 Programme de parrainage (tapez "parrainage")

  Ou tapez "aide" pour voir toutes les options !`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };
    if (inputMessage.includes("pack")) {
      setTimeout(() => {
        const suggestion: Message = {
          id: (Date.now() + 2).toString(),
          text: 'Vous pourriez aussi demander :\n"Quel est le rendement du pack Argent ?"\n"Quel pack me conseillez-vous ?"\n"Quelle est la durée des packs ?"',
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, suggestion]);
      }, 1500);
    }

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simuler le temps de réponse du bot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
            <h3 className="font-semibold text-sm md:text-base">
              Assistant Silvo Finance
            </h3>
            <p className="text-xs text-blue-100">
              En ligne • Répond instantanément
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
          >
            {isMinimized ? (
              <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />
            ) : (
              <Minimize2 className="w-3 h-3 md:w-4 md:h-4" />
            )}
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
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[85%] ${
                    message.isBot ? "" : "flex-row-reverse space-x-reverse"
                  }`}
                >
                  <div
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.isBot
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {message.isBot ? (
                      <Bot className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <User className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </div>
                  <div
                    className={`p-2 md:p-3 rounded-lg ${
                      message.isBot
                        ? "bg-white text-gray-800 border border-gray-200"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <p className="text-xs md:text-sm whitespace-pre-line">
                      {message.text}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isBot ? "text-gray-500" : "text-blue-100"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
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
                      <div
                        className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
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
