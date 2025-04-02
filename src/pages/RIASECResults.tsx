import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, BrainCircuit, CheckCircle2, XCircle, User, School, BookOpen, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

interface RIASECResultsProps {
  scores: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
  studentId?: string;
}

interface RIASECType {
  name: string;
  title: string;
  description: string;
  careers: string[];
  skills: string[];
}

const riasecTypes: Record<string, RIASECType> = {
  R: {
    name: 'Realistic',
    title: 'The Doer',
    description: 'Practical, hands-on, and enjoy working with tools, machines, or plants and animals.',
    careers: [
      'Mechanic',
      'Engineer',
      'Construction Worker',
      'Farmer',
      'Pilot'
    ],
    skills: [
      'Mechanical Skills',
      'Technical Skills',
      'Problem-Solving',
      'Physical Stamina',
      'Practical Knowledge'
    ]
  },
  I: {
    name: 'Investigative',
    title: 'The Thinker',
    description: 'Analytical, curious, and enjoy research, problem-solving, and scientific activities.',
    careers: [
      'Scientist',
      'Researcher',
      'Analyst',
      'Doctor',
      'Software Developer'
    ],
    skills: [
      'Analytical Skills',
      'Research Skills',
      'Critical Thinking',
      'Data Analysis',
      'Problem Solving'
    ]
  },
  A: {
    name: 'Artistic',
    title: 'The Creator',
    description: 'Creative, expressive, and enjoy art, music, writing, and other forms of creative expression.',
    careers: [
      'Artist',
      'Writer',
      'Musician',
      'Designer',
      'Actor'
    ],
    skills: [
      'Creativity',
      'Imagination',
      'Communication',
      'Visual Skills',
      'Performing Arts'
    ]
  },
  S: {
    name: 'Social',
    title: 'The Helper',
    description: 'Empathetic, helpful, and enjoy working with people, teaching, counseling, or providing care.',
    careers: [
      'Teacher',
      'Counselor',
      'Nurse',
      'Social Worker',
      'Therapist'
    ],
    skills: [
      'Communication Skills',
      'Empathy',
      'Interpersonal Skills',
      'Teaching',
      'Helping Others'
    ]
  },
  E: {
    name: 'Enterprising',
    title: 'The Persuader',
    description: 'Ambitious, persuasive, and enjoy leadership, sales, and business-related activities.',
    careers: [
      'Manager',
      'Salesperson',
      'Entrepreneur',
      'Lawyer',
      'Politician'
    ],
    skills: [
      'Leadership Skills',
      'Sales Skills',
      'Communication Skills',
      'Persuasion',
      'Business Acumen'
    ]
  },
  C: {
    name: 'Conventional',
    title: 'The Organizer',
    description: 'Detail-oriented, organized, and enjoy working with data, numbers, and structured environments.',
    careers: [
      'Accountant',
      'Administrator',
      'Data Analyst',
      'Secretary',
      'Financial Analyst'
    ],
    skills: [
      'Organizational Skills',
      'Attention to Detail',
      'Data Analysis',
      'Mathematical Skills',
      'Record Keeping'
    ]
  }
};

const RIASECResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scores, setScores] = useState<{ R: number; I: number; A: number; S: number; E: number; C: number; } | null>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const state = location.state as RIASECResultsProps;
    if (state && state.scores) {
      setScores(state.scores);
      
      const fetchStudentDetails = async () => {
        if (state.studentId) {
          try {
            const { data, error } = await supabase
              .from('student_details')
              .select('*')
              .eq('id', state.studentId)
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
    } else {
      navigate('/assessment/riasec');
    }
  }, [location, navigate]);
  
  const pastelColors = {
    R: '#D3E4FD',
    I: '#E5DEFF',
    A: '#FFDEE2',
    S: '#FEF7CD',
    E: '#FDE1D3',
    C: '#F2FCE2'
  };
  
  const outlineColors = {
    R: '#4285F4',
    I: '#9C27B0',
    A: '#E53935',
    S: '#FFB300',
    E: '#FF9800',
    C: '#43A047'
  };
  
  if (!scores) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">No Results Available</h1>
            <p className="mb-8">No assessment results were found. Please complete the assessment first.</p>
            <Link to="/assessment/riasec">
              <Button className="bg-brand-purple hover:bg-brand-purple/90">
                Take RIASEC Assessment
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const getPercentage = (score: number) => {
    return Math.round((score / 10) * 100);
  };
  
  const sortedTypes = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([type]) => type);
  
  const primaryType = sortedTypes[0];
  const secondaryType = sortedTypes[1];
  const tertiaryType = sortedTypes[2];
  
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
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      
      pdf.setFillColor(103, 58, 183);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RIASEC Assessment Results', pageWidth / 2, 25, { align: 'center' });
      
      if (studentDetails) {
        const studentInfoY = 50;
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(80, 80, 80);
        pdf.text('Student Information', margin, studentInfoY);
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Name: ${studentDetails.name}`, margin, studentInfoY + 10);
        pdf.text(`Class: ${studentDetails.class} - ${studentDetails.section}`, margin, studentInfoY + 17);
        pdf.text(`School: ${studentDetails.school}`, margin, studentInfoY + 24);
      }
      
      const hollandCodeY = studentDetails ? 90 : 50;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(80, 80, 80);
      pdf.text('Your Holland Code', margin, hollandCodeY);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Primary: ${primaryType} (${riasecTypes[primaryType].name})`, margin, hollandCodeY + 10);
      pdf.text(`Secondary: ${secondaryType} (${riasecTypes[secondaryType].name})`, margin, hollandCodeY + 17);
      pdf.text(`Tertiary: ${tertiaryType} (${riasecTypes[tertiaryType].name})`, margin, hollandCodeY + 24);
      
      const primaryTypeY = studentDetails ? 130 : 90;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Your Primary Type: ${riasecTypes[primaryType].name}`, margin, primaryTypeY);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(riasecTypes[primaryType].description, margin, primaryTypeY + 10, { maxWidth: contentWidth });
      
      const chartY = studentDetails ? primaryTypeY + 60 : primaryTypeY + 55;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Your RIASEC Profile', margin, chartY);
      
      const chartWidth = contentWidth;
      const chartHeight = 70;
      const barWidth = chartWidth / 6;
      const maxBarHeight = 50;
      
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, chartY + 10, chartWidth, chartHeight, 3, 3, 'F');
      
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.2);
      
      for (let i = 0; i <= 5; i++) {
        const y = chartY + 10 + chartHeight - (i * (chartHeight / 5));
        pdf.line(margin, y, margin + chartWidth, y);
        
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(6);
        pdf.text(`${i * 20}%`, margin - 5, y, { align: 'right' });
      }
      
      Object.entries(scores).forEach(([type, score], index) => {
        const percentage = getPercentage(score);
        const barHeight = (percentage / 100) * maxBarHeight;
        const barX = margin + (index * barWidth) + 5;
        const barY = chartY + 10 + chartHeight - barHeight - 10;
        
        pdf.setFillColor(parseInt(pastelColors[type as keyof typeof pastelColors].substring(1, 3), 16),
                          parseInt(pastelColors[type as keyof typeof pastelColors].substring(3, 5), 16),
                          parseInt(pastelColors[type as keyof typeof pastelColors].substring(5, 7), 16));
        pdf.roundedRect(barX, barY, barWidth - 10, barHeight, 2, 2, 'F');
        
        pdf.setDrawColor(parseInt(outlineColors[type as keyof typeof outlineColors].substring(1, 3), 16),
                         parseInt(outlineColors[type as keyof typeof outlineColors].substring(3, 5), 16),
                         parseInt(outlineColors[type as keyof typeof outlineColors].substring(5, 7), 16));
        pdf.setLineWidth(0.5);
        pdf.roundedRect(barX, barY, barWidth - 10, barHeight, 2, 2, 'S');
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(type, barX + (barWidth - 10) / 2, chartY + 10 + chartHeight + 8, { align: 'center' });
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(9);
        pdf.text(`${percentage}%`, barX + barWidth/2 - 5, barY + (barHeight / 2) + 3, { align: 'center' });
      });
      
      const legendY = chartY + chartHeight + 15;
      
      Object.entries(riasecTypes).forEach(([type, info], index) => {
        const colIndex = index % 3;
        const rowIndex = Math.floor(index / 3);
        const legendX = margin + colIndex * (contentWidth / 3);
        
        pdf.setFillColor(parseInt(outlineColors[type as keyof typeof outlineColors].substring(1, 3), 16),
                         parseInt(outlineColors[type as keyof typeof outlineColors].substring(3, 5), 16),
                         parseInt(outlineColors[type as keyof typeof outlineColors].substring(5, 7), 16));
        pdf.circle(legendX + 3, legendY + rowIndex * 10 + 3, 3, 'F');
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${type}: ${info.name} (${info.title})`, legendX + 8, legendY + rowIndex * 10 + 5);
      });
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page 1 of 2`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      pdf.addPage();
      
      pdf.setFillColor(103, 58, 183);
      pdf.rect(0, 0, pageWidth, 20, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RIASEC Career Recommendations', pageWidth / 2, 13, { align: 'center' });
      
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Potential Career Paths', margin, 30);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Based on your Holland Code, these career paths might be a good fit for your personality type:', 
        margin, 40, { maxWidth: contentWidth });
      
      const careers = {
        [primaryType]: riasecTypes[primaryType].careers.slice(0, 5),
        [secondaryType]: riasecTypes[secondaryType].careers.slice(0, 5),
        [tertiaryType]: riasecTypes[tertiaryType].careers.slice(0, 5)
      };
      
      const typeNames = {
        [primaryType]: `Primary: ${riasecTypes[primaryType].name}`,
        [secondaryType]: `Secondary: ${riasecTypes[secondaryType].name}`,
        [tertiaryType]: `Tertiary: ${riasecTypes[tertiaryType].name}`
      };
      
      Object.entries(careers).forEach(([type, careerList], index) => {
        const yPosition = 55 + (index * 65);
        
        pdf.setFillColor(parseInt(pastelColors[type as keyof typeof pastelColors].substring(1, 3), 16),
                          parseInt(pastelColors[type as keyof typeof pastelColors].substring(3, 5), 16),
                          parseInt(pastelColors[type as keyof typeof pastelColors].substring(5, 7), 16));
        pdf.roundedRect(margin, yPosition - 5, contentWidth, 55, 3, 3, 'F');
        
        pdf.setDrawColor(parseInt(outlineColors[type as keyof typeof outlineColors].substring(1, 3), 16),
                          parseInt(outlineColors[type as keyof typeof outlineColors].substring(3, 5), 16),
                          parseInt(outlineColors[type as keyof typeof outlineColors].substring(5, 7), 16));
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, yPosition - 5, contentWidth, 55, 3, 3, 'S');
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(typeNames[type as keyof typeof typeNames], margin + 5, yPosition + 5);
        
        const careerColumnWidth = contentWidth / 2 - 10;
        careerList.forEach((career, careerIndex) => {
          const column = careerIndex % 2;
          const row = Math.floor(careerIndex / 2);
          const careerX = margin + 10 + (column * careerColumnWidth);
          const careerY = yPosition + 20 + (row * 10);
          
          pdf.setFillColor(parseInt(outlineColors[type as keyof typeof outlineColors].substring(1, 3), 16),
                           parseInt(outlineColors[type as keyof typeof outlineColors].substring(3, 5), 16),
                           parseInt(outlineColors[type as keyof typeof outlineColors].substring(5, 7), 16));
          pdf.circle(careerX - 3, careerY - 1, 1.5, 'F');
          
          pdf.setTextColor(80, 80, 80);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(career, careerX, careerY);
        });
      });
      
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Skills For Your Primary Type', margin, skillsY);
      
      pdf.setFillColor(parseInt(pastelColors[primaryType].substring(1, 3), 16),
                       parseInt(pastelColors[primaryType].substring(3, 5), 16),
                       parseInt(pastelColors[primaryType].substring(5, 7), 16));
      pdf.roundedRect(margin, skillsY + 5, contentWidth, 50, 3, 3, 'F');
      
      pdf.setDrawColor(parseInt(outlineColors[primaryType].substring(1, 3), 16),
                       parseInt(outlineColors[primaryType].substring(3, 5), 16),
                       parseInt(outlineColors[primaryType].substring(5, 7), 16));
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin, skillsY + 5, contentWidth, 50, 3, 3, 'S');
      
      skills.forEach((skill, index) => {
        const column = index % 2;
        const row = Math.floor(index / 2);
        const skillX = margin + 10 + (column * (contentWidth / 2 - 10));
        const skillY = skillsY + 20 + (row * 10);
        
        pdf.setFillColor(parseInt(outlineColors[primaryType].substring(1, 3), 16),
                         parseInt(outlineColors[primaryType].substring(3, 5), 16),
                         parseInt(outlineColors[primaryType].substring(5, 7), 16));
        pdf.circle(skillX - 3, skillY - 1, 1.5, 'F');
        
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(skill, skillX, skillY);
      });
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('This assessment is based on the Holland Occupational Themes (RIASEC) model developed by psychologist John Holland.',
        pageWidth / 2, pageHeight - 15, { align: 'center', maxWidth: contentWidth });
      pdf.text('Page 2 of 2', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
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
          <div className="mb-8 flex justify-between items-start">
            <div>
              <Link to="/assessment/riasec" className="inline-flex items-center text-brand-purple hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assessment
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold">Your RIASEC Results</h1>
            </div>
            
            <Button
              variant="outline"
              onClick={downloadResults}
              disabled={isDownloading}
              className="hidden md:flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Generating..." : "Download PDF Report"}
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
            className="bg-white rounded-xl shadow-card p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold mb-4">Your Top RIASEC Types</h2>
            <p className="text-gray-600 mb-6">
              Based on your assessment results, here are your top RIASEC types:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sortedTypes.slice(0, 3).map((type, index) => (
                <Card key={type} className="border-brand-purple/20">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{riasecTypes[type].name}</CardTitle>
                    <CardDescription className="text-brand-purple">{riasecTypes[type].title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{riasecTypes[type].description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RIASECResults;
