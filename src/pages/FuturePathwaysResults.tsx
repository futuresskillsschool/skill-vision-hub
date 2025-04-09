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

const FuturePathwaysResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  // Get scores from location state
  const scores = location.state?.scores || {};
  
  useEffect(() => {
    if (!location.state) {
      navigate('/assessment/future-pathways');
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

  // Calculate the highest scoring categories
  const sortedScores = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number));
  
  const topCategories = sortedScores.slice(0, 3).map(([category]) => category);
  
  // Get the total score
  const totalScore = Object.values(scores).reduce((sum, score) => sum + (score as number), 0);
  
  // Calculate percentages for each category
  const percentages = Object.fromEntries(
    Object.entries(scores).map(([category, score]) => [
      category,
      totalScore > 0 ? Math.round(((score as number) / totalScore) * 100) : 0
    ])
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 md:px-8 py-16 max-w-7xl mx-auto w-full mt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">Future Pathways Results</h1>
          <p className="text-gray-600">Here's your career cluster assessment results</p>
        </div>
        
        {studentDetails && (
          <StudentInfoCard studentDetails={studentDetails} />
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Your Career Cluster Profile</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Top Career Clusters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topCategories.map((category, index) => (
                <div 
                  key={category}
                  className={`p-4 rounded-lg ${
                    index === 0 
                      ? 'bg-brand-blue/10 border border-brand-blue/20' 
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="h-2.5 rounded-full bg-brand-blue" 
                        style={{ width: `${percentages[category]}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{percentages[category]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">All Career Clusters</h3>
            <div className="space-y-4">
              {Object.entries(scores).map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm font-medium">{percentages[category]}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-brand-blue" 
                      style={{ width: `${percentages[category]}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">What This Means</h3>
            <p className="text-gray-700 mb-4">
              Your results indicate that you have a strong interest in the {topCategories[0]} 
              career cluster, followed by {topCategories[1]} and {topCategories[2]}. 
              These clusters represent groups of careers that share common features.
            </p>
            <p className="text-gray-700">
              Consider exploring specific careers within these clusters to find options 
              that match your interests, skills, and values. Remember that this assessment 
              is just one tool to help guide your career exploration.
            </p>
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

export default FuturePathwaysResults;
