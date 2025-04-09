
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StudentDetails } from '@/components/assessment/StudentInfoCard';

interface UseStudentDetailsProps {
  redirectPath?: string;
}

export const useStudentDetails = ({ redirectPath }: UseStudentDetailsProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!location.state && redirectPath) {
      navigate(redirectPath);
      return;
    }
    
    const fetchStudentDetails = async () => {
      setLoading(true);
      
      // First, check if studentDetails are in location state
      if (location.state?.studentDetails) {
        console.log("Using student details from location state:", location.state.studentDetails);
        setStudentDetails(location.state.studentDetails);
        setLoading(false);
        return;
      }
      
      // Next, try fetching by studentId
      if (location.state?.studentId) {
        try {
          console.log("Fetching student details by ID:", location.state.studentId);
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
            console.log("Found student details:", data);
            setStudentDetails({
              id: data.id,
              name: data.name,
              class: data.class || 'Not specified',
              section: data.section || 'Not specified',
              school: data.school || 'Not specified'
            });
          } else {
            await tryFetchProfileAsFallback();
          }
        } catch (error) {
          console.error('Error in student details fetch:', error);
          await tryFetchProfileAsFallback();
        }
      } else if (user) {
        // Try to get the latest student record for the user
        try {
          console.log("Looking for latest student record for user:", user.id);
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching latest student record:', error);
            await tryFetchProfileAsFallback();
            return;
          }
          
          if (data) {
            console.log("Found latest student record:", data);
            setStudentDetails({
              id: data.id,
              name: data.name,
              class: data.class || 'Not specified',
              section: data.section || 'Not specified',
              school: data.school || 'Not specified'
            });
          } else {
            await tryFetchProfileAsFallback();
          }
        } catch (error) {
          console.error('Error fetching latest student record:', error);
          await tryFetchProfileAsFallback();
        }
      } else {
        await tryFetchProfileAsFallback();
      }
      
      setLoading(false);
    };
    
    const tryFetchProfileAsFallback = async () => {
      if (!user) return;
      
      try {
        console.log("Using profile data as fallback for student details");
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
          const studentDetails: StudentDetails = {
            id: user.id,
            name: profileData.first_name && profileData.last_name 
              ? `${profileData.first_name} ${profileData.last_name}` 
              : (user.email || 'Anonymous User'),
            class: profileData.stream || 'Not specified',
            section: profileData.interest || 'Not specified',
            school: 'Not specified'
          };
          
          console.log("Created student details from profile:", studentDetails);
          setStudentDetails(studentDetails);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchStudentDetails();
  }, [location.state, navigate, user, redirectPath]);
  
  return {
    studentDetails,
    loading,
    setStudentDetails
  };
};
