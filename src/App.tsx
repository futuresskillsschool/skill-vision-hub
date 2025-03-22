
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import AssessmentDetail from "./pages/AssessmentDetail";
import LeadForm from "./pages/LeadForm";
import NotFound from "./pages/NotFound";
import EQNavigatorAssessment from "./pages/EQNavigatorAssessment";
import EQNavigatorResults from "./pages/EQNavigatorResults";
import FuturePathwaysAssessment from "./pages/FuturePathwaysAssessment";
import FuturePathwaysResults from "./pages/FuturePathwaysResults";
import RIASECAssessment from "./pages/RIASECAssessment";
import RIASECResults from "./pages/RIASECResults";
import SCCTAssessment from "./pages/SCCTAssessment";
import SCCTResults from "./pages/SCCTResults";
import CareerVisionAssessment from "./pages/CareerVisionAssessment";
import CareerVisionResults from "./pages/CareerVisionResults";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { PrivateRoute } from "./components/PrivateRoute";

// Add framer-motion for animations
import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/assessment/:id" element={<AssessmentDetail />} />
              <Route path="/assessment/:id/lead-form" element={<LeadForm />} />
              <Route path="/assessment/career-vision/results" element={<CareerVisionResults />} />
              <Route path="/eq-navigator" element={<EQNavigatorAssessment />} />
              <Route path="/eq-navigator/results" element={<EQNavigatorResults />} />
              <Route path="/future-pathways" element={<FuturePathwaysAssessment />} />
              <Route path="/future-pathways/results" element={<FuturePathwaysResults />} />
              <Route path="/riasec" element={<RIASECAssessment />} />
              <Route path="/riasec-results" element={<RIASECResults />} />
              <Route path="/scct" element={<SCCTAssessment />} />
              <Route path="/scct/results" element={<SCCTResults />} />
              <Route path="/assessment/career-vision" element={<CareerVisionAssessment />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
