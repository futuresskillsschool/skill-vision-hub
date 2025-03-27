
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Define the structure of a question
interface Question {
  id: number;
  scenario: string;
  options: Array<{
    id: string;
    text: string;
    score: number;
  }>;
}

// EQ Navigator questions
const questions: Question[] = [
  {
    id: 1,
    scenario: "You're excited to share some good news with a friend, but they seem distracted and uninterested. You...",
    options: [
      { id: "1a", text: "Get angry and accuse them of not caring about you.", score: 1 },
      { id: "1b", text: "Feel disappointed but try to understand why they might be distracted. Maybe they're having a bad day.", score: 4 },
      { id: "1c", text: "Pretend you're not bothered, even though you're a little hurt.", score: 2 },
      { id: "1d", text: "Stop talking about your news and change the subject.", score: 3 }
    ]
  },
  {
    id: 2,
    scenario: "You witness a classmate making fun of another student's appearance. You...",
    options: [
      { id: "2a", text: "Laugh along with the classmate.", score: 1 },
      { id: "2b", text: "Ignore it and hope it stops.", score: 2 },
      { id: "2c", text: "Tell the classmate that it's not okay to make fun of someone's appearance and try to support the student being targeted.", score: 4 },
      { id: "2d", text: "Tell the targeted student to ignore the comments.", score: 3 }
    ]
  },
  {
    id: 3,
    scenario: "You're feeling really stressed about upcoming exams. You...",
    options: [
      { id: "3a", text: "Isolate yourself and worry constantly.", score: 1 },
      { id: "3b", text: "Talk to a friend or family member about how you're feeling and find healthy ways to manage stress (e.g., exercise, hobbies).", score: 4 },
      { id: "3c", text: "Procrastinate and avoid thinking about the exams.", score: 2 },
      { id: "3d", text: "Try to convince yourself you don't care about the exams.", score: 3 }
    ]
  },
  {
    id: 4,
    scenario: "A friend is going through a tough time (e.g., family issues, break-up). You...",
    options: [
      { id: "4a", text: "Offer a listening ear and support, letting them know you're there for them.", score: 4 },
      { id: "4b", text: "Try to give them advice, even if you're not sure what to say.", score: 3 },
      { id: "4c", text: "Avoid them because you don't know how to handle the situation.", score: 1 },
      { id: "4d", text: "Tell them to \"toughen up.\"", score: 2 }
    ]
  },
  {
    id: 5,
    scenario: "You receive constructive criticism on a project. You...",
    options: [
      { id: "5a", text: "Get defensive and argue with the person giving the feedback.", score: 1 },
      { id: "5b", text: "Listen to the feedback, even if it's hard to hear, and try to learn from it.", score: 4 },
      { id: "5c", text: "Feel hurt and take it personally.", score: 2 },
      { id: "5d", text: "Ignore the feedback completely.", score: 3 }
    ]
  },
  {
    id: 6,
    scenario: "You have a strong disagreement with a friend. You...",
    options: [
      { id: "6a", text: "Resort to personal insults and name-calling.", score: 1 },
      { id: "6b", text: "Try to see things from your friend's perspective and find a compromise.", score: 4 },
      { id: "6c", text: "Refuse to talk to your friend anymore.", score: 2 },
      { id: "6d", text: "Give them the silent treatment.", score: 3 }
    ]
  },
  {
    id: 7,
    scenario: "You achieve a goal you've been working towards. You...",
    options: [
      { id: "7a", text: "Brag about your achievement to everyone.", score: 2 },
      { id: "7b", text: "Celebrate your success and acknowledge the effort you put in.", score: 4 },
      { id: "7c", text: "Downplay your achievement, as if it wasn't a big deal.", score: 3 },
      { id: "7d", text: "Immediately start worrying about your next goal.", score: 1 }
    ]
  },
  {
    id: 8,
    scenario: "You make a mistake. You...",
    options: [
      { id: "8a", text: "Blame someone else.", score: 1 },
      { id: "8b", text: "Take responsibility for your actions and try to fix the mistake.", score: 4 },
      { id: "8c", text: "Try to hide the mistake.", score: 2 },
      { id: "8d", text: "Beat yourself up about it excessively.", score: 3 }
    ]
  },
  {
    id: 9,
    scenario: "You see a new student struggling to fit in. You...",
    options: [
      { id: "9a", text: "Ignore them.", score: 2 },
      { id: "9b", text: "Make fun of them.", score: 1 },
      { id: "9c", text: "Introduce yourself and try to make them feel welcome.", score: 4 },
      { id: "9d", text: "Observe them from a distance but don't interact.", score: 3 }
    ]
  },
  {
    id: 10,
    scenario: "You feel overwhelmed by your emotions. You...",
    options: [
      { id: "10a", text: "Try to suppress or ignore your feelings.", score: 2 },
      { id: "10b", text: "Find healthy ways to express your emotions (e.g., talking to someone, journaling, creative activities).", score: 4 },
      { id: "10c", text: "Lash out at others.", score: 1 },
      { id: "10d", text: "Engage in self-destructive behaviors.", score: 3 }
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
  const [selectedOptions, setSelectedOptions] = useState<string[]>(Array(questions.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  // Group questions 1 per page for better focus
  const questionsPerPage = 1;
  const groupedQuestions = groupQuestions(questions, questionsPerPage);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Reset to top of page on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate progress percentage
  const progressPercentage = ((currentPageIndex + 1) / groupedQuestions.length) * 100;

  const handleOptionSelect = (questionIndex: number, optionId: string) => {
    const newSelectedOptions = [...selectedOptions];
    const globalQuestionIndex = currentPageIndex * questionsPerPage + questionIndex;
    newSelectedOptions[globalQuestionIndex] = optionId;
    setSelectedOptions(newSelectedOptions);
  };

  const calculateScore = () => {
    let score = 0;
    selectedOptions.forEach((optionId, index) => {
      if (optionId) {
        const question = questions[index];
        const selectedOption = question.options.find(opt => opt.id === optionId);
        if (selectedOption) {
          score += selectedOption.score;
        }
      }
    });
    return score;
  };

  const handleNext = () => {
    if (currentPageIndex < groupedQuestions.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // Calculate final score
      const finalScore = calculateScore();
      setTotalScore(finalScore);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleViewResults = () => {
    // Navigate to the student details page before showing results
    navigate('/assessment/eq-navigator/student-details', { 
      state: { 
        totalScore,
        selectedOptions,
        questions
      } 
    });
  };

  // Check if all questions on current page have been answered
  const isCurrentPageComplete = () => {
    const currentQuestions = groupedQuestions[currentPageIndex];
    for (let i = 0; i < currentQuestions.length; i++) {
      const globalIndex = currentPageIndex * questionsPerPage + i;
      if (selectedOptions[globalIndex] === '') {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#6b46c1] via-[#7e57c2] to-[#9575cd]">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {!showResults ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 text-white border border-white/20"
                >
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-medium">
                        Question {currentPageIndex + 1} of {groupedQuestions.length}
                      </h2>
                      <div className="bg-purple-700/30 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                        EQ Navigator
                      </div>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-white/20" indicatorClassName="bg-gradient-to-r from-white/80 to-purple-300" />
                  </div>
                  
                  <div className="space-y-8">
                    {groupedQuestions[currentPageIndex].map((question, questionIndex) => {
                      const globalQuestionIndex = currentPageIndex * questionsPerPage + questionIndex;
                      return (
                        <div key={question.id} className="rounded-lg p-5 border border-white/20 bg-white/5 backdrop-blur-md">
                          <h3 className="text-xl md:text-2xl font-semibold mb-6 flex items-start">
                            <span className="bg-gradient-to-r from-purple-400/90 to-indigo-400/90 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                              {globalQuestionIndex + 1}
                            </span>
                            <span>{question.scenario}</span>
                          </h3>
                          
                          <RadioGroup 
                            value={selectedOptions[globalQuestionIndex]} 
                            onValueChange={(value) => handleOptionSelect(questionIndex, value)}
                            className="space-y-4"
                          >
                            {question.options.map((option) => (
                              <div 
                                key={option.id} 
                                className={`flex items-start p-4 rounded-lg transition-all duration-300 ${
                                  selectedOptions[globalQuestionIndex] === option.id 
                                    ? 'bg-white/20 border border-white/40 shadow-md' 
                                    : 'border border-white/10 hover:border-white/30 hover:bg-white/10 bg-white/5'
                                }`}
                              >
                                <RadioGroupItem 
                                  value={option.id} 
                                  id={`question-${question.id}-option-${option.id}`} 
                                  className="mt-1 border-white" 
                                />
                                <Label 
                                  htmlFor={`question-${question.id}-option-${option.id}`} 
                                  className="flex-1 cursor-pointer font-normal text-base ml-3"
                                >
                                  {option.text}
                                </Label>
                                {selectedOptions[globalQuestionIndex] === option.id && (
                                  <div className="bg-white/20 rounded-full p-1">
                                    <Check className="h-4 w-4 text-white" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </RadioGroup>

                          {!isCurrentPageComplete() && (
                            <div className="flex items-center mt-4 text-yellow-100 text-sm">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              <span>Please select an option to continue</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <Button 
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentPageIndex === 0}
                      className="flex items-center gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <Button 
                      onClick={handleNext}
                      disabled={!isCurrentPageComplete()}
                      className="bg-white text-purple-700 hover:bg-white/90 flex items-center gap-1"
                    >
                      {currentPageIndex === groupedQuestions.length - 1 ? "Finish" : "Next"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 text-center text-white border border-white/20"
              >
                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">Assessment Complete!</h2>
                <p className="text-white/80 mb-8">Thank you for completing the EQ Navigator assessment. You're ready to view your personalized emotional intelligence insights!</p>
                
                <Button 
                  onClick={handleViewResults}
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-white/90"
                >
                  View Your Results
                </Button>
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
