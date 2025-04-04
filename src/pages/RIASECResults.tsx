import { useEffect, useRef, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Star, User, School, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

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
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      toast.loading("Generating your PDF report...");
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // Helper function for styled text
      const addStyledText = (text: string, x: number, y: number, size: number, style: string = 'normal', align: 'left' | 'center' | 'right' = 'left', color: string = '#000000') => {
        pdf.setTextColor(color);
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.text(text, x, y, { align });
      };

      // Cover page with soft background - Using pastel purple
      pdf.setFillColor(245, 242, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Decorative elements - soft circles in pastel colors
      pdf.setFillColor(230, 220, 255, 0.5);  // Light purple
      pdf.circle(170, 240, 30, 'F');
      
      pdf.setFillColor(220, 230, 255, 0.5);  // Light blue
      pdf.circle(40, 260, 20, 'F');
      
      // Title with brand purple color
      addStyledText('RIASEC ASSESSMENT', pageWidth/2, 70, 28, 'bold', 'center', '#8B5CF6');
      addStyledText('RESULTS', pageWidth/2, 85, 24, 'bold', 'center', '#8B5CF6');
      
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
        pdf.setDrawColor(200, 190, 230);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'S');
        
        addStyledText('STUDENT INFORMATION', margin + 10, 135, 14, 'bold', 'left', '#8B5CF6');
        pdf.setLineWidth(0.5);
        pdf.setDrawColor('#8B5CF6');
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
      pdf.setDrawColor(200, 190, 230);
      pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'S');
      
      addStyledText('ABOUT THIS ASSESSMENT', margin + 10, 220, 14, 'bold', 'left', '#8B5CF6');
      pdf.line(margin + 10, 223, margin + 85, 223);
      
      addStyledText('The RIASEC Assessment identifies your career preferences based on six interest types:', 
        margin + 10, 235, 10, 'normal', 'left', '#333333');
      addStyledText('• Realistic: Working with hands, tools, machines, or outdoors', 
        margin + 10, 247, 10, 'normal', 'left', '#333333');
      addStyledText('• Investigative: Analytical thinking, research, and problem-solving', 
        margin + 10, 257, 10, 'normal', 'left', '#333333');
      addStyledText('• Artistic: Creative expression, innovation, and originality', 
        margin + 10, 267, 10, 'normal', 'left', '#333333');

      // Page footer
      addStyledText('RIASEC Assessment Results', pageWidth/2, 285, 9, 'italic', 'center', '#555555');
      addStyledText('Page 1', margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
      
      // Helper function to add page header
      const addPageHeader = (pageNumber: number) => {
        // Light header background
        pdf.setFillColor(245, 242, 255); // Very light purple
        pdf.rect(0, 0, pageWidth, 20, 'F');
        
        // Header content
        addStyledText('RIASEC Assessment', margin, 15, 10, 'italic', 'left', '#555555');
        addStyledText('Career Interest Profile', pageWidth - margin, 15, 12, 'bold', 'right', '#8B5CF6');
        
        // Separator line
        pdf.setDrawColor(200, 190, 230);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 20, pageWidth - margin, 20);
        
        // Footer
        addStyledText(`Page ${pageNumber}`, margin, pageHeight - 10, 9, 'normal', 'left', '#555555');
        addStyledText(currentDate, pageWidth - margin, pageHeight - 10, 9, 'normal', 'right', '#555555');
      };
      
      // Add page 2 - Holland Code and RIASEC Profile
      pdf.addPage();
      addPageHeader(2);
      
      let yPosition = 40;
      
      // Holland Code section
      addStyledText('Your Holland Code', pageWidth/2, yPosition, 18, 'bold', 'center', '#8B5CF6');
      yPosition += 15;
      
      pdf.setFillColor(245, 242, 255);
      pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'F');
      pdf.setDrawColor(200, 190, 230);
      pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'S');
      
      addStyledText(`${primaryType}${secondaryType}${tertiaryType}`, pageWidth/2, yPosition + 20, 24, 'bold', 'center', '#8B5CF6');
      
      const codeDesc = 'Your three-letter Holland Code represents your top interest areas. These indicate your strongest career preferences and work-related values.';
      pdf.setFontSize(10);
      const splitDesc = pdf.splitTextToSize(codeDesc, contentWidth - 20);
      pdf.text(splitDesc, pageWidth/2, yPosition + 35, { align: 'center' });
      
      yPosition += 65;
      
      // RIASEC Profile Visualization
      addStyledText('Your RIASEC Profile', pageWidth/2, yPosition, 16, 'bold', 'center', '#8B5CF6');
      yPosition += 20;
      
      // Create bar chart with pastel colors
      const typeColors = {
        'R': ['#D6E4FF', '#2563EB'], // Blue
        'I': ['#E2D9F3', '#7E22CE'], // Purple
        'A': ['#FCE7F3', '#DB2777'], // Pink
        'S': ['#FEFBC2', '#CA8A04'], // Yellow
        'E': ['#FFE2CC', '#EA580C'], // Orange
        'C': ['#DCFCE7', '#16A34A']  // Green
      };
      
      const maxPercentage = 100;
      const barWidth = contentWidth / 8;
      const chartHeight = 120;
      
      // Draw chart axes
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPosition + chartHeight, margin + contentWidth, yPosition + chartHeight); // X-axis
      
      // Draw bars for each RIASEC type
      Object.entries(scores).forEach(([type, score], index) => {
        const barX = margin + (index * (barWidth + 5)) + 10;
        const percentage = getPercentage(score);
        const barHeight = (percentage / maxPercentage) * chartHeight;
        
        // Bar background
        const color = typeColors[type as keyof typeof typeColors];
        pdf.setFillColor(hexToRgb(color[0]).r, hexToRgb(color[0]).g, hexToRgb(color[0]).b);
        pdf.roundedRect(barX, yPosition + chartHeight - barHeight, barWidth, barHeight, 2, 2, 'F');
        
        // Bar top - darker shade
        pdf.setFillColor(hexToRgb(color[1]).r, hexToRgb(color[1]).g, hexToRgb(color[1]).b);
        pdf.roundedRect(barX, yPosition + chartHeight - barHeight, barWidth, 5, {tl: 2, tr: 2, bl: 0, br: 0}, 'F');
        
        // Type label and percentage
        addStyledText(type, barX + barWidth/2, yPosition + chartHeight + 10, 10, 'bold', 'center', '#333333');
        addStyledText(`${percentage}%`, barX + barWidth/2, yPosition + chartHeight - barHeight - 5, 8, 'normal', 'center', '#333333');
      });
      
      yPosition += chartHeight + 25;
      
      // Legend
      addStyledText('Legend:', margin, yPosition, 10, 'bold', 'left', '#333333');
      yPosition += 15;
      
      Object.entries(riasecTypes).forEach(([type, info], index) => {
        if (index % 2 === 0) {
          if (index > 0) yPosition += 12;
          pdf.setFillColor(hexToRgb(typeColors[type as keyof typeof typeColors][1]).r, 
                           hexToRgb(typeColors[type as keyof typeof typeColors][1]).g,
                           hexToRgb(typeColors[type as keyof typeof typeColors][1]).b);
          pdf.circle(margin + 3, yPosition, 3, 'F');
          
          addStyledText(`${type}: ${info.name}`, margin + 10, yPosition + 1, 8, 'normal', 'left', '#333333');
          addStyledText(`(${info.title})`, margin + 45, yPosition + 1, 8, 'italic', 'left', '#555555');
        } else {
          pdf.setFillColor(hexToRgb(typeColors[type as keyof typeof typeColors][1]).r,
                           hexToRgb(typeColors[type as keyof typeof typeColors][1]).g,
                           hexToRgb(typeColors[type as keyof typeof typeColors][1]).b);
          pdf.circle(margin + contentWidth/2, yPosition, 3, 'F');
          
          addStyledText(`${type}: ${info.name}`, margin + contentWidth/2 + 7, yPosition + 1, 8, 'normal', 'left', '#333333');
          addStyledText(`(${info.title})`, margin + contentWidth/2 + 42, yPosition + 1, 8, 'italic', 'left', '#555555');
        }
      });
      
      // Add page 3 - Top Types and Career Recommendations
      pdf.addPage();
      addPageHeader(3);
      
      yPosition = 40;
      
      // Primary Type
      addStyledText('Your Top RIASEC Types', pageWidth/2, yPosition, 18, 'bold', 'center', '#8B5CF6');
      yPosition += 20;
      
      // Primary Type Box
      const typesToShow = [primaryType, secondaryType, tertiaryType];
      
      typesToShow.forEach((type, index) => {
        const info = riasecTypes[type as keyof typeof riasecTypes];
        const color = typeColors[type as keyof typeof typeColors];
        
        pdf.setFillColor(hexToRgb(color[0]).r, hexToRgb(color[0]).g, hexToRgb(color[0]).b, 0.5);
        pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'F');
        pdf.setDrawColor(hexToRgb(color[1]).r, hexToRgb(color[1]).g, hexToRgb(color[1]).b, 0.5);
        pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'S');
        
        // Type badge
        pdf.setFillColor(hexToRgb(color[1]).r, hexToRgb(color[1]).g, hexToRgb(color[1]).b);
        pdf.circle(margin + 15, yPosition + 15, 8, 'F');
        addStyledText(type, margin + 15, yPosition + 15 + 2, 10, 'bold', 'center', '#FFFFFF');
        
        // Type name and title
        addStyledText(`${index+1}. ${info.name}`, margin + 35, yPosition + 15, 14, 'bold', 'left', hexToRgb(color[1]).r, hexToRgb(color[1]).g, hexToRgb(color[1]).b);
        addStyledText(`"${info.title}"`, margin + 35 + info.name.length * 5, yPosition + 15, 10, 'italic', 'left', '#555555');
        
        // Description
        const typeDesc = pdf.splitTextToSize(info.description, contentWidth - 25);
        pdf.text(typeDesc, margin + 15, yPosition + 30);
        
        // Key strengths
        if (index === 0) { // Only show skills/strengths for primary type to save space
          addStyledText('Key Strengths:', margin + 15, yPosition + 50, 10, 'bold', 'left', '#333333');
          
          let skillsText = "";
          info.skills.slice(0, 3).forEach((skill, i) => {
            skillsText += `• ${skill}${i < 2 ? "   " : ""}`;
          });
          
          addStyledText(skillsText, margin + 15, yPosition + 60, 9, 'normal', 'left', '#333333');
        }
        
        yPosition += 80;
      });
      
      // Career Recommendations
      if (yPosition + 160 > pageHeight - 20) {
        pdf.addPage();
        addPageHeader(4);
        yPosition = 40;
      } else {
        yPosition += 10;
      }
      
      addStyledText('Career Recommendations', pageWidth/2, yPosition, 16, 'bold', 'center', '#8B5CF6');
      yPosition += 20;
      
      const careerColumns = {
        primaryType: {
          careers: riasecTypes[primaryType].careers.slice(0, 5),
          color: typeColors[primaryType as keyof typeof typeColors][0],
          borderColor: typeColors[primaryType as keyof typeof typeColors][1],
          title: riasecTypes[primaryType].name
        },
        secondaryType: {
          careers: riasecTypes[secondaryType].careers.slice(0, 5),
          color: typeColors[secondaryType as keyof typeof typeColors][0],
          borderColor: typeColors[secondaryType as keyof typeof typeColors][1],
          title: riasecTypes[secondaryType].name
        }
      };
      
      // Create two column layout for careers
      const columnWidth = contentWidth / 2 - 5;
      
      // Primary Type Careers
      pdf.setFillColor(hexToRgb(careerColumns.primaryType.color).r, 
                       hexToRgb(careerColumns.primaryType.color).g, 
                       hexToRgb(careerColumns.primaryType.color).b);
      pdf.roundedRect(margin, yPosition, columnWidth, 120, 5, 5, 'F');
      pdf.setDrawColor(hexToRgb(careerColumns.primaryType.borderColor).r, 
                     hexToRgb(careerColumns.primaryType.borderColor).g, 
                     hexToRgb(careerColumns.primaryType.borderColor).b, 0.5);
      pdf.roundedRect(margin, yPosition, columnWidth, 120, 5, 5, 'S');
      
      addStyledText(careerColumns.primaryType.title, margin + columnWidth/2, yPosition + 15, 12, 'bold', 'center', '#333333');
      
      careerColumns.primaryType.careers.forEach((career, i) => {
        addStyledText(`• ${career}`, margin + 10, yPosition + 35 + (i * 15), 10, 'normal', 'left', '#333333');
      });
      
      // Secondary Type Careers
      pdf.setFillColor(hexToRgb(careerColumns.secondaryType.color).r, 
                       hexToRgb(careerColumns.secondaryType.color).g, 
                       hexToRgb(careerColumns.secondaryType.color).b);
      pdf.roundedRect(margin + columnWidth + 10, yPosition, columnWidth, 120, 5, 5, 'F');
      pdf.setDrawColor(hexToRgb(careerColumns.secondaryType.borderColor).r, 
                     hexToRgb(careerColumns.secondaryType.borderColor).g, 
                     hexToRgb(careerColumns.secondaryType.borderColor).b, 0.5);
      pdf.roundedRect(margin + columnWidth + 10, yPosition, columnWidth, 120, 5, 5, 'S');
      
      addStyledText(careerColumns.secondaryType.title, margin + columnWidth + 10 + columnWidth/2, yPosition + 15, 12, 'bold', 'center', '#333333');
      
      careerColumns.secondaryType.careers.forEach((career, i) => {
        addStyledText(`• ${career}`, margin + columnWidth + 20, yPosition + 35 + (i * 15), 10, 'normal', 'left', '#333333');
      });
      
      yPosition += 130;
      
      // Next Steps section
      if (yPosition + 80 > pageHeight - 20) {
        pdf.addPage();
        addPageHeader(5);
        yPosition = 40;
      } else {
        yPosition += 10;
      }
      
      pdf.setFillColor(245, 242, 255);
      pdf.roundedRect(margin, yPosition, contentWidth, 80, 5, 5, 'F');
      pdf.setDrawColor(200, 190, 230);
      pdf.roundedRect(margin, yPosition, contentWidth, 80, 5, 5, 'S');
      
      addStyledText('Next Steps', margin + 10, yPosition + 15, 14, 'bold', 'left', '#8B5CF6');
      
      const nextSteps = [
        "Research careers related to your top Holland Code types",
        "Consider education paths that align with these interests",
        "Connect with professionals in fields of interest",
        "Look for internships or volunteer opportunities",
        "Take related courses to explore these areas further",
        "Discuss your results with a career counselor"
      ];
      
      nextSteps.forEach((step, i) => {
        addStyledText(`${i+1}. ${step}`, margin + 15, yPosition + 35 + (i * 10), 9, 'normal', 'left', '#333333');
      });
      
      // Add disclaimer
      yPosition += 90;
      
      if (yPosition + 30 > pageHeight - 20) {
        pdf.addPage();
        addPageHeader(6);
        yPosition = 40;
      }
      
      const disclaimer = "Note: This assessment is based on the Holland Occupational Themes (RIASEC) model developed by psychologist John Holland. The results are meant to provide guidance and self-awareness, not to limit your options. Consider exploring careers that combine elements of your top interest areas.";
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      const splitDisclaimer = pdf.splitTextToSize(disclaimer, contentWidth);
      pdf.text(splitDisclaimer, pageWidth/2, yPosition, { align: 'center' });
      
      // Helper function to convert hex to RGB
      function hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
