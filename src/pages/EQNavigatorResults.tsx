
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StudentDetails } from '@/components/assessment-results/StudentInfoCard';
import StudentInfoCard from '@/components/assessment-results/StudentInfoCard';
import ResultsHeader from '@/components/assessment-results/ResultsHeader';
import EQResultsSummary from '@/components/assessment-results/EQResultsSummary';
import { generateEQNavigatorPDF } from '@/services/PDFGenerationService';

interface ScoresObj {
  [key: string]: number | string;
}

interface ResultsData {
  scores: ScoresObj;
  studentId?: string;
}

const EQNavigatorResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  const resultsData: ResultsData = location.state;
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!resultsData) {
      navigate('/assessment/eq-navigator');
      return;
    }
    
    const fetchStudentDetails = async () => {
      if (resultsData?.studentId) {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', resultsData.studentId)
            .single();
            
          if (error) {
            console.error('Error fetching student details:', error);
            return;
          }
          
          if (data) {
            setStudentDetails(data as StudentDetails);
          }
        } catch (error) {
          console.error('Error in student details fetch:', error);
        }
      } else if (user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile data:', profileError);
            return;
          }
          
          if (profileData) {
            setStudentDetails({
              id: user.id,
              name: profileData.first_name && profileData.last_name 
                ? `${profileData.first_name} ${profileData.last_name}` 
                : (user.email || 'Anonymous User'),
              class: profileData.stream || 'Not specified',
              section: profileData.interest || 'Not specified',
              school: 'Not specified'
            });
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };
    
    fetchStudentDetails();
    
    const saveResultsToDB = async () => {
      if (user && resultsData) {
        try {
          const { scores, studentId } = resultsData;
          
          const scoresObject: Record<string, number> = {};
          Object.entries(scores || {}).forEach(([key, value]) => {
            if (typeof value === 'number') {
              scoresObject[key] = value;
            }
          });
          
          const resultData = {
            scores: scoresObject,
            studentId: studentId
          };
          
          const { error } = await supabase
            .from('assessment_results')
            .upsert({
              user_id: user.id,
              assessment_type: 'eq-navigator',
              result_data: resultData
            });
            
          if (error) {
            console.error('Error saving results to database:', error);
          } else {
            console.log('EQ Navigator results saved successfully');
          }
        } catch (error) {
          console.error('Exception when saving results:', error);
        }
      }
    };
    
    saveResultsToDB();
  }, [location.state, navigate, user, resultsData]);
  
  if (!resultsData) {
    return null;
  }
  
  const { scores } = resultsData;
  
  const chartData = Object.entries(scores || {}).map(([domain, score]) => ({
    domain,
    score: typeof score === 'number' ? score : 0,
    fullMark: 10
  }));
  
  const handleGeneratePDF = async () => {
    if (!resultsRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      toast.loading("Generating your PDF report...");
      
      const pdf = generateEQNavigatorPDF(scores, chartData, studentDetails);
      pdf.save('EQ-Navigator-Results.pdf');
      
      toast.success("Your PDF report is ready!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("There was an error generating your PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <ResultsHeader 
            title="Your EQ Navigator Results"
            subtitle="Based on your responses, here's your emotional intelligence profile across different domains."
            onDownload={handleGeneratePDF}
            isDownloading={isGeneratingPDF}
          />
          
          {studentDetails && <StudentInfoCard studentDetails={studentDetails} />}
          
          <div ref={resultsRef}>
            <EQResultsSummary scores={scores} chartData={chartData} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorResults;
