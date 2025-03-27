
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Rocket, 
  CheckCircle2, 
  BarChart3,
  User,
  School,
  BookOpen
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

// Define pathways descriptions
const pathwaysDescriptions = {
  "tech-innovator": {
    title: "Tech Innovator & Builder",
    description: "You have a natural talent for understanding and building technology. You may enjoy creating new devices, coding applications, or solving technical problems.",
    careers: [
      "Software Developer",
      "Robotics Engineer",
      "Digital Hardware Designer",
      "Systems Architect",
      "Technology Entrepreneur"
    ],
    skills: [
      "Technical problem-solving",
      "Coding and programming",
      "Digital design",
      "Systems thinking",
      "Innovation"
    ]
  },
  "digital-creator": {
    title: "Digital Creator & Storyteller",
    description: "You combine creativity with digital tools to express ideas and create engaging content. You enjoy visual design, storytelling, or bringing ideas to life digitally.",
    careers: [
      "Digital Content Creator",
      "UX/UI Designer",
      "Video Game Designer",
      "Social Media Specialist",
      "Digital Marketer"
    ],
    skills: [
      "Visual storytelling",
      "Digital media creation",
      "Design thinking",
      "Audience engagement",
      "Creative problem-solving"
    ]
  },
  "data-analyst": {
    title: "Data Analyst & Scientist",
    description: "You have a natural ability to see patterns in information and draw insights from data. You enjoy working with numbers, analyzing trends, and making predictions.",
    careers: [
      "Data Scientist",
      "Business Analyst",
      "Research Specialist",
      "AI Engineer",
      "Market Research Analyst"
    ],
    skills: [
      "Analytical thinking",
      "Data interpretation",
      "Statistical analysis",
      "Pattern recognition",
      "Logical reasoning"
    ]
  },
  "entrepreneur": {
    title: "Future-Focused Entrepreneur & Leader",
    description: "You're a natural leader with vision and drive. You enjoy taking initiative, developing new ideas, and inspiring others to work toward common goals.",
    careers: [
      "Startup Founder",
      "Product Manager",
      "Business Development",
      "Innovation Consultant",
      "Project Manager"
    ],
    skills: [
      "Leadership",
      "Strategic thinking",
      "Risk assessment",
      "Decision making",
      "Team building"
    ]
  },
  "helper": {
    title: "Tech-Enabled Helper & Problem Solver",
    description: "You want to use technology to make a positive difference in people's lives. You're motivated by helping others and solving important social problems.",
    careers: [
      "EdTech Specialist",
      "Sustainability Technologist",
      "Health Tech Developer",
      "Accessibility Designer",
      "AI Ethics Researcher"
    ],
    skills: [
      "Empathy",
      "Social problem-solving",
      "Communication",
      "Ethical reasoning",
      "Collaboration"
    ]
  }
};

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const FuturePathwaysResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  // Get results data from location state
  const resultsData = location.state;
  
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    if (!resultsData) {
      // Redirect to assessment if there's no results data
      navigate('/assessment/future-pathways');
      return;
    }
    
    // Fetch student details if we have a studentId in the results state
    const fetchStudentDetails = async () => {
      if (resultsData?.studentId) {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', resultsData.studentId)
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
  }, [resultsData, navigate]);
  
  if (!resultsData) {
    return null; // Don't render until we have results data
  }
  
  const { selectedOptions, questions, clusterScores, totalScore } = resultsData;
  
  // Get top clusters
  const sortedClusters = Object.entries(clusterScores)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([cluster]) => cluster);
  
  const primaryCluster = sortedClusters[0];
  const secondaryCluster = sortedClusters[1];
  
  // Calculate percentage scores
  const maxPossibleScore = 5 * questions.filter(q => q.careerClusters.includes(primaryCluster)).length;
  const primaryPercentage = Math.round((clusterScores[primaryCluster] / maxPossibleScore) * 100);
  
  const handleGeneratePDF = async () => {
    if (!resultsRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF'
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
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      const x = (pdfWidth - scaledWidth) / 2;
      const y = 10;
      
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
      pdf.save('Future-Pathways-Results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex flex-wrap justify-between items-center">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 text-brand-green hover:text-brand-green/80 -ml-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Future Pathways Results</h1>
              <p className="text-foreground/70 max-w-3xl">
                Based on your responses, we've identified your unique technology career pathway preferences.
              </p>
            </div>
            
            <Button 
              className="flex items-center bg-brand-green text-white hover:bg-brand-green/90 mt-4 md:mt-0"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
            >
              <Download className="mr-2 h-4 w-4" /> 
              {isGeneratingPDF ? 'Generating PDF...' : 'Download Results'}
            </Button>
          </div>
          
          {/* Student Details Section */}
          {studentDetails && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-green/10 rounded-xl p-4 md:p-6 mb-6 max-w-4xl mx-auto"
            >
              <h2 className="text-xl font-semibold mb-3 text-brand-green">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-brand-green mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{studentDetails.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-brand-green mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Class & Section</p>
                    <p className="font-medium">{studentDetails.class} - {studentDetails.section}</p>
                  </div>
                </div>
                <div className="flex items-center md:col-span-2">
                  <School className="h-5 w-5 text-brand-green mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">School</p>
                    <p className="font-medium">{studentDetails.school}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div 
            ref={resultsRef} 
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl mx-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-brand-green mb-1">
                    Your Top Pathway: {pathwaysDescriptions[primaryCluster].title}
                  </h2>
                  <p className="text-foreground/70">
                    Compatibility: <span className="font-semibold">{primaryPercentage}%</span>
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center bg-brand-green/20 px-3 py-1 rounded-full text-sm font-medium text-brand-green">
                    <Rocket className="h-4 w-4 mr-1" />
                    Future Pathways Explorer
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="bg-brand-green/5 p-6 rounded-lg border border-brand-green/10">
                  <p className="mb-4">{pathwaysDescriptions[primaryCluster].description}</p>
                  
                  <h3 className="font-medium mb-2">Core strengths in this pathway:</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    {pathwaysDescriptions[primaryCluster].skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Your Pathway Profile</h3>
                
                <div className="space-y-4">
                  {Object.entries(clusterScores).map(([cluster, score]) => {
                    const maxScore = 5 * questions.filter(q => q.careerClusters.includes(cluster)).length;
                    const percentage = Math.round((score as number / maxScore) * 100);
                    
                    return (
                      <div key={cluster}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{pathwaysDescriptions[cluster].title}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-brand-green"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Career Recommendations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-5 border-brand-green/20 bg-brand-green/5">
                    <h4 className="font-medium mb-3 text-lg">
                      {pathwaysDescriptions[primaryCluster].title}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {pathwaysDescriptions[primaryCluster].careers.map((career, index) => (
                        <li key={index}>{career}</li>
                      ))}
                    </ul>
                  </Card>
                  
                  <Card className="p-5">
                    <h4 className="font-medium mb-3 text-lg">
                      {pathwaysDescriptions[secondaryCluster].title}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {pathwaysDescriptions[secondaryCluster].careers.map((career, index) => (
                        <li key={index}>{career}</li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Educational Pathways</h3>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h4 className="font-medium mb-3">Recommended subjects to explore:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {primaryCluster === "tech-innovator" && (
                      <>
                        <div className="bg-white p-3 rounded border">Computer Science</div>
                        <div className="bg-white p-3 rounded border">Engineering</div>
                        <div className="bg-white p-3 rounded border">Robotics</div>
                        <div className="bg-white p-3 rounded border">Electronics</div>
                        <div className="bg-white p-3 rounded border">Math</div>
                        <div className="bg-white p-3 rounded border">Physics</div>
                      </>
                    )}
                    
                    {primaryCluster === "digital-creator" && (
                      <>
                        <div className="bg-white p-3 rounded border">Digital Arts</div>
                        <div className="bg-white p-3 rounded border">Graphic Design</div>
                        <div className="bg-white p-3 rounded border">Media Studies</div>
                        <div className="bg-white p-3 rounded border">Communications</div>
                        <div className="bg-white p-3 rounded border">UX Design</div>
                        <div className="bg-white p-3 rounded border">Web Development</div>
                      </>
                    )}
                    
                    {primaryCluster === "data-analyst" && (
                      <>
                        <div className="bg-white p-3 rounded border">Statistics</div>
                        <div className="bg-white p-3 rounded border">Data Science</div>
                        <div className="bg-white p-3 rounded border">Mathematics</div>
                        <div className="bg-white p-3 rounded border">Computer Science</div>
                        <div className="bg-white p-3 rounded border">Economics</div>
                        <div className="bg-white p-3 rounded border">Machine Learning</div>
                      </>
                    )}
                    
                    {primaryCluster === "entrepreneur" && (
                      <>
                        <div className="bg-white p-3 rounded border">Business Studies</div>
                        <div className="bg-white p-3 rounded border">Economics</div>
                        <div className="bg-white p-3 rounded border">Marketing</div>
                        <div className="bg-white p-3 rounded border">Product Management</div>
                        <div className="bg-white p-3 rounded border">Communications</div>
                        <div className="bg-white p-3 rounded border">Psychology</div>
                      </>
                    )}
                    
                    {primaryCluster === "helper" && (
                      <>
                        <div className="bg-white p-3 rounded border">Social Sciences</div>
                        <div className="bg-white p-3 rounded border">Global Studies</div>
                        <div className="bg-white p-3 rounded border">Public Health</div>
                        <div className="bg-white p-3 rounded border">Environmental Science</div>
                        <div className="bg-white p-3 rounded border">Education</div>
                        <div className="bg-white p-3 rounded border">Ethics</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-foreground/70">
                <p>
                  Note: These results are based on your current interests and preferences. 
                  They are meant to provide guidance, not to limit your options.
                  Consider exploring careers that combine elements of your top pathways.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Want to explore more about your career options?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment/riasec">
                <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green/5">
                  Try RIASEC Assessment
                </Button>
              </Link>
              <Link to="/assessment/career-vision">
                <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green/5">
                  Complete Career Vision
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FuturePathwaysResults;
