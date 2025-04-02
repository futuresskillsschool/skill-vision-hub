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
      
      pdf.setFillColor(103, 58, 183);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      for (let i = 0; i < 50; i++) {
        const alpha = 0.03 - (i * 0.0006);
        pdf.setFillColor(255, 255, 255, alpha);
        pdf.rect(0, i, pageWidth, 1, 'F');
      }
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RIASEC Assessment', pageWidth / 2, 25, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Career Interest Profile', pageWidth / 2, 35, { align: 'center' });
      
      pdf.setDrawColor(255, 255, 255, 0.5);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 20, 42, pageWidth - margin - 20, 42);
      
      const centerX = pageWidth / 2;
      const centerY = 100;
      const radius = 25;
      
      const typeColors = {
        'R': [66, 133, 244],
        'I': [156, 39, 176],
        'A': [229, 57, 53],
        'S': [255, 179, 0],
        'E': [255, 152, 0],
        'C': [67, 160, 71]
      };
      
      let angleOffset = 0;
      Object.entries(scores).forEach(([type, score], index) => {
        const angle = (index * 60) * Math.PI / 180;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        pdf.setDrawColor(180, 180, 180);
        pdf.setLineWidth(0.3);
        pdf.line(centerX, centerY, x, y);
        
        const typeRadius = 3 + (score / totalQuestions) * 5;
        const color = typeColors[type as keyof typeof typeColors];
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.circle(x, y, typeRadius, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text(type, x, y + 0.5, { align: 'center' });
      });
      
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, 140, contentWidth, 30, 3, 3, 'F');
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Your Holland Code:', margin + 15, 155);
      
      pdf.setTextColor(103, 58, 183);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${primaryType}${secondaryType}${tertiaryType}`, margin + contentWidth - 40, 155);
      
      if (studentDetails) {
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(margin, 180, contentWidth, 50, 3, 3, 'F');
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Student Profile', margin + 10, 195);
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const infoX = margin + 15;
        pdf.setTextColor(120, 120, 120);
        pdf.text('Name:', infoX, 205);
        pdf.text('Class & Section:', infoX, 215);
        pdf.text('School:', infoX, 225);
        
        const valueX = margin + 50;
        pdf.setTextColor(60, 60, 60);
        pdf.setFont('helvetica', 'bold');
        pdf.text(studentDetails.name, valueX, 205);
        pdf.text(`${studentDetails.class} - ${studentDetails.section}`, valueX, 215);
        pdf.text(studentDetails.school, valueX, 225);
      }
      
      const today = new Date();
      const dateString = today.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on ${dateString}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
      pdf.text('Page 1 of 3', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      pdf.addPage();
      
      pdf.setFillColor(103, 58, 183, 0.8);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RIASEC ASSESSMENT RESULTS', pageWidth / 2, 10, { align: 'center' });
      
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your RIASEC Profile', margin, 30);
      
      pdf.setDrawColor(220, 220, 220);
      pdf.setFillColor(240, 240, 240);
      
      const chartY = 45;
      const chartHeight = 80;
      
      pdf.roundedRect(margin, chartY, contentWidth, chartHeight, 3, 3, 'F');
      
      pdf.setDrawColor(230, 230, 230);
      pdf.setLineWidth(0.5);
      
      for (let i = 1; i <= 4; i++) {
        const x = margin + (contentWidth / 5) * i;
        pdf.line(x, chartY + 5, x, chartY + chartHeight - 5);
      }
      
      const maxPercentage = 100;
      const barWidth = contentWidth / 8;
      
      Object.entries(scores).forEach(([type, score], index) => {
        const barX = margin + (index * (barWidth + 5)) + 10;
        const percentage = getPercentage(score);
        const barHeight = (percentage / maxPercentage) * (chartHeight - 25);
        
        pdf.setFillColor(245, 245, 245);
        pdf.roundedRect(barX, chartY + chartHeight - 15 - barHeight, barWidth, barHeight, 2, 2, 'F');
        
        const color = typeColors[type as keyof typeof typeColors];
        pdf.setFillColor(color[0], color[1], color[2], 0.7);
        pdf.roundedRect(barX, chartY + chartHeight - 15 - barHeight, barWidth, barHeight, 2, 2, 'F');
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(80, 80, 80);
        pdf.text(type, barX + barWidth/2, chartY + chartHeight - 5, { align: 'center' });
        
        pdf.setFontSize(8);
        pdf.setTextColor(60, 60, 60);
        pdf.text(`${percentage}%`, barX + barWidth/2, chartY + chartHeight - 18 - barHeight, { align: 'center' });
      });
      
      Object.entries(riasecTypes).forEach(([type, info], index) => {
        const colIndex = index % 3;
        const rowIndex = Math.floor(index / 3);
        const legendX = margin + (colIndex * (contentWidth / 3));
        const y = legendY + (rowIndex * 15);
        
        const color = typeColors[type as keyof typeof typeColors];
        pdf.setFillColor(color[0], color[1], color[2]);
        pdf.circle(legendX + 3, y, 2.5, 'F');
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${type}: ${info.name}`, legendX + 7, y + 1);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(120, 120, 120);
        pdf.text(`(${info.title})`, legendX + 50, y + 1);
      });
      
      const primaryTypeY = legendY + 40;
      
      pdf.setFillColor(typeColors[primaryType][0], typeColors[primaryType][1], typeColors[primaryType][2], 0.1);
      pdf.roundedRect(margin, primaryTypeY, contentWidth, 80, 3, 3, 'F');
      
      pdf.setFillColor(typeColors[primaryType][0], typeColors[primaryType][1], typeColors[primaryType][2]);
      pdf.roundedRect(margin, primaryTypeY, contentWidth, 10, 3, 3, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`PRIMARY TYPE: ${riasecTypes[primaryType].name.toUpperCase()}`, margin + 10, primaryTypeY + 7);
      
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(riasecTypes[primaryType].description, margin + 5, primaryTypeY + 20, { 
        maxWidth: contentWidth - 10 
      });
      
      pdf.setFont('helvetica', 'bold');
      pdf.text("Key Strengths:", margin + 5, primaryTypeY + 40);
      
      let strengthsText = "";
      riasecTypes[primaryType].skills.forEach((skill, index) => {
        strengthsText += `• ${skill}${index < riasecTypes[primaryType].skills.length - 1 ? "\n" : ""}`;
      });
      
      pdf.text(strengthsText, margin + 10, primaryTypeY + 48, { 
        maxWidth: contentWidth - 20
      });
      
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.text('Page 2 of 3', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      pdf.addPage();
      
      pdf.setFillColor(103, 58, 183, 0.8);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RIASEC ASSESSMENT RESULTS', pageWidth / 2, 10, { align: 'center' });
      
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Career Recommendations', margin, 30);
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        'Based on your Holland Code, the following career paths might align well with your interests and strengths. ' +
        'Consider exploring these options as part of your career research.',
        margin, 40, { maxWidth: contentWidth }
      );
      
      const careerY = 55;
      const types = [primaryType, secondaryType, tertiaryType];
      const boxHeight = 65;
      
      types.forEach((type, index) => {
        const y = careerY + (index * (boxHeight + 5));
        
        pdf.setFillColor(typeColors[type as keyof typeof typeColors][0], 
                         typeColors[type as keyof typeof typeColors][1], 
                         typeColors[type as keyof typeof typeColors][2], 0.1);
        pdf.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'F');
        
        pdf.setFillColor(typeColors[type as keyof typeof typeColors][0], 
                        typeColors[type as keyof typeof typeColors][1], 
                        typeColors[type as keyof typeof typeColors][2]);
        pdf.roundedRect(margin, y, 40, boxHeight, 3, 3, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(28);
        pdf.setFont('helvetica', 'bold');
        pdf.text(type, margin + 20, y + boxHeight/2 + 5, { align: 'center' });
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(riasecTypes[type as keyof typeof riasecTypes].name, margin + 50, y + 15);
        
        pdf.setTextColor(120, 120, 120);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text(`"${riasecTypes[type as keyof typeof riasecTypes].title}"`, margin + 50, y + 25);
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text("Career Paths:", margin + 50, y + 35);
        
        const careers = riasecTypes[type as keyof typeof riasecTypes].careers.slice(0, 10);
        const midpoint = Math.ceil(careers.length / 2);
        
        pdf.setFont('helvetica', 'normal');
        
        let leftColumnText = "";
        careers.slice(0, midpoint).forEach(career => {
          leftColumnText += `• ${career}\n`;
        });
        pdf.text(leftColumnText, margin + 55, y + 42, { maxWidth: (contentWidth - 70) / 2 });
        
        if (careers.length > midpoint) {
          let rightColumnText = "";
          careers.slice(midpoint).forEach(career => {
            rightColumnText += `• ${career}\n`;
          });
          pdf.text(rightColumnText, margin + contentWidth/2, y + 42, { maxWidth: (contentWidth - 70) / 2 });
        }
      });
      
      const nextStepsY = careerY + (3 * (boxHeight + 5)) + 10;
      
      if (nextStepsY + 50 > pageHeight - 20) {
        pdf.addPage();
        
        pdf.setFillColor(103, 58, 183, 0.8);
        pdf.rect(0, 0, pageWidth, 15, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RIASEC ASSESSMENT RESULTS', pageWidth / 2, 10, { align: 'center' });
        
        const nextStepsY = 30;
        
        pdf.setFillColor(245, 245, 245);
        pdf.roundedRect(margin, nextStepsY, contentWidth, 70, 3, 3, 'F');
        
        pdf.setTextColor(103, 58, 183);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text("Next Steps", margin + 10, nextStepsY + 15);
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const nextStepsText = [
          "1. Research specific occupations related to your top RIASEC types",
          "2. Identify the education and training requirements for careers of interest",
          "3. Consider job shadowing or informational interviews with professionals",
          "4. Look for internships or volunteer opportunities in your areas of interest",
          "5. Explore related college majors or vocational programs",
          "6. Take additional targeted career assessments to refine your choices"
        ];
        
        nextStepsText.forEach((step, index) => {
          pdf.text(step, margin + 15, nextStepsY + 30 + (index * 8));
        });
        
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(margin, nextStepsY + 85, contentWidth, 40, 3, 3, 'F');
        
        pdf.setTextColor(103, 58, 183);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text("Additional Resources", margin + 10, nextStepsY + 95);
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text("• O*NET Online: www.onetonline.org - Comprehensive database of occupations", 
          margin + 15, nextStepsY + 105);
        pdf.text("• Career One Stop: www.careeronestop.org - Career exploration and job search resources", 
          margin + 15, nextStepsY + 115);
        
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(8);
        pdf.text('Page 4 of 4', pageWidth / 2, pageHeight - 10, { align: 'center' });
      } else {
        pdf.setFillColor(245, 245, 245);
        pdf.roundedRect(margin, nextStepsY, contentWidth, 70, 3, 3, 'F');
        
        pdf.setTextColor(103, 58, 183);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text("Next Steps", margin + 10, nextStepsY + 15);
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const nextStepsText = [
          "1. Research specific occupations related to your top RIASEC types",
          "2. Identify the education and training requirements for careers of interest",
          "3. Consider job shadowing or informational interviews with professionals",
          "4. Look for internships or volunteer opportunities in your areas of interest",
          "5. Explore related college majors or vocational programs"
        ];
        
        nextStepsText.forEach((step, index) => {
          pdf.text(step, margin + 15, nextStepsY + 30 + (index * 8));
        });
        
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(8);
        pdf.text('Page 3 of 3', pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
      
      pdf.setFontSize(6);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Based on John Holland\'s RIASEC model of career interests and personality types.', 
        pageWidth / 2, pageHeight - 15, { align: 'center' });
      
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
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" /> {isDownloading ? 'Generating PDF...' : 'Download Results'}
            </Button>
          </div>
          
          {studentDetails && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-purple/10 rounded-xl p-4 md:p-6 mb-6 max-w-4xl mx-auto"
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
          
          <div 
            ref={resultsRef}
            id="results-content"
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl mx-auto animate-fade-in"
          >
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
            
            <div className="p-6 md:p-8">
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
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className={`w-5 h-5 rounded-full mr-2 ${riasecTypes[secondaryType].color}`}></span>
                    Secondary: {riasecTypes[secondaryType].name}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="mb-3 text-sm">{riasecTypes[secondaryType].description}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <span className={`w-5 h-5 rounded-full mr-2 ${riasecTypes[tertiaryType].color}`}></span>
                    Tertiary: {riasecTypes[tertiaryType].name}
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="mb-3 text-sm">{riasecTypes[tertiaryType].description}</p>
                  </div>
                </div>
              </div>
              
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
              
              <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-foreground/70">
                <p>
                  Note: This assessment is based on the Holland Occupational Themes (RIASEC) model developed by psychologist John Holland. 
                  The results are meant to provide guidance and self-awareness, not to limit your options.
                  Consider exploring careers that combine elements of your top interest areas.
                </p>
              </div>
            </div>
          </div>
          
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
                  Try Future Pathways Assessment
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
