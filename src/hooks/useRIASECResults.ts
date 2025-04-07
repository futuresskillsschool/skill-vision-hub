
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StudentDetails } from '@/components/assessment/StudentInfoCard';
import { toast } from "sonner";

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
  const { user } = useAuth();
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get scores from location state or use default values
  const scores: RIASECScores = location.state?.scores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  useEffect(() => {
    if (!location.state) {
      navigate('/assessment/riasec');
      return;
    }
    
    window.scrollTo(0, 0);
    setLoading(true);
    
    const fetchStudentDetails = async () => {
      if (location.state?.studentDetails) {
        setStudentDetails(location.state.studentDetails);
        setLoading(false);
        return;
      }
      
      if (location.state?.studentId) {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', location.state.studentId)
            .single();
            
          if (error) {
            console.error('Error fetching student details:', error);
            await tryFetchProfileAsFallback();
            return;
          }
          
          if (data) {
            setStudentDetails(data as StudentDetails);
          }
        } catch (error) {
          console.error('Error in student details fetch:', error);
          await tryFetchProfileAsFallback();
        }
      } else if (user) {
        await tryFetchProfileAsFallback();
      }
      
      setLoading(false);
    };
    
    const tryFetchProfileAsFallback = async () => {
      if (!user) return;
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile data:', profileError);
          return;
        }
        
        if (profileData) {
          setStudentDetails({
            id: user.id,
            name: profileData.first_name && profileData.last_name 
              ? `${profileData.first_name} ${profileData.last_name}` 
              : (user.email || 'Anonymous User'),
            class: profileData.stream || 'Not specified',
            section: profileData.interest || 'Not specified',
            school: 'Not specified'
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchStudentDetails();
    
    const saveResultsToDB = async () => {
      if (user && scores && !location.state?.viewOnly) {
        try {
          console.log('Saving RIASEC results to database for user:', user.id);
          
          const { data: existingResults, error: checkError } = await supabase
            .from('assessment_results')
            .select('id')
            .eq('user_id', user.id)
            .eq('assessment_type', 'riasec')
            .maybeSingle();
            
          if (existingResults) {
            console.log('Using existing RIASEC results record');
            return;
          }
          
          const scoresObject: Record<string, number> = {};
          Object.entries(scores).forEach(([key, value]) => {
            scoresObject[key] = value;
          });
          
          const resultData = {
            scores: scoresObject,
            studentId: location.state?.studentId
          };
          
          const { error } = await supabase
            .from('assessment_results')
            .insert({
              user_id: user.id,
              assessment_type: 'riasec',
              result_data: resultData
            });
            
          if (error) {
            console.error('Error saving results to database:', error);
            toast.error("Could not save your results to database");
          } else {
            console.log('RIASEC results saved successfully');
          }
        } catch (error) {
          console.error('Exception when saving results:', error);
        }
      } else {
        console.log('Skipping save to database (view-only mode or missing user/scores)');
      }
    };
    
    saveResultsToDB();
  }, [location.state, navigate, user, scores]);
  
  return {
    scores,
    studentDetails,
    loading
  };
};
