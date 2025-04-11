
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { StudentDetails } from '@/components/assessment/StudentInfoCard';

/**
 * Determines the primary result category based on the assessment score
 */
export const getPrimaryResult = (totalScore: number) => {
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

/**
 * Fetches a user's profile from Supabase
 */
export const fetchUserProfile = async (userId: string) => {
  console.log("Fetching user profile for:", userId);
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    toast.error("Could not load your profile information");
  }

  return { profileData, profileError };
};

/**
 * Creates a new student record in the database
 */
export const createStudentRecord = async (userId: string, profileData: any, assessmentType: string) => {
  console.log("Creating student record for user:", userId, "with assessment type:", assessmentType);
  
  const studentRecord = {
    name: profileData?.first_name && profileData?.last_name 
      ? `${profileData.first_name} ${profileData.last_name}` 
      : (userId ? 'User' : 'Anonymous User'),
    class: profileData?.stream || 'Not specified',
    section: profileData?.interest || 'Not specified',
    school: 'Not specified', // Use a default value since 'school' may not exist in profileData
    assessment_type: assessmentType,
    user_id: userId
  };
  
  console.log("Student record to create:", studentRecord);
  
  const { data: studentData, error: studentError } = await supabase
    .from('student_details')
    .insert(studentRecord)
    .select('id')
    .single();
    
  if (studentError) {
    console.error('Error creating student record:', studentError);
    toast.error("Could not save your assessment details");
  } else {
    console.log("Student record created successfully:", studentData);
  }
  
  return { studentData, studentError };
};

/**
 * Fetches the latest student record for a user and assessment type
 */
export const fetchLatestStudentRecord = async (userId: string, assessmentType: string) => {
  console.log("Fetching latest student record for user:", userId);
  
  const { data: existingStudent, error: fetchError } = await supabase
    .from('student_details')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (fetchError) {
    console.error('Error fetching student record:', fetchError);
  } else {
    console.log("Fetch student record result:", existingStudent);
  }
    
  return { existingStudent, fetchError };
};

/**
 * Fetches complete student details by ID
 */
export const fetchStudentDetails = async (studentId: string) => {
  console.log("Fetching complete student details for ID:", studentId);
  
  const { data: fullStudentDetails, error: detailsError } = await supabase
    .from('student_details')
    .select('*')
    .eq('id', studentId)
    .single();
  
  if (detailsError) {
    console.error('Error fetching complete student details:', detailsError);
  } else {
    console.log("Fetched student details:", fullStudentDetails);
  }
    
  return { 
    fullStudentDetails: fullStudentDetails as StudentDetails | null, 
    detailsError 
  };
};

/**
 * Checks if an assessment result already exists and saves it if it doesn't
 */
export const checkAndSaveAssessmentResult = async (userId: string, assessmentType: string, resultsData: any) => {
  if (assessmentType === 'eq-navigator' && resultsData.totalScore !== undefined) {
    // Check if an assessment with the same score already exists
    const { data: existingResult, error: fetchError } = await supabase
      .from('assessment_results')
      .select('id')
      .eq('user_id', userId)
      .eq('assessment_type', assessmentType)
      .eq('result_data->>totalScore', resultsData.totalScore.toString())
      .maybeSingle();
      
    // Only save if no existing result with the same score is found
    if (!existingResult && !resultsData.viewOnly) {
      const { error: resultError } = await supabase
        .from('assessment_results')
        .insert({
          user_id: userId,
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
};
