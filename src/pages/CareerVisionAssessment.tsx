
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, ArrowLeft, ArrowRight, Check, Star, Target, Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// RIASEC Questions
interface RIASECQuestion {
  id: number;
  question: string;
  category: string;
}

const riasecQuestions: RIASECQuestion[] = [
  {
    id: 1,
    question: "I enjoy building things with my hands.",
    category: "R" // Realistic
  },
  {
    id: 2,
    question: "I like working with tools, machines, or technology.",
    category: "R" // Realistic
  },
  {
    id: 3,
    question: "I enjoy solving complex problems and puzzles.",
    category: "I" // Investigative
  },
  {
    id: 4,
    question: "I'm curious about how things work and why things happen.",
    category: "I" // Investigative
  },
  {
    id: 5,
    question: "I enjoy creative activities like art, music, or writing.",
    category: "A" // Artistic
  },
  {
    id: 6,
    question: "I prefer tasks that allow me to express myself.",
    category: "A" // Artistic
  },
  {
    id: 7,
    question: "I enjoy helping others and working with people.",
    category: "S" // Social
  },
  {
    id: 8,
    question: "I'm good at explaining things to others.",
    category: "S" // Social
  },
  {
    id: 9,
    question: "I like to take charge and lead others.",
    category: "E" // Enterprising
  },
  {
    id: 10,
    question: "I enjoy persuading others and selling ideas or products.",
    category: "E" // Enterprising
  },
  {
    id: 11,
    question: "I like following clear procedures and rules.",
    category: "C" // Conventional
  },
  {
    id: 12,
    question: "I enjoy organizing information and working with data.",
    category: "C" // Conventional
  }
];

// Future Pathways Questions
interface PathwaysQuestion {
  id: number;
  question: string;
  careerClusters: string[];
}

const pathwaysQuestions: PathwaysQuestion[] = [
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

// EQ Navigator Questions
interface EQQuestion {
  id: number;
  scenario: string;
  options: {
    id: string;
    text: string;
    score: number;
  }[];
}

const eqQuestions: EQQuestion[] = [
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

// Answers for the Likert scale questions (RIASEC and Pathways)
interface LikertAnswer {
  value: number;
  label: string;
}

const likertAnswers: LikertAnswer[] = [
  { value: 5, label: "Strongly Agree" },
  { value: 4, label: "Agree" },
  { value: 3, label: "Neutral" },
  { value: 2, label: "Disagree" },
  { value: 1, label: "Strongly Disagree" }
];

// Career clusters mapping for Future Pathways
const careerClusters = {
  "tech-innovator": "Tech Innovator & Builder",
  "digital-creator": "Digital Creator & Storyteller",
  "data-analyst": "Data Analyst & Scientist",
  "entrepreneur": "Future-Focused Entrepreneur & Leader",
  "helper": "Tech-Enabled Helper & Problem Solver"
};

// Group questions by pages - updated to include more questions per page
const groupQuestions = <T extends { id: number }>(questions: T[], perPage: number) => {
  const groupedQuestions = [];
  for (let i = 0; i < questions.length; i += perPage) {
    groupedQuestions.push(questions.slice(i, i + perPage));
  }
  return groupedQuestions;
};

const CareerVisionAssessment = () => {
  const navigate = useNavigate();
  const { user, storeAssessmentResult } = useAuth();
  const { toast } = useToast();
  
  // Current active assessment tab
  const [activeTab, setActiveTab] = useState("riasec");
  
  // RIASEC state
  const [riasecAnswers, setRiasecAnswers] = useState<number[]>(Array(riasecQuestions.length).fill(0));
  const [riasecPage, setRiasecPage] = useState(0);
  const [riasecComplete, setRiasecComplete] = useState(false);
  const riasecQuestionsPerPage = 6; // Increased from 3 to 6
  const groupedRiasecQuestions = groupQuestions(riasecQuestions, riasecQuestionsPerPage);
  
  // Future Pathways state
  const [pathwaysAnswers, setPathwaysAnswers] = useState<number[]>(Array(pathwaysQuestions.length).fill(0));
  const [pathwaysPage, setPathwaysPage] = useState(0);
  const [pathwaysComplete, setPathwaysComplete] = useState(false);
  const pathwaysQuestionsPerPage = 5; // Increased from 3 to 5
  const groupedPathwaysQuestions = groupQuestions(pathwaysQuestions, pathwaysQuestionsPerPage);
  
  // EQ Navigator state
  const [eqAnswers, setEqAnswers] = useState<string[]>(Array(eqQuestions.length).fill(''));
  const [eqPage, setEqPage] = useState(0);
  const [eqComplete, setEqComplete] = useState(false);
  const eqQuestionsPerPage = 5; // Increased from 2 to 5
  const groupedEqQuestions = groupQuestions(eqQuestions, eqQuestionsPerPage);
  
  // Overall assessment completion
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  
  // Reset to top of page on mount and tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, riasecPage, pathwaysPage, eqPage]);
  
  // Calculate progress percentages
  const riasecProgress = riasecComplete ? 100 : ((riasecPage + 1) / groupedRiasecQuestions.length) * 100;
  const pathwaysProgress = pathwaysComplete ? 100 : ((pathwaysPage + 1) / groupedPathwaysQuestions.length) * 100;
  const eqProgress = eqComplete ? 100 : ((eqPage + 1) / groupedEqQuestions.length) * 100;
  
  // Overall progress - Fixed to show 0% initially unless there are actual answers
  const overallProgress = () => {
    // Count total answered questions
    const riasecAnswered = riasecAnswers.filter(answer => answer !== 0).length;
    const pathwaysAnswered = pathwaysAnswers.filter(answer => answer !== 0).length;
    const eqAnswered = eqAnswers.filter(answer => answer !== '').length;
    
    // Total questions
    const totalQuestions = riasecQuestions.length + pathwaysQuestions.length + eqQuestions.length;
    
    // Total answered questions
    const totalAnswered = riasecAnswered + pathwaysAnswered + eqAnswered;
    
    // If no questions answered, return 0
    if (totalAnswered === 0) return 0;
    
    // Calculate progress based on answered questions
    return (totalAnswered / totalQuestions) * 100;
  };

  // RIASEC handlers
  const handleRiasecAnswer = (questionIndex: number, value: string) => {
    const newAnswers = [...riasecAnswers];
    const globalQuestionIndex = riasecPage * riasecQuestionsPerPage + questionIndex;
    newAnswers[globalQuestionIndex] = parseInt(value);
    setRiasecAnswers(newAnswers);
  };
  
  const handleRiasecNext = () => {
    if (riasecPage < groupedRiasecQuestions.length - 1) {
      setRiasecPage(riasecPage + 1);
    } else {
      setRiasecComplete(true);
      setActiveTab("pathways");
    }
  };
  
  const handleRiasecPrevious = () => {
    if (riasecPage > 0) {
      setRiasecPage(riasecPage - 1);
    }
  };
  
  const isRiasecPageComplete = () => {
    const currentQuestions = groupedRiasecQuestions[riasecPage];
    for (let i = 0; i < currentQuestions.length; i++) {
      const globalIndex = riasecPage * riasecQuestionsPerPage + i;
      if (riasecAnswers[globalIndex] === 0) {
        return false;
      }
    }
    return true;
  };
  
  // Future Pathways handlers
  const handlePathwaysAnswer = (questionIndex: number, value: string) => {
    const newAnswers = [...pathwaysAnswers];
    const globalQuestionIndex = pathwaysPage * pathwaysQuestionsPerPage + questionIndex;
    newAnswers[globalQuestionIndex] = parseInt(value);
    setPathwaysAnswers(newAnswers);
  };
  
  const handlePathwaysNext = () => {
    if (pathwaysPage < groupedPathwaysQuestions.length - 1) {
      setPathwaysPage(pathwaysPage + 1);
    } else {
      setPathwaysComplete(true);
      setActiveTab("eq");
    }
  };
  
  const handlePathwaysPrevious = () => {
    if (pathwaysPage > 0) {
      setPathwaysPage(pathwaysPage - 1);
    } else {
      // Go back to RIASEC if at first page
      setActiveTab("riasec");
      setRiasecPage(groupedRiasecQuestions.length - 1);
    }
  };
  
  const isPathwaysPageComplete = () => {
    const currentQuestions = groupedPathwaysQuestions[pathwaysPage];
    for (let i = 0; i < currentQuestions.length; i++) {
      const globalIndex = pathwaysPage * pathwaysQuestionsPerPage + i;
      if (pathwaysAnswers[globalIndex] === 0) {
        return false;
      }
    }
    return true;
  };
  
  // EQ Navigator handlers
  const handleEqAnswer = (questionIndex: number, optionId: string) => {
    const newAnswers = [...eqAnswers];
    const globalQuestionIndex = eqPage * eqQuestionsPerPage + questionIndex;
    newAnswers[globalQuestionIndex] = optionId;
    setEqAnswers(newAnswers);
  };
  
  const handleEqNext = () => {
    if (eqPage < groupedEqQuestions.length - 1) {
      setEqPage(eqPage + 1);
    } else {
      setEqComplete(true);
      setAssessmentComplete(true);
      
      // Calculate all results
      calculateAndStoreResults();
    }
  };
  
  const handleEqPrevious = () => {
    if (eqPage > 0) {
      setEqPage(eqPage - 1);
    } else {
      // Go back to Pathways if at first page
      setActiveTab("pathways");
      setPathwaysPage(groupedPathwaysQuestions.length - 1);
    }
  };
  
  const isEqPageComplete = () => {
    const currentQuestions = groupedEqQuestions[eqPage];
    for (let i = 0; i < currentQuestions.length; i++) {
      const globalIndex = eqPage * eqQuestionsPerPage + i;
      if (eqAnswers[globalIndex] === '') {
        return false;
      }
    }
    return true;
  };
  
  // Calculate and store results
  const calculateAndStoreResults = () => {
    // Calculate RIASEC scores
    const riasecScores = {
      R: 0, // Realistic
      I: 0, // Investigative
      A: 0, // Artistic
      S: 0, // Social
      E: 0, // Enterprising
      C: 0  // Conventional
    };
    
    riasecAnswers.forEach((answer, index) => {
      const category = riasecQuestions[index].category;
      riasecScores[category as keyof typeof riasecScores] += answer;
    });
    
    // Calculate Future Pathways scores
    const pathwaysScores: Record<string, number> = {
      "tech-innovator": 0,
      "digital-creator": 0,
      "data-analyst": 0,
      "entrepreneur": 0,
      "helper": 0
    };
    
    pathwaysAnswers.forEach((answer, index) => {
      const clusters = pathwaysQuestions[index].careerClusters;
      clusters.forEach(cluster => {
        pathwaysScores[cluster] += answer;
      });
    });
    
    // Calculate EQ scores
    let eqScore = 0;
    const eqDetailedScores = eqAnswers.map((optionId, index) => {
      const question = eqQuestions[index];
      const option = question.options.find(opt => opt.id === optionId);
      if (option) {
        eqScore += option.score;
        return {
          questionId: question.id,
          scenario: question.scenario,
          answer: option.text,
          score: option.score
        };
      }
      return null;
    }).filter(Boolean);
    
    // Store results or handle locally if not logged in
    const combinedResults = {
      riasec: riasecScores,
      pathways: pathwaysScores,
      eq: {
        totalScore: eqScore,
        detailedScores: eqDetailedScores
      },
      timestamp: new Date().toISOString()
    };
    
    if (user) {
      storeAssessmentResult('career-vision', combinedResults);
    } else {
      toast({
        title: "Not logged in",
        description: "Sign in to save your results for future reference.",
      });
    }
    
    // Navigate to results page
    navigate('/assessment/career-vision/results', {
      state: combinedResults
    });
  };
  
  // Handle tab change
  const handleTabChange = (tab: string) => {
    // Only allow navigation to completed tabs or the current active one
    if (
      tab === activeTab || 
      (tab === "pathways" && riasecComplete) ||
      (tab === "eq" && pathwaysComplete)
    ) {
      setActiveTab(tab);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {!assessmentComplete ? (
              <motion.div 
                key="assessment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-card"
              >
                <div className="p-6 md:p-8">
                  <h1 className="text-2xl md:text-3xl font-bold mb-6">Career Vision Assessment</h1>
                  
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-medium text-muted-foreground">
                        Overall Progress
                      </h2>
                      <span className="text-sm text-muted-foreground font-medium">
                        {Math.round(overallProgress())}% Complete
                      </span>
                    </div>
                    <Progress value={overallProgress()} className="h-2 bg-brand-purple/20" />
                  </div>
                  
                  <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-8 w-full">
                      <TabsTrigger 
                        value="riasec" 
                        className={`data-[state=active]:bg-brand-blue/20 data-[state=active]:text-brand-blue ${riasecComplete ? 'after:content-["✓"] after:ml-1 after:text-green-500' : ''}`}
                      >
                        RIASEC Profile
                      </TabsTrigger>
                      <TabsTrigger 
                        value="pathways" 
                        className={`data-[state=active]:bg-brand-green/20 data-[state=active]:text-brand-green ${pathwaysComplete ? 'after:content-["✓"] after:ml-1 after:text-green-500' : ''}`}
                        disabled={!riasecComplete && activeTab !== "pathways"}
                      >
                        Future Pathways
                      </TabsTrigger>
                      <TabsTrigger 
                        value="eq" 
                        className={`data-[state=active]:bg-brand-red/20 data-[state=active]:text-brand-red ${eqComplete ? 'after:content-["✓"] after:ml-1 after:text-green-500' : ''}`}
                        disabled={!pathwaysComplete && activeTab !== "eq"}
                      >
                        EQ Navigator
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="riasec" className="mt-0">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-medium text-brand-blue">
                            RIASEC Profile
                          </h2>
                          <span className="text-sm text-muted-foreground font-medium">
                            Page {riasecPage + 1} of {groupedRiasecQuestions.length}
                          </span>
                        </div>
                        <Progress value={riasecProgress} className="h-2 bg-brand-blue/20" />
                      </div>
                      
                      <div className="space-y-6">
                        {groupedRiasecQuestions[riasecPage].map((question, questionIndex) => {
                          const globalQuestionIndex = riasecPage * riasecQuestionsPerPage + questionIndex;
                          return (
                            <div key={question.id} className="bg-brand-blue/5 rounded-lg p-5 border border-brand-blue/20">
                              <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-start">
                                <span className="bg-brand-blue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                                  {globalQuestionIndex + 1}
                                </span>
                                {question.question}
                              </h3>
                              
                              <RadioGroup 
                                value={riasecAnswers[globalQuestionIndex].toString()} 
                                onValueChange={(value) => handleRiasecAnswer(questionIndex, value)}
                                className="space-y-3"
                              >
                                {likertAnswers.map((answer) => (
                                  <div 
                                    key={answer.value} 
                                    className={`flex items-start space-x-2 border rounded-md p-3 transition-colors ${
                                      riasecAnswers[globalQuestionIndex] === answer.value 
                                        ? 'border-brand-blue bg-brand-blue/10' 
                                        : 'border-border/50 hover:border-brand-blue/50 hover:bg-brand-blue/5'
                                    }`}
                                  >
                                    <RadioGroupItem 
                                      value={answer.value.toString()} 
                                      id={`riasec-question-${question.id}-answer-${answer.value}`} 
                                      className="mt-1" 
                                    />
                                    <Label 
                                      htmlFor={`riasec-question-${question.id}-answer-${answer.value}`} 
                                      className="flex-1 cursor-pointer font-normal text-base"
                                    >
                                      {answer.label}
                                    </Label>
                                    {riasecAnswers[globalQuestionIndex] === answer.value && (
                                      <div className="bg-brand-blue/20 rounded-full p-1">
                                        <Check className="h-4 w-4 text-brand-blue" />
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
                          onClick={handleRiasecPrevious}
                          disabled={riasecPage === 0}
                          className="flex items-center gap-1"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <Button 
                          onClick={handleRiasecNext}
                          disabled={!isRiasecPageComplete()}
                          className="bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center gap-1 shadow-md"
                        >
                          {riasecPage === groupedRiasecQuestions.length - 1 ? "Next Section" : "Next"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="pathways" className="mt-0">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-medium text-brand-green">
                            Future Pathways Explorer
                          </h2>
                          <span className="text-sm text-muted-foreground font-medium">
                            Page {pathwaysPage + 1} of {groupedPathwaysQuestions.length}
                          </span>
                        </div>
                        <Progress value={pathwaysProgress} className="h-2 bg-brand-green/20" />
                      </div>
                      
                      <div className="space-y-6">
                        {groupedPathwaysQuestions[pathwaysPage].map((question, questionIndex) => {
                          const globalQuestionIndex = pathwaysPage * pathwaysQuestionsPerPage + questionIndex;
                          return (
                            <div key={question.id} className="bg-brand-green/5 rounded-lg p-5 border border-brand-green/20">
                              <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-start">
                                <span className="bg-brand-green text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                                  {globalQuestionIndex + 1}
                                </span>
                                {question.question}
                              </h3>
                              
                              <RadioGroup 
                                value={pathwaysAnswers[globalQuestionIndex].toString()} 
                                onValueChange={(value) => handlePathwaysAnswer(questionIndex, value)}
                                className="space-y-3"
                              >
                                {likertAnswers.map((answer) => (
                                  <div 
                                    key={answer.value} 
                                    className={`flex items-start space-x-2 border rounded-md p-3 transition-colors ${
                                      pathwaysAnswers[globalQuestionIndex] === answer.value 
                                        ? 'border-brand-green bg-brand-green/10' 
                                        : 'border-border/50 hover:border-brand-green/50 hover:bg-brand-green/5'
                                    }`}
                                  >
                                    <RadioGroupItem 
                                      value={answer.value.toString()} 
                                      id={`pathways-question-${question.id}-answer-${answer.value}`} 
                                      className="mt-1" 
                                    />
                                    <Label 
                                      htmlFor={`pathways-question-${question.id}-answer-${answer.value}`} 
                                      className="flex-1 cursor-pointer font-normal text-base"
                                    >
                                      {answer.label}
                                    </Label>
                                    {pathwaysAnswers[globalQuestionIndex] === answer.value && (
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
                          onClick={handlePathwaysPrevious}
                          className="flex items-center gap-1"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <Button 
                          onClick={handlePathwaysNext}
                          disabled={!isPathwaysPageComplete()}
                          className="bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center gap-1 shadow-md"
                        >
                          {pathwaysPage === groupedPathwaysQuestions.length - 1 ? "Next Section" : "Next"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="eq" className="mt-0">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-medium text-brand-red">
                            EQ Navigator
                          </h2>
                          <span className="text-sm text-muted-foreground font-medium">
                            Page {eqPage + 1} of {groupedEqQuestions.length}
                          </span>
                        </div>
                        <Progress value={eqProgress} className="h-2 bg-brand-red/20" />
                      </div>
                      
                      <div className="space-y-8">
                        {groupedEqQuestions[eqPage].map((question, questionIndex) => {
                          const globalQuestionIndex = eqPage * eqQuestionsPerPage + questionIndex;
                          return (
                            <div key={question.id} className="bg-brand-red/5 rounded-lg p-5 border border-brand-red/20">
                              <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-start">
                                <span className="bg-brand-red text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                                  {globalQuestionIndex + 1}
                                </span>
                                {question.scenario}
                              </h3>
                              
                              <RadioGroup 
                                value={eqAnswers[globalQuestionIndex]} 
                                onValueChange={(value) => handleEqAnswer(questionIndex, value)}
                                className="space-y-3"
                              >
                                {question.options.map((option) => (
                                  <div 
                                    key={option.id} 
                                    className={`flex items-start space-x-2 border rounded-md p-3 transition-colors ${
                                      eqAnswers[globalQuestionIndex] === option.id 
                                        ? 'border-brand-red bg-brand-red/10' 
                                        : 'border-border/50 hover:border-brand-red/50 hover:bg-brand-red/5'
                                    }`}
                                  >
                                    <RadioGroupItem 
                                      value={option.id} 
                                      id={`eq-question-${question.id}-option-${option.id}`} 
                                      className="mt-1" 
                                    />
                                    <Label 
                                      htmlFor={`eq-question-${question.id}-option-${option.id}`} 
                                      className="flex-1 cursor-pointer font-normal text-base"
                                    >
                                      {option.text}
                                    </Label>
                                    {eqAnswers[globalQuestionIndex] === option.id && (
                                      <div className="bg-brand-red/20 rounded-full p-1">
                                        <Check className="h-4 w-4 text-brand-red" />
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
                          onClick={handleEqPrevious}
                          className="flex items-center gap-1"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <Button 
                          onClick={handleEqNext}
                          disabled={!isEqPageComplete()}
                          className="bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center gap-1 shadow-md"
                        >
                          {eqPage === groupedEqQuestions.length - 1 ? "Complete Assessment" : "Next"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">Processing your results...</h2>
                <p className="text-muted-foreground mb-6">Please wait while we analyze your responses.</p>
                <div className="flex justify-center">
                  <div className="animate-spin h-10 w-10 border-4 border-brand-purple/20 border-t-brand-purple rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerVisionAssessment;
