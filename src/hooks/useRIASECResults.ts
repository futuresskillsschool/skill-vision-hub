
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StudentDetails } from '@/components/assessment/StudentInfoCard';

interface RIASECScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface UseRIASECResultsReturn {
  scores: RIASECScores;
  studentDetails: StudentDetails | null;
  loading: boolean;
}

export const useRIASECResults = (): UseRIASECResultsReturn => {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get scores from location state or use default values
  const scores: RIASECScores = location.state?.scores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  useEffect(() => {
    if (!location.state) {
      console.log("No location state found, redirecting to assessment page");
      navigate('/assessment/riasec');
      return;
    }
    
    window.scrollTo(0, 0);
    setLoading(true);
    
    // Use student details from location state if available
    if (location.state?.studentDetails) {
      console.log("Using student details from location state:", location.state.studentDetails);
      setStudentDetails(location.state.studentDetails);
    }
    
    // Finish loading
    setLoading(false);
  }, [location.state, navigate]);
  
  return {
    scores,
    studentDetails,
    loading
  };
};
