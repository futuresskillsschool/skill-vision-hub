
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
 * Fetches a user's profile from local storage
 */
export const fetchUserProfile = async (userId: string) => {
  console.log("Fetching user profile for:", userId);
  
  // Get profile from localStorage
  const storedProfile = localStorage.getItem('userProfile');
  const profileData = storedProfile ? JSON.parse(storedProfile) : null;
    
  return { profileData, profileError: null };
};

/**
 * Creates a new student record in localStorage
 */
export const createStudentRecord = async (userId: string, profileData: any, assessmentType: string) => {
  console.log("Creating student record for user:", userId, "with assessment type:", assessmentType);
  
  const studentRecord = {
    id: Date.now().toString(),
    name: profileData?.first_name && profileData?.last_name 
      ? `${profileData.first_name} ${profileData.last_name}` 
      : (userId ? 'User' : 'Anonymous User'),
    class: profileData?.stream || 'Not specified',
    section: profileData?.interest || 'Not specified',
    school: 'Not specified',
    assessment_type: assessmentType,
    user_id: userId
  };
  
  console.log("Student record to create:", studentRecord);
  
  // Store in localStorage
  const storedStudents = localStorage.getItem('studentDetails');
  const students = storedStudents ? JSON.parse(storedStudents) : [];
  students.push(studentRecord);
  localStorage.setItem('studentDetails', JSON.stringify(students));
    
  return { studentData: studentRecord, studentError: null };
};

/**
 * Fetches the latest student record from localStorage
 */
export const fetchLatestStudentRecord = async (userId: string, assessmentType: string) => {
  console.log("Fetching latest student record for user:", userId);
  
  // Get students from localStorage
  const storedStudents = localStorage.getItem('studentDetails');
  const students = storedStudents ? JSON.parse(storedStudents) : [];
  
  // Find the latest record for this user
  const userStudents = students.filter((s: any) => s.user_id === userId);
  const existingStudent = userStudents.length > 0 ? userStudents[userStudents.length - 1] : null;
  
  console.log("Fetch student record result:", existingStudent);
    
  return { existingStudent, fetchError: null };
};

/**
 * Fetches complete student details by ID from localStorage
 */
export const fetchStudentDetails = async (studentId: string) => {
  console.log("Fetching complete student details for ID:", studentId);
  
  // Get students from localStorage
  const storedStudents = localStorage.getItem('studentDetails');
  const students = storedStudents ? JSON.parse(storedStudents) : [];
  
  // Find the student with the matching ID
  const fullStudentDetails = students.find((s: any) => s.id === studentId) || null;
  
  console.log("Fetched student details:", fullStudentDetails);
    
  return { 
    fullStudentDetails: fullStudentDetails as StudentDetails | null, 
    detailsError: null 
  };
};

/**
 * Checks if an assessment result already exists and saves it if it doesn't
 */
export const checkAndSaveAssessmentResult = async (userId: string, assessmentType: string, resultsData: any) => {
  if (assessmentType === 'eq-navigator' && resultsData.totalScore !== undefined) {
    // Get existing assessment results
    const storedResults = localStorage.getItem('assessmentResults');
    const assessmentResults = storedResults ? JSON.parse(storedResults) : {};
    
    // Check if this assessment type already exists for the user
    const userAssessments = assessmentResults[userId] || {};
    
    // Only save if not in viewOnly mode
    if (!resultsData.viewOnly) {
      // Add or update the assessment result
      userAssessments[assessmentType] = {
        totalScore: resultsData.totalScore,
        selectedOptions: resultsData.selectedOptions,
        primary_result: getPrimaryResult(resultsData.totalScore)
      };
      
      assessmentResults[userId] = userAssessments;
      localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
      
      console.log('Assessment results saved successfully');
    } else {
      console.log('Using existing assessment result or view-only mode');
    }
  }
};
