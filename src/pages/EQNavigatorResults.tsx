import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentInfoCard from '@/components/assessment/StudentInfoCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StudentDetails } from '@/components/assessment/StudentInfoCard';

const EQNavigatorResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [studentDetails, setStudentDetails] = React.useState<StudentDetails | null>(null);
  const { user } = useAuth();
  
  // Get scores from location state
  const scores = location.state?.scores || {};
  const totalScore = location.state?.totalScore || 0;
  
  React.useEffect(() => {
    if (!location.state) {
      navigate('/assessment/eq-navigator');
      return;
    }
    
    const fetchStudentDetails = async () => {
      setLoading(true);
      
      // First, check if studentDetails are in location state
      if (location.state?.studentDetails) {
        setStudentDetails(location.state.studentDetails);
        setLoading(false);
        return;
      }
      
      // Next, try fetching by studentId
      if (location.state?.studentId) {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', location.state.studentId)
            .single();
            
          if (error) {
            console.error('Error fetching student details:', error);
            await tryFetchProfileAsFallback();
            return;
          }
          
          if (data) {
            setStudentDetails({
              id: data.id,
              name: data.name,
              class: data.class || 'Not specified',
              section: data.section || 'Not specified',
              school: data.school || 'Not specified'
            });
          } else {
            await tryFetchProfileAsFallback();
          }
        } catch (error) {
          console.error('Error in student details fetch:', error);
          await tryFetchProfileAsFallback();
        }
      } else if (user) {
        // Try to get the latest student record for the user
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();
            
          if (error) {
            console.error('Error fetching latest student record:', error);
            await tryFetchProfileAsFallback();
            return;
          }
          
          if (data) {
            setStudentDetails({
              id: data.id,
              name: data.name,
              class: data.class || 'Not specified',
              section: data.section || 'Not specified',
              school: data.school || 'Not specified'
            });
          } else {
            await tryFetchProfileAsFallback();
          }
        } catch (error) {
          console.error('Error fetching latest student record:', error);
          await tryFetchProfileAsFallback();
        }
      } else {
        await tryFetchProfileAsFallback();
      }
      
      setLoading(false);
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
          console.error('Error fetching profile data:', profileError);
          return;
        }
        
        if (profileData) {
          const studentDetails: StudentDetails = {
            id: user.id,
            name: profileData.first_name && profileData.last_name 
              ? `${profileData.first_name} ${profileData.last_name}` 
              : (user.email || 'Anonymous User'),
            class: profileData.stream || 'Not specified',
            section: profileData.interest || 'Not specified',
            school: 'Not specified'
          };
          
          setStudentDetails(studentDetails);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchStudentDetails();
  }, [location.state, navigate, user]);

  const getCategoryScore = (category: string) => {
    return scores[category] || 0;
  };

  const getPercentage = (category: string) => {
    const score = getCategoryScore(category);
    return Math.round((score / 5) * 100);
  };

  const getLevel = () => {
    if (totalScore >= 35) {
      return "High";
    } else if (totalScore >= 25) {
      return "Medium";
    } else {
      return "Low";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 md:px-8 py-16 max-w-7xl mx-auto w-full mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">EQ Navigator Results</h1>
          <p className="text-gray-600">Here's your emotional intelligence profile</p>
        </div>
        
        {studentDetails && (
          <StudentInfoCard studentDetails={studentDetails} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-brand-blue mb-4">Overall EQ Level</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-gray-700 text-center text-2xl font-bold">{getLevel()}</p>
              <p className="text-gray-500 text-center">Total Score: {totalScore}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-brand-blue mb-4">Category Scores</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              {Object.keys(scores).map((category) => (
                <div key={category} className="mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">{category}</p>
                    <p className="text-gray-500">{getPercentage(category)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: `${getPercentage(category)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <div className="w-full flex justify-center pb-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/assessment')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessments
        </Button>
      </div>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorResults;
