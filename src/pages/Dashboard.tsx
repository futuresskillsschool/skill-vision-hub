
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
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

// Define assessment result type
type AssessmentResult = {
  id: string;
  user_id: string;
  assessment_type: string;
  primary_result: string;
  results: Record<string, number>;
  completed_at: string;
};

// Assessment type config for display purposes
const assessmentConfig = {
  'riasec': {
    name: 'RIASEC Model Assessment',
    icon: <ClipboardList className="h-5 w-5" />,
    color: 'bg-brand-purple',
    route: '/riasec-results',
    maxScore: 36 * 5 // 36 questions, max 5 points each
  },
  'eq-navigator': {
    name: 'EQ Navigator Assessment',
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-brand-purple',
    route: '/eq-navigator/results',
    maxScore: 40
  },
  'future-pathways': {
    name: 'Future Pathways Explorer',
    icon: <Rocket className="h-5 w-5" />,
    color: 'bg-brand-green',
    route: '/future-pathways/results',
    maxScore: 50
  },
  'career-vision': {
    name: 'Career Vision Assessment',
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'bg-brand-orange',
    route: '/assessment/career-vision',
    maxScore: 45
  },
  'scct-assessment': {
    name: 'SCCT Assessment',
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-brand-blue',
    route: '/assessment/scct-assessment',
    maxScore: 40
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUser(user);
        
        // Fetch user's assessment results
        const { data, error } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });
        
        if (error) throw error;
        
        setAssessmentResults(data || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const getProgressValue = (score: number, maxScore: number) => {
    return (score / maxScore) * 100;
  };
  
  const getTotalScore = (results: Record<string, number>): number => {
    return Object.values(results).reduce((sum, score) => sum + score, 0);
  };
  
  const getLatestAssessment = () => {
    if (assessmentResults.length === 0) return null;
    return assessmentResults[0];
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            
            {loading ? (
              // Loading state with skeletons
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
                <Skeleton className="h-12 w-48 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <Card className="p-6 bg-brand-purple/10 border-brand-purple/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-brand-purple/20 rounded-full flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-brand-purple" />
                      </div>
                      <h3 className="font-semibold">Completed Assessments</h3>
                    </div>
                    <p className="text-3xl font-bold">{assessmentResults.length}</p>
                  </Card>
                  
                  <Card className="p-6 bg-brand-orange/10 border-brand-orange/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-brand-orange" />
                      </div>
                      <h3 className="font-semibold">Available Assessments</h3>
                    </div>
                    <p className="text-3xl font-bold">5</p>
                  </Card>
                  
                  <Card className="p-6 bg-brand-green/10 border-brand-green/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
                        <History className="h-5 w-5 text-brand-green" />
                      </div>
                      <h3 className="font-semibold">Last Assessment</h3>
                    </div>
                    <p className="text-lg font-medium">
                      {latestAssessment ? 
                        assessmentConfig[latestAssessment.assessment_type as keyof typeof assessmentConfig]?.name || 'Unknown Assessment'
                        : 'None completed yet'}
                    </p>
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
                  
                  {assessmentResults.length > 0 ? (
                    <div className="space-y-4">
                      {assessmentResults.map((assessment) => {
                        const config = assessmentConfig[assessment.assessment_type as keyof typeof assessmentConfig];
                        const totalScore = getTotalScore(assessment.results);
                        
                        return (
                          <motion.div
                            key={assessment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="p-5 hover:shadow-md transition-shadow border border-border/40">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config?.color || 'bg-gray-500')}>
                                    {config?.icon || <ClipboardList className="h-5 w-5" />}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{config?.name || assessment.assessment_type}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      Completed on {formatDate(assessment.completed_at)}
                                    </p>
                                    <div className="mt-1">
                                      <span className={cn("text-sm font-medium px-2 py-0.5 rounded-full", 
                                        `bg-${config?.color.split('-')[1]}/10 text-${config?.color.split('-')[1]}`
                                      )}>
                                        {assessment.primary_result}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="w-full md:w-1/3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Score</span>
                                    <span className="font-medium">
                                      {totalScore}/{config?.maxScore || 100}
                                    </span>
                                  </div>
                                  <Progress 
                                    value={getProgressValue(totalScore, config?.maxScore || 100)} 
                                    className={cn("h-2", 
                                      `bg-${config?.color.split('-')[1]}/20`
                                    )} 
                                  />
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(config?.route || '/')}
                                    className="text-sm"
                                  >
                                    View Results
                                    <ChevronRight className="ml-1 h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
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
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
