import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentInfoCard from '@/components/assessment/StudentInfoCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StudentDetails } from '@/components/assessment/StudentInfoCard';

const SCCTResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  // Get scores from location state
  const scores = location.state?.scores || {};
  
  useEffect(() => {
    if (!location.state) {
      navigate('/assessment/scct');
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

  const domainLabels = {
    "mathInt": "Mathematics",
    "scienceInt": "Science",
    "artInt": "Art",
    "socialInt": "Social",
    "persuasiveInt": "Persuasive",
    "mechanicalInt": "Mechanical",
    "natureInt": "Nature",
    "clericalInt": "Clerical",
  };

  const renderDomainScores = () => {
    return Object.entries(scores).map(([domain, score]) => (
      <div key={domain} className="mb-4">
        <h3 className="text-lg font-semibold">{domainLabels[domain as keyof typeof domainLabels]}</h3>
        <p className="text-gray-600">Score: {score}</p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 md:px-8 py-16 max-w-7xl mx-auto w-full mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">SCCT Results</h1>
          <p className="text-gray-600">Here's your social cognitive career theory assessment results</p>
        </div>
        
        {studentDetails && (
          <StudentInfoCard studentDetails={studentDetails} />
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Your Interest Scores</h2>
          {renderDomainScores()}
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

export default SCCTResults;
