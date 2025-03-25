import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BrainCircuit, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const riasecQuestions = [
  {
    id: 1,
    text: "I like to work on cars or machines.",
    type: "R"
  },
  {
    id: 2,
    text: "I enjoy scientific experiments.",
    type: "I"
  },
  {
    id: 3,
    text: "I am good at drawing or painting.",
    type: "A"
  },
  {
    id: 4,
    text: "I like helping people with their problems.",
    type: "S"
  },
  {
    id: 5,
    text: "I am good at selling things.",
    type: "E"
  },
  {
    id: 6,
    text: "I like to keep things organized.",
    type: "C"
  },
  {
    id: 7,
    text: "I prefer working outdoors.",
    type: "R"
  },
  {
    id: 8,
    text: "I enjoy analyzing data.",
    type: "I"
  },
  {
    id: 9,
    text: "I like to write stories or poems.",
    type: "A"
  },
  {
    id: 10,
    text: "I am interested in teaching.",
    type: "S"
  },
  {
    id: 11,
    text: "I like to lead a group.",
    type: "E"
  },
  {
    id: 12,
    text: "I am good at following instructions.",
    type: "C"
  },
  {
    id: 13,
    text: "I enjoy building things with my hands.",
    type: "R"
  },
  {
    id: 14,
    text: "I like to solve complex problems.",
    type: "I"
  },
  {
    id: 15,
    text: "I am creative and imaginative.",
    type: "A"
  },
  {
    id: 16,
    text: "I am a good listener.",
    type: "S"
  },
  {
    id: 17,
    text: "I am persuasive.",
    type: "E"
  },
  {
    id: 18,
    text: "I pay attention to details.",
    type: "C"
  },
  {
    id: 19,
    text: "I like working with tools.",
    type: "R"
  },
  {
    id: 20,
    text: "I am curious about how things work.",
    type: "I"
  },
  {
    id: 21,
    text: "I enjoy expressing myself through art.",
    type: "A"
  },
  {
    id: 22,
    text: "I am a caring person.",
    type: "S"
  },
  {
    id: 23,
    text: "I am ambitious.",
    type: "E"
  },
  {
    id: 24,
    text: "I am organized and efficient.",
    type: "C"
  },
  {
    id: 25,
    text: "I like to repair mechanical things.",
    type: "R"
  },
  {
    id: 26,
    text: "I enjoy doing research.",
    type: "I"
  },
  {
    id: 27,
    text: "I like to design things.",
    type: "A"
  },
  {
    id: 28,
    text: "I am good at helping people.",
    type: "S"
  },
  {
    id: 29,
    text: "I am good at negotiating.",
    type: "E"
  },
  {
    id: 30,
    text: "I like to follow rules and procedures.",
    type: "C"
  }
];

const answerOptions = [
  { value: 1, label: "Not at all like me" },
  { value: 2, label: "Not much like me" },
  { value: 3, label: "Somewhat like me" },
  { value: 4, label: "Mostly like me" },
  { value: 5, label: "Very much like me" }
];

const RIASECAssessment = () => {
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(riasecQuestions.length).fill(0));
  const [showResults, setShowResults] = useState(false);
  const [scores, setScores] = useState({
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswerSelect = (questionIndex: number, value: string) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = parseInt(value);
    setSelectedAnswers(newSelectedAnswers);
  };

  const calculateScores = () => {
    const newScores = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0
    };

    selectedAnswers.forEach((answer, index) => {
      const questionType = riasecQuestions[index].type;
      newScores[questionType] += answer;
    });

    return newScores;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < riasecQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      const calculatedScores = calculateScores();
      setScores(calculatedScores);
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleViewResults = () => {
    // Navigate to student details form instead of directly to results
    navigate('/assessment/riasec/student-details', { 
      state: { 
        assessmentType: 'riasec',
        scores,
        answers: selectedAnswers
      } 
    });
  };

  const isAnswered = selectedAnswers[currentQuestionIndex] !== 0;
  const progressPercentage = ((currentQuestionIndex + 1) / riasecQuestions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {!showResults ? (
              <motion.div 
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-card p-6 md:p-8"
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-medium text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {riasecQuestions.length}
                    </h2>
                    <span className="text-sm text-muted-foreground font-medium">
                      {currentQuestionIndex + 1} of {riasecQuestions.length} questions
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-brand-purple/20" />
                </div>
                
                <div className="bg-brand-purple/5 rounded-lg p-5 border border-brand-purple/20">
                  <h3 className="text-lg md:text-xl font-semibold mb-4 flex">
                    <span className="bg-brand-purple text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      {currentQuestionIndex + 1}
                    </span>
                    {riasecQuestions[currentQuestionIndex].text}
                  </h3>
                  
                  <RadioGroup 
                    value={selectedAnswers[currentQuestionIndex].toString()} 
                    onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, value)}
                    className="space-y-3"
                  >
                    {answerOptions.map((option) => (
                      <div 
                        key={option.value} 
                        className={`flex items-start space-x-2 border rounded-md p-3 transition-colors ${
                          selectedAnswers[currentQuestionIndex] === option.value 
                            ? 'border-brand-purple bg-brand-purple/10' 
                            : 'border-border/50 hover:border-brand-purple/50 hover:bg-brand-purple/5'
                        }`}
                      >
                        <RadioGroupItem 
                          value={option.value.toString()} 
                          id={`question-${currentQuestionIndex + 1}-answer-${option.value}`} 
                          className="mt-1" 
                        />
                        <Label 
                          htmlFor={`question-${currentQuestionIndex + 1}-answer-${option.value}`} 
                          className="flex-1 cursor-pointer font-normal text-base"
                        >
                          {option.label}
                        </Label>
                        {selectedAnswers[currentQuestionIndex] === option.value && (
                          <div className="bg-brand-purple/20 rounded-full p-1">
                            <Check className="h-4 w-4 text-brand-purple" />
                          </div>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={!isAnswered}
                    className="bg-brand-purple hover:bg-brand-purple/90 flex items-center gap-1"
                  >
                    {currentQuestionIndex === riasecQuestions.length - 1 ? "Finish" : "Next"}
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
                <div className="w-20 h-20 mx-auto bg-brand-purple/10 rounded-full flex items-center justify-center mb-6">
                  <BrainCircuit className="h-10 w-10 text-brand-purple" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">Assessment Complete!</h2>
                <p className="text-muted-foreground mb-8">Thank you for completing the RIASEC assessment. You're ready to discover your personality type and potential career paths!</p>
                
                <Button 
                  onClick={handleViewResults}
                  size="lg"
                  className="bg-brand-purple hover:bg-brand-purple/90"
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

export default RIASECAssessment;
