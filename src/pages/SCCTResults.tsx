
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, User, School, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const SCCTResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsData = location.state;
  const [activeTab, setActiveTab] = useState("overview");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const selfEfficacyRef = useRef<HTMLDivElement>(null);
  const outcomesRef = useRef<HTMLDivElement>(null);
  const interestsRef = useRef<HTMLDivElement>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  // Scroll to top whenever location or active tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location, activeTab]);
  
  useEffect(() => {
    // Redirect if no results data
    if (!resultsData) {
      navigate('/assessment/scct');
      return;
    }
    
    // Fetch student details if we have a studentId in the results state
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
      }
    };
    
    fetchStudentDetails();
  }, [resultsData, navigate]);
  
  if (!resultsData) {
    return null;
  }
  
  const { 
    selfEfficacyScores, 
    outcomeExpectationScores, 
    interestScores,
    selfEfficacyAverage,
    outcomeExpectationAverage,
    interestAverage
  } = resultsData;
  
  const categories = [
    'Science & Mathematics', 
    'Technology & Engineering', 
    'Arts & Creative Industries',
    'Business & Economics',
    'Social Sciences & Education'
  ];
  
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'bg-green-500';
    if (score >= 3) return 'bg-blue-500';
    if (score >= 2) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getTextDescription = (score: number) => {
    if (score >= 4) return 'Strong';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Moderate';
    return 'Low';
  };
  
  // Career recommendations based on highest scores
  const getCareerRecommendations = () => {
    const combinedScores = categories.map((category, index) => {
      const combinedScore = 
        (selfEfficacyScores[index] + outcomeExpectationScores[index] + interestScores[index]) / 3;
      return { category, score: combinedScore };
    });
    
    return combinedScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };
  
  const topRecommendations = getCareerRecommendations();
  
  const handleGeneratePDF = async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    toast("Generating your comprehensive PDF report...");
    
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
        pageNumber: number
      ) => {
        if (!container) return;
        
        // Clone the container to avoid modifying the original
        const clone = container.cloneNode(true) as HTMLElement;
        
        // Create a temporary container for the clone with controlled width
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '800px'; // Fixed width for consistent rendering
        tempContainer.style.backgroundColor = '#FFFFFF';
        tempContainer.style.padding = '20px';
        tempContainer.style.boxSizing = 'border-box';
        tempContainer.appendChild(clone);
        document.body.appendChild(tempContainer);
        
        // Process the cloned container to ensure all content is visible
        const processElement = (el: HTMLElement) => {
          // Make sure element is visible
          el.style.display = 'block';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.style.height = 'auto';
          el.style.overflow = 'visible';
          el.style.fontSize = '12px'; // Ensure readable font size
          
          // Set text to black for better printing
          el.style.color = '#000000';
          
          // Remove opacity classes and set solid backgrounds
          if (el.classList.contains('bg-opacity-50') || 
              el.classList.contains('bg-opacity-25') || 
              el.classList.contains('backdrop-blur-sm')) {
            el.classList.remove('bg-opacity-50', 'bg-opacity-25', 'backdrop-blur-sm');
            el.style.backgroundColor = '#FFFFFF';
          }
          
          // Process all child elements
          Array.from(el.children).forEach(child => {
            if (child instanceof HTMLElement) {
              processElement(child);
            }
          });
        };
        
        processElement(clone);
        
        // Render to canvas
        const canvas = await html2canvas(clone, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#FFFFFF'
        });
        
        // Remove temporary container
        document.body.removeChild(tempContainer);
        
        const imgData = canvas.toDataURL('image/png');
        
        // Add a new page for sections after the first one
        if (pageNumber > 0) {
          pdf.addPage();
        }
        
        const pdfWidth = 210 - 20; // A4 width - margins
        const pdfHeight = 297 - 20; // A4 height - margins
        
        // Calculate image dimensions while maintaining aspect ratio
        const imgWidth = pdfWidth;
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
      
      // Add cover page with title and student details
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(76, 175, 80); // Green color for the title
      pdf.text('SCCT Assessment Results', 105, 70, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0); // Reset to black
      pdf.setFontSize(16);
      pdf.text('Social Cognitive Career Theory Profile', 105, 85, { align: 'center' });
      
      // Add student information to cover page if available
      if (studentDetails) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Student: ${studentDetails.name}`, 105, 120, { align: 'center' });
        pdf.text(`Class: ${studentDetails.class} - ${studentDetails.section}`, 105, 130, { align: 'center' });
        pdf.text(`School: ${studentDetails.school}`, 105, 140, { align: 'center' });
      }
      
      pdf.setFontSize(10);
      pdf.text('Page 1', 10, 287);
      
      // Store original active tab to restore later
      const originalActiveTab = activeTab;
      
      // Make overview tab visible and capture it
      setActiveTab("overview");
      // Give time for the state to update and components to render
      await new Promise(resolve => setTimeout(resolve, 300));
      await addSectionToPDF(overviewRef.current, 'Overview', 1);
      
      // Capture Self-Efficacy tab
      setActiveTab("self-efficacy");
      await new Promise(resolve => setTimeout(resolve, 300));
      await addSectionToPDF(selfEfficacyRef.current, 'Self-Efficacy', 2);
      
      // Capture Outcome Expectations tab
      setActiveTab("outcomes");
      await new Promise(resolve => setTimeout(resolve, 300));
      await addSectionToPDF(outcomesRef.current, 'Outcome Expectations', 3);
      
      // Capture Interests tab
      setActiveTab("interests");
      await new Promise(resolve => setTimeout(resolve, 300));
      await addSectionToPDF(interestsRef.current, 'Interests', 4);
      
      // Restore original active tab
      setActiveTab(originalActiveTab);
      
      // Save PDF
      pdf.save('SCCT-Assessment-Results.pdf');
      toast("Your comprehensive PDF report is ready!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast("There was an error generating your PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto" ref={resultsRef}>
            <div className="mb-8 flex justify-between items-start">
              <div>
                <Link to="/assessment/scct" className="inline-flex items-center text-green-600 hover:underline mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Assessment
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold">Your SCCT Results</h1>
                <p className="text-foreground/70 mt-2">
                  Social Cognitive Career Theory Analysis
                </p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF} 
                className="hidden md:flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
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
                className="bg-green-50 rounded-xl p-4 md:p-6 mb-6"
              >
                <h2 className="text-xl font-semibold mb-3 text-green-700">Student Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{studentDetails.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Class & Section</p>
                      <p className="font-medium">{studentDetails.class} - {studentDetails.section}</p>
                    </div>
                  </div>
                  <div className="flex items-center md:col-span-2">
                    <School className="h-5 w-5 text-green-600 mr-2" />
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
                    <TabsTrigger value="self-efficacy">Self-Efficacy</TabsTrigger>
                    <TabsTrigger value="outcomes">Outcome Expectations</TabsTrigger>
                    <TabsTrigger value="interests">Interests</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-0">
                    <div ref={overviewRef}>
                      <h2 className="text-2xl font-bold mb-6">SCCT Assessment Summary</h2>
                      <p className="text-foreground/70 mb-8">
                        The Social Cognitive Career Theory examines how your beliefs, expectations, and interests 
                        shape your career development. This assessment analyzed three key factors:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="p-5 bg-blue-50 border border-blue-200">
                          <h3 className="font-semibold text-lg mb-3 text-blue-700">Self-Efficacy</h3>
                          <p className="mb-4 text-sm">Your confidence in your ability to succeed in specific areas.</p>
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white border-4 border-blue-400 mb-2">
                              <span className="text-2xl font-bold text-blue-700">{selfEfficacyAverage.toFixed(1)}</span>
                            </div>
                            <p className="text-blue-600 font-medium">{getTextDescription(selfEfficacyAverage)}</p>
                          </div>
                        </Card>
                        
                        <Card className="p-5 bg-green-50 border border-green-200">
                          <h3 className="font-semibold text-lg mb-3 text-green-700">Outcome Expectations</h3>
                          <p className="mb-4 text-sm">Your beliefs about the results of pursuing specific career paths.</p>
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white border-4 border-green-400 mb-2">
                              <span className="text-2xl font-bold text-green-700">{outcomeExpectationAverage.toFixed(1)}</span>
                            </div>
                            <p className="text-green-600 font-medium">{getTextDescription(outcomeExpectationAverage)}</p>
                          </div>
                        </Card>
                        
                        <Card className="p-5 bg-purple-50 border border-purple-200">
                          <h3 className="font-semibold text-lg mb-3 text-purple-700">Interests</h3>
                          <p className="mb-4 text-sm">Your attraction to different career fields and activities.</p>
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white border-4 border-purple-400 mb-2">
                              <span className="text-2xl font-bold text-purple-700">{interestAverage.toFixed(1)}</span>
                            </div>
                            <p className="text-purple-600 font-medium">{getTextDescription(interestAverage)}</p>
                          </div>
                        </Card>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4">Top Career Field Recommendations</h3>
                      <p className="text-foreground/70 mb-6">
                        Based on your combined self-efficacy, outcome expectations, and interests, 
                        these career fields may be a good match for you:
                      </p>
                      
                      <div className="space-y-4 mb-8">
                        {topRecommendations.map((rec, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-lg">{rec.category}</h4>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                Match: {(rec.score * 20).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-foreground/70 text-sm">
                              {index === 0 && "You show strong alignment in this field across all three dimensions. Consider exploring careers here as primary options."}
                              {index === 1 && "You show good alignment in this field. These could be excellent secondary career options to consider."}
                              {index === 2 && "You show moderate alignment in this field. Worth exploring if you have additional interest."}
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
                        <h3 className="font-semibold text-lg mb-3">Next Steps</h3>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>Explore specific careers within your top-recommended fields</li>
                          <li>Research educational paths that lead to these careers</li>
                          <li>Consider speaking with a career counselor about your results</li>
                          <li>Try job shadowing or informational interviews in your high-interest areas</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="self-efficacy" className="mt-0">
                    <div ref={selfEfficacyRef}>
                      <h2 className="text-2xl font-bold mb-6">Self-Efficacy Analysis</h2>
                      <p className="text-foreground/70 mb-8">
                        Self-efficacy refers to your confidence in your ability to successfully perform tasks 
                        and achieve goals in specific areas. Higher scores indicate greater confidence.
                      </p>
                      
                      <div className="space-y-6 mb-8">
                        {categories.map((category, index) => {
                          const score = selfEfficacyScores[index];
                          return (
                            <div key={index} className="bg-white p-5 rounded-lg border border-gray-200">
                              <div className="flex justify-between mb-2">
                                <h3 className="font-medium">{category}</h3>
                                <span className={`px-2 py-0.5 rounded text-white ${getScoreColor(score)}`}>
                                  {score.toFixed(1)} / 5
                                </span>
                              </div>
                              <Progress value={score * 20} className="h-2 mb-3" />
                              <p className="text-sm text-foreground/70">
                                {score >= 4 && `You have strong confidence in your abilities related to ${category.toLowerCase()}. This can be a foundation for career success in this area.`}
                                {score >= 3 && score < 4 && `You have good confidence in your abilities related to ${category.toLowerCase()}. With practice, you can further strengthen this area.`}
                                {score >= 2 && score < 3 && `You have moderate confidence in your abilities related to ${category.toLowerCase()}. Consider exploring opportunities to build skills and confidence here.`}
                                {score < 2 && `You currently have lower confidence in your abilities related to ${category.toLowerCase()}. This may not be your preferred area, or you might benefit from more exposure and experience.`}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                        <h3 className="font-semibold text-lg mb-3">Developing Self-Efficacy</h3>
                        <p className="mb-4">Self-efficacy can be developed through:</p>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>Mastery experiences - Successfully completing related tasks</li>
                          <li>Vicarious experiences - Seeing others succeed at similar tasks</li>
                          <li>Verbal persuasion - Receiving encouragement and feedback</li>
                          <li>Managing emotional states - Reducing anxiety about performance</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="outcomes" className="mt-0">
                    <div ref={outcomesRef}>
                      <h2 className="text-2xl font-bold mb-6">Outcome Expectations Analysis</h2>
                      <p className="text-foreground/70 mb-8">
                        Outcome expectations are your beliefs about the results of pursuing specific career paths.
                        Higher scores indicate more positive expectations about rewards, satisfaction, and benefits.
                      </p>
                      
                      <div className="space-y-6 mb-8">
                        {categories.map((category, index) => {
                          const score = outcomeExpectationScores[index];
                          return (
                            <div key={index} className="bg-white p-5 rounded-lg border border-gray-200">
                              <div className="flex justify-between mb-2">
                                <h3 className="font-medium">{category}</h3>
                                <span className={`px-2 py-0.5 rounded text-white ${getScoreColor(score)}`}>
                                  {score.toFixed(1)} / 5
                                </span>
                              </div>
                              <Progress value={score * 20} className="h-2 mb-3" />
                              <p className="text-sm text-foreground/70">
                                {score >= 4 && `You have very positive expectations about careers in ${category.toLowerCase()}. You anticipate valuable rewards and satisfaction from this field.`}
                                {score >= 3 && score < 4 && `You have generally positive expectations about careers in ${category.toLowerCase()}. You see good potential benefits from this field.`}
                                {score >= 2 && score < 3 && `You have moderate expectations about careers in ${category.toLowerCase()}. You may be uncertain about some aspects of this field.`}
                                {score < 2 && `You have lower expectations about careers in ${category.toLowerCase()}. You may not see this field as offering the rewards or satisfaction you're seeking.`}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                        <h3 className="font-semibold text-lg mb-3">Types of Career Outcomes</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Extrinsic Outcomes</h4>
                            <p className="text-sm">Financial rewards, status, advancement opportunities</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Intrinsic Outcomes</h4>
                            <p className="text-sm">Personal satisfaction, enjoyment of work, sense of accomplishment</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Social Outcomes</h4>
                            <p className="text-sm">Relationships with colleagues, contribution to society, work-life balance</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interests" className="mt-0">
                    <div ref={interestsRef}>
                      <h2 className="text-2xl font-bold mb-6">Interests Analysis</h2>
                      <p className="text-foreground/70 mb-8">
                        Interests reflect your attraction to different career fields and activities.
                        Higher scores indicate stronger attraction and enjoyment of related activities.
                      </p>
                      
                      <div className="space-y-6 mb-8">
                        {categories.map((category, index) => {
                          const score = interestScores[index];
                          return (
                            <div key={index} className="bg-white p-5 rounded-lg border border-gray-200">
                              <div className="flex justify-between mb-2">
                                <h3 className="font-medium">{category}</h3>
                                <span className={`px-2 py-0.5 rounded text-white ${getScoreColor(score)}`}>
                                  {score.toFixed(1)} / 5
                                </span>
                              </div>
                              <Progress value={score * 20} className="h-2 mb-3" />
                              <p className="text-sm text-foreground/70">
                                {score >= 4 && `You have strong interest in activities related to ${category.toLowerCase()}. You're likely to find work in this field engaging and enjoyable.`}
                                {score >= 3 && score < 4 && `You have good interest in activities related to ${category.toLowerCase()}. This field contains elements you find appealing.`}
                                {score >= 2 && score < 3 && `You have moderate interest in activities related to ${category.toLowerCase()}. Some aspects appeal to you, while others may not.`}
                                {score < 2 && `You have lower interest in activities related to ${category.toLowerCase()}. This field may not align well with your personal preferences.`}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                        <h3 className="font-semibold text-lg mb-3">Developing Career Interests</h3>
                        <p className="mb-4">According to SCCT, interests develop through:</p>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>Exposure to new activities and fields</li>
                          <li>Developing skills and confidence in those areas</li>
                          <li>Receiving positive feedback and experiences</li>
                          <li>Seeing potential for positive outcomes</li>
                        </ul>
                        <p className="mt-4 text-sm">
                          Remember that interests can evolve over time as you gain new experiences and knowledge.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  variant="outline" 
                  onClick={handleGeneratePDF} 
                  className="w-full md:hidden flex items-center justify-center gap-2 mt-6 border-green-600 text-green-600"
                >
                  <Download className="h-4 w-4" />
                  Download PDF Report
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SCCTResults;
