import React, { useState, useEffect } from "react";
import {
  Users,
  CreditCard,
  PieChart,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalInvestments: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingWithdrawals: 0,
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        "https://backend-silvofinance.onrender.com/api/admin/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setStats(response.data.stats);
        setRecentActivities(response.data.recentActivities || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Aperçu général de la plateforme</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          icon={Users}
          label="Utilisateurs totaux"
          value={stats.totalUsers}
          color="text-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Utilisateurs actifs"
          value={stats.activeUsers}
          color="text-green-600"
        />
        <StatCard
          icon={CreditCard}
          label="Transactions"
          value={stats.totalTransactions}
          color="text-purple-600"
        />
        <StatCard
          icon={PieChart}
          label="Investissements"
          value={stats.totalInvestments}
          color="text-orange-600"
        />
        <StatCard
          icon={DollarSign}
          label="Revenus totaux"
          value={`${stats.totalRevenue.toLocaleString()} XOF`}
          color="text-green-600"
        />
        <StatCard
          icon={Calendar}
          label="Retraits en attente"
          value={stats.pendingWithdrawals}
          color="text-red-600"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Activités récentes
          </h2>
        </div>
        <div className="p-6">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {activity.userEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        activity.type === "deposit"
                          ? "text-green-600"
                          : activity.type === "withdrawal"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {activity.amount} XOF
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Aucune activité récente
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
