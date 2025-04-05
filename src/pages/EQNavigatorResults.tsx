
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
import { generateEQNavigatorPDF } from '@/services/PDFGenerationService';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

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
  
  // Calculate the total EQ score by summing all numerical values
  // Add null check to prevent "Cannot convert undefined or null to object" error
  const totalEQScore = scores ? Object.values(scores).reduce((sum, score) => {
    return typeof score === 'number' ? sum + score : sum;
  }, 0) : 0;
  
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

  // Domain descriptions for the domains
  const domainDescriptions: Record<string, string> = {
    "selfAwareness": "Understanding your own emotions and how they affect your behavior.",
    "selfRegulation": "Managing your emotions and impulses effectively.",
    "motivation": "Using your emotions to achieve goals and persist through challenges.",
    "empathy": "Understanding and sharing the feelings of others.",
    "socialSkills": "Managing relationships and building rapport with others."
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
          
          <div ref={resultsRef} className="mt-8">
            <Card className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <CardHeader>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-brand-orange mb-2">Your Emotional Intelligence Profile</h2>
                  <p className="text-foreground/70">
                    Here's a breakdown of your emotional intelligence across different domains:
                  </p>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">EQ Navigator Scores</h3>
                  <div className="relative h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="domain" />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} />
                        <Radar name="EQ Score" dataKey="score" stroke="#F97316" fill="#F97316" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">Domain Breakdown</h3>
                  {Object.entries(scores || {}).map(([domain, scoreValue]) => {
                    const score = typeof scoreValue === 'number' ? scoreValue : 0;
                    return (
                      <Card key={domain} className="bg-brand-orange/5 border border-brand-orange/10">
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-brand-orange mb-2">
                            {domain.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-foreground/80 mb-3">
                            {domainDescriptions[domain] || "Description not available."}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Score:</span>
                            <span className="text-sm font-semibold">{score}/10</span>
                          </div>
                          <Progress value={(score / 10) * 100} className="mt-2" />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorResults;
