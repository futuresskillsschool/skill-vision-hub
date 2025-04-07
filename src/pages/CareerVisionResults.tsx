import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OverviewTab from '@/components/career-vision/OverviewTab';
import RIASECTab from '@/components/career-vision/RIASECTab';
import PathwaysTab from '@/components/career-vision/PathwaysTab';
import EQTab from '@/components/career-vision/EQTab';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LoadingScreen from '@/components/assessment/LoadingScreen';
import StudentInfoSection from '@/components/career-vision/StudentInfoSection';
import { StudentDetails } from '@/components/assessment/StudentInfoCard';

// Type definitions for all data needed
interface RIASECScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

interface PathwaysScores {
  [key: string]: number;
}

interface CareerRecommendation {
  title: string;
  match: number;
  careers: string[];
}

const CareerVisionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  // Get results data from location state
  const riasecScores = location.state?.riasec || {};
  const pathwaysScores = location.state?.pathways || {};
  const eqScore = location.state?.eqScore || 0;
  
  // Format data for charts
  const riasecChartData = Object.entries(riasecScores).map(([name, score]) => ({ name, score }));
  const pathwaysChartData = Object.entries(pathwaysScores).map(([name, score]) => ({ 
    name: name.charAt(0).toUpperCase(), 
    score 
  }));
  
  // Get top categories
  const topRiasecCategories = Object.entries(riasecScores)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([type]) => type);
    
  const topPathwaysClusters = Object.entries(pathwaysScores)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 2)
    .map(([type]) => type);
  
  // Create career recommendations based on top scores
  const careerRecommendations = [
    {
      title: "Tech Innovator",
      match: 92,
      careers: ["Software Engineer", "Data Scientist", "AI Researcher"]
    },
    {
      title: "Creative Designer",
      match: 88,
      careers: ["UI/UX Designer", "Graphic Designer", "Web Developer"]
    },
    {
      title: "Business Strategist",
      match: 85,
      careers: ["Business Analyst", "Marketing Manager", "Product Manager"]
    }
  ];
  
  useEffect(() => {
    // If we don't have location data, redirect back to the assessment page
    if (!location.state) {
      navigate('/assessment/career-vision');
      return;
    }
    
    const loadStudentDetails = async () => {
      setLoading(true);
      try {
        if (location.state?.studentDetails) {
          setStudentDetails(location.state.studentDetails);
        } else if (location.state?.studentId) {
          // Fetch student details from the database
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', location.state.studentId)
            .single();
            
          if (error) {
            console.error('Error fetching student details:', error);
            // Try using profile data as fallback
            await tryFetchProfileAsFallback();
          } else if (data) {
            setStudentDetails(data as StudentDetails);
          }
        } else if (user) {
          // Try using profile data
          await tryFetchProfileAsFallback();
        }
      } catch (error) {
        console.error('Error loading student details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const tryFetchProfileAsFallback = async () => {
      if (!user) return;
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile as fallback:', profileError);
          return;
        }
        
        if (profileData) {
          setStudentDetails({
            id: user.id,
            name: profileData.first_name && profileData.last_name 
              ? `${profileData.first_name} ${profileData.last_name}` 
              : (user.email || 'Anonymous User'),
            class: profileData.stream || 'Not specified',
            section: profileData.interest || 'Not specified',
            school: 'Not specified'
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    loadStudentDetails();
  }, [location, navigate, user]);
  
  const handleDownloadPDF = () => {
    toast.info("PDF generation will be implemented in future updates");
    // We'll implement PDF generation here in a future update
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow px-4 md:px-8 py-8 max-w-7xl mx-auto w-full mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Career Vision Assessment Results</h1>
            <p className="text-gray-500 mt-2">Your comprehensive career planning profile based on multiple assessments</p>
          </div>
          <Button variant="outline" onClick={handleDownloadPDF} className="hidden md:flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
        
        <StudentInfoSection studentDetails={studentDetails} />
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="riasec">RIASEC Profile</TabsTrigger>
            <TabsTrigger value="pathways">Future Pathways</TabsTrigger>
            <TabsTrigger value="eq">Emotional Intelligence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab
              riasec={riasecScores}
              pathways={pathwaysScores}
              eqScore={eqScore}
              careerRecommendations={careerRecommendations}
              topRiasecCategories={topRiasecCategories}
              topPathwaysClusters={topPathwaysClusters}
              riasecChartData={riasecChartData}
              pathwaysChartData={pathwaysChartData}
              handleDownloadPDF={handleDownloadPDF}
              studentDetails={studentDetails}
            />
          </TabsContent>
          
          <TabsContent value="riasec">
            <RIASECTab 
              riasec={riasecScores} 
              riasecChartData={riasecChartData}
            />
          </TabsContent>
          
          <TabsContent value="pathways">
            <PathwaysTab 
              pathways={pathwaysScores}
              pathwaysChartData={pathwaysChartData}
            />
          </TabsContent>
          
          <TabsContent value="eq">
            <EQTab eqScore={eqScore} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerVisionResults;
