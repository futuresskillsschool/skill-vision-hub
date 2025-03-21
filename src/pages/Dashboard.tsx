
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Rocket, 
  ChevronRight, 
  BarChart3, 
  Download, 
  History,
  ArrowRight,
  FileText,
  Lightbulb,
  UserRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// Define the assessment result type
type AssessmentResult = {
  id: string;
  user_id: string;
  assessment_type: string;
  result_data: {
    scores?: Record<string, number>;
    primary_result?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
};

const assessmentTypeInfo = {
  'RIASEC': {
    name: 'RIASEC Model Assessment',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-brand-purple'
  },
  'EQ': {
    name: 'EQ Navigator Assessment',
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-brand-orange'
  },
  'FUTURE': {
    name: 'Future Pathways Explorer',
    icon: <Rocket className="h-5 w-5" />,
    color: 'bg-brand-green'
  },
  'CAREER': {
    name: 'Career Vision Assessment',
    icon: <Lightbulb className="h-5 w-5" />,
    color: 'bg-brand-blue'
  },
  'SCCT': {
    name: 'SCCT Assessment',
    icon: <UserRound className="h-5 w-5" />,
    color: 'bg-indigo-500'
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchAssessmentResults = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        // Fetch assessment results for the user
        const { data, error } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setAssessmentResults(data || []);
      } catch (err) {
        console.error('Error fetching assessment results:', err);
        setError('Failed to load your assessment results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessmentResults();
  }, [navigate]);
  
  const getCompletedAssessmentsCount = () => {
    return assessmentResults.length;
  };
  
  const getAvailableAssessmentsCount = () => {
    // We have 5 assessment types in total
    return 5 - new Set(assessmentResults.map(result => result.assessment_type)).size;
  };
  
  const getLatestAssessment = () => {
    if (assessmentResults.length === 0) return null;
    
    return assessmentResults[0];
  };

  const getProgressValue = (scores: Record<string, number> | undefined, type: string) => {
    if (!scores) return 0;
    
    // For RIASEC, get the total score and calculate percentage based on max possible
    if (type === 'RIASEC') {
      const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
      const maxTotal = 72; // 6 types * 6 questions * 2 points (agree)
      return Math.round((total / maxTotal) * 100);
    }
    
    // Default calculation (if specific logic not defined)
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = 100; // Default max score
    return (total / maxPossibleScore) * 100;
  };

  const getAssessmentLink = (type: string) => {
    switch (type) {
      case 'RIASEC':
        return '/riasec-results';
      case 'EQ':
        return '/eq-navigator/results';
      case 'FUTURE':
        return '/future-pathways/results';
      default:
        return '/';
    }
  };

  const getIconForAssessment = (type: string) => {
    return assessmentTypeInfo[type as keyof typeof assessmentTypeInfo]?.icon || <FileText className="h-5 w-5" />;
  };

  const getColorForAssessment = (type: string) => {
    return assessmentTypeInfo[type as keyof typeof assessmentTypeInfo]?.color || 'bg-gray-500';
  };

  const getNameForAssessment = (type: string) => {
    return assessmentTypeInfo[type as keyof typeof assessmentTypeInfo]?.name || type;
  };

  const latestAssessment = getLatestAssessment();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Your Assessment Dashboard</h1>
              <p className="text-muted-foreground">Track your assessments and review your results</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="p-6 bg-brand-purple/10 border-brand-purple/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-purple/20 rounded-full flex items-center justify-center">
                    <Brain className="h-5 w-5 text-brand-purple" />
                  </div>
                  <h3 className="font-semibold">Completed Assessments</h3>
                </div>
                <p className="text-3xl font-bold">{getCompletedAssessmentsCount()}</p>
              </Card>
              
              <Card className="p-6 bg-brand-orange/10 border-brand-orange/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold">Assessments Available</h3>
                </div>
                <p className="text-3xl font-bold">{getAvailableAssessmentsCount()}</p>
              </Card>
              
              <Card className="p-6 bg-brand-green/10 border-brand-green/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
                    <History className="h-5 w-5 text-brand-green" />
                  </div>
                  <h3 className="font-semibold">Last Assessment</h3>
                </div>
                {latestAssessment ? (
                  <p className="text-lg font-medium">
                    {getNameForAssessment(latestAssessment.assessment_type)}
                  </p>
                ) : (
                  <p className="text-lg font-medium text-muted-foreground">No assessments taken</p>
                )}
              </Card>
            </div>
            
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Assessment History</h2>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="text-brand-purple hover:text-brand-dark-purple hover:bg-brand-purple/5"
                >
                  Take New Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center py-10">
                  <p>Loading your assessment history...</p>
                </div>
              ) : error ? (
                <Card className="p-6 text-center bg-muted/30">
                  <p className="text-red-500">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="default"
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </Card>
              ) : assessmentResults.length > 0 ? (
                <div className="space-y-4">
                  {assessmentResults.map((assessment) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-5 hover:shadow-md transition-shadow border border-border/40">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", getColorForAssessment(assessment.assessment_type))}>
                              {getIconForAssessment(assessment.assessment_type)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{getNameForAssessment(assessment.assessment_type)}</h3>
                              <p className="text-sm text-muted-foreground">
                                Completed on {new Date(assessment.created_at).toLocaleDateString()}
                              </p>
                              {assessment.result_data?.primary_result && (
                                <div className="mt-1">
                                  <span className={cn("text-sm font-medium px-2 py-0.5 rounded-full", 
                                    `bg-${getColorForAssessment(assessment.assessment_type)}/10 text-${getColorForAssessment(assessment.assessment_type).replace('bg-', '')}`
                                  )}>
                                    {assessment.result_data.primary_result}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {assessment.result_data?.scores && (
                            <div className="w-full md:w-1/3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Score</span>
                                <span className="font-medium">
                                  {Math.round(getProgressValue(assessment.result_data.scores, assessment.assessment_type))}%
                                </span>
                              </div>
                              <Progress 
                                value={getProgressValue(assessment.result_data.scores, assessment.assessment_type)} 
                                className={cn("h-2", 
                                  `${getColorForAssessment(assessment.assessment_type)}/20`
                                )} 
                              />
                            </div>
                          )}
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(getAssessmentLink(assessment.assessment_type))}
                              className="text-sm"
                            >
                              View Results
                              <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => navigate(getAssessmentLink(assessment.assessment_type))}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-center bg-muted/30">
                  <p className="text-muted-foreground">You haven't completed any assessments yet.</p>
                  <Button 
                    onClick={() => navigate('/')} 
                    variant="default"
                    className="mt-4"
                  >
                    Explore Assessments
                  </Button>
                </Card>
              )}
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
