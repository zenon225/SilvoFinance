import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Shield, Star, Clock, Calculator, 
  CheckCircle, Zap, Crown, Gem, Calendar, 
  ArrowRight, Target, DollarSign, Loader2 
} from 'lucide-react';
import AuthModal from './AuthModal';
import FlutterwavePayment from './FlutterwavePayment';
import axios from 'axios';

interface InvestmentPack {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  interest_rate: number;
  duration_days: number;
  created_at: string;
  return_percentage_40_days: number;
  is_active: boolean;
}

const InvestmentPacks: React.FC = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [packs, setPacks] = useState<InvestmentPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showFlutterwaveModal, setShowFlutterwaveModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState<InvestmentPack | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await axios.get('http://localhost:10000/api/investment-packs');
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format de réponse invalide');
        }

        setPacks(response.data);
      } catch (err) {
        console.error('Erreur API:', err);
        setError(err.message || 'Erreur lors du chargement des packs');
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
  };

  
 const calculateProfit = (pack: InvestmentPack) => {
  // Calcul du rendement total (capital + intérêts cumulés)
  const totalReturn = pack.min_amount * (1 + pack.return_percentage_40_days / 100);
  const maxTotalReturn = pack.max_amount * (1 + pack.return_percentage_40_days / 100);

   // Calcul du rendement quotidien (2.5% du montant investi)
  const dailyReturnMin = totalReturn / 40;
  // Calcul du rendement quotidien (2.5% du montant investi)
  const dailyReturn = maxTotalReturn / 40;
 
  // Pour le montant maximum
  const maxDailyReturn = pack.max_amount * (pack.interest_rate / 100);
  

   // Bénéfice total (intérêts seulement)
  const profit = totalReturn - pack.min_amount;
  const maxProfit = maxTotalReturn - pack.max_amount;

  return {
    dailyReturn: dailyReturn,
    totalReturn: totalReturn,
    profit: profit,
    maxDailyReturn: maxDailyReturn,
    maxTotalReturn: maxTotalReturn,
    maxProfit: maxProfit,
    period: pack.duration_days,
    dailyReturnMin: dailyReturnMin
  };
};

  const handlePackDetailClick = (packId: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInvestClick = (pack: InvestmentPack) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedPack(pack);
    setSelectedAmount(pack.min_amount);
    setShowFlutterwaveModal(true);
  };

  const handleFlutterwaveSuccess = (response: any) => {
    console.log('Investissement réussi:', response);
    setShowFlutterwaveModal(false);
    setSelectedPack(null);
    setSelectedAmount(0);
    alert(`Investissement de ${formatCurrency(selectedAmount)} dans le ${selectedPack?.name} réussi !`);
  };

  const handleFlutterwaveClose = () => {
    setShowPaymentModal(false);
    setShowFlutterwaveModal(false);
    setSelectedPack(null);
    setSelectedAmount(0);
  };

  const getPackIcon = (packName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Mini Starter': TrendingUp,
      'Pack Croissance': Star,
      'Starter': Zap,
      'Essentiel': Shield,
      'Business': Crown,
      'Premium': Gem,
      'Élite': Target
    };
    return iconMap[packName] || TrendingUp;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
        <span className="ml-3">Chargement des packs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const activePacks = [...packs]
  .filter(pack => pack.is_active)
  .sort((a, b) => a.min_amount - b.min_amount);

  if (activePacks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-500 mb-4">Aucun pack d'investissement disponible actuellement</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Actualiser
        </button>
      </div>
    );
  }
  const fetchInvestmentData  = () => {
    window.location.href = '/dashboard'; // Redirection simple
    // Ou pour une navigation SPA (si vous utilisez React Router):
    // navigate('/dashboard'); 
  };


  return (
    <>
      <section id="investment-packs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nos <span className="text-blue-600">Packs d'Investissement</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le pack qui correspond à vos objectifs financiers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activePacks.map((pack) => {
              const returns = calculateProfit(pack);
              const PackIcon = getPackIcon(pack.name);
              
              return (
                <div key={pack.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                    <PackIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pack.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{pack.description}</p>
                  
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Investissement:</span>
                      <span className="font-medium">{formatCurrency(pack.min_amount)} - {formatCurrency(pack.max_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Durée:</span>
                      <span className="font-medium text-blue-600">{pack.duration_days} jours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Taux journalier:</span>
                      <span className="font-medium text-green-600">{pack.interest_rate}%</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between">
                      <span className="text-sm text-gray-500">Gain quotidien:</span>
                      <span className="font-bold text-purple-600">{formatCurrency(returns.dailyReturnMin)} - {formatCurrency(returns.dailyReturn)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm">
                      <Calculator className="w-4 h-4 mr-1" /> Simulation
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Bénéfice (min):</span>
                        <span className="font-bold text-green-600">+{formatCurrency(returns.profit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bénéfice (max):</span>
                        <span className="font-bold text-green-600">+{formatCurrency(returns.maxProfit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total final (min):</span>
                        <span className="font-bold text-blue-600">{formatCurrency(returns.totalReturn)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total final (max):</span>
                        <span className="font-bold text-blue-600">{formatCurrency(returns.maxTotalReturn)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link 
                      to={`/pack/${pack.id}`}
                      className="flex-1 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 text-center text-sm"
                    >
                      Détails
                    </Link>
                    <button 
                      onClick={() => handleInvestClick(pack)}
                      className="flex-1 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 text-sm"
                    >
                      Investir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tableau comparatif */}
          
        </div>
      </section>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {showFlutterwaveModal && selectedPack && (
        <FlutterwavePayment
          amount={selectedAmount}
          currency="XOF"
          interestRate={selectedPack.interest_rate}
          durationDays={selectedPack.duration_days}
          title={selectedPack.name}
          description={`Investissement ${selectedPack.name} - ${selectedPack.interest_rate}% par jour`}
          customerEmail="user@example.com"
          customerPhone="+22500000000"
          customerName="Utilisateur"
          onSuccess={() => {
            fetchInvestmentData(); // Utilise la fonction maintenant définie
            setShowFlutterwaveModal(false); // Utilise le bon state
           // Supprimez l'alert() ici pour éviter les doublons
          }}
          onClose={() => setShowFlutterwaveModal(false)} // Utilise le bon state
          metadata={{
            pack_id: selectedPack.id,
            pack_name: selectedPack.name,
            investment_period: selectedPack.duration_days,
            daily_return: selectedPack.interest_rate,
            transaction_type: 'investment'
          }}
          minAmount={selectedPack.min_amount}
          maxAmount={selectedPack.max_amount}
          packId={selectedPack.id}
        />
      )}
    </>
  );
};

export default InvestmentPacks;