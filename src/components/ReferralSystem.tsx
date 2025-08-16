import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Share2,
  Copy,
  Gift,
  TrendingUp,
  DollarSign,
  UserPlus,
  Award,
  Calendar,
  CheckCircle,
  ArrowLeft,
  QrCode,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Phone,
  Target,
  Crown,
  Star,
} from "lucide-react";
import axios from "axios";

const getLevelIconComponent = (levelName: string) => {
  switch (levelName) {
    case "Bronze":
      return Award;
    case "Argent":
      return Star;
    case "Or":
      return Crown;
    case "Platine":
      return Crown;
    default:
      return Award;
  }
};

const getLevelIcon = (levelName: string) => {
  switch (levelName) {
    case "Bronze":
      return Award;
    case "Argent":
      return Star;
    case "Or":
      return Crown;
    case "Platine":
      return Crown;
    default:
      return Award;
  }
};

interface ReferralLevel {
  level: string;
  minReferrals: number;
  maxReferrals: number | null; // ou number | 'Infinity' selon votre besoin
  commission: number;
  bonus: number;
  color: string;
  benefits: string[];
  // Si vous utilisez des icônes côté frontend uniquement
  icon?: React.ComponentType<{ className?: string }>;
}

interface ReferralUser {
  name: string;
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
  thisMonthCommissions: number;
}

interface ReferralHistoryItem {
  id: number;
  name: string;
  joinDate: string;
  pack: string;
  investment: number;
  commission: number;
  status: "active" | "completed" | "pending";
}

interface ReferralData {
  user: ReferralUser;
  referralHistory: ReferralHistoryItem[];
  referralLevels: ReferralLevel[];
  currentLevel: ReferralLevel;
  nextLevel: ReferralLevel | null;
}

const ReferralSystem: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedShareMethod, setSelectedShareMethod] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Données utilisateur simulées
  //const userData = {
  // name: 'Aminata Traoré',
  //referralCode: 'AMI2024TRA',
  //totalReferrals: 12,
  //activeReferrals: 8,
  //totalCommissions: 485000,
  //pendingCommissions: 75000,
  //thisMonthCommissions: 125000
  //};
  const [data, setData] = useState<ReferralData>({
    user: {
      name: "",
      referralCode: "",
      totalReferrals: 0,
      activeReferrals: 0,
      totalCommissions: 0,
      pendingCommissions: 0,
      thisMonthCommissions: 0,
    },
    referralHistory: [],
    referralLevels: [],
    currentLevel: {
      level: "Bronze",
      minReferrals: 0,
      maxReferrals: 0,
      commission: 0,
      bonus: 0,
      color: "",
      benefits: [],
    },
    nextLevel: null,
  });

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://backend-silvofinance.onrender.com/api/referral",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const currentLevel = response.data.currentLevel;
        const nextLevel =
          response.data.referralLevels.find(
            (level) => response.data.user.totalReferrals < level.minReferrals
          ) || null;

        setData({
          user: {
            ...response.data.user,
            pendingCommissions: 0, // Vous devrez peut-être ajouter ce champ dans votre API
          },
          referralHistory: response.data.referralHistory,
          referralLevels: response.data.referralLevels,
          currentLevel,
          nextLevel,
        });
      } catch (err) {
        setError("Erreur lors du chargement des données de parrainage");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const formatCurrency = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " XOF"
    );
  };

  // Historique des parrainages
  const referralHistory = [
    {
      id: 1,
      name: "Moussa D.",
      joinDate: "2024-11-15",
      pack: "Pack Croissance",
      investment: 200000,
      commission: 20000,
      status: "active",
    },
    {
      id: 2,
      name: "Fatou S.",
      joinDate: "2024-11-10",
      pack: "Pack Starter",
      investment: 100000,
      commission: 10000,
      status: "active",
    },
    {
      id: 3,
      name: "Ibrahim K.",
      joinDate: "2024-11-05",
      pack: "Pack Performance",
      investment: 800000,
      commission: 80000,
      status: "completed",
    },
    {
      id: 4,
      name: "Aïcha C.",
      joinDate: "2024-10-28",
      pack: "Pack Elite",
      investment: 2000000,
      commission: 200000,
      status: "completed",
    },
    {
      id: 5,
      name: "Ousmane B.",
      joinDate: "2024-10-20",
      pack: "Pack Découverte",
      investment: 25000,
      commission: 2500,
      status: "active",
    },
  ];

  // Niveaux de parrainage
  const referralLevels = [
    {
      level: "Bronze",
      icon: Award,
      minReferrals: 1,
      maxReferrals: 4,
      commission: 10,
      bonus: 0,
      color: "from-orange-500 to-orange-600",
      benefits: ["10% de commission sur le premier investissement"],
    },
    {
      level: "Argent",
      icon: Star,
      minReferrals: 5,
      maxReferrals: 9,
      commission: 12,
      bonus: 50000,
      color: "from-gray-400 to-gray-600",
      benefits: ["12% de commission sur le premier investissement"],
    },
    {
      level: "Or",
      icon: Crown,
      minReferrals: 10,
      maxReferrals: 19,
      commission: 15,
      bonus: 150000,
      color: "from-yellow-500 to-yellow-600",
      benefits: ["15% de commission sur le premier investissement"],
    },
    {
      level: "Platine",
      icon: Crown,
      minReferrals: 20,
      maxReferrals: Infinity,
      commission: 20,
      bonus: 500000,
      color: "from-purple-500 to-purple-600",
      benefits: ["20% de commission sur le premier investissement"],
    },
  ];

  const getCurrentLevel = (): ReferralLevel => {
    if (!data.referralLevels.length) {
      return {
        level: "Bronze",
        minReferrals: 0,
        maxReferrals: 0,
        commission: 0,
        bonus: 0,
        color: "from-gray-500 to-gray-600",
        benefits: [],
      };
    }
    const level = data.referralLevels.find(
      (level) =>
        data.user.totalReferrals >= level.minReferrals &&
        (level.maxReferrals === null ||
          data.user.totalReferrals <= level.maxReferrals)
    );

    return level || data.referralLevels[0];
  };

  const getNextLevel = (): ReferralLevel | null => {
    const currentLevel = getCurrentLevel();
    const currentIndex = data.referralLevels.findIndex(
      (l) => l.level === currentLevel.level
    );
    return currentIndex < data.referralLevels.length - 1
      ? data.referralLevels[currentIndex + 1]
      : null;
  };

  const copyReferralCode = () => {
    const referralLink = `${window.location.origin}?ref=${data.user.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareViaMethod = (method: string) => {
    const referralLink = `${window.location.origin}?ref=${data.user.referralCode}`;
    const message = `🚀 Rejoins-moi sur Silvo Finance ! Rendements de 150% à 750% garantis. Utilise mon code: ${data.user.referralCode} ${referralLink}`;

    switch (method) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            referralLink
          )}`
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
        );
        break;
      case "sms":
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
      case "email":
        window.open(
          `mailto:?subject=Rejoins Silvo Finance&body=${encodeURIComponent(
            message
          )}`
        );
        break;
    }
  };

  const currentLevel = data.user ? getCurrentLevel() : referralLevels[0];
  const nextLevel = data.user ? getNextLevel() : null;
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 mb-6 md:mb-8 text-white/80 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Retour au Dashboard</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
                Programme de Parrainage
              </h1>
              <p className="text-base md:text-xl text-white/90">
                Gagnez plus de 8 % sur les premiers investissements de vos
                filleuls
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4">
              <div className="text-xs md:text-sm text-white/80 mb-1">
                Total Parrainés
              </div>
              <div className="text-lg md:text-2xl font-bold">
                {data.user.totalReferrals}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4">
              <div className="text-xs md:text-sm text-white/80 mb-1">
                Actifs
              </div>
              <div className="text-lg md:text-2xl font-bold">
                {data.user.activeReferrals}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 md:p-4 col-span-2 md:col-span-1">
              <div className="text-xs md:text-sm text-white/80 mb-1">
                Commissions Totales
              </div>
              <div className="text-sm md:text-xl lg:text-2xl font-bold break-words">
                {formatCurrency(data.user.totalCommissions)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
          {/* Section principale */}
          <div className="lg:col-span-2 space-y-6 md:space-y-12">
            {/* Code de parrainage */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                <Share2 className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-purple-600" />
                <span>Votre Code de Parrainage</span>
              </h2>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 md:p-6 rounded-lg mb-4 md:mb-6">
                <div className="text-center">
                  <div className="text-xs md:text-sm text-gray-600 mb-2">
                    Votre code unique
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-3 md:mb-4 break-all">
                    {data.user.referralCode}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 break-all">
                    Lien: https://silvofinance.onrender.com/register?ref=
                    {data.user.referralCode}
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className={`flex items-center space-x-2 mx-auto px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105"
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Copier le Lien</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Méthodes de partage */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">
                  Partager via :
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
                  {[
                    {
                      id: "whatsapp",
                      name: "WhatsApp",
                      icon: MessageCircle,
                      color: "bg-green-500",
                    },
                    {
                      id: "facebook",
                      name: "Facebook",
                      icon: Facebook,
                      color: "bg-blue-600",
                    },
                    {
                      id: "twitter",
                      name: "Twitter",
                      icon: Twitter,
                      color: "bg-blue-400",
                    },
                    {
                      id: "sms",
                      name: "SMS",
                      icon: Phone,
                      color: "bg-gray-600",
                    },
                    {
                      id: "email",
                      name: "Email",
                      icon: Mail,
                      color: "bg-red-500",
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => shareViaMethod(method.id)}
                      className={`${method.color} text-white p-2 md:p-4 rounded-lg hover:opacity-90 transition-all duration-300 hover:scale-105`}
                    >
                      <method.icon className="w-4 h-4 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
                      <div className="text-xs font-medium">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Niveau actuel et progression */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                <Target className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-yellow-600" />
                <span>Votre Niveau de Parrainage</span>
              </h2>

              <div
                className={`bg-gradient-to-r ${currentLevel.color} text-white p-4 md:p-6 rounded-lg mb-4 md:mb-6`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center">
                      {React.createElement(getLevelIcon(currentLevel.level), {
                        className: "w-6 h-6 md:w-8 md:h-8 text-white",
                      })}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold">
                        {currentLevel.level}
                      </h3>
                      <p className="text-white/90 text-sm md:text-base">
                        {currentLevel.commission}% de commission
                      </p>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="text-xs md:text-sm text-white/80">
                      Parrainages
                    </div>
                    <div className="text-xl md:text-2xl font-bold">
                      {data.user.totalReferrals}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progression vers le niveau suivant */}
              {nextLevel && (
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base mb-2 md:mb-0">
                      Progression vers {nextLevel.level}
                    </h4>
                    <span className="text-xs md:text-sm text-gray-600">
                      {data.user.totalReferrals}/{nextLevel.minReferrals}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 mb-3 md:mb-4">
                    <div
                      className={`bg-gradient-to-r ${nextLevel.color} h-2 md:h-3 rounded-full transition-all duration-500`}
                      style={{
                        width: `${Math.min(
                          (data.user.totalReferrals / nextLevel.minReferrals) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-2">
                    Plus que{" "}
                    {Math.max(
                      nextLevel.minReferrals - data.user.totalReferrals,
                      0
                    )}{" "}
                    parrainages pour débloquer :
                  </p>
                  <ul className="mt-2 space-y-1">
                    {nextLevel.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="text-xs md:text-sm text-gray-700 flex items-center"
                      >
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1 md:mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Historique des parrainages */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center">
                <Users className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-blue-600" />
                <span>Vos Parrainages</span>
              </h2>

              {/* Version mobile - cartes */}
              <div className="block md:hidden space-y-3">
                {data.referralHistory.map((referral) => (
                  <div
                    key={referral.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">
                        {referral.name}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          referral.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {referral.status === "active" ? "Actif" : "Terminé"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {referral.pack}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500">
                          Investissement
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(referral.investment)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Commission</div>
                        <div className="text-sm font-bold text-green-600">
                          +{formatCurrency(referral.commission)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(referral.joinDate).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Version desktop - tableau */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Filleul
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pack
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Investissement
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Commission
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {referralHistory.map((referral) => (
                      <tr key={referral.id} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {referral.name}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {referral.pack}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(referral.investment)}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          +{formatCurrency(referral.commission)}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(referral.joinDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              referral.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {referral.status === "active" ? "Actif" : "Terminé"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:space-y-8">
            {/* Niveaux de parrainage */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                Niveaux de Parrainage
              </h3>

              <div className="space-y-3 md:space-y-4">
                {data.referralLevels.map((level, index) => {
                  const IconComponent = getLevelIcon(level.level);
                  return (
                    <div
                      key={index}
                      className={`p-3 md:p-4 rounded-lg border-2 ${
                        level.level === currentLevel.level
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2 md:space-x-3 mb-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r ${level.color} rounded-full flex items-center justify-center">
                          <IconComponent className="w-3 h-3 md:w-4 md:h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                            {level.level}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {level.minReferrals === level.maxReferrals
                              ? `${level.minReferrals} parrainages`
                              : level.maxReferrals === Infinity
                              ? `${level.minReferrals}+ parrainages`
                              : `${level.minReferrals}-${level.maxReferrals} parrainages`}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs md:text-sm space-y-1">
                        <div className="font-medium text-green-600">
                          {level.commission}% de commission
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comment ça marche */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                Comment ça marche ?
              </h3>

              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">
                      Partagez votre code
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600">
                      Invitez vos amis avec votre code unique
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">
                      Ils s'inscrivent
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600">
                      Vos filleuls créent leur compte
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">
                      Ils investissent
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600">
                      Son premier investissement vous rapporte plus de 8%
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm md:text-base">
                      Vous gagnez
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600">
                      Commissions versées instantanément
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples de gains */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;
