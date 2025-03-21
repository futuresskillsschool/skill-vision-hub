
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
  options: {
    value: string;
    label: string;
    type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  }[];
};

// Define all questions for the assessment
const riasecQuestions: RIASECQuestion[] = [
  {
    id: 1,
    question: "Which of these would you rather do on the weekend?",
    options: [
      { value: 'a', label: 'Build something with LEGOs or help fix something around the house.', type: 'R' },
      { value: 'b', label: 'Play a puzzle video game or read a book about science.', type: 'I' },
      { value: 'c', label: 'Draw a picture or listen to your favorite music.', type: 'A' },
      { value: 'd', label: 'Play a game with your friends or help someone with their homework.', type: 'S' },
      { value: 'e', label: 'Plan a fun activity for your friends to do together.', type: 'E' },
      { value: 'f', label: 'Make a list of your favorite things or organize your room.', type: 'C' },
    ],
  },
  {
    id: 2,
    question: "In school, which of these classes do you like best?",
    options: [
      { value: 'a', label: 'Shop, gym, or anything where you can build or move.', type: 'R' },
      { value: 'b', label: 'Science or math.', type: 'I' },
      { value: 'c', label: 'Art or music.', type: 'A' },
      { value: 'd', label: 'Social studies or any class where you work with others.', type: 'S' },
      { value: 'e', label: 'Clubs where you can lead or organize things.', type: 'E' },
      { value: 'f', label: 'Classes where things are organized and there are clear rules.', type: 'C' },
    ],
  },
  {
    id: 3,
    question: "If you had a question about something, would you rather...?",
    options: [
      { value: 'a', label: 'Try to figure it out by trying different things.', type: 'R' },
      { value: 'b', label: 'Look it up in a book or online to find the answer.', type: 'I' },
      { value: 'c', label: 'Think about it in a creative or imaginative way.', type: 'A' },
      { value: 'd', label: 'Ask a friend or teacher what they think.', type: 'S' },
      { value: 'e', label: 'Try to convince others of your idea about it.', type: 'E' },
      { value: 'f', label: 'Make a list of possible answers and check them one by one.', type: 'C' },
    ],
  },
  {
    id: 4,
    question: "Which of these would you find more interesting to learn about?",
    options: [
      { value: 'a', label: 'How machines work.', type: 'R' },
      { value: 'b', label: 'How the human body works.', type: 'I' },
      { value: 'c', label: 'How to draw or play an instrument.', type: 'A' },
      { value: 'd', label: 'Why people act the way they do.', type: 'S' },
      { value: 'e', label: 'How to start your own business.', type: 'E' },
      { value: 'f', label: 'How computers organize information.', type: 'C' },
    ],
  },
  {
    id: 5,
    question: "If you were doing a project for school, would you rather...?",
    options: [
      { value: 'a', label: 'Make something with your hands.', type: 'R' },
      { value: 'b', label: 'Do research and write a report.', type: 'I' },
      { value: 'c', label: 'Draw a picture, write a story, or make a video.', type: 'A' },
      { value: 'd', label: 'Work with a group and share ideas.', type: 'S' },
      { value: 'e', label: 'Be in charge of the project and tell everyone what to do.', type: 'E' },
      { value: 'f', label: 'Make sure everything is neat and organized for the project.', type: 'C' },
    ],
  },
  {
    id: 6,
    question: "Which of these sounds like the most fun after school activity?",
    options: [
      { value: 'a', label: 'Joining a club where you build things.', type: 'R' },
      { value: 'b', label: 'Being part of a science or math club.', type: 'I' },
      { value: 'c', label: 'Taking an art, music, or drama class.', type: 'A' },
      { value: 'd', label: 'Volunteering to help others.', type: 'S' },
      { value: 'e', label: 'Starting your own club or organizing events.', type: 'E' },
      { value: 'f', label: 'Helping the school office with organizing things.', type: 'C' },
    ],
  },
  {
    id: 7,
    question: "When your friend is feeling sad, what do you usually do?",
    options: [
      { value: 'a', label: 'Try to help them fix the problem if you can.', type: 'R' },
      { value: 'b', label: 'Try to understand why they are sad.', type: 'I' },
      { value: 'c', label: 'Try to cheer them up with something creative or fun.', type: 'A' },
      { value: 'd', label: 'Talk to them and listen to how they feel.', type: 'S' },
      { value: 'e', label: 'Try to find a solution or get help from someone else.', type: 'E' },
      { value: 'f', label: 'Make sure they know you are there for them consistently.', type: 'C' },
    ],
  },
  {
    id: 8,
    question: "In a group, what do you usually enjoy doing most?",
    options: [
      { value: 'a', label: 'Working together to build or create something.', type: 'R' },
      { value: 'b', label: 'Discussing ideas and learning from each other.', type: 'I' },
      { value: 'c', label: 'Coming up with creative ideas and having fun.', type: 'A' },
      { value: 'd', label: 'Making sure everyone feels included and happy.', type: 'S' },
      { value: 'e', label: 'Taking charge and helping the group decide what to do.', type: 'E' },
      { value: 'f', label: 'Making sure everything is organized and runs smoothly.', type: 'C' },
    ],
  },
  {
    id: 9,
    question: "If you were organizing a class party, which job would you want?",
    options: [
      { value: 'a', label: 'Setting up the decorations and games.', type: 'R' },
      { value: 'b', label: 'Finding out what kind of food and drinks people like.', type: 'I' },
      { value: 'c', label: 'Making the invitations and decorations look cool.', type: 'A' },
      { value: 'd', label: 'Talking to everyone and getting them excited about the party.', type: 'S' },
      { value: 'e', label: 'Being in charge of planning the whole party.', type: 'E' },
      { value: 'f', label: 'Keeping track of who is coming and what supplies are needed.', type: 'C' },
    ],
  },
  {
    id: 10,
    question: "If you wanted to start a small project with friends, what would you do first?",
    options: [
      { value: 'a', label: 'Think about what you need to build or make.', type: 'R' },
      { value: 'b', label: 'Research what kind of project would be interesting.', type: 'I' },
      { value: 'c', label: 'Come up with a creative idea for the project.', type: 'A' },
      { value: 'd', label: 'Talk to your friends and see if they want to join.', type: 'S' },
      { value: 'e', label: 'Try to get everyone excited about your idea and plan it out.', type: 'E' },
      { value: 'f', label: 'Make a list of all the steps you need to take.', type: 'C' },
    ],
  },
  {
    id: 11,
    question: "Which of these describes you best?",
    options: [
      { value: 'a', label: 'I like to work with my hands.', type: 'R' },
      { value: 'b', label: 'I like to figure things out.', type: 'I' },
      { value: 'c', label: 'I like to create new things.', type: 'A' },
      { value: 'd', label: 'I like to help people.', type: 'S' },
      { value: 'e', label: 'I like to be in charge.', type: 'E' },
      { value: 'f', label: 'I like things to be organized.', type: 'C' },
    ],
  },
  {
    id: 12,
    question: "When you finish a task, what's most important to you?",
    options: [
      { value: 'a', label: 'That you made something real or useful.', type: 'R' },
      { value: 'b', label: 'That you learned something new or solved a problem.', type: 'I' },
      { value: 'c', label: 'That you made something that looks or sounds good.', type: 'A' },
      { value: 'd', label: 'That you helped someone or made them happy.', type: 'S' },
      { value: 'e', label: 'That you got it done and maybe even led the way.', type: 'E' },
      { value: 'f', label: 'That you followed all the instructions and did it correctly.', type: 'C' },
    ],
  },
];

type Answer = {
  questionId: number;
  answer: string;
  type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
};

const RIASECAssessment = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAnswerSelect = (questionId: number, answer: string, type: 'R' | 'I' | 'A' | 'S' | 'E' | 'C') => {
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

  const handleSubmit = () => {
    // Calculate RIASEC scores
    const scores = {
      R: answers.filter(a => a.type === 'R').length,
      I: answers.filter(a => a.type === 'I').length,
      A: answers.filter(a => a.type === 'A').length,
      S: answers.filter(a => a.type === 'S').length,
      E: answers.filter(a => a.type === 'E').length,
      C: answers.filter(a => a.type === 'C').length,
    };
    
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
              This assessment will help you understand your personality type according to the RIASEC model.
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
              <p>For each question, choose the answer that sounds most like you or what you would enjoy doing the most.</p>
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
                      const selectedOption = question.options.find(opt => opt.value === value);
                      if (selectedOption) {
                        handleAnswerSelect(question.id, value, selectedOption.type);
                      }
                    }}
                  >
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start p-4 rounded-lg cursor-pointer transition-all ${
                          answers.find(a => a.questionId === question.id)?.answer === option.value
                            ? 'bg-brand-purple/10 border border-brand-purple/30'
                            : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        <RadioGroupItem 
                          value={option.value} 
                          id={`q${question.id}-${option.value}`} 
                          className="mt-1 mr-3"
                        />
                        <div>
                          <span className="font-medium">{option.label}</span>
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
