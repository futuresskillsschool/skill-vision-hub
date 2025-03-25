
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface QuestionnaireSection {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    text: string;
    tooltip?: string;
  }[];
}

const RIASEC_QUESTIONS: QuestionnaireSection = {
  id: 'riasec',
  title: 'RIASEC Profile',
  description: 'Indicate how much you\'d enjoy doing each of the following activities:',
  questions: [
    { id: 'R1', text: 'Build something with tools and materials', tooltip: 'Activities involving hands-on work with physical objects' },
    { id: 'I1', text: 'Solve puzzles or complex problems', tooltip: 'Activities that involve analysis and critical thinking' },
    { id: 'A1', text: 'Create art, music, or creative writing', tooltip: 'Activities that involve self-expression and creativity' },
    { id: 'S1', text: 'Teach or help others learn something new', tooltip: 'Activities that involve helping, teaching, or providing service to others' },
    { id: 'E1', text: 'Lead a group or organization', tooltip: 'Activities that involve leadership, persuasion, or management' },
    { id: 'C1', text: 'Create organized systems for information', tooltip: 'Activities that involve organization, attention to detail, and following procedures' },
    { id: 'R2', text: 'Fix mechanical or electronic devices', tooltip: 'Working with machines, tools, or physical systems' },
    { id: 'I2', text: 'Research and analyze information', tooltip: 'Investigating questions and finding explanations' },
    { id: 'A2', text: 'Design something visually appealing', tooltip: 'Creating aesthetic or artistic works' },
    { id: 'S2', text: 'Counsel someone through a problem', tooltip: 'Supporting others through listening and guidance' },
    { id: 'E2', text: 'Persuade others to do things your way', tooltip: 'Influencing others and taking initiative' },
    { id: 'C2', text: 'Work with details and follow instructions', tooltip: 'Being precise, orderly, and methodical' },
  ],
};

const PATHWAYS_QUESTIONS: QuestionnaireSection = {
  id: 'pathways',
  title: 'Future Pathways Explorer',
  description: 'Rate your interest in these possible future-oriented activities:',
  questions: [
    { id: 'tech-innovator1', text: 'Develop innovative technologies to solve global problems', tooltip: 'Creating new technological solutions for world challenges' },
    { id: 'digital-creator1', text: 'Create digital content or virtual experiences', tooltip: 'Producing online content, digital art, or virtual reality experiences' },
    { id: 'data-analyst1', text: 'Analyze data patterns to derive meaningful insights', tooltip: 'Finding patterns and meaning in large sets of information' },
    { id: 'entrepreneur1', text: 'Start and grow your own business venture', tooltip: 'Building and scaling a business from the ground up' },
    { id: 'helper1', text: 'Use technology to improve health or education', tooltip: 'Applying tech solutions to social services like healthcare or education' },
  ],
};

const EQ_QUESTIONS: QuestionnaireSection = {
  id: 'eq',
  title: 'EQ Navigator',
  description: 'How well do these statements describe you?',
  questions: [
    { id: 'eq1', text: 'I can identify my emotions as I experience them', tooltip: 'Being aware of your feelings in the moment' },
    { id: 'eq2', text: 'I recognize how my emotions affect my behavior', tooltip: 'Understanding the connection between feelings and actions' },
    { id: 'eq3', text: 'I can calm myself when upset or stressed', tooltip: 'Self-regulation and managing negative emotions' },
    { id: 'eq4', text: 'I can understand how others feel based on their expressions', tooltip: 'Reading non-verbal cues and expressions' },
    { id: 'eq5', text: 'I am able to maintain positive relationships', tooltip: 'Building and sustaining healthy connections with others' },
    { id: 'eq6', text: 'I can adapt my communication style based on who I\'m talking to', tooltip: 'Adjusting how you communicate for different audiences' },
    { id: 'eq7', text: 'I can motivate myself to achieve goals despite setbacks', tooltip: 'Persevering through challenges toward your objectives' },
    { id: 'eq8', text: 'I consider multiple perspectives when making decisions', tooltip: 'Taking various viewpoints into account when deciding' },
  ],
};

const ALL_QUESTIONS = [RIASEC_QUESTIONS, PATHWAYS_QUESTIONS, EQ_QUESTIONS];

const CareerVisionAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [progress, setProgress] = useState(0);

  const currentSection = ALL_QUESTIONS[currentSectionIndex];
  const isLastSection = currentSectionIndex === ALL_QUESTIONS.length - 1;
  const isFirstSection = currentSectionIndex === 0;
  
  useEffect(() => {
    const answeredQuestionsCount = Object.keys(answers).length;
    const totalQuestionsCount = ALL_QUESTIONS.reduce((acc, section) => acc + section.questions.length, 0);
    setProgress((answeredQuestionsCount / totalQuestionsCount) * 100);
  }, [answers]);

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Check if all questions in the current section are answered to auto-advance
    const sectionQuestionIds = currentSection.questions.map(q => q.id);
    const answeredSectionQuestions = sectionQuestionIds.filter(id => newAnswers[id] !== undefined);
    
    if (answeredSectionQuestions.length === sectionQuestionIds.length && !isLastSection) {
      // Wait a moment before advancing to the next section
      setTimeout(() => {
        setCurrentSectionIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    }
  };

  const handleNextSection = () => {
    if (isLastSection) {
      // Calculate results
      const riasecResults = calculateRIASECResults();
      const pathwaysResults = calculatePathwaysResults();
      const eqResults = calculateEQResults();
      
      // Show completion animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Assessment Complete!",
        description: "Your results are ready to view.",
      });
      
      // Navigate to student details page with results
      navigate('/assessment/career-vision/student-details', {
        state: {
          riasec: riasecResults,
          pathways: pathwaysResults,
          eq: eqResults,
          assessmentType: 'career-vision'
        }
      });
      
    } else {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousSection = () => {
    setCurrentSectionIndex(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateRIASECResults = () => {
    const categories = {
      R: ['R1', 'R2'],
      I: ['I1', 'I2'],
      A: ['A1', 'A2'],
      S: ['S1', 'S2'],
      E: ['E1', 'E2'],
      C: ['C1', 'C2']
    };
    
    const results: Record<string, number> = {};
    
    for (const [category, questionIds] of Object.entries(categories)) {
      const sum = questionIds.reduce((acc, id) => acc + (answers[id] || 0), 0);
      results[category] = sum;
    }
    
    return results;
  };

  const calculatePathwaysResults = () => {
    const clusters = {
      'tech-innovator': ['tech-innovator1'],
      'digital-creator': ['digital-creator1'],
      'data-analyst': ['data-analyst1'],
      'entrepreneur': ['entrepreneur1'],
      'helper': ['helper1']
    };
    
    const results: Record<string, number> = {};
    
    for (const [cluster, questionIds] of Object.entries(clusters)) {
      const sum = questionIds.reduce((acc, id) => acc + (answers[id] || 0), 0);
      // Scale up to match the expected range
      results[cluster] = sum * 5;
    }
    
    return results;
  };

  const calculateEQResults = () => {
    const eqQuestionIds = Array.from({ length: 8 }, (_, i) => `eq${i + 1}`);
    const totalScore = eqQuestionIds.reduce((acc, id) => acc + (answers[id] || 0), 0);
    
    // Self-awareness: eq1, eq2
    const selfAwareness = (answers['eq1'] || 0) + (answers['eq2'] || 0);
    
    // Self-regulation: eq3, eq7
    const selfRegulation = (answers['eq3'] || 0) + (answers['eq7'] || 0);
    
    // Social awareness: eq4, eq8
    const socialAwareness = (answers['eq4'] || 0) + (answers['eq8'] || 0);
    
    // Relationship management: eq5, eq6
    const relationshipManagement = (answers['eq5'] || 0) + (answers['eq6'] || 0);
    
    return {
      totalScore,
      selfAwareness,
      selfRegulation,
      socialAwareness,
      relationshipManagement
    };
  };

  const isSectionComplete = () => {
    return currentSection.questions.every(q => answers[q.id] !== undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-brand-purple/5 to-brand-blue/5">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">Career Vision Assessment</h1>
                <span className="text-sm font-medium bg-brand-purple text-white px-3 py-1 rounded-full">
                  Section {currentSectionIndex + 1} of {ALL_QUESTIONS.length}
                </span>
              </div>
              
              <Progress value={progress} className="h-2 mb-2" />
              
              <p className="text-muted-foreground">
                This assessment combines three powerful tools to give you a comprehensive career vision.
              </p>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 md:p-8 mb-8 shadow-md">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">{currentSection.title}</h2>
                    <p className="text-muted-foreground">{currentSection.description}</p>
                  </div>
                  
                  <div className="space-y-8">
                    {currentSection.questions.map((question) => (
                      <div key={question.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start mb-3">
                          <p className="font-medium flex-grow">{question.text}</p>
                          
                          {question.tooltip && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                    <HelpCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{question.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Button
                              key={value}
                              variant={answers[question.id] === value ? "default" : "outline"}
                              className={`relative h-12 ${
                                answers[question.id] === value 
                                ? "bg-brand-purple hover:bg-brand-purple/90" 
                                : "hover:bg-brand-purple/10"
                              }`}
                              onClick={() => handleAnswer(question.id, value)}
                            >
                              {value}
                              {answers[question.id] === value && (
                                <CheckCircle className="h-4 w-4 absolute -top-1 -right-1 text-white bg-green-500 rounded-full" />
                              )}
                            </Button>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>Not at all</span>
                          <span>Very much</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousSection}
                    disabled={isFirstSection}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Section
                  </Button>
                  
                  <Button 
                    onClick={handleNextSection}
                    disabled={!isSectionComplete()}
                    className={isLastSection ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {isLastSection ? "Complete Assessment" : "Next Section"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerVisionAssessment;
