
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentDetailsForm from '@/components/assessment/StudentDetailsForm';

const StudentDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Check if we have results data from the previous page
  const resultsData = location.state;
  
  useEffect(() => {
    // Redirect to the assessment page if no results data
    if (!resultsData) {
      console.log("No results data, redirecting to assessment page");
      navigate(`/assessment/${id || 'scct'}`);
    }
  }, [resultsData, navigate, id]);
  
  if (!resultsData) {
    return null;
  }
  
  // Determine which assessment type based on the URL or the results data
  let assessmentType = id || resultsData.assessmentType || 'scct';
  
  console.log("StudentDetailsPage - Assessment type:", assessmentType);
  console.log("StudentDetailsPage - Results data:", resultsData);
  
  const handleSubmitSuccess = (studentId: string) => {
    console.log("Student details submitted, navigating to results page with:", { ...resultsData, studentId });
    
    // Navigate to the results page with the results data
    navigate(`/assessment/${assessmentType}/results`, {
      state: {
        ...resultsData,
        studentId
      }
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <StudentDetailsForm 
            assessmentType={assessmentType}
            resultsData={resultsData}
            onSubmitSuccess={handleSubmitSuccess}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDetailsPage;
