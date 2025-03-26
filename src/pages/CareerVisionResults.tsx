
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

// Import refactored components
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
  const [activeTab, setActiveTab] = useState("overview");
  
  const [results, setResults] = useState<AssessmentResults | null>(location.state || null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const riasecRef = useRef<HTMLDivElement>(null);
  const pathwaysRef = useRef<HTMLDivElement>(null);
  const eqRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!results && user) {
      // This would be implemented if we had a function to fetch results
      // fetchUserResults('career-vision').then(setResults);
    }
    
    // Fetch student details if we have a studentId in the results state
    const fetchStudentDetails = async () => {
      if (results && results.studentId) {
        try {
          const { data, error } = await supabase
            .from('student_details')
            .select('*')
            .eq('id', results.studentId)
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
  }, [results, user]);
  
  if (!results) {
    return (
      <div className="min-h-screen flex flex-col">
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
      // This will store our PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Function to capture a specific section and add it to the PDF
      const addSectionToPDF = async (
        container: HTMLDivElement | null, 
        title: string, 
        pageNumber: number,
        tabToActivate: string
      ) => {
        if (!container) return;
        
        // Activate the correct tab first
        setActiveTab(tabToActivate);
        
        // Wait for the DOM to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#FFFFFF'
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Add a new page for sections after the first one
        if (pageNumber > 0) {
          pdf.addPage();
        }
        
        const imgWidth = 210 - 20; // A4 width - margins
        const pageHeight = 297 - 20; // A4 height - margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add title to the page
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, 10, 15);
        
        // Add the image below the title
        pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
        
        // Add page number at the bottom
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${pageNumber + 1}`, 10, 287);
      };
      
      // Add cover page
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Career Vision Assessment', 105, 100, { align: 'center' });
      pdf.setFontSize(16);
      pdf.text('Comprehensive Results Report', 105, 115, { align: 'center' });
      
      if (studentDetails) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Student: ${studentDetails.name}`, 105, 140, { align: 'center' });
        pdf.text(`Class: ${studentDetails.class} - ${studentDetails.section}`, 105, 150, { align: 'center' });
        pdf.text(`School: ${studentDetails.school}`, 105, 160, { align: 'center' });
      }
      
      pdf.setFontSize(10);
      pdf.text('Page 1', 10, 287);
      
      // Store original active tab to restore later
      const originalActiveTab = activeTab;
      
      // Make sure all tabs are properly rendered for the PDF
      // We need to activate each tab before we capture it
      
      // Overview tab (Page 2)
      await addSectionToPDF(overviewRef.current, 'Overview', 1, "overview");
      
      // RIASEC tab (Page 3)
      await addSectionToPDF(riasecRef.current, 'RIASEC Profile', 2, "riasec");
      
      // Pathways tab (Page 4)
      await addSectionToPDF(pathwaysRef.current, 'Future Pathways', 3, "pathways");
      
      // EQ tab (Page 5)
      await addSectionToPDF(eqRef.current, 'EQ Navigator', 4, "eq");
      
      // Restore original active tab
      setActiveTab(originalActiveTab);
      
      // Save PDF
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
            
            {/* Student Details Section */}
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
