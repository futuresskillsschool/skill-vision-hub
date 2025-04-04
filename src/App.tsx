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
import CareerVisionLanding from "./pages/CareerVisionLanding";
import EQNavigatorLanding from "./pages/EQNavigatorLanding";
import FuturePathwaysLanding from "./pages/FuturePathwaysLanding";
import RIASECLanding from "./pages/RIASECLanding";
import SCCTLanding from "./pages/SCCTLanding";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { PrivateRoute } from "./components/PrivateRoute";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import ScrollToTop from "./components/ScrollToTop";

import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/assessment/:id" element={<AssessmentDetail />} />
                <Route path="/assessment/:id/lead-form" element={<LeadForm />} />
                <Route path="/assessment/:id/student-details" element={<StudentDetailsPage />} />
                
                {/* Career Vision Assessment Flow */}
                <Route path="/assessment/career-vision" element={<CareerVisionLanding />} />
                <Route path="/assessment/career-vision/take" element={<CareerVisionAssessment />} />
                <Route path="/assessment/career-vision/student-details" element={<StudentDetailsPage />} />
                <Route path="/assessment/career-vision/results" element={<CareerVisionResults />} />
                
                {/* EQ Navigator Assessment Flow */}
                <Route path="/assessment/eq-navigator" element={<EQNavigatorLanding />} />
                <Route path="/assessment/eq-navigator/take" element={<EQNavigatorAssessment />} />
                <Route path="/assessment/eq-navigator/results" element={<EQNavigatorResults />} />
                <Route path="/eq-navigator" element={<Navigate to="/assessment/eq-navigator" replace />} />
                <Route path="/eq-navigator/take" element={<Navigate to="/assessment/eq-navigator/take" replace />} />
                <Route path="/eq-navigator/results" element={<Navigate to="/assessment/eq-navigator/results" replace />} />
                
                {/* Future Pathways Assessment Flow */}
                <Route path="/assessment/future-pathways" element={<FuturePathwaysLanding />} />
                <Route path="/assessment/future-pathways/take" element={<FuturePathwaysAssessment />} />
                <Route path="/assessment/future-pathways/results" element={<FuturePathwaysResults />} />
                <Route path="/future-pathways" element={<Navigate to="/assessment/future-pathways" replace />} />
                <Route path="/future-pathways/take" element={<Navigate to="/assessment/future-pathways/take" replace />} />
                <Route path="/future-pathways/results" element={<Navigate to="/assessment/future-pathways/results" replace />} />
                
                {/* RIASEC Assessment Flow */}
                <Route path="/assessment/riasec" element={<RIASECLanding />} />
                <Route path="/assessment/riasec/take" element={<RIASECAssessment />} />
                <Route path="/assessment/riasec/student-details" element={<StudentDetailsPage />} />
                <Route path="/assessment/riasec/results" element={<RIASECResults />} />
                <Route path="/riasec" element={<Navigate to="/assessment/riasec" replace />} />
                <Route path="/riasec/take" element={<Navigate to="/assessment/riasec/take" replace />} />
                <Route path="/riasec/results" element={<Navigate to="/assessment/riasec/results" replace />} />
                
                {/* SCCT Assessment Flow */}
                <Route path="/assessment/scct" element={<SCCTLanding />} />
                <Route path="/assessment/scct/take" element={<SCCTAssessment />} />
                <Route path="/assessment/scct/student-details" element={<StudentDetailsPage />} />
                <Route path="/assessment/scct/results" element={<SCCTResults />} />
                <Route path="/scct" element={<Navigate to="/assessment/scct" replace />} />
                <Route path="/scct/take" element={<Navigate to="/assessment/scct/take" replace />} />
                <Route path="/scct/results" element={<Navigate to="/assessment/scct/results" replace />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                
                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
