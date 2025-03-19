
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Rocket, Download, ArrowRight, Brain, BookOpen, PenTool, Home, Code, Palette, BarChart3, Briefcase, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Types for the pathway results
interface PathwayResultsProps {
  clusterScores: Record<string, number>;
  selectedOptions: number[];
}

// Define the profile types and their descriptions
interface CareerCluster {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  careers: Array<{
    title: string;
    description: string;
  }>;
}

const careerClusters: Record<string, CareerCluster> = {
  'tech-innovator': {
    id: 'tech-innovator',
    title: 'Tech Innovator & Builder',
    subtitle: 'The Future Architect: Building Tomorrow\'s World with Technology',
    description: "You are fascinated by how things work and love to create and fix them! You are likely drawn to building new technologies, software, and even robots. In the future, the world needs people like you to design and build the amazing tech we'll all use. This path is perfect if you enjoy problem-solving, coding, engineering, and bringing your innovative ideas to life.",
    icon: <Code className="h-8 w-8" />,
    color: 'bg-brand-purple text-white',
    careers: [
      {
        title: 'AI Solutions Architect',
        description: 'Design and build AI systems for businesses and organizations.'
      },
      {
        title: 'Robotics Engineer',
        description: 'Create and improve robots for various industries (healthcare, manufacturing, space exploration).'
      },
      {
        title: 'Virtual Reality/Augmented Reality Developer',
        description: 'Build immersive and interactive digital experiences.'
      },
      {
        title: 'Biotech Engineer',
        description: 'Use engineering principles to solve biological and medical problems, creating new healthcare technologies.'
      }
    ]
  },
  'digital-creator': {
    id: 'digital-creator',
    title: 'Digital Creator & Storyteller',
    subtitle: 'The Metaverse Maestro: Crafting Immersive Digital Worlds',
    description: "You have a creative soul and love expressing yourself through art, stories, music, videos, or games! You are likely interested in creating digital content and experiences that entertain and engage people. In the future, digital worlds and online experiences will be even more important, and we need talented creators to build them. This path is for you if you love art, design, storytelling, games, and using technology to create magic.",
    icon: <Palette className="h-8 w-8" />,
    color: 'bg-brand-blue text-white',
    careers: [
      {
        title: 'Metaverse Architect',
        description: 'Design and build virtual worlds and experiences in the metaverse.'
      },
      {
        title: 'Digital Content Strategist (AI-Driven)',
        description: 'Use AI tools to create and manage engaging content across platforms.'
      },
      {
        title: 'Game Designer (Immersive Experiences)',
        description: 'Create next-generation video games and interactive entertainment.'
      },
      {
        title: 'Digital Fashion Designer',
        description: 'Design virtual clothing and accessories for avatars and digital platforms.'
      }
    ]
  },
  'data-analyst': {
    id: 'data-analyst',
    title: 'Data Analyst & Scientist',
    subtitle: 'The Insight Navigator: Decoding the World with Data',
    description: "You are naturally curious about numbers, patterns, and solving puzzles! You like to analyze information and find hidden meanings within data. In the future, data will be everywhere, and we need skilled people to make sense of it all. This path is for you if you are logical, detail-oriented, enjoy problem-solving, and want to use data to make smart decisions and predictions.",
    icon: <BarChart3 className="h-8 w-8" />,
    color: 'bg-brand-orange text-white',
    careers: [
      {
        title: 'AI Ethicist',
        description: 'Ensure AI systems are used responsibly and fairly, analyzing data for biases.'
      },
      {
        title: 'Data Scientist (Predictive Analytics)',
        description: 'Use data to forecast future trends and help businesses and organizations plan.'
      },
      {
        title: 'Cybersecurity Analyst (Data Protection)',
        description: 'Protect sensitive data and systems from cyber threats using data analysis techniques.'
      },
      {
        title: 'Bioinformatician',
        description: 'Analyze biological data (like DNA) to understand diseases and develop new treatments.'
      }
    ]
  },
  'entrepreneur': {
    id: 'entrepreneur',
    title: 'Future-Focused Entrepreneur & Leader',
    subtitle: 'The Innovation Catalyst: Leading the Tech Revolution',
    description: "You are a natural leader with big ideas and a drive to make things happen! You are likely interested in starting your own projects or businesses and leading teams. In the future, we need innovative leaders to guide the development and use of technology for good. This path is for you if you are ambitious, creative, enjoy taking initiative, and want to build something impactful.",
    icon: <Briefcase className="h-8 w-8" />,
    color: 'bg-brand-green text-white',
    careers: [
      {
        title: 'Innovation Manager',
        description: 'Lead teams to develop and implement new ideas and technologies within organizations.'
      },
      {
        title: 'Tech Startup Founder (Impact Focus)',
        description: 'Create new businesses that solve social or environmental problems using technology.'
      },
      {
        title: 'Digital Transformation Consultant',
        description: 'Help traditional businesses adapt to the digital age and use new technologies effectively.'
      },
      {
        title: 'E-commerce Strategist (AI-Personalization)',
        description: 'Develop advanced online business strategies using AI to personalize customer experiences.'
      }
    ]
  },
  'helper': {
    id: 'helper',
    title: 'Tech-Enabled Helper & Problem Solver',
    subtitle: 'The Compassionate Technologist: Using Tech for Good',
    description: "You are caring and want to use your skills to help people and make a positive impact on the world! You believe technology can be a powerful tool for solving real-world problems. In the future, we need people who can combine technology with compassion to create solutions for healthcare, education, the environment, and social issues. This path is for you if you are empathetic, enjoy problem-solving, and want to use your tech skills to make a difference.",
    icon: <Heart className="h-8 w-8" />,
    color: 'bg-red-500 text-white',
    careers: [
      {
        title: 'Telehealth Specialist',
        description: 'Use technology to provide healthcare services remotely, improving access for everyone.'
      },
      {
        title: 'EdTech Innovator',
        description: 'Develop new educational technologies to make learning more effective and accessible.'
      },
      {
        title: 'Environmental Data Analyst',
        description: 'Use data and technology to monitor and address environmental issues like climate change.'
      },
      {
        title: 'Assistive Technology Developer',
        description: 'Create technologies to help people with disabilities live more independent and fulfilling lives.'
      }
    ]
  },
};

const FuturePathwaysResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [topClusters, setTopClusters] = useState<CareerCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get the results data from location state
    const state = location.state as PathwayResultsProps | null;
    
    if (!state || !state.clusterScores) {
      // No results data, navigate back to the assessment
      navigate('/assessment/future-pathways');
      return;
    }
    
    // Find top 2 clusters
    const { clusterScores } = state;
    const sortedClusters = Object.entries(clusterScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([id]) => careerClusters[id]);
    
    setTopClusters(sortedClusters);
    setIsLoading(false);
  }, [location, navigate]);

  const downloadAsPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('future-pathways-results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (isLoading || topClusters.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-brand-green">Loading your results...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6 flex justify-end">
            <Button 
              onClick={downloadAsPDF} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </div>
          
          <div ref={reportRef} className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-card">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="text-center mb-10">
                <div className="w-20 h-20 mx-auto bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
                  <Rocket className="h-10 w-10 text-brand-green" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Future Pathways</h1>
                <p className="text-muted-foreground text-lg">
                  Based on your responses, these career paths align with your interests and strengths.
                </p>
              </div>
              
              {/* Primary Career Cluster */}
              <div className={cn(
                "rounded-xl p-8 mb-8",
                topClusters[0].color
              )}>
                <h2 className="text-2xl font-bold mb-2">Primary Career Path</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    {topClusters[0].icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{topClusters[0].title}</h3>
                    <p className="text-white/90">{topClusters[0].subtitle}</p>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <p className="text-white/95">{topClusters[0].description}</p>
                </div>
                
                <h4 className="text-lg font-semibold mb-3">Future Career Possibilities:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topClusters[0].careers.map((career, index) => (
                    <div key={index} className="bg-white/20 rounded-lg p-4">
                      <h5 className="font-semibold">{career.title}</h5>
                      <p className="text-sm text-white/90">{career.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Secondary Career Cluster (if available) */}
              {topClusters.length > 1 && (
                <div className={cn(
                  "rounded-xl p-8 mb-8",
                  topClusters[1].color
                )}>
                  <h2 className="text-2xl font-bold mb-2">Secondary Career Path</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      {topClusters[1].icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{topClusters[1].title}</h3>
                      <p className="text-white/90">{topClusters[1].subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4 mb-6">
                    <p className="text-white/95">{topClusters[1].description}</p>
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-3">Future Career Possibilities:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topClusters[1].careers.map((career, index) => (
                      <div key={index} className="bg-white/20 rounded-lg p-4">
                        <h5 className="font-semibold">{career.title}</h5>
                        <p className="text-sm text-white/90">{career.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Conclusion */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Next Steps on Your Journey</h3>
                <p className="mb-4">
                  This is just a starting point! Explore these career paths further. Talk to people in these fields, 
                  research online, and discover your own unique path to a bright future!
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-brand-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>Research educational pathways that can help you develop skills in these areas</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-brand-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>Look for online courses, workshops, or clubs where you can explore these interests</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-brand-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>Connect with professionals in these fields through career fairs or social media</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-brand-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>Consider internships, volunteer opportunities, or projects to gain hands-on experience</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
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
              onClick={() => navigate('/future-pathways')}
              className="bg-brand-green hover:bg-brand-green/90"
            >
              Take Another Assessment
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FuturePathwaysResults;
