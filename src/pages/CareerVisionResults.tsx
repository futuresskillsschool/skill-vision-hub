import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, User, School, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import ScrollToTop from '@/components/ScrollToTop';

import OverviewTab from '@/components/career-vision/OverviewTab';
import RIASECTab from '@/components/career-vision/RIASECTab';
import PathwaysTab from '@/components/career-vision/PathwaysTab';
import EQTab from '@/components/career-vision/EQTab';
import { 
  riasecDescriptions, 
  pathwaysDescriptions, 
  getCareerRecommendations,
  AssessmentResults
} from '@/components/career-vision/DataTypes';
import { toast } from 'sonner';

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const CareerVisionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const riasecRef = useRef<HTMLDivElement>(null);
  const pathwaysRef = useRef<HTMLDivElement>(null);
  const eqRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [resultsAlreadySaved, setResultsAlreadySaved] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (location.state) {
      if (location.state.riasec || location.state.pathways || location.state.eq) {
        setResults(location.state as AssessmentResults);
      } else if (location.state.scores) {
        const transformedResults: AssessmentResults = {
          riasec: location.state.scores.riasec || {},
          pathways: location.state.scores.pathways || {},
          eq: location.state.scores.eq || { totalScore: 0 },
          studentId: location.state.studentId
        };
        setResults(transformedResults);
      }
    } else if (user) {
      console.log('No location state, could fetch results for user:', user.id);
    }
    
    const fetchStudentDetails = async () => {
      console.log('Checking for studentId:', location.state?.studentId);
      
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
            console.log('Found student details:', data);
            setStudentDetails(data as StudentDetails);
          }
        } catch (error) {
          console.error('Error in student details fetch:', error);
        }
      }
    };
    
    fetchStudentDetails();
    
    const saveResultsToDB = async () => {
      if (user && location.state && !location.state.fromDashboard && !resultsAlreadySaved) {
        try {
          console.log('Saving Career Vision results to database for user:', user.id);
          
          const processObjectForJSON = (obj: any): Record<string, any> => {
            const result: Record<string, any> = {};
            if (obj && typeof obj === 'object') {
              Object.entries(obj).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                  result[key] = processObjectForJSON(value);
                } else {
                  result[key] = value;
                }
              });
              return result;
            }
            return obj;
          };
          
          const resultData = {
            riasec: processObjectForJSON(location.state.riasec || (location.state.scores?.riasec || {})),
            pathways: processObjectForJSON(location.state.pathways || (location.state.scores?.pathways || {})),
            eq: processObjectForJSON(location.state.eq || (location.state.scores?.eq || { totalScore: 0 })),
            studentId: location.state.studentId
          };
          
          const { error } = await supabase
            .from('assessment_results')
            .upsert({
              user_id: user.id,
              assessment_type: 'career-vision',
              result_data: resultData
            });
            
          if (error) {
            console.error('Error saving results to database:', error);
          } else {
            console.log('Career Vision results saved successfully');
            setResultsAlreadySaved(true);
          }
        } catch (error) {
          console.error('Exception when saving results:', error);
        }
      }
    };
    
    saveResultsToDB();
    
    if (location.state?.downloadPdf) {
      setTimeout(() => handleDownloadPDF(), 1000);
    }
  }, [location.state, user, resultsAlreadySaved]);
  
  if (!results) {
    return (
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-6">Results Not Available</h1>
              <p className="mb-8">We couldn't find your assessment results. Please take the assessment first.</p>
              <Link to="/assessment/career-vision">
                <Button>Take the Assessment</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const { riasec, pathways, eq } = results;
  
  const riasecChartData = Object.entries(riasec).map(([category, score]) => ({
    name: riasecDescriptions[category as keyof typeof riasecDescriptions]?.title || category,
    score: score as number,
    fullMark: 10,
  }));
  
  const pathwaysChartData = Object.entries(pathways).map(([cluster, score]) => ({
    name: pathwaysDescriptions[cluster as keyof typeof pathwaysDescriptions]?.title.split(' ')[0] || cluster,
    score: score as number,
    fullMark: 25,
  }));
  
  const eqScore = eq.totalScore;
  
  const careerRecommendations = getCareerRecommendations(riasec, pathways, eqScore);
  
  const topRiasecCategories = Object.entries(riasec)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(([category]) => category);
  
  const topPathwaysClusters = Object.entries(pathways)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 2)
    .map(([cluster]) => cluster);

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    toast.loading("Generating your comprehensive PDF report...");
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      const addStyledText = (text: string, x: number, y: number, size: number, style: string = 'normal', align: string = 'left', color: string = '#000000') => {
        pdf.setTextColor(color);
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.text(text, x, y, { align: align as any });
      };

      pdf.setFillColor(240, 249, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      for (let i = 0; i < 50; i++) {
        const alpha = 1 - (i / 50);
        pdf.setFillColor(66, 133, 244, alpha);
        pdf.rect(0, i, pageWidth, 1, 'F');
      }
      
      pdf.setFillColor(230, 240, 255);
      pdf.circle(170, 240, 30, 'F');
      pdf.circle(40, 260, 20, 'F');
      
      addStyledText('CAREER VISION', pageWidth/2, 80, 28, 'bold', 'center', '#1a73e8');
      addStyledText('ASSESSMENT RESULTS', pageWidth/2, 95, 24, 'bold', 'center', '#1a73e8');
      
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      addStyledText(`Report Generated: ${currentDate}`, pageWidth/2, 115, 12, 'italic', 'center', '#555555');

      if (studentDetails) {
        pdf.setFillColor(255, 255, 255, 0.8);
        pdf.roundedRect(margin, 140, contentWidth, 70, 5, 5, 'F');
        
        addStyledText('STUDENT INFORMATION', margin + 10, 155, 14, 'bold', 'left', '#1a73e8');
        pdf.setLineWidth(0.5);
        pdf.setDrawColor('#1a73e8');
        pdf.line(margin + 10, 158, margin + 80, 158);
        
        addStyledText('Name:', margin + 10, 175, 12, 'bold', 'left', '#333333');
        addStyledText(studentDetails.name, margin + 50, 175, 12, 'normal', 'left', '#333333');
        
        addStyledText('Class:', margin + 10, 185, 12, 'bold', 'left', '#333333');
        addStyledText(`${studentDetails.class} - ${studentDetails.section}`, margin + 50, 185, 12, 'normal', 'left', '#333333');
        
        addStyledText('School:', margin + 10, 195, 12, 'bold', 'left', '#333333');
        addStyledText(studentDetails.school, margin + 50, 195, 12, 'normal', 'left', '#333333');
      }
      
      pdf.setFillColor(255, 255, 255, 0.8);
      pdf.roundedRect(margin, 230, contentWidth, 40, 5, 5, 'F');
      addStyledText('ABOUT THIS ASSESSMENT', margin + 10, 245, 12, 'bold', 'left', '#1a73e8');
      addStyledText('The Career Vision Assessment combines insights from RIASEC interest profile,', 
        margin + 10, 255, 10, 'normal', 'left', '#333333');
      addStyledText('Future Pathways exploration, and Emotional Intelligence to provide a comprehensive', 
        margin + 10, 262, 10, 'normal', 'left', '#333333');
      addStyledText('view of career possibilities aligned with your strengths and preferences.', 
        margin + 10, 269, 10, 'normal', 'left', '#333333');

      addStyledText('Page 1', margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
      
      const addPageHeader = (title: string, pageNumber: number) => {
        pdf.addPage();
        
        pdf.setFillColor(230, 240, 255);
        pdf.rect(0, 0, pageWidth, 25, 'F');
        
        addStyledText(title, margin, 15, 16, 'bold', 'left', '#1a73e8');
        
        addStyledText(`Page ${pageNumber}`, margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
      };

      const captureTabContent = async (element: HTMLDivElement | null, title: string, pageNumber: number) => {
        if (!element) return;
        
        const clone = element.cloneNode(true) as HTMLElement;
        
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '800px';
        tempContainer.style.backgroundColor = '#FFFFFF';
        document.body.appendChild(tempContainer);
        tempContainer.appendChild(clone);
        
        const processElement = (el: HTMLElement) => {
          el.style.display = 'block';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.height = 'auto';
          el.style.overflow = 'visible';
          
          if (el.classList.contains('bg-opacity-50') || 
              el.classList.contains('bg-opacity-25') || 
              el.classList.contains('backdrop-blur-sm')) {
            el.classList.remove('bg-opacity-50', 'bg-opacity-25', 'backdrop-blur-sm');
            el.style.backgroundColor = '#FFFFFF';
          }
          
          Array.from(el.children).forEach(child => {
            if (child instanceof HTMLElement) {
              processElement(child);
            }
          });
        };
        
        processElement(clone);
        
        const canvas = await html2canvas(clone, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#FFFFFF'
        });
        
        document.body.removeChild(tempContainer);
        
        addPageHeader(title, pageNumber);
        
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const maxHeight = pageHeight - (margin * 2) - 25;
        
        if (imgHeight <= maxHeight) {
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', margin, 30, imgWidth, imgHeight);
        } else {
          let srcY = 0;
          let destY = 30;
          let availableHeight = maxHeight;
          let pageCount = pageNumber;
          
          while (srcY < canvas.height) {
            const canvasHeight = Math.min(canvas.height - srcY, (availableHeight * canvas.width) / imgWidth);
            const destHeight = (canvasHeight * imgWidth) / canvas.width;
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvasHeight;
            const tempCtx = tempCanvas.getContext('2d');
            
            if (tempCtx) {
              tempCtx.drawImage(canvas, 0, srcY, canvas.width, canvasHeight, 0, 0, canvas.width, canvasHeight);
              const imgData = tempCanvas.toDataURL('image/png');
              
              pdf.addImage(imgData, 'PNG', margin, destY, imgWidth, destHeight);
              
              srcY += canvasHeight;
              
              if (srcY < canvas.height) {
                pageCount++;
                addPageHeader(title + " (continued)", pageCount);
                destY = 30;
                availableHeight = maxHeight;
              }
            }
          }
        }
      };
      
      const originalActiveTab = activeTab;
      
      setActiveTab("overview");
      await new Promise(resolve => setTimeout(resolve, 300));
      await captureTabContent(overviewRef.current, "Overview", 2);
      
      setActiveTab("riasec");
      await new Promise(resolve => setTimeout(resolve, 300));
      await captureTabContent(riasecRef.current, "RIASEC Profile", 3);
      
      setActiveTab("pathways");
      await new Promise(resolve => setTimeout(resolve, 300));
      await captureTabContent(pathwaysRef.current, "Future Pathways", 4);
      
      setActiveTab("eq");
      await new Promise(resolve => setTimeout(resolve, 300));
      await captureTabContent(eqRef.current, "EQ Navigator", 5);
      
      setActiveTab(originalActiveTab);
      
      pdf.save('Career-Vision-Complete-Results.pdf');
      toast.success("Your comprehensive PDF report is ready!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("There was an error generating your PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto" id="results-container" ref={resultsContainerRef}>
            <div className="mb-8 flex justify-between items-start">
              <div>
                <Link to="/assessment/career-vision" className="inline-flex items-center text-brand-purple hover:underline mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Assessment
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold">Your Career Vision Results</h1>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF} 
                className="hidden md:flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPDF ? "Generating..." : "Download PDF Report"}
              </Button>
            </div>
            
            {studentDetails && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-purple/10 rounded-xl p-4 md:p-6 mb-6"
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
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-card"
            >
              <div className="p-6 md:p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-8 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="riasec">RIASEC Profile</TabsTrigger>
                    <TabsTrigger value="pathways">Future Pathways</TabsTrigger>
                    <TabsTrigger value="eq">EQ Navigator</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-0">
                    <div ref={overviewRef}>
                      <OverviewTab 
                        riasec={riasec}
                        pathways={pathways}
                        eqScore={eqScore}
                        careerRecommendations={careerRecommendations}
                        topRiasecCategories={topRiasecCategories}
                        topPathwaysClusters={topPathwaysClusters}
                        riasecChartData={riasecChartData}
                        pathwaysChartData={pathwaysChartData}
                        handleDownloadPDF={handleDownloadPDF}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="riasec" className="mt-0">
                    <div ref={riasecRef}>
                      <RIASECTab 
                        riasec={riasec}
                        riasecChartData={riasecChartData}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pathways" className="mt-0">
                    <div ref={pathwaysRef}>
                      <PathwaysTab 
                        pathways={pathways}
                        pathwaysChartData={pathwaysChartData}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="eq" className="mt-0">
                    <div ref={eqRef}>
                      <EQTab eqScore={eqScore} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerVisionResults;
