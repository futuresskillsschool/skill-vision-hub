
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

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
            toast.error("Could not load your profile information");
          }
          
          // Create a student record from the profile data
          const { data: studentData, error: studentError } = await supabase
            .from('student_details')
            .insert({
              name: profileData?.first_name && profileData?.last_name 
                ? `${profileData.first_name} ${profileData.last_name}` 
                : (user.email || 'Anonymous User'),
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
            toast.error("Could not save your assessment details");
            // Still continue to results even if there's an error creating the student record
          }
          
          console.log('Created student record:', studentData);
          
          const assessmentType = id || resultsData.assessmentType || 'scct';
          
          // Add download flag for the first pass if needed
          const shouldDownloadPdf = resultsData.downloadPdf || false;
          
          // Navigate directly to results page with the student ID
          navigate(`/assessment/${assessmentType}/results`, {
            state: {
              ...resultsData,
              studentId: studentData?.id,
              downloadPdf: shouldDownloadPdf
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
        toast.error("There was an error processing your assessment results");
        navigate(`/assessment/${id || 'scct'}`);
      }
    };
    
    processUserData();
  }, [resultsData, navigate, id, user]);
  
  // Return a minimal component (which should never be visible for more than a moment)
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Processing your results...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDetailsPage;
