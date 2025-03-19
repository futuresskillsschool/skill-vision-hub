
import { useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulated assessment history data
  const assessmentHistory = [
    {
      id: 1,
      type: 'eq-navigator',
      name: 'EQ Navigator Assessment',
      date: '2023-05-15',
      score: 32,
      maxScore: 40,
      color: 'bg-brand-purple',
      icon: <Brain className="h-5 w-5" />,
      primaryResult: 'Empathetic Explorer'
    },
    {
      id: 2,
      type: 'future-pathways',
      name: 'Future Pathways Explorer',
      date: '2023-05-20',
      color: 'bg-brand-green',
      icon: <Rocket className="h-5 w-5" />,
      primaryResult: 'Tech Innovator & Builder'
    }
  ];

  const getProgressValue = (score: number, maxScore: number) => {
    return (score / maxScore) * 100;
  };

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
                <p className="text-3xl font-bold">{assessmentHistory.length}</p>
              </Card>
              
              <Card className="p-6 bg-brand-orange/10 border-brand-orange/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="font-semibold">Assessments Available</h3>
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
                <p className="text-lg font-medium">Future Pathways Explorer</p>
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
              
              {assessmentHistory.length > 0 ? (
                <div className="space-y-4">
                  {assessmentHistory.map((assessment) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-5 hover:shadow-md transition-shadow border border-border/40">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", assessment.color)}>
                              {assessment.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{assessment.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Completed on {new Date(assessment.date).toLocaleDateString()}
                              </p>
                              <div className="mt-1">
                                <span className={cn("text-sm font-medium px-2 py-0.5 rounded-full", 
                                  assessment.type === 'eq-navigator' ? 'bg-brand-purple/10 text-brand-purple' : 'bg-brand-green/10 text-brand-green'
                                )}>
                                  {assessment.primaryResult}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {assessment.score && (
                            <div className="w-full md:w-1/3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Score</span>
                                <span className="font-medium">{assessment.score}/{assessment.maxScore}</span>
                              </div>
                              <Progress value={getProgressValue(assessment.score, assessment.maxScore)} 
                                className={cn("h-2", 
                                  assessment.type === 'eq-navigator' ? 'bg-brand-purple/20' : 'bg-brand-green/20'
                                )} 
                              />
                            </div>
                          )}
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/${assessment.type}/results`)}
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
