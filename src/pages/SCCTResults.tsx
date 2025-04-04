import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  BrainCircuit, 
  CheckCircle2, 
  XCircle,
  User,
  School,
  BookOpen,
  Star,
  Loader2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Bar 
} from 'recharts';

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const careerSuggestions = {
  self_efficacy: {
    high: [
      "Leadership positions",
      "Public speaking roles",
      "Entrepreneurship",
      "Competitive fields",
      "Project management"
    ],
    low: [
      "Structured environments",
      "Mentored positions",
      "Collaborative roles",
      "Step-by-step learning paths",
      "Positions with clear expectations"
    ]
  },
  outcome_expectations: {
    high: [
      "Long-term career paths",
      "Fields requiring commitment",
      "Higher education tracks",
      "Specialized professions",
      "Role model positions"
    ],
    low: [
      "Short-term rewarding roles",
      "Careers with visible outcomes",
      "Internships and shadowing",
      "Career exposure programs",
      "Positions with quick feedback loops"
    ]
  },
  career_interests: {
    investigative: "Science, Research, Analytics, Technology",
    artistic: "Design, Media, Creative Writing, Performing Arts",
    enterprising: "Business, Politics, Management, Sales",
    social: "Teaching, Counseling, Healthcare, Community Service",
    conventional: "Accounting, Administration, Data Management, Quality Control"
  },
  environmental_support: {
    high: [
      "Independent career paths",
      "Self-directed learning",
      "Remote work opportunities",
      "Creative entrepreneurship",
      "Cross-disciplinary careers"
    ],
    low: [
      "Structured mentorship programs",
      "Team-based environments",
      "Career guidance services",
      "Professional networks",
      "Supportive work cultures"
    ]
  },
  perceived_barriers: {
    high: [
      "Careers with strong support systems",
      "Inclusive workplace environments",
      "Fields with good entry-level opportunities",
      "Careers with multiple entry paths",
      "Step-by-step professional development tracks"
    ],
    low: [
      "Competitive fields",
      "Paths requiring risk-taking",
      "Leadership positions",
      "Innovative industries",
      "Entrepreneurial ventures"
    ]
  }
};

const developmentStrategies = {
  self_efficacy: {
    high: [
      "Take on leadership roles in extracurricular activities",
      "Participate in debate or public speaking competitions",
      "Mentor others in your areas of strength",
      "Challenge yourself with increasingly difficult projects",
      "Journal about successful experiences to reinforce confidence"
    ],
    low: [
      "Break tasks into smaller, achievable steps",
      "Find a mentor who can provide guidance and support",
      "Practice skills in safe, low-pressure environments",
      "Focus on improvement rather than perfection",
      "Celebrate small successes and progress"
    ]
  },
  outcome_expectations: {
    high: [
      "Research career paths of role models you admire",
      "Set long-term goals with meaningful milestones",
      "Connect with professionals through informational interviews",
      "Explore how your values align with different career options",
      "Create a vision board of your career aspirations"
    ],
    low: [
      "Learn about success stories in fields you're interested in",
      "Seek out information about job satisfaction in different careers",
      "Explore the connection between education and career outcomes",
      "Participate in career fairs and information sessions",
      "Identify short-term benefits of pursuing your interests"
    ]
  },
  career_interests: {
    general: [
      "Take career interest inventories and assessments",
      "Try volunteering in different fields",
      "Shadow professionals in various careers",
      "Join clubs or activities related to potential interests",
      "Take diverse elective courses to explore new subjects"
    ]
  },
  environmental_support: {
    high: [
      "Leverage your support network for opportunities",
      "Seek out advanced learning opportunities",
      "Share your goals with supportive people in your life",
      "Use available resources to explore career options",
      "Connect with school counselors and career services"
    ],
    low: [
      "Research online communities related to your interests",
      "Find mentoring programs in your area or online",
      "Look for scholarships and financial aid opportunities",
      "Connect with teachers or professionals for guidance",
      "Seek out free career development resources online"
    ]
  },
  perceived_barriers: {
    high: [
      "Identify specific concerns and research solutions",
      "Connect with people who have overcome similar challenges",
      "Break long-term goals into manageable steps",
      "Seek out diversity and inclusion programs in your field of interest",
      "Practice positive self-talk and mindfulness"
    ],
    low: [
      "Take on challenges that push your comfort zone",
      "Set stretch goals in addition to achievable ones",
      "Explore careers that might seem out of reach",
      "Network with professionals in competitive fields",
      "Consider entrepreneurial opportunities"
    ]
  }
};

type Section = {
  id: string;
  title: string;
  description: string;
  interpretation: {
    high: string;
    low: string;
  };
};

type Answer = {
  questionId: number;
  answer: number;
  section: string;
};

type SCCTScores = Record<string, number>;

const SCCTResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [tabValue, setTabValue] = useState("overview");
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const { user, storeAssessmentResult } = useAuth();
  
  const scores: SCCTScores = location.state?.scores || {};
  const sections: Section[] = location.state?.sections || [];
  const answers: Answer[] = location.state?.answers || [];
  const studentId = location.state?.studentId;
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!location.state) {
      navigate('/assessment/scct');
      return;
    }
    
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
            return;
          }
          
          if (data) {
            setStudentDetails(data as StudentDetails);
          }
        } catch (error) {
          console.error('Error in student details fetch:', error);
        }
      }
    };
    
    fetchStudentDetails();
    
    if (user) {
      const saveResult = async () => {
        try {
          await storeAssessmentResult('scct', { scores, sections, answers });
        } catch (error) {
          console.error('Error saving assessment result:', error);
        }
      };
      
      saveResult();
    }
  }, [location.state, navigate, user, storeAssessmentResult, scores, sections, answers, studentId]);
  
  const maxSectionScore = 25;
  
  const getSectionLevel = (sectionId: string) => {
    const score = scores[sectionId] || 0;
    const percentage = (score / maxSectionScore) * 100;
    
    if (percentage >= 70) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
  };
  
  const getInterpretation = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const level = getSectionLevel(sectionId);
    
    if (!section) return '';
    
    return level === 'high' ? section.interpretation.high : section.interpretation.low;
  };
  
  const getChartData = () => {
    return sections.map(section => {
      const rawScore = scores[section.id] || 0;
      
      if (section.id === 'perceived_barriers') {
        return {
          name: section.title.split('(')[0].trim(),
          score: ((maxSectionScore - rawScore) / maxSectionScore) * 100
        };
      }
      
      return {
        name: section.title.split('(')[0].trim(),
        score: (rawScore / maxSectionScore) * 100
      };
    });
  };
  
  const getCareerInterestsData = () => {
    const careerQuestions = answers.filter(a => a.section === 'career_interests');
    const interestAreas = ['Investigative', 'Artistic', 'Enterprising', 'Social', 'Conventional'];
    
    const questionMapping: Record<number, string> = {
      11: 'Investigative',
      12: 'Artistic',
      13: 'Enterprising',
      14: 'Social',
      15: 'Conventional'
    };
    
    return interestAreas.map(area => {
      const question = careerQuestions.find(q => 
        questionMapping[q.questionId] === area
      );
      return {
        name: area,
        score: question ? (question.answer + 1) : 0
      };
    });
  };
  
  const getCareerSuggestions = () => {
    const suggestions: string[] = [];
    
    const selfEfficacyLevel = getSectionLevel('self_efficacy');
    if (selfEfficacyLevel === 'high' || selfEfficacyLevel === 'medium') {
      suggestions.push(...careerSuggestions.self_efficacy.high.slice(0, 3));
    } else {
      suggestions.push(...careerSuggestions.self_efficacy.low.slice(0, 3));
    }
    
    const outcomeExpectationsLevel = getSectionLevel('outcome_expectations');
    if (outcomeExpectationsLevel === 'high' || outcomeExpectationsLevel === 'medium') {
      suggestions.push(...careerSuggestions.outcome_expectations.high.slice(0, 2));
    } else {
      suggestions.push(...careerSuggestions.outcome_expectations.low.slice(0, 2));
    }
    
    const perceivedBarriersLevel = getSectionLevel('perceived_barriers');
    if (perceivedBarriersLevel === 'high') {
      suggestions.push(...careerSuggestions.perceived_barriers.high.slice(0, 2));
    } else {
      suggestions.push(...careerSuggestions.perceived_barriers.low.slice(0, 2));
    }
    
    return [...new Set(suggestions)];
  };
  
  const getDevelopmentStrategies = () => {
    const strategies: string[] = [];
    
    const selfEfficacyLevel = getSectionLevel('self_efficacy');
    if (selfEfficacyLevel === 'high' || selfEfficacyLevel === 'medium') {
      strategies.push(...developmentStrategies.self_efficacy.high.slice(0, 2));
    } else {
      strategies.push(...developmentStrategies.self_efficacy.low.slice(0, 2));
    }
    
    const outcomeExpectationsLevel = getSectionLevel('outcome_expectations');
    if (outcomeExpectationsLevel === 'high' || outcomeExpectationsLevel === 'medium') {
      strategies.push(...developmentStrategies.outcome_expectations.high.slice(0, 2));
    } else {
      strategies.push(...developmentStrategies.outcome_expectations.low.slice(0, 2));
    }
    
    strategies.push(...developmentStrategies.career_interests.general.slice(0, 2));
    
    const environmentalSupportLevel = getSectionLevel('environmental_support');
    if (environmentalSupportLevel === 'high' || environmentalSupportLevel === 'medium') {
      strategies.push(...developmentStrategies.environmental_support.high.slice(0, 2));
    } else {
      strategies.push(...developmentStrategies.environmental_support.low.slice(0, 2));
    }
    
    const perceivedBarriersLevel = getSectionLevel('perceived_barriers');
    if (perceivedBarriersLevel === 'high') {
      strategies.push(...developmentStrategies.perceived_barriers.high.slice(0, 2));
    } else {
      strategies.push(...developmentStrategies.perceived_barriers.low.slice(0, 2));
    }
    
    return [...new Set(strategies)];
  };
  
  const handleGeneratePDF = async () => {
    if (!resultsRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      toast({
        title: "Generating PDF",
        description: "Please wait while we prepare your results...",
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const coverPageElement = document.createElement('div');
      coverPageElement.style.width = '800px';
      coverPageElement.style.padding = '40px';
      coverPageElement.style.backgroundColor = 'white';
      coverPageElement.style.fontFamily = 'Arial, sans-serif';
      
      coverPageElement.innerHTML = `
        <div style="padding: 20px; height: 900px; display: flex; flex-direction: column; background-color: white; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-top: 40px;">
            <h1 style="font-size: 32px; color: #4CAF50; margin-bottom: 10px; font-weight: bold;">SCCT Assessment Results</h1>
            <p style="font-size: 20px; color: #333; margin-bottom: 30px; font-style: italic;">Social Cognitive Career Theory Profile</p>
            <div style="margin: 40px auto; width: 120px; height: 120px; background-color: #e6f7e6; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <span style="font-size: 60px; color: #4CAF50;">📊</span>
            </div>
          </div>
          ${studentDetails ? `
            <div style="margin-top: 40px; padding: 25px; border: 2px solid #4CAF50; border-radius: 10px; background-color: #f9f9f9; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h2 style="font-size: 24px; color: #333; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Student Information</h2>
              <div style="display: flex; margin-bottom: 15px;">
                <div style="width: 140px; font-weight: bold; font-size: 16px; color: #4a4a4a;">Name:</div>
                <div style="font-size: 16px; color: #333;">${studentDetails.name}</div>
              </div>
              <div style="display: flex; margin-bottom: 15px;">
                <div style="width: 140px; font-weight: bold; font-size: 16px; color: #4a4a4a;">Class & Section:</div>
                <div style="font-size: 16px; color: #333;">${studentDetails.class} - ${studentDetails.section}</div>
              </div>
              <div style="display: flex;">
                <div style="width: 140px; font-weight: bold; font-size: 16px; color: #4a4a4a;">School:</div>
                <div style="font-size: 16px; color: #333;">${studentDetails.school}</div>
              </div>
            </div>
          ` : ''}
          <div style="margin-top: auto; text-align: center; font-size: 14px; color: #666; padding: 20px; background-color: #f5f5f5; border-radius: 5px; margin-top: 40px;">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p style="font-style: italic; margin-top: 5px; color: #4CAF50;">This report provides insights based on your responses to the SCCT assessment.</p>
          </div>
        </div>
      `;
      document.body.appendChild(coverPageElement);
      
      const coverPageCanvas = await html2canvas(coverPageElement, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      document.body.removeChild(coverPageElement);
      
      const coverPageImgData = coverPageCanvas.toDataURL('image/png');
      pdf.addImage(
        coverPageImgData,
        'PNG',
        0,
        0,
        pdfWidth,
        pdfHeight
      );
      
      const sectionsToCapture = resultsRef.current.querySelectorAll('.pdf-section');
      
      if (sectionsToCapture.length > 0) {
        for (let i = 0; i < sectionsToCapture.length; i++) {
          pdf.addPage();
          
          const section = sectionsToCapture[i] as HTMLElement;
          
          const tempSection = section.cloneNode(true) as HTMLElement;
          tempSection.style.width = '800px';
          tempSection.style.backgroundColor = 'white';
          tempSection.style.padding = '30px';
          tempSection.style.boxSizing = 'border-box';
          tempSection.style.fontSize = '14px';
          
          const headings = tempSection.querySelectorAll('h1, h2, h3, h4, h5, h6');
          headings.forEach((heading: HTMLElement) => {
            heading.style.fontSize = '24px';
            heading.style.marginBottom = '15px';
            heading.style.color = '#4CAF50';
            heading.style.fontWeight = 'bold';
            heading.style.borderBottom = '1px solid #eee';
            heading.style.paddingBottom = '8px';
          });
          
          const paragraphs = tempSection.querySelectorAll('p, li, span');
          paragraphs.forEach((p: HTMLElement) => {
            p.style.fontSize = '15px';
            p.style.lineHeight = '1.6';
            p.style.color = '#333';
          });
          
          const cards = tempSection.querySelectorAll('.card, div[class*="bg-"]');
          cards.forEach((card: HTMLElement) => {
            card.style.border = '1px solid #e0e0e0';
            card.style.borderRadius = '8px';
            card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
            card.style.padding = '15px';
            card.style.marginBottom = '20px';
          });
          
          document.body.appendChild(tempSection);
          
          const canvas = await html2canvas(tempSection, {
            scale: 2,
            backgroundColor: '#FFFFFF',
            logging: false,
            useCORS: true,
            allowTaint: true
          });
          document.body.removeChild(tempSection);
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          
          const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 20) / imgHeight);
          const scaledWidth = imgWidth * ratio;
          const scaledHeight = imgHeight * ratio;
          
          const x = (pdfWidth - scaledWidth) / 2;
          const y = 10;
          
          pdf.addImage(
            imgData,
            'PNG',
            x,
            y,
            scaledWidth,
            scaledHeight
          );
        }
      } else {
        pdf.addPage();
        
        const tempResults = resultsRef.current.cloneNode(true) as HTMLElement;
        tempResults.style.width = '800px';
        tempResults.style.backgroundColor = 'white';
        tempResults.style.padding = '30px';
        tempResults.style.fontSize = '15px';
        
        const headings = tempResults.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading: HTMLElement) => {
          heading.style.fontSize = '24px';
          heading.style.marginBottom = '15px';
          heading.style.color = '#4CAF50';
          heading.style.fontWeight = 'bold';
        });
        
        const paragraphs = tempResults.querySelectorAll('p, li, span');
        paragraphs.forEach((p: HTMLElement) => {
          p.style.fontSize = '15px';
          p.style.lineHeight = '1.6';
          p.style.color = '#333';
        });
        
        const cards = tempResults.querySelectorAll('.card, div[class*="bg-"]');
        cards.forEach((card: HTMLElement) => {
          card.style.border = '1px solid #e0e0e0';
          card.style.borderRadius = '8px';
          card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        });
        
        document.body.appendChild(tempResults);
        
        const canvas = await html2canvas(tempResults, {
          scale: 2,
          backgroundColor: '#FFFFFF',
          logging: false,
          useCORS: true,
          allowTaint: true
        });
        document.body.removeChild(tempResults);
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 20) / imgHeight);
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;
        
        const x = (pdfWidth - scaledWidth) / 2;
        const y = 10;
        
        pdf.addImage(
          imgData,
          'PNG',
          x,
          y,
          scaledWidth,
          scaledHeight
        );
      }
      
      pdf.save('SCCT-Assessment-Results.pdf');
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your results have been downloaded as a PDF.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error Generating PDF",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  if (Object.keys(scores).length === 0 || sections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">No Results Available</h1>
            <p className="mb-8">No assessment results were found. Please complete the assessment first.</p>
            <Button 
              onClick={() => navigate('/assessment/scct/take')}
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              Take SCCT Assessment
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
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
                className="mb-4 text-brand-green hover:text-brand-green/80 -ml-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your SCCT Assessment Results</h1>
              <p className="text-foreground/70 max-w-3xl">
                Here's a detailed analysis of your responses to help you understand your career potential.
              </p>
            </div>
            
            <Button 
              className="flex items-center bg-brand-green text-white hover:bg-brand-green/90 mt-4 md:mt-0"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> 
                  Download Results
                </>
              )}
            </Button>
          </div>
          
          {studentDetails && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-green/10 rounded-xl p-4 md:p-6 mb-6 max-w-4xl mx-auto"
            >
              <h2 className="text-xl font-semibold mb-3 text-brand-green">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-brand-green mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{studentDetails.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-brand-green mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Class & Section</p>
                    <p className="font-medium">{studentDetails.class} - {studentDetails.section}</p>
                  </div>
                </div>
                <div className="flex items-center md:col-span-2">
                  <School className="h-5 w-5 text-brand-green mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">School</p>
                    <p className="font-medium">{studentDetails.school}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={resultsRef} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl mx-auto animate-fade-in pdf-section">
              <div className="bg-brand-green/10 p-6 md:p-8 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-green mb-1">SCCT Assessment Results</h2>
                    <p className="text-foreground/70">Social Cognitive Career Theory Profile</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="flex items-center bg-brand-green/20 px-3 py-1 rounded-full text-sm font-medium text-brand-green">
                      <Star className="h-4 w-4 mr-1 fill-brand-green" />
                      {answers.length} Questions Analyzed
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <div className="mb-10 pdf-section">
                  <h3 className="text-xl font-semibold mb-6">Your SCCT Profile</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getChartData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <Radar name="Score" dataKey="score" fill="#4CAF50" fillOpacity={0.6} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Note: For 'Perceived Barriers,' higher scores on the chart indicate fewer barriers to career development.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 pdf-section">
                  {sections.map((section) => {
                    const sectionScore = scores[section.id] || 0;
                    const percentage = (sectionScore / maxSectionScore) * 100;
                    const level = getSectionLevel(section.id);
                    
                    return (
                      <Card key={section.id} className="border-gray-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{section.id === 'perceived_barriers' ? 'Level of Barriers' : 'Score'}</span>
                              <span className="text-sm font-medium">{sectionScore}/{maxSectionScore} ({Math.round(percentage)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  section.id === 'perceived_barriers'
                                    ? (level === 'high' ? 'bg-yellow-500' : level === 'medium' ? 'bg-blue-500' : 'bg-green-500')
                                    : (level === 'high' ? 'bg-green-500' : level === 'medium' ? 'bg-blue-500' : 'bg-yellow-500')
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <p className="text-sm mt-4">
                            <span className="font-medium">Interpretation:</span>{' '}
                            {getInterpretation(section.id)}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="mb-10 pdf-section">
                  <h3 className="text-xl font-semibold mb-6">Your Career Interests</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getCareerInterestsData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Interest Areas Explained:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><span className="font-medium">Investigative:</span> Science, research, analytics, technology</li>
                        <li><span className="font-medium">Artistic:</span> Design, media, creative writing, performing arts</li>
                        <li><span className="font-medium">Enterprising:</span> Business, politics, management, sales</li>
                        <li><span className="font-medium">Social:</span> Teaching, counseling, healthcare, community service</li>
                        <li><span className="font-medium">Conventional:</span> Accounting, administration, data management</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Your Top Interest Areas:</h4>
                      <p className="text-sm">
                        Based on your responses, you show strongest interest in the areas that scored highest
                        on the chart. These interests can guide your exploration of related career fields and
                        educational opportunities.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-10 pdf-section">
                  <h3 className="text-xl font-semibold mb-4">Career Path Suggestions</h3>
                  <p className="mb-4 text-sm">
                    Based on your unique profile, here are some career directions that may align with your
                    pattern of confidence, expectations, interests, and perceived barriers:
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getCareerSuggestions().map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-brand-green/20 rounded-full flex items-center justify-center text-brand-green mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mb-6 pdf-section">
                  <h3 className="text-xl font-semibold mb-4">Recommended Development Strategies</h3>
                  <p className="mb-4 text-sm">
                    These personalized strategies can help you develop your career readiness based on your SCCT profile:
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <ul className="space-y-4">
                      {getDevelopmentStrategies().map((strategy, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-brand-green/20 rounded-full flex items-center justify-center text-brand-green mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-foreground/70">
                  <p>
                    Note: This assessment is based on Social Cognitive Career Theory developed by Robert Lent, Steven Brown, and Gail Hackett.
                    The results are meant to provide guidance and self-awareness, not to limit your options.
                    Consider discussing these results with a career counselor or mentor for deeper insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Want to explore more about your career options?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment/riasec">
                <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green/5">
                  Try RIASEC Assessment
                </Button>
              </Link>
              <Link to="/assessment/future-pathways">
                <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green/5">
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
