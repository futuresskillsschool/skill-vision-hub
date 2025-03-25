import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import AssessmentDetailsPanel from '@/components/assessment/AssessmentDetailsPanel';

type Question = {
  id: number;
  scenario: string;
  options: Option[];
};

type Option = {
  id: string;
  text: string;
  score: number;
};

type FormValues = {
  [key: string]: string;
};

const questions: Question[] = [
  {
    id: 1,
    scenario: "When someone shares a problem with me, I typically:",
    options: [
      { id: "q1_a", text: "Focus on offering solutions right away", score: 2 },
      { id: "q1_b", text: "Listen carefully before responding", score: 4 },
      { id: "q1_c", text: "Change the subject if it feels uncomfortable", score: 1 },
      { id: "q1_d", text: "Ask questions to better understand how they feel", score: 5 }
    ]
  },
  {
    id: 2,
    scenario: "When I feel upset or angry, I usually:",
    options: [
      { id: "q2_a", text: "Express my feelings calmly and clearly", score: 5 },
      { id: "q2_b", text: "Keep it to myself until it passes", score: 2 },
      { id: "q2_c", text: "React immediately, sometimes saying things I regret later", score: 1 },
      { id: "q2_d", text: "Try to understand why I'm feeling this way", score: 4 }
    ]
  },
  {
    id: 3,
    scenario: "When someone disagrees with me, I tend to:",
    options: [
      { id: "q3_a", text: "Get defensive or frustrated", score: 1 },
      { id: "q3_b", text: "Try to see things from their perspective", score: 5 },
      { id: "q3_c", text: "Avoid discussing the topic further", score: 2 },
      { id: "q3_d", text: "Listen, but still believe my view is correct", score: 3 }
    ]
  },
  {
    id: 4,
    scenario: "In group projects or team activities, I usually:",
    options: [
      { id: "q4_a", text: "Take charge and direct others", score: 3 },
      { id: "q4_b", text: "Prefer to work on my own part quietly", score: 2 },
      { id: "q4_c", text: "Make sure everyone's ideas are heard", score: 5 },
      { id: "q4_d", text: "Go along with what others want to avoid conflict", score: 1 }
    ]
  },
  {
    id: 5,
    scenario: "When I see someone feeling sad or upset, I typically:",
    options: [
      { id: "q5_a", text: "Feel uncomfortable and try to avoid the situation", score: 1 },
      { id: "q5_b", text: "Tell them to cheer up or look on the bright side", score: 2 },
      { id: "q5_c", text: "Ask if they want to talk about what's bothering them", score: 5 },
      { id: "q5_d", text: "Feel sad myself but don't know what to do", score: 3 }
    ]
  },
  {
    id: 6,
    scenario: "When faced with a significant change in my life, I usually:",
    options: [
      { id: "q6_a", text: "Feel overwhelmed and struggle to adapt", score: 1 },
      { id: "q6_b", text: "Focus on the potential opportunities", score: 4 },
      { id: "q6_c", text: "Take time to process my feelings about the change", score: 5 },
      { id: "q6_d", text: "Just push through without thinking about it much", score: 2 }
    ]
  },
  {
    id: 7,
    scenario: "When receiving criticism, I tend to:",
    options: [
      { id: "q7_a", text: "Get upset or defensive", score: 1 },
      { id: "q7_b", text: "Consider if there's something I can learn from it", score: 5 },
      { id: "q7_c", text: "Pretend it doesn't bother me", score: 2 },
      { id: "q7_d", text: "Worry about it for a long time afterward", score: 3 }
    ]
  },
  {
    id: 8,
    scenario: "When someone shares good news with me, I typically:",
    options: [
      { id: "q8_a", text: "Show genuine excitement for them", score: 5 },
      { id: "q8_b", text: "Congratulate them briefly and move on", score: 3 },
      { id: "q8_c", text: "Talk about a similar achievement of my own", score: 2 },
      { id: "q8_d", text: "Feel envious if their success exceeds mine", score: 1 }
    ]
  },
  {
    id: 9,
    scenario: "When making important decisions, I usually:",
    options: [
      { id: "q9_a", text: "Consider how the decision will affect others", score: 5 },
      { id: "q9_b", text: "Go with whatever feels right in the moment", score: 2 },
      { id: "q9_c", text: "Logically analyze all options without considering feelings", score: 3 },
      { id: "q9_d", text: "Worry so much that I struggle to decide", score: 1 }
    ]
  },
  {
    id: 10,
    scenario: "After a disagreement with a friend, I tend to:",
    options: [
      { id: "q10_a", text: "Give each other space and avoid talking about it", score: 2 },
      { id: "q10_b", text: "Think about how we both contributed to the problem", score: 5 },
      { id: "q10_c", text: "Apologize even if I don't think I'm wrong just to make peace", score: 3 },
      { id: "q10_d", text: "Expect them to make the first move to resolve things", score: 1 }
    ]
  }
];

const totalQuestions = questions.length;

const EQNavigatorAssessment = () => {
  const navigate = useNavigate();
  const form = useForm<FormValues>();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [assessmentStarted, setAssessmentStarted] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(Array(totalQuestions).fill(''));
  
  useEffect(() => {
    if (assessmentStarted && currentStep < totalQuestions) {
      const questionId = questions[currentStep].id;
      const existingSelection = selectedOptions[currentStep];
      if (existingSelection) {
        form.setValue(`question_${questionId}`, existingSelection);
      } else {
        form.setValue(`question_${questionId}`, '');
      }
    }
  }, [currentStep, assessmentStarted, form.setValue, selectedOptions]);
  
  const startAssessment = () => {
    setAssessmentStarted(true);
    setCurrentStep(0);
  };
  
  const handleNext = (data: FormValues) => {
    const questionId = questions[currentStep].id;
    const selectedOption = data[`question_${questionId}`];
    
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentStep] = selectedOption;
    setSelectedOptions(newSelectedOptions);
    
    if (currentStep === totalQuestions - 1) {
      const totalScore = calculateTotalScore(newSelectedOptions);
      
      navigate('/assessment/eq-navigator/student-details', { 
        state: { 
          totalScore,
          selectedOptions: newSelectedOptions,
          questions,
        } 
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const calculateTotalScore = (options: string[]) => {
    let score = 0;
    
    questions.forEach((question, index) => {
      const selectedOptionId = options[index];
      const selectedOption = question.options.find(option => option.id === selectedOptionId);
      
      if (selectedOption) {
        score += selectedOption.score;
      }
    });
    
    return score;
  };
  
  const progressPercentage = assessmentStarted 
    ? Math.round(((currentStep + 1) / totalQuestions) * 100) 
    : 0;
  
  if (!assessmentStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-purple-200/30"
              >
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">EQ Navigator Assessment</h1>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    This assessment is designed to help you explore your emotional intelligence (EQ) - 
                    how well you understand and manage your emotions and navigate social relationships.
                  </p>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">What This Assessment Measures</h2>
                    <p className="text-gray-600 mb-4">
                      Emotional intelligence encompasses several key components that this assessment will help you explore:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-purple-500 text-sm font-medium">✓</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">Self-awareness:</span> Recognizing your own emotions and how they affect your thoughts and behavior
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-purple-500 text-sm font-medium">✓</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">Self-regulation:</span> Managing emotions in healthy ways and adapting to changing circumstances
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-purple-500 text-sm font-medium">✓</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">Empathy:</span> Understanding and sharing the feelings of others
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-purple-500 text-sm font-medium">✓</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-800">Social skills:</span> Navigating social networks, building relationships, and managing conflicts
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">How It Works</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-purple-500 text-sm font-medium">1</span>
                        </div>
                        <div className="text-gray-600">
                          You'll respond to 10 questions about how you typically handle various emotional and social situations.
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-purple-500 text-sm font-medium">2</span>
                        </div>
                        <div className="text-gray-600">
                          The assessment takes approximately 5-7 minutes to complete.
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-purple-500 text-sm font-medium">3</span>
                        </div>
                        <div className="text-gray-600">
                          After completion, you'll receive a personalized profile with insights about your emotional intelligence and areas for growth.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <AssessmentDetailsPanel 
                    duration="5-7 minutes" 
                    questions={totalQuestions} 
                    onStartAssessment={startAssessment}
                  />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="md:col-span-2 bg-white rounded-xl shadow-lg p-6 md:p-8 border border-purple-200/30"
                >
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Tips for Taking This Assessment</h2>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-purple-500 text-sm font-medium">✓</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">Be honest with yourself.</span> Choose answers that reflect how you actually respond, not how you think you should respond.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-purple-500 text-sm font-medium">✓</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">Consider your typical behavior,</span> not just how you've acted in one or two specific situations.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-purple-500 text-sm font-medium">✓</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">Remember, there are no "perfect" scores.</span> Emotional intelligence is about understanding yourself better and identifying areas for growth.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-purple-500 text-sm font-medium">✓</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">Trust your instincts</span> and go with your first response rather than overthinking each question.
                      </div>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-purple-500 hover:text-purple-600 hover:bg-purple-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Question {currentStep + 1} of {totalQuestions}</div>
                <Progress value={progressPercentage} className="w-[200px] h-2" />
              </div>
              
              <div className="invisible">
                <Button>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleNext)}>
                  <Card className="border border-purple-200/30 shadow-lg">
                    <div className="p-6 md:p-8">
                      <h2 className="text-xl font-semibold mb-6 text-gray-800">{questions[currentStep].scenario}</h2>
                      
                      <FormField
                        control={form.control}
                        name={`question_${questions[currentStep].id}`}
                        rules={{ required: "Please select an option" }}
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="space-y-3"
                              >
                                {questions[currentStep].options.map((option) => (
                                  <div
                                    key={option.id}
                                    className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 transition-colors hover:bg-purple-50"
                                  >
                                    <RadioGroupItem value={option.id} id={option.id} />
                                    <label
                                      htmlFor={option.id}
                                      className="flex-1 text-base cursor-pointer"
                                    >
                                      {option.text}
                                    </label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end mt-6">
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 text-white"
                        >
                          {currentStep === totalQuestions - 1 ? 'Complete' : 'Next'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorAssessment;
