import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminPanel from "../pages/AdminPanel";
import Dashboard from "../components/Admin/Dashboard";
import UsersManagement from "../components/Admin/UsersManagement";
import TransactionsManagement from "../components/Admin/TransactionsManagement";
import InvestmentsManagement from "../components/Admin/InvestmentsManagement";
import Settings from "../components/Admin/Settings";

const AdminRoutes: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("adminToken");

  return (
    <Routes>
      <Route
        path="login"
        element={
          isAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin />
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <AdminPanel />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="transactions" element={<TransactionsManagement />} />
        <Route path="investments" element={<InvestmentsManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
