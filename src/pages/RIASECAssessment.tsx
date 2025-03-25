
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define RIASEC question type
type RIASECQuestion = {
  id: number;
  question: string;
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  options: string[];
};

// Define the set of 12 questions (2 per category)
const riasecQuestions: RIASECQuestion[] = [
  // Realistic (R) questions
  {
    id: 1,
    question: "I enjoy building things with my hands.",
    type: 'R',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 2,
    question: "I like working with tools, machines, or technology.",
    type: 'R',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Investigative (I) questions
  {
    id: 3,
    question: "I enjoy solving complex problems and puzzles.",
    type: 'I',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 4,
    question: "I'm curious about how things work and why things happen.",
    type: 'I',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Artistic (A) questions
  {
    id: 5,
    question: "I enjoy creative activities like art, music, or writing.",
    type: 'A',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 6,
    question: "I prefer tasks that allow me to express myself.",
    type: 'A',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Social (S) questions
  {
    id: 7,
    question: "I enjoy helping others and working with people.",
    type: 'S',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 8,
    question: "I'm good at explaining things to others.",
    type: 'S',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Enterprising (E) questions
  {
    id: 9,
    question: "I like to take charge and lead others.",
    type: 'E',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 10,
    question: "I enjoy persuading others and selling ideas or products.",
    type: 'E',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Conventional (C) questions
  {
    id: 11,
    question: "I like following clear procedures and rules.",
    type: 'C',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 12,
    question: "I enjoy organizing information and working with data.",
    type: 'C',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  }
];

type Answer = {
  questionId: number;
  answer: number; // Index of the selected option (0-4 for 5-point scale)
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
};

const RIASECAssessment = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswerSelect = (questionId: number, answerIndex: number, type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C') => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionId, answer: answerIndex, type };
    } else {
      newAnswers.push({ questionId, answer: answerIndex, type });
    }
    
    setAnswers(newAnswers);
    
    // Update progress
    const answeredCount = new Set(newAnswers.map(a => a.questionId)).size;
    setCurrentProgress((answeredCount / riasecQuestions.length) * 100);
  };

  const handleSubmit = () => {
    // Calculate RIASEC scores
    // For 5-point scale: Strongly Disagree (0) to Strongly Agree (4)
    const scores = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0,
    };
    
    answers.forEach(answer => {
      // Convert 0-4 scale to actual values for more meaningful scores
      const value = answer.answer + 1; // Convert 0-4 to 1-5
      scores[answer.type] += value;
    });
    
    // Navigate to results page with scores
    navigate('/riasec-results', { state: { scores } });
  };

  const isQuestionAnswered = (questionId: number) => {
    return answers.some(a => a.questionId === questionId);
  };

  const allQuestionsAnswered = answers.length === riasecQuestions.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-brand-purple hover:text-brand-purple/80 -ml-3"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">RIASEC Model Assessment</h1>
            <p className="text-foreground/70 max-w-3xl">
              Discover your Holland Code and find career matches based on your interests, abilities, and preferences.
              This assessment contains 12 questions and will help you understand your personality type according to the RIASEC model.
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8">
            <div 
              className="bg-brand-purple h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 p-4 bg-brand-purple/5 border border-brand-purple/10 rounded-lg">
              <h2 className="font-semibold text-brand-purple mb-2">Instructions:</h2>
              <p>Read each statement carefully and select the response that best describes you. Be honest in your responses for the most accurate results.</p>
            </div>
            
            {/* Questions */}
            <div className="space-y-8 mb-10">
              {riasecQuestions.map((question) => (
                <div key={question.id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 flex items-start">
                    <span className="bg-brand-purple text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 flex-shrink-0">
                      {question.id}
                    </span>
                    {question.question}
                  </h3>
                  
                  <RadioGroup 
                    className="space-y-2"
                    value={answers.find(a => a.questionId === question.id)?.answer.toString() || ""}
                    onValueChange={(value) => {
                      handleAnswerSelect(question.id, parseInt(value), question.type);
                    }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {question.options.map((option, index) => (
                        <label
                          key={index}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all flex-1 min-w-[150px] ${
                            answers.find(a => a.questionId === question.id)?.answer === index
                              ? 'bg-brand-purple/10 border border-brand-purple/30'
                              : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                          }`}
                        >
                          <RadioGroupItem 
                            value={index.toString()} 
                            id={`q${question.id}-${index}`} 
                            className="mr-2"
                          />
                          <span className="text-sm font-medium">{option}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                  
                  {isQuestionAnswered(question.id) && (
                    <div className="mt-2 text-sm text-green-600 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" /> Answer recorded
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-sm text-foreground/70">
                  {answers.length} of {riasecQuestions.length} questions answered
                </p>
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="button-primary"
              >
                Submit Answers <ArrowRight className="ml-2 h-4 w-4" />
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
