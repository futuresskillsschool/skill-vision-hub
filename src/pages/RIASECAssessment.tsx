
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

// Define the new set of 36 questions for students aged 13-17
const riasecQuestions: RIASECQuestion[] = [
  // Realistic (R) questions
  {
    id: 1,
    question: "I enjoy spending my free time building things with LEGOs, model kits, or other materials.",
    type: 'R',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 2,
    question: "If something at home breaks, I usually try to fix it myself before asking for help.",
    type: 'R',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 3,
    question: "I find subjects like Woodworking, Metal Shop, or Auto Mechanics interesting (if available).",
    type: 'R',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 4,
    question: "I like being physically active through sports, dance, or outdoor activities like hiking or cycling.",
    type: 'R',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 5,
    question: "I'm the kind of person who prefers to learn by doing rather than just reading or listening.",
    type: 'R',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 6,
    question: "I would enjoy a hobby or future job that involves working with tools, machines, or technology in a hands-on way.",
    type: 'R',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Investigative (I) questions
  {
    id: 7,
    question: "I get really interested in understanding how things work, like how a computer or an engine functions.",
    type: 'I',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 8,
    question: "I enjoy solving logic puzzles, riddles, or playing strategy games.",
    type: 'I',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 9,
    question: "I find science classes like Biology, Chemistry, or Physics fascinating and like to ask \"why?\"",
    type: 'I',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 10,
    question: "I enjoy doing research online or in books to learn more about topics that interest me.",
    type: 'I',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 11,
    question: "When faced with a problem, I usually try to analyze it from different angles before trying a solution.",
    type: 'I',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 12,
    question: "I would enjoy a future job that involves investigating problems, conducting experiments, or analyzing data.",
    type: 'I',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Artistic (A) questions
  {
    id: 13,
    question: "I enjoy expressing myself through creative activities like drawing, painting, photography, or making videos.",
    type: 'A',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 14,
    question: "I like listening to music, going to concerts, or even trying to write my own songs or musical pieces.",
    type: 'A',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 15,
    question: "I enjoy reading fiction, writing stories or poems, or participating in drama or theater.",
    type: 'A',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 16,
    question: "I have a good sense of style and enjoy putting together outfits or decorating my space.",
    type: 'A',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 17,
    question: "I appreciate art in different forms, whether it's visual art, music, dance, or film.",
    type: 'A',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 18,
    question: "I would enjoy a future job where I can use my imagination and creativity, like in graphic design, fashion, or music.",
    type: 'A',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Social (S) questions
  {
    id: 19,
    question: "My friends often come to me when they have problems because I'm a good listener.",
    type: 'S',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 20,
    question: "I enjoy working on projects with others and feel like I contribute well to a team.",
    type: 'S',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 21,
    question: "I often find myself helping classmates who are struggling with their schoolwork.",
    type: 'S',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 22,
    question: "I care about making a positive impact on my community or the world.",
    type: 'S',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 23,
    question: "I enjoy explaining things to others and helping them understand new concepts.",
    type: 'S',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 24,
    question: "I would enjoy a future job where I can work closely with people, help them, or teach them.",
    type: 'S',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Enterprising (E) questions
  {
    id: 25,
    question: "I often come up with ideas for new projects or ways to improve things.",
    type: 'E',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 26,
    question: "I enjoy trying to convince my friends or family to try something new or do things my way.",
    type: 'E',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 27,
    question: "I've thought about starting my own club, event, or even a small business.",
    type: 'E',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 28,
    question: "I like to take the lead in group projects and make sure things get done.",
    type: 'E',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 29,
    question: "I'm usually motivated to achieve goals and like to see results.",
    type: 'E',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 30,
    question: "I would enjoy a future job where I can lead a team, manage projects, or sell ideas or products.",
    type: 'E',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Conventional (C) questions
  {
    id: 31,
    question: "I prefer having a clear plan and knowing what to expect.",
    type: 'C',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 32,
    question: "I pay close attention to details and like to make sure things are done correctly.",
    type: 'C',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 33,
    question: "I find it satisfying to organize my belongings, notes, or digital files.",
    type: 'C',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 34,
    question: "I'm good at following instructions and sticking to rules.",
    type: 'C',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 35,
    question: "I like working with numbers, charts, or spreadsheets.",
    type: 'C',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 36,
    question: "I would enjoy a future job that involves organizing information, managing data, or following established procedures.",
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
              This assessment contains 36 questions and will help you understand your personality type according to the RIASEC model.
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
