
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentInfoCard from '@/components/assessment/StudentInfoCard';
import { useStudentDetails } from '@/hooks/useStudentDetails';

const EQNavigatorResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get scores from location state
  const scores = location.state?.scores || {};
  const totalScore = location.state?.totalScore || 0;
  
  // Use the shared hook to fetch student details
  const { studentDetails, loading } = useStudentDetails({
    redirectPath: '/assessment/eq-navigator'
  });

  const getCategoryScore = (category: string) => {
    return scores[category] || 0;
  };

  const getPercentage = (category: string) => {
    const score = getCategoryScore(category);
    return Math.round((score / 5) * 100);
  };

  const getLevel = () => {
    if (totalScore >= 35) {
      return "High";
    } else if (totalScore >= 25) {
      return "Medium";
    } else {
      return "Low";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 md:px-8 py-16 max-w-7xl mx-auto w-full mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">EQ Navigator Results</h1>
          <p className="text-gray-600">Here's your emotional intelligence profile</p>
        </div>
        
        {studentDetails && (
          <StudentInfoCard studentDetails={studentDetails} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-brand-blue mb-4">Overall EQ Level</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-700 text-center text-2xl font-bold">{getLevel()}</p>
              <p className="text-gray-500 text-center">Total Score: {totalScore}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-brand-blue mb-4">Category Scores</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              {Object.keys(scores).map((category) => (
                <div key={category} className="mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">{category}</p>
                    <p className="text-gray-500">{getPercentage(category)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${getPercentage(category)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <div className="w-full flex justify-center pb-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/assessment')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessments
        </Button>
      </div>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorResults;
