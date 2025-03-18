import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Heart, ArrowRight, Brain, BookOpen, PenTool, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types for the EQ results
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

// Define the profile types and their descriptions
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

const profiles: Record<string, EQProfile> = {
  'empathetic': {
    title: 'Empathetic Explorer',
    subtitle: 'High Emotional Intelligence',
    description: "You demonstrate strong emotional intelligence! You're likely good at understanding and managing your own emotions, and you show empathy and consideration for others. You handle challenging situations with maturity and find healthy ways to cope with stress.",
    icon: <Sparkles className="h-8 w-8" />,
    color: 'bg-brand-purple text-white',
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
    color: 'bg-brand-blue text-white',
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
    color: 'bg-brand-orange text-white',
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
    color: 'bg-brand-green text-white',
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
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get the results data from location state
    const state = location.state as EQResultsProps | null;
    
    if (!state || state.totalScore === undefined) {
      // No results data, navigate back to the assessment
      navigate('/assessment/eq-navigator');
      return;
    }
    
    // Determine profile based on score
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
  }, [location, navigate]);

  const calculatePercentage = (totalScore: number) => {
    // Maximum possible score is 40
    return Math.round((totalScore / 40) * 100);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-brand-purple">Loading your results...</div>
        </div>
        <Footer />
      </div>
    );
  }

  const scoreData = location.state as EQResultsProps;
  const scorePercentage = calculatePercentage(scoreData.totalScore);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header Section */}
            <div className={cn(
              "rounded-xl p-8 mb-8 text-center",
              profile.color
            )}>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4"
              >
                {profile.icon}
              </motion.div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.title}</h1>
              <p className="text-xl opacity-90 mb-4">{profile.subtitle}</p>
              
              <div className="flex justify-center items-center gap-6 mt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">{scoreData.totalScore}</div>
                  <div className="text-sm opacity-80">Score</div>
                </div>
                
                <div className="h-12 w-px bg-white/30"></div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold">{scorePercentage}%</div>
                  <div className="text-sm opacity-80">Percentage</div>
                </div>
                
                <div className="h-12 w-px bg-white/30"></div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold">{scoreRange}</div>
                  <div className="text-sm opacity-80">Range</div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-card mb-8"
            >
              <h2 className="text-2xl font-semibold mb-4">Your EQ Profile</h2>
              <p className="text-foreground/80 text-lg">{profile.description}</p>
            </motion.div>
            
            {/* Strengths Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-card mb-8"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center mr-3">
                  <Sparkles className="h-5 w-5 text-brand-purple" />
                </div>
                <h2 className="text-2xl font-semibold">Your Strengths</h2>
              </div>
              
              <p className="text-foreground/80 mb-4">{profile.strengthsIntro}</p>
              
              <ul className="space-y-3">
                {profile.strengths.map((strength, index) => (
                  <li key={index} className="flex">
                    <span className="text-brand-purple mr-2">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Growth Areas Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-card mb-8"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center mr-3">
                  <ArrowRight className="h-5 w-5 text-brand-orange" />
                </div>
                <h2 className="text-2xl font-semibold">Growth Opportunities</h2>
              </div>
              
              <p className="text-foreground/80 mb-4">{profile.growthIntro}</p>
              
              <div className="space-y-4">
                {profile.growthAreas.map((area, index) => (
                  <Card key={index} className="p-4 border border-border/40">
                    <h3 className="font-semibold text-lg mb-1">{area.area}</h3>
                    <p className="text-foreground/70">
                      <span className="text-brand-purple font-medium">Try this: </span> 
                      {area.tip}
                    </p>
                  </Card>
                ))}
              </div>
            </motion.div>
            
            {/* Resources Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-card mb-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center mr-3">
                  <BookOpen className="h-5 w-5 text-brand-green" />
                </div>
                <h2 className="text-2xl font-semibold">Helpful Resources</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.resources.map((resource, index) => (
                  <Card key={index} className="p-4 border border-border/40 hover:border-brand-purple/50 hover:shadow-md transition-all">
                    <div className="mb-3 text-brand-purple">
                      {resource.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                    <p className="text-sm text-foreground/70">{resource.description}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
              
              <Button 
                onClick={() => navigate('/eq-navigator')}
                className="bg-brand-purple hover:bg-brand-dark-purple"
              >
                Take Another Assessment
              </Button>
            </div>

          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorResults;

