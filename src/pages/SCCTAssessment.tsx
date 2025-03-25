
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// SCCT Assessment sections definition
const sections = [
  {
    id: 'self_efficacy',
    title: 'Self-Efficacy Beliefs',
    description: 'How confident you feel in your ability to perform career-related tasks',
    interpretation: {
      high: 'You have strong confidence in your ability to succeed in career-related tasks. This confidence can help you set challenging goals and persist through obstacles.',
      low: 'You may have some doubts about your ability to succeed in certain career-related tasks. Consider breaking goals into smaller steps to build confidence gradually.'
    },
    questions: [
      {
        id: 1,
        text: 'I am confident in my ability to succeed in my chosen career path.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 2,
        text: 'When faced with career challenges, I believe I can overcome them.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 3,
        text: 'I can master the skills necessary for my desired profession.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 4,
        text: 'I am capable of performing well in job interviews.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 5,
        text: 'I can effectively balance my career goals with other life priorities.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      }
    ]
  },
  {
    id: 'outcome_expectations',
    title: 'Outcome Expectations',
    description: 'Your beliefs about the outcomes of pursuing particular career paths',
    interpretation: {
      high: 'You have positive expectations about the outcomes of your career choices. This can motivate you to pursue your goals with enthusiasm.',
      low: 'You may have concerns about whether your career efforts will lead to desired outcomes. Focus on learning about success stories in your field.'
    },
    questions: [
      {
        id: 6,
        text: 'My career will provide me with financial security.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 7,
        text: 'I expect my career will give me personal satisfaction.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 8,
        text: 'My career choice will allow me to make a positive impact on society.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 9,
        text: 'I believe my career will provide good work-life balance.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 10,
        text: 'My career path will offer opportunities for advancement and growth.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      }
    ]
  },
  {
    id: 'career_interests',
    title: 'Career Interests and Goals',
    description: 'Your interests in various career areas and your career goals',
    interpretation: {
      high: 'You have well-defined career interests and goals. This clarity can help you make focused career decisions.',
      low: 'You may be still exploring your career interests and goals. This is a normal part of career development.'
    },
    questions: [
      {
        id: 11,
        text: 'I am interested in careers that involve research, analysis, or scientific investigation.',
        options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely']
      },
      {
        id: 12,
        text: 'I am interested in careers that involve creativity, artistic expression, or design.',
        options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely']
      },
      {
        id: 13,
        text: 'I am interested in careers that involve business, leadership, or entrepreneurship.',
        options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely']
      },
      {
        id: 14,
        text: 'I am interested in careers that involve helping, teaching, or counseling others.',
        options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely']
      },
      {
        id: 15,
        text: 'I am interested in careers that involve organization, data management, or attention to detail.',
        options: ['Not at all', 'Slightly', 'Moderately', 'Very', 'Extremely']
      }
    ]
  },
  {
    id: 'environmental_support',
    title: 'Environmental Supports',
    description: 'The support you perceive from your environment for your career development',
    interpretation: {
      high: 'You perceive strong support from your environment for your career goals. This support can be a valuable resource as you pursue your career.',
      low: 'You may feel that your environment provides limited support for your career development. Consider seeking out mentors or career services.'
    },
    questions: [
      {
        id: 16,
        text: 'My family supports my career goals.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 17,
        text: 'I have role models or mentors in my field of interest.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 18,
        text: 'I have access to the resources I need for my career development.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 19,
        text: 'My educational environment prepares me well for my career goals.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 20,
        text: 'I have a network of people who can help me with my career goals.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      }
    ]
  },
  {
    id: 'perceived_barriers',
    title: 'Perceived Barriers',
    description: 'The barriers you perceive to achieving your career goals',
    interpretation: {
      high: 'You perceive significant barriers to achieving your career goals. It may be helpful to develop strategies for overcoming these barriers.',
      low: 'You perceive few barriers to achieving your career goals. This perception can contribute to a sense of agency in your career development.'
    },
    questions: [
      {
        id: 21,
        text: 'Financial constraints will limit my career options.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 22,
        text: 'Discrimination or bias may hinder my career progress.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 23,
        text: 'I will face significant competition in my chosen field.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 24,
        text: 'Work-life balance will be difficult to achieve in my career.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      },
      {
        id: 25,
        text: 'I lack some of the abilities needed for success in my desired career.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
      }
    ]
  }
];

const SCCTAssessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<{questionId: number; answer: number; section: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle question answer
  const handleAnswer = (questionId: number, answerIndex: number) => {
    const currentSection = sections[currentSectionIndex];
    
    setAnswers(prev => {
      // Find if this question has been answered before
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId);
      
      if (existingAnswerIndex !== -1) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = {
          questionId,
          answer: answerIndex,
          section: currentSection.id
        };
        return newAnswers;
      } else {
        // Add new answer
        return [
          ...prev,
          {
            questionId,
            answer: answerIndex,
            section: currentSection.id
          }
        ];
      }
    });
  };
  
  // Check if all questions in current section are answered
  const areAllQuestionsInSectionAnswered = () => {
    const currentSection = sections[currentSectionIndex];
    const sectionQuestionIds = currentSection.questions.map(q => q.id);
    
    return sectionQuestionIds.every(qId => 
      answers.some(a => a.questionId === qId)
    );
  };
  
  // Moving between sections
  const handleNextSection = () => {
    if (!areAllQuestionsInSectionAnswered()) {
      toast({
        title: "Please answer all questions",
        description: "All questions in this section must be answered before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };
  
  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Calculate scores for each section
  const calculateScores = () => {
    const scores: Record<string, number> = {};
    
    sections.forEach(section => {
      // Get answers for this section
      const sectionAnswers = answers.filter(a => a.section === section.id);
      
      // Calculate score for this section
      const sectionScore = sectionAnswers.reduce((total, answer) => total + answer.answer + 1, 0);
      
      // Store score
      scores[section.id] = sectionScore;
    });
    
    return scores;
  };
  
  // Handle final submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const scores = calculateScores();
      
      // If the user is logged in, store the results in the database
      if (user) {
        await supabase
          .from('assessment_results')
          .insert({
            user_id: user.id,
            assessment_type: 'scct',
            result_data: {
              scores,
              sections,
              answers
            }
          });
      }
      
      // Redirect to student details form before showing results
      navigate('/assessment/scct/student-details', {
        state: {
          scores,
          sections,
          answers
        }
      });
      
    } catch (error) {
      console.error('Error saving assessment results:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your results. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  // Current section
  const currentSection = sections[currentSectionIndex];
  
  // Progress percentage
  const progress = ((currentSectionIndex + 1) / sections.length) * 100;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">SCCT Assessment</h1>
              <p className="text-muted-foreground">
                Discover how your beliefs, goals, and environment shape your career choices
              </p>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Section {currentSectionIndex + 1} of {sections.length}
                </span>
                <span className="text-sm font-medium">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-card overflow-hidden mb-8"
            >
              <div className="p-6 md:p-8 border-b">
                <h2 className="text-xl font-bold mb-2">{currentSection.title}</h2>
                <p className="text-muted-foreground">{currentSection.description}</p>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="space-y-6">
                  {currentSection.questions.map((question, questionIndex) => {
                    const questionAnswer = answers.find(a => a.questionId === question.id);
                    const selectedAnswerIndex = questionAnswer ? questionAnswer.answer : -1;
                    
                    return (
                      <div key={question.id} className="pb-4 border-b last:border-0 last:pb-0">
                        <p className="font-medium mb-3">{questionIndex + 1}. {question.text}</p>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              onClick={() => handleAnswer(question.id, optionIndex)}
                              className={`
                                flex items-center p-3 rounded-lg border cursor-pointer
                                ${selectedAnswerIndex === optionIndex 
                                  ? 'bg-brand-orange/10 border-brand-orange' 
                                  : 'hover:bg-gray-50 border-gray-200'}
                              `}
                            >
                              <div className={`
                                w-5 h-5 rounded-full mr-3 flex items-center justify-center
                                ${selectedAnswerIndex === optionIndex 
                                  ? 'bg-brand-orange text-white' 
                                  : 'bg-gray-100'}
                              `}>
                                {selectedAnswerIndex === optionIndex && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                              <span className={selectedAnswerIndex === optionIndex ? 'font-medium' : ''}>
                                {option}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousSection}
                disabled={currentSectionIndex === 0}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              <Button
                onClick={handleNextSection}
                disabled={isSubmitting}
                className="flex items-center bg-brand-orange hover:bg-brand-orange/90"
              >
                {currentSectionIndex < sections.length - 1 ? (
                  <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Submit <Check className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SCCTAssessment;
