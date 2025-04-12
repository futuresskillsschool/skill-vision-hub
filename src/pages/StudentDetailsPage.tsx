import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingScreen from '@/components/assessment/LoadingScreen';
import { toast } from "sonner";

const StudentDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  
  // Check if we have results data from the previous page
  const resultsData = location.state;
  
  useEffect(() => {
    // Debug log
    console.log("StudentDetailsPage - Assessment type:", id);
    console.log("StudentDetailsPage - Results data:", resultsData);
    
    // Redirect to the assessment page if no results data
    if (!resultsData) {
      console.log("No results data, redirecting to assessment page");
      navigate(`/assessment/${id || 'scct'}`);
      return;
    }
    
    // If we already have studentDetails, go straight to results page
    if (resultsData.studentDetails) {
      navigate(`/assessment/${id || 'scct'}/results`, {
        state: {
          ...resultsData,
          viewOnly: true
        }
      });
      return;
    }
    
    setLoading(false);
  }, [resultsData, navigate, id]);
  
  // Handle form submission
  const handleStudentDetailsSubmit = (studentDetails: any) => {
    // Navigate to results page with the student details
    navigate(`/assessment/${id || 'scct'}/results`, {
      state: {
        ...resultsData,
        studentDetails,
        viewOnly: true
      }
    });
  };
  
  // Return the loading component
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Import components lazily to prevent circular dependencies
  const StudentDetailsForm = React.lazy(() => import('@/components/assessment/StudentDetailsForm'));
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <React.Suspense fallback={<LoadingScreen />}>
        <StudentDetailsForm
          assessmentType={id || 'scct'}
          resultsData={resultsData}
          onSubmitSuccess={handleStudentDetailsSubmit}
        />
      </React.Suspense>
    </div>
  );
};

export default StudentDetailsPage;
