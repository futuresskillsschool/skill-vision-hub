import { useEffect, useRef, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Star, User, School, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const RIASECResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { user, storeAssessmentResult } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  const scores: RIASECScores = location.state?.scores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  useEffect(() => {
    if (!location.state) {
      navigate('/assessment/riasec');
      return;
    }
    
    window.scrollTo(0, 0);
    
    const fetchStudentDetails = async () => {
      if (location.state?.studentId) {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', location.state.studentId)
            .single();
            
          if (error) {
            console.error('Error fetching student details:', error);
            if (user) {
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
            }
            return;
          }
          
          if (data) {
            setStudentDetails(data as StudentDetails);
          }
        } catch (error) {
          console.error('Error in student details fetch:', error);
        }
      } else if (user) {
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
      }
    };
    
    fetchStudentDetails();
    
    const saveResultsToDB = async () => {
      if (user && scores) {
        try {
          console.log('Saving RIASEC results to database for user:', user.id);
          
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
            .upsert({
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
      }
    };
    
    saveResultsToDB();
    
  }, [location.state, navigate, user, scores]);
  
  const sortedTypes = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([type]) => type as keyof typeof riasecTypes);
  
  const primaryType = sortedTypes[0];
  const secondaryType = sortedTypes[1];
  const tertiaryType = sortedTypes[2];
  
  const totalQuestions = Object.values(scores).reduce((a, b) => a + b, 0);
  
  const getPercentage = (score: number) => {
    return Math.round((score / totalQuestions) * 100);
  };
  
  const downloadResults = async () => {
    if (!resultsRef.current) return;
    
    try {
      setIsDownloading(true);
      toast.loading("Generating your PDF report...");
      
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true,
        onclone: (document, element) => {
          const allElements = element.querySelectorAll('*');
          allElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.display = el.style.display === 'none' ? 'block' : el.style.display;
              
              if (el.classList.contains('bg-white')) {
                el.style.backgroundColor = '#ffffff';
              }
              
              if (el.classList.contains('bg-opacity-50') || 
                  el.classList.contains('bg-opacity-25') || 
                  el.classList.contains('backdrop-blur-sm')) {
                el.classList.remove('bg-opacity-50', 'bg-opacity-25', 'backdrop-blur-sm');
                el.style.backgroundColor = '#ffffff';
              }
            }
          });
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RIASEC Assessment Results', pdfWidth / 2, 20, { align: 'center' });
      
      if (studentDetails) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Student: ${studentDetails.name}`, 15, 35);
        pdf.text(`Class: ${studentDetails.class} - ${studentDetails.section}`, 15, 43);
        pdf.text(`School: ${studentDetails.school}`, 15, 51);
      }
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 60) / imgHeight);
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      const x = (pdfWidth - scaledWidth) / 2;
      const y = studentDetails ? 60 : 30;
      
      if (scaledHeight > (pdfHeight - y - 10)) {
        const contentPerPage = (pdfHeight - y - 20);
        const totalPages = Math.ceil(scaledHeight / contentPerPage);
        
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) pdf.addPage();
          
          if (i === 0) {
            pdf.addImage(
              imgData,
              'PNG',
              x,
              y,
              scaledWidth,
              Math.min(contentPerPage, scaledHeight)
            );
          } else {
            const virtualYPos = contentPerPage * i;
            pdf.addImage(
              imgData,
              'PNG',
              x,
              15 - virtualYPos * (ratio / 2),
              scaledWidth,
              scaledHeight
            );
          }
          
          pdf.setFontSize(10);
          pdf.text(`Page ${i + 1} of ${totalPages}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
        }
      } else {
        pdf.addImage(
          imgData, 
          'PNG', 
          x, 
          y, 
          scaledWidth, 
          scaledHeight
        );
      }
      
      pdf.save('RIASEC-Assessment-Results.pdf');
      toast.success("Your PDF report is ready!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("There was an error generating your PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  if (!primaryType) return null;
  
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
                className="mb-4 text-brand-purple hover:text-brand-purple/80 -ml-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your RIASEC Results</h1>
              <p className="text-foreground/70 max-w-3xl">
                Based on your answers, we've identified your dominant personality types according to the Holland Code (RIASEC) model.
                These insights can help guide your career exploration and educational choices.
              </p>
            </div>
            
            <Button 
              className="flex items-center bg-brand-purple text-white hover:bg-brand-purple/90 mt-4 md:mt-0"
              onClick={downloadResults}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" /> {isDownloading ? 'Generating PDF...' : 'Download Results'}
            </Button>
          </div>
          
          {studentDetails && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-purple/10 rounded-xl p-4 md:p-6 mb-6 max-w-4xl mx-auto"
            >
              <h2 className="text-xl font-semibold mb-3 text-brand-purple">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-brand-purple mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{studentDetails.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-brand-purple mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Class & Section</p>
                    <p className="font-medium">{studentDetails.class} - {studentDetails.section}</p>
                  </div>
                </div>
                <div className="flex items-center md:col-span-2">
                  <School className="h-5 w-5 text-brand-purple mr-2" />
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
            id="results-content"
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl mx-auto animate-fade-in"
          >
            <div className="bg-brand-purple/10 p-6 md:p-8 border-b border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-brand-purple mb-1">RIASEC Assessment Results</h2>
                  <p className="text-foreground/70">Your Holland Code: <span className="font-semibold">{primaryType}{secondaryType}{tertiaryType}</span></p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className="flex items-center bg-brand-purple/20 px-3 py-1 rounded-full text-sm font-medium text-brand-purple">
                    <Star className="h-4 w-4 mr-1 fill-brand-purple" />
                    {totalQuestions} Questions Analyzed
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className={`w-6 h-6 rounded-full mr-2 ${riasecTypes[primaryType].color}`}></span>
                  Your Primary Type: {riasecTypes[primaryType].name} ({riasecTypes[primaryType].title})
                </h3>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <p className="mb-4">{riasecTypes[primaryType].description}</p>
                  
                  <h4 className="font-medium mb-2">Your {riasecTypes[primaryType].name} strengths include:</h4>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    {riasecTypes[primaryType].skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className={`w-5 h-5 rounded-full mr-2 ${riasecTypes[secondaryType].color}`}></span>
                    Secondary: {riasecTypes[secondaryType].name}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="mb-3 text-sm">{riasecTypes[secondaryType].description}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className={`w-5 h-5 rounded-full mr-2 ${riasecTypes[tertiaryType].color}`}></span>
                    Tertiary: {riasecTypes[tertiaryType].name}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="mb-3 text-sm">{riasecTypes[tertiaryType].description}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Your RIASEC Profile</h3>
                
                <div className="space-y-4">
                  {Object.entries(scores).map(([type, score]) => (
                    <div key={type}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{riasecTypes[type as keyof typeof riasecTypes].name}</span>
                        <span>{score}/{totalQuestions} ({getPercentage(score)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${riasecTypes[type as keyof typeof riasecTypes].color}`}
                          style={{ width: `${getPercentage(score)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Potential Career Paths</h3>
                <p className="mb-4">Based on your Holland Code ({primaryType}{secondaryType}{tertiaryType}), here are some career paths that might interest you:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className={`w-4 h-4 rounded-full mr-2 ${riasecTypes[primaryType].color}`}></span>
                      {riasecTypes[primaryType].name} Careers
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {riasecTypes[primaryType].careers.slice(0, 5).map((career, index) => (
                        <li key={index}>{career}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className={`w-4 h-4 rounded-full mr-2 ${riasecTypes[secondaryType].color}`}></span>
                      {riasecTypes[secondaryType].name} Careers
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {riasecTypes[secondaryType].careers.slice(0, 5).map((career, index) => (
                        <li key={index}>{career}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className={`w-4 h-4 rounded-full mr-2 ${riasecTypes[tertiaryType].color}`}></span>
                      {riasecTypes[tertiaryType].name} Careers
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {riasecTypes[tertiaryType].careers.slice(0, 5).map((career, index) => (
                        <li key={index}>{career}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-foreground/70">
                <p>
                  Note: This assessment is based on the Holland Occupational Themes (RIASEC) model developed by psychologist John Holland. 
                  The results are meant to provide guidance and self-awareness, not to limit your options.
                  Consider exploring careers that combine elements of your top interest areas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Want to explore more about your career options?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment/career-vision">
                <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple/5">
                  Try Career Vision Assessment
                </Button>
              </Link>
              <Link to="/assessment/future-pathways">
                <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple/5">
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

export default RIASECResults;
