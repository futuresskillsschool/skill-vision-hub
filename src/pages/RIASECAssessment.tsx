
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define the structure of a question
interface Question {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  }[];
}

// Define RIASEC questions
const riasecQuestions: Question[] = [
  // Question 1
  {
    id: 1,
    question: "Which of these would you rather do on the weekend?",
    options: [
      { id: "1a", text: "Build something with LEGOs or help fix something around the house.", type: "R" },
      { id: "1b", text: "Play a puzzle video game or read a book about science.", type: "I" },
      { id: "1c", text: "Draw a picture or listen to your favorite music.", type: "A" },
      { id: "1d", text: "Play a game with your friends or help someone with their homework.", type: "S" },
      { id: "1e", text: "Plan a fun activity for your friends to do together.", type: "E" },
      { id: "1f", text: "Make a list of your favorite things or organize your room.", type: "C" }
    ]
  },
  // Question 2
  {
    id: 2,
    question: "In school, which of these classes do you like best?",
    options: [
      { id: "2a", text: "Shop, gym, or anything where you can build or move.", type: "R" },
      { id: "2b", text: "Science or math.", type: "I" },
      { id: "2c", text: "Art or music.", type: "A" },
      { id: "2d", text: "Social studies or any class where you work with others.", type: "S" },
      { id: "2e", text: "Clubs where you can lead or organize things.", type: "E" },
      { id: "2f", text: "Classes where things are organized and there are clear rules.", type: "C" }
    ]
  },
  // Question 3
  {
    id: 3,
    question: "If you had a question about something, would you rather...?",
    options: [
      { id: "3a", text: "Try to figure it out by trying different things.", type: "R" },
      { id: "3b", text: "Look it up in a book or online to find the answer.", type: "I" },
      { id: "3c", text: "Think about it in a creative or imaginative way.", type: "A" },
      { id: "3d", text: "Ask a friend or teacher what they think.", type: "S" },
      { id: "3e", text: "Try to convince others of your idea about it.", type: "E" },
      { id: "3f", text: "Make a list of possible answers and check them one by one.", type: "C" }
    ]
  },
  // Question 4
  {
    id: 4,
    question: "Which of these would you find more interesting to learn about?",
    options: [
      { id: "4a", text: "How machines work.", type: "R" },
      { id: "4b", text: "How the human body works.", type: "I" },
      { id: "4c", text: "How to draw or play an instrument.", type: "A" },
      { id: "4d", text: "Why people act the way they do.", type: "S" },
      { id: "4e", text: "How to start your own business.", type: "E" },
      { id: "4f", text: "How computers organize information.", type: "C" }
    ]
  },
  // Question 5
  {
    id: 5,
    question: "If you were doing a project for school, would you rather...?",
    options: [
      { id: "5a", text: "Make something with your hands.", type: "R" },
      { id: "5b", text: "Do research and write a report.", type: "I" },
      { id: "5c", text: "Draw a picture, write a story, or make a video.", type: "A" },
      { id: "5d", text: "Work with a group and share ideas.", type: "S" },
      { id: "5e", text: "Be in charge of the project and tell everyone what to do.", type: "E" },
      { id: "5f", text: "Make sure everything is neat and organized for the project.", type: "C" }
    ]
  },
  // Question 6
  {
    id: 6,
    question: "Which of these sounds like the most fun after school activity?",
    options: [
      { id: "6a", text: "Joining a club where you build things.", type: "R" },
      { id: "6b", text: "Being part of a science or math club.", type: "I" },
      { id: "6c", text: "Taking an art, music, or drama class.", type: "A" },
      { id: "6d", text: "Volunteering to help others.", type: "S" },
      { id: "6e", text: "Starting your own club or organizing events.", type: "E" },
      { id: "6f", text: "Helping the school office with organizing things.", type: "C" }
    ]
  },
  // Question 7
  {
    id: 7,
    question: "When your friend is feeling sad, what do you usually do?",
    options: [
      { id: "7a", text: "Try to help them fix the problem if you can.", type: "R" },
      { id: "7b", text: "Try to understand why they are sad.", type: "I" },
      { id: "7c", text: "Try to cheer them up with something creative or fun.", type: "A" },
      { id: "7d", text: "Talk to them and listen to how they feel.", type: "S" },
      { id: "7e", text: "Try to find a solution or get help from someone else.", type: "E" },
      { id: "7f", text: "Make sure they know you are there for them consistently.", type: "C" }
    ]
  },
  // Question 8
  {
    id: 8,
    question: "In a group, what do you usually enjoy doing most?",
    options: [
      { id: "8a", text: "Working together to build or create something.", type: "R" },
      { id: "8b", text: "Discussing ideas and learning from each other.", type: "I" },
      { id: "8c", text: "Coming up with creative ideas and having fun.", type: "A" },
      { id: "8d", text: "Making sure everyone feels included and happy.", type: "S" },
      { id: "8e", text: "Taking charge and helping the group decide what to do.", type: "E" },
      { id: "8f", text: "Making sure everything is organized and runs smoothly.", type: "C" }
    ]
  },
  // Question 9
  {
    id: 9,
    question: "If you were organizing a class party, which job would you want?",
    options: [
      { id: "9a", text: "Setting up the decorations and games.", type: "R" },
      { id: "9b", text: "Finding out what kind of food and drinks people like.", type: "I" },
      { id: "9c", text: "Making the invitations and decorations look cool.", type: "A" },
      { id: "9d", text: "Talking to everyone and getting them excited about the party.", type: "S" },
      { id: "9e", text: "Being in charge of planning the whole party.", type: "E" },
      { id: "9f", text: "Keeping track of who is coming and what supplies are needed.", type: "C" }
    ]
  },
  // Question 10
  {
    id: 10,
    question: "If you wanted to start a small project with friends, what would you do first?",
    options: [
      { id: "10a", text: "Think about what you need to build or make.", type: "R" },
      { id: "10b", text: "Research what kind of project would be interesting.", type: "I" },
      { id: "10c", text: "Come up with a creative idea for the project.", type: "A" },
      { id: "10d", text: "Talk to your friends and see if they want to join.", type: "S" },
      { id: "10e", text: "Try to get everyone excited about your idea and plan it out.", type: "E" },
      { id: "10f", text: "Make a list of all the steps you need to take.", type: "C" }
    ]
  },
  // Question 11
  {
    id: 11,
    question: "Which of these describes you best?",
    options: [
      { id: "11a", text: "I like to work with my hands.", type: "R" },
      { id: "11b", text: "I like to figure things out.", type: "I" },
      { id: "11c", text: "I like to create new things.", type: "A" },
      { id: "11d", text: "I like to help people.", type: "S" },
      { id: "11e", text: "I like to be in charge.", type: "E" },
      { id: "11f", text: "I like things to be organized.", type: "C" }
    ]
  },
  // Question 12
  {
    id: 12,
    question: "When you finish a task, what's most important to you?",
    options: [
      { id: "12a", text: "That you made something real or useful.", type: "R" },
      { id: "12b", text: "That you learned something new or solved a problem.", type: "I" },
      { id: "12c", text: "That you made something that looks or sounds good.", type: "A" },
      { id: "12d", text: "That you helped someone or made them happy.", type: "S" },
      { id: "12e", text: "That you got it done and maybe even led the way.", type: "E" },
      { id: "12f", text: "That you followed all the instructions and did it correctly.", type: "C" }
    ]
  }
];

const RIASECAssessment = () => {
  const navigate = useNavigate();
  const { user, storeAssessmentResult } = useAuth();
  const { toast } = useToast();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(Array(riasecQuestions.length).fill(''));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [riasecScores, setRiasecScores] = useState({
    R: 0, // Realistic
    I: 0, // Investigative
    A: 0, // Artistic
    S: 0, // Social
    E: 0, // Enterprising
    C: 0  // Conventional
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  const handleOptionSelect = (optionId: string) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = optionId;
    setSelectedOptions(newSelectedOptions);
  };

  const handleNext = () => {
    if (currentQuestionIndex < riasecQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    selectedOptions.forEach((optionId, qIndex) => {
      const question = riasecQuestions[qIndex];
      const selectedOption = question.options.find(opt => opt.id === optionId);
      
      if (selectedOption) {
        scores[selectedOption.type]++;
      }
    });
    
    setRiasecScores(scores);
    setIsComplete(true);
    
    // Save results to Supabase if the user is logged in
    if (user) {
      const resultData = {
        riasecScores: scores,
        answers: selectedOptions.map((optionId, index) => {
          const question = riasecQuestions[index];
          const option = question.options.find(opt => opt.id === optionId);
          return {
            questionId: question.id,
            question: question.question,
            answer: option?.text,
            type: option?.type
          };
        })
      };
      
      storeAssessmentResult('riasec', resultData);
    } else {
      toast({
        title: "Not logged in",
        description: "Sign in to save your results for future reference.",
      });
    }
  };

  const getPrimaryTypes = () => {
    const scores = Object.entries(riasecScores);
    scores.sort((a, b) => b[1] - a[1]);
    return scores.slice(0, 3).map(item => item[0]);
  };

  const typeDescriptions: Record<string, { title: string, description: string, careers: string[] }> = {
    R: {
      title: "Realistic (Doer)",
      description: "You enjoy working with your hands, tools, machines, or animals. You prefer activities that are practical, physical, and concrete rather than abstract or theoretical.",
      careers: ["Engineer", "Mechanic", "Chef", "Carpenter", "Electrician", "Pilot", "Athlete", "Farmer"]
    },
    I: {
      title: "Investigative (Thinker)",
      description: "You like to observe, learn, investigate, analyze, evaluate, or solve problems. You prefer activities that involve thinking, organizing, and understanding rather than feeling or persuading.",
      careers: ["Scientist", "Doctor", "Researcher", "Computer Programmer", "Mathematician", "Detective", "Analyst", "Engineer"]
    },
    A: {
      title: "Artistic (Creator)",
      description: "You're creative, intuitive, and original. You prefer activities that are unstructured and allow for self-expression, creativity, and the use of imagination.",
      careers: ["Artist", "Writer", "Musician", "Actor", "Designer", "Photographer", "Architect", "Fashion Designer"]
    },
    S: {
      title: "Social (Helper)",
      description: "You enjoy working with and helping people. You prefer activities that involve interacting with others, teaching, or helping them improve their well-being.",
      careers: ["Teacher", "Counselor", "Nurse", "Social Worker", "Therapist", "Human Resources", "Coach", "Customer Service"]
    },
    E: {
      title: "Enterprising (Persuader)",
      description: "You like working with people to lead, persuade, or manage them for organizational goals or economic gain. You prefer activities that involve starting up and carrying out projects.",
      careers: ["Manager", "Entrepreneur", "Lawyer", "Salesperson", "Marketing Executive", "Real Estate Agent", "Politician", "Business Owner"]
    },
    C: {
      title: "Conventional (Organizer)",
      description: "You enjoy working with data, details, and processes in a structured way. You prefer activities that involve organizing, following procedures, and working with numbers or records.",
      careers: ["Accountant", "Administrative Assistant", "Financial Analyst", "Banker", "Editor", "Librarian", "Database Manager", "Office Manager"]
    }
  };

  const getCareerSuggestions = () => {
    const primaryTypes = getPrimaryTypes();
    let careers: string[] = [];
    
    primaryTypes.forEach(type => {
      careers = [...careers, ...typeDescriptions[type].careers.slice(0, 3)];
    });
    
    return [...new Set(careers)].slice(0, 10); // Remove duplicates and limit to 10
  };

  const currentQuestion = riasecQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / riasecQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === riasecQuestions.length - 1;
  const isOptionSelected = selectedOptions[currentQuestionIndex] !== '';

  if (isComplete) {
    const primaryTypes = getPrimaryTypes();
    const careerSuggestions = getCareerSuggestions();
    
    const handleGoToResults = () => {
      navigate('/dashboard', { state: { assessmentCompleted: 'riasec' } });
    };

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-8">Your RIASEC Assessment Results</h1>
              
              <Card className="mb-8 p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">Your Holland Code Profile</h2>
                <p className="text-foreground/80 mb-6">
                  Based on your responses, your primary Holland Code types are:
                </p>
                
                <div className="mb-6">
                  {primaryTypes.map((type, index) => (
                    <div key={type} className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-brand-purple">
                        {index + 1}. {typeDescriptions[type].title}
                      </h3>
                      <p className="text-foreground/80 mb-2">{typeDescriptions[type].description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-3">Your RIASEC Score Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(riasecScores).map(([type, score]) => (
                      <div key={type} className="flex items-center">
                        <span className="w-32 font-medium">{typeDescriptions[type].title.split(" ")[0]}:</span>
                        <div className="flex-grow flex items-center">
                          <div className="relative w-full bg-gray-200 h-4 rounded-full">
                            <div 
                              className="absolute top-0 left-0 h-4 rounded-full bg-brand-purple"
                              style={{ width: `${(score / 12) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm">{score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              <Card className="mb-8 p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">Potential Career Matches</h2>
                <p className="text-foreground/80 mb-6">
                  These career paths may align well with your Holland Code profile:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerSuggestions.map((career, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="mb-8 p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">What To Do Next</h2>
                <p className="text-foreground/80 mb-6">
                  Now that you have your RIASEC results, here are some suggested next steps:
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                    <span>Research careers that match your profile in more depth</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                    <span>Talk to a career counselor about your results</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                    <span>Explore educational paths that lead to careers matching your interests</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                    <span>Try job shadowing or internships in fields that interest you</span>
                  </li>
                </ul>
              </Card>
              
              <div className="flex justify-center">
                <Button onClick={handleGoToResults} className="button-primary">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-2">RIASEC Model Assessment</h1>
              <p className="text-foreground/70">Question {currentQuestionIndex + 1} of {riasecQuestions.length}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
                <div 
                  className="bg-brand-purple h-2 rounded-full transition-all" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <Card className="mb-8 p-6 md:p-8">
              <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>
              
              <RadioGroup 
                value={selectedOptions[currentQuestionIndex]} 
                onValueChange={handleOptionSelect}
                className="space-y-4"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                    <Label htmlFor={option.id} className="flex-grow cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>
            
            <div className="flex justify-between">
              <Button 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              
              {isLastQuestion ? (
                <Button 
                  onClick={calculateResults}
                  disabled={!isOptionSelected}
                  className="button-primary"
                >
                  See Results
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  disabled={!isOptionSelected}
                  className="button-primary"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RIASECAssessment;
