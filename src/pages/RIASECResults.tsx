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
      if (location.state?.studentDetails) {
        setStudentDetails(location.state.studentDetails);
        return;
      }
      
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
      if (user && scores && !location.state?.viewOnly) {
        try {
          console.log('Saving RIASEC results to database for user:', user.id);
          
          const { data: existingResults, error: checkError } = await supabase
            .from('assessment_results')
            .select('id')
            .eq('user_id', user.id)
            .eq('assessment_type', 'riasec')
            .maybeSingle();
            
          if (existingResults) {
            console.log('Using existing RIASEC results record');
            return;
          }
          
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
            .insert({
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
      } else {
        console.log('Skipping save to database (view-only mode or missing user/scores)');
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
      
      const addStyledText = (text: string, x: number, y: number, size: number, style: string = 'normal', align: 'left' | 'center' | 'right' = 'left', color: string = '#000000') => {
        pdf.setTextColor(color);
        pdf.setFontSize(size);
        pdf.setFont('helvetica', style);
        pdf.text(text, x, y, { align });
      };

      pdf.setFillColor(250, 250, 252);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setFillColor(230, 240, 255, 0.5);
      pdf.circle(170, 240, 30, 'F');
      
      pdf.setFillColor(240, 255, 240, 0.5);
      pdf.circle(40, 260, 20, 'F');
      
      addStyledText('RIASEC ASSESSMENT', pageWidth/2, 70, 28, 'bold', 'center', '#9370DB');
      addStyledText('RESULTS', pageWidth/2, 85, 24, 'bold', 'center', '#9370DB');
      
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      addStyledText(`Report Generated: ${currentDate}`, pageWidth/2, 105, 12, 'italic', 'center', '#777777');

      if (studentDetails) {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'F');
        pdf.setDrawColor(220, 215, 240);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, 120, contentWidth, 70, 5, 5, 'S');
        
        addStyledText('STUDENT INFORMATION', margin + 10, 135, 14, 'bold', 'left', '#9370DB');
        pdf.setLineWidth(0.5);
        pdf.setDrawColor('#9370DB');
        pdf.line(margin + 10, 138, margin + 80, 138);
        
        addStyledText('Name:', margin + 10, 155, 12, 'bold', 'left', '#555555');
        addStyledText(studentDetails.name, margin + 50, 155, 12, 'normal', 'left', '#555555');
        
        addStyledText('Class:', margin + 10, 170, 12, 'bold', 'left', '#555555');
        addStyledText(`${studentDetails.class} - ${studentDetails.section}`, margin + 50, 170, 12, 'normal', 'left', '#555555');
        
        addStyledText('School:', margin + 10, 185, 12, 'bold', 'left', '#555555');
        addStyledText(studentDetails.school, margin + 50, 185, 12, 'normal', 'left', '#555555');
      }
      
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'F');
      pdf.setDrawColor(220, 215, 240);
      pdf.roundedRect(margin, 205, contentWidth, 65, 5, 5, 'S');
      
      addStyledText('ABOUT THIS ASSESSMENT', margin + 10, 220, 14, 'bold', 'left', '#9370DB');
      pdf.line(margin + 10, 223, margin + 85, 223);
      
      addStyledText('The RIASEC Assessment identifies your career preferences based on six interest types:', 
        margin + 10, 235, 10, 'normal', 'left', '#555555');
      addStyledText('• Realistic: Working with hands, tools, machines, or outdoors', 
        margin + 10, 247, 10, 'normal', 'left', '#555555');
      addStyledText('• Investigative: Analytical thinking, research, and problem-solving', 
        margin + 10, 257, 10, 'normal', 'left', '#555555');
      addStyledText('• Artistic: Creative expression, innovation, and originality', 
        margin + 10, 267, 10, 'normal', 'left', '#555555');

      addStyledText('RIASEC Assessment Results', pageWidth/2, 285, 9, 'italic', 'center', '#777777');
      addStyledText('Page 1', margin, pageHeight - 10, 9, 'normal', 'left', '#777777');
      
      const addPageHeader = (pageNumber: number) => {
        pdf.setFillColor(250, 250, 252);
        pdf.rect(0, 0, pageWidth, 20, 'F');
        
        addStyledText('RIASEC Assessment', margin, 15, 10, 'italic', 'left', '#777777');
        addStyledText('Career Interest Profile', pageWidth - margin, 15, 12, 'bold', 'right', '#9370DB');
        
        pdf.setDrawColor(220, 215, 240);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 20, pageWidth - margin, 20);
        
        addStyledText(`Page ${pageNumber}`, margin, pageHeight - 10, 9, 'normal', 'left', '#777777');
        addStyledText(currentDate, pageWidth - margin, pageHeight - 10, 9, 'normal', 'right', '#777777');
      };
      
      pdf.addPage();
      addPageHeader(2);
      
      let yPosition = 40;
      
      addStyledText('Your Holland Code', pageWidth/2, yPosition, 18, 'bold', 'center', '#9370DB');
      yPosition += 15;
      
      pdf.setFillColor(245, 245, 255);
      pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'F');
      pdf.setDrawColor(220, 215, 240);
      pdf.roundedRect(margin, yPosition, contentWidth, 50, 5, 5, 'S');
      
      addStyledText(`${primaryType}${secondaryType}${tertiaryType}`, pageWidth/2, yPosition + 20, 24, 'bold', 'center', '#9370DB');
      
      const codeDesc = 'Your three-letter Holland Code represents your top interest areas. These indicate your strongest career preferences and work-related values.';
      pdf.setFontSize(10);
      const splitDesc = pdf.splitTextToSize(codeDesc, contentWidth - 20);
      pdf.text(splitDesc, pageWidth/2, yPosition + 35, { align: 'center' });
      
      yPosition += 65;
      
      addStyledText('Your RIASEC Profile', pageWidth/2, yPosition, 16, 'bold', 'center', '#9370DB');
      yPosition += 20;
      
      const typeColors = {
        'R': ['#D3E4FD', '#6C8EBF'],
        'I': ['#E5DEFF', '#9370DB'],
        'A': ['#FFDEE2', '#D87093'],
        'S': ['#FEF7CD', '#D4B94E'],
        'E': ['#FDE1D3', '#E69B7B'],
        'C': ['#F2FCE2', '#8FBC8F']
      };
      
      const maxPercentage = 100;
      const barWidth = contentWidth / 8;
      const chartHeight = 120;
      
      pdf.setDrawColor(220, 220, 230);
      pdf.setLineWidth(0.3);
      pdf.line(margin, yPosition + chartHeight, margin + contentWidth, yPosition + chartHeight);
      
      Object.entries(scores).forEach(([type, score], index) => {
        const barX = margin + (index * (barWidth + 5)) + 10;
        const percentage = getPercentage(score);
        const barHeight = (percentage / maxPercentage) * chartHeight;
        
        const color = typeColors[type as keyof typeof typeColors];
        pdf.setFillColor(hexToRgb(color[0]).r, hexToRgb(color[0]).g, hexToRgb(color[0]).b);
        pdf.roundedRect(barX, yPosition + chartHeight - barHeight, barWidth, barHeight, 2, 2, 'F');
        
        pdf.setFillColor(hexToRgb(color[1]).r, hexToRgb(color[1]).g, hexToRgb(color[1]).b);
        pdf.roundedRect(barX, yPosition + chartHeight - barHeight, barWidth, 5, 2, 2, 'F');
        
        addStyledText(type, barX + barWidth/2, yPosition + chartHeight + 10, 10, 'bold', 'center', '#555555');
        addStyledText(`${percentage}%`, barX + barWidth/2, yPosition + chartHeight - barHeight - 5, 8, 'normal', 'center', '#555555');
      });
      
      yPosition += chartHeight + 25;
      
      addStyledText('Legend:', margin, yPosition, 10, 'bold', 'left', '#555555');
      yPosition += 15;
      
      Object.entries(riasecTypes).forEach(([type, info], index) => {
        if (index % 2 === 0) {
          if (index > 0) yPosition += 12;
          pdf.setFillColor(hexToRgb(typeColors[type as keyof typeof typeColors][1]).r, 
                          hexToRgb(typeColors[type as keyof typeof typeColors][1]).g,
                          hexToRgb(typeColors[type as keyof typeof typeColors][1]).b);
          pdf.circle(margin + 3, yPosition, 3, 'F');
          
          addStyledText(`${type}: ${info.name}`, margin + 10, yPosition + 1, 8, 'normal', 'left', '#555555');
          addStyledText(`(${info.title})`, margin + 45, yPosition + 1, 8, 'italic', 'left', '#777777');
        } else {
          pdf.setFillColor(hexToRgb(typeColors[type as keyof typeof typeColors][1]).r,
                          hexToRgb(typeColors[type as keyof typeof typeColors][1]).g,
                          hexToRgb(typeColors[type as keyof typeof typeColors][1]).b);
          pdf.circle(margin + contentWidth/2, yPosition, 3, 'F');
          
          addStyledText(`${type}: ${info.name}`, margin + contentWidth/2 + 7, yPosition + 1, 8, 'normal', 'left', '#555555');
          addStyledText(`(${info.title})`, margin + contentWidth/2 + 42, yPosition + 1, 8, 'italic', 'left', '#777777');
        }
      });
      
      pdf.addPage();
      addPageHeader(3);
      
      yPosition = 40;
      
      addStyledText('Your Top RIASEC Types', pageWidth/2, yPosition, 18, 'bold', 'center', '#9370DB');
      yPosition += 20;
      
      const typesToShow = [primaryType, secondaryType, tertiaryType];
      
      typesToShow.forEach((type, index) => {
        const info = riasecTypes[type as keyof typeof riasecTypes];
        const color = typeColors[type as keyof typeof typeColors];
        
        pdf.setFillColor(hexToRgb(color[0]).r, hexToRgb(color[0]).g, hexToRgb(color[0]).b, 0.5);
        pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'F');
        pdf.setDrawColor(hexToRgb(color[1]).r, hexToRgb(color[1]).g, hexToRgb(color[1]).b, 0.5);
        pdf.roundedRect(margin, yPosition, contentWidth, 70, 5, 5, 'S');
        
        pdf.setFillColor(hexToRgb(color[1]).r, hexToRgb(color[1]).g, hexToRgb(color[1]).b);
        pdf.circle(margin + 15, yPosition + 15, 8, 'F');
        addStyledText(type, margin + 15, yPosition + 15 + 2, 10, 'bold', 'center', '#FFFFFF');
        
        addStyledText(`${index+1}. ${info.name}`, margin + 35, yPosition + 15, 14, 'bold', 'left', '#555555');
        addStyledText(`"${info.title}"`, margin + 35 + info.name.length * 5, yPosition + 15, 10, 'italic', 'left', '#777777');
        
        const typeDesc = pdf.splitTextToSize(info.description, contentWidth - 25);
        pdf.text(typeDesc, margin + 15, yPosition + 30);
        
        if (index === 0) {
          addStyledText('Key Strengths:', margin + 15, yPosition + 50, 10, 'bold', 'left', '#555555');
          
          let skillsText = "";
          info.skills.slice(0, 3).forEach((skill, i) => {
            skillsText += `• ${skill}${i < 2 ? "   " : ""}`;
          });
          
          addStyledText(skillsText, margin + 15, yPosition + 60, 9, 'normal', 'left', '#555555');
        }
        
        yPosition += 80;
      });
      
      if (yPosition + 160 > pageHeight - 20) {
        pdf.addPage();
        addPageHeader(4);
        yPosition = 40;
      } else {
        yPosition += 10;
      }
      
      addStyledText('Career Recommendations', pageWidth/2, yPosition, 16, 'bold', 'center', '#9370DB');
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
      
      const columnWidth = contentWidth / 2 - 5;
      
      pdf.setFillColor(hexToRgb(careerColumns.primaryType.color).r, 
                       hexToRgb(careerColumns.primaryType.color).g, 
                       hexToRgb(careerColumns.primaryType.color).b);
      pdf.roundedRect(margin, yPosition, columnWidth, 120, 5, 5, 'F');
      pdf.setDrawColor(hexToRgb(careerColumns.primaryType.borderColor).r, 
                     hexToRgb(careerColumns.primaryType.borderColor).g, 
                     hexToRgb(careerColumns.primaryType.borderColor).b, 0.5);
      pdf.roundedRect(margin, yPosition, columnWidth, 120, 5, 5, 'S');
      
      addStyledText(careerColumns.primaryType.title, margin + columnWidth/2, yPosition + 15, 12, 'bold', 'center', '#555555');
      
      careerColumns.primaryType.careers.forEach((career, i) => {
        addStyledText(`• ${career}`, margin + 10, yPosition + 35 + (i * 15), 10, 'normal', 'left', '#555555');
      });
      
      pdf.setFillColor(hexToRgb(careerColumns.secondaryType.color).r, 
                       hexToRgb(careerColumns.secondaryType.color).g, 
                       hexToRgb(careerColumns.secondaryType.color).b);
      pdf.roundedRect(margin + columnWidth + 10, yPosition, columnWidth, 120, 5, 5, 'F');
      pdf.setDrawColor(hexToRgb(careerColumns.secondaryType.borderColor).r, 
                     hexToRgb(careerColumns.secondaryType.borderColor).g, 
                     hexToRgb(careerColumns.secondaryType.borderColor).b, 0.5);
      pdf.roundedRect(margin + columnWidth + 10, yPosition, columnWidth, 120, 5, 5, 'S');
      
      addStyledText(careerColumns.secondaryType.title, margin + columnWidth + 10 + columnWidth/2, yPosition + 15, 12, 'bold', 'center', '#555555');
      
      careerColumns.secondaryType.careers.forEach((career, i) => {
        addStyledText(`• ${career}`, margin + columnWidth + 20, yPosition + 35 + (i * 15), 10, 'normal', 'left', '#555555');
      });
      
      yPosition += 130;
      
      if (yPosition + 80 > pageHeight - 20) {
        pdf.addPage();
        addPageHeader(5);
        yPosition = 40;
      } else {
        yPosition += 10;
      }
      
      pdf.setFillColor(245, 245, 255);
      pdf.roundedRect(margin, yPosition, contentWidth, 80, 5, 5, 'F');
      pdf.setDrawColor(220, 215, 240);
      pdf.roundedRect(margin, yPosition, contentWidth, 80, 5, 5, 'S');
      
      addStyledText('Next Steps', margin + 10, yPosition + 15, 14, 'bold', 'left', '#9370DB');
      
      const nextSteps = [
        "Research careers related to your top Holland Code types",
        "Consider education paths that align with these interests",
        "Connect with professionals in fields of interest",
        "Look for internships or volunteer opportunities",
        "Take related courses to explore these areas further",
        "Discuss your results with a career counselor"
      ];
      
      nextSteps.forEach((step, i) => {
        addStyledText(`${i+1}. ${step}`, margin + 15, yPosition + 35 + (i * 10), 9, 'normal', 'left', '#555555');
      });
      
      yPosition += 90;
      
      if (yPosition + 30 > pageHeight - 20) {
        pdf.addPage();
        addPageHeader(6);
        yPosition = 40;
      }
      
      const disclaimer = "Note: This assessment is based on the Holland Occupational Themes (RIASEC) model developed by psychologist John Holland. The results are meant to provide guidance and self-awareness, not to limit your options. Consider exploring careers that combine elements of your top interest areas.";
      
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      const splitDisclaimer = pdf.splitTextToSize(disclaimer, contentWidth);
      pdf.text(splitDisclaimer, pageWidth/2, yPosition, { align: 'center' });
      
      function hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 md:px-8 py-16 max-w-7xl mx-auto w-full mt-16">
        <div className="mb-8">
          <Link to="/assessment/riasec" className="inline-flex items-center text-brand-purple hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold">Your RIASEC Results</h1>
          <p className="text-gray-600 mt-2">
            Based on your responses, here are your RIASEC personality type results
          </p>
        </div>

        {studentDetails && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-purple/10 rounded-xl p-6 mb-8"
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

        <div ref={resultsRef} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Your RIASEC Profile</h2>
            <Button variant="outline" onClick={downloadResults} disabled={isDownloading} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>

          <div className="mb-10">
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-brand-purple mr-2" />
              <h3 className="text-xl font-semibold">Your Holland Code: {primaryType}{secondaryType}{tertiaryType}</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Your three-letter Holland Code represents your top three interest areas. These indicate your strongest career preferences and work-related values.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[primaryType, secondaryType, tertiaryType].map((type, index) => {
                const typeInfo = riasecTypes[type as keyof typeof riasecTypes];
                return (
                  <div key={type} className={`p-4 rounded-lg ${index === 0 ? 'bg-brand-purple/10 border border-brand-purple/20' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-brand-purple text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">
                        {type}
                      </div>
                      <h4 className="font-medium text-gray-900">{typeInfo.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">"{typeInfo.title}"</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">RIASEC Score Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(scores).map(([type, score]) => {
                const percentage = getPercentage(score);
                const typeInfo = riasecTypes[type as keyof typeof riasecTypes];
                return (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-sm font-medium text-brand-purple mr-2">
                          {type}
                        </div>
                        <span className="text-sm font-medium">{typeInfo.name} ({typeInfo.title})</span>
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-brand-purple" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Primary Type: {riasecTypes[primaryType].name}</h3>
            <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-lg p-6">
              <p className="mb-6">{riasecTypes[primaryType].description}</p>
              
              <h4 className="font-medium mb-3">Key Skills & Strengths</h4>
              <ul className="list-disc pl-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                {riasecTypes[primaryType].skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
              
              <h4 className="font-medium mb-3">Recommended Careers</h4>
              <ul className="list-disc pl-5 grid grid-cols-1 md:grid-cols-2 gap-2">
                {riasecTypes[primaryType].careers.map((career, index) => (
                  <li key={index}>{career}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Additional Career Suggestions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-5">
                <h4 className="font-medium mb-3">{riasecTypes[secondaryType].name} Careers</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {riasecTypes[secondaryType].careers.slice(0, 5).map((career, index) => (
                    <li key={index}>{career}</li>
                  ))}
                </ul>
              </div>
              
              <div className="border rounded-lg p-5">
                <h4 className="font-medium mb-3">{riasecTypes[tertiaryType].name} Careers</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {riasecTypes[tertiaryType].careers.slice(0, 5).map((career, index) => (
                    <li key={index}>{career}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
            <div className="bg-gray-50 rounded-lg p-5">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Research careers related to your top Holland Code types</li>
                <li>Consider education paths that align with these interests</li>
                <li>Connect with professionals in fields of interest</li>
                <li>Look for internships or volunteer opportunities</li>
                <li>Take related courses to explore these areas further</li>
              </ol>
            </div>
            
            <div className="mt-6 text-sm text-gray-500 italic">
              <p>Note: This assessment is based on the Holland Occupational Themes (RIASEC) model developed by psychologist John Holland. The results are meant to provide guidance and self-awareness, not to limit your options.</p>
            </div>
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

export default RIASECResults;
