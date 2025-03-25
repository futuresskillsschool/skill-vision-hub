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

// Types
type Question = {
  id: number;
  scenario: string;
  options: Option[];
  section: string;
};

type Option = {
  id: string;
  text: string;
  score: number;
};

type Section = {
  id: string;
  title: string;
  description: string;
  interpretation: {
    high: string;
    low: string;
  };
};

type Answer = {
  questionId: number;
  answer: number;
  section: string;
};

// SCCT Sections
const sections: Section[] = [
  {
    id: 'self_efficacy',
    title: 'Self-Efficacy (Career Confidence)',
    description: 'Your belief in your ability to successfully perform tasks related to career development.',
    interpretation: {
      high: 'You have strong confidence in your ability to succeed in career-related tasks. This confidence can help you tackle challenges, set ambitious goals, and persist in the face of obstacles.',
      low: 'You may experience some doubt about your ability to succeed in career-related tasks. Building confidence through small successes, seeking support, and developing skills can help strengthen your career self-efficacy.'
    }
  },
  {
    id: 'outcome_expectations',
    title: 'Outcome Expectations',
    description: 'Your beliefs about the likely consequences of various career-related actions and decisions.',
    interpretation: {
      high: 'You have positive expectations about the outcomes of your career-related actions. This optimism can motivate you to pursue opportunities and persist in your career development.',
      low: 'You may have uncertainty about whether your career-related efforts will lead to desired outcomes. Learning more about connections between actions and outcomes in careers of interest could help develop more positive expectations.'
    }
  },
  {
    id: 'career_interests',
    title: 'Career Interests',
    description: 'Your preferences for different types of career activities and environments.',
    interpretation: {
      high: 'You have well-developed interests in specific career areas. These interests can guide your educational and career choices toward fulfilling paths.',
      low: 'You may still be exploring your career interests. Trying different activities, courses, and experiences can help you discover what genuinely interests you.'
    }
  },
  {
    id: 'environmental_support',
    title: 'Environmental Support',
    description: 'The resources, opportunities, and assistance available to you in your environment.',
    interpretation: {
      high: 'You perceive strong support in your environment for your career development. This support network can provide resources, guidance, and opportunities to help you achieve your goals.',
      low: 'You may feel that you have limited support for your career development. Actively seeking out mentors, programs, and resources can help build a stronger support network.'
    }
  },
  {
    id: 'perceived_barriers',
    title: 'Perceived Barriers (Challenges)',
    description: 'The obstacles you perceive that may interfere with your career development and choices.',
    interpretation: {
      high: 'You perceive significant barriers to your career development. Identifying specific barriers and developing strategies to address them can help you navigate challenges more effectively.',
      low: 'You perceive relatively few barriers to your career development. This perception can make it easier to pursue your goals, but it is still important to prepare for potential challenges.'
    }
  }
];

// SCCT Questions by section
const questions: Question[] = [
  // Self-Efficacy questions
  {
    id: 1,
    scenario: 'I feel confident in my ability to make good decisions about my education and career.',
    options: [
      { id: 'se1_1', text: 'Strongly Disagree', score: 1 },
      { id: 'se1_2', text: 'Disagree', score: 2 },
      { id: 'se1_3', text: 'Neutral', score: 3 },
      { id: 'se1_4', text: 'Agree', score: 4 },
      { id: 'se1_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'self_efficacy'
  },
  {
    id: 2,
    scenario: 'I believe I can successfully complete the education required for my career of interest.',
    options: [
      { id: 'se2_1', text: 'Strongly Disagree', score: 1 },
      { id: 'se2_2', text: 'Disagree', score: 2 },
      { id: 'se2_3', text: 'Neutral', score: 3 },
      { id: 'se2_4', text: 'Agree', score: 4 },
      { id: 'se2_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'self_efficacy'
  },
  {
    id: 3,
    scenario: 'I am confident I can handle challenges and obstacles in pursuing my career goals.',
    options: [
      { id: 'se3_1', text: 'Strongly Disagree', score: 1 },
      { id: 'se3_2', text: 'Disagree', score: 2 },
      { id: 'se3_3', text: 'Neutral', score: 3 },
      { id: 'se3_4', text: 'Agree', score: 4 },
      { id: 'se3_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'self_efficacy'
  },
  {
    id: 4,
    scenario: 'I feel capable of learning the skills needed for success in my chosen field.',
    options: [
      { id: 'se4_1', text: 'Strongly Disagree', score: 1 },
      { id: 'se4_2', text: 'Disagree', score: 2 },
      { id: 'se4_3', text: 'Neutral', score: 3 },
      { id: 'se4_4', text: 'Agree', score: 4 },
      { id: 'se4_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'self_efficacy'
  },
  {
    id: 5,
    scenario: 'I believe I can perform well in job interviews or career-related situations.',
    options: [
      { id: 'se5_1', text: 'Strongly Disagree', score: 1 },
      { id: 'se5_2', text: 'Disagree', score: 2 },
      { id: 'se5_3', text: 'Neutral', score: 3 },
      { id: 'se5_4', text: 'Agree', score: 4 },
      { id: 'se5_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'self_efficacy'
  },
  
  // Outcome Expectations questions
  {
    id: 6,
    scenario: 'I believe pursuing education in my field of interest will lead to good career opportunities.',
    options: [
      { id: 'oe1_1', text: 'Strongly Disagree', score: 1 },
      { id: 'oe1_2', text: 'Disagree', score: 2 },
      { id: 'oe1_3', text: 'Neutral', score: 3 },
      { id: 'oe1_4', text: 'Agree', score: 4 },
      { id: 'oe1_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'outcome_expectations'
  },
  {
    id: 7,
    scenario: 'I expect that working hard to develop skills will result in career success.',
    options: [
      { id: 'oe2_1', text: 'Strongly Disagree', score: 1 },
      { id: 'oe2_2', text: 'Disagree', score: 2 },
      { id: 'oe2_3', text: 'Neutral', score: 3 },
      { id: 'oe2_4', text: 'Agree', score: 4 },
      { id: 'oe2_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'outcome_expectations'
  },
  {
    id: 8,
    scenario: 'I believe my career choices will lead to a satisfying lifestyle.',
    options: [
      { id: 'oe3_1', text: 'Strongly Disagree', score: 1 },
      { id: 'oe3_2', text: 'Disagree', score: 2 },
      { id: 'oe3_3', text: 'Neutral', score: 3 },
      { id: 'oe3_4', text: 'Agree', score: 4 },
      { id: 'oe3_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'outcome_expectations'
  },
  {
    id: 9,
    scenario: 'I think my career will allow me to contribute positively to society.',
    options: [
      { id: 'oe4_1', text: 'Strongly Disagree', score: 1 },
      { id: 'oe4_2', text: 'Disagree', score: 2 },
      { id: 'oe4_3', text: 'Neutral', score: 3 },
      { id: 'oe4_4', text: 'Agree', score: 4 },
      { id: 'oe4_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'outcome_expectations'
  },
  {
    id: 10,
    scenario: 'I believe pursuing my career interests will lead to personal fulfillment.',
    options: [
      { id: 'oe5_1', text: 'Strongly Disagree', score: 1 },
      { id: 'oe5_2', text: 'Disagree', score: 2 },
      { id: 'oe5_3', text: 'Neutral', score: 3 },
      { id: 'oe5_4', text: 'Agree', score: 4 },
      { id: 'oe5_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'outcome_expectations'
  },
  
  // Career Interests questions (One for each RIASEC type)
  {
    id: 11,
    scenario: 'I am interested in careers that involve researching, analyzing data, or solving complex problems.',
    options: [
      { id: 'ci1_1', text: 'Not at all interested', score: 0 },
      { id: 'ci1_2', text: 'Slightly interested', score: 1 },
      { id: 'ci1_3', text: 'Moderately interested', score: 2 },
      { id: 'ci1_4', text: 'Very interested', score: 3 },
      { id: 'ci1_5', text: 'Extremely interested', score: 4 }
    ],
    section: 'career_interests'
  },
  {
    id: 12,
    scenario: 'I am interested in careers that involve creative expression, design, or performing arts.',
    options: [
      { id: 'ci2_1', text: 'Not at all interested', score: 0 },
      { id: 'ci2_2', text: 'Slightly interested', score: 1 },
      { id: 'ci2_3', text: 'Moderately interested', score: 2 },
      { id: 'ci2_4', text: 'Very interested', score: 3 },
      { id: 'ci2_5', text: 'Extremely interested', score: 4 }
    ],
    section: 'career_interests'
  },
  {
    id: 13,
    scenario: 'I am interested in careers that involve leadership, management, or entrepreneurship.',
    options: [
      { id: 'ci3_1', text: 'Not at all interested', score: 0 },
      { id: 'ci3_2', text: 'Slightly interested', score: 1 },
      { id: 'ci3_3', text: 'Moderately interested', score: 2 },
      { id: 'ci3_4', text: 'Very interested', score: 3 },
      { id: 'ci3_5', text: 'Extremely interested', score: 4 }
    ],
    section: 'career_interests'
  },
  {
    id: 14,
    scenario: 'I am interested in careers that involve helping, teaching, or counseling others.',
    options: [
      { id: 'ci4_1', text: 'Not at all interested', score: 0 },
      { id: 'ci4_2', text: 'Slightly interested', score: 1 },
      { id: 'ci4_3', text: 'Moderately interested', score: 2 },
      { id: 'ci4_4', text: 'Very interested', score: 3 },
      { id: 'ci4_5', text: 'Extremely interested', score: 4 }
    ],
    section: 'career_interests'
  },
  {
    id: 15,
    scenario: 'I am interested in careers that involve organizing, managing data, or following established procedures.',
    options: [
      { id: 'ci5_1', text: 'Not at all interested', score: 0 },
      { id: 'ci5_2', text: 'Slightly interested', score: 1 },
      { id: 'ci5_3', text: 'Moderately interested', score: 2 },
      { id: 'ci5_4', text: 'Very interested', score: 3 },
      { id: 'ci5_5', text: 'Extremely interested', score: 4 }
    ],
    section: 'career_interests'
  },
  
  // Environmental Support questions
  {
    id: 16,
    scenario: 'I have access to people who can provide me with career advice and guidance.',
    options: [
      { id: 'es1_1', text: 'Strongly Disagree', score: 1 },
      { id: 'es1_2', text: 'Disagree', score: 2 },
      { id: 'es1_3', text: 'Neutral', score: 3 },
      { id: 'es1_4', text: 'Agree', score: 4 },
      { id: 'es1_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'environmental_support'
  },
  {
    id: 17,
    scenario: 'My family supports my educational and career plans.',
    options: [
      { id: 'es2_1', text: 'Strongly Disagree', score: 1 },
      { id: 'es2_2', text: 'Disagree', score: 2 },
      { id: 'es2_3', text: 'Neutral', score: 3 },
      { id: 'es2_4', text: 'Agree', score: 4 },
      { id: 'es2_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'environmental_support'
  },
  {
    id: 18,
    scenario: 'My school/college provides resources to help me explore and prepare for careers.',
    options: [
      { id: 'es3_1', text: 'Strongly Disagree', score: 1 },
      { id: 'es3_2', text: 'Disagree', score: 2 },
      { id: 'es3_3', text: 'Neutral', score: 3 },
      { id: 'es3_4', text: 'Agree', score: 4 },
      { id: 'es3_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'environmental_support'
  },
  {
    id: 19,
    scenario: 'I have friends who encourage me to pursue my educational and career goals.',
    options: [
      { id: 'es4_1', text: 'Strongly Disagree', score: 1 },
      { id: 'es4_2', text: 'Disagree', score: 2 },
      { id: 'es4_3', text: 'Neutral', score: 3 },
      { id: 'es4_4', text: 'Agree', score: 4 },
      { id: 'es4_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'environmental_support'
  },
  {
    id: 20,
    scenario: 'I have access to financial resources to support my educational goals.',
    options: [
      { id: 'es5_1', text: 'Strongly Disagree', score: 1 },
      { id: 'es5_2', text: 'Disagree', score: 2 },
      { id: 'es5_3', text: 'Neutral', score: 3 },
      { id: 'es5_4', text: 'Agree', score: 4 },
      { id: 'es5_5', text: 'Strongly Agree', score: 5 }
    ],
    section: 'environmental_support'
  },
  
  // Perceived Barriers questions
  {
    id: 21,
    scenario: 'I worry about financial limitations affecting my career choices.',
    options: [
      { id: 'pb1_1', text: 'Strongly Disagree', score: 5 },
      { id: 'pb1_2', text: 'Disagree', score: 4 },
      { id: 'pb1_3', text: 'Neutral', score: 3 },
      { id: 'pb1_4', text: 'Agree', score: 2 },
      { id: 'pb1_5', text: 'Strongly Agree', score: 1 }
    ],
    section: 'perceived_barriers'
  },
  {
    id: 22,
    scenario: 'I feel that my background might limit my educational or career opportunities.',
    options: [
      { id: 'pb2_1', text: 'Strongly Disagree', score: 5 },
      { id: 'pb2_2', text: 'Disagree', score: 4 },
      { id: 'pb2_3', text: 'Neutral', score: 3 },
      { id: 'pb2_4', text: 'Agree', score: 2 },
      { id: 'pb2_5', text: 'Strongly Agree', score: 1 }
    ],
    section: 'perceived_barriers'
  },
  {
    id: 23,
    scenario: 'I experience stress or anxiety when thinking about career decisions.',
    options: [
      { id: 'pb3_1', text: 'Strongly Disagree', score: 5 },
      { id: 'pb3_2', text: 'Disagree', score: 4 },
      { id: 'pb3_3', text: 'Neutral', score: 3 },
      { id: 'pb3_4', text: 'Agree', score: 2 },
      { id: 'pb3_5', text: 'Strongly Agree', score: 1 }
    ],
    section: 'perceived_barriers'
  },
  {
    id: 24,
    scenario: 'I lack information about career options and requirements for different fields.',
    options: [
      { id: 'pb4_1', text: 'Strongly Disagree', score: 5 },
      { id: 'pb4_2', text: 'Disagree', score: 4 },
      { id: 'pb4_3', text: 'Neutral', score: 3 },
      { id: 'pb4_4', text: 'Agree', score: 2 },
      { id: 'pb4_5', text: 'Strongly Agree', score: 1 }
    ],
    section: 'perceived_barriers'
  },
  {
    id: 25,
    scenario: 'I find it difficult to make decisions about my education and career path.',
    options: [
      { id: 'pb5_1', text: 'Strongly Disagree', score: 5 },
      { id: 'pb5_2', text: 'Disagree', score: 4 },
      { id: 'pb5_3', text: 'Neutral', score: 3 },
      { id: 'pb5_4', text: 'Agree', score: 2 },
      { id: 'pb5_5', text: 'Strongly Agree', score: 1 }
    ],
    section: 'perceived_barriers'
  }
];

const SCCTAssessment = () => {
  const navigate = useNavigate();
  const { handleSubmit, control, watch, setValue, formState: { errors } } = useForm();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [assessmentStarted, setAssessmentStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  
  // Reset form when questions change
  useEffect(() => {
    if (assessmentStarted && currentStep < questions.length) {
      const questionId = questions[currentStep].id;
      // Check if there's an existing answer for this question
      const existingAnswer = answers.find(a => a.questionId === questionId);
      if (existingAnswer !== undefined) {
        setValue(`question_${questionId}`, existingAnswer.answer);
      } else {
        setValue(`question_${questionId}`, null);
      }
    }
  }, [currentStep, assessmentStarted, setValue, answers]);
  
  const startAssessment = () => {
    setAssessmentStarted(true);
    setCurrentStep(0);
  };
  
  const handleNext = (data: any) => {
    const questionId = questions[currentStep].id;
    const selectedOption = data[`question_${questionId}`];
    const section = questions[currentStep].section;
    
    // Store the answer
    const newAnswer: Answer = {
      questionId,
      answer: selectedOption,
      section
    };
    
    // Update answers
    setAnswers(prev => {
      const filteredAnswers = prev.filter(a => a.questionId !== questionId);
      return [...filteredAnswers, newAnswer];
    });
    
    // If this is the last question, calculate scores
    if (currentStep === questions.length - 1) {
      calculateScores([...answers.filter(a => a.questionId !== questionId), newAnswer]);
    } else {
      // Move to next question
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const calculateScores = (finalAnswers: Answer[]) => {
    // Initialize scores object
    const calculatedScores: Record<string, number> = {};
    
    sections.forEach(section => {
      // Get answers for this section
      const sectionAnswers = finalAnswers.filter(a => a.section === section.id);
      
      // Calculate total score for this section
      const totalScore = sectionAnswers.reduce((sum, answer) => {
        return sum + answer.answer;
      }, 0);
      
      calculatedScores[section.id] = totalScore;
    });
    
    setScores(calculatedScores);
    
    // Navigate to student details page with scores
    navigate('/assessment/scct/student-details', { 
      state: { 
        scores: calculatedScores,
        sections,
        answers: finalAnswers
      } 
    });
  };
  
  // Calculate progress percentage
  const progressPercentage = assessmentStarted 
    ? Math.round(((currentStep + 1) / questions.length) * 100) 
    : 0;
  
  // If assessment has not yet started, show introduction
  if (!assessmentStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-brand-orange/30"
              >
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Social Cognitive Career Theory Assessment</h1>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    This assessment will help you understand your career development through the lens of Social Cognitive Career Theory (SCCT), exploring your confidence, interests, and potential barriers.
                  </p>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-brand-orange/5 p-5 rounded-lg border border-brand-orange/20">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">What This Assessment Measures</h2>
                    <p className="text-gray-600 mb-4">
                      SCCT explains how career and educational interests develop, how career choices are made, and how people achieve success in their educational and career pursuits.
                    </p>
                    <ul className="space-y-3">
                      {sections.map((section) => (
                        <li key={section.id} className="flex items-start">
                          <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                            <span className="text-brand-orange text-sm font-medium">✓</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{section.title}</span>: {section.description}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-brand-orange/5 p-5 rounded-lg border border-brand-orange/20">
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">How It Works</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-brand-orange text-sm font-medium">1</span>
                        </div>
                        <div className="text-gray-600">
                          You'll respond to 25 statements about your career development, indicating how much you agree or disagree with each.
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-brand-orange text-sm font-medium">2</span>
                        </div>
                        <div className="text-gray-600">
                          The assessment takes approximately 10-15 minutes to complete.
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-brand-orange text-sm font-medium">3</span>
                        </div>
                        <div className="text-gray-600">
                          After completion, you'll receive a personalized analysis of your results with insights and recommendations.
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <AssessmentDetailsPanel 
                    duration="10-15 minutes" 
                    questions={questions.length} 
                    onStartAssessment={startAssessment}
                  />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="md:col-span-2 bg-white rounded-xl shadow-lg p-6 md:p-8 border border-brand-orange/30"
                >
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Tips for Taking This Assessment</h2>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-brand-orange text-sm font-medium">✓</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">Be honest with your responses.</span> There are no right or wrong answers—this assessment is about understanding yourself better.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-brand-orange text-sm font-medium">✓</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">Find a quiet place</span> where you can focus without distractions.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-brand-orange text-sm font-medium">✓</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">Trust your initial reactions</span> rather than overthinking your responses.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-brand-orange text-sm font-medium">✓</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">Complete the assessment in one sitting</span> if possible, to maintain consistency in your responses.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                        <span className="text-brand-orange text-sm font-medium">✓</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium text-gray-800">Remember this is for your benefit</span>—the more thoughtful your responses, the more insightful your results will be.
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-brand-orange hover:text-brand-orange/80 hover:bg-brand-orange/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Question {currentStep + 1} of {questions.length}</div>
                <Progress value={progressPercentage} className="w-[200px] h-2" indicatorClassName="bg-brand-orange" />
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
              <Form {...{ control, handleSubmit: handleSubmit(handleNext) }}>
                <Card className="border border-brand-orange/20 shadow-lg">
                  <div className="p-6 md:p-8">
                    <div className="mb-6">
                      <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-medium px-3 py-1 rounded-md mb-3">
                        {sections.find(s => s.id === questions[currentStep].section)?.title}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">{questions[currentStep].scenario}</h2>
                    </div>
                    
                    <FormField
                      control={control}
                      name={`question_${questions[currentStep].id}`}
                      rules={{ required: "Please select an option" }}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              value={field.value?.toString()}
                              className="space-y-3"
                            >
                              {questions[currentStep].options.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 transition-colors hover:bg-brand-orange/5"
                                >
                                  <RadioGroupItem 
                                    value={option.score.toString()} 
                                    id={option.id} 
                                    className="text-brand-orange"
                                  />
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
                          {errors[`question_${questions[currentStep].id}`] && (
                            <FormMessage>
                              <div className="flex items-center mt-2 text-red-500">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                <span>Please select an option</span>
                              </div>
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end mt-6">
                      <Button 
                        type="submit" 
                        className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                      >
                        {currentStep === questions.length - 1 ? 'Submit' : 'Next'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Form>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SCCTAssessment;
