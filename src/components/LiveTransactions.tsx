import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Users, DollarSign, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  user: string;
  pack: string;
  timestamp: Date;
  location: string;
}

const LiveTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 8247,
    totalDeposits: 2847500000,
    totalWithdrawals: 1923750000,
    activeInvestments: 3421
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' XOF';
  };

  // Format compact pour les grands nombres sur mobile
  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(1) + 'Md XOF';
    } else if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M XOF';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'K XOF';
    }
    return formatCurrency(amount);
  };

  const generateRandomTransaction = (): Transaction => {
    const users = [
      'Aminata T.', 'Moussa D.', 'Fatou S.', 'Ibrahim K.', 'Aïcha C.', 'Ousmane B.',
      'Mariam T.', 'Sekou K.', 'Kadiatou D.', 'Mamadou S.', 'Fatoumata B.', 'Youssouf T.',
      'Rokia D.', 'Bakary K.', 'Hawa S.', 'Adama T.', 'Salimata D.', 'Boubacar K.'
    ];
    
    const packs = [
      'Pack Découverte', 'Pack Starter', 'Pack Croissance', 
      'Pack Performance', 'Pack Elite', 'Pack Prestige'
    ];
    
    const locations = [
      'Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Korhogo',
      'Man', 'Divo', 'Gagnoa', 'Abengourou', 'Grand-Bassam', 'Bondoukou'
    ];

    const amounts = {
      'deposit': [10000, 25000, 50000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000, 1500000, 2000000],
      'withdrawal': [25000, 75000, 150000, 300000, 420000, 760000, 1200000, 2000000, 3250000, 4500000, 8250000, 42500000]
    };

    const type = Math.random() > 0.4 ? 'deposit' : 'withdrawal';
    const amountOptions = amounts[type];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount: amountOptions[Math.floor(Math.random() * amountOptions.length)],
      user: users[Math.floor(Math.random() * users.length)],
      pack: packs[Math.floor(Math.random() * packs.length)],
      timestamp: new Date(),
      location: locations[Math.floor(Math.random() * locations.length)]
    };
  };

  useEffect(() => {
    // Générer quelques transactions initiales
    const initialTransactions = Array.from({ length: 5 }, generateRandomTransaction);
    setTransactions(initialTransactions);

    // Ajouter une nouvelle transaction toutes les 3-8 secondes
    const interval = setInterval(() => {
      const newTransaction = generateRandomTransaction();
      setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]); // Garder seulement les 10 dernières
      
      // Mettre à jour les statistiques
      setStats(prev => ({
        totalUsers: prev.totalUsers + (Math.random() > 0.7 ? 1 : 0),
        totalDeposits: prev.totalDeposits + (newTransaction.type === 'deposit' ? newTransaction.amount : 0),
        totalWithdrawals: prev.totalWithdrawals + (newTransaction.type === 'withdrawal' ? newTransaction.amount : 0),
        activeInvestments: prev.activeInvestments + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)
      }));
    }, Math.random() * 5000 + 3000); // Entre 3 et 8 secondes

    return () => clearInterval(interval);
  }, []);

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' 
      ? <ArrowDownRight className="w-4 h-4 text-green-500" />
      : <ArrowUpRight className="w-4 h-4 text-blue-500" />;
  };

  const getTransactionColor = (type: string) => {
    return type === 'deposit' 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-blue-600 bg-blue-50 border-blue-200';
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Activité en <span className="gradient-text">Temps Réel</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez l'activité de notre plateforme avec les dépôts et retraits en cours.
            <span className="block mt-2 text-green-600 font-semibold">
              🔴 LIVE • Transactions actualisées en temps réel
            </span>
          </p>
        </div>

        {/* Statistiques en temps réel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-12">
          <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg text-center">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Users className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div className="text-lg md:text-2xl font-bold text-gray-900 break-words">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Investisseurs Actifs</div>
          </div>

          <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg text-center">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <ArrowDownRight className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
            </div>
            {/* Version mobile avec format compact */}
            <div className="block md:hidden">
              <div className="text-sm font-bold text-green-600 break-words leading-tight">
                {formatCompactCurrency(stats.totalDeposits)}
              </div>
            </div>
            {/* Version desktop avec format complet */}
            <div className="hidden md:block">
              <div className="text-xl lg:text-2xl font-bold text-green-600 break-words leading-tight">
                {formatCurrency(stats.totalDeposits)}
              </div>
            </div>
            <div className="text-xs md:text-sm text-gray-600">Total Dépôts</div>
          </div>

          <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg text-center">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
            </div>
            {/* Version mobile avec format compact */}
            <div className="block md:hidden">
              <div className="text-sm font-bold text-purple-600 break-words leading-tight">
                {formatCompactCurrency(stats.totalWithdrawals)}
              </div>
            </div>
            {/* Version desktop avec format complet */}
            <div className="hidden md:block">
              <div className="text-xl lg:text-2xl font-bold text-purple-600 break-words leading-tight">
                {formatCurrency(stats.totalWithdrawals)}
              </div>
            </div>
            <div className="text-xs md:text-sm text-gray-600">Total Retraits</div>
          </div>

          <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg text-center">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <div className="text-lg md:text-2xl font-bold text-yellow-600 break-words">
              {stats.activeInvestments.toLocaleString()}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Investissements Actifs</div>
          </div>
        </div>

        {/* Flux de transactions en temps réel */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg md:text-xl font-bold">Transactions en Direct</h3>
              </div>
              <div className="flex items-center space-x-2 text-xs md:text-sm">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Mis à jour en temps réel</span>
                <span className="sm:hidden">LIVE</span>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
              {transactions.map((transaction, index) => (
                <div 
                  key={transaction.id}
                  className={`flex items-center justify-between p-3 md:p-4 rounded-lg border transition-all duration-500 ${
                    getTransactionColor(transaction.type)
                  } ${index === 0 ? 'animate-pulse' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    opacity: Math.max(1 - (index * 0.1), 0.6)
                  }}
                >
                  <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
                    {getTransactionIcon(transaction.type)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <span className="font-semibold text-gray-900 text-sm md:text-base truncate">
                          {transaction.user}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500">•</span>
                        <span className="text-xs md:text-sm text-gray-600 truncate">
                          {transaction.location}
                        </span>
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 truncate">
                        {transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'} • {transaction.pack}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className={`font-bold text-sm md:text-lg break-words ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {/* Version mobile avec format compact pour les gros montants */}
                      <div className="block sm:hidden">
                        {transaction.amount >= 1000000 
                          ? formatCompactCurrency(transaction.amount)
                          : `${transaction.type === 'deposit' ? '+' : ''}${formatCurrency(transaction.amount)}`
                        }
                      </div>
                      {/* Version desktop avec format complet */}
                      <div className="hidden sm:block">
                        {transaction.type === 'deposit' ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chargement des transactions en cours...</p>
              </div>
            )}
          </div>
        </div>

        {/* Indicateurs de confiance */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">99.8%</div>
            <div className="text-xs md:text-sm text-gray-600">Taux de Satisfaction</div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">{'< 2h'}</div>
            <div className="text-xs md:text-sm text-gray-600">Temps de Traitement</div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-xs md:text-sm text-gray-600">Support Disponible</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveTransactions;