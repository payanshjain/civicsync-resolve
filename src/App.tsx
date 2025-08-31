import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import ReportIssue from "./pages/ReportIssue";
import MapView from "./pages/MapView";
import MyIssues from "./pages/MyIssues";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Routes within the main layout */}
            <Route element={<Layout><Outlet /></Layout>}>
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<MapView />} />

              {/* Protected Routes for all logged-in users */}
              <Route element={<ProtectedRoute />}>
                <Route path="/report" element={<ReportIssue />} />
                <Route path="/my-issues" element={<MyIssues />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Protected Routes for Admins only */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
            </Route>

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// We need to import Outlet for nested routes
import { Outlet } from "react-router-dom";

export default App;
