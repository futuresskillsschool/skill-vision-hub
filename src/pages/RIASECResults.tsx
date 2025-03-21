
import { useEffect, useRef, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Star } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

// Define RIASEC types and descriptions
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
    ],
    subjects: [
      'Woodworking',
      'Auto/Shop Class',
      'Physical Education',
      'Engineering',
      'Computer Hardware'
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
    ],
    subjects: [
      'Science',
      'Mathematics',
      'Computer Science',
      'Research Projects',
      'Engineering'
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
    ],
    subjects: [
      'Art',
      'Music',
      'Drama/Theater',
      'Creative Writing',
      'Graphic Design'
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
    ],
    subjects: [
      'Psychology',
      'Sociology',
      'Health Sciences',
      'Education',
      'Community Service'
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
    ],
    subjects: [
      'Business Studies',
      'Debate Club',
      'Student Government',
      'Economics',
      'Marketing'
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
    ],
    subjects: [
      'Accounting',
      'Business Math',
      'Computer Applications',
      'Filing/Record Keeping',
      'Statistics'
    ]
  }
};

type RIASECScores = {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
};

const RIASECResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Get scores from location state or set default values
  const scores: RIASECScores = location.state?.scores || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  useEffect(() => {
    if (!location.state) {
      // If no scores are provided, redirect to the assessment
      navigate('/riasec');
    }
    
    window.scrollTo(0, 0);
    
    // Save results to database if user is logged in
    const saveResults = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && location.state) {
        // Store assessment results
        try {
          const { error } = await supabase
            .from('assessment_results')
            .upsert({
              user_id: user.id,
              assessment_type: 'riasec',
              results: scores,
              primary_result: Object.entries(scores)
                .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                .map(([type]) => riasecTypes[type as keyof typeof riasecTypes].name)
                .slice(0, 3)
                .join(', '),
              completed_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,assessment_type'
            });
            
          if (error) throw error;
        } catch (error) {
          console.error('Error saving assessment results:', error);
        }
      }
    };
    
    saveResults();
  }, [location.state, navigate, scores]);
  
  // Get the top 3 personality types
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
      setIsGeneratingPDF(true);
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your results...",
      });
      
      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Capture the results container with improved settings
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      });
      
      // Create PDF with proper dimensions
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add image to first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if the content exceeds one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('RIASEC-Assessment-Results.pdf');
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your results have been downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem generating your PDF. Please try again.",
      });
    } finally {
      setIsGeneratingPDF(false);
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
              disabled={isGeneratingPDF}
            >
              <Download className="mr-2 h-4 w-4" /> 
              {isGeneratingPDF ? "Generating PDF..." : "Download Results"}
            </Button>
          </div>
          
          {/* Results container - this will be captured for PDF */}
          <div 
            ref={resultsRef}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl mx-auto animate-fade-in"
          >
            {/* Header */}
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
            
            {/* Main content */}
            <div className="p-6 md:p-8">
              {/* Primary type */}
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
                  
                  <h4 className="font-medium mb-2">School subjects that might interest you:</h4>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    {riasecTypes[primaryType].subjects.map((subject, index) => (
                      <li key={index}>{subject}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Secondary & Tertiary types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className={`w-5 h-5 rounded-full mr-2 ${riasecTypes[secondaryType].color}`}></span>
                    Secondary: {riasecTypes[secondaryType].name}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="mb-3 text-sm">{riasecTypes[secondaryType].description}</p>
                    <h4 className="font-medium mb-2 text-sm">Subjects you might enjoy:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {riasecTypes[secondaryType].subjects.slice(0, 3).map((subject, index) => (
                        <li key={index}>{subject}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className={`w-5 h-5 rounded-full mr-2 ${riasecTypes[tertiaryType].color}`}></span>
                    Tertiary: {riasecTypes[tertiaryType].name}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="mb-3 text-sm">{riasecTypes[tertiaryType].description}</p>
                    <h4 className="font-medium mb-2 text-sm">Subjects you might enjoy:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {riasecTypes[tertiaryType].subjects.slice(0, 3).map((subject, index) => (
                        <li key={index}>{subject}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* RIASEC Profile */}
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
              
              {/* Career suggestions */}
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
              
              {/* Footer note */}
              <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-foreground/70">
                <p>
                  Note: This assessment is based on the Holland Occupational Themes (RIASEC) model developed by psychologist John Holland. 
                  The results are meant to provide guidance and self-awareness, not to limit your options.
                  Consider exploring careers that combine elements of your top interest areas.
                </p>
              </div>
            </div>
          </div>
          
          {/* Call to action */}
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
