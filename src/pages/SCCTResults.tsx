import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, School, BookOpen } from 'lucide-react';

const SCCTResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const resultsData = location.state?.resultsData;
  const studentId = location.state?.studentId;
  const [studentDetails, setStudentDetails] = useState<any>(null);
  
  useEffect(() => {
    if (!location.state || !resultsData) {
      navigate('/assessment/scct');
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
  
  // Mock data for demonstration
  const mockResults = {
    confidence: 85,
    interest: 92,
    skills: 78,
    opportunities: 65,
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">SCCT Assessment Results</h1>
            <p className="text-foreground/70 max-w-3xl">
              Explore your career self-efficacy and outcome expectations.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="p-6 md:p-8 bg-blue-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-blue-600">Your SCCT Assessment Results</h2>
              <p className="text-gray-600 mt-1">Explore your career self-efficacy and outcome expectations.</p>
            </div>
            
            {/* Student Details Section */}
            {studentDetails && (
              <div className="p-6 md:p-8 bg-blue-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium mr-2">Name:</span> {studentDetails.name}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium mr-2">Class:</span> {studentDetails.class} {studentDetails.section && `- ${studentDetails.section}`}
                  </div>
                  <div className="flex items-center col-span-1 md:col-span-2">
                    <School className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium mr-2">School:</span> {studentDetails.school}
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Confidence Level</h4>
                  <p className="text-gray-600">Your confidence in pursuing your chosen career path: {mockResults.confidence}%</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Interest Alignment</h4>
                  <p className="text-gray-600">How well your interests align with potential career options: {mockResults.interest}%</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Skills Proficiency</h4>
                  <p className="text-gray-600">Your perceived proficiency in required skills: {mockResults.skills}%</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Opportunity Awareness</h4>
                  <p className="text-gray-600">Your awareness of available opportunities: {mockResults.opportunities}%</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Explore internships to gain practical experience.</li>
                  <li>Network with professionals in your field of interest.</li>
                  <li>Consider additional training or certifications to enhance your skills.</li>
                  <li>Stay updated with industry trends and emerging opportunities.</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Want to explore more about your career options?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment/career-vision">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Try Career Vision Assessment
                </Button>
              </Link>
              <Link to="/assessment/future-pathways">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Explore Future Pathways
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

export default SCCTResults;
