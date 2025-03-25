
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, ArrowLeft, ArrowRight, Check } from 'lucide-react';
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
    scenario: "Your friend seems upset about something but hasn't mentioned anything. What would you do?",
    options: [
      { id: "1a", text: "Wait for them to bring it up when they're ready", score: 3 },
      { id: "1b", text: "Ask them directly if something is bothering them", score: 4 },
      { id: "1c", text: "Try to cheer them up without mentioning their mood", score: 2 },
      { id: "1d", text: "Assume it's not your business and ignore it", score: 1 }
    ]
  },
  {
    id: 2,
    scenario: "You receive criticism on a project you worked hard on. How do you respond?",
    options: [
      { id: "2a", text: "Get defensive and explain why the criticism is wrong", score: 1 },
      { id: "2b", text: "Thank them for the feedback and consider how to improve", score: 4 },
      { id: "2c", text: "Feel hurt but don't say anything", score: 2 },
      { id: "2d", text: "Ask for specific suggestions on how to improve", score: 3 }
    ]
  },
  {
    id: 3,
    scenario: "You're feeling overwhelmed with school work. What's your approach?",
    options: [
      { id: "3a", text: "Push through and work harder, ignoring how you feel", score: 2 },
      { id: "3b", text: "Take a break to recharge and then make a plan", score: 4 },
      { id: "3c", text: "Procrastinate and avoid the work because it's too stressful", score: 1 },
      { id: "3d", text: "Talk to someone about feeling overwhelmed", score: 3 }
    ]
  },
  {
    id: 4,
    scenario: "During a group project, one member isn't contributing. What do you do?",
    options: [
      { id: "4a", text: "Complain about them to other group members", score: 1 },
      { id: "4b", text: "Privately ask if everything is okay and if they need help", score: 4 },
      { id: "4c", text: "Take on their work yourself without saying anything", score: 2 },
      { id: "4d", text: "Tell the teacher they're not doing their fair share", score: 3 }
    ]
  },
  {
    id: 5,
    scenario: "You're having a bad day and a friend makes a joke that annoys you. How do you react?",
    options: [
      { id: "5a", text: "Snap at them angrily", score: 1 },
      { id: "5b", text: "Fake a laugh but feel annoyed inside", score: 2 },
      { id: "5c", text: "Calmly let them know you're having a tough day and not in a joking mood", score: 4 },
      { id: "5d", text: "Ignore the joke and change the subject", score: 3 }
    ]
  },
  {
    id: 6,
    scenario: "You notice a classmate sitting alone and looking sad. What would you do?",
    options: [
      { id: "6a", text: "Mind your own business - they probably want to be alone", score: 1 },
      { id: "6b", text: "Invite them to join you and your friends", score: 3 },
      { id: "6c", text: "Ask if they'd like some company and listen if they want to talk", score: 4 },
      { id: "6d", text: "Feel bad for them but do nothing", score: 2 }
    ]
  },
  {
    id: 7,
    scenario: "You've made a mistake that affected others. What's your response?",
    options: [
      { id: "7a", text: "Hope no one notices", score: 1 },
      { id: "7b", text: "Blame outside circumstances", score: 2 },
      { id: "7c", text: "Apologize but make excuses", score: 3 },
      { id: "7d", text: "Take responsibility and find ways to fix it", score: 4 }
    ]
  },
  {
    id: 8,
    scenario: "A friend shares great news with you on a day when you're feeling down. How do you respond?",
    options: [
      { id: "8a", text: "Change the subject to your problems", score: 1 },
      { id: "8b", text: "Pretend to be happy for them while feeling jealous", score: 2 },
      { id: "8c", text: "Genuinely celebrate their success despite your own feelings", score: 4 },
      { id: "8d", text: "Congratulate them briefly and then make an excuse to end the conversation", score: 3 }
    ]
  },
  {
    id: 9,
    scenario: "You're feeling anxious about an upcoming test. What do you do?",
    options: [
      { id: "9a", text: "Ignore the feeling and hope it goes away", score: 1 },
      { id: "9b", text: "Recognize your anxiety and use it as motivation to study", score: 4 },
      { id: "9c", text: "Get overwhelmed and procrastinate studying", score: 2 },
      { id: "9d", text: "Talk to someone about your anxiety", score: 3 }
    ]
  },
  {
    id: 10,
    scenario: "You strongly disagree with an opinion a friend has expressed. How do you handle it?",
    options: [
      { id: "10a", text: "Tell them they're wrong and explain why", score: 2 },
      { id: "10b", text: "Keep your opinion to yourself to avoid conflict", score: 3 },
      { id: "10c", text: "Listen to understand their perspective, then respectfully share yours", score: 4 },
      { id: "10d", text: "Argue forcefully to change their mind", score: 1 }
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

  // Group questions 2 per page
  const questionsPerPage = 2;
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {!showResults ? (
              <motion.div 
                key={currentPageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-card p-6 md:p-8"
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-medium text-muted-foreground">
                      Page {currentPageIndex + 1} of {groupedQuestions.length}
                    </h2>
                    <span className="text-sm text-muted-foreground font-medium">
                      {Math.min((currentPageIndex + 1) * questionsPerPage, questions.length)} of {questions.length} questions
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-purple-100" />
                </div>
                
                <div className="space-y-8">
                  {groupedQuestions[currentPageIndex].map((question, questionIndex) => {
                    const globalQuestionIndex = currentPageIndex * questionsPerPage + questionIndex;
                    return (
                      <div key={question.id} className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                        <h3 className="text-lg md:text-xl font-semibold mb-4 flex">
                          <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            {globalQuestionIndex + 1}
                          </span>
                          {question.scenario}
                        </h3>
                        
                        <RadioGroup 
                          value={selectedOptions[globalQuestionIndex]} 
                          onValueChange={(value) => handleOptionSelect(questionIndex, value)}
                          className="space-y-3"
                        >
                          {question.options.map((option) => (
                            <div 
                              key={option.id} 
                              className={`flex items-start space-x-2 border rounded-md p-3 transition-colors ${
                                selectedOptions[globalQuestionIndex] === option.id 
                                  ? 'border-purple-400 bg-purple-100' 
                                  : 'border-border/50 hover:border-purple-300 hover:bg-purple-50'
                              }`}
                            >
                              <RadioGroupItem 
                                value={option.id} 
                                id={`question-${question.id}-option-${option.id}`} 
                                className="mt-1" 
                              />
                              <Label 
                                htmlFor={`question-${question.id}-option-${option.id}`} 
                                className="flex-1 cursor-pointer font-normal text-base"
                              >
                                {option.text}
                              </Label>
                              {selectedOptions[globalQuestionIndex] === option.id && (
                                <div className="bg-purple-200 rounded-full p-1">
                                  <Check className="h-4 w-4 text-purple-600" />
                                </div>
                              )}
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentPageIndex === 0}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Button 
                    onClick={handleNext}
                    disabled={!isCurrentPageComplete()}
                    className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-1"
                  >
                    {currentPageIndex === groupedQuestions.length - 1 ? "Finish" : "Next"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-card p-6 md:p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-10 w-10 text-purple-500" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">Assessment Complete!</h2>
                <p className="text-muted-foreground mb-8">Thank you for completing the EQ Navigator assessment. You're ready to view your personalized emotional intelligence insights!</p>
                
                <Button 
                  onClick={handleViewResults}
                  size="lg"
                  className="bg-purple-500 hover:bg-purple-600 text-white"
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
