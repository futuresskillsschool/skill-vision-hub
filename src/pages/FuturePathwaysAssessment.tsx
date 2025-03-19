
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Rocket } from 'lucide-react';

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

// Future Pathways Explorer questions
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

const FuturePathwaysAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>(Array(questions.length).fill(0));
  const [showResults, setShowResults] = useState(false);
  const [clusterScores, setClusterScores] = useState<Record<string, number>>({
    "tech-innovator": 0,
    "digital-creator": 0,
    "data-analyst": 0,
    "entrepreneur": 0,
    "helper": 0
  });

  // Reset to top of page on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (value: string) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = parseInt(value);
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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // Calculate cluster scores
      const scores = calculateClusterScores();
      setClusterScores(scores);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleViewResults = () => {
    navigate('/future-pathways/results', { 
      state: { 
        clusterScores,
        selectedOptions
      } 
    });
  };

  const currentQuestion = questions[currentQuestionIndex];

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
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-muted-foreground mb-1">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-semibold mb-6">{currentQuestion.question}</h3>
                
                <RadioGroup 
                  value={selectedOptions[currentQuestionIndex].toString()} 
                  onValueChange={handleOptionSelect}
                  className="space-y-4"
                >
                  {answers.map((answer) => (
                    <div key={answer.value} className="flex items-start space-x-2 border border-border/50 rounded-md p-4 hover:border-brand-green/50 hover:bg-brand-green/5 transition-colors">
                      <RadioGroupItem value={answer.value.toString()} id={`option-${answer.value}`} className="mt-1" />
                      <Label 
                        htmlFor={`option-${answer.value}`} 
                        className="flex-1 cursor-pointer font-normal text-base"
                      >
                        {answer.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button 
                    onClick={handleNext}
                    disabled={selectedOptions[currentQuestionIndex] === 0}
                    className="bg-brand-green hover:bg-brand-green/90"
                  >
                    {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
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
