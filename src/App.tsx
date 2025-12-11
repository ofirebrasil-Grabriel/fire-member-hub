import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProgressProvider } from "@/contexts/UserProgressContext";
import Dashboard from "./pages/Dashboard";
import DayPage from "./pages/DayPage";
import Challenge from "./pages/Challenge";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProgressProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/desafio" element={<Challenge />} />
            <Route path="/dia/:id" element={<DayPage />} />
            <Route path="/recursos" element={<Resources />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProgressProvider>
  </QueryClientProvider>
);

export default App;
