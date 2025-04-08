
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/assessment/LoadingScreen';
import { toast } from "sonner";
import {
  fetchUserProfile,
  createStudentRecord,
  fetchLatestStudentRecord,
  fetchStudentDetails,
  checkAndSaveAssessmentResult
} from '@/utils/assessmentUtils';

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
          const { profileData } = await fetchUserProfile(user.id);
            
          // Only create a student record if one doesn't already exist or if not downloading PDF
          let studentId = resultsData.studentId;
          let studentDetails = null;
          
          if (!studentId && !resultsData.downloadPdf) {
            // Create a student record from the profile data
            const { studentData } = await createStudentRecord(
              user.id, 
              profileData, 
              id || 'scct'
            );
              
            if (studentData) {
              console.log('Created student record:', studentData);
              studentId = studentData.id;
            }
          } else if (!studentId && resultsData.downloadPdf) {
            // If we're downloading PDF but don't have a student ID, try to fetch the latest one
            // Now fetching any student record, regardless of assessment type
            const { existingStudent } = await fetchLatestStudentRecord(user.id, id || 'scct');
              
            if (existingStudent) {
              studentId = existingStudent.id;
            }
          }
          
          // If we have a studentId, fetch the complete student details
          if (studentId) {
            const { fullStudentDetails } = await fetchStudentDetails(studentId);
            if (fullStudentDetails) {
              studentDetails = fullStudentDetails;
              console.log("Retrieved student details for results page:", studentDetails);
            }
          } else if (profileData) {
            // Create student details from profile data if we don't have a student record
            studentDetails = {
              id: user.id,
              name: profileData.first_name && profileData.last_name 
                ? `${profileData.first_name} ${profileData.last_name}` 
                : (user.email || 'Anonymous User'),
              class: profileData.stream || 'Not specified',
              section: profileData.interest || 'Not specified',
              school: 'Not specified'  // Since 'school' doesn't exist in profileData type, use default string
            };
          }
          
          const assessmentType = id || 'scct';
          
          // Check if an assessment result already exists before creating a new one
          await checkAndSaveAssessmentResult(user.id, assessmentType, resultsData);
          
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
      } finally {
        setLoading(false);
      }
    };
    
    processUserData();
  }, [resultsData, navigate, id, user]);
  
  // Return the loading component
  return <LoadingScreen />;
};

export default StudentDetailsPage;
