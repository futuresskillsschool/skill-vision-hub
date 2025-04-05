
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Download, ArrowLeft, ZoomIn, User, School, BookOpen, Home, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SCCTResultsProps {
  totalScore: number;
  selectedOptions: string[];
  downloadPdf?: boolean;
  studentId?: string;
  fromDashboard?: boolean;
  questions: Array<{
    id: number;
    scenario: string;
    options: Array<{
      id: string;
      text: string;
      score: number;
    }>;
  }>;
}

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const SCCTResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const { user } = useAuth();
  const [results, setResults] = useState<any | null>(location.state || null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const state = location.state as SCCTResultsProps | null;
    
    if (!state || state.totalScore === undefined) {
      navigate('/assessment/scct');
      return;
    }

    setIsLoading(false);

    if (state.downloadPdf) {
      setTimeout(() => {
        downloadAsPDF();
      }, 1500);
    }
    
    const fetchStudentDetails = async () => {
      if (results && results.studentId) {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', results.studentId)
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
      }
    };
    
    fetchStudentDetails();
  }, [location, navigate, user, results]);

  const calculatePercentage = (score: number) => {
    return Math.round((score / 40) * 100);
  };

  const downloadAsPDF = async () => {
    if (!reportRef.current || isGeneratingPDF) return;
    
    try {
      setIsGeneratingPDF(true);
      toast.info("Preparing your PDF. This may take a moment...");
      
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`SCCT-Results-${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Could not generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-t-purple-400 border-r-purple-300/30 border-b-purple-300/10 border-l-purple-300/30 rounded-full animate-spin"></div>
            <p className="text-purple-600 font-medium">Loading your results...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const scoreData = location.state as SCCTResultsProps;
  const scorePercentage = calculatePercentage(scoreData.totalScore);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mb-4 text-purple-500 hover:text-purple-600 -ml-3"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">Your SCCT Results</h1>
                <p className="text-gray-600 max-w-2xl">
                  Explore your social cognitive career theory assessment results and discover insights about your career development journey.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={downloadAsPDF} 
                  variant="outline" 
                  className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="h-4 w-4 border-2 border-purple-600 border-r-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              </div>
            </div>

            {studentDetails && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-50 rounded-xl p-4 md:p-6 mb-6 border border-purple-100"
              >
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Student Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{studentDetails.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Class & Section</p>
                      <p className="font-medium">{studentDetails.class} - {studentDetails.section}</p>
                    </div>
                  </div>
                  <div className="flex items-center md:col-span-2">
                    <School className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">School</p>
                      <p className="font-medium">{studentDetails.school}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={reportRef} className="pdf-report">
              <Card className="mb-6 overflow-hidden">
                <div className="bg-purple-100 p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">SCCT Assessment Results</h2>
                  <p className="text-gray-600">
                    Your score measures how you approach career decision making based on Social Cognitive Career Theory.
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full bg-purple-100 flex items-center justify-center">
                          <div className="text-2xl font-bold text-purple-700">{scoreData.totalScore}</div>
                        </div>
                        <svg className="w-32 h-32" viewBox="0 0 100 100">
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="none" 
                            stroke="#e2e8f0" 
                            strokeWidth="8" 
                          />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="45" 
                            fill="none" 
                            stroke="#8b5cf6" 
                            strokeWidth="8" 
                            strokeDasharray={`${2 * Math.PI * 45 * (scorePercentage / 100)} ${2 * Math.PI * 45}`} 
                            strokeDashoffset="0" 
                            strokeLinecap="round" 
                            transform="rotate(-90 50 50)" 
                          />
                        </svg>
                      </div>
                      <p className="mt-2 text-lg font-medium text-gray-800">Total Score</p>
                      <p className="text-sm text-gray-600">Out of 40 possible points</p>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-3 text-gray-800">Score Analysis</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Career Self-Efficacy</span>
                            <span className="text-sm font-medium text-gray-700">75%</span>
                          </div>
                          <Progress value={75} className="h-2 bg-purple-100" indicatorClassName="bg-purple-500" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Outcome Expectations</span>
                            <span className="text-sm font-medium text-gray-700">82%</span>
                          </div>
                          <Progress value={82} className="h-2 bg-purple-100" indicatorClassName="bg-purple-500" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Goal Setting</span>
                            <span className="text-sm font-medium text-gray-700">68%</span>
                          </div>
                          <Progress value={68} className="h-2 bg-purple-100" indicatorClassName="bg-purple-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="mb-6">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Key Insights</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <div className="text-purple-600 font-bold">1</div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Self-Efficacy Development</h4>
                        <p className="text-gray-600">
                          Your responses indicate moderate confidence in your ability to perform career-related tasks. 
                          Consider exploring activities that build mastery experiences in your areas of interest.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <div className="text-purple-600 font-bold">2</div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Outcome Expectations</h4>
                        <p className="text-gray-600">
                          You have a positive outlook on the results of career-related actions. This optimism can be 
                          channeled into exploring diverse career paths and opportunities.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <div className="text-purple-600 font-bold">3</div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Goal-Setting</h4>
                        <p className="text-gray-600">
                          Your approach to setting career goals shows potential. Consider creating more specific, 
                          measurable, and time-bound goals to enhance your career development journey.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
              
              <Button 
                onClick={() => navigate('/assessment/scct')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Take Another Assessment
              </Button>
              
              <Button 
                onClick={() => navigate('/assessment/categories')}
                variant="outline"
                className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <ClipboardList className="h-4 w-4" />
                Back to Assessments
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SCCTResults;
