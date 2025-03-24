
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowLeft, ArrowRight, Check, BrainCircuit, Heart, Info, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';

// Define the structure of a question
interface Question {
  id: number;
  scenario: string;
  options: {
    id: string;
    text: string;
    score: number;
  }[];
}

// EQ Navigator questions
const eqQuestions: Question[] = [
  {
    id: 1,
    scenario: "You're excited to share some good news with a friend, but they seem distracted and uninterested. You...",
    options: [
      { id: "a", text: "Get angry and accuse them of not caring about you.", score: 1 },
      { id: "b", text: "Feel disappointed but try to understand why they might be distracted. Maybe they're having a bad day.", score: 4 },
      { id: "c", text: "Pretend you're not bothered, even though you're a little hurt.", score: 2 },
      { id: "d", text: "Stop talking about your news and change the subject.", score: 2 }
    ]
  },
  {
    id: 2,
    scenario: "You witness a classmate making fun of another student's appearance. You...",
    options: [
      { id: "a", text: "Laugh along with the classmate.", score: 1 },
      { id: "b", text: "Ignore it and hope it stops.", score: 2 },
      { id: "c", text: "Tell the classmate that it's not okay to make fun of someone's appearance and try to support the student being targeted.", score: 4 },
      { id: "d", text: "Tell the targeted student to ignore the comments.", score: 2 }
    ]
  },
  {
    id: 3,
    scenario: "You're feeling really stressed about upcoming exams. You...",
    options: [
      { id: "a", text: "Isolate yourself and worry constantly.", score: 1 },
      { id: "b", text: "Talk to a friend or family member about how you're feeling and find healthy ways to manage stress (e.g., exercise, hobbies).", score: 4 },
      { id: "c", text: "Procrastinate and avoid thinking about the exams.", score: 2 },
      { id: "d", text: "Try to convince yourself you don't care about the exams.", score: 1 }
    ]
  },
  {
    id: 4,
    scenario: "A friend is going through a tough time (e.g., family issues, break-up). You...",
    options: [
      { id: "a", text: "Offer a listening ear and support, letting them know you're there for them.", score: 4 },
      { id: "b", text: "Try to give them advice, even if you're not sure what to say.", score: 3 },
      { id: "c", text: "Avoid them because you don't know how to handle the situation.", score: 1 },
      { id: "d", text: "Tell them to \"toughen up.\"", score: 1 }
    ]
  },
  {
    id: 5,
    scenario: "You receive constructive criticism on a project. You...",
    options: [
      { id: "a", text: "Get defensive and argue with the person giving the feedback.", score: 1 },
      { id: "b", text: "Listen to the feedback, even if it's hard to hear, and try to learn from it.", score: 4 },
      { id: "c", text: "Feel hurt and take it personally.", score: 2 },
      { id: "d", text: "Ignore the feedback completely.", score: 1 }
    ]
  },
  {
    id: 6,
    scenario: "You have a strong disagreement with a friend. You...",
    options: [
      { id: "a", text: "Resort to personal insults and name-calling.", score: 1 },
      { id: "b", text: "Try to see things from your friend's perspective and find a compromise.", score: 4 },
      { id: "c", text: "Refuse to talk to your friend anymore.", score: 1 },
      { id: "d", text: "Give them the silent treatment.", score: 1 }
    ]
  },
  {
    id: 7,
    scenario: "You achieve a goal you've been working towards. You...",
    options: [
      { id: "a", text: "Brag about your achievement to everyone.", score: 2 },
      { id: "b", text: "Celebrate your success and acknowledge the effort you put in.", score: 4 },
      { id: "c", text: "Downplay your achievement, as if it wasn't a big deal.", score: 2 },
      { id: "d", text: "Immediately start worrying about your next goal.", score: 2 }
    ]
  },
  {
    id: 8,
    scenario: "You make a mistake. You...",
    options: [
      { id: "a", text: "Blame someone else.", score: 1 },
      { id: "b", text: "Take responsibility for your actions and try to fix the mistake.", score: 4 },
      { id: "c", text: "Try to hide the mistake.", score: 1 },
      { id: "d", text: "Beat yourself up about it excessively.", score: 2 }
    ]
  },
  {
    id: 9,
    scenario: "You see a new student struggling to fit in. You...",
    options: [
      { id: "a", text: "Ignore them.", score: 1 },
      { id: "b", text: "Make fun of them.", score: 1 },
      { id: "c", text: "Introduce yourself and try to make them feel welcome.", score: 4 },
      { id: "d", text: "Observe them from a distance but don't interact.", score: 2 }
    ]
  },
  {
    id: 10,
    scenario: "You feel overwhelmed by your emotions. You...",
    options: [
      { id: "a", text: "Try to suppress or ignore your feelings.", score: 2 },
      { id: "b", text: "Find healthy ways to express your emotions (e.g., talking to someone, journaling, creative activities).", score: 4 },
      { id: "c", text: "Lash out at others.", score: 1 },
      { id: "d", text: "Engage in self-destructive behaviors.", score: 1 }
    ]
  }
];

// Group questions for a multi-question page layout
const groupQuestions = (questions: Question[], perPage: number) => {
  const groupedQuestions = [];
  for (let i = 0; i < questions.length; i += perPage) {
    groupedQuestions.push(questions.slice(i, i + perPage));
  }
  return groupedQuestions;
};

const EQNavigatorAssessment = () => {
  const navigate = useNavigate();
  const { user, storeAssessmentResult } = useAuth();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(Array(eqQuestions.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const confettiRef = useRef<HTMLDivElement>(null);
  
  // Group questions 5 per page
  const questionsPerPage = 5;
  const groupedQuestions = groupQuestions(eqQuestions, questionsPerPage);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Reset to top of page on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate progress percentage
  const progressPercentage = ((currentPageIndex + 1) / groupedQuestions.length) * 100;
  
  // Function to trigger confetti on completion
  const triggerConfetti = () => {
    if (confettiRef.current) {
      const { top, left, width, height } = confettiRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { 
          x: centerX / window.innerWidth, 
          y: centerY / window.innerHeight 
        },
        colors: ['#FF5733', '#FFC300', '#FF5733', '#C70039', '#900C3F']
      });
    }
  };

  const handleOptionSelect = (questionIndex: number, optionId: string) => {
    const newSelectedOptions = [...selectedOptions];
    const globalQuestionIndex = currentPageIndex * questionsPerPage + questionIndex;
    newSelectedOptions[globalQuestionIndex] = optionId;
    setSelectedOptions(newSelectedOptions);
  };

  const handleNext = () => {
    if (currentPageIndex < groupedQuestions.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // Calculate total score
      let score = 0;
      selectedOptions.forEach((optionId, index) => {
        const question = eqQuestions[index];
        const option = question.options.find(opt => opt.id === optionId);
        if (option) {
          score += option.score;
        }
      });
      setTotalScore(score);
      setShowResults(true);
      setTimeout(() => triggerConfetti(), 500);
      
      // Save results to Supabase if the user is logged in
      if (user) {
        const resultData = {
          totalScore: score,
          answers: selectedOptions.map((optionId, index) => {
            const question = eqQuestions[index];
            const option = question.options.find(opt => opt.id === optionId);
            return {
              questionId: question.id,
              question: question.scenario,
              answer: option?.text,
              score: option?.score
            };
          })
        };
        
        storeAssessmentResult('eq-navigator', resultData);
      } else {
        toast({
          title: "Not logged in",
          description: "Sign in to save your results for future reference.",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleViewResults = () => {
    navigate('/eq-navigator/results', { 
      state: { 
        totalScore, 
        selectedOptions,
        questions: eqQuestions
      } 
    });
  };

  // Check if all questions on current page have been answered
  const isCurrentPageComplete = () => {
    const currentQuestions = groupedQuestions[currentPageIndex];
    for (let i = 0; i < currentQuestions.length; i++) {
      const globalIndex = currentPageIndex * questionsPerPage + i;
      if (!selectedOptions[globalIndex]) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-red-50 to-pink-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {!showResults ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`page-${currentPageIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg border-2 border-[hsl(var(--brand-red))/10] p-8 overflow-hidden relative"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[hsl(var(--brand-red))/5] to-pink-100/50 rounded-full -mt-20 -mr-20 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-100/50 to-[hsl(var(--brand-red))/5] rounded-full -mb-20 -ml-20 blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                      <div>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(-1)}
                          className="mb-4 text-[hsl(var(--brand-red))] hover:text-[hsl(var(--brand-red-dark))] -ml-3"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                          <div className="bg-gradient-to-br from-[hsl(var(--brand-red))/10] to-red-100 p-2.5 rounded-full mr-3 shadow-sm">
                            <Heart className="h-6 w-6 text-[hsl(var(--brand-red))]" />
                          </div>
                          EQ Navigator Assessment
                        </h1>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-[hsl(var(--brand-red))/10] text-[hsl(var(--brand-red))] px-3 py-1.5 rounded-full text-sm font-medium flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          ~5 mins
                        </div>
                        <div className="bg-[hsl(var(--brand-red))/10] text-[hsl(var(--brand-red))] px-3 py-1.5 rounded-full text-sm font-medium">
                          {Math.min((currentPageIndex + 1) * questionsPerPage, eqQuestions.length)} of {eqQuestions.length} questions
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6 p-4 bg-[hsl(var(--brand-red))/5] border border-[hsl(var(--brand-red))/20] rounded-xl flex items-start">
                      <div className="bg-[hsl(var(--brand-red))/10] text-[hsl(var(--brand-red))] p-2 rounded-full mr-3 flex-shrink-0">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-medium text-gray-800 mb-1">About this assessment</h2>
                        <p className="text-gray-600 text-sm">
                          This assessment measures your emotional intelligence across different situations.
                          Choose the options that best reflect how you would genuinely respond.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-medium text-gray-700 flex items-center">
                          <span className="bg-[hsl(var(--brand-red))] text-white w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm font-bold shadow-sm">
                            {currentPageIndex + 1}
                          </span>
                          Page {currentPageIndex + 1} of {groupedQuestions.length}
                        </h2>
                        <span className="text-sm text-gray-500">
                          {Math.round(progressPercentage)}% complete
                        </span>
                      </div>
                      
                      <Progress 
                        value={progressPercentage} 
                        className="h-3 bg-[hsl(var(--brand-red))/10]" 
                        indicatorClassName="bg-gradient-to-r from-[hsl(var(--brand-red))] to-[hsl(var(--brand-red-dark))]" 
                      />
                    </div>
                    
                    <div className="space-y-8">
                      {groupedQuestions[currentPageIndex].map((question, questionIndex) => {
                        const globalQuestionIndex = currentPageIndex * questionsPerPage + questionIndex;
                        return (
                          <motion.div 
                            key={question.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: questionIndex * 0.1 }}
                            className="bg-gradient-to-br from-white to-[hsl(var(--brand-red))/5] rounded-xl p-6 border border-[hsl(var(--brand-red))/20] shadow-md relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-[hsl(var(--brand-red))/5] to-pink-100 rounded-full -mt-10 -mr-10 blur-xl opacity-50"></div>
                            
                            <h3 className="text-lg md:text-xl font-semibold mb-5 flex items-start">
                              <span className="bg-gradient-to-br from-[hsl(var(--brand-red))] to-[hsl(var(--brand-red-dark))] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                                {globalQuestionIndex + 1}
                              </span>
                              <span className="flex-1">{question.scenario}</span>
                            </h3>
                            
                            <RadioGroup 
                              value={selectedOptions[globalQuestionIndex]} 
                              onValueChange={(value) => handleOptionSelect(questionIndex, value)}
                              className="space-y-3"
                            >
                              {question.options.map((option) => (
                                <div 
                                  key={option.id} 
                                  className={`group flex items-start space-x-2 border-2 rounded-xl p-4 transition-all duration-300 ${
                                    selectedOptions[globalQuestionIndex] === option.id 
                                      ? 'border-[hsl(var(--brand-red))] bg-gradient-to-r from-[hsl(var(--brand-red))/10] to-red-50 shadow-md transform -translate-y-0.5' 
                                      : 'border-gray-200 hover:border-[hsl(var(--brand-red))/50] hover:bg-[hsl(var(--brand-red))/5]'
                                  }`}
                                >
                                  <RadioGroupItem 
                                    value={option.id} 
                                    id={`question-${question.id}-option-${option.id}`} 
                                    className="mt-1" 
                                  />
                                  <Label 
                                    htmlFor={`question-${question.id}-option-${option.id}`} 
                                    className="flex-1 cursor-pointer font-medium text-gray-700 group-hover:text-gray-900"
                                  >
                                    {option.text}
                                  </Label>
                                  {selectedOptions[globalQuestionIndex] === option.id && (
                                    <div className="bg-[hsl(var(--brand-red))/20] rounded-full p-1">
                                      <Check className="h-4 w-4 text-[hsl(var(--brand-red))]" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </RadioGroup>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentPageIndex === 0}
                        className="flex items-center gap-1 shadow-sm hover:shadow-md transition-all duration-200 border-[hsl(var(--brand-red))/20] hover:bg-[hsl(var(--brand-red))/5]"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <Button 
                        onClick={handleNext}
                        disabled={!isCurrentPageComplete()}
                        className="bg-gradient-to-r from-[hsl(var(--brand-red))] to-[hsl(var(--brand-red-dark))] hover:from-[hsl(var(--brand-red-dark))] hover:to-[hsl(var(--brand-red))] text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                      >
                        {currentPageIndex === groupedQuestions.length - 1 ? "Finish" : "Next"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-[hsl(var(--brand-red))/10] p-8 md:p-10 text-center overflow-hidden relative"
                ref={confettiRef}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50/30 to-pink-50/30"></div>
                <div className="absolute top-0 right-0 h-64 w-64 bg-gradient-to-br from-[hsl(var(--brand-red))/10] to-pink-100 rounded-full -mt-32 -mr-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 h-64 w-64 bg-gradient-to-br from-pink-100 to-[hsl(var(--brand-red))/10] rounded-full -mb-32 -ml-32 blur-3xl"></div>
                
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative w-32 h-32 mx-auto mb-8"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--brand-red))/20] to-pink-200/50 animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="h-16 w-16 text-[hsl(var(--brand-red))]" />
                    </div>
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[hsl(var(--brand-red))] to-[hsl(var(--brand-red-dark))] bg-clip-text text-transparent">Assessment Complete!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Thank you for completing the EQ Navigator assessment. You're ready to view your personalized emotional intelligence profile!
                  </p>
                  
                  <Button 
                    onClick={handleViewResults}
                    size="lg"
                    className="bg-gradient-to-r from-[hsl(var(--brand-red))] to-[hsl(var(--brand-red-dark))] hover:from-[hsl(var(--brand-red-dark))] hover:to-[hsl(var(--brand-red))] text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg transform hover:-translate-y-1"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    View Your Results
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorAssessment;
