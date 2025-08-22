import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Loader,
  DollarSign,
  User,
  Mail,
  Phone,
  Wallet,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  X,
  Info,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FlutterwavePaymentProps {
  id: string;
  amount: number;
  title: string;
  description: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  onSuccess: (response: any) => void;
  onClose: () => void;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  durationDays: number;
  packId: string;
  userBalance: number;
}

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
  // Ajoutez ici les nouvelles colonnes si nécessaire
}
interface InsufficientBalancePopupProps {
  currentBalance: number;
  requiredAmount: number;
  onClose: () => void;
  onDeposit: () => void;
  formatCurrency: (amount: number) => string;
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

const calculateHourlyDistribution = (
  totalAmount: number,
  durationDays: number
) => {
  const totalHours = durationDays * 24;
  const hourlyAmount = totalAmount / totalHours;
  return {
    hourlyAmount,
    totalHours,
  };
};

const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({
  amount: initialAmount,
  userBalance: initialBalance,
  title,
  packId,
  description,
  customerEmail,
  customerPhone,
  customerName,
  onSuccess,
  onClose,
  minAmount,
  maxAmount,
  interestRate,
  durationDays,
}) => {
  const navigate = useNavigate(); // Déplacer useNavigate() ici, à l'intérieur du composant
  const [isProcessing, setIsProcessing] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(
    isNaN(Number(initialAmount)) ? 0 : Number(initialAmount)
  );
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [userBalance, setUserBalance] = useState(
    isNaN(Number(initialBalance)) ? 0 : Number(initialBalance)
  );
  const [error, setError] = useState<string | null>(null);
  const [expectedReturn, setExpectedReturn] = useState(0);
  const [showInsufficientBalancePopup, setShowInsufficientBalancePopup] =
    useState(false);

  const formatCurrency = (amount: number) => {
    const validAmount = isNaN(amount) ? 0 : amount;
    return (
      new Intl.NumberFormat("fr-FR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " FCFA"
    ); // XOF remplacé par FCFA
  };

  useEffect(() => {
    calculateReturn();
    if (error) setError(null);
  }, [investmentAmount]);

  const calculateReturn = () => {
    const validAmount = isNaN(investmentAmount) ? 0 : investmentAmount;
    const validRate = isNaN(interestRate) ? 0 : interestRate;
    const validDays = isNaN(durationDays) ? 0 : durationDays;

    const dailyReturn = (investmentAmount * interestRate) / 100;
    const totalReturn = investmentAmount + dailyReturn * durationDays;
    setExpectedReturn(totalReturn);
  };
  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://backend-silvofinance.onrender.com/api/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserBalance(res.data.user?.balance || 0);
    };
    fetchBalance();
  }, []);

  const handleInvestment = async () => {
    console.log(
      "Début investissement - packId:",
      packId,
      "montant:",
      investmentAmount
    );
    if (investmentAmount < minAmount) {
      setError(`Le montant minimum est de ${formatCurrency(minAmount)}`);
      return;
    }

    if (investmentAmount > maxAmount) {
      setError(`Le montant maximum est de ${formatCurrency(maxAmount)}`);
      return;
    }

    if (investmentAmount > userBalance) {
      // Au lieu de simplement afficher une erreur, on affiche le popup
      setShowInsufficientBalancePopup(true);
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      console.log("Envoi requête avec:", {
        packId,
        amount: investmentAmount,
        token: !!token, // Log si token existe
      });
      const response = await axios.post(
        `https://backend-silvofinance.onrender.com/api/investment-packs/${packId}/invest`,
        { amount: investmentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessData({
        investment: response.data.investment,
        message: response.data.message,
      });
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Erreur investissement:", err);
      setError(err.response?.data?.error || "Erreur lors de l'investissement");
      setIsProcessing(false);
    }
  };
  const startInvestment = async () => {
    const distribution = calculateHourlyDistribution(
      expectedReturn - investmentAmount,
      durationDays
    );

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://backend-silvofinance.onrender.com/api/investments",
        {
          amount: investmentAmount,
          packId,
          hourlyPayout: distribution.hourlyAmount,
          durationHours: distribution.totalHours,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Investment error:", error);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const amount = value ? parseInt(value, 10) : 0;
    setInvestmentAmount(amount);

    // Validation en temps réel
    if (amount > 0) {
      if (amount < minAmount) {
        setError(`Le montant minimum est de ${formatCurrency(minAmount)}`);
      } else if (amount > maxAmount) {
        setError(`Le montant maximum est de ${formatCurrency(maxAmount)}`);
      } else if (amount > userBalance) {
        setError(
          `Solde insuffisant. Votre solde: ${formatCurrency(userBalance)}`
        );
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  };
  const handleGoToDeposit = () => {
    setShowInsufficientBalancePopup(false); // Fermer le popup de solde insuffisant
    onClose(); // Fermer le popup d'investissement
    navigate("/deposit-withdrawal"); // Rediriger vers la page de dépôt
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Investissement</h2>
                  <p className="text-blue-100">
                    Depuis votre solde:{" "}
                    {formatCurrency(Number(userBalance) || 0)}
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

          <div className="p-8">
            {/* Résumé de l'investissement */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails de l'Investissement
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pack:</span>
                  <span className="font-medium text-gray-900">{title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux journalier:</span>
                  <span className="font-medium text-green-600">
                    {interestRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-medium text-blue-600">
                    {durationDays} jours
                  </span>
                </div>
              </div>
            </div>

            {/* Saisie du montant */}
            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Montant à investir
              </label>
              <div className="relative rounded-md shadow-sm">
                {/* Remplacement de l'icône DollarSign par le texte FCFA à gauche */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">FCFA</span>
                </div>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-16 pr-12 py-3 border-gray-300 rounded-md text-lg"
                  placeholder="0"
                  value={investmentAmount.toLocaleString("fr-FR")}
                  onChange={handleAmountChange}
                />
                {/* Suppression du doublon FCFA à droite si nécessaire */}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Min: {formatCurrency(minAmount)} - Max:{" "}
                {formatCurrency(maxAmount)}
              </div>
              {error && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}
            </div>

            {/* Détails des gains */}
            <div className="bg-green-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Projection des Gains
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant investi:</span>
                  <span className="font-medium">
                    {formatCurrency(investmentAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gain quotidien:</span>
                  <span className="font-medium text-green-600">
                    +{formatCurrency(expectedReturn / 40)} / Par Jour
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gain total:</span>
                  <span className="font-medium text-green-600">
                    +{formatCurrency(expectedReturn - investmentAmount)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Total à recevoir:
                  </span>
                  <span className="font-bold text-green-600 text-xl">
                    {formatCurrency(expectedReturn)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton de confirmation */}
            <button
              onClick={handleInvestment}
              disabled={isProcessing}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:scale-105 shadow-lg hover:shadow-xl"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>Confirmer l'investissement</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {showSuccessPopup && successData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Investissement réussi</h2>
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  onClose(); // Appeler la callback originale si nécessaire
                }}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>
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
                  <span className="font-bold">{title}</span>
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
                    +{formatCurrency(expectedReturn / 40)}/jour
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-bold">{durationDays} jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total attendu:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(expectedReturn)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  onSuccess(successData);
                  onClose();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold transition-colors duration-300"
              >
                Retour au dashboard
              </button>
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

export default FlutterwavePayment;
