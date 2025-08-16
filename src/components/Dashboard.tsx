import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Bell,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CreditCard,
  PieChart,
  Target,
  Gift,
  User,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Home,
  Truck,
  ShoppingCart,
  Bitcoin,
  Package,
} from "lucide-react";
import axios from "axios";
import MiniStarter from "../images/MiniStarter.jpg";

interface Investment {
  id: number;
  pack_name: string;
  amount: number;
  expected_return: number;
  interest_rate: number;
  end_date?: string;
  endDate?: Date | null;
  formattedEndDate?: string;
  dailyReturn: number;
  totalReturn: number;
  daysRemaining: number;
  duration_days: number;
  progress: number;
  return_percentage_40_days: number;
  available_earnings: number;
  daily_return?: number;
}

interface NotificationPopupProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

const NotificationPopup = ({
  message,
  type,
  onClose,
}: NotificationPopupProps) => {
  const bgColor = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  }[type];

  const icon = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <AlertCircle className="w-6 h-6 text-red-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 border-l-4 ${bgColor} p-4 rounded-lg shadow-lg max-w-sm z-50 flex items-start`}
    >
      <div className="mr-3 mt-1">{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ show: false, message: "", type: "info" });
  // Données utilisateur simulées
  const [userData, setUserData] = useState({
    name: "Chargement...",
    email: "",
    balance: 0,
    totalInvested: 0,
    availableEarnings: 0,
    totalEarnings: 0,
    activeInvestments: 0,
    referralEarnings: 0,
    level: "Bronze",
  });

  // Investissements actifs
  const [activeInvestments, setActiveInvestments] = useState<Investment[]>([]);

  // Historique des transactions
  const [transactions, setTransactions] = useState([]);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);
  const [showInvestmentDetails, setShowInvestmentDetails] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://backend-silvofinance.onrender.com/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Transformez les investissements actifs
      const transformedInvestments =
        response.data.activeInvestments?.map((investment) => {
          const endDate = investment.end_date
            ? new Date(investment.end_date)
            : null;
          const startDate = investment.start_date
            ? new Date(investment.start_date)
            : null;
          let progressPercent = 0;
          const durationDays = investment.duration_days || 30;
          const daysRemaining = endDate
            ? Math.ceil(
                (endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
            : durationDays;

          // Assurez-vous que les valeurs numériques sont bien converties
          const amount = Number(investment.amount) || 0;
          const interestRate = Number(investment.interest_rate) || 0;
          const dailyReturn = amount * (interestRate / 100);
          const totalReturn = amount + dailyReturn * durationDays;

          if (startDate && endDate) {
            const totalDuration = endDate.getTime() - startDate.getTime();
            const elapsed = Date.now() - startDate.getTime();
            progressPercent = Math.min(
              100,
              Math.max(0, (elapsed / totalDuration) * 100)
            );
          }

          return {
            ...investment,
            amount, // Conversion explicite
            interest_rate: interestRate, // Conversion explicite
            endDate,
            formattedEndDate:
              endDate?.toLocaleDateString("fr-FR") || "Date inconnue",
            dailyReturn,
            totalReturn,
            daysRemaining,
            duration_days: durationDays,
            progress: Math.round(progressPercent),
          };
        }) || [];

      setUserData({
        ...userData,
        name: response.data.user?.full_name || "Utilisateur",
        email: response.data.user?.email || "",
        balance: Number(response.data.user?.balance ?? 0),
        totalInvested: transformedInvestments.reduce(
          (sum, inv) => sum + (Number(inv.amount) || 0),
          0
        ),
        totalEarnings: parseFloat(response.data.user?.totalEarnings ?? 0),
        activeInvestments: transformedInvestments.length,
        referralEarnings: Number(response.data.user?.referral_earnings ?? 0),
        level: response.data.user?.level || "Bronze",
      });

      setActiveInvestments(transformedInvestments);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  useEffect(() => {
    const ids = activeInvestments.map((inv) => inv.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      console.warn("❗ Clés dupliquées détectées :", duplicates);
    }
  }, [activeInvestments]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend-silvofinance.onrender.com/api/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications :", error);
      }
    };

    fetchNotifications();
  }, []);

  // Modifiez la fonction formatCurrency pour gérer les nombres
  const formatCurrency = (amount: number) => {
    return (
      new Intl.NumberFormat("fr-FR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount) + " FCFA"
    );
  };

  // Notifications

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Bonjour, {userData.name}</h1>
                <p className="text-blue-100">Bienvenue sur votre dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Bouton Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-300"
                >
                  <Bell className="w-6 h-6 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Menu utilisateur */}
              <div className="flex items-center space-x-2">
                <Link
                  to="/deposit-withdrawal"
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-300"
                >
                  <CreditCard className="w-6 h-6 text-white" />
                </Link>
                <Link
                  to="/referral"
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-300"
                >
                  <Users className="w-6 h-6 text-white" />
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.href = "/";
                  }}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-300"
                >
                  <LogOut className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showBalance ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Solde Total
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {showBalance ? formatCurrency(userData.balance) : "••••••"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Gains Totaux
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {showBalance ? formatCurrency(userData.totalEarnings) : "••••••"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Investissements Actifs
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {userData.activeInvestments}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              {showBalance ? formatCurrency(userData.totalInvested) : "••••••"}{" "}
              investis
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Commissions
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {showBalance
                ? formatCurrency(userData.referralEarnings)
                : "••••••"}
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              Niveau {userData.level}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Investissements actifs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Investissements Actifs
                </h2>
                <Link
                  to="/packs"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Investir</span>
                </Link>
              </div>

              <div className="space-y-6">
                {activeInvestments.map((investment) => (
                  <div
                    key={`${investment.id}`}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {investment.pack_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Investissement : {formatCurrency(investment.amount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          +{formatCurrency(investment.expected_return / 40)}
                          /jour
                        </p>
                        <p className="text-sm text-gray-600">
                          {investment.daysRemaining} jours restants
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progression</span>
                        <span>{investment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${investment.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Date de fin :</span>
                        <span className="font-medium ml-2">
                          {investment.formattedEndDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total attendu :</span>
                        <span className="font-bold text-green-600 ml-2">
                          {formatCurrency(investment.expected_return)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedInvestment(investment);
                        setShowInvestmentDetails(true);
                      }}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                    >
                      Voir détails et récupérer gains
                    </button>
                  </div>
                ))}

                {showInvestmentDetails && selectedInvestment && (
                  <div className="text-center py-12">
                    <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun investissement actif
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Commencez dès maintenant avec nos packs à partir de 10 000
                      FCFA
                    </p>
                    <Link
                      to="/packs"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Faire mon premier investissement</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Historique des transactions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Historique des Transactions
              </h2>

              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "investment"
                            ? "bg-blue-100"
                            : transaction.type === "earning"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        {transaction.type === "investment" ? (
                          <ArrowDownRight
                            className={`w-5 h-5 ${
                              transaction.type === "investment"
                                ? "text-blue-600"
                                : transaction.type === "earning"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          />
                        ) : (
                          <ArrowUpRight
                            className={`w-5 h-5 ${
                              transaction.type === "investment"
                                ? "text-blue-600"
                                : transaction.type === "earning"
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Actions Rapides
              </h3>

              <div className="space-y-3">
                <Link
                  to="/packs"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nouvel Investissement</span>
                </Link>

                <Link
                  to="/deposit-withdrawal"
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Dépôt / Retrait</span>
                </Link>

                <Link
                  to="/referral"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Parrainage</span>
                </Link>
              </div>
            </div>

            {/* Prochains paiements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Prochains Paiements
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Demain</p>
                    <p className="text-sm text-gray-600">
                      +1 875 FCFA (gains quotidiens)
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">11 Déc 2024</p>
                    <p className="text-sm text-gray-600">
                      +50 000 FCFA (fin Pack Croissance)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Notifications */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6" />
                <h2 className="text-lg font-bold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
                        !notification.read
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {notification.time}
                              </span>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p
                            className={`text-sm ${
                              !notification.read
                                ? "text-gray-700"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune notification
                  </h3>
                  <p className="text-gray-600">Vous êtes à jour !</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="bg-gray-50 p-4 border-t">
                <div className="flex items-center justify-between">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Marquer tout comme lu
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-700">
                    Effacer tout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup Détails Investissement */}
      {showInvestmentDetails && selectedInvestment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Détails de l'investissement</h2>
              <button
                onClick={() => setShowInvestmentDetails(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6 text-center">
                <img
                  src={MiniStarter}
                  alt="Machine d'investissement"
                  className="mx-auto w-48 h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedInvestment.pack_name}
                </h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Investissement initial:</span>
                  <span className="font-bold">
                    {formatCurrency(selectedInvestment.amount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Gains quotidiens:</span>
                  <span className="font-bold text-green-600">
                    +{formatCurrency(selectedInvestment.expected_return / 40)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jours restants:</span>
                  <span className="font-bold">
                    {selectedInvestment.days_remaining}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date de fin :</span>
                  <span className="font-medium">
                    {selectedInvestment.formattedEndDate ||
                      (selectedInvestment.endDate
                        ? selectedInvestment.endDate.toLocaleDateString("fr-FR")
                        : "Date inconnue")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total attendu:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(selectedInvestment.expected_return)}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Progression</h4>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{selectedInvestment.progress}% complété</span>
                  <span>{100 - selectedInvestment.progress}% restant</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${selectedInvestment.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Répartition par secteur */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Répartition de votre investissement
                </h4>

                {/* Diagramme circulaire */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* E-commerce (toujours présent) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="10"
                      strokeDasharray={`${
                        selectedInvestment.amount >= 50000 ? 70 : 85
                      } 100`}
                      strokeDashoffset="25"
                      transform="rotate(-90 50 50)"
                    />

                    {/* Finance & Crypto (toujours présent) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="10"
                      strokeDasharray={`${
                        selectedInvestment.amount >= 50000
                          ? 50
                          : selectedInvestment.amount >= 10000
                          ? 70
                          : 100
                      } 100`}
                      strokeDashoffset={
                        selectedInvestment.amount >= 50000
                          ? -70
                          : selectedInvestment.amount >= 10000
                          ? -85
                          : -25
                      }
                      transform="rotate(-90 50 50)"
                    />

                    {/* Immobilier (à partir de 10 000 FCFA) */}
                    {selectedInvestment.amount >= 10000 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        strokeDasharray={`${
                          selectedInvestment.amount >= 50000 ? 30 : 25
                        } 100`}
                        strokeDashoffset={
                          selectedInvestment.amount >= 50000
                            ? -120
                            : selectedInvestment.amount >= 20000
                            ? -155
                            : -170
                        }
                        transform="rotate(-90 50 50)"
                      />
                    )}

                    {/* Transport (à partir de 20 000 FCFA) */}
                    {selectedInvestment.amount >= 20000 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray={`${
                          selectedInvestment.amount >= 50000 ? 20 : 15
                        } 100`}
                        strokeDashoffset={
                          selectedInvestment.amount >= 50000 ? -150 : -180
                        }
                        transform="rotate(-90 50 50)"
                      />
                    )}

                    {/* Livraisons (à partir de 50 000 FCFA) */}
                    {selectedInvestment.amount >= 50000 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="10"
                        strokeDasharray="5 100"
                        strokeDashoffset="-195"
                        transform="rotate(-90 50 50)"
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">
                      {selectedInvestment.amount >= 50000
                        ? "5 secteurs"
                        : selectedInvestment.amount >= 20000
                        ? "4 secteurs"
                        : selectedInvestment.amount >= 10000
                        ? "3 secteurs"
                        : "2 secteurs"}
                    </span>
                  </div>
                </div>

                {/* Légende et détails */}
                <div className="space-y-3">
                  {/* E-commerce */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700">E-commerce</span>
                    </div>
                    <span className="font-medium">
                      {selectedInvestment.amount >= 50000
                        ? "35%"
                        : selectedInvestment.amount >= 10000
                        ? "30%"
                        : "70%"}{" "}
                      •{" "}
                      {formatCurrency(
                        selectedInvestment.amount *
                          (selectedInvestment.amount >= 50000
                            ? 0.35
                            : selectedInvestment.amount >= 10000
                            ? 0.3
                            : 0.7)
                      )}
                    </span>
                  </div>

                  {/* Finance & Crypto */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-yellow-100 rounded-md flex items-center justify-center">
                        <Bitcoin className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="text-gray-700">Finance & Crypto</span>
                    </div>
                    <span className="font-medium">
                      {selectedInvestment.amount >= 50000
                        ? "25%"
                        : selectedInvestment.amount >= 10000
                        ? "25%"
                        : "30%"}{" "}
                      •{" "}
                      {formatCurrency(
                        selectedInvestment.amount *
                          (selectedInvestment.amount >= 50000
                            ? 0.25
                            : selectedInvestment.amount >= 10000
                            ? 0.25
                            : 0.3)
                      )}
                    </span>
                  </div>

                  {/* Immobilier (à partir de 10 000 FCFA) */}
                  {selectedInvestment.amount >= 10000 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                          <Home className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-gray-700">Immobilier</span>
                      </div>
                      <span className="font-medium">
                        {selectedInvestment.amount >= 50000 ? "20%" : "25%"} •{" "}
                        {formatCurrency(
                          selectedInvestment.amount *
                            (selectedInvestment.amount >= 50000 ? 0.2 : 0.25)
                        )}
                      </span>
                    </div>
                  )}

                  {/* Transport (à partir de 20 000 FCFA) */}
                  {selectedInvestment.amount >= 20000 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                          <Truck className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">Transport</span>
                      </div>
                      <span className="font-medium">
                        {selectedInvestment.amount >= 50000 ? "15%" : "20%"} •{" "}
                        {formatCurrency(
                          selectedInvestment.amount *
                            (selectedInvestment.amount >= 50000 ? 0.15 : 0.2)
                        )}
                      </span>
                    </div>
                  )}

                  {/* Livraisons (à partir de 50 000 FCFA) */}
                  {selectedInvestment.amount >= 50000 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center">
                          <Package className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-gray-700">Livraisons</span>
                      </div>
                      <span className="font-medium">
                        5% • {formatCurrency(selectedInvestment.amount * 0.05)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-blue-800 mb-2">
                  Gains disponibles
                </h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  +
                  {showBalance
                    ? formatCurrency(selectedInvestment.available_earnings)
                    : "••••••"}
                </p>
                <p className="text-sm text-blue-700">
                  Ces gains peuvent être transférés sur votre solde principal
                </p>
              </div>

              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const response = await axios.post(
                      "https://backend-silvofinance.onrender.com/api/earnings/claim",
                      {
                        investmentId: selectedInvestment.id,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    if (response.data.success) {
                      await fetchDashboardData();
                      setShowInvestmentDetails(false);
                      setNotification({
                        show: true,
                        message: `Gains transférés avec succès ! (${formatCurrency(
                          response.data.amount
                        )})`,
                        type: "success",
                      });
                      // Fermer automatiquement après 5 secondes
                      setTimeout(
                        () => setNotification({ ...notification, show: false }),
                        5000
                      );
                    } else {
                      setNotification({
                        show: true,
                        message:
                          response.data.error || "Une erreur est survenue",
                        type: "error",
                      });
                    }
                  } catch (error) {
                    console.error("Erreur:", error);
                    const errorMessage =
                      error.response?.data?.error ||
                      error.message ||
                      "Une erreur est survenue lors du transfert des gains";
                    setNotification({
                      show: true,
                      message: errorMessage,
                      type: "error",
                    });
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <DollarSign className="w-5 h-5" />
                <span>Récupérer mes gains</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {notification.show && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}
    </div>
  );
};

export default Dashboard;
