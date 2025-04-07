import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StudentInfoCard, { StudentDetails } from '@/components/assessment/StudentInfoCard';
import RIASECResultsContent from '@/components/assessment/results/RIASECResultsContent';

const riasecTypes = {
  R: {
    name: 'Realistic',
    title: 'The Doer',
    description: 'You enjoy working with your hands, tools, machines, or animals. You like activities that are practical and hands-on.',
    careers: [
      'Mechanic',
      'Engineer',
      'Construction Worker',
      'Electrician',
      'Chef',
      'Carpenter',
      'Landscaper',
      'Athlete',
      'Farmer',
      'Technician'
    ],
    color: 'bg-blue-500',
    skills: [
      'Working with hands',
      'Using tools and machinery',
      'Physical coordination',
      'Problem-solving with real objects',
      'Building and repairing'
    ]
  },
  I: {
    name: 'Investigative',
    title: 'The Thinker',
    description: 'You like to explore, investigate, and understand things. You enjoy solving complex problems and thinking deeply.',
    careers: [
      'Scientist',
      'Researcher',
      'Doctor',
      'Professor',
      'Analyst',
      'Mathematician',
      'Computer Programmer',
      'Archaeologist',
      'Biologist',
      'Engineer'
    ],
    color: 'bg-purple-500',
    skills: [
      'Critical thinking',
      'Research',
      'Analysis',
      'Problem-solving',
      'Investigating and questioning'
    ]
  },
  A: {
    name: 'Artistic',
    title: 'The Creator',
    description: 'You value self-expression, creativity, and imagination. You like work that allows you to create unique things or express ideas.',
    careers: [
      'Artist',
      'Musician',
      'Writer',
      'Designer',
      'Actor',
      'Photographer',
      'Interior Designer',
      'Fashion Designer',
      'Animator',
      'Architect'
    ],
    color: 'bg-red-500',
    skills: [
      'Creativity',
      'Imagination',
      'Self-expression',
      'Artistic ability',
      'Innovation and originality'
    ]
  },
  S: {
    name: 'Social',
    title: 'The Helper',
    description: 'You enjoy working with people, helping others, and making a positive difference. You are good at communicating and supporting others.',
    careers: [
      'Teacher',
      'Counselor',
      'Nurse',
      'Social Worker',
      'Therapist',
      'Coach',
      'Human Resources',
      'Customer Service',
      'Community Worker',
      'Healthcare Provider'
    ],
    color: 'bg-yellow-500',
    skills: [
      'Communication',
      'Empathy',
      'Helping others',
      'Teaching',
      'Cooperation and teamwork'
    ]
  },
  E: {
    name: 'Enterprising',
    title: 'The Persuader',
    description: 'You like to lead, influence, and persuade others. You enjoy taking risks, starting projects, and convincing people of your ideas.',
    careers: [
      'Business Owner',
      'Manager',
      'Salesperson',
      'Lawyer',
      'Politician',
      'Marketing Executive',
      'Real Estate Agent',
      'Event Planner',
      'Public Relations',
      'Entrepreneur'
    ],
    color: 'bg-orange-500',
    skills: [
      'Leadership',
      'Persuasion',
      'Selling and influencing',
      'Public speaking',
      'Decision-making'
    ]
  },
  C: {
    name: 'Conventional',
    title: 'The Organizer',
    description: 'You like organization, structure, and clear directions. You are good with details, numbers, and systems that keep things running smoothly.',
    careers: [
      'Accountant',
      'Administrative Assistant',
      'Banker',
      'Bookkeeper',
      'Office Manager',
      'Data Entry',
      'Financial Analyst',
      'Tax Preparer',
      'Secretary',
      'Logistics Coordinator'
    ],
    color: 'bg-green-500',
    skills: [
      'Organization',
      'Attention to detail',
      'Following procedures',
      'Data management',
      'Reliability and thoroughness'
    ]
  }
};

interface RIASECScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

const RIASECResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  const scores: RIASECScores = location.state?.scores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  useEffect(() => {
    if (!location.state) {
      navigate('/assessment/riasec');
      return;
    }
    
    window.scrollTo(0, 0);
    
    const fetchStudentDetails = async () => {
      if (location.state?.studentDetails) {
        setStudentDetails(location.state.studentDetails);
        return;
      }
      
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
            setStudentDetails(data as StudentDetails);
          }
        } catch (error) {
          console.error('Error in student details fetch:', error);
          await tryFetchProfileAsFallback();
        }
      } else if (user) {
        await tryFetchProfileAsFallback();
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
          console.error('Error fetching profile data:', profileError);
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
    
    fetchStudentDetails();
    
    const saveResultsToDB = async () => {
      if (user && scores && !location.state?.viewOnly) {
        try {
          console.log('Saving RIASEC results to database for user:', user.id);
          
          const { data: existingResults, error: checkError } = await supabase
            .from('assessment_results')
            .select('id')
            .eq('user_id', user.id)
            .eq('assessment_type', 'riasec')
            .maybeSingle();
            
          if (existingResults) {
            console.log('Using existing RIASEC results record');
            return;
          }
          
          const scoresObject: Record<string, number> = {};
          Object.entries(scores).forEach(([key, value]) => {
            scoresObject[key] = value;
          });
          
          const resultData = {
            scores: scoresObject,
            studentId: location.state?.studentId
          };
          
          const { error } = await supabase
            .from('assessment_results')
            .insert({
              user_id: user.id,
              assessment_type: 'riasec',
              result_data: resultData
            });
            
          if (error) {
            console.error('Error saving results to database:', error);
          } else {
            console.log('RIASEC results saved successfully');
          }
        } catch (error) {
          console.error('Exception when saving results:', error);
        }
      } else {
        console.log('Skipping save to database (view-only mode or missing user/scores)');
      }
    };
    
    saveResultsToDB();
    
  }, [location.state, navigate, user, scores]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 md:px-8 py-16 max-w-7xl mx-auto w-full mt-16">
        <div className="mb-8">
          <Link to="/assessment/riasec" className="inline-flex items-center text-brand-purple hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold">Your RIASEC Results</h1>
          <p className="text-gray-600 mt-2">
            Based on your responses, here are your RIASEC personality type results
          </p>
        </div>

        <StudentInfoCard studentDetails={studentDetails} />

        <RIASECResultsContent 
          scores={scores}
          riasecTypes={riasecTypes}
          studentDetails={studentDetails}
        />
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

export default RIASECResults;
