import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  Star,
  Calendar,
  Calculator,
  CheckCircle,
  Zap,
  Crown,
  Gem,
  Clock,
  Target,
  Building,
  Truck,
  ShoppingCart,
  Bitcoin,
  PieChart,
  AlertCircle,
  Loader,
  ArrowRight,
  Info,
} from "lucide-react";
import AuthModal from "./AuthModal";
import axios from "axios";

interface PackDetails {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  duration_days: number;
  is_active: boolean;
  created_at: string;
  return_percentage_40_days: number;
  // Ajoutez ici les nouvelles colonnes si nécessaire
}

interface Sector {
  name: string;
  percentage: number;
  icon: React.ComponentType<any>;
  description: string;
}

interface PackData {
  name: string;
  icon: React.ComponentType<any>;
  interest_rate: number;
  min_amount: number; // Ajouté
  max_amount: number; // Ajouté
  dailyReturn: number;
  totalReturn: number;
  period: number;
  color: string;
  description: string;
  sectors: Sector[];
  advantages: string[];
  riskLevel: string;
  targetProfile: string;
  return_percentage_40_days: number;
}
// Composant pour le popup de solde insuffisant
const InsufficientBalancePopup: React.FC<InsufficientBalancePopupProps> = ({
  currentBalance,
  requiredAmount,
  onClose,
  onDeposit,
  formatCurrency,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Solde Insuffisant</h2>
                <p className="text-orange-100">
                  Votre solde actuel ne couvre pas cet investissement
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <span className="text-white">×</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Détails du solde */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Détails du solde
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Solde actuel:</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(currentBalance)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant requis:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(requiredAmount)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold text-gray-900">Différence:</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(requiredAmount - currentBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Message d'information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-blue-800 text-sm">
                Pour effectuer cet investissement, vous devez approvisionner
                votre compte. Cliquez sur le bouton ci-dessous pour être
                redirigé vers la page de dépôt.
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors duration-300"
            >
              Annuler
            </button>
            <button
              onClick={onDeposit}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <span>Aller au Dépôt</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PackDetailPage: React.FC = (minAmount, amount: initialAmount) => {
  const { packId } = useParams<{ packId: string }>();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [packDetails, setPackDetails] = useState<PackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] =
    useState(false);
  const [calculatedReturns, setCalculatedReturns] = useState({
    dailyReturn: 0,
    totalReturn: 0,
    profit: 0,
  });
  const [investmentAmount, setInvestmentAmount] = useState(
    isNaN(Number(setSelectedAmount)) ? 0 : Number(setSelectedAmount)
  );
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(
            "https://backend-silvofinance.onrender.com/api/dashboard",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserBalance(res.data.user?.balance || 0);
        } catch (err) {
          console.error("Error fetching balance:", err);
        }
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchPackDetails = async () => {
      try {
        const response = await axios.get(
          `https://backend-silvofinance.onrender.com/api/investment-packs/${packId}`
        );
        const packFromApi = response.data;

        // Mappez les données de l'API vers la structure attendue
        const mappedPack: PackData = {
          name: packFromApi.name,
          icon: getPackIcon(packFromApi.name),
          interest_rate: packFromApi.interest_rate,
          min_amount: packFromApi.min_amount,
          max_amount: packFromApi.max_amount,
          return_percentage_40_days: packFromApi.return_percentage_40_days,
          dailyReturn:
            (packFromApi.min_amount * packFromApi.interest_rate) / 100,
          totalReturn:
            packFromApi.min_amount +
            ((packFromApi.min_amount * packFromApi.interest_rate) / 100) *
              packFromApi.duration_days,
          period: packFromApi.duration_days,
          color: getPackColor(packFromApi.name),
          description: packFromApi.description,
          sectors: getPackSectors(packFromApi.name),
          advantages: getPackAdvantages(packFromApi),
          riskLevel: getRiskLevel(packFromApi.name),
          targetProfile: getTargetProfile(packFromApi.name),
        };

        setPackDetails(mappedPack);
      } catch (err) {
        console.error("Error fetching pack details:", err);
        setError("Failed to load pack details");
      } finally {
        setLoading(false);
      }
    };

    if (packId) {
      fetchPackDetails();
    }
  }, [packId]);

  // Fonctions de mapping
  const getPackIcon = (name: string): React.ComponentType<any> => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      "Mini Starter": TrendingUp,
      "Pack Croissance": Star,
      Starter: Zap,
      Essentiel: Shield,
      Business: Crown,
      Premium: Gem,
      Élite: Target,
    };
    return iconMap[name] || TrendingUp;
  };

  const getPackColor = (name: string): string => {
    const colorMap: Record<string, string> = {
      "Mini Starter": "from-green-500 to-emerald-600",
      "Pack Croissance": "from-blue-500 to-cyan-600",
      Starter: "from-indigo-500 to-purple-600",
      Essentiel: "from-purple-500 to-pink-600",
      Business: "from-yellow-500 to-orange-600",
      Premium: "from-pink-500 to-rose-600",
      Élite: "from-purple-600 to-indigo-800",
    };
    return colorMap[name] || "from-blue-500 to-cyan-600";
  };

  const getPackSectors = (name: string): Sector[] => {
    const sectorsMap: Record<string, Sector[]> = {
      "Mini Starter": [
        {
          name: "E-commerce & Livraisons",
          percentage: 40,
          icon: ShoppingCart,
          description: "Investissement dans les plateformes e-commerce locales",
        },
        {
          name: "Transport",
          percentage: 30,
          icon: Truck,
          description: "Financement de flottes de transport",
        },
        {
          name: "Finance & Crypto",
          percentage: 20,
          icon: Bitcoin,
          description: "Trading algorithmique et crypto",
        },
        {
          name: "Immobilier",
          percentage: 10,
          icon: Building,
          description: "Immobilier locatif à court terme",
        },
      ],
      // Ajoutez les autres packs...
    };
    return (
      sectorsMap[name] || [
        {
          name: "Finance & Crypto",
          percentage: 40,
          icon: Bitcoin,
          description: "Investissements financiers diversifiés",
        },
        {
          name: "Immobilier",
          percentage: 30,
          icon: Building,
          description: "Investissements immobiliers",
        },
      ]
    );
  };

  const getPackAdvantages = (pack: PackDetails): string[] => {
    const totalReturn =
      pack.min_amount * (1 + pack.return_percentage_40_days / 100);
    const maxTotalReturn =
      pack.max_amount * (1 + pack.return_percentage_40_days / 100);
    return [
      `Rendement quotidien de ${pack.interest_rate}%`,
      `Capital doublé et + en ${pack.duration_days} jours`,
      `Gains quotidiens de ${formatCurrency(
        totalReturn / 40
      )} a ${formatCurrency(maxTotalReturn / 40)}`,
      "Capital garanti à 100%",
      "Retrait immédiat - Seuil a 5000 FrCFa",
    ];
  };

  const getRiskLevel = (name: string): string => {
    const riskMap: Record<string, string> = {
      "Mini Starter": "Très Faible",
      "Pack Croissance": "Faible",
      Starter: "Modéré",
      Essentiel: "Modéré-Élevé",
      Business: "Élevé",
      Premium: "Premium",
      Élite: "Ultra Premium",
    };
    return riskMap[name] || "Modéré";
  };

  const getTargetProfile = (name: string): string => {
    const profileMap: Record<string, string> = {
      "Mini Starter": "Débutants et investisseurs prudents",
      "Pack Croissance": "Investisseurs avec première expérience",
      Starter: "Investisseurs expérimentés",
      Essentiel: "Investisseurs fortunés",
      Business: "Investisseurs très fortunés",
      Premium: "Ultra High Net Worth",
      Élite: "Élite financière mondiale",
    };
    return profileMap[name] || "Investisseurs expérimentés";
  };

  const formatCurrency = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " FCFA"
    );
  };
  const calculateReturns = (investment: number) => {
    if (!packDetails)
      return {
        dailyReturn: 0,
        totalReturn: 0,
        profit: 0,
      };

    const maxTotalReturn =
      packDetails.max_amount *
      (1 + packDetails.return_percentage_40_days / 100);

    const amount = investment > 0 ? investment : packDetails.min_amount;
    const dailyReturn = amount * (packDetails.interest_rate / 100);
    const totalReturn =
      packDetails.min_amount *
      (1 + packDetails.return_percentage_40_days / 100);
    const profit = totalReturn - amount;

    return {
      dailyReturn,
      totalReturn,
      profit,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Chargement du pack...
          </h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Erreur lors du chargement du pack
          </h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/packs" className="text-blue-600 hover:text-blue-700">
            Retour aux packs d'investissement
          </Link>
        </div>
      </div>
    );
  }

  if (!packDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pack non trouvé
          </h1>
          <Link to="/packs" className="text-blue-600 hover:text-blue-700">
            Retour aux packs d'investissement
          </Link>
        </div>
      </div>
    );
  }

  const returns = calculateReturns(
    selectedAmount > 0 ? selectedAmount : packDetails.investment
  );
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const amount = value ? parseInt(value, 10) : 0;
    setInvestmentAmount(amount);
  };
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    // Vérification supplémentaire pour s'assurer que le token est valide
    try {
      // Vous pouvez ajouter une vérification de l'expiration du token ici
      // si vous stockez cette information dans le localStorage
      return true;
    } catch (error) {
      return false;
    }
  };
  const handleGoToDeposit = () => {
    setShowInsufficientBalancePopup(false); // Fermer le popup de solde insuffisant
    window.location.href = "/deposit-withdrawal"; // Rediriger vers la page de dépôt
  };

  const handleInvestment = async () => {
    // Vérification d'authentification
    if (!checkAuth()) {
      setIsAuthModalOpen(true);
      // Supprimez le message d'erreur et affichez directement le modal
      return;
    }

    setError(null);

    if (investmentAmount === 0) {
      setError("Veuillez entrer un montant valide");
      return;
    }

    if (investmentAmount < packDetails.min_amount) {
      setError(
        `Le montant minimum est de ${formatCurrency(packDetails.min_amount)}`
      );
      return;
    }

    if (investmentAmount > packDetails.max_amount) {
      setError(
        `Le montant maximum est de ${formatCurrency(packDetails.max_amount)}`
      );
      return;
    }

    if (investmentAmount > userBalance) {
      // Afficher le popup de solde insuffisant au lieu d'un message d'erreur
      setShowInsufficientBalancePopup(true);
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://backend-silvofinance.onrender.com/api/investment-packs/${packId}/invest`,
        { amount: investmentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessData({
        investment: response.data.investment,
        message: response.data.message || "Investissement réussi",
      });
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Erreur investissement:", err);
      setError(err.response?.data?.error || "Erreur lors de l'investissement");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${packDetails.color} text-white py-16`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/packs"
              className="flex items-center space-x-2 mb-8 text-white/80 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour aux packs</span>
            </Link>

            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <packDetails.icon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {packDetails.name}
                </h1>
                <p className="text-xl text-white/90">
                  {packDetails.description}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {packDetails.interest_rate}%
                </div>
                <div className="text-sm text-white/80">Par jour</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {packDetails.period} jours
                </div>
                <div className="text-sm text-white/80">Période</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(selectedAmount || packDetails.min_amount)} -{" "}
                  {formatCurrency(selectedAmount || packDetails.max_amount)}
                </div>
                <div className="text-sm text-white/80">Investissement</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">
                  {packDetails.riskLevel}
                </div>
                <div className="text-sm text-white/80">Niveau de Risque</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-12">
              {/* Répartition sectorielle */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <PieChart className="w-6 h-6 mr-3 text-blue-600" />
                  Répartition des Investissements
                </h2>

                <div className="space-y-6">
                  {packDetails.sectors.map((sector, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 bg-gradient-to-r ${packDetails.color} rounded-lg flex items-center justify-center`}
                          >
                            <sector.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {sector.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {sector.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {sector.percentage}%
                          </div>
                          <div className="text-sm text-gray-500">
                            du portefeuille
                          </div>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`bg-gradient-to-r ${packDetails.color} h-3 rounded-full transition-all duration-1000`}
                          style={{ width: `${sector.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avantages du pack */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                  Avantages Exclusifs
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {packDetails.advantages.map((advantage, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profil cible */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-purple-600" />
                  Profil d'Investisseur Idéal
                </h2>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <p className="text-lg text-purple-800 font-semibold mb-2">
                    {packDetails.targetProfile}
                  </p>
                  <p className="text-purple-700">
                    Ce pack est spécialement conçu pour les investisseurs
                    recherchant un rendement quotidien de{" "}
                    {packDetails.interest_rate}% avec doublement du capital en
                    seulement {packDetails.period} jours.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar - Calculateur et investissement */}
            <div className="space-y-8">
              {/* Calculateur */}
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                  Calculateur de Rendement
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant à investir (FCFA)
                    </label>
                    <input
                      type="text"
                      name="amount"
                      id="amount"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-16 pr-12 py-3 border-gray-300 rounded-md text-lg"
                      placeholder="0"
                      value={investmentAmount.toLocaleString("fr-FR")}
                      onChange={handleAmountChange}
                    />
                    <div className="text-2xl font-bold">
                      {formatCurrency(packDetails.min_amount)} -{" "}
                      {formatCurrency(packDetails.max_amount)}
                    </div>
                    <div className="text-sm text-white/80">
                      Plage d'investissement
                    </div>
                  </div>

                  {/* Résultats */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Résultats de votre investissement :
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Investissement initial:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(
                            investmentAmount || packDetails.min_amount
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Période:</span>
                        <span className="font-semibold text-blue-600">
                          {packDetails.period} jours
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Rendement quotidien:
                        </span>
                        <span className="font-bold text-green-600">
                          {packDetails.interest_rate}% ={" "}
                          {formatCurrency(
                            ((investmentAmount || packDetails.min_amount) *
                              (1 +
                                packDetails.return_percentage_40_days / 100)) /
                              40
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold">
                          Total à récupérer:
                        </span>
                        <span className="font-bold text-blue-600 text-lg">
                          {formatCurrency(
                            (investmentAmount || packDetails.min_amount) +
                              (investmentAmount || packDetails.min_amount) *
                                (packDetails.interest_rate / 100) *
                                packDetails.period
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-green-700">
                          Bénéfice net:
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          +
                          {formatCurrency(
                            (investmentAmount || packDetails.min_amount) *
                              (packDetails.interest_rate / 100) *
                              packDetails.period
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gains quotidiens */}
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Gains Quotidiens
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-700">
                        +
                        {formatCurrency(
                          ((investmentAmount || packDetails.min_amount) *
                            (1 + packDetails.return_percentage_40_days / 100)) /
                            40
                        )}
                      </div>
                      <div className="text-sm text-yellow-600">
                        chaque jour pendant {packDetails.period} jours
                      </div>
                    </div>
                  </div>

                  {/* Bouton d'investissement */}
                  <button
                    onClick={handleInvestment}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                      isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : `bg-gradient-to-r ${packDetails.color} hover:scale-105 shadow-lg hover:shadow-xl`
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      "🚀 Investir Maintenant"
                    )}
                  </button>
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {error}
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      💡 Investissement sécurisé • Capital garanti • Régulé
                      BCEAO
                    </p>
                  </div>
                </div>
              </div>
              {/* Informations complémentaires */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Informations Importantes
                </h4>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rendement quotidien:</span>
                    <span className="font-medium text-green-600">
                      {packDetails.interest_rate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Période totale:</span>
                    <span className="font-medium text-blue-600">
                      {packDetails.period} jours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de gestion:</span>
                    <span className="font-medium text-green-600">
                      0% (Inclus)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de retrait:</span>
                    <span className="font-medium text-green-600">Gratuit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Garantie capital:</span>
                    <span className="font-medium text-green-600">100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="register"
      />
      {showSuccessPopup && successData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Investissement réussi</h2>
                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    window.location.href = "/dashboard"; // Redirection automatique optionnelle
                  }}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <span className="text-white">×</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {successData.message}
                </h3>
                <p className="text-gray-600">
                  Votre investissement a été enregistré avec succès
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pack:</span>
                  <span className="font-bold">{packDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant investi:</span>
                  <span className="font-bold">
                    {formatCurrency(investmentAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gains quotidiens:</span>
                  <span className="font-bold text-green-600">
                    +
                    {formatCurrency(
                      (investmentAmount +
                        investmentAmount *
                          (packDetails.interest_rate / 100) *
                          packDetails.period) /
                        packDetails.period
                    )}
                    /jour
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-bold">{packDetails.period} jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total attendu:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(
                      investmentAmount +
                        investmentAmount *
                          (packDetails.interest_rate / 100) *
                          packDetails.period
                    )}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold transition-colors duration-300"
                >
                  Aller au dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showInsufficientBalancePopup && (
        <InsufficientBalancePopup
          currentBalance={userBalance}
          requiredAmount={investmentAmount}
          onClose={() => setShowInsufficientBalancePopup(false)}
          onDeposit={handleGoToDeposit}
          formatCurrency={formatCurrency}
        />
      )}
    </>
  );
};

export default PackDetailPage;
