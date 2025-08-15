// src/hooks/useDashboardData.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

const useDashboardData = () => {
  const [userData, setUserData] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://backend-silvofinance.onrender.com/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData(response.data.user);
        setInvestments(response.data.investments);
      } catch (err) {
        setError(err.response?.data?.error || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { userData, investments, loading, error };
};

export default useDashboardData;