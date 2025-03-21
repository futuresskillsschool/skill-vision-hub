
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define RIASEC question type
type RIASECQuestion = {
  id: number;
  question: string;
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
};

// Define all questions for the assessment
const riasecQuestions: RIASECQuestion[] = [
  // Realistic (R)
  {
    id: 1,
    question: "I enjoy spending my free time building things with LEGOs, model kits, or other materials.",
    type: 'R'
  },
  {
    id: 2,
    question: "If something at home breaks, I usually try to fix it myself before asking for help.",
    type: 'R'
  },
  {
    id: 3,
    question: "I find subjects like Woodworking, Metal Shop, or Auto Mechanics interesting (if available).",
    type: 'R'
  },
  {
    id: 4,
    question: "I like being physically active through sports, dance, or outdoor activities like hiking or cycling.",
    type: 'R'
  },
  {
    id: 5,
    question: "I'm the kind of person who prefers to learn by doing rather than just reading or listening.",
    type: 'R'
  },
  {
    id: 6,
    question: "I would enjoy a hobby or future job that involves working with tools, machines, or technology in a hands-on way.",
    type: 'R'
  },
  // Investigative (I)
  {
    id: 7,
    question: "I get really interested in understanding how things work, like how a computer or an engine functions.",
    type: 'I'
  },
  {
    id: 8,
    question: "I enjoy solving logic puzzles, riddles, or playing strategy games.",
    type: 'I'
  },
  {
    id: 9,
    question: "I find science classes like Biology, Chemistry, or Physics fascinating and like to ask \"why?\"",
    type: 'I'
  },
  {
    id: 10,
    question: "I enjoy doing research online or in books to learn more about topics that interest me.",
    type: 'I'
  },
  {
    id: 11,
    question: "When faced with a problem, I usually try to analyze it from different angles before trying a solution.",
    type: 'I'
  },
  {
    id: 12,
    question: "I would enjoy a future job that involves investigating problems, conducting experiments, or analyzing data.",
    type: 'I'
  },
  // Artistic (A)
  {
    id: 13,
    question: "I enjoy expressing myself through creative activities like drawing, painting, photography, or making videos.",
    type: 'A'
  },
  {
    id: 14,
    question: "I like listening to music, going to concerts, or even trying to write my own songs or musical pieces.",
    type: 'A'
  },
  {
    id: 15,
    question: "I enjoy reading fiction, writing stories or poems, or participating in drama or theater.",
    type: 'A'
  },
  {
    id: 16,
    question: "I have a good sense of style and enjoy putting together outfits or decorating my space.",
    type: 'A'
  },
  {
    id: 17,
    question: "I appreciate art in different forms, whether it's visual art, music, dance, or film.",
    type: 'A'
  },
  {
    id: 18,
    question: "I would enjoy a future job where I can use my imagination and creativity, like in graphic design, fashion, or music.",
    type: 'A'
  },
  // Social (S)
  {
    id: 19,
    question: "My friends often come to me when they have problems because I'm a good listener.",
    type: 'S'
  },
  {
    id: 20,
    question: "I enjoy working on projects with others and feel like I contribute well to a team.",
    type: 'S'
  },
  {
    id: 21,
    question: "I often find myself helping classmates who are struggling with their schoolwork.",
    type: 'S'
  },
  {
    id: 22,
    question: "I care about making a positive impact on my community or the world.",
    type: 'S'
  },
  {
    id: 23,
    question: "I enjoy explaining things to others and helping them understand new concepts.",
    type: 'S'
  },
  {
    id: 24,
    question: "I would enjoy a future job where I can work closely with people, help them, or teach them.",
    type: 'S'
  },
  // Enterprising (E)
  {
    id: 25,
    question: "I often come up with ideas for new projects or ways to improve things.",
    type: 'E'
  },
  {
    id: 26,
    question: "I enjoy trying to convince my friends or family to try something new or do things my way.",
    type: 'E'
  },
  {
    id: 27,
    question: "I've thought about starting my own club, event, or even a small business.",
    type: 'E'
  },
  {
    id: 28,
    question: "I like to take the lead in group projects and make sure things get done.",
    type: 'E'
  },
  {
    id: 29,
    question: "I'm usually motivated to achieve goals and like to see results.",
    type: 'E'
  },
  {
    id: 30,
    question: "I would enjoy a future job where I can lead a team, manage projects, or sell ideas or products.",
    type: 'E'
  },
  // Conventional (C)
  {
    id: 31,
    question: "I prefer having a clear plan and knowing what to expect.",
    type: 'C'
  },
  {
    id: 32,
    question: "I pay close attention to details and like to make sure things are done correctly.",
    type: 'C'
  },
  {
    id: 33,
    question: "I find it satisfying to organize my belongings, notes, or digital files.",
    type: 'C'
  },
  {
    id: 34,
    question: "I'm good at following instructions and sticking to rules.",
    type: 'C'
  },
  {
    id: 35,
    question: "I like working with numbers, charts, or spreadsheets.",
    type: 'C'
  },
  {
    id: 36,
    question: "I would enjoy a future job that involves organizing information, managing data, or following established procedures.",
    type: 'C'
  }
];

type Answer = {
  questionId: number;
  answer: 'agree' | 'neutral' | 'disagree';
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
};

const RIASECAssessment = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswerSelect = (questionId: number, answer: 'agree' | 'neutral' | 'disagree', type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C') => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionId, answer, type };
    } else {
      newAnswers.push({ questionId, answer, type });
    }
    
    setAnswers(newAnswers);
    
    // Update progress
    const answeredCount = new Set(newAnswers.map(a => a.questionId)).size;
    setCurrentProgress((answeredCount / riasecQuestions.length) * 100);
  };

  const calculateScore = (type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'): number => {
    return answers
      .filter(a => a.type === type)
      .reduce((score, answer) => {
        if (answer.answer === 'agree') return score + 2;
        if (answer.answer === 'neutral') return score + 1;
        return score;
      }, 0);
  };

  const handleSubmit = async () => {
    // Calculate RIASEC scores
    const scores = {
      R: calculateScore('R'),
      I: calculateScore('I'),
      A: calculateScore('A'),
      S: calculateScore('S'),
      E: calculateScore('E'),
      C: calculateScore('C'),
    };
    
    // Get top types
    const sortedTypes = Object.entries(scores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([type]) => type as keyof typeof scores);
    
    const primaryType = sortedTypes[0];
    const secondaryType = sortedTypes[1];
    const tertiaryType = sortedTypes[2];
    
    const primaryResult = `${primaryType}${secondaryType}${tertiaryType}`;
    
    // If user is logged in, save results to database
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      try {
        await supabase.from('assessment_results').insert({
          user_id: user.id,
          assessment_type: 'RIASEC',
          result_data: {
            scores,
            primary_result: primaryResult,
            answers: answers.map(a => ({ 
              questionId: a.questionId, 
              answer: a.answer, 
              type: a.type 
            }))
          }
        });
        
        toast({
          title: "Assessment completed!",
          description: "Your results have been saved.",
        });
      } catch (error) {
        console.error('Error saving results:', error);
        toast({
          title: "Error saving results",
          description: "There was a problem saving your results. Please try again.",
          variant: "destructive"
        });
      }
    }
    
    // Navigate to results page with scores
    navigate('/riasec-results', { 
      state: { 
        scores, 
        primaryResult,
        detailedAnswers: answers
      } 
    });
  };

  const isQuestionAnswered = (questionId: number) => {
    return answers.some(a => a.questionId === questionId);
  };

  const allQuestionsAnswered = answers.length === riasecQuestions.length;
  const answerLabels = {
    'agree': 'Agree',
    'neutral': 'Neutral',
    'disagree': 'Disagree'
  };

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
              This assessment contains {riasecQuestions.length} questions and will help you understand your personality type according to the RIASEC model.
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
              <p>For each statement, indicate whether you agree, are neutral, or disagree with how well it describes you.</p>
            </div>
            
            {/* Questions */}
            <div className="space-y-12 mb-10">
              {riasecQuestions.map((question) => (
                <div key={question.id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4 flex items-start">
                    <span className="bg-brand-purple text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 flex-shrink-0">
                      {question.id}
                    </span>
                    {question.question}
                  </h3>
                  
                  <RadioGroup 
                    className="space-y-4"
                    value={answers.find(a => a.questionId === question.id)?.answer || ""}
                    onValueChange={(value) => {
                      if (value === 'agree' || value === 'neutral' || value === 'disagree') {
                        handleAnswerSelect(question.id, value, question.type);
                      }
                    }}
                  >
                    {['agree', 'neutral', 'disagree'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-start p-4 rounded-lg cursor-pointer transition-all ${
                          answers.find(a => a.questionId === question.id)?.answer === option
                            ? 'bg-brand-purple/10 border border-brand-purple/30'
                            : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        <RadioGroupItem 
                          value={option} 
                          id={`q${question.id}-${option}`} 
                          className="mt-1 mr-3"
                        />
                        <div>
                          <span className="font-medium">{answerLabels[option as keyof typeof answerLabels]}</span>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                  
                  {isQuestionAnswered(question.id) && (
                    <div className="mt-4 text-sm text-green-600 flex items-center">
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
