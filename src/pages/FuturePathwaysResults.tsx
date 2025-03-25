
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, School, BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const FuturePathwaysResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [topClusters, setTopClusters] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const { clusterScores, selectedOptions } = location.state || {};
  const studentId = location.state?.studentId;
  const [studentDetails, setStudentDetails] = useState<any>(null);
  
  useEffect(() => {
    if (!location.state) {
      navigate('/assessment/future-pathways');
      return;
    }
    
    window.scrollTo(0, 0);
    
    // Fetch student details if studentId is available
    if (studentId) {
      const fetchStudentDetails = async () => {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', studentId)
            .single();
            
          if (error) throw error;
          setStudentDetails(data);
        } catch (error) {
          console.error('Error fetching student details:', error);
        }
      };
      
      fetchStudentDetails();
    }
  }, [location.state, navigate, studentId]);

  useEffect(() => {
    // Determine if the screen is mobile-sized
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    // Set initial value and add event listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (clusterScores) {
      // Sort the cluster scores and get the top 3 clusters
      const sortedClusters = Object.entries(clusterScores)
        .sort(([, scoreA], [, scoreB]) => Number(scoreB) - Number(scoreA))
        .slice(0, 3)
        .map(([cluster]) => cluster);
      setTopClusters(sortedClusters);
    }
  }, [clusterScores]);

  const careerClusters = {
    "tech-innovator": "Tech Innovator & Builder",
    "digital-creator": "Digital Creator & Storyteller",
    "data-analyst": "Data Analyst & Scientist",
    "entrepreneur": "Future-Focused Entrepreneur & Leader",
    "helper": "Tech-Enabled Helper & Problem Solver"
  };

  const navigateBack = () => {
    navigate('/assessment/future-pathways/take');
  };

  const renderClusterDescription = (cluster: string) => {
    switch (cluster) {
      case "tech-innovator":
        return "You are drawn to creating and building new technologies. You enjoy figuring out how things work and are excited by the prospect of inventing the future.";
      case "digital-creator":
        return "You have a passion for expressing yourself through digital media. You love creating content, telling stories, and engaging with audiences online.";
      case "data-analyst":
        return "You are fascinated by data and enjoy uncovering insights through analysis. You are skilled at identifying trends and using data to solve complex problems.";
      case "entrepreneur":
        return "You have a strong drive to start your own ventures and lead others. You are innovative, resourceful, and always looking for new opportunities.";
      case "helper":
        return "You are motivated by a desire to make a positive impact on the world. You are compassionate, empathetic, and enjoy using technology to help others.";
      default:
        return "No description available.";
    }
  };

  const renderClusterSkills = (cluster: string) => {
    switch (cluster) {
      case "tech-innovator":
        return [
          "Coding and software development",
          "Robotics and AI",
          "Problem-solving",
          "Innovation",
          "Technical design"
        ];
      case "digital-creator":
        return [
          "Content creation",
          "Video production",
          "Graphic design",
          "Social media marketing",
          "Storytelling"
        ];
      case "data-analyst":
        return [
          "Data mining",
          "Statistical analysis",
          "Machine learning",
          "Data visualization",
          "Critical thinking"
        ];
      case "entrepreneur":
        return [
          "Business planning",
          "Leadership",
          "Marketing and sales",
          "Financial management",
          "Networking"
        ];
      case "helper":
        return [
          "Empathy and compassion",
          "Communication",
          "Problem-solving",
          "Community organizing",
          "Technological proficiency"
        ];
      default:
        return [];
    }
  };

  const renderClusterCareers = (cluster: string) => {
    switch (cluster) {
      case "tech-innovator":
        return [
          "Software Engineer",
          "AI Specialist",
          "Robotics Engineer",
          "VR/AR Developer",
          "Cybersecurity Expert"
        ];
      case "digital-creator":
        return [
          "Content Creator",
          "Social Media Manager",
          "Video Editor",
          "Graphic Designer",
          "Digital Marketing Specialist"
        ];
      case "data-analyst":
        return [
          "Data Scientist",
          "Business Intelligence Analyst",
          "Market Research Analyst",
          "Statistician",
          "Data Engineer"
        ];
      case "entrepreneur":
        return [
          "Startup Founder",
          "Business Consultant",
          "Product Manager",
          "Venture Capitalist",
          "E-commerce Entrepreneur"
        ];
      case "helper":
        return [
          "Healthcare Technologist",
          "EdTech Innovator",
          "Social Entrepreneur",
          "Environmental Scientist",
          "Public Health Analyst"
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={navigateBack}
              className="mb-4 text-brand-green hover:text-brand-green/80 -ml-3"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assessment
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Future Pathways Explorer Results</h1>
            <p className="text-foreground/70 max-w-3xl">
              Based on your responses, here are your personalized career pathway recommendations.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="p-6 md:p-8 bg-brand-green/10 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-brand-green">Your Future Pathways Explorer Results</h2>
              <p className="text-gray-600 mt-1">Here are your personalized career pathway recommendations based on your responses.</p>
            </div>
            
            {/* Student Details Section */}
            {studentDetails && (
              <div className="p-6 md:p-8 bg-green-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-brand-green mr-2" />
                    <span className="font-medium mr-2">Name:</span> {studentDetails.name}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-brand-green mr-2" />
                    <span className="font-medium mr-2">Class:</span> {studentDetails.class} {studentDetails.section && `- ${studentDetails.section}`}
                  </div>
                  <div className="flex items-center col-span-1 md:col-span-2">
                    <School className="h-5 w-5 text-brand-green mr-2" />
                    <span className="font-medium mr-2">School:</span> {studentDetails.school}
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6 md:p-8">
              {topClusters.length > 0 ? (
                <div className="space-y-6">
                  {topClusters.map((cluster, index) => (
                    <div key={cluster} className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 p-5">
                        <h3 className="text-xl font-semibold text-brand-green mb-2">{careerClusters[cluster as keyof typeof careerClusters]}</h3>
                        <p className="text-gray-600">{renderClusterDescription(cluster)}</p>
                      </div>
                      <div className="p-5">
                        <h4 className="text-lg font-semibold mb-3">Skills for {careerClusters[cluster as keyof typeof careerClusters]}</h4>
                        <ul className="list-disc list-inside text-gray-600 mb-4">
                          {renderClusterSkills(cluster).map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                        <h4 className="text-lg font-semibold mt-4 mb-3">Potential Career Paths</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {renderClusterCareers(cluster).map((career, index) => (
                            <li key={index}>{career}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No results to display. Please complete the assessment to see your personalized career pathway recommendations.</p>
              )}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Explore More Options</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment/career-vision">
                <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green/5">
                  Explore Different Career Paths
                </Button>
              </Link>
              <Link to="/assessment/riasec">
                <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green/5">
                  Take Another Assessment
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
