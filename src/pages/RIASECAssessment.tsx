
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

// Define RIASEC question type
type RIASECQuestion = {
  id: number;
  question: string;
  category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  options: {
    value: string;
    label: string;
  }[];
};

// Define all questions for the assessment
const riasecQuestions: RIASECQuestion[] = [
  // Realistic (R) questions
  {
    id: 1,
    question: "I enjoy spending my free time building things with LEGOs, model kits, or other materials.",
    category: 'R',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 2,
    question: "If something at home breaks, I usually try to fix it myself before asking for help.",
    category: 'R',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 3,
    question: "I find subjects like Woodworking, Metal Shop, or Auto Mechanics interesting (if available).",
    category: 'R',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 4,
    question: "I like being physically active through sports, dance, or outdoor activities like hiking or cycling.",
    category: 'R',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 5,
    question: "I'm the kind of person who prefers to learn by doing rather than just reading or listening.",
    category: 'R',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 6,
    question: "I would enjoy a hobby or future job that involves working with tools, machines, or technology in a hands-on way.",
    category: 'R',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  
  // Investigative (I) questions
  {
    id: 7,
    question: "I get really interested in understanding how things work, like how a computer or an engine functions.",
    category: 'I',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 8,
    question: "I enjoy solving logic puzzles, riddles, or playing strategy games.",
    category: 'I',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 9,
    question: "I find science classes like Biology, Chemistry, or Physics fascinating and like to ask \"why?\"",
    category: 'I',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 10,
    question: "I enjoy doing research online or in books to learn more about topics that interest me.",
    category: 'I',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 11,
    question: "When faced with a problem, I usually try to analyze it from different angles before trying a solution.",
    category: 'I',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 12,
    question: "I would enjoy a future job that involves investigating problems, conducting experiments, or analyzing data.",
    category: 'I',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  
  // Artistic (A) questions
  {
    id: 13,
    question: "I enjoy expressing myself through creative activities like drawing, painting, photography, or making videos.",
    category: 'A',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 14,
    question: "I like listening to music, going to concerts, or even trying to write my own songs or musical pieces.",
    category: 'A',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 15,
    question: "I enjoy reading fiction, writing stories or poems, or participating in drama or theater.",
    category: 'A',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 16,
    question: "I have a good sense of style and enjoy putting together outfits or decorating my space.",
    category: 'A',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 17,
    question: "I appreciate art in different forms, whether it's visual art, music, dance, or film.",
    category: 'A',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 18,
    question: "I would enjoy a future job where I can use my imagination and creativity, like in graphic design, fashion, or music.",
    category: 'A',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  
  // Social (S) questions
  {
    id: 19,
    question: "My friends often come to me when they have problems because I'm a good listener.",
    category: 'S',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 20,
    question: "I enjoy working on projects with others and feel like I contribute well to a team.",
    category: 'S',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 21,
    question: "I often find myself helping classmates who are struggling with their schoolwork.",
    category: 'S',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 22,
    question: "I care about making a positive impact on my community or the world.",
    category: 'S',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 23,
    question: "I enjoy explaining things to others and helping them understand new concepts.",
    category: 'S',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 24,
    question: "I would enjoy a future job where I can work closely with people, help them, or teach them.",
    category: 'S',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  
  // Enterprising (E) questions
  {
    id: 25,
    question: "I often come up with ideas for new projects or ways to improve things.",
    category: 'E',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 26,
    question: "I enjoy trying to convince my friends or family to try something new or do things my way.",
    category: 'E',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 27,
    question: "I've thought about starting my own club, event, or even a small business.",
    category: 'E',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 28,
    question: "I like to take the lead in group projects and make sure things get done.",
    category: 'E',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 29,
    question: "I'm usually motivated to achieve goals and like to see results.",
    category: 'E',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 30,
    question: "I would enjoy a future job where I can lead a team, manage projects, or sell ideas or products.",
    category: 'E',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  
  // Conventional (C) questions
  {
    id: 31,
    question: "I prefer having a clear plan and knowing what to expect.",
    category: 'C',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 32,
    question: "I pay close attention to details and like to make sure things are done correctly.",
    category: 'C',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 33,
    question: "I find it satisfying to organize my belongings, notes, or digital files.",
    category: 'C',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 34,
    question: "I'm good at following instructions and sticking to rules.",
    category: 'C',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 35,
    question: "I like working with numbers, charts, or spreadsheets.",
    category: 'C',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
  {
    id: 36,
    question: "I would enjoy a future job that involves organizing information, managing data, or following established procedures.",
    category: 'C',
    options: [
      { value: 'strongly_disagree', label: 'Strongly Disagree' },
      { value: 'disagree', label: 'Disagree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'agree', label: 'Agree' },
      { value: 'strongly_agree', label: 'Strongly Agree' },
    ],
  },
];

type Answer = {
  questionId: number;
  answer: string;
  category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
};

const getRIASECScoreValue = (answerValue: string): number => {
  switch (answerValue) {
    case 'strongly_agree': return 5;
    case 'agree': return 4;
    case 'neutral': return 3;
    case 'disagree': return 2;
    case 'strongly_disagree': return 1;
    default: return 0;
  }
};

const RIASECAssessment = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswerSelect = (questionId: number, answer: string, category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C') => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionId, answer, category };
    } else {
      newAnswers.push({ questionId, answer, category });
    }
    
    setAnswers(newAnswers);
    
    // Update progress
    const answeredCount = new Set(newAnswers.map(a => a.questionId)).size;
    setCurrentProgress((answeredCount / riasecQuestions.length) * 100);
  };

  const handleSubmit = async () => {
    // Calculate RIASEC scores
    const scores = {
      R: 0,
      I: 0,
      A: 0,
      S: 0,
      E: 0,
      C: 0
    };
    
    // Calculate scores based on Likert scale values
    answers.forEach(answer => {
      const scoreValue = getRIASECScoreValue(answer.answer);
      scores[answer.category] += scoreValue;
    });
    
    // Save assessment result to database if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      try {
        // Get top 3 types for primary result
        const primaryResult = Object.entries(scores)
          .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
          .map(([type]) => type)
          .slice(0, 3)
          .join('');
        
        await supabase
          .from('assessment_results')
          .upsert({
            user_id: user.id,
            assessment_type: 'riasec',
            result_data: scores,
            primary_result: primaryResult,
            completed_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,assessment_type'
          });
      } catch (error) {
        console.error('Error saving assessment results:', error);
      }
    }
    
    // Navigate to results page with scores
    navigate('/riasec-results', { state: { scores } });
  };

  const isQuestionAnswered = (questionId: number) => {
    return answers.some(a => a.questionId === questionId);
  };

  const allQuestionsAnswered = answers.length === riasecQuestions.length;
  
  // Group questions by category for better organization
  const questionsByCategory = {
    R: riasecQuestions.filter(q => q.category === 'R'),
    I: riasecQuestions.filter(q => q.category === 'I'),
    A: riasecQuestions.filter(q => q.category === 'A'),
    S: riasecQuestions.filter(q => q.category === 'S'),
    E: riasecQuestions.filter(q => q.category === 'E'),
    C: riasecQuestions.filter(q => q.category === 'C')
  };

  const categoryTitles = {
    R: "Realistic - Working with Things",
    I: "Investigative - Working with Ideas",
    A: "Artistic - Working with Creativity",
    S: "Social - Working with People",
    E: "Enterprising - Working with Leadership",
    C: "Conventional - Working with Organization"
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
              <p>For each statement, choose the response that best describes you. Be honest - there are no right or wrong answers!</p>
            </div>
            
            {/* Questions organized by category */}
            <div className="space-y-12 mb-10">
              {(Object.entries(questionsByCategory) as [keyof typeof questionsByCategory, RIASECQuestion[]][]).map(([category, questions]) => (
                <div key={category} className="mb-10">
                  <h2 className="text-xl font-semibold text-brand-purple mb-4 pb-2 border-b border-brand-purple/20">
                    {categoryTitles[category]}
                  </h2>
                  
                  <div className="space-y-6">
                    {questions.map((question) => (
                      <div key={question.id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium mb-4">
                          {question.question}
                        </h3>
                        
                        <RadioGroup 
                          className="space-y-3"
                          value={answers.find(a => a.questionId === question.id)?.answer || ""}
                          onValueChange={(value) => {
                            handleAnswerSelect(question.id, value, question.category);
                          }}
                        >
                          <div className="flex flex-col md:flex-row md:space-x-4 w-full">
                            {question.options.map((option) => (
                              <label
                                key={option.value}
                                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all mb-2 md:mb-0 flex-1 ${
                                  answers.find(a => a.questionId === question.id)?.answer === option.value
                                    ? 'bg-brand-purple/10 border border-brand-purple/30'
                                    : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                                }`}
                              >
                                <RadioGroupItem 
                                  value={option.value} 
                                  id={`q${question.id}-${option.value}`} 
                                  className="mr-3"
                                />
                                <span className="text-sm font-medium">{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </RadioGroup>
                        
                        {isQuestionAnswered(question.id) && (
                          <div className="mt-3 text-sm text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" /> Answer recorded
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
