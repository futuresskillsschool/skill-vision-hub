import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Rocket, Download, ArrowRight, Brain, BookOpen, PenTool, Home, Code, Palette, BarChart3, Briefcase, Heart, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Progress } from '@/components/ui/progress';

interface PathwayResultsProps {
  clusterScores: Record<string, number>;
  selectedOptions: number[];
  studentId?: string;
}

interface CareerCluster {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
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
    bgGradient: 'bg-gradient-to-br from-brand-purple to-brand-dark-purple',
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
    bgGradient: 'bg-gradient-to-br from-brand-blue to-blue-700',
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
    bgGradient: 'bg-gradient-to-br from-brand-orange to-amber-600',
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
    bgGradient: 'bg-gradient-to-br from-brand-green to-emerald-700',
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
    bgGradient: 'bg-gradient-to-br from-red-500 to-red-700',
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
  const [clusterScores, setClusterScores] = useState<Record<string, number>>({});
  const [maxScore, setMaxScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  const [studentDetails, setStudentDetails] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const state = location.state as PathwayResultsProps | null;
    
    if (!state || !state.clusterScores) {
      navigate('/assessment/future-pathways');
      return;
    }
    
    const { clusterScores } = state;
    setClusterScores(clusterScores);
    
    const sortedClusters = Object.entries(clusterScores)
      .sort((a, b) => b[1] - a[1]);
    
    const highestScore = sortedClusters[0][1];
    setMaxScore(highestScore);
    
    const topTwoClusters = sortedClusters
      .slice(0, 2)
      .map(([id]) => careerClusters[id]);
    
    setTopClusters(topTwoClusters);
    setIsLoading(false);
    
    if (state.studentId) {
      console.log('Student ID:', state.studentId);
    }
  }, [location, navigate]);

  const calculatePercentage = (score: number) => {
    if (maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
  };

  const downloadAsPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      const contentToCapture = reportRef.current.cloneNode(true) as HTMLElement;
      
      contentToCapture.style.width = '800px';
      contentToCapture.style.backgroundColor = '#ffffff';
      contentToCapture.style.padding = '40px';
      contentToCapture.style.position = 'absolute';
      contentToCapture.style.left = '-9999px';
      contentToCapture.style.top = '-9999px';
      document.body.appendChild(contentToCapture);
      
      const expandElements = (element: HTMLElement) => {
        element.style.height = 'auto';
        element.style.maxHeight = 'none';
        element.style.overflow = 'visible';
        element.style.display = element.style.display === 'none' ? 'none' : 'block';
        
        const svgs = element.querySelectorAll('svg');
        svgs.forEach(svg => {
          svg.setAttribute('width', svg.getBoundingClientRect().width.toString());
          svg.setAttribute('height', svg.getBoundingClientRect().height.toString());
        });
        
        const gradientElements = element.querySelectorAll('[class*="bg-gradient"]');
        gradientElements.forEach(el => {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.display = 'block';
        });
        
        Array.from(element.children).forEach(child => {
          expandElements(child as HTMLElement);
        });
      };
      
      expandElements(contentToCapture);
      
      const canvas = await html2canvas(contentToCapture, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true
      });
      
      document.body.removeChild(contentToCapture);
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = pdfWidth / imgWidth * 0.95;
      
      const pageHeight = pdfHeight - 20;
      const totalPdfHeight = imgHeight * ratio;
      const pageCount = Math.ceil(totalPdfHeight / pageHeight);
      
      let heightLeft = totalPdfHeight;
      let position = 0;
      let currentPage = 0;
      
      while (heightLeft > 0) {
        if (currentPage > 0) {
          pdf.addPage();
        }
        
        const currentPageHeight = Math.min(heightLeft, pageHeight);
        const srcY = position / ratio;
        const srcHeight = currentPageHeight / ratio;
        
        pdf.addImage(
          imgData, 
          'PNG', 
          10,
          10,
          pdfWidth - 20,
          currentPageHeight
        );
        
        heightLeft -= currentPageHeight;
        position += currentPageHeight;
        currentPage++;
      }
      
      pdf.save('Future-Pathways-Results.pdf');
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
              <div className="text-center mb-10 relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 -z-10"></div>
                
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand-green to-emerald-700 rounded-2xl rotate-3 flex items-center justify-center mb-6">
                  <Rocket className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Your Future Pathways</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Based on your responses, these career paths align with your interests and strengths. 
                  Explore the possibilities that await in the future of work.
                </p>
              </div>
              
              <div className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Your Career Cluster Affinities</h2>
                
                <div className="space-y-4">
                  {Object.entries(clusterScores)
                    .sort((a, b) => b[1] - a[1])
                    .map(([clusterId, score]) => {
                      const cluster = careerClusters[clusterId];
                      const percentage = calculatePercentage(score);
                      return (
                        <div key={clusterId} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`w-6 h-6 rounded-full ${cluster.color} flex items-center justify-center mr-2`}>
                                {cluster.icon}
                              </div>
                              <span className="font-medium">{cluster.title}</span>
                            </div>
                            <span className="text-sm font-semibold">{percentage}%</span>
                          </div>
                          <Progress 
                            value={percentage} 
                            className={cn("h-2", 
                              clusterId === 'tech-innovator' ? 'bg-brand-purple/20' : 
                              clusterId === 'digital-creator' ? 'bg-brand-blue/20' :
                              clusterId === 'data-analyst' ? 'bg-brand-orange/20' :
                              clusterId === 'entrepreneur' ? 'bg-brand-green/20' :
                              'bg-red-200'
                            )} 
                          />
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              
              <div className={cn(
                "rounded-xl p-8 mb-8 relative overflow-hidden",
                topClusters[0].bgGradient
              )}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/4"></div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white">1</span>
                    </div>
                    Primary Career Path
                  </h2>
                  
                  <div className="flex flex-col md:flex-row items-center gap-5 mb-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      {topClusters[0].icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{topClusters[0].title}</h3>
                      <p className="text-white/90">{topClusters[0].subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 mb-6">
                    <p className="text-white/95 leading-relaxed">{topClusters[0].description}</p>
                  </div>
                  
                  <h4 className="text-lg font-semibold mb-3">Future Career Possibilities:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topClusters[0].careers.map((career, index) => (
                      <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-5 hover:bg-white/30 transition-colors group">
                        <div className="flex items-center">
                          <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <span className="font-semibold">{index + 1}</span>
                          </div>
                          <h5 className="font-semibold text-lg">{career.title}</h5>
                        </div>
                        <p className="mt-2 text-white/90">{career.description}</p>
                        <div className="mt-3 pt-2 border-t border-white/20 text-sm flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="mr-1">Learn more</span>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/20 text-white/90">
                    <h5 className="font-semibold mb-2">Why this path matches you:</h5>
                    <p>
                      Based on your responses, you show a strong affinity for {topClusters[0].title.toLowerCase()} 
                      activities and interests. This path aligns with your natural curiosity and problem-solving approach.
                    </p>
                  </div>
                </div>
              </div>
              
              {topClusters.length > 1 && (
                <div className={cn(
                  "rounded-xl p-8 mb-8 relative overflow-hidden",
                  topClusters[1].bgGradient
                )}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/4"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/4"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white">2</span>
                      </div>
                      Secondary Career Path
                    </h2>
                    
                    <div className="flex flex-col md:flex-row items-center gap-5 mb-6">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        {topClusters[1].icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold">{topClusters[1].title}</h3>
                        <p className="text-white/90">{topClusters[1].subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 mb-6">
                      <p className="text-white/95 leading-relaxed">{topClusters[1].description}</p>
                    </div>
                    
                    <h4 className="text-lg font-semibold mb-3">Future Career Possibilities:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {topClusters[1].careers.map((career, index) => (
                        <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-5 hover:bg-white/30 transition-colors group">
                          <div className="flex items-center">
                            <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                              <span className="font-semibold">{index + 1}</span>
                            </div>
                            <h5 className="font-semibold text-lg">{career.title}</h5>
                          </div>
                          <p className="mt-2 text-white/90">{career.description}</p>
                          <div className="mt-3 pt-2 border-t border-white/20 text-sm flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="mr-1">Learn more</span>
                            <ExternalLink className="h-3 w-3" />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-white/20 text-white/90">
                      <h5 className="font-semibold mb-2">You might also consider:</h5>
                      <p>
                        Your responses also indicate strengths that align well with a {topClusters[1].title.toLowerCase()} 
                        path. This could be an excellent complementary field or alternative to explore.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-blue rounded-full flex items-center justify-center mr-3 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                  Interdisciplinary Opportunities
                </h3>
                
                <p className="mb-4 text-muted-foreground">
                  The most innovative career paths often combine skills from multiple areas. Consider how your top interests might work together:
                </p>
                
                {topClusters.length > 1 && (
                  <Card className="p-5 border-t-4 border-t-gradient-purple-blue mb-4">
                    <h4 className="font-semibold text-lg mb-2">
                      {topClusters[0].title} + {topClusters[1].title}
                    </h4>
                    <p className="text-muted-foreground">
                      Combining these paths could lead to unique opportunities such as 
                      creating technology solutions that address specific industry challenges or 
                      designing innovative systems that draw on both your technical and creative skills.
                    </p>
                  </Card>
                )}
                
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="font-semibold flex items-center mb-2">
                    <ArrowRight className="h-4 w-4 text-brand-green mr-2" />
                    Pro Tip:
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    In today's rapidly changing work environment, professionals with diverse skill sets who can bridge multiple domains 
                    are especially valuable. Consider building a unique combination of skills that sets you apart.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-brand-green/10 to-brand-blue/10 rounded-xl p-6 border border-brand-green/20">
                <h3 className="text-xl font-semibold mb-4">Next Steps on Your Journey</h3>
                <p className="mb-4">
                  This is just a starting point! Explore these career paths further. Talk to people in these fields, 
                  research online, and discover your own unique path to a bright future!
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-white p-1 rounded-full mr-2 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-brand-green" />
                    </div>
                    <span>Research educational pathways that can help you develop skills in these areas</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white p-1 rounded-full mr-2 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-brand-green" />
                    </div>
                    <span>Look for online courses, workshops, or clubs where you can explore these interests</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white p-1 rounded-full mr-2 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-brand-green" />
                    </div>
                    <span>Connect with professionals in these fields through career fairs or social media</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-white p-1 rounded-full mr-2 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-brand-green" />
                    </div>
                    <span>Consider internships, volunteer opportunities, or projects to gain hands-on experience</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
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
