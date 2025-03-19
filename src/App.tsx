
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AssessmentDetail from "./pages/AssessmentDetail";
import LeadForm from "./pages/LeadForm";
import NotFound from "./pages/NotFound";
import EQNavigatorAssessment from "./pages/EQNavigatorAssessment";
import EQNavigatorResults from "./pages/EQNavigatorResults";
import FuturePathwaysAssessment from "./pages/FuturePathwaysAssessment";
import FuturePathwaysResults from "./pages/FuturePathwaysResults";

// Add framer-motion for animations
import { motion, AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/assessment/:id" element={<AssessmentDetail />} />
            <Route path="/assessment/:id/lead-form" element={<LeadForm />} />
            <Route path="/eq-navigator" element={<EQNavigatorAssessment />} />
            <Route path="/eq-navigator/results" element={<EQNavigatorResults />} />
            <Route path="/future-pathways" element={<FuturePathwaysAssessment />} />
            <Route path="/future-pathways/results" element={<FuturePathwaysResults />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
