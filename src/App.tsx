
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import CreditRequest from "./pages/CreditRequest";
import NotFound from "./pages/NotFound";
import BusinessTools from "./pages/BusinessTools";
import { AuthProvider } from "./contexts/AuthContext";
import ChatBot from "./components/ChatBot";
import IndividualDashboard from "./pages/IndividualDashboard";
import WholesaleDashboard from "./pages/WholesaleDashboard";
import WholesaleInventory from "./pages/WholesaleInventory";
import WholesaleOrders from "./pages/WholesaleOrders";
import WholesaleRetailers from "./pages/WholesaleRetailers";
import WholesaleAnalytics from "./pages/WholesaleAnalytics";
import LabDashboard from "./pages/LabDashboard";
import Pharmacies from "./pages/Pharmacies";
import Prescriptions from "./pages/Prescriptions";

const App = () => {
  // Create QueryClient inside the component to ensure proper React context
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/individual" element={<IndividualDashboard />} />
              <Route path="/pharmacy" element={<PharmacyDashboard />} />
              <Route path="/wholesale" element={<WholesaleDashboard />} />
              <Route path="/wholesale/inventory" element={<WholesaleInventory />} />
              <Route path="/wholesale/orders" element={<WholesaleOrders />} />
              <Route path="/wholesale/retailers" element={<WholesaleRetailers />} />
              <Route path="/wholesale/analytics" element={<WholesaleAnalytics />} />
              <Route path="/lab" element={<LabDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/pharmacies" element={<Pharmacies />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/credit-request" element={<CreditRequest />} />
              <Route path="/business-tools" element={<BusinessTools />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatBot />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
