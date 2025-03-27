
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionnaireSection {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    text: string;
    tooltip?: string;
    options?: { id: string; text: string; }[];
  }[];
}

const RIASEC_QUESTIONS: QuestionnaireSection = {
  id: 'riasec',
  title: 'RIASEC Profile',
  description: 'Indicate how much you agree or disagree with each of the following statements:',
  questions: [
    { id: 'R1', text: 'I enjoy building things with my hands.', tooltip: 'Activities involving hands-on work with physical objects' },
    { id: 'R2', text: 'I like working with tools, machines, or technology.', tooltip: 'Working with machines, tools, or physical systems' },
    { id: 'I1', text: 'I enjoy solving complex problems and puzzles.', tooltip: 'Activities that involve analysis and critical thinking' },
    { id: 'I2', text: 'I\'m curious about how things work and why things happen.', tooltip: 'Investigating questions and finding explanations' },
    { id: 'A1', text: 'I enjoy creative activities like art, music, or writing.', tooltip: 'Activities that involve self-expression and creativity' },
    { id: 'A2', text: 'I prefer tasks that allow me to express myself.', tooltip: 'Creating aesthetic or artistic works' },
    { id: 'S1', text: 'I enjoy helping others and working with people.', tooltip: 'Activities that involve helping, teaching, or providing service to others' },
    { id: 'S2', text: 'I\'m good at explaining things to others.', tooltip: 'Supporting others through listening and guidance' },
    { id: 'E1', text: 'I like to take charge and lead others.', tooltip: 'Activities that involve leadership, persuasion, or management' },
    { id: 'E2', text: 'I enjoy persuading others and selling ideas or products.', tooltip: 'Influencing others and taking initiative' },
    { id: 'C1', text: 'I like following clear procedures and rules.', tooltip: 'Activities that involve organization, attention to detail, and following procedures' },
    { id: 'C2', text: 'I enjoy organizing information and working with data.', tooltip: 'Being precise, orderly, and methodical' },
  ],
};

const PATHWAYS_QUESTIONS: QuestionnaireSection = {
  id: 'pathways',
  title: 'Future Pathways Explorer',
  description: 'Indicate how much you agree or disagree with these statements about possible future activities:',
  questions: [
    { id: 'tech-innovator1', text: 'I enjoy figuring out how things work and how to fix them when they are broken.', tooltip: 'Tech Innovator & Builder' },
    { id: 'digital-creator1', text: 'I like to draw, paint, create videos, or express myself through creative activities.', tooltip: 'Digital Creator & Storyteller' },
    { id: 'data-analyst1', text: 'Numbers and patterns fascinate me. I like to find logic in things.', tooltip: 'Data Analyst & Scientist' },
    { id: 'entrepreneur1', text: 'I have lots of ideas and often think about starting my own projects or businesses.', tooltip: 'Future-Focused Entrepreneur' },
    { id: 'helper1', text: 'I care about making the world a better place and helping people in need.', tooltip: 'Tech-Enabled Helper' },
    { id: 'tech-innovator2', text: 'I am curious about new technologies like robots, AI, and virtual reality.', tooltip: 'Tech Innovator & Builder, Digital Creator & Storyteller' },
    { id: 'digital-creator2', text: 'I enjoy telling stories and communicating my ideas to others.', tooltip: 'Digital Creator & Storyteller, Future-Focused Entrepreneur' },
    { id: 'data-analyst2', text: 'I am good at analyzing information and finding solutions to complex problems.', tooltip: 'Data Analyst & Scientist, Tech-Enabled Helper' },
    { id: 'entrepreneur2', text: 'I am interested in learning how businesses and organizations work.', tooltip: 'Future-Focused Entrepreneur' },
    { id: 'helper2', text: 'I believe technology can be used to solve major problems like climate change or poverty.', tooltip: 'Tech-Enabled Helper, Tech Innovator & Builder' },
    { id: 'digital-creator3', text: 'I like playing video games or exploring virtual worlds.', tooltip: 'Digital Creator & Storyteller' },
    { id: 'tech-innovator3', text: 'I enjoy working with computers and learning about software and coding.', tooltip: 'Tech Innovator & Builder, Data Analyst & Scientist' },
    { id: 'data-analyst3', text: 'I like to understand trends and predict what might happen in the future.', tooltip: 'Data Analyst & Scientist, Future-Focused Entrepreneur' },
    { id: 'entrepreneur3', text: 'I am interested in leadership roles and guiding teams to achieve goals.', tooltip: 'Future-Focused Entrepreneur' },
    { id: 'helper3', text: 'I want to use my skills to help people improve their health and well-being.', tooltip: 'Tech-Enabled Helper' },
  ],
};

const EQ_QUESTIONS: QuestionnaireSection = {
  id: 'eq',
  title: 'EQ Navigator',
  description: 'For each scenario, select the response that best describes how you would typically react:',
  questions: [
    { 
      id: 'eq1', 
      text: 'You\'re excited to share some good news with a friend, but they seem distracted and uninterested. You...', 
      tooltip: 'This tests how you handle social disappointment',
      options: [
        { id: '1', text: 'Get angry and accuse them of not caring about you.' },
        { id: '2', text: 'Feel disappointed but try to understand why they might be distracted. Maybe they\'re having a bad day.' },
        { id: '3', text: 'Pretend you\'re not bothered, even though you\'re a little hurt.' },
        { id: '4', text: 'Stop talking about your news and change the subject.' }
      ]
    },
    { 
      id: 'eq2', 
      text: 'You witness a classmate making fun of another student\'s appearance. You...', 
      tooltip: 'This tests your response to witnessing unkindness',
      options: [
        { id: '1', text: 'Laugh along with the classmate.' },
        { id: '2', text: 'Ignore it and hope it stops.' },
        { id: '3', text: 'Tell the classmate that it\'s not okay to make fun of someone\'s appearance and try to support the student being targeted.' },
        { id: '4', text: 'Tell the targeted student to ignore the comments.' }
      ]
    },
    { 
      id: 'eq3', 
      text: 'You\'re feeling really stressed about upcoming exams. You...', 
      tooltip: 'This tests your stress management skills',
      options: [
        { id: '1', text: 'Isolate yourself and worry constantly.' },
        { id: '2', text: 'Talk to a friend or family member about how you\'re feeling and find healthy ways to manage stress (e.g., exercise, hobbies).' },
        { id: '3', text: 'Procrastinate and avoid thinking about the exams.' },
        { id: '4', text: 'Try to convince yourself you don\'t care about the exams.' }
      ]
    },
    { 
      id: 'eq4', 
      text: 'A friend is going through a tough time (e.g., family issues, break-up). You...', 
      tooltip: 'This tests your empathy and support skills',
      options: [
        { id: '1', text: 'Offer a listening ear and support, letting them know you\'re there for them.' },
        { id: '2', text: 'Try to give them advice, even if you\'re not sure what to say.' },
        { id: '3', text: 'Avoid them because you don\'t know how to handle the situation.' },
        { id: '4', text: 'Tell them to "toughen up."' }
      ]
    },
    { 
      id: 'eq5', 
      text: 'You receive constructive criticism on a project. You...', 
      tooltip: 'This tests your openness to feedback',
      options: [
        { id: '1', text: 'Get defensive and argue with the person giving the feedback.' },
        { id: '2', text: 'Listen to the feedback, even if it\'s hard to hear, and try to learn from it.' },
        { id: '3', text: 'Feel hurt and take it personally.' },
        { id: '4', text: 'Ignore the feedback completely.' }
      ]
    },
    { 
      id: 'eq6', 
      text: 'You have a strong disagreement with a friend. You...', 
      tooltip: 'This tests your conflict resolution skills',
      options: [
        { id: '1', text: 'Resort to personal insults and name-calling.' },
        { id: '2', text: 'Try to see things from your friend\'s perspective and find a compromise.' },
        { id: '3', text: 'Refuse to talk to your friend anymore.' },
        { id: '4', text: 'Give them the silent treatment.' }
      ]
    },
    { 
      id: 'eq7', 
      text: 'You achieve a goal you\'ve been working towards. You...', 
      tooltip: 'This tests your response to success',
      options: [
        { id: '1', text: 'Brag about your achievement to everyone.' },
        { id: '2', text: 'Celebrate your success and acknowledge the effort you put in.' },
        { id: '3', text: 'Downplay your achievement, as if it wasn\'t a big deal.' },
        { id: '4', text: 'Immediately start worrying about your next goal.' }
      ]
    },
    { 
      id: 'eq8', 
      text: 'You make a mistake. You...', 
      tooltip: 'This tests your response to failure',
      options: [
        { id: '1', text: 'Blame someone else.' },
        { id: '2', text: 'Take responsibility for your actions and try to fix the mistake.' },
        { id: '3', text: 'Try to hide the mistake.' },
        { id: '4', text: 'Beat yourself up about it excessively.' }
      ]
    },
    { 
      id: 'eq9', 
      text: 'You see a new student struggling to fit in. You...', 
      tooltip: 'This tests your social awareness',
      options: [
        { id: '1', text: 'Ignore them.' },
        { id: '2', text: 'Make fun of them.' },
        { id: '3', text: 'Introduce yourself and try to make them feel welcome.' },
        { id: '4', text: 'Observe them from a distance but don\'t interact.' }
      ]
    },
    { 
      id: 'eq10', 
      text: 'You feel overwhelmed by your emotions. You...', 
      tooltip: 'This tests your emotional regulation',
      options: [
        { id: '1', text: 'Try to suppress or ignore your feelings.' },
        { id: '2', text: 'Find healthy ways to express your emotions (e.g., talking to someone, journaling, creative activities).' },
        { id: '3', text: 'Lash out at others.' },
        { id: '4', text: 'Engage in self-destructive behaviors.' }
      ]
    },
  ],
};

const ALL_QUESTIONS = [RIASEC_QUESTIONS, PATHWAYS_QUESTIONS, EQ_QUESTIONS];

const answerOptions = [
  { value: "1", label: "Strongly Disagree" },
  { value: "2", label: "Disagree" },
  { value: "3", label: "Neutral" },
  { value: "4", label: "Agree" },
  { value: "5", label: "Strongly Agree" }
];

const CareerVisionAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [progress, setProgress] = useState(0);

  const currentSection = ALL_QUESTIONS[currentSectionIndex];
  const isLastSection = currentSectionIndex === ALL_QUESTIONS.length - 1;
  const isFirstSection = currentSectionIndex === 0;
  
  useEffect(() => {
    const answeredQuestionsCount = Object.keys(answers).length;
    const totalQuestionsCount = ALL_QUESTIONS.reduce((acc, section) => acc + section.questions.length, 0);
    setProgress((answeredQuestionsCount / totalQuestionsCount) * 100);
  }, [answers]);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNextSection = () => {
    if (isLastSection) {
      const riasecResults = calculateRIASECResults();
      const pathwaysResults = calculatePathwaysResults();
      const eqResults = calculateEQResults();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "Assessment Complete!",
        description: "Your results are ready to view.",
      });
      
      navigate('/assessment/career-vision/student-details', {
        state: {
          riasec: riasecResults,
          pathways: pathwaysResults,
          eq: eqResults,
          assessmentType: 'career-vision'
        }
      });
      
    } else {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousSection = () => {
    setCurrentSectionIndex(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateRIASECResults = () => {
    const categories = {
      R: ['R1', 'R2'],
      I: ['I1', 'I2'],
      A: ['A1', 'A2'],
      S: ['S1', 'S2'],
      E: ['E1', 'E2'],
      C: ['C1', 'C2']
    };
    
    const results: Record<string, number> = {};
    
    for (const [category, questionIds] of Object.entries(categories)) {
      const sum = questionIds.reduce((acc, id) => acc + (answers[id] || 0), 0);
      results[category] = sum;
    }
    
    return results;
  };

  const calculatePathwaysResults = () => {
    const clusters = {
      'tech-innovator': 0,
      'digital-creator': 0,
      'data-analyst': 0,
      'entrepreneur': 0,
      'helper': 0
    };
    
    const questionMapping: Record<string, string[]> = {
      'tech-innovator1': ['tech-innovator'],
      'digital-creator1': ['digital-creator'],
      'data-analyst1': ['data-analyst'],
      'entrepreneur1': ['entrepreneur'],
      'helper1': ['helper'],
      'tech-innovator2': ['tech-innovator', 'digital-creator'],
      'digital-creator2': ['digital-creator', 'entrepreneur'],
      'data-analyst2': ['data-analyst', 'helper'],
      'entrepreneur2': ['entrepreneur'],
      'helper2': ['helper', 'tech-innovator'],
      'digital-creator3': ['digital-creator'],
      'tech-innovator3': ['tech-innovator', 'data-analyst'],
      'data-analyst3': ['data-analyst', 'entrepreneur'],
      'entrepreneur3': ['entrepreneur'],
      'helper3': ['helper']
    };
    
    for (const [questionId, value] of Object.entries(answers)) {
      if (questionId.startsWith('tech-') || questionId.startsWith('digital-') || 
          questionId.startsWith('data-') || questionId.startsWith('entrepreneur') || 
          questionId.startsWith('helper')) {
        
        const clusterList = questionMapping[questionId] || [];
        
        for (const cluster of clusterList) {
          clusters[cluster as keyof typeof clusters] += value;
        }
      }
    }
    
    return clusters;
  };

  const calculateEQResults = () => {
    const eqQuestionIds = Array.from({ length: 10 }, (_, i) => `eq${i + 1}`);
    
    const optionScores: Record<string, number[]> = {
      'eq1': [1, 5, 3, 2],
      'eq2': [1, 2, 5, 3],
      'eq3': [1, 5, 2, 2],
      'eq4': [5, 3, 1, 1],
      'eq5': [1, 5, 2, 1],
      'eq6': [1, 5, 1, 1],
      'eq7': [2, 5, 2, 1],
      'eq8': [1, 5, 2, 2],
      'eq9': [1, 1, 5, 2],
      'eq10': [2, 5, 1, 1]
    };
    
    let totalScore = 0;
    
    for (const id of eqQuestionIds) {
      const answer = answers[id];
      if (answer !== undefined) {
        const scoreArray = optionScores[id] || [1, 1, 1, 1];
        totalScore += scoreArray[answer - 1] || 0;
      }
    }
    
    return {
      totalScore,
      selfAwareness: Math.min(10, Math.round(totalScore * 0.3)),
      selfRegulation: Math.min(10, Math.round(totalScore * 0.25)),
      socialAwareness: Math.min(10, Math.round(totalScore * 0.25)),
      relationshipManagement: Math.min(10, Math.round(totalScore * 0.2))
    };
  };

  const isSectionComplete = () => {
    return currentSection.questions.every(q => answers[q.id] !== undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">Career Vision Assessment</h1>
                <span className="text-sm font-medium bg-blue-600 text-white px-3 py-1 rounded-full">
                  Section {currentSectionIndex + 1} of {ALL_QUESTIONS.length}
                </span>
              </div>
              
              <Progress value={progress} className="h-2 mb-2" />
              
              <p className="text-muted-foreground">
                This assessment combines three powerful tools to give you a comprehensive career vision.
              </p>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 md:p-8 mb-8 shadow-md">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">{currentSection.title}</h2>
                    <p className="text-muted-foreground">{currentSection.description}</p>
                  </div>
                  
                  <div className="space-y-8">
                    {currentSection.questions.map((question) => (
                      <div key={question.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start mb-3">
                          <p className="font-medium flex-grow">{question.text}</p>
                          
                          {question.tooltip && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                                    <HelpCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{question.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        
                        <RadioGroup
                          value={answers[question.id]?.toString() || ""}
                          onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
                          className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4 justify-between"
                        >
                          {currentSection.id === 'eq' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                              {question.options?.map((option) => (
                                <div key={option.id} className="flex items-center space-x-2 border rounded p-3 hover:bg-blue-50">
                                  <RadioGroupItem
                                    value={option.id}
                                    id={`${question.id}-${option.id}`}
                                    className="text-blue-600"
                                  />
                                  <Label 
                                    htmlFor={`${question.id}-${option.id}`}
                                    className={`text-sm ${answers[question.id]?.toString() === option.id ? 'font-medium text-blue-600' : 'text-muted-foreground'}`}
                                  >
                                    {option.text}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            answerOptions.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={option.value}
                                  id={`${question.id}-${option.value}`}
                                  className="text-blue-600"
                                />
                                <Label 
                                  htmlFor={`${question.id}-${option.value}`}
                                  className={`text-sm ${answers[question.id]?.toString() === option.value ? 'font-medium text-blue-600' : 'text-muted-foreground'}`}
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))
                          )}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                </Card>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousSection}
                    disabled={isFirstSection}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Section
                  </Button>
                  
                  <Button 
                    onClick={handleNextSection}
                    disabled={!isSectionComplete()}
                    className={isLastSection ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"}
                  >
                    {isLastSection ? "Complete Assessment" : "Next Section"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerVisionAssessment;
