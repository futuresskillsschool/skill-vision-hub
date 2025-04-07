
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentInfoCard from '@/components/assessment/StudentInfoCard';
import RIASECResultsContent from '@/components/assessment/results/RIASECResultsContent';
import RIASECResultsHeader from '@/components/assessment/results/RIASECResultsHeader';
import { useRIASECResults } from '@/hooks/useRIASECResults';
import riasecTypes from '@/constants/riasecTypes';

const RIASECResults = () => {
  const navigate = useNavigate();
  const { scores, studentDetails, loading } = useRIASECResults();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 md:px-8 py-16 max-w-7xl mx-auto w-full mt-16">
        <RIASECResultsHeader />
        
        {studentDetails && (
          <StudentInfoCard studentDetails={studentDetails} />
        )}
        
        <RIASECResultsContent 
          scores={scores}
          riasecTypes={riasecTypes}
          studentDetails={studentDetails}
        />
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

export default RIASECResults;
