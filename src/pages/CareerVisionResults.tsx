import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, User, School, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const CareerVisionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const resultsData = location.state?.results;
  const studentId = location.state?.studentId;
  const [studentDetails, setStudentDetails] = useState<any>(null);
  
  useEffect(() => {
    if (!location.state || !resultsData) {
      navigate('/assessment/career-vision');
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
  }, [location.state, navigate, studentId, resultsData]);
  
  const overviewData = resultsData?.overview || {};
  const strengthsData = resultsData?.strengths || [];
  const interestsData = resultsData?.interests || [];
  const skillsData = resultsData?.skills || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Career Vision Assessment Results</h1>
            <p className="text-foreground/70 max-w-3xl">
              Explore your career strengths, potential, and personalized recommendations.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto mb-12">
            <div className="p-6 md:p-8 bg-orange-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-brand-orange">Your Career Vision Assessment Results</h2>
              <p className="text-gray-600 mt-1">Discover your career strengths, potential, and personalized recommendations.</p>
            </div>
            
            {/* Student Details Section */}
            {studentDetails && (
              <div className="p-6 md:p-8 bg-orange-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-brand-orange mr-2" />
                    <span className="font-medium mr-2">Name:</span> {studentDetails.name}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-brand-orange mr-2" />
                    <span className="font-medium mr-2">Class:</span> {studentDetails.class} {studentDetails.section && `- ${studentDetails.section}`}
                  </div>
                  <div className="flex items-center col-span-1 md:col-span-2">
                    <School className="h-5 w-5 text-brand-orange mr-2" />
                    <span className="font-medium mr-2">School:</span> {studentDetails.school}
                  </div>
                </div>
              </div>
            )}
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-50 border-b border-gray-200">
                <TabsTrigger value="overview" className="data-[state=active]:bg-orange-100 data-[state=active]:text-brand-orange">
                  <BarChart className="h-4 w-4 mr-2" /> Overview
                </TabsTrigger>
                <TabsTrigger value="strengths" className="data-[state=active]:bg-orange-100 data-[state=active]:text-brand-orange">
                  <LineChart className="h-4 w-4 mr-2" /> Strengths
                </TabsTrigger>
                <TabsTrigger value="interests" className="data-[state=active]:bg-orange-100 data-[state=active]:text-brand-orange">
                  <PieChart className="h-4 w-4 mr-2" /> Interests
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-orange-100 data-[state=active]:text-brand-orange">
                  <PieChart className="h-4 w-4 mr-2" /> Skills
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4">Overview of Your Career Vision</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Career Cluster</CardTitle>
                      <CardDescription>Based on your responses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{overviewData.topCareerCluster || 'N/A'}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Industries</CardTitle>
                      <CardDescription>Potential areas for exploration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5">
                        {(overviewData.recommendedIndustries || []).map((industry, index) => (
                          <li key={index}>{industry}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="strengths" className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4">Your Key Strengths</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {strengthsData.map((strength, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{strength.name}</CardTitle>
                        <CardDescription>{strength.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Score: {strength.score}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="interests" className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4">Your Interests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {interestsData.map((interest, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{interest.name}</CardTitle>
                        <CardDescription>Level of interest</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Score: {interest.score}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

               <TabsContent value="skills" className="p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4">Your Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skillsData.map((skill, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{skill.name}</CardTitle>
                        <CardDescription>Proficiency level</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Score: {skill.score}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Want to explore more about your career options?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment/future-pathways">
                <Button variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange/5">
                  Explore Future Pathways
                </Button>
              </Link>
              <Link to="/assessment/riasec">
                <Button variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange/5">
                  Take RIASEC Assessment
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

export default CareerVisionResults;
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
