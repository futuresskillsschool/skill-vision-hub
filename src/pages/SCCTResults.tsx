
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentInfoCard from '@/components/assessment/StudentInfoCard';
import { useStudentDetails } from '@/hooks/useStudentDetails';

interface ScoreType {
  [key: string]: number;
}

const SCCTResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get scores from location state with proper typing
  const scores: ScoreType = location.state?.scores || {};
  
  // Use the shared hook to fetch student details
  const { studentDetails, loading } = useStudentDetails({
    redirectPath: '/assessment/scct'
  });

  const domainLabels: Record<string, string> = {
    "mathInt": "Mathematics",
    "scienceInt": "Science",
    "artInt": "Art",
    "socialInt": "Social",
    "persuasiveInt": "Persuasive",
    "mechanicalInt": "Mechanical",
    "natureInt": "Nature",
    "clericalInt": "Clerical",
  };

  const renderDomainScores = () => {
    return Object.entries(scores).map(([domain, score]) => (
      <div key={domain} className="mb-4">
        <h3 className="text-lg font-semibold">{domainLabels[domain] || domain}</h3>
        <p className="text-gray-600">Score: {score}</p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 md:px-8 py-16 max-w-7xl mx-auto w-full mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">SCCT Results</h1>
          <p className="text-gray-600">Here's your social cognitive career theory assessment results</p>
        </div>
        
        {studentDetails && (
          <StudentInfoCard studentDetails={studentDetails} />
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Your Interest Scores</h2>
          {renderDomainScores()}
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

export default SCCTResults;
