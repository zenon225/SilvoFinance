import { useState, useEffect } from 'react';

interface InvestmentPack {
  id: string;
  name: string;
  description: string;
  investment: number;
  dailyReturn: number;
  totalReturn: number;
  period: number;
  features: string[];
  popular: boolean;
  riskLevel: string;
  color: string;
  icon?: string; // Nous allons mapper les icônes
}

const useInvestmentPacks = () => {
  const [packs, setPacks] = useState<InvestmentPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await fetch('https://backend-silvofinance.onrender.com/api/investment-packs');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const apiPacks = await response.json();
        
        // Transformation des données de l'API pour correspondre à votre structure
        const transformedPacks = apiPacks.map((apiPack: any) => ({
          id: apiPack.id.toString(),
          name: apiPack.name,
          description: apiPack.description,
          investment: apiPack.min_amount,
          dailyReturn: apiPack.min_amount * (apiPack.interest_rate / 100), // Calcul basé sur le taux d'intérêt
          totalReturn: apiPack.min_amount * (1 + (apiPack.interest_rate / 100 * apiPack.duration_days / 365)), // Calcul approximatif
          period: apiPack.duration_days,
          features: [
            `Taux d'intérêt: ${apiPack.interest_rate}%`,
            `Durée: ${apiPack.duration_days} jours`,
            `Investissement min: ${apiPack.min_amount} FCFA`,
            `Investissement max: ${apiPack.max_amount} FCFA`
          ],
          popular: apiPack.id === "1", // Vous pouvez adapter cette logique
          color: getColorByIndex(apiPack.id)
        }));
        
        setPacks(transformedPacks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  // Fonction pour assigner des couleurs en fonction de l'ID
  const getColorByIndex = (id: string) => {
    const colors = [
      'from-green-500 to-emerald-600',
      'from-blue-500 to-cyan-600',
      'from-indigo-500 to-purple-600',
      'from-purple-500 to-pink-600',
      'from-yellow-500 to-orange-600',
      'from-pink-500 to-rose-600',
      'from-gradient-to-r from-purple-600 to-indigo-800'
    ];
    return colors[parseInt(id) % colors.length];
  };

  return { packs, loading, error };
};

export default useInvestmentPacks;