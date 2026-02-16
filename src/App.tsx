import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SupabaseDataProvider } from "@/components/SupabaseDataProvider";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { useEffect } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AccountDetails from "./pages/AccountDetails";
import Transactions from "./pages/Transactions";
import Payments from "./pages/Payments";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AccountOverview from "./pages/AccountOverview";

const queryClient = new QueryClient();

// Ant Design theme configuration - Modern Banking Theme
const antTheme = {
  token: {
    colorPrimary: "#6366F1",
    colorSuccess: "#10B981",
    colorWarning: "#F59E0B",
    colorError: "#EF4444",
    colorInfo: "#06B6D4",
    borderRadius: 12,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    colorBgContainer: "#FFFFFF",
    colorBorder: "#E5E7EB",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    boxShadowSecondary: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  },
  components: {
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary: "0 2px 12px -2px rgba(0, 0, 0, 0.08)",
    },
    Button: {
      borderRadiusLG: 10,
      controlHeight: 40,
      controlHeightLG: 48,
      fontWeight: 500,
    },
    Input: {
      borderRadiusLG: 10,
      controlHeight: 40,
      controlHeightLG: 48,
    },
    Table: {
      borderRadiusLG: 12,
      headerBg: "#F9FAFB",
      headerSplitColor: "transparent",
    },
  },
};

// ScrollToTop component - прокручивает страницу вверх при смене маршрута
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider 
      locale={ruRU} 
      theme={antTheme}
      modal={{
        // Блокируем скролл body при открытии модального окна
        styles: {
          mask: {
            // Предотвращаем события touch на маске
            WebkitOverflowScrolling: 'auto',
          },
        },
      }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <SupabaseDataProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounts"
                element={
                  <ProtectedRoute>
                    <Accounts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/accounts/:accountId"
                element={
                  <ProtectedRoute>
                    <AccountDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SupabaseDataProvider>
          <PWAInstallPrompt />
        </BrowserRouter>
      </TooltipProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;
