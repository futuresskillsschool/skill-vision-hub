
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  ArrowRight, 
  BarChart3, 
  History,
  AlertCircle
} from 'lucide-react';
import AssessmentTable from '@/components/AssessmentTable';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { AssessmentResult } from '@/components/AssessmentTable';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAssessments = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setAssessments(data as AssessmentResult[]);
        }
      } catch (error) {
        console.error('Error fetching assessment results:', error);
        toast({
          title: "Failed to load assessments",
          description: "There was a problem loading your assessments. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user, toast]);

  // Get the last completed assessment
  const lastAssessment = assessments.length > 0 ? assessments[0] : null;

  const getAssessmentName = (type: string) => {
    const assessmentTypes: Record<string, string> = {
      'riasec': 'RIASEC Model Assessment',
      'eq-navigator': 'EQ Navigator Assessment',
      'future-pathways': 'Future Pathways Assessment',
      'career-vision': 'Career Vision Assessment',
      'scct': 'SCCT Assessment'
    };
    
    return assessmentTypes[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ') + ' Assessment';
  };

  // Fix the assessment type stats calculation to prevent unlimited counting
  const getAssessmentTypeStats = () => {
    // Count unique assessment types
    const uniqueTypes = new Set<string>();
    
    assessments.forEach(assessment => {
      uniqueTypes.add(assessment.assessment_type);
    });
    
    // Return the number of unique assessment types completed
    return uniqueTypes.size;
  };

  // Calculate how many unique assessment types the user has completed
  const completedAssessmentTypes = getAssessmentTypeStats();
  const totalAvailableAssessments = 5; // Total assessments available in the system

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Your Assessment Dashboard</h1>
                <p className="text-muted-foreground">Track your assessments and review your results</p>
              </header>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-brand-purple/20 rounded-full flex items-center justify-center">
                      <Brain className="h-5 w-5 text-brand-purple" />
                    </div>
                    <h3 className="font-semibold">Completed Assessments</h3>
                  </div>
                  <p className="text-3xl font-bold text-brand-purple">{assessments.length}</p>
                  {assessments.length === 0 && !loading && (
                    <p className="text-sm text-muted-foreground mt-2">
                      You haven't taken any assessments yet.
                    </p>
                  )}
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-brand-orange" />
                    </div>
                    <h3 className="font-semibold">Assessment Types</h3>
                  </div>
                  <p className="text-3xl font-bold text-brand-orange">{completedAssessmentTypes} <span className="text-lg font-medium text-muted-foreground">of {totalAvailableAssessments}</span></p>
                  <div className="w-full bg-orange-200/50 h-1.5 rounded-full mt-2">
                    <div
                      className="bg-brand-orange h-1.5 rounded-full"
                      style={{ width: `${(completedAssessmentTypes / totalAvailableAssessments) * 100}%` }}
                    ></div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
                      <History className="h-5 w-5 text-brand-green" />
                    </div>
                    <h3 className="font-semibold">Last Assessment</h3>
                  </div>
                  {lastAssessment ? (
                    <div>
                      <p className="text-lg font-medium text-brand-green">{getAssessmentName(lastAssessment.assessment_type)}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(lastAssessment.created_at).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg text-muted-foreground">No assessments completed</p>
                  )}
                </Card>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-10"
            >
              <Card className="p-6 border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Explore More Career Insights</h3>
                    <p className="text-muted-foreground mb-4">
                      Taking multiple assessments gives you a more complete picture of your career potential.
                      Each assessment measures different aspects of your skills, interests, and aptitudes.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/')}
                      className="text-brand-purple border-brand-purple hover:bg-brand-purple/5"
                    >
                      Explore Assessments
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
            
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Assessment History</h2>
                {assessments.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    className="text-brand-purple hover:text-brand-dark-purple hover:bg-brand-purple/5"
                  >
                    Take New Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <Separator className="mb-6" />
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-brand-purple border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-muted-foreground">Loading your assessments...</p>
                </div>
              ) : (
                <AssessmentTable assessments={assessments} />
              )}
            </motion.section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
