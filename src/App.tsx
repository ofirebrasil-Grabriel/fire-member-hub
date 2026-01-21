import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProgressProvider } from "@/contexts/UserProgressContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import DayRedirect from "./pages/DayRedirect";
import ChallengePath from "./pages/ChallengePath";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminChallenges } from "./pages/admin/AdminChallenges";
import { ChallengeEditor } from "./pages/admin/ChallengeEditor";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminWebhooks } from "./pages/admin/AdminWebhooks";
import { AdminLibrary } from "./pages/admin/AdminLibrary";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Public route - redirects to dashboard if already logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
    <Route path="/" element={<ProtectedRoute><ChallengePath /></ProtectedRoute>} />
    <Route path="/app" element={<ProtectedRoute><ChallengePath /></ProtectedRoute>} />
    <Route path="/desafio" element={<ProtectedRoute><ChallengePath /></ProtectedRoute>} />
    <Route path="/dia/:id" element={<ProtectedRoute><DayRedirect /></ProtectedRoute>} />
    <Route path="/biblioteca" element={<ProtectedRoute><Library /></ProtectedRoute>} />
    <Route path="/recursos" element={<Navigate to="/biblioteca" replace />} />
    <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/conquistas" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />

    {/* Admin routes with sidebar layout */}
    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="challenges" element={<AdminChallenges />} />
      <Route path="challenges/:id" element={<ChallengeEditor />} />
      <Route path="library" element={<AdminLibrary />} />
      <Route path="webhooks" element={<AdminWebhooks />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <UserProgressProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </UserProgressProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
