import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Rocket, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Define the structure of a question
interface Question {
  id: number;
  question: string;
  careerClusters: string[];
}

interface Answer {
  value: number; // 1-5 for Strongly Disagree to Strongly Agree
  label: string;
}

const answers: Answer[] = [
  { value: 5, label: "Strongly Agree" },
  { value: 4, label: "Agree" },
  { value: 3, label: "Neutral" },
  { value: 2, label: "Disagree" },
  { value: 1, label: "Strongly Disagree" }
];

// Career clusters
const careerClusters = {
  "tech-innovator": "Tech Innovator & Builder",
  "digital-creator": "Digital Creator & Storyteller",
  "data-analyst": "Data Analyst & Scientist",
  "entrepreneur": "Future-Focused Entrepreneur & Leader",
  "helper": "Tech-Enabled Helper & Problem Solver"
};

// Future Pathways Explorer questions - updated with your provided questions
const questions: Question[] = [
  {
    id: 1,
    question: "I enjoy figuring out how things work and how to fix them when they are broken.",
    careerClusters: ["tech-innovator"]
  },
  {
    id: 2,
    question: "I like to draw, paint, create videos, or express myself through creative activities.",
    careerClusters: ["digital-creator"]
  },
  {
    id: 3,
    question: "Numbers and patterns fascinate me. I like to find logic in things.",
    careerClusters: ["data-analyst"]
  },
  {
    id: 4,
    question: "I have lots of ideas and often think about starting my own projects or businesses.",
    careerClusters: ["entrepreneur"]
  },
  {
    id: 5,
    question: "I care about making the world a better place and helping people in need.",
    careerClusters: ["helper"]
  },
  {
    id: 6,
    question: "I am curious about new technologies like robots, AI, and virtual reality.",
    careerClusters: ["tech-innovator", "digital-creator"]
  },
  {
    id: 7,
    question: "I enjoy telling stories and communicating my ideas to others.",
    careerClusters: ["digital-creator", "entrepreneur"]
  },
  {
    id: 8,
    question: "I am good at analyzing information and finding solutions to complex problems.",
    careerClusters: ["data-analyst", "helper"]
  },
  {
    id: 9,
    question: "I am interested in learning how businesses and organizations work.",
    careerClusters: ["entrepreneur"]
  },
  {
    id: 10,
    question: "I believe technology can be used to solve major problems like climate change or poverty.",
    careerClusters: ["helper", "tech-innovator"]
  },
  {
    id: 11,
    question: "I like playing video games or exploring virtual worlds.",
    careerClusters: ["digital-creator"]
  },
  {
    id: 12,
    question: "I enjoy working with computers and learning about software and coding.",
    careerClusters: ["tech-innovator", "data-analyst"]
  },
  {
    id: 13,
    question: "I like to understand trends and predict what might happen in the future.",
    careerClusters: ["data-analyst", "entrepreneur"]
  },
  {
    id: 14,
    question: "I am interested in leadership roles and guiding teams to achieve goals.",
    careerClusters: ["entrepreneur"]
  },
  {
    id: 15,
    question: "I want to use my skills to help people improve their health and well-being.",
    careerClusters: ["helper"]
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

const FuturePathwaysAssessment = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState<number[]>(Array(questions.length).fill(0));
  const [showResults, setShowResults] = useState(false);
  const [clusterScores, setClusterScores] = useState<Record<string, number>>({
    "tech-innovator": 0,
    "digital-creator": 0,
    "data-analyst": 0,
    "entrepreneur": 0,
    "helper": 0
  });

  // Group questions 3 per page
  const questionsPerPage = 3;
  const groupedQuestions = groupQuestions(questions, questionsPerPage);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Reset to top of page on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate progress percentage
  const progressPercentage = ((currentPageIndex + 1) / groupedQuestions.length) * 100;

  const handleOptionSelect = (questionIndex: number, value: string) => {
    const newSelectedOptions = [...selectedOptions];
    const globalQuestionIndex = currentPageIndex * questionsPerPage + questionIndex;
    newSelectedOptions[globalQuestionIndex] = parseInt(value);
    setSelectedOptions(newSelectedOptions);
  };

  const calculateClusterScores = () => {
    const scores: Record<string, number> = {
      "tech-innovator": 0,
      "digital-creator": 0,
      "data-analyst": 0,
      "entrepreneur": 0,
      "helper": 0
    };

    selectedOptions.forEach((value, index) => {
      if (value > 0) { // Only process if an answer was selected
        const question = questions[index];
        question.careerClusters.forEach(cluster => {
          scores[cluster] += value;
        });
      }
    });

    return scores;
  };

  const handleNext = () => {
    if (currentPageIndex < groupedQuestions.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // Calculate cluster scores
      const scores = calculateClusterScores();
      setClusterScores(scores);
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
    // Calculate the total score to pass to the student details page
    const totalScore = Object.values(clusterScores).reduce((sum, score) => sum + score, 0);
    
    // Navigate to the student details page before showing results
    navigate('/assessment/future-pathways/student-details', { 
      state: { 
        totalScore: totalScore,
        selectedOptions,
        questions,
        clusterScores
      } 
    });
  };

  // Check if all questions on current page have been answered
  const isCurrentPageComplete = () => {
    const currentQuestions = groupedQuestions[currentPageIndex];
    for (let i = 0; i < currentQuestions.length; i++) {
      const globalIndex = currentPageIndex * questionsPerPage + i;
      if (selectedOptions[globalIndex] === 0) {
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
                  <Progress value={progressPercentage} className="h-2 bg-brand-green/20" />
                </div>
                
                <div className="space-y-8">
                  {groupedQuestions[currentPageIndex].map((question, questionIndex) => {
                    const globalQuestionIndex = currentPageIndex * questionsPerPage + questionIndex;
                    return (
                      <div key={question.id} className="bg-brand-green/5 rounded-lg p-5 border border-brand-green/20">
                        <h3 className="text-lg md:text-xl font-semibold mb-4 flex">
                          <span className="bg-brand-green text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            {globalQuestionIndex + 1}
                          </span>
                          {question.question}
                        </h3>
                        
                        <RadioGroup 
                          value={selectedOptions[globalQuestionIndex].toString()} 
                          onValueChange={(value) => handleOptionSelect(questionIndex, value)}
                          className="space-y-3"
                        >
                          {answers.map((answer) => (
                            <div 
                              key={answer.value} 
                              className={`flex items-start space-x-2 border rounded-md p-3 transition-colors ${
                                selectedOptions[globalQuestionIndex] === answer.value 
                                  ? 'border-brand-green bg-brand-green/10' 
                                  : 'border-border/50 hover:border-brand-green/50 hover:bg-brand-green/5'
                              }`}
                            >
                              <RadioGroupItem 
                                value={answer.value.toString()} 
                                id={`question-${question.id}-answer-${answer.value}`} 
                                className="mt-1" 
                              />
                              <Label 
                                htmlFor={`question-${question.id}-answer-${answer.value}`} 
                                className="flex-1 cursor-pointer font-normal text-base"
                              >
                                {answer.label}
                              </Label>
                              {selectedOptions[globalQuestionIndex] === answer.value && (
                                <div className="bg-brand-green/20 rounded-full p-1">
                                  <Check className="h-4 w-4 text-brand-green" />
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
                    className="bg-brand-green hover:bg-brand-green/90 flex items-center gap-1"
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
                <div className="w-20 h-20 mx-auto bg-brand-green/10 rounded-full flex items-center justify-center mb-6">
                  <Rocket className="h-10 w-10 text-brand-green" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">Assessment Complete!</h2>
                <p className="text-muted-foreground mb-8">Thank you for completing the Future Pathways Explorer assessment. You're ready to view your personalized career path recommendations!</p>
                
                <Button 
                  onClick={handleViewResults}
                  size="lg"
                  className="bg-brand-green hover:bg-brand-green/90"
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

export default FuturePathwaysAssessment;
