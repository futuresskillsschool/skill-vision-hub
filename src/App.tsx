
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { PrivateRoute } from './components/PrivateRoute';
import LeadForm from './pages/LeadForm';
import AssessmentDetail from './pages/AssessmentDetail';
import EQNavigatorAssessment from './pages/EQNavigatorAssessment';
import EQNavigatorResults from './pages/EQNavigatorResults';
import FuturePathwaysAssessment from './pages/FuturePathwaysAssessment';
import FuturePathwaysResults from './pages/FuturePathwaysResults';
import RIASECAssessment from './pages/RIASECAssessment';
import RIASECResults from './pages/RIASECResults';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/assessment/:id" element={<AssessmentDetail />} />
          <Route path="/assessment/:id/lead-form" element={<LeadForm />} />
          <Route path="/assessment/eq-navigator" element={<EQNavigatorAssessment />} />
          <Route path="/assessment/eq-navigator/results" element={<EQNavigatorResults />} />
          <Route path="/assessment/future-pathways" element={<FuturePathwaysAssessment />} />
          <Route path="/assessment/future-pathways/results" element={<FuturePathwaysResults />} />
          <Route path="/assessment/riasec" element={<RIASECAssessment />} />
          <Route path="/assessment/riasec/results" element={<RIASECResults />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/dashboard/:tab" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
