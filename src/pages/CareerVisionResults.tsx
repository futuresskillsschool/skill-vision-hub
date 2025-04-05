
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
      // Initialize PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // Helper function for styled text
      const addStyledText = (text: string, x: number, y: number, size: number, style: string = 'normal', align: string = 'left', color: string = '#000000') => {
        pdf.setTextColor(color);
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.text(text, x, y, { align: align as any });
      };

      // Cover page with soft background
      pdf.setFillColor(245, 247, 250); // Very light blue background
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Subtle design elements
      pdf.setFillColor(200, 220, 245, 0.5); // Light blue circle
      pdf.circle(170, 240, 30, 'F');
      pdf.setFillColor(230, 245, 230, 0.5); // Light green circle
      pdf.circle(40, 260, 20, 'F');
      
      // Title with a professional color
      addStyledText('CAREER VISION', pageWidth/2, 70, 28, 'bold', 'center', '#4a6da7');
      addStyledText('ASSESSMENT RESULTS', pageWidth/2, 85, 24, 'bold', 'center', '#4a6da7');
      
      // Date
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      addStyledText(`Report Generated: ${currentDate}`, pageWidth/2, 105, 12, 'italic', 'center', '#555555');

      // Student information section
      if (studentDetails) {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'F');
        pdf.setDrawColor(200, 210, 230);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'S');
        
        addStyledText('STUDENT INFORMATION', margin + 10, 135, 14, 'bold', 'left', '#4a6da7');
        pdf.setLineWidth(0.5);
        pdf.setDrawColor('#4a6da7');
        pdf.line(margin + 10, 138, margin + 80, 138);
        
        addStyledText('Name:', margin + 10, 155, 12, 'bold', 'left', '#333333');
        addStyledText(studentDetails.name, margin + 50, 155, 12, 'normal', 'left', '#333333');
        
        addStyledText('Class:', margin + 10, 170, 12, 'bold', 'left', '#333333');
        addStyledText(`${studentDetails.class} - ${studentDetails.section}`, margin + 50, 170, 12, 'normal', 'left', '#333333');
        
        addStyledText('School:', margin + 10, 185, 12, 'bold', 'left', '#333333');
        addStyledText(studentDetails.school, margin + 50, 185, 12, 'normal', 'left', '#333333');
      }
      
      // About section
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'F');
      pdf.setDrawColor(200, 210, 230);
      pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'S');
      
      addStyledText('ABOUT THIS ASSESSMENT', margin + 10, 220, 14, 'bold', 'left', '#4a6da7');
      pdf.line(margin + 10, 223, margin + 85, 223);
      
      addStyledText('The Career Vision Assessment combines insights from three key areas:', 
        margin + 10, 235, 10, 'normal', 'left', '#333333');
      addStyledText('• RIASEC Interest Profile: Identifies your career preferences and interests', 
        margin + 10, 247, 10, 'normal', 'left', '#333333');
      addStyledText('• Future Pathways: Reveals educational and career cluster alignments', 
        margin + 10, 257, 10, 'normal', 'left', '#333333');
      addStyledText('• Emotional Intelligence: Measures your EQ to support career success', 
        margin + 10, 267, 10, 'normal', 'left', '#333333');

      // Page footer
      addStyledText('Career Vision Assessment Results', pageWidth/2, 285, 9, 'italic', 'center', '#555555');
      addStyledText('Page 1', margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
      
      // Helper function to add page header
      const addPageHeader = (title: string, pageNumber: number) => {
        pdf.addPage();
        
        // Light header background
        pdf.setFillColor(245, 247, 250);
        pdf.rect(0, 0, pageWidth, 20, 'F');
        
        // Header content
        addStyledText('Career Vision Assessment', margin, 15, 10, 'italic', 'left', '#555555');
        addStyledText(title, pageWidth - margin, 15, 12, 'bold', 'right', '#4a6da7');
        
        // Separator line
        pdf.setDrawColor(200, 210, 230);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 20, pageWidth - margin, 20);
        
        // Footer
        addStyledText(`Page ${pageNumber}`, margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
        addStyledText(currentDate, pageWidth - margin, pageHeight - 10, 9, 'normal', 'right', '#555555');
      };

      // Function to prepare and render section content - simplified approach for better readability
      const renderSection = (sectionName: string, sectionData: any, pageNum: number) => {
        addPageHeader(sectionName, pageNum);
        
        let yPosition = 40;
        
        // Section title
        addStyledText(sectionName, pageWidth/2, yPosition, 18, 'bold', 'center', '#4a6da7');
        yPosition += 15;
        
        // Process different section types
        if (sectionName === "RIASEC Profile") {
          // Top scores
          addStyledText('Your Top RIASEC Categories', margin, yPosition, 14, 'bold', 'left', '#333333');
          yPosition += 10;
          
          // Get top three RIASEC categories
          const topRiasecItems = Object.entries(riasec)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .slice(0, 3);
          
          for (let i = 0; i < topRiasecItems.length; i++) {
            const [category, score] = topRiasecItems[i];
            const title = riasecDescriptions[category as keyof typeof riasecDescriptions]?.title || category;
            const desc = riasecDescriptions[category as keyof typeof riasecDescriptions]?.description || "";
            
            // Category box
            pdf.setFillColor(240, 246, 255);
            pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'F');
            pdf.setDrawColor(200, 210, 230);
            pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'S');
            
            // Category title and score
            addStyledText(`${i+1}. ${title}`, margin + 10, yPosition + 15, 14, 'bold', 'left', '#4a6da7');
            addStyledText(`Score: ${score}/10`, margin + contentWidth - 40, yPosition + 15, 12, 'normal', 'left', '#333333');
            
            // Category description (shortened)
            const shortenedDesc = desc.length > 150 ? desc.substring(0, 150) + '...' : desc;
            pdf.setFontSize(10);
            const splitText = pdf.splitTextToSize(shortenedDesc, contentWidth - 20);
            pdf.text(splitText, margin + 10, yPosition + 25);
            
            yPosition += 60;
          }
          
          // All scores table
          addStyledText('All RIASEC Scores', margin, yPosition, 14, 'bold', 'left', '#333333');
          yPosition += 10;
          
          // Table header
          pdf.setFillColor(230, 240, 250);
          pdf.rect(margin, yPosition, contentWidth, 10, 'F');
          pdf.setDrawColor(200, 210, 230);
          pdf.rect(margin, yPosition, contentWidth, 10, 'S');
          
          addStyledText('Category', margin + 5, yPosition + 7, 10, 'bold', 'left', '#333333');
          addStyledText('Score', margin + contentWidth - 40, yPosition + 7, 10, 'bold', 'left', '#333333');
          
          yPosition += 10;
          
          // Table rows
          Object.entries(riasec).forEach(([category, score], index) => {
            const title = riasecDescriptions[category as keyof typeof riasecDescriptions]?.title || category;
            
            pdf.setFillColor(index % 2 === 0 ? 250 : 245, index % 2 === 0 ? 252 : 250, index % 2 === 0 ? 255 : 252);
            pdf.rect(margin, yPosition, contentWidth, 8, 'F');
            pdf.setDrawColor(230, 230, 240);
            pdf.rect(margin, yPosition, contentWidth, 8, 'S');
            
            addStyledText(title, margin + 5, yPosition + 5.5, 10, 'normal', 'left', '#333333');
            addStyledText(score.toString(), margin + contentWidth - 40, yPosition + 5.5, 10, 'normal', 'left', '#333333');
            
            yPosition += 8;
          });
        } 
        else if (sectionName === "Future Pathways") {
          // Top clusters
          addStyledText('Your Top Career Clusters', margin, yPosition, 14, 'bold', 'left', '#333333');
          yPosition += 10;
          
          // Get top three pathways clusters
          const topPathwaysItems = Object.entries(pathways)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .slice(0, 3);
          
          for (let i = 0; i < topPathwaysItems.length; i++) {
            const [cluster, score] = topPathwaysItems[i];
            const title = pathwaysDescriptions[cluster as keyof typeof pathwaysDescriptions]?.title || cluster;
            const desc = pathwaysDescriptions[cluster as keyof typeof pathwaysDescriptions]?.description || "";
            
            // Cluster box
            pdf.setFillColor(245, 252, 245);
            pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'F');
            pdf.setDrawColor(210, 230, 210);
            pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'S');
            
            // Cluster title and score
            addStyledText(`${i+1}. ${title}`, margin + 10, yPosition + 15, 14, 'bold', 'left', '#4a6da7');
            addStyledText(`Score: ${score}/25`, margin + contentWidth - 40, yPosition + 15, 12, 'normal', 'left', '#333333');
            
            // Cluster description (shortened)
            const shortenedDesc = desc.length > 150 ? desc.substring(0, 150) + '...' : desc;
            pdf.setFontSize(10);
            const splitText = pdf.splitTextToSize(shortenedDesc, contentWidth - 20);
            pdf.text(splitText, margin + 10, yPosition + 25);
            
            yPosition += 60;
          }
          
          // All scores table
          addStyledText('All Pathway Scores', margin, yPosition, 14, 'bold', 'left', '#333333');
          yPosition += 10;
          
          // Table header
          pdf.setFillColor(230, 245, 235);
          pdf.rect(margin, yPosition, contentWidth, 10, 'F');
          pdf.setDrawColor(210, 230, 215);
          pdf.rect(margin, yPosition, contentWidth, 10, 'S');
          
          addStyledText('Cluster', margin + 5, yPosition + 7, 10, 'bold', 'left', '#333333');
          addStyledText('Score', margin + contentWidth - 40, yPosition + 7, 10, 'bold', 'left', '#333333');
          
          yPosition += 10;
          
          // Table rows
          Object.entries(pathways).forEach(([cluster, score], index) => {
            const title = pathwaysDescriptions[cluster as keyof typeof pathwaysDescriptions]?.title || cluster;
            
            pdf.setFillColor(index % 2 === 0 ? 250 : 248, index % 2 === 0 ? 255 : 252, index % 2 === 0 ? 252 : 250);
            pdf.rect(margin, yPosition, contentWidth, 8, 'F');
            pdf.setDrawColor(230, 240, 232);
            pdf.rect(margin, yPosition, contentWidth, 8, 'S');
            
            addStyledText(title, margin + 5, yPosition + 5.5, 10, 'normal', 'left', '#333333');
            addStyledText(score.toString(), margin + contentWidth - 40, yPosition + 5.5, 10, 'normal', 'left', '#333333');
            
            yPosition += 8;
          });
        } 
        else if (sectionName === "EQ Navigator") {
          // EQ score
          addStyledText('Your Emotional Intelligence Score', margin, yPosition, 14, 'bold', 'left', '#333333');
          yPosition += 15;
          
          // EQ score visualization
          const eqScorePercentage = (eqScore / 100) * 100;
          
          // EQ meter background
          pdf.setFillColor(245, 245, 250);
          pdf.roundedRect(margin, yPosition, contentWidth, 30, 5, 5, 'F');
          pdf.setDrawColor(220, 220, 230);
          pdf.roundedRect(margin, yPosition, contentWidth, 30, 5, 5, 'S');
          
          // EQ score text
          addStyledText(`${eqScore}/100`, pageWidth/2, yPosition + 12, 16, 'bold', 'center', '#4a6da7');
          
          // EQ meter fill
          const meterWidth = (contentWidth - 20) * (eqScorePercentage / 100);
          pdf.setFillColor(180, 200, 240);
          pdf.roundedRect(margin + 10, yPosition + 18, meterWidth, 8, 4, 4, 'F');
          
          // EQ meter background
          pdf.setFillColor(230, 230, 240);
          pdf.roundedRect(margin + 10 + meterWidth, yPosition + 18, (contentWidth - 20) - meterWidth, 8, 4, 4, 'F');
          
          yPosition += 45;
          
          // EQ interpretation
          addStyledText('Emotional Intelligence Interpretation', margin, yPosition, 14, 'bold', 'left', '#333333');
          yPosition += 15;
          
          // EQ level box
          let eqLevel = "Average";
          let eqColor = "#6c8ebf"; // blue
          let eqDescription = "You demonstrate a moderate level of emotional intelligence. This gives you a solid foundation for understanding and managing emotions.";
          
          if (eqScore >= 80) {
            eqLevel = "Excellent";
            eqColor = "#82b366"; // green
            eqDescription = "You demonstrate a high level of emotional intelligence. This gives you an exceptional ability to understand and manage emotions.";
          } else if (eqScore >= 60) {
            eqLevel = "Good";
            eqColor = "#6c8ebf"; // blue
            eqDescription = "You demonstrate a good level of emotional intelligence. This gives you a strong ability to understand and manage emotions.";
          } else if (eqScore < 40) {
            eqLevel = "Developing";
            eqColor = "#d79b00"; // orange
            eqDescription = "You demonstrate a developing level of emotional intelligence. There's opportunity to enhance your ability to understand and manage emotions.";
          }
          
          pdf.setFillColor(250, 250, 252);
          pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'F');
          pdf.setDrawColor(220, 220, 240);
          pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'S');
          
          addStyledText(`Level: ${eqLevel}`, margin + 10, yPosition + 15, 14, 'bold', 'left', eqColor);
          
          pdf.setFontSize(10);
          const splitEqDesc = pdf.splitTextToSize(eqDescription, contentWidth - 20);
          pdf.text(splitEqDesc, margin + 10, yPosition + 25);
          
          yPosition += 60;
          
          // EQ benefits
          addStyledText('Benefits of Strong Emotional Intelligence in Career', margin, yPosition, 14, 'bold', 'left', '#333333');
          yPosition += 15;
          
          const eqBenefits = [
            "Better communication and teamwork skills",
            "Enhanced leadership capabilities",
            "Improved ability to handle stress and pressure",
            "Greater adaptability to change",
            "More effective conflict resolution"
          ];
          
          eqBenefits.forEach((benefit, index) => {
            pdf.setFillColor(index % 2 === 0 ? 250 : 245, index % 2 === 0 ? 250 : 247, index % 2 === 0 ? 255 : 252);
            pdf.rect(margin, yPosition, contentWidth, 12, 'F');
            
            addStyledText(`• ${benefit}`, margin + 10, yPosition + 8, 10, 'normal', 'left', '#333333');
            yPosition += 12;
          });
        } 
        else if (sectionName === "Overview") {
          // Career recommendations
          addStyledText('Career Recommendations', margin, yPosition, 14, 'bold', 'left', '#333333');
          yPosition += 15;
          
          // Get top recommendations
          let yAvailable = pageHeight - yPosition - 40; // Space available on page minus margins
          let careersPerPage = Math.min(6, careerRecommendations.length);
          
          // Pastel colors for career boxes
          const pastelColors = [
            { bg: "#F2FCE2", border: "#D9E8C9" }, // Soft Green
            { bg: "#FEF7CD", border: "#F0E6A9" }, // Soft Yellow
            { bg: "#E5DEFF", border: "#C9C2E8" }, // Soft Purple
            { bg: "#FFDEE2", border: "#F0C5C9" }, // Soft Pink
            { bg: "#D3E4FD", border: "#B5C9E8" }, // Soft Blue
            { bg: "#FDE1D3", border: "#F0C9B5" }  // Soft Peach
          ];
          
          for (let i = 0; i < careersPerPage; i++) {
            const career = careerRecommendations[i];
            const colorIndex = i % pastelColors.length;
            
            if (yPosition + 60 > pageHeight - 40) {
              // Add a new page if not enough space
              pageNum++;
              addPageHeader("Overview (continued)", pageNum);
              yPosition = 40;
            }
            
            // Career box with pastel colors
            pdf.setFillColor(hexToRgb(pastelColors[colorIndex].bg).r, hexToRgb(pastelColors[colorIndex].bg).g, hexToRgb(pastelColors[colorIndex].bg).b);
            pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'F');
            pdf.setDrawColor(hexToRgb(pastelColors[colorIndex].border).r, hexToRgb(pastelColors[colorIndex].border).g, hexToRgb(pastelColors[colorIndex].border).b);
            pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'S');
            
            // Career title
            addStyledText(career.title, margin + 10, yPosition + 15, 12, 'bold', 'left', '#333333');
            
            // Career details
            const categoryText = `RIASEC: ${career.riasecCategory.join(", ")}`;
            const clusterText = `Cluster: ${career.cluster}`;
            
            addStyledText(categoryText, margin + 10, yPosition + 30, 10, 'normal', 'left', '#555555');
            addStyledText(clusterText, margin + 10, yPosition + 42, 10, 'normal', 'left', '#555555');
            
            yPosition += 60;
          }
          
          // Add more career recommendations if available
          if (careerRecommendations.length > careersPerPage) {
            pageNum++;
            addPageHeader("Additional Career Recommendations", pageNum);
            yPosition = 40;
            
            addStyledText('More Career Possibilities', pageWidth/2, yPosition, 16, 'bold', 'center', '#4a6da7');
            yPosition += 20;
            
            const remainingCareers = careerRecommendations.slice(careersPerPage);
            
            // Create a table of remaining careers
            pdf.setFillColor(230, 240, 250);
            pdf.rect(margin, yPosition, contentWidth, 10, 'F');
            pdf.setDrawColor(200, 210, 230);
            pdf.rect(margin, yPosition, contentWidth, 10, 'S');
            
            addStyledText('Career Title', margin + 5, yPosition + 7, 10, 'bold', 'left', '#333333');
            addStyledText('RIASEC / Cluster', margin + contentWidth - 80, yPosition + 7, 10, 'bold', 'left', '#333333');
            
            yPosition += 10;
            
            remainingCareers.forEach((career, index) => {
              if (yPosition + 10 > pageHeight - 20) {
                pageNum++;
                addPageHeader("Additional Career Recommendations", pageNum);
                yPosition = 40;
                
                // Recreate table header on new page
                pdf.setFillColor(230, 240, 250);
                pdf.rect(margin, yPosition, contentWidth, 10, 'F');
                pdf.setDrawColor(200, 210, 230);
                pdf.rect(margin, yPosition, contentWidth, 10, 'S');
                
                addStyledText('Career Title', margin + 5, yPosition + 7, 10, 'bold', 'left', '#333333');
                addStyledText('RIASEC / Cluster', margin + contentWidth - 80, yPosition + 7, 10, 'bold', 'left', '#333333');
                
                yPosition += 10;
              }
              
              pdf.setFillColor(index % 2 === 0 ? 250 : 245, index % 2 === 0 ? 252 : 250, index % 2 === 0 ? 255 : 252);
              pdf.rect(margin, yPosition, contentWidth, 8, 'F');
              pdf.setDrawColor(230, 230, 240);
              pdf.rect(margin, yPosition, contentWidth, 8, 'S');
              
              addStyledText(career.title, margin + 5, yPosition + 5.5, 10, 'normal', 'left', '#333333');
              addStyledText(`${career.riasecCategory[0]} / ${career.cluster.split(' ')[0]}`, margin + contentWidth - 80, yPosition + 5.5, 9, 'normal', 'left', '#555555');
              
              yPosition += 8;
            });
          }
        }
      };
      
      // Helper function to convert hex to rgb
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
      };

      // Generate the PDF sections
      renderSection("Overview", null, 2);
      renderSection("RIASEC Profile", riasec, 3);
      renderSection("Future Pathways", pathways, 4);
      renderSection("EQ Navigator", eq, 5);
      
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

export default CareerVisionResults;
