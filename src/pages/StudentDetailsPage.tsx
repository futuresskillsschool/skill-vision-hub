
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const StudentDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Check if we have results data from the previous page
  const resultsData = location.state;
  
  useEffect(() => {
    // Redirect to the assessment page if no results data
    if (!resultsData) {
      console.log("No results data, redirecting to assessment page");
      navigate(`/assessment/${id || 'scct'}`);
      return;
    }
    
    const processUserData = async () => {
      try {
        setLoading(true);
        
        if (user) {
          // Get user profile from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          }
          
          // Create a student record from the profile data
          const { data: studentData, error: studentError } = await supabase
            .from('student_details')
            .insert({
              name: profileData?.first_name && profileData?.last_name 
                ? `${profileData.first_name} ${profileData.last_name}` 
                : 'Anonymous User',
              class: profileData?.stream || 'Not specified',
              section: profileData?.interest || 'Not specified',
              school: 'Not specified',
              assessment_type: id || resultsData.assessmentType || 'scct',
              user_id: user.id
            })
            .select('id')
            .single();
            
          if (studentError) {
            console.error('Error creating student record:', studentError);
            setLoading(false);
            return;
          }
          
          console.log('Created student record:', studentData);
          
          const assessmentType = id || resultsData.assessmentType || 'scct';
          
          // Navigate directly to results page with the student ID
          navigate(`/assessment/${assessmentType}/results`, {
            state: {
              ...resultsData,
              studentId: studentData.id
            }
          });
        } else {
          // Not logged in, redirect to login
          navigate('/login', { 
            state: { 
              returnPath: `/assessment/${id || 'scct'}/take`,
              message: 'Please log in to view assessment results' 
            } 
          });
        }
      } catch (error) {
        console.error('Error processing user data:', error);
        setLoading(false);
      }
    };
    
    processUserData();
  }, [resultsData, navigate, id, user]);
  
  // If loading, show minimal content
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDetailsPage;
