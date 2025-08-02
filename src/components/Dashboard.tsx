import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Package
} from 'lucide-react';
import axios from 'axios';
import MiniStarter from '../images/MiniStarter.jpg';

 interface Investment {
  id: number;
  pack_name: string;
  amount: number;
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
  available_earnings?: number;
  daily_return?: number; // Ajouté pour correspondre à votre usage
}

const Dashboard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // Données utilisateur simulées
  const [userData, setUserData] = useState({
    name: 'Chargement...',
    email: '',
    balance: 0,
    totalInvested: 0,
    totalEarnings: 0,
    activeInvestments: 0,
    referralEarnings: 0,
    level: 'Bronze'
  });

  // Investissements actifs
  const [activeInvestments, setActiveInvestments] = useState<Investment[]>([]);

  // Historique des transactions
  const [transactions, setTransactions] = useState([]);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showInvestmentDetails, setShowInvestmentDetails] = useState(false);

  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Transformez les investissements actifs
        const transformedInvestments = response.data.activeInvestments?.map(investment => {
          const endDate = investment.end_date ? new Date(investment.end_date) : null;
          const durationDays = investment.duration_days || 30;
          const daysRemaining = endDate ? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : durationDays;

          // Assurez-vous que les valeurs numériques sont bien converties
          const amount = Number(investment.amount) || 0;
          const interestRate = Number(investment.interest_rate) || 0;
          const dailyReturn = amount * (interestRate / 100);
          const totalReturn = amount + (dailyReturn * durationDays);
        
          return {
            ...investment,
            amount, // Conversion explicite
            interest_rate: interestRate, // Conversion explicite
            endDate,
            formattedEndDate: endDate?.toLocaleDateString('fr-FR') || 'Date inconnue',
            dailyReturn,
            totalReturn,
            daysRemaining,
            duration_days: durationDays,
            progress: Math.round(((durationDays - daysRemaining) / durationDays) * 100)
          };
        }) || [];

        setUserData({
          name: response.data.user?.full_name || 'Utilisateur',
          email: response.data.user?.email || '',
          balance: Number(response.data.user?.balance) || 0,
          totalInvested: transformedInvestments.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0), // Calcul basé sur les investissements actifs
          totalEarnings: Number(response.data.user?.total_earnings) || 0,
          activeInvestments: transformedInvestments.length,
          referralEarnings: Number(response.data.user?.referral_earnings) || 0,
          level: response.data.user?.level || 'Bronze'
        });


        setActiveInvestments(transformedInvestments);
        setTransactions(response.data.transactions || []);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
      
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.isRead).length);
      } catch (err) {
        console.error('Erreur lors de la récupération des notifications:', err);
      }
    };

    fetchNotifications();
  }, []);



  // Modifiez la fonction formatCurrency pour gérer les nombres
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
  };

  // Notifications
  

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };


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
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
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
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Solde Total</h3>
            <p className="text-2xl font-bold text-gray-900">
              {showBalance ? formatCurrency(userData.balance) : '••••••'}
            </p>
            <p className="text-sm text-green-600 mt-2">+12.5% ce mois</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Gains Totaux</h3>
            <p className="text-2xl font-bold text-gray-900">
              {showBalance ? formatCurrency(userData.totalEarnings) : '••••••'}
            </p>
            <p className="text-sm text-green-600 mt-2">+2 500 FCFA aujourd'hui</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Investissements Actifs</h3>
            <p className="text-2xl font-bold text-gray-900">{userData.activeInvestments}</p>
            <p className="text-sm text-blue-600 mt-2">
              {showBalance ? formatCurrency(userData.totalInvested) : '••••••'} investis
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Commissions</h3>
            <p className="text-2xl font-bold text-gray-900">
              {showBalance ? formatCurrency(userData.referralEarnings) : '••••••'}
            </p>
            <p className="text-sm text-yellow-600 mt-2">Niveau {userData.level}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Investissements actifs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Investissements Actifs</h2>
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
                 <div key={investment.id} className="border border-gray-200 rounded-lg p-6">
                   <div className="flex items-center justify-between mb-4">
                     <div>
                       <h3 className="text-lg font-semibold text-gray-900">{investment.pack_name}</h3>
                       <p className="text-sm text-gray-600">
                         Investissement : {formatCurrency(investment.amount)}
                       </p>
                     </div>
                     <div className="text-right">
                       <p className="text-lg font-bold text-green-600">
                         +{formatCurrency(investment.amount * investment.interest_rate)}/jour
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
                          {formatCurrency(investment.totalReturn)}
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

                {activeInvestments.length === 0 && (
                  <div className="text-center py-12">
                    <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun investissement actif</h3>
                    <p className="text-gray-600 mb-6">
                      Commencez dès maintenant avec nos packs à partir de 10 000 FCFA
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
              <h2 className="text-xl font-bold text-gray-900 mb-6">Historique des Transactions</h2>
              
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'investment' ? 'bg-blue-100' :
                        transaction.type === 'earning' ? 'bg-green-100' :
                        'bg-yellow-100'
                      }`}>
                        {transaction.type === 'investment' ? (
                          <ArrowDownRight className={`w-5 h-5 ${
                            transaction.type === 'investment' ? 'text-blue-600' :
                            transaction.type === 'earning' ? 'text-green-600' :
                            'text-yellow-600'
                          }`} />
                        ) : (
                          <ArrowUpRight className={`w-5 h-5 ${
                            transaction.type === 'investment' ? 'text-blue-600' :
                            transaction.type === 'earning' ? 'text-green-600' :
                            'text-yellow-600'
                          }`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions Rapides</h3>
              
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

            {/* Gains du jour */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Gains d'Aujourd'hui</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pack Croissance:</span>
                  <span className="font-bold text-green-600">+625 FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Starter:</span>
                  <span className="font-bold text-green-600">+1 250 FCFA</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-green-600 text-lg">+1 875 FCFA</span>
                </div>
              </div>
            </div>

            {/* Prochains paiements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Prochains Paiements</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Demain</p>
                    <p className="text-sm text-gray-600">+1 875 FCFA (gains quotidiens)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">11 Déc 2024</p>
                    <p className="text-sm text-gray-600">+50 000 FCFA (fin Pack Croissance)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Notifications */}
      {notifications.map((notification) => (
  <div 
    key={notification.id} 
    className={`p-4 hover:bg-gray-50 transition-colors duration-200 ${
      !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
    }`}
  >
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type || 'info')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-sm font-medium ${
            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {notification.title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {notification.time}
            </span>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
        <p className={`text-sm ${
          !notification.isRead ? 'text-gray-700' : 'text-gray-600'
        }`}>
          {notification.message}
        </p>
      </div>
    </div>
  </div>
))}

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
          <h3 className="text-xl font-bold text-gray-900">{selectedInvestment.pack_name}</h3>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Investissement initial:</span>
            <span className="font-bold">{formatCurrency(selectedInvestment.amount)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Gains quotidiens:</span>
            <span className="font-bold text-green-600">+{formatCurrency(selectedInvestment.daily_return)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Jours restants:</span>
            <span className="font-bold">{selectedInvestment.days_remaining}</span>
          </div>
           <div className="flex justify-between">
        <span className="text-gray-600">Date de fin :</span>
        <span className="font-medium">
          {selectedInvestment.formattedEndDate || 
           (selectedInvestment.endDate ? selectedInvestment.endDate.toLocaleDateString('fr-FR') : 'Date inconnue')}
        </span>
      </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total attendu:</span>
            <span className="font-bold text-green-600">{formatCurrency(selectedInvestment.totalReturn)}</span>
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
          <h4 className="font-medium text-gray-900 mb-3">Répartition de votre investissement</h4>
          
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
                strokeDasharray={`${selectedInvestment.amount >= 50000 ? 70 : 85} 100`}
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
                strokeDasharray={`${selectedInvestment.amount >= 50000 ? 50 : selectedInvestment.amount >= 10000 ? 70 : 100} 100`}
                strokeDashoffset={selectedInvestment.amount >= 50000 ? -70 : selectedInvestment.amount >= 10000 ? -85 : -25}
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
                  strokeDasharray={`${selectedInvestment.amount >= 50000 ? 30 : 25} 100`}
                  strokeDashoffset={selectedInvestment.amount >= 50000 ? -120 : selectedInvestment.amount >= 20000 ? -155 : -170}
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
                  strokeDasharray={`${selectedInvestment.amount >= 50000 ? 20 : 15} 100`}
                  strokeDashoffset={selectedInvestment.amount >= 50000 ? -150 : -180}
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
                {selectedInvestment.amount >= 50000 ? '5 secteurs' : 
                 selectedInvestment.amount >= 20000 ? '4 secteurs' : 
                 selectedInvestment.amount >= 10000 ? '3 secteurs' : '2 secteurs'}
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
                {selectedInvestment.amount >= 50000 ? '35%' : 
                 selectedInvestment.amount >= 10000 ? '30%' : '70%'} •{' '}
                {formatCurrency(selectedInvestment.amount * 
                  (selectedInvestment.amount >= 50000 ? 0.35 : 
                   selectedInvestment.amount >= 10000 ? 0.30 : 0.70))}
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
                {selectedInvestment.amount >= 50000 ? '25%' : 
                 selectedInvestment.amount >= 10000 ? '25%' : '30%'} •{' '}
                {formatCurrency(selectedInvestment.amount * 
                  (selectedInvestment.amount >= 50000 ? 0.25 : 
                   selectedInvestment.amount >= 10000 ? 0.25 : 0.30))}
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
                  {selectedInvestment.amount >= 50000 ? '20%' : '25%'} •{' '}
                  {formatCurrency(selectedInvestment.amount * 
                    (selectedInvestment.amount >= 50000 ? 0.20 : 0.25))}
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
                  {selectedInvestment.amount >= 50000 ? '15%' : '20%'} •{' '}
                  {formatCurrency(selectedInvestment.amount * 
                    (selectedInvestment.amount >= 50000 ? 0.15 : 0.20))}
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
          <h4 className="font-medium text-blue-800 mb-2">Gains disponibles</h4>
          <p className="text-2xl font-bold text-blue-600 mb-2">
            +{formatCurrency(selectedInvestment.available_earnings)}
          </p>
          <p className="text-sm text-blue-700">
            Ces gains peuvent être transférés sur votre solde principal
          </p>
        </div>

        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem('token');
              await axios.post('http://localhost:3001/api/claim-earnings', {
                investmentId: selectedInvestment.id
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              
              // Rafraîchir les données
              fetchDashboardData();
              setShowInvestmentDetails(false);
              alert('Gains transférés avec succès !');
            } catch (error) {
              console.error('Erreur:', error);
              alert('Une erreur est survenue lors du transfert des gains');
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
      
    </div>
  );
};

export default Dashboard;