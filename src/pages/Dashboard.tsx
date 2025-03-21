
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  Rocket, 
  ArrowRight, 
  BarChart3, 
  History
} from 'lucide-react';
import AssessmentTable from '@/components/AssessmentTable';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { AssessmentResult } from '@/components/AssessmentTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user]);

  // Get the last completed assessment
  const lastAssessment = assessments.length > 0 ? assessments[0] : null;

  const getAssessmentName = (type: string) => {
    const assessmentTypes: Record<string, string> = {
      'riasec': 'RIASEC Model Assessment',
      'eq-navigator': 'EQ Navigator Assessment',
      'future-pathways': 'Future Pathways Assessment',
      'career-vision': 'Career Vision Assessment',
      'scct-assessment': 'SCCT Assessment'
    };
    
    return assessmentTypes[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ') + ' Assessment';
  };

  const getAssessmentTypeStats = () => {
    const typeCount: Record<string, number> = {};
    
    assessments.forEach(assessment => {
      const type = assessment.assessment_type;
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    
    return typeCount;
  };

  const typeStats = getAssessmentTypeStats();
  const totalAvailableAssessments = 5; // Total assessments available in the system

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
                <p className="text-3xl font-bold">{assessments.length}</p>
              </Card>
              
              <Card className="p-6 bg-brand-orange/10 border-brand-orange/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold">Assessments Available</h3>
                </div>
                <p className="text-3xl font-bold">{totalAvailableAssessments}</p>
              </Card>
              
              <Card className="p-6 bg-brand-green/10 border-brand-green/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-green/20 rounded-full flex items-center justify-center">
                    <History className="h-5 w-5 text-brand-green" />
                  </div>
                  <h3 className="font-semibold">Last Assessment</h3>
                </div>
                {lastAssessment ? (
                  <p className="text-lg font-medium">{getAssessmentName(lastAssessment.assessment_type)}</p>
                ) : (
                  <p className="text-lg text-muted-foreground">No assessments completed</p>
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
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading your assessments...</p>
                </div>
              ) : (
                <AssessmentTable />
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
