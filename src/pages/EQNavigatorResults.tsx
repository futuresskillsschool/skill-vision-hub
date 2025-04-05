import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Download, 
  BarChart3, 
  Heart,
  User,
  School,
  BookOpen,
  Grid
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const EQNavigatorResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { user, storeAssessmentResult } = useAuth();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  const resultsData = location.state;
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!resultsData) {
      navigate('/assessment/eq-navigator');
      return;
    }
    
    const fetchStudentDetails = async () => {
      if (resultsData?.studentId) {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', resultsData.studentId)
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
      if (user && resultsData) {
        try {
          const { scores, studentId } = resultsData;
          
          const scoresObject: Record<string, number> = {};
          Object.entries(scores).forEach(([key, value]) => {
            scoresObject[key] = value;
          });
          
          const resultData = {
            scores: scoresObject,
            studentId: studentId
          };
          
          const { error } = await supabase
            .from('assessment_results')
            .upsert({
              user_id: user.id,
              assessment_type: 'eq-navigator',
              result_data: resultData
            });
            
          if (error) {
            console.error('Error saving results to database:', error);
          } else {
            console.log('EQ Navigator results saved successfully');
          }
        } catch (error) {
          console.error('Exception when saving results:', error);
        }
      }
    };
    
    saveResultsToDB();
  }, [location.state, navigate, user, resultsData]);
  
  if (!resultsData) {
    return null;
  }
  
  const { scores } = resultsData;
  
  const chartData = Object.entries(scores).map(([domain, score]) => ({
    domain,
    score,
    fullMark: 10
  }));
  
  const handleGeneratePDF = async () => {
    if (!resultsRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      toast.loading("Generating your PDF report...");
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      const addStyledText = (text: string, x: number, y: number, size: number, style: string = 'normal', align: 'left' | 'center' | 'right' = 'left', color: string = '#000000') => {
        pdf.setTextColor(color);
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.text(text, x, y, { align });
      };
      
      pdf.setFillColor(255, 245, 230);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setFillColor(255, 230, 200, 0.5);
      pdf.circle(170, 240, 30, 'F');
      
      pdf.setFillColor(255, 210, 170, 0.5);
      pdf.circle(40, 260, 20, 'F');
      
      addStyledText('EQ NAVIGATOR', pageWidth/2, 70, 28, 'bold', 'center', '#F97316');
      addStyledText('ASSESSMENT RESULTS', pageWidth/2, 85, 24, 'bold', 'center', '#F97316');
      
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      addStyledText(`Report Generated: ${currentDate}`, pageWidth/2, 105, 12, 'italic', 'center', '#555555');
      
      if (studentDetails) {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'F');
        pdf.setDrawColor(255, 204, 153);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'S');
        
        addStyledText('STUDENT INFORMATION', margin + 10, 135, 14, 'bold', 'left', '#F97316');
        pdf.setLineWidth(0.5);
        pdf.setDrawColor('#F97316');
        pdf.line(margin + 10, 138, margin + 80, 138);
        
        addStyledText('Name:', margin + 10, 155, 12, 'bold', 'left', '#333333');
        addStyledText(studentDetails.name, margin + 50, 155, 12, 'normal', 'left', '#333333');
        
        addStyledText('Class:', margin + 10, 170, 12, 'bold', 'left', '#333333');
        addStyledText(`${studentDetails.class} - ${studentDetails.section}`, margin + 50, 170, 12, 'normal', 'left', '#333333');
        
        addStyledText('School:', margin + 10, 185, 12, 'bold', 'left', '#333333');
        addStyledText(studentDetails.school, margin + 50, 185, 12, 'normal', 'left', '#333333');
      }
      
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'F');
      pdf.setDrawColor(255, 204, 153);
      pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'S');
      
      addStyledText('ABOUT THIS ASSESSMENT', margin + 10, 220, 14, 'bold', 'left', '#F97316');
      pdf.line(margin + 10, 223, margin + 85, 223);
      
      addStyledText('The EQ Navigator Assessment measures key areas of emotional intelligence:', 
        margin + 10, 235, 10, 'normal', 'left', '#333333');
      addStyledText('• Self-Awareness: Understanding your emotions and their impact', 
        margin + 10, 247, 10, 'normal', 'left', '#333333');
      addStyledText('• Self-Regulation: Managing your emotions effectively', 
        margin + 10, 257, 10, 'normal', 'left', '#333333');
      addStyledText('• Social Skills: Building and maintaining relationships', 
        margin + 10, 267, 10, 'normal', 'left', '#333333');
      
      addStyledText('EQ Navigator Assessment Results', pageWidth/2, 285, 9, 'italic', 'center', '#555555');
      addStyledText('Page 1', margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
      
      const addPageHeader = (pageNumber: number) => {
        pdf.setFillColor(255, 245, 230);
        pdf.rect(0, 0, pageWidth, 20, 'F');
        
        addStyledText('EQ Navigator Assessment', margin, 15, 10, 'italic', 'left', '#555555');
        addStyledText('Emotional Intelligence Profile', pageWidth - margin, 15, 12, 'bold', 'right', '#F97316');
        
        pdf.setDrawColor(255, 204, 153);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 20, pageWidth - margin, 20);
        
        addStyledText(`Page ${pageNumber}`, margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
        addStyledText(currentDate, pageWidth - margin, pageHeight - 10, 9, 'normal', 'right', '#555555');
      };
      
      pdf.addPage();
      addPageHeader(2);
      
      let yPosition = 40;
      
      addStyledText('Your EQ Profile', pageWidth/2, yPosition, 18, 'bold', 'center', '#F97316');
      yPosition += 15;
      
      const chartOptions = {
        x: pageWidth / 2,
        y: yPosition + 70,
        width: 150,
        height: 140
      };
      
      const radarChartData = chartData.map(item => ({
        ...item,
        domain: item.domain.replace(/([A-Z])/g, ' $1').trim()
      }));
      
      const centerX = chartOptions.x;
      const centerY = chartOptions.y;
      const radius = Math.min(chartOptions.width, chartOptions.height) / 2;
      
      const angleStep = 360 / radarChartData.length;
      
      radarChartData.forEach((item, index) => {
        const angle = (index * angleStep) - 90;
        const x = centerX + radius * Math.cos(angle * Math.PI / 180);
        const y = centerY + radius * Math.sin(angle * Math.PI / 180);
        
        const labelX = centerX + (radius + 15) * Math.cos(angle * Math.PI / 180);
        const labelY = centerY + (radius + 15) * Math.sin(angle * Math.PI / 180);
        
        pdf.setLineWidth(0.3);
        pdf.setDrawColor(200);
        pdf.line(centerX, centerY, x, y);
        
        pdf.setFillColor(255, 153, 51);
        pdf.circle(x, y, 3, 'F');
        
        pdf.setFontSize(9);
        pdf.setTextColor(50);
        pdf.text(item.domain, labelX, labelY, {
          align: 'center'
        });
      });
      
      pdf.setLineWidth(1);
      pdf.setDrawColor(255, 153, 51);
      pdf.setLineDashPattern([5, 5], 0);
      pdf.circle(centerX, centerY, radius);
      pdf.setLineDashPattern([], 0);
      
      yPosition += chartOptions.height + 30;
      
      addStyledText('Domain Scores', margin, yPosition, 14, 'bold', 'left', '#F97316');
      yPosition += 15;
      
      const domainDescriptions = {
        "selfAwareness": "Understanding your own emotions and how they affect your behavior.",
        "selfRegulation": "Managing your emotions and impulses effectively.",
        "motivation": "Using your emotions to achieve goals and persist through challenges.",
        "empathy": "Understanding and sharing the feelings of others.",
        "socialSkills": "Managing relationships and building rapport with others."
      };
      
      Object.entries(scores).forEach(([domain, score], index) => {
        const description = domainDescriptions[domain as keyof typeof domainDescriptions];
        
        pdf.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 248 : 242, index % 2 === 0 ? 235 : 230);
        pdf.rect(margin, yPosition, contentWidth, 25, 'F');
        pdf.setDrawColor(255, 204, 153);
        pdf.rect(margin, yPosition, contentWidth, 25, 'S');
        
        addStyledText(domain.replace(/([A-Z])/g, ' $1').trim(), margin + 5, yPosition + 10, 11, 'bold', 'left', '#333333');
        addStyledText(`${score}/10`, margin + contentWidth - 20, yPosition + 10, 11, 'normal', 'left', '#333333');
        
        pdf.setFillColor(255, 230, 204);
        pdf.roundedRect(margin + 5, yPosition + 15, contentWidth - 10, 6, 3, 3, 'F');
        
        const barWidth = (contentWidth - 10) * (score / 10);
        pdf.setFillColor(255, 153, 51);
        pdf.roundedRect(margin + 5, yPosition + 15, barWidth, 6, 3, 3, 'F');
        
        yPosition += 30;
      });
      
      pdf.addPage();
      addPageHeader(3);
      
      yPosition = 40;
      
      addStyledText('Understanding Your Scores', margin, yPosition, 14, 'bold', 'left', '#F97316');
      yPosition += 15;
      
      Object.entries(scores).forEach(([domain, score], index) => {
        const description = domainDescriptions[domain as keyof typeof domainDescriptions];
        
        pdf.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 248 : 242, index % 2 === 0 ? 235 : 230);
        pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'F');
        pdf.setDrawColor(255, 204, 153);
        pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'S');
        
        addStyledText(domain.replace(/([A-Z])/g, ' $1').trim(), margin + 5, yPosition + 10, 12, 'bold', 'left', '#333333');
        addStyledText(`${score}/10`, margin + contentWidth - 20, yPosition + 10, 12, 'normal', 'left', '#333333');
        
        const splitDescription = pdf.splitTextToSize(description, contentWidth - 10);
        pdf.text(splitDescription, margin + 5, yPosition + 25);
        
        yPosition += 60;
      });
      
      addStyledText('Note:', margin, yPosition, 10, 'bold', 'left', '#333333');
      const noteText = "These results are based on your self-assessment and provide a snapshot of your emotional intelligence. Consider these insights as a starting point for personal growth and development.";
      
      pdf.setFontSize(9);
      const splitNote = pdf.splitTextToSize(noteText, contentWidth - 20);
      pdf.text(splitNote, margin + 10, yPosition + 15);
      
      pdf.save('EQ-Navigator-Results.pdf');
      toast.success("Your PDF report is ready!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("There was an error generating your PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
                className="mb-4 text-brand-orange hover:text-brand-orange/80 -ml-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your EQ Navigator Results</h1>
              <p className="text-foreground/70 max-w-3xl">
                Based on your responses, here's your emotional intelligence profile across different domains.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Link to="/">
                <Button variant="outline" className="flex items-center">
                  <Grid className="mr-2 h-4 w-4" />
                  Back to Assessments
                </Button>
              </Link>
              
              <Button 
                className="flex items-center bg-brand-orange text-white hover:bg-brand-orange/90"
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
              >
                <Download className="mr-2 h-4 w-4" /> 
                {isGeneratingPDF ? 'Generating PDF...' : 'Download Results'}
              </Button>
            </div>
          </div>
          
          {studentDetails && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-orange/10 rounded-xl p-4 md:p-6 mb-6 max-w-4xl mx-auto"
            >
              <h2 className="text-xl font-semibold mb-3 text-brand-orange">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-brand-orange mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{studentDetails.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-brand-orange mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Class & Section</p>
                    <p className="font-medium">{studentDetails.class} - {studentDetails.section}</p>
                  </div>
                </div>
                <div className="flex items-center md:col-span-2">
                  <School className="h-5 w-5 text-brand-orange mr-2" />
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
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl mx-auto"
          >
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-brand-orange mb-4">Your Emotional Intelligence Profile</h2>
                <p className="text-foreground/70">
                  Here's a breakdown of your emotional intelligence across different domains:
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">EQ Navigator Scores</h3>
                
                <div className="relative h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="domain" />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} />
                      <Radar name="EQ Score" dataKey="score" stroke="#F97316" fill="#F97316" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Domain Breakdown</h3>
                
                <div className="space-y-6">
                  {Object.entries(scores).map(([domain, score]) => (
                    <Card key={domain} className="bg-brand-orange/5 border border-brand-orange/10">
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-brand-orange mb-2">{domain.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p className="text-foreground/80 mb-3">
                          {
                            domain === "selfAwareness" ? "Understanding your own emotions and how they affect your behavior." :
                            domain === "selfRegulation" ? "Managing your emotions and impulses effectively." :
                            domain === "motivation" ? "Using your emotions to achieve goals and persist through challenges." :
                            domain === "empathy" ? "Understanding and sharing the feelings of others." :
                            domain === "socialSkills" ? "Managing relationships and building rapport with others." :
                            "Description not available."
                          }
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Score:</span>
                          <span className="text-sm font-semibold">{score}/10</span>
                        </div>
                        <Progress value={(score / 10) * 100} className="mt-2" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorResults;
