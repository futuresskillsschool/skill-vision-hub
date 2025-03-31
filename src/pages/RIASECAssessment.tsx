
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const riasecCategories = {
  R: "Realistic - working with things",
  I: "Investigative - working with ideas",
  A: "Artistic - working with creativity",
  S: "Social - working with people",
  E: "Enterprising - working with leadership",
  C: "Conventional - working with organization"
};

type RIASECCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

interface Question {
  id: string;
  text: string;
  category: RIASECCode;
}

const questions: Question[] = [
  // Realistic Questions
  { id: 'q1', text: 'I enjoy building things with my hands.', category: 'R' },
  { id: 'q2', text: 'I like working with tools, machines, or technology.', category: 'R' },
  
  // Investigative Questions  
  { id: 'q3', text: 'I enjoy solving complex problems and puzzles.', category: 'I' },
  { id: 'q4', text: 'I\'m curious about how things work and why things happen.', category: 'I' },
  
  // Artistic Questions
  { id: 'q5', text: 'I enjoy creative activities like art, music, or writing.', category: 'A' },
  { id: 'q6', text: 'I prefer tasks that allow me to express myself.', category: 'A' },
  
  // Social Questions
  { id: 'q7', text: 'I enjoy helping others and working with people.', category: 'S' },
  { id: 'q8', text: 'I\'m good at explaining things to others.', category: 'S' },
  
  // Enterprising Questions
  { id: 'q9', text: 'I like to take charge and lead others.', category: 'E' },
  { id: 'q10', text: 'I enjoy persuading others and selling ideas or products.', category: 'E' },
  
  // Conventional Questions
  { id: 'q11', text: 'I like following clear procedures and rules.', category: 'C' },
  { id: 'q12', text: 'I enjoy organizing information and working with data.', category: 'C' },
];

const RIASECAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage, 
    (currentPage + 1) * questionsPerPage
  );
  
  useEffect(() => {
    // Calculate progress based on answers
    const answeredCount = Object.keys(answers).length;
    const progressValue = (answeredCount / questions.length) * 100;
    setProgress(progressValue);
  }, [answers]);
  
  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
  const goToNextPage = () => {
    window.scrollTo(0, 0);
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // If this is the last page, submit the assessment
      handleSubmit();
    }
  };
  
  const goToPreviousPage = () => {
    window.scrollTo(0, 0);
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const calculateScores = () => {
    const scores: Record<RIASECCode, number> = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0
    };
    
    questions.forEach(question => {
      const answer = answers[question.id] || 0;
      scores[question.category] += answer;
    });
    
    return scores;
  };
  
  const handleSubmit = () => {
    const scores = calculateScores();
    
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
    
    // Navigate directly to results page with scores
    navigate('/assessment/riasec/results', {
      state: {
        scores,
        assessmentType: 'riasec'
      }
    });
  };
  
  const isPageComplete = () => {
    return currentQuestions.every(q => answers[q.id] !== undefined);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-3xl font-bold">RIASEC Assessment</h1>
                <span className="text-sm font-medium bg-brand-purple text-white px-3 py-1 rounded-full">
                  Page {currentPage + 1} of {totalPages}
                </span>
              </div>
              
              <div className="mb-4">
                <Progress value={progress} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(progress)}% complete ({Object.keys(answers).length} of {questions.length} questions answered)
                </p>
              </div>
              
              <p className="text-muted-foreground">
                Rate how much you enjoy or would enjoy each activity on a scale from 1 (strongly dislike) to 5 (strongly enjoy).
              </p>
            </div>
            
            <Card className="p-6 md:p-8 mb-8 shadow-md">
              <div className="space-y-6">
                {currentQuestions.map((question, index) => (
                  <motion.div 
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start mb-3">
                      <p className="font-medium flex-grow">{question.text}</p>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {riasecCategories[question.category].split(' - ')[0]}
                      </span>
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
                      <span>Strongly dislike</span>
                      <span>Strongly enjoy</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
              >
                Previous Page
              </Button>
              
              <Button 
                onClick={goToNextPage}
                disabled={!isPageComplete()}
                className={currentPage === totalPages - 1 ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {currentPage === totalPages - 1 ? "Submit Assessment" : "Next Page"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RIASECAssessment;
