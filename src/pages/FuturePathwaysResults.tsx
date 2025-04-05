
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Rocket, 
  CheckCircle2, 
  BarChart3,
  User,
  School,
  BookOpen
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define pathways descriptions
const pathwaysDescriptions = {
  "tech-innovator": {
    title: "Tech Innovator & Builder",
    description: "You have a natural talent for understanding and building technology. You may enjoy creating new devices, coding applications, or solving technical problems.",
    careers: [
      "Software Developer",
      "Robotics Engineer",
      "Digital Hardware Designer",
      "Systems Architect",
      "Technology Entrepreneur"
    ],
    skills: [
      "Technical problem-solving",
      "Coding and programming",
      "Digital design",
      "Systems thinking",
      "Innovation"
    ]
  },
  "digital-creator": {
    title: "Digital Creator & Storyteller",
    description: "You combine creativity with digital tools to express ideas and create engaging content. You enjoy visual design, storytelling, or bringing ideas to life digitally.",
    careers: [
      "Digital Content Creator",
      "UX/UI Designer",
      "Video Game Designer",
      "Social Media Specialist",
      "Digital Marketer"
    ],
    skills: [
      "Visual storytelling",
      "Digital media creation",
      "Design thinking",
      "Audience engagement",
      "Creative problem-solving"
    ]
  },
  "data-analyst": {
    title: "Data Analyst & Scientist",
    description: "You have a natural ability to see patterns in information and draw insights from data. You enjoy working with numbers, analyzing trends, and making predictions.",
    careers: [
      "Data Scientist",
      "Business Analyst",
      "Research Specialist",
      "AI Engineer",
      "Market Research Analyst"
    ],
    skills: [
      "Analytical thinking",
      "Data interpretation",
      "Statistical analysis",
      "Pattern recognition",
      "Logical reasoning"
    ]
  },
  "entrepreneur": {
    title: "Future-Focused Entrepreneur & Leader",
    description: "You're a natural leader with vision and drive. You enjoy taking initiative, developing new ideas, and inspiring others to work toward common goals.",
    careers: [
      "Startup Founder",
      "Product Manager",
      "Business Development",
      "Innovation Consultant",
      "Project Manager"
    ],
    skills: [
      "Leadership",
      "Strategic thinking",
      "Risk assessment",
      "Decision making",
      "Team building"
    ]
  },
  "helper": {
    title: "Tech-Enabled Helper & Problem Solver",
    description: "You want to use technology to make a positive difference in people's lives. You're motivated by helping others and solving important social problems.",
    careers: [
      "EdTech Specialist",
      "Sustainability Technologist",
      "Health Tech Developer",
      "Accessibility Designer",
      "AI Ethics Researcher"
    ],
    skills: [
      "Empathy",
      "Social problem-solving",
      "Communication",
      "Ethical reasoning",
      "Collaboration"
    ]
  }
};

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const FuturePathwaysResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  
  // Get results data from location state
  const resultsData = location.state;
  
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    if (!resultsData) {
      // Redirect to assessment if there's no results data
      navigate('/assessment/future-pathways');
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
    return null; // Don't render until we have results data
  }
  
  const { selectedOptions, questions, clusterScores, totalScore } = resultsData;
  
  // Get top clusters
  const sortedClusters = Object.entries(clusterScores)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([cluster]) => cluster);
  
  const primaryCluster = sortedClusters[0];
  const secondaryCluster = sortedClusters[1];
  
  // Calculate percentage scores
  const maxPossibleScore = 5 * questions.filter(q => q.careerClusters.includes(primaryCluster)).length;
  const primaryPercentage = Math.round((clusterScores[primaryCluster] / maxPossibleScore) * 100);
  
  const handleGeneratePDF = async () => {
    if (!resultsRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      toast.loading("Generating your PDF report...");
      
      // Initialize PDF with A4 format
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
      const addStyledText = (text: string, x: number, y: number, size: number, style: string = 'normal', align: 'left' | 'center' | 'right' | 'justify' = 'left', color: string = '#000000') => {
        pdf.setTextColor(color);
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.text(text, x, y, { align });
      };

      // Cover page with soft background
      pdf.setFillColor(245, 250, 245); // Very light green background
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Subtle design elements
      pdf.setFillColor(200, 240, 200, 0.5); // Light green circle
      pdf.circle(170, 240, 30, 'F');
      pdf.setFillColor(220, 245, 220, 0.5); // Light green circle
      pdf.circle(40, 260, 20, 'F');
      
      // Title with a professional color
      addStyledText('FUTURE PATHWAYS', pageWidth/2, 70, 28, 'bold', 'center', '#4CAF50');
      addStyledText('ASSESSMENT RESULTS', pageWidth/2, 85, 24, 'bold', 'center', '#4CAF50');
      
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
        pdf.setDrawColor(200, 220, 200);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'S');
        
        addStyledText('STUDENT INFORMATION', margin + 10, 135, 14, 'bold', 'left', '#4CAF50');
        pdf.setLineWidth(0.5);
        pdf.setDrawColor('#4CAF50');
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
      pdf.setDrawColor(200, 220, 200);
      pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'S');
      
      addStyledText('ABOUT THIS ASSESSMENT', margin + 10, 220, 14, 'bold', 'left', '#4CAF50');
      pdf.line(margin + 10, 223, margin + 85, 223);
      
      addStyledText('The Future Pathways Assessment identifies your career pathway preferences:', 
        margin + 10, 235, 10, 'normal', 'left', '#333333');
      addStyledText('• Tech Innovator: Natural talent for understanding and building technology', 
        margin + 10, 247, 10, 'normal', 'left', '#333333');
      addStyledText('• Digital Creator: Creativity combined with digital tools for expression', 
        margin + 10, 257, 10, 'normal', 'left', '#333333');
      addStyledText('• Data Analyst: Ability to see patterns in information and draw insights', 
        margin + 10, 267, 10, 'normal', 'left', '#333333');

      // Page footer
      addStyledText('Future Pathways Assessment Results', pageWidth/2, 285, 9, 'italic', 'center', '#555555');
      addStyledText('Page 1', margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
      
      // Add a new page for results
      pdf.addPage();
      
      // Helper function to add page header
      const addPageHeader = (pageNumber: number) => {
        // Light header background
        pdf.setFillColor(245, 250, 245);
        pdf.rect(0, 0, pageWidth, 20, 'F');
        
        // Header content
        addStyledText('Future Pathways Assessment', margin, 15, 10, 'italic', 'left', '#555555');
        addStyledText('Results Summary', pageWidth - margin, 15, 12, 'bold', 'right', '#4CAF50');
        
        // Separator line
        pdf.setDrawColor(200, 220, 200);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 20, pageWidth - margin, 20);
        
        // Footer
        addStyledText(`Page ${pageNumber}`, margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
        addStyledText(currentDate, pageWidth - margin, pageHeight - 10, 9, 'normal', 'right', '#555555');
      };
      
      // Add the header to page 2
      addPageHeader(2);
      
      // Top Pathway section
      let yPosition = 40;
      addStyledText('Your Top Pathway', pageWidth/2, yPosition, 18, 'bold', 'center', '#4CAF50');
      yPosition += 15;
      
      // Primary Cluster box
      pdf.setFillColor(240, 250, 240);
      pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'F');
      pdf.setDrawColor(200, 220, 200);
      pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'S');
      
      const primaryClusterInfo = pathwaysDescriptions[primaryCluster as keyof typeof pathwaysDescriptions];
      
      // Primary cluster title and score
      addStyledText(primaryClusterInfo.title, pageWidth/2, yPosition + 15, 16, 'bold', 'center', '#4CAF50');
      addStyledText(`Compatibility: ${primaryPercentage}%`, pageWidth/2, yPosition + 30, 12, 'normal', 'center', '#333333');
      
      // Primary cluster description
      pdf.setFontSize(10);
      const splitDesc = pdf.splitTextToSize(primaryClusterInfo.description, contentWidth - 20);
      
      // Center the text block
      const textHeight = splitDesc.length * 5; // Approximate height of text block
      const textY = yPosition + 40 + (30 - textHeight) / 2; // Center text in remaining space
      
      pdf.text(splitDesc, margin + 10, textY);
      
      yPosition += 80;
      
      // All Pathways Profile section
      addStyledText('Your Pathway Profile', margin, yPosition, 14, 'bold', 'left', '#4CAF50');
      yPosition += 15;
      
      // Create bar chart visualization for pathways
      Object.entries(clusterScores)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .forEach(([cluster, score], index) => {
          const maxScore = 5 * questions.filter(q => q.careerClusters.includes(cluster)).length;
          const percentage = Math.round((score as number / maxScore) * 100);
          const clusterInfo = pathwaysDescriptions[cluster as keyof typeof pathwaysDescriptions];
          
          // Cluster name and score
          pdf.setFillColor(index % 2 === 0 ? 248 : 252, index % 2 === 0 ? 252 : 248, index % 2 === 0 ? 248 : 252);
          pdf.rect(margin, yPosition, contentWidth, 25, 'F');
          pdf.setDrawColor(220, 230, 220);
          pdf.rect(margin, yPosition, contentWidth, 25, 'S');
          
          // Cluster name (shortened)
          const shortName = clusterInfo.title.split('&')[0].trim();
          addStyledText(shortName, margin + 5, yPosition + 10, 11, 'bold', 'left', '#333333');
          addStyledText(`${percentage}%`, margin + contentWidth - 20, yPosition + 10, 11, 'normal', 'left', '#333333');
          
          // Progress bar
          pdf.setFillColor(230, 240, 230);
          pdf.roundedRect(margin + 5, yPosition + 15, contentWidth - 10, 6, 3, 3, 'F');
          
          // Progress bar fill
          const barWidth = (contentWidth - 10) * (percentage / 100);
          pdf.setFillColor(120, 190, 120);
          pdf.roundedRect(margin + 5, yPosition + 15, barWidth, 6, 3, 3, 'F');
          
          yPosition += 30;
        });
      
      // Career Recommendations section
      if (yPosition + 80 > pageHeight - 20) {
        // Add a new page if not enough space
        pdf.addPage();
        addPageHeader(3);
        yPosition = 40;
      }
      
      addStyledText('Career Recommendations', margin, yPosition, 14, 'bold', 'left', '#4CAF50');
      yPosition += 15;
      
      // Primary Cluster Careers
      pdf.setFillColor(240, 250, 240);
      pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'F');
      pdf.setDrawColor(200, 220, 200);
      pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'S');
      
      addStyledText(primaryClusterInfo.title, margin + 10, yPosition + 15, 12, 'bold', 'left', '#4CAF50');
      
      // List the careers
      let careerY = yPosition + 30;
      primaryClusterInfo.careers.forEach((career, index) => {
        if (index < 5) { // Limit to 5 careers to fit on page
          addStyledText(`• ${career}`, margin + 15, careerY, 10, 'normal', 'left', '#333333');
          careerY += 8;
        }
      });
      
      yPosition += 80;
      
      // Secondary Cluster Careers
      const secondaryClusterInfo = pathwaysDescriptions[secondaryCluster as keyof typeof pathwaysDescriptions];
      
      pdf.setFillColor(250, 250, 245);
      pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'F');
      pdf.setDrawColor(220, 220, 200);
      pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'S');
      
      addStyledText(secondaryClusterInfo.title, margin + 10, yPosition + 15, 12, 'bold', 'left', '#4CAF50');
      
      // List the secondary careers
      careerY = yPosition + 30;
      secondaryClusterInfo.careers.forEach((career, index) => {
        if (index < 5) { // Limit to 5 careers to fit on page
          addStyledText(`• ${career}`, margin + 15, careerY, 10, 'normal', 'left', '#333333');
          careerY += 8;
        }
      });
      
      // Educational Pathways section
      yPosition += 80;
      
      if (yPosition + 100 > pageHeight - 20) {  // Increased required space from 90 to 100
        // Add a new page if not enough space
        pdf.addPage();
        addPageHeader(3);
        yPosition = 40;
      }
      
      addStyledText('Educational Pathways', margin, yPosition, 14, 'bold', 'left', '#4CAF50');
      yPosition += 15;
      
      // Educational Pathway box - Made taller (100 → 110) to accommodate contents better
      pdf.setFillColor(245, 250, 245);
      pdf.roundedRect(margin, yPosition, contentWidth, 110, 5, 5, 'F');
      pdf.setDrawColor(210, 230, 210);
      pdf.roundedRect(margin, yPosition, contentWidth, 110, 5, 5, 'S');
      
      addStyledText('Recommended subjects to explore:', margin + 10, yPosition + 15, 12, 'bold', 'left', '#4CAF50');
      
      // Determine which subjects to show based on primary cluster
      let subjects: string[] = [];
      
      if (primaryCluster === "tech-innovator") {
        subjects = ["Computer Science", "Engineering", "Robotics", "Electronics", "Math", "Physics"];
      } 
      else if (primaryCluster === "digital-creator") {
        subjects = ["Digital Arts", "Graphic Design", "Media Studies", "Communications", "UX Design", "Web Development"];
      } 
      else if (primaryCluster === "data-analyst") {
        subjects = ["Statistics", "Data Science", "Mathematics", "Computer Science", "Economics", "Machine Learning"];
      } 
      else if (primaryCluster === "entrepreneur") {
        subjects = ["Business Studies", "Economics", "Marketing", "Product Management", "Communications", "Psychology"];
      } 
      else if (primaryCluster === "helper") {
        subjects = ["Social Sciences", "Global Studies", "Public Health", "Environmental Science", "Education", "Ethics"];
      }
      
      // Draw subjects in a grid (2x3) with adjusted positions
      // FIXED: Reduced width of subject boxes and increased spacing between them
      let subjectY = yPosition + 30;
      let subjectX = margin + 10;
      const subjectWidth = 50; // Reduced from 55 to 50
      const subjectHeight = 18;
      const subjectXSpacing = 60; // Increased spacing between columns
      const subjectYSpacing = 25; // Spacing between rows
      
      subjects.forEach((subject, index) => {
        // Create new row after every 3 items
        if (index > 0 && index % 3 === 0) {
          subjectY += subjectYSpacing; // Start new row
          subjectX = margin + 10; // Reset X position
        }
        
        // Create rounded rectangle for subject
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(subjectX, subjectY, subjectWidth, subjectHeight, 3, 3, 'F');
        pdf.setDrawColor(200, 220, 200);
        pdf.roundedRect(subjectX, subjectY, subjectWidth, subjectHeight, 3, 3, 'S');
        
        // Add subject name - use smaller font size for longer text
        const fontSize = subject.length > 12 ? 8 : 9;
        addStyledText(subject, subjectX + subjectWidth/2, subjectY + 11, fontSize, 'normal', 'center', '#333333');
        
        subjectX += subjectXSpacing; // Move to next column with wider spacing
      });
      
      // Note at the bottom of the results - moved down to account for the larger subject grid
      yPosition += 120; // Increased from 110 to 120
      
      // Note at the bottom of the results
      if (yPosition + 30 > pageHeight - 20) {
        // Add a new page if not enough space
        pdf.addPage();
        addPageHeader(4);
        yPosition = 40;
      }
      
      pdf.setFillColor(245, 250, 245);
      pdf.roundedRect(margin, yPosition, contentWidth, 40, 5, 5, 'F');
      pdf.setDrawColor(210, 230, 210);
      pdf.roundedRect(margin, yPosition, contentWidth, 40, 5, 5, 'S');
      
      addStyledText('Note:', margin + 10, yPosition + 15, 10, 'bold', 'left', '#333333');
      const noteText = 'These results are based on your current interests and preferences. They are meant to provide guidance, not to limit your options. Consider exploring careers that combine elements of your top pathways.';
      
      pdf.setFontSize(9);
      const splitNote = pdf.splitTextToSize(noteText, contentWidth - 20);
      pdf.text(splitNote, margin + 10, yPosition + 25);
      
      // Save the PDF
      pdf.save('Future-Pathways-Results.pdf');
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
                className="mb-4 text-brand-green hover:text-brand-green/80 -ml-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Future Pathways Results</h1>
              <p className="text-foreground/70 max-w-3xl">
                Based on your responses, we've identified your unique technology career pathway preferences.
              </p>
            </div>
            
            <Button 
              className="flex items-center bg-brand-green text-white hover:bg-brand-green/90 mt-4 md:mt-0"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
            >
              <Download className="mr-2 h-4 w-4" /> 
              {isGeneratingPDF ? 'Generating PDF...' : 'Download Results'}
            </Button>
          </div>
          
          {/* Student Details Section */}
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
          
          <div 
            ref={resultsRef} 
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl mx-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-brand-green mb-1">
                    Your Top Pathway: {pathwaysDescriptions[primaryCluster as keyof typeof pathwaysDescriptions].title}
                  </h2>
                  <p className="text-foreground/70">
                    Compatibility: <span className="font-semibold">{primaryPercentage}%</span>
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center bg-brand-green/20 px-3 py-1 rounded-full text-sm font-medium text-brand-green">
                    <Rocket className="h-4 w-4 mr-1" />
                    Future Pathways Explorer
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="bg-brand-green/5 p-6 rounded-lg border border-brand-green/10">
                  <p className="mb-4">{pathwaysDescriptions[primaryCluster as keyof typeof pathwaysDescriptions].description}</p>
                  
                  <h3 className="font-medium mb-2">Core strengths in this pathway:</h3>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    {pathwaysDescriptions[primaryCluster as keyof typeof pathwaysDescriptions].skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Your Pathway Profile</h3>
                
                <div className="space-y-4">
                  {Object.entries(clusterScores).map(([cluster, score]) => {
                    const maxScore = 5 * questions.filter(q => q.careerClusters.includes(cluster)).length;
                    const percentage = Math.round((score as number / maxPossibleScore) * 100);
                    
                    return (
                      <div key={cluster}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{pathwaysDescriptions[cluster as keyof typeof pathwaysDescriptions].title}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full bg-brand-green"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Career Recommendations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-5 border-brand-green/20 bg-brand-green/5">
                    <h4 className="font-medium mb-3 text-lg">
                      {pathwaysDescriptions[primaryCluster as keyof typeof pathwaysDescriptions].title}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {pathwaysDescriptions[primaryCluster as keyof typeof pathwaysDescriptions].careers.map((career, index) => (
                        <li key={index}>{career}</li>
                      ))}
                    </ul>
                  </Card>
                  
                  <Card className="p-5">
                    <h4 className="font-medium mb-3 text-lg">
                      {pathwaysDescriptions[secondaryCluster as keyof typeof pathwaysDescriptions].title}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {pathwaysDescriptions[secondaryCluster as keyof typeof pathwaysDescriptions].careers.map((career, index) => (
                        <li key={index}>{career}</li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Educational Pathways</h3>
                
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h4 className="font-medium mb-3">Recommended subjects to explore:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Tech Innovator subjects */}
                    {primaryCluster === "tech-innovator" && (
                      <>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Computer Science</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Engineering</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Robotics</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Electronics</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Math</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Physics</span>
                        </div>
                      </>
                    )}
                    
                    {/* Digital Creator subjects */}
                    {primaryCluster === "digital-creator" && (
                      <>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Digital Arts</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Graphic Design</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Media Studies</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Communications</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">UX Design</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Web Development</span>
                        </div>
                      </>
                    )}
                    
                    {/* Data Analyst subjects */}
                    {primaryCluster === "data-analyst" && (
                      <>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Statistics</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Data Science</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Mathematics</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Computer Science</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Economics</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Machine Learning</span>
                        </div>
                      </>
                    )}
                    
                    {/* Entrepreneur subjects */}
                    {primaryCluster === "entrepreneur" && (
                      <>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Business Studies</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Economics</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Marketing</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Product Management</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Communications</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Psychology</span>
                        </div>
                      </>
                    )}
                    
                    {/* Helper subjects */}
                    {primaryCluster === "helper" && (
                      <>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Social Sciences</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Global Studies</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Public Health</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Environmental Science</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Education</span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded-lg border border-gray-200 text-center">
                          <span className="text-sm font-medium">Ethics</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back to Assessments Button added at the bottom of the page, above footer */}
          <div className="flex justify-center mt-12 mb-8">
            <Button
              className="bg-brand-green text-white hover:bg-brand-green/90 px-6 py-2"
              onClick={() => navigate('/assessment')}
            >
              Back to Assessments
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FuturePathwaysResults;
