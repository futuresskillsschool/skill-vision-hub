
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
          
          // Only create a student record if one doesn't already exist or if not downloading PDF
          // If downloadPdf flag is true, we should use the existing student record instead of creating a new one
          let studentId = resultsData.studentId;
          let studentDetails = null;
          
          if (!studentId && !resultsData.downloadPdf) {
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
                assessment_type: id || 'scct',
                user_id: user.id
              })
              .select('id')
              .single();
              
            if (studentError) {
              console.error('Error creating student record:', studentError);
              toast.error("Could not save your assessment details");
              // Still continue to results even if there's an error creating the student record
            } else {
              console.log('Created student record:', studentData);
              studentId = studentData.id;
            }
          } else if (!studentId && resultsData.downloadPdf) {
            // If we're downloading PDF but don't have a student ID, try to fetch the latest one
            const { data: existingStudent, error: fetchError } = await supabase
              .from('student_details')
              .select('id')
              .eq('user_id', user.id)
              .eq('assessment_type', id || 'scct')
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
              
            if (!fetchError && existingStudent) {
              studentId = existingStudent.id;
            }
          }
          
          // If we have a studentId, fetch the complete student details
          if (studentId) {
            const { data: fullStudentDetails, error: detailsError } = await supabase
              .from('student_details')
              .select('*')
              .eq('id', studentId)
              .single();
              
            if (!detailsError) {
              studentDetails = fullStudentDetails;
            }
          }
          
          const assessmentType = id || resultsData.assessmentType || 'scct';
          
          // Check if an assessment result already exists before creating a new one
          if (assessmentType === 'eq-navigator' && resultsData.totalScore !== undefined) {
            // Fix: Remove this type issue by explicitly specifying the type or simplifying the condition
            const { data: existingResult, error: fetchError } = await supabase
              .from('assessment_results')
              .select('id')
              .eq('user_id', user.id)
              .eq('assessment_type', assessmentType)
              .eq('result_data->>totalScore', resultsData.totalScore.toString())
              .maybeSingle();
              
            // Only save if no existing result with the same score is found
            if (!existingResult && !resultsData.viewOnly) {
              const { error: resultError } = await supabase
                .from('assessment_results')
                .insert({
                  user_id: user.id,
                  assessment_type: assessmentType,
                  result_data: {
                    totalScore: resultsData.totalScore,
                    selectedOptions: resultsData.selectedOptions,
                    primary_result: getPrimaryResult(resultsData.totalScore)
                  }
                });
                
              if (resultError) {
                console.error('Error saving assessment results:', resultError);
                toast.error("Could not save your assessment results");
              } else {
                console.log('Assessment results saved successfully');
              }
            } else {
              console.log('Using existing assessment result or view-only mode');
            }
          }
          
          // Add download flag for the first pass if needed
          const shouldDownloadPdf = resultsData.downloadPdf || false;
          
          // Navigate directly to results page with the student ID and student details
          navigate(`/assessment/${assessmentType}/results`, {
            state: {
              ...resultsData,
              studentId: studentId,
              downloadPdf: shouldDownloadPdf,
              viewOnly: true, // Mark as view-only to prevent duplicate records
              studentDetails: studentDetails // Pass complete student details to results page
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
  
  // Helper function to determine the primary result based on the score
  const getPrimaryResult = (totalScore: number) => {
    if (totalScore >= 32) {
      return 'Empathetic Explorer';
    } else if (totalScore >= 24) {
      return 'Developing Navigator';
    } else if (totalScore >= 16) {
      return 'Emerging Explorer';
    } else {
      return 'Compass Explorer';
    }
  };
  
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
