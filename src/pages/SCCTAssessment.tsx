
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define question sections
type Section = {
  id: string;
  title: string;
  description: string;
  interpretation: {
    high: string;
    low: string;
  };
};

const sections: Section[] = [
  {
    id: 'self_efficacy',
    title: 'Self-Efficacy (Confidence in Abilities)',
    description: 'How confident you feel about your abilities to perform tasks and overcome challenges.',
    interpretation: {
      high: 'More career confidence.',
      low: 'May need skill-building and encouragement.'
    }
  },
  {
    id: 'outcome_expectations',
    title: 'Outcome Expectations (Belief in Future Success)',
    description: 'How strongly you believe your efforts will lead to desired outcomes.',
    interpretation: {
      high: 'Strong belief in personal success.',
      low: 'May need motivation and career awareness.'
    }
  },
  {
    id: 'career_interests',
    title: 'Career Interests & Exploration',
    description: 'Areas you find enjoyable and engaging, which may indicate career preferences.',
    interpretation: {
      high: 'Indicate career preferences.',
      low: 'Uncertainty about interests, may need exploration.'
    }
  },
  {
    id: 'environmental_support',
    title: 'Environmental & Social Support',
    description: 'How supported you feel by your environment, family, teachers, and resources.',
    interpretation: {
      high: 'Strong support system.',
      low: 'May need career guidance and mentorship.'
    }
  },
  {
    id: 'perceived_barriers',
    title: 'Perceived Barriers (Challenges in Career Pursuit)',
    description: 'Challenges or obstacles you perceive in your career path.',
    interpretation: {
      high: 'Indicate possible concerns or limiting beliefs.',
      low: 'More career confidence.'
    }
  }
];

// Define SCCT question type
type SCCTQuestion = {
  id: number;
  question: string;
  section: string;
  options: string[];
};

// Define the set of questions grouped by section
const scctQuestions: SCCTQuestion[] = [
  // Section 1: Self-Efficacy
  {
    id: 1,
    question: "I believe I can improve my skills if I work hard.",
    section: 'self_efficacy',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 2,
    question: "I feel confident speaking in front of a group.",
    section: 'self_efficacy',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 3,
    question: "I can solve problems even when things get difficult.",
    section: 'self_efficacy',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 4,
    question: "I feel comfortable using technology for learning.",
    section: 'self_efficacy',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 5,
    question: "I can work well in a team to complete tasks.",
    section: 'self_efficacy',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Section 2: Outcome Expectations
  {
    id: 6,
    question: "I believe my efforts in school will help me succeed in my career.",
    section: 'outcome_expectations',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 7,
    question: "I feel that learning new skills outside school will benefit my future.",
    section: 'outcome_expectations',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 8,
    question: "I believe networking and making connections will help my career.",
    section: 'outcome_expectations',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 9,
    question: "I think I can achieve my dream career if I stay dedicated.",
    section: 'outcome_expectations',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 10,
    question: "I believe creative and problem-solving skills are important for success.",
    section: 'outcome_expectations',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Section 3: Career Interests & Exploration
  {
    id: 11,
    question: "I enjoy solving puzzles, experiments, or research.",
    section: 'career_interests',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 12,
    question: "I like designing, drawing, or creating content.",
    section: 'career_interests',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 13,
    question: "I enjoy leading discussions, debates, or group activities.",
    section: 'career_interests',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 14,
    question: "I like helping others and giving advice.",
    section: 'career_interests',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 15,
    question: "I enjoy organizing things, keeping records, or managing schedules.",
    section: 'career_interests',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Section 4: Environmental & Social Support
  {
    id: 16,
    question: "My family encourages me to explore different career options.",
    section: 'environmental_support',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 17,
    question: "I have teachers or mentors who guide me about my future.",
    section: 'environmental_support',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 18,
    question: "I feel supported when I try new things.",
    section: 'environmental_support',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 19,
    question: "My school provides enough career exploration opportunities.",
    section: 'environmental_support',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 20,
    question: "I have access to resources (books, online courses, workshops) to explore careers.",
    section: 'environmental_support',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  
  // Section 5: Perceived Barriers
  {
    id: 21,
    question: "I worry about financial limitations affecting my education.",
    section: 'perceived_barriers',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 22,
    question: "I feel nervous about failing when trying something new.",
    section: 'perceived_barriers',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 23,
    question: "I believe some careers are not for me because of my background or gender.",
    section: 'perceived_barriers',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 24,
    question: "I feel that competition in my dream career is too tough.",
    section: 'perceived_barriers',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  },
  {
    id: 25,
    question: "I sometimes feel uncertain about what career suits me.",
    section: 'perceived_barriers',
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
  }
];

type Answer = {
  questionId: number;
  answer: number; // Index of the selected option (0-4 for 5-point scale)
  section: string;
};

const SCCTAssessment = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Set initial active section
    if (scctQuestions.length > 0) {
      setActiveSection(scctQuestions[0].section);
    }
  }, []);

  const handleAnswerSelect = (questionId: number, answerIndex: number, section: string) => {
    const newAnswers = [...answers];
    const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = { questionId, answer: answerIndex, section };
    } else {
      newAnswers.push({ questionId, answer: answerIndex, section });
    }
    
    setAnswers(newAnswers);
    
    // Update progress
    const answeredCount = new Set(newAnswers.map(a => a.questionId)).size;
    setCurrentProgress((answeredCount / scctQuestions.length) * 100);
  };

  const handleSubmit = () => {
    // Calculate section scores
    const sectionScores: Record<string, { total: number, count: number }> = {};
    
    // Initialize section scores
    sections.forEach(section => {
      sectionScores[section.id] = { total: 0, count: 0 };
    });
    
    // Calculate scores for each section
    answers.forEach(answer => {
      if (sectionScores[answer.section]) {
        sectionScores[answer.section].total += answer.answer + 1; // Convert 0-4 to 1-5
        sectionScores[answer.section].count += 1;
      }
    });
    
    // Calculate averages and create final scores object
    const finalScores: Record<string, number> = {};
    
    for (const sectionId in sectionScores) {
      if (sectionScores[sectionId].count > 0) {
        finalScores[sectionId] = sectionScores[sectionId].total;
      } else {
        finalScores[sectionId] = 0;
      }
    }
    
    // Navigate to results page with scores
    navigate('/scct/results', { state: { scores: finalScores, sections, answers } });
  };

  const isQuestionAnswered = (questionId: number) => {
    return answers.some(a => a.questionId === questionId);
  };

  const allQuestionsAnswered = answers.length === scctQuestions.length;

  // Group questions by section
  const questionsBySection: Record<string, SCCTQuestion[]> = {};
  scctQuestions.forEach(question => {
    if (!questionsBySection[question.section]) {
      questionsBySection[question.section] = [];
    }
    questionsBySection[question.section].push(question);
  });

  // Get section info by id
  const getSectionInfo = (sectionId: string) => {
    return sections.find(s => s.id === sectionId);
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
              className="mb-4 text-brand-orange hover:text-brand-orange/80 -ml-3"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">SCCT Assessment</h1>
            <p className="text-foreground/70 max-w-3xl">
              Based on Social Cognitive Career Theory, this assessment helps you understand how your beliefs about
              yourself and your environment influence your career choices. Discover your confidence levels,
              expectations, interests, and perceived barriers.
            </p>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8">
            <div 
              className="bg-brand-orange h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 p-4 bg-brand-orange/5 border border-brand-orange/10 rounded-lg">
              <h2 className="font-semibold text-brand-orange mb-2">Instructions:</h2>
              <p>For each statement, select the option that best describes you, from "Strongly Disagree" to "Strongly Agree". Be honest in your responses for the most accurate results.</p>
            </div>
            
            {/* Questions by section */}
            <div className="space-y-12 mb-10">
              {sections.map((section) => {
                const sectionQuestions = questionsBySection[section.id] || [];
                return (
                  <div key={section.id} id={section.id} className="scroll-mt-32">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
                      <h2 className="text-xl font-bold mb-2 text-brand-orange">{section.title}</h2>
                      <p className="text-foreground/70 mb-4">{section.description}</p>
                    </div>
                    
                    <div className="space-y-6">
                      {sectionQuestions.map((question) => (
                        <div key={question.id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                          <h3 className="text-lg font-semibold mb-4 flex items-start">
                            <span className="bg-brand-orange text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 flex-shrink-0">
                              {question.id}
                            </span>
                            {question.question}
                          </h3>
                          
                          <RadioGroup 
                            className="space-y-2"
                            value={answers.find(a => a.questionId === question.id)?.answer.toString() || ""}
                            onValueChange={(value) => {
                              handleAnswerSelect(question.id, parseInt(value), question.section);
                            }}
                          >
                            <div className="flex flex-wrap gap-2">
                              {question.options.map((option, index) => (
                                <label
                                  key={index}
                                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all flex-1 min-w-[150px] ${
                                    answers.find(a => a.questionId === question.id)?.answer === index
                                      ? 'bg-brand-orange/10 border border-brand-orange/30'
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
                  </div>
                );
              })}
            </div>
            
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-sm text-foreground/70">
                  {answers.length} of {scctQuestions.length} questions answered
                </p>
              </div>
              
              <Button 
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white"
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

export default SCCTAssessment;
