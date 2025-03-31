import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Heart, ArrowRight, Brain, BookOpen, PenTool, Home, Download, Check, Award, ArrowLeft, Info, User, School } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface EQResultsProps {
  totalScore: number;
  selectedOptions: string[];
  questions: Array<{
    id: number;
    scenario: string;
    options: Array<{
      id: string;
      text: string;
      score: number;
    }>;
  }>;
}

interface EQProfile {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  strengthsIntro: string;
  strengths: string[];
  growthIntro: string;
  growthAreas: Array<{
    area: string;
    tip: string;
  }>;
  resources: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
}

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const profiles: Record<string, EQProfile> = {
  'empathetic': {
    title: 'Empathetic Explorer',
    subtitle: 'High Emotional Intelligence',
    description: "You demonstrate strong emotional intelligence! You're likely good at understanding and managing your own emotions, and you show empathy and consideration for others. You handle challenging situations with maturity and find healthy ways to cope with stress.",
    icon: <Sparkles className="h-8 w-8" />,
    color: 'bg-purple-400 text-white',
    strengthsIntro: "Here's what you're great at:",
    strengths: [
      'Understanding and processing your emotions in healthy ways',
      'Showing empathy and supporting others during difficult times',
      'Handling conflicts constructively and seeking win-win solutions',
      'Taking feedback well and using it for personal growth'
    ],
    growthIntro: "Even with strong EQ, there's always room to grow:",
    growthAreas: [
      {
        area: 'Continue developing active listening skills',
        tip: 'Practice being fully present in conversations without planning what to say next'
      },
      {
        area: 'Build resilience for more challenging situations',
        tip: 'Reflect on past challenges and identify what helped you overcome them'
      }
    ],
    resources: [
      {
        title: 'Mindfulness Practices',
        description: 'Daily meditation can further enhance your emotional awareness',
        icon: <Brain />
      },
      {
        title: 'Advanced Empathy Techniques',
        description: 'Learn deeper approaches to understanding complex emotions',
        icon: <Heart />
      },
      {
        title: 'Leadership & Emotional Intelligence',
        description: 'Develop skills to help others with their emotional growth',
        icon: <BookOpen />
      }
    ]
  },
  'developing': {
    title: 'Developing Navigator',
    subtitle: 'Growing Emotional Intelligence',
    description: "You have a good foundation in emotional intelligence, and you're developing your skills in several areas. You show some self-awareness and empathy, but there's room for growth in managing your emotions and navigating social situations.",
    icon: <PenTool className="h-8 w-8" />,
    color: 'bg-blue-300 text-white',
    strengthsIntro: "Your notable strengths:",
    strengths: [
      'Recognizing your own emotions in many situations',
      'Showing empathy in certain contexts',
      'Working toward better communication during conflicts',
      'Being open to feedback and personal growth'
    ],
    growthIntro: "Areas you can focus on developing:",
    growthAreas: [
      {
        area: 'Emotional regulation during stress',
        tip: 'Practice taking deep breaths and naming your emotions when feeling overwhelmed'
      },
      {
        area: 'Active listening skills',
        tip: 'Try to truly understand others before responding by asking clarifying questions'
      },
      {
        area: 'Conflict resolution approaches',
        tip: 'Focus on finding win-win solutions rather than proving your point'
      }
    ],
    resources: [
      {
        title: 'Emotional Awareness Journal',
        description: 'Track your emotions daily to identify patterns and triggers',
        icon: <PenTool />
      },
      {
        title: 'Basic Mindfulness Practices',
        description: 'Simple meditation exercises to increase emotional awareness',
        icon: <Brain />
      },
      {
        title: 'Communication Skills Development',
        description: 'Learn techniques for more effective and empathetic conversations',
        icon: <BookOpen />
      }
    ]
  },
  'emerging': {
    title: 'Emerging Explorer',
    subtitle: 'Developing Emotional Intelligence',
    description: "Emotional intelligence is a skill that can be learned and strengthened, and you're at the beginning of your journey. You might sometimes find it challenging to understand or manage your emotions, or to see things from others' perspectives. Don't be discouraged!",
    icon: <Heart className="h-8 w-8" />,
    color: 'bg-yellow-300 text-white',
    strengthsIntro: "Here's what you can build on:",
    strengths: [
      'Your willingness to learn and grow emotionally',
      'Moments when you do recognize your own emotions',
      "Times when you've shown care for others"
    ],
    growthIntro: "Focus areas for your development:",
    growthAreas: [
      {
        area: 'Emotional self-awareness',
        tip: 'Start by simply naming your emotions throughout the day - happy, sad, frustrated, etc.'
      },
      {
        area: 'Recognizing emotions in others',
        tip: 'Pay attention to facial expressions, tone of voice, and body language when talking to friends'
      },
      {
        area: 'Healthy emotional expression',
        tip: 'Find safe ways to express feelings like journaling, talking to trusted people, or creative activities'
      },
      {
        area: 'Developing empathy',
        tip: 'Practice asking yourself "How might they be feeling right now?" when interacting with others'
      }
    ],
    resources: [
      {
        title: 'Emotions Vocabulary Builder',
        description: 'Learn to identify and name a wider range of feelings',
        icon: <BookOpen />
      },
      {
        title: 'Basic Emotion Regulation',
        description: 'Simple techniques to help manage strong feelings',
        icon: <Brain />
      },
      {
        title: "Beginner's Guide to Empathy",
        description: "Easy exercises to practice seeing others' perspectives",
        icon: <Heart />
      }
    ]
  },
  'compass': {
    title: 'Compass Explorer',
    subtitle: 'Beginning Your EQ Journey',
    description: "It appears that you could benefit from additional support in developing your emotional intelligence. This assessment is just a starting point, and it's important to remember that everyone can learn and grow. With some guidance and practice, you can develop these important skills!",
    icon: <Brain className="h-8 w-8" />,
    color: 'bg-green-300 text-white',
    strengthsIntro: "Remember that everyone has EQ strengths:",
    strengths: [
      'Taking this assessment shows your interest in self-improvement',
      'You have the capacity to develop your emotional intelligence',
      'Everyone starts somewhere - this is your beginning'
    ],
    growthIntro: "Key areas to focus on with support:",
    growthAreas: [
      {
        area: 'Identifying basic emotions',
        tip: 'Start with recognizing when you feel happy, sad, angry, or scared'
      },
      {
        area: 'Finding healthy ways to express feelings',
        tip: 'Talk to a trusted adult or friend about your emotions instead of keeping them inside'
      },
      {
        area: 'Understanding how your actions affect others',
        tip: 'Before reacting, pause and ask "How might this make the other person feel?"'
      },
      {
        area: 'Managing strong emotions',
        tip: 'Learn the "stop and breathe" technique when you feel overwhelmed'
      }
    ],
    resources: [
      {
        title: 'Teen Emotional Support Resources',
        description: 'Find helpful resources designed specifically for young people',
        icon: <BookOpen />
      },
      {
        title: 'Basic Emotions Guide',
        description: 'Learn to recognize and name your feelings',
        icon: <Heart />
      },
      {
        title: 'Talking to Adults About Feelings',
        description: 'Tips for having conversations about emotions with parents, teachers, or counselors',
        icon: <PenTool />
      }
    ]
  }
};

const EQNavigatorResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EQProfile | null>(null);
  const [scoreRange, setScoreRange] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const { user } = useAuth();
  const [results, setResults] = useState<any | null>(location.state || null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const state = location.state as EQResultsProps | null;
    
    if (!state || state.totalScore === undefined) {
      navigate('/assessment/eq-navigator');
      return;
    }
    
    const { totalScore } = state;
    let selectedProfile: EQProfile;
    let range: string;
    
    if (totalScore >= 32) {
      selectedProfile = profiles.empathetic;
      range = '32-40';
      setScoreRange('32-40');
    } else if (totalScore >= 24) {
      selectedProfile = profiles.developing;
      range = '24-31';
      setScoreRange('24-31');
    } else if (totalScore >= 16) {
      selectedProfile = profiles.emerging;
      range = '16-23';
      setScoreRange('16-23');
    } else {
      selectedProfile = profiles.compass;
      range = 'Below 16';
      setScoreRange('Below 16');
    }
    
    setProfile(selectedProfile);
    setIsLoading(false);

    if (!results && user) {
      // This would be implemented if we had a function to fetch results
      // fetchUserResults('career-vision').then(setResults);
    }
    
    // Fetch student details if we have a studentId in the results state
    const fetchStudentDetails = async () => {
      if (results && results.studentId) {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', results.studentId)
            .single();
            
          if (error) {
            console.error('Error fetching student details:', error);
            return;
          }
          
          if (data) {
            setStudentDetails(data as StudentDetails);
          }
        } catch (error) {
          console.error('Error in student details fetch:', error);
        }
      }
    };
    
    fetchStudentDetails();
  }, [location, navigate, user, results]);

  const calculatePercentage = (totalScore: number) => {
    return Math.round((totalScore / 40) * 100);
  };

  const downloadAsPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      // Create a cloned element for PDF generation
      const originalContent = reportRef.current;
      const contentClone = originalContent.cloneNode(true) as HTMLElement;
      
      // Add styles for PDF generation
      contentClone.style.width = '800px';
      contentClone.style.padding = '40px';
      contentClone.style.backgroundColor = '#ffffff';
      contentClone.style.fontFamily = 'Arial, sans-serif';
      contentClone.style.color = '#333333';
      
      // Hide the element off-screen for rendering
      contentClone.style.position = 'fixed';
      contentClone.style.left = '-9999px';
      contentClone.style.top = '0';
      document.body.appendChild(contentClone);
      
      // Process all elements for proper PDF rendering
      const processElements = (element: HTMLElement) => {
        // Ensure all sections are visible
        element.style.display = 'block';
        element.style.overflow = 'visible';
        element.style.height = 'auto';
        element.style.maxHeight = 'none';
        
        // Fix SVG rendering
        const svgs = element.querySelectorAll('svg');
        svgs.forEach(svg => {
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          svg.style.display = 'block';
        });
        
        // Ensure text is visible
        const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
        textElements.forEach(el => {
          (el as HTMLElement).style.color = '#333333';
          (el as HTMLElement).style.fontFamily = 'Arial, sans-serif';
          (el as HTMLElement).style.fontSize = (el as HTMLElement).style.fontSize || '14px';
        });
        
        // Fix background colors
        const cards = element.querySelectorAll('.bg-white, .bg-purple-50, .bg-purple-100');
        cards.forEach(card => {
          (card as HTMLElement).style.backgroundColor = '#ffffff';
          (card as HTMLElement).style.border = '1px solid #e5e7eb';
          (card as HTMLElement).style.borderRadius = '8px';
          (card as HTMLElement).style.margin = '15px 0';
          (card as HTMLElement).style.padding = '15px';
        });
        
        // Process child elements
        Array.from(element.children).forEach(child => {
          processElements(child as HTMLElement);
        });
      };
      
      processElements(contentClone);
      
      // Render the content to canvas
      const canvas = await html2canvas(contentClone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      // Remove the cloned element
      document.body.removeChild(contentClone);
      
      // Create PDF from canvas
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Image dimensions and scaling
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.9;
      
      // Calculate pages
      const scaledImgHeight = imgHeight * ratio;
      const totalPages = Math.ceil(scaledImgHeight / (pdfHeight * 0.9));
      
      // Add each page
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        
        const srcY = (pdfHeight * 0.9 * i) / ratio;
        const sectionHeight = Math.min(imgHeight - srcY, (pdfHeight * 0.9) / ratio);
        
        // Fixed: Using the correct ImageOptions properties for jsPDF v3.0.1
        pdf.addImage({
          imageData: imgData,
          format: 'PNG',
          x: pdfWidth * 0.05, // 5% margin on left
          y: pdfHeight * 0.05, // 5% margin on top
          width: pdfWidth * 0.9, // 90% of page width
          height: (sectionHeight * ratio), // Scaled height for this section
          compression: 'FAST',
          rotation: 0
        });
      }
      
      // Save the PDF
      pdf.save('EQ-Navigator-Results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-t-purple-400 border-r-purple-300/30 border-b-purple-300/10 border-l-purple-300/30 rounded-full animate-spin"></div>
            <p className="text-purple-600 font-medium">Loading your results...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const scoreData = location.state as EQResultsProps;
  const scorePercentage = calculatePercentage(scoreData.totalScore);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mb-4 text-purple-500 hover:text-purple-600 -ml-3"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">Your EQ Navigator Results</h1>
                <p className="text-gray-600 max-w-2xl">
                  Explore your emotional intelligence profile and discover personalized insights to enhance your social and emotional skills.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={downloadAsPDF} 
                  variant="outline" 
                  className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Student Details Section */}
            {studentDetails && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-50 rounded-xl p-4 md:p-6 mb-6 border border-purple-100"
              >
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Student Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{studentDetails.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Class & Section</p>
                      <p className="font-medium">{studentDetails.class} - {studentDetails.section}</p>
                    </div>
                  </div>
                  <div className="flex items-center md:col-span-2">
                    <School className="h-5 w-5 text-purple-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">School</p>
                      <p className="font-medium">{studentDetails.school}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={reportRef} className="pdf-report">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Results Header */}
                <div className="rounded-xl p-8 mb-8 text-center relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 bg-white/20 backdrop-blur-sm"
                  >
                    <Heart className="h-12 w-12 text-white" />
                  </motion.div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile?.title}</h1>
                  <p className="text-xl text-white/90 mb-6">{profile?.subtitle}</p>
                  
                  <div className="mt-6">
                    <div className="w-36 h-36 mx-auto relative mb-6">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle 
                          className="text-white/20" 
                          cx="50" cy="50" r="40" 
                          strokeWidth="8" 
                          stroke="currentColor"
                          fill="none"
                        />
                        <circle 
                          className="text-white" 
                          cx="50" cy="50" r="40" 
                          strokeWidth="8" 
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - scorePercentage / 100)}`}
                          transform="rotate(-90 50 50)"
                        />
                        <text 
                          x="50" y="43" 
                          dominantBaseline="middle" 
                          textAnchor="middle"
                          className="fill-white text-2xl font-bold"
                        >
                          {scorePercentage}%
                        </text>
                        <text 
                          x="50" y="58" 
                          dominantBaseline="middle" 
                          textAnchor="middle"
                          className="fill-white/80 text-xs"
                        >
                          EQ Score
                        </text>
                      </svg>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                      <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                        <div className="text-2xl font-bold">{scoreData?.totalScore}</div>
                        <div className="text-xs text-white/80">Your Score</div>
                      </div>
                      
                      <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                        <div className="text-2xl font-bold">40</div>
                        <div className="text-xs text-white/80">Max Score</div>
                      </div>
                      
                      <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                        <div className="text-2xl font-bold">{scoreRange}</div>
                        <div className="text-xs text-white/80">Range</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* EQ Profile Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-white rounded-xl p-8 shadow-md mb-8 border border-gray-100"
                >
                  <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Award className="h-5 w-5 text-purple-500" />
                    </div>
                    Your EQ Profile
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{profile?.description}</p>
                  
                  {/* EQ Breakdown */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-medium mb-4 text-gray-800">Emotional Intelligence Breakdown</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Self-Awareness</span>
                          <span className="text-sm font-medium text-gray-700">{Math.round(scorePercentage * 0.9)}%</span>
                        </div>
                        <Progress 
                          value={scorePercentage * 0.9} 
                          className="h-2.5" 
                          indicatorClassName="bg-gradient-to-r from-purple-400 to-purple-500"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Self-Regulation</span>
                          <span className="text-sm font-medium text-gray-700">{Math.round(scorePercentage * 0.85)}%</span>
                        </div>
                        <Progress 
                          value={scorePercentage * 0.85} 
                          className="h-2.5" 
                          indicatorClassName="bg-gradient-to-r from-purple-400 to-purple-500"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Empathy</span>
                          <span className="text-sm font-medium text-gray-700">{Math.round(scorePercentage * 0.95)}%</span>
                        </div>
                        <Progress 
                          value={scorePercentage * 0.95} 
                          className="h-2.5" 
                          indicatorClassName="bg-gradient-to-r from-purple-400 to-purple-500"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Social Skills</span>
                          <span className="text-sm font-medium text-gray-700">{Math.round(scorePercentage * 0.8)}%</span>
                        </div>
                        <Progress 
                          value={scorePercentage * 0.8} 
                          className="h-2.5" 
                          indicatorClassName="bg-gradient-to-r from-purple-400 to-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-purple-50 border border-purple-100 rounded-lg flex items-start">
                      <div className="bg-purple-100 text-purple-600 p-2 rounded-full mr-3 flex-shrink-0">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">What This Means</h4>
                        <p className="text-gray-600 text-sm">
                          Your EQ score indicates your ability to recognize, understand, and manage emotions in yourself and others.
                          A higher score suggests stronger emotional intelligence, which contributes to better relationships, decision-making, and overall well-being.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Strengths Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-white rounded-xl p-8 shadow-md mb-8 border border-gray-100"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Your Strengths</h2>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{profile?.strengthsIntro}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile?.strengths.map((strength, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-start"
                      >
                        <div className="bg-purple-200 text-purple-700 rounded-full p-2 mr-3 mt-0.5 flex-shrink-0">
                          <Check className="h-4 w-4" />
                        </div>
                        <p className="text-gray-700">{strength}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Growth Opportunities Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-white rounded-xl p-8 shadow-md mb-8 border border-gray-100"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <ArrowRight className="h-5 w-5 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Growth Opportunities</h2>
                  </div>
                  
                  <p className="text-gray-700 mb-6">{profile?.growthIntro}</p>
                  
                  <div className="space-y-4">
                    {profile?.growthAreas.map((area, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <Card className="p-5 border border-gray-200 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-purple-50">
                          <h3 className="font-semibold text-lg mb-3 text-gray-800">{area.area}</h3>
                          <div className="flex items-start">
                            <div className="bg-purple-100 text-purple-500 rounded-full p-2 mr-3 mt-0.5 flex-shrink-0">
                              <ArrowRight className="h-4 w-4" />
                            </div>
                            <p className="text-gray-600">{area.tip}</p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Resources Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="bg-white rounded-xl p-8 shadow-md mb-8 border border-gray-100"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Helpful Resources</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {profile?.resources.map((resource, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <Card 
                          className="p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group h-full flex flex-col"
                        >
                          <div className="w-12 h-12 mb-4 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 group-hover:bg-purple-200 transition-colors">
                            {resource.icon}
                          </div>
                          <h3 className="font-semibold text-lg mb-1 text-gray-800">{resource.title}</h3>
                          <p className="text-sm text-gray-600 flex-grow">{resource.description}</p>
                          <div className="mt-4 pt-3 border-t border-gray-100 text-purple-500 font-medium text-sm flex items-center">
                            {/* Learn More <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" /> */}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
              
              <Button 
                onClick={() => navigate('/assessment/eq-navigator')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Take Another Assessment
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorResults;
