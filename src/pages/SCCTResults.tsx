import { useEffect, useRef, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Star, Book, User, School, FileText, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Import Chart.js directly with type imports
import { 
  Chart,
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Career suggestions based on SCCT assessment sections
const careerSuggestions = {
  self_efficacy: {
    high: [
      "Leadership positions",
      "Public speaking roles",
      "Entrepreneurship",
      "Competitive fields",
      "Project management"
    ],
    low: [
      "Structured environments",
      "Mentored positions",
      "Collaborative roles",
      "Step-by-step learning paths",
      "Positions with clear expectations"
    ]
  },
  outcome_expectations: {
    high: [
      "Long-term career paths",
      "Fields requiring commitment",
      "Higher education tracks",
      "Specialized professions",
      "Role model positions"
    ],
    low: [
      "Short-term rewarding roles",
      "Careers with visible outcomes",
      "Internships and shadowing",
      "Career exposure programs",
      "Positions with quick feedback loops"
    ]
  },
  career_interests: {
    investigative: "Science, Research, Analytics, Technology",
    artistic: "Design, Media, Creative Writing, Performing Arts",
    enterprising: "Business, Politics, Management, Sales",
    social: "Teaching, Counseling, Healthcare, Community Service",
    conventional: "Accounting, Administration, Data Management, Quality Control"
  },
  environmental_support: {
    high: [
      "Independent career paths",
      "Self-directed learning",
      "Remote work opportunities",
      "Creative entrepreneurship",
      "Cross-disciplinary careers"
    ],
    low: [
      "Structured mentorship programs",
      "Team-based environments",
      "Career guidance services",
      "Professional networks",
      "Supportive work cultures"
    ]
  },
  perceived_barriers: {
    high: [
      "Careers with strong support systems",
      "Inclusive workplace environments",
      "Fields with good entry-level opportunities",
      "Careers with multiple entry paths",
      "Step-by-step professional development tracks"
    ],
    low: [
      "Competitive fields",
      "Paths requiring risk-taking",
      "Leadership positions",
      "Innovative industries",
      "Entrepreneurial ventures"
    ]
  }
};

// Development strategies based on SCCT results
const developmentStrategies = {
  self_efficacy: {
    high: [
      "Take on leadership roles in extracurricular activities",
      "Participate in debate or public speaking competitions",
      "Mentor others in your areas of strength",
      "Challenge yourself with increasingly difficult projects",
      "Journal about successful experiences to reinforce confidence"
    ],
    low: [
      "Break tasks into smaller, achievable steps",
      "Find a mentor who can provide guidance and support",
      "Practice skills in safe, low-pressure environments",
      "Focus on improvement rather than perfection",
      "Celebrate small successes and progress"
    ]
  },
  outcome_expectations: {
    high: [
      "Research career paths of role models you admire",
      "Set long-term goals with meaningful milestones",
      "Connect with professionals through informational interviews",
      "Explore how your values align with different career options",
      "Create a vision board of your career aspirations"
    ],
    low: [
      "Learn about success stories in fields you're interested in",
      "Seek out information about job satisfaction in different careers",
      "Explore the connection between education and career outcomes",
      "Participate in career fairs and information sessions",
      "Identify short-term benefits of pursuing your interests"
    ]
  },
  career_interests: {
    general: [
      "Take career interest inventories and assessments",
      "Try volunteering in different fields",
      "Shadow professionals in various careers",
      "Join clubs or activities related to potential interests",
      "Take diverse elective courses to explore new subjects"
    ]
  },
  environmental_support: {
    high: [
      "Leverage your support network for opportunities",
      "Seek out advanced learning opportunities",
      "Share your goals with supportive people in your life",
      "Use available resources to explore career options",
      "Connect with school counselors and career services"
    ],
    low: [
      "Research online communities related to your interests",
      "Find mentoring programs in your area or online",
      "Look for scholarships and financial aid opportunities",
      "Connect with teachers or professionals for guidance",
      "Seek out free career development resources online"
    ]
  },
  perceived_barriers: {
    high: [
      "Identify specific concerns and research solutions",
      "Connect with people who have overcome similar challenges",
      "Break long-term goals into manageable steps",
      "Seek out diversity and inclusion programs in your field of interest",
      "Practice positive self-talk and mindfulness"
    ],
    low: [
      "Take on challenges that push your comfort zone",
      "Set stretch goals in addition to achievable ones",
      "Explore careers that might seem out of reach",
      "Network with professionals in competitive fields",
      "Consider entrepreneurial opportunities"
    ]
  }
};

// Type definitions
type Section = {
  id: string;
  title: string;
  description: string;
  interpretation: {
    high: string;
    low: string;
  };
};

type Answer = {
  questionId: number;
  answer: number;
  section: string;
};

type SCCTScores = Record<string, number>;

const SCCTResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { user, storeAssessmentResult } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Get scores, sections, and answers from location state
  const scores: SCCTScores = location.state?.scores || {};
  const sections: Section[] = location.state?.sections || [];
  const answers: Answer[] = location.state?.answers || [];
  const studentId = location.state?.studentId;
  const studentDetails = location.state?.studentDetails || {};
  
  useEffect(() => {
    console.log("SCCTResults - Location state:", location.state);
    console.log("Scores:", scores);
    console.log("Sections:", sections);
    console.log("Answers:", answers);
    console.log("Student ID:", studentId);
    
    // If no location state data, redirect to the assessment page
    if (!location.state) {
      console.log("No state data, redirecting to assessment page");
      navigate('/assessment/scct');
      return;
    }
    
    // If no student ID in the state, redirect to student details form
    if (!location.state.studentId) {
      console.log("No student ID, redirecting to student details form");
      navigate('/assessment/scct/student-details', { state: location.state });
      return;
    }
    
    window.scrollTo(0, 0);
    
    // Store assessment results if user is logged in
    if (user) {
      const saveResult = async () => {
        try {
          await storeAssessmentResult('scct', { scores, sections, answers });
        } catch (error) {
          console.error('Error saving assessment result:', error);
        }
      };
      
      saveResult();
    }
  }, [location.state, navigate, user, storeAssessmentResult, scores, sections, answers, studentId]);
  
  // Calculate max possible score for each section (5 questions per section, max 5 points each)
  const maxSectionScore = 25; // 5 questions × 5 points
  
  // Determine level for each section (high, medium, low)
  const getSectionLevel = (sectionId: string) => {
    const score = scores[sectionId] || 0;
    const percentage = (score / maxSectionScore) * 100;
    
    if (percentage >= 70) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
  };
  
  // Get interpretation for a section based on level
  const getInterpretation = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    const level = getSectionLevel(sectionId);
    
    if (!section) return '';
    
    return level === 'high' ? section.interpretation.high : section.interpretation.low;
  };
  
  // Prepare chart data for radar chart
  const getChartData = () => {
    const labels = sections.map(section => section.title.split('(')[0].trim());
    
    // For radar chart, handle perceived barriers inversely (higher raw score = more barriers = lower score on chart)
    const dataValues = sections.map(section => {
      const rawScore = scores[section.id] || 0;
      
      // For perceived barriers, invert the score (25 - rawScore) so that lower barriers show as higher values
      if (section.id === 'perceived_barriers') {
        // Normalize to 0-100 scale
        return ((maxSectionScore - rawScore) / maxSectionScore) * 100;
      }
      
      // Normalize all other scores to 0-100 scale
      return (rawScore / maxSectionScore) * 100;
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Your SCCT Profile',
          data: dataValues,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
          pointRadius: 4,
        }
      ]
    };
  };
  
  // Radar chart options
  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          display: false,
          stepSize: 20
        },
        pointLabels: {
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Score: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };
  
  // Prepare data for bar chart of career interests
  const getCareerInterestsData = () => {
    const careerQuestions = answers.filter(a => a.section === 'career_interests');
    const interestAreas = ['Investigative', 'Artistic', 'Enterprising', 'Social', 'Conventional'];
    
    // Map questions to interest areas
    const questionMapping = {
      11: 'Investigative',
      12: 'Artistic',
      13: 'Enterprising',
      14: 'Social',
      15: 'Conventional'
    };
    
    // Calculate scores for each interest area
    const interestScores = interestAreas.map(area => {
      const question = careerQuestions.find(q => 
        questionMapping[q.questionId as keyof typeof questionMapping] === area
      );
      return question ? (question.answer + 1) : 0; // Convert 0-4 to 1-5
    });
    
    return {
      labels: interestAreas,
      datasets: [
        {
          label: 'Interest Level',
          data: interestScores,
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  // Bar chart options
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
            return `${labels[context.raw-1]} (${context.raw}/5)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };
  
  // Get career suggestions based on profile
  const getCareerSuggestions = () => {
    const suggestions: string[] = [];
    
    // Add suggestions based on self-efficacy
    const selfEfficacyLevel = getSectionLevel('self_efficacy');
    if (selfEfficacyLevel === 'high' || selfEfficacyLevel === 'medium') {
      suggestions.push(...careerSuggestions.self_efficacy.high.slice(0, 3));
    } else {
      suggestions.push(...careerSuggestions.self_efficacy.low.slice(0, 3));
    }
    
    // Add suggestions based on outcome expectations
    const outcomeExpectationsLevel = getSectionLevel('outcome_expectations');
    if (outcomeExpectationsLevel === 'high' || outcomeExpectationsLevel === 'medium') {
      suggestions.push(...careerSuggestions.outcome_expectations.high.slice(0, 2));
    } else {
      suggestions.push(...careerSuggestions.outcome_expectations.low.slice(0, 2));
    }
    
    // Add suggestions based on perceived barriers
    const perceivedBarriersLevel = getSectionLevel('perceived_barriers');
    if (perceivedBarriersLevel === 'high') {
      suggestions.push(...careerSuggestions.perceived_barriers.high.slice(0, 2));
    } else {
      suggestions.push(...careerSuggestions.perceived_barriers.low.slice(0, 2));
    }
    
    // Return unique suggestions
    return [...new Set(suggestions)];
  };
  
  // Get development strategies based on profile
  const getDevelopmentStrategies = () => {
    const strategies: string[] = [];
    
    // Add strategies based on self-efficacy
    const selfEfficacyLevel = getSectionLevel('self_efficacy');
    if (selfEfficacyLevel === 'high' || selfEfficacyLevel === 'medium') {
      strategies.push(...developmentStrategies.self_efficacy.high.slice(0, 2));
    } else {
      strategies.push(...developmentStrategies.self_efficacy.low.slice(0, 2));
    }
    
    // Add strategies based on outcome expectations
    const outcomeExpectationsLevel = getSectionLevel('outcome_expectations');
    if (outcomeExpectationsLevel === 'high' || outcomeExpectationsLevel === 'medium') {
      strategies.push(...developmentStrategies.outcome_expectations.high.slice(0, 2));
    } else {
      strategies.push(...developmentStrategies.outcome_expectations.low.slice(0, 2));
    }
    
    // Add general career interest strategies
    strategies.push(...developmentStrategies.career_interests.general.slice(0, 2));
    
    // Add strategies based on environmental support
    const environmentalSupportLevel = getSectionLevel('environmental_support');
    if (environmentalSupportLevel === 'high' || environmentalSupportLevel === 'medium') {
      strategies.push(...developmentStrategies.environmental_support.high.slice(0, 2));
    } else {
      strategies.push(...developmentStrategies.environmental_support.low.slice(0, 2));
    }
    
    // Add strategies based on perceived barriers
    const perceivedBarriersLevel = getSectionLevel('perceived_barriers');
    if (perceivedBarriersLevel === 'high') {
      strategies.push(...developmentStrategies.perceived_barriers.high.slice(0, 2));
    } else {
      strategies.push(...developmentStrategies.perceived_barriers.low.slice(0, 2));
    }
    
    // Return unique strategies
    return [...new Set(strategies)];
  };
  
  const downloadResults = async () => {
    if (!resultsRef.current) return;
    
    try {
      setIsDownloading(true);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // PDF constants and styling
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      // Set background color for whole page
      pdf.setFillColor(245, 247, 250); // Very light gray background
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // SCCT Assessment Results title - large and centered
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(76, 175, 80); // Green color
      pdf.setFontSize(36);
      
      const title = "SCCT ASSESSMENT";
      const titleWidth = pdf.getStringUnitWidth(title) * 36 / pdf.internal.scaleFactor;
      pdf.text(title, (pageWidth - titleWidth) / 2, 80);
      
      const subtitle = "RESULTS";
      const subtitleWidth = pdf.getStringUnitWidth(subtitle) * 36 / pdf.internal.scaleFactor;
      pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 145);
      
      // Report Generation Date
      const today = new Date();
      const formattedDate = `Report Generated: ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const dateWidth = pdf.getStringUnitWidth(formattedDate) * 12 / pdf.internal.scaleFactor;
      pdf.text(formattedDate, (pageWidth - dateWidth) / 2, 180);
      
      // Student Information section - Updated to match the screenshot exactly
      pdf.setFillColor(255, 255, 255); // White background
      pdf.roundedRect(margin, 210, contentWidth, 120, 5, 5, 'F');
      pdf.setDrawColor(200, 200, 200); // Light gray border
      pdf.roundedRect(margin, 210, contentWidth, 120, 5, 5, 'S');
      
      // Section title with underline - match the screenshot with green text
      pdf.setTextColor(76, 175, 80); // Green color
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24); // Larger font size to match screenshot
      pdf.text("STUDENT INFORMATION", margin + 15, 240); // Positioned higher up
      
      // Green underline - thicker and wider to match screenshot
      pdf.setDrawColor(76, 175, 80);
      pdf.setLineWidth(1.5);
      pdf.line(margin + 15, 245, margin + 200, 245); // Wider line
      
      // Student details with left-right alignment to match screenshot
      pdf.setTextColor(60, 60, 60); // Dark gray text
      pdf.setFontSize(16); // Larger font size
      
      // Name
      pdf.setFont('helvetica', 'bold');
      pdf.text("Name:", margin + 30, 280); // Increased spacing
      pdf.setFont('helvetica', 'normal');
      pdf.text(studentDetails?.name || 'Not specified', margin + 120, 280);
      
      // Class
      pdf.setFont('helvetica', 'bold');
      pdf.text("Class:", margin + 30, 310); // Increased spacing between rows
      pdf.setFont('helvetica', 'normal');
      pdf.text(studentDetails?.class ? `${studentDetails.class} - ${studentDetails.section || 'Not specified'}` : 'Not specified - Not specified', margin + 120, 310);
      
      // Add page number at the bottom right
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page 1 of 4`, pageWidth - margin - 25, 310);
      
      // About This Assessment section
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, 350, contentWidth, 120, 5, 5, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.roundedRect(margin, 350, contentWidth, 120, 5, 5, 'S');
      
      // About section title with underline
      pdf.setTextColor(76, 175, 80); // Green color
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text("ABOUT THIS ASSESSMENT", margin + 10, 375);
      
      // Green underline
      pdf.setDrawColor(76, 175, 80);
      pdf.setLineWidth(1);
      pdf.line(margin + 10, 380, margin + 120, 380);
      
      // Assessment description
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const aboutText = "The Social Cognitive Career Theory (SCCT) Assessment evaluates your career development across five key dimensions: Self-Efficacy (confidence in abilities), Outcome Expectations (anticipated results), Career Interests (field preferences), Environmental Support (resources available), and Perceived Barriers (challenges to overcome).";
      const splitAbout = pdf.splitTextToSize(aboutText, contentWidth - 20);
      pdf.text(splitAbout, margin + 10, 400);
      
      // Adding a new page for SCCT Profile
      pdf.addPage();
      
      // Add a header for subsequent pages
      pdf.setFillColor(240, 245, 240);
      pdf.rect(0, 0, pageWidth, 20, 'F');
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text("SCCT Assessment", margin, 15);
      
      pdf.setTextColor(76, 175, 80); // Green color
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text("Your SCCT Profile", pageWidth - margin - 30, 15);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);
      pdf.line(0, 20, pageWidth, 20);
      
      // Create radar chart
      const radarChartCanvas = document.createElement('canvas');
      radarChartCanvas.width = 500;
      radarChartCanvas.height = 500;
      const radarCtx = radarChartCanvas.getContext('2d');
      
      if (radarCtx) {
        new Chart(radarCtx, {
          type: 'radar',
          data: {
            labels: ['Self-Efficacy', 'Outcome Expect', 'Interests', 'Goals', 'Support'],
            datasets: [{
              label: 'Your SCCT Profile',
              data: sections.map(section => {
                const rawScore = scores[section.id] || 0;
                if (section.id === 'perceived_barriers') {
                  return ((maxSectionScore - rawScore) / maxSectionScore) * 100;
                }
                return (rawScore / maxSectionScore) * 100;
              }),
              backgroundColor: 'rgba(76, 175, 80, 0.4)',
              borderColor: 'rgba(76, 175, 80, 0.8)',
              pointBackgroundColor: 'rgba(76, 175, 80, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  display: false,
                  stepSize: 20
                },
                pointLabels: {
                  font: {
                    size: 14
                  },
                  color: '#555555'
                },
                grid: {
                  color: '#e0e0e0'
                },
                angleLines: {
                  color: '#e0e0e0'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            },
            responsive: false
          }
        });
      }
      
      // Add radar chart to PDF
      const radarChartImage = radarChartCanvas.toDataURL('image/png');
      pdf.addImage(radarChartImage, 'PNG', margin, 50, contentWidth, contentWidth);
      
      // Add profile overview title - Adjusted to match the screenshot
      pdf.setTextColor(76, 175, 80); // Green color
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24); // Larger font size to match screenshot
      const overviewTitle = "Your SCCT Profile Overview";
      const overviewTitleWidth = pdf.getStringUnitWidth(overviewTitle) * 24 / pdf.internal.scaleFactor;
      pdf.text(overviewTitle, (pageWidth - overviewTitleWidth) / 2, 235);
      
      // Green underline for the overview title to match screenshot
      pdf.setDrawColor(76, 175, 80);
      pdf.setLineWidth(1.5);
      pdf.line(margin + 15, 240, pageWidth - margin - 15, 240);
      
      // Add explanation text with green color to match screenshot
      pdf.setTextColor(76, 175, 80); // Green color
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      const explanationText = "This radar chart represents your scores across the five key areas of the SCCT framework. Higher scores indicate greater strength in that area. For Perceived Barriers, higher scores on the chart indicate fewer barriers to career development.";
      const splitExplanation = pdf.splitTextToSize(explanationText, contentWidth);
      pdf.text(splitExplanation, margin, 255);
      
      // Add page number
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page 2 of 4`, pageWidth - margin - 25, pageHeight - 10);
      
      // SCCT Dimensions
      let yPos = 40;
      
      sections.forEach((section, index) => {
        const sectionScore = scores[section.id] || 0;
        const percentage = (sectionScore / maxSectionScore) * 100;
        const level = getSectionLevel(section.id);
        
        pdf.setTextColor(76, 175, 80);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text(section.title, margin, yPos);
        
        pdf.setTextColor(60, 60, 60);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.text(`Score: ${sectionScore}/${maxSectionScore} (${Math.round(percentage)}%)`, margin, yPos + 12);
        
        // Draw score bar
        pdf.setDrawColor(220, 220, 220);
        pdf.setFillColor(220, 220, 220);
        pdf.rect(margin, yPos + 18, 150, 8, 'F');
        
        // Set color based on level
        if (level === 'high') {
          pdf.setFillColor(76, 175, 80); // Green
        } else if (level === 'medium') {
          pdf.setFillColor(96, 165, 250); // Blue
        } else {
          pdf.setFillColor(251, 191, 36); // Yellow
        }
        pdf.rect(margin, yPos + 18, 150 * (percentage / 100), 8, 'F');
        
        // Add interpretation
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        const interpretation = getInterpretation(section.id);
        const splitInterpretation = pdf.splitTextToSize(`Interpretation: ${interpretation}`, contentWidth);
        pdf.text(splitInterpretation, margin, yPos + 35);
        
        yPos += 55;
        
        // Check if we need a new page
        if (yPos > pageHeight - 40 && index < sections.length - 1) {
          pdf.addPage();
          
          // Add the same header
          pdf.setFillColor(240, 245, 240);
          pdf.rect(0, 0, pageWidth, 20, 'F');
          
          pdf.setTextColor(100, 100, 100);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'italic');
          pdf.text("SCCT Assessment", margin, 15);
          
          pdf.setTextColor(76, 175, 80);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.text("Your SCCT Dimensions", pageWidth - margin - 37, 15);
          
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.2);
          pdf.line(0, 20, pageWidth, 20);
          
          yPos = 40;
        }
      });
      
      // Add career recommendations page
      pdf.addPage();
      
      // Add the same header
      pdf.setFillColor(240, 245, 240);
      pdf.rect(0, 0, pageWidth, 20, 'F');
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text("SCCT Assessment", margin, 15);
      
      pdf.setTextColor(76, 175, 80);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text("Career Recommendations", pageWidth - margin - 45, 15);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.2);
      pdf.line(0, 20, pageWidth, 20);
      
      // Career suggestions
      pdf.setTextColor(76, 175, 80);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text("Recommended Career Paths", margin, 40);
      
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text("Based on your SCCT profile, here are some career paths that may align with your development:", margin, 55);
      
      yPos = 65;
      getCareerSuggestions().forEach((suggestion, index) => {
        pdf.setDrawColor(76, 175, 80);
        pdf.setFillColor(76, 175, 80);
        pdf.circle(margin + 4, yPos + 3, 1.5, 'F');
        pdf.setTextColor(60, 60, 60);
        pdf.text(suggestion, margin + 10, yPos + 4);
        yPos += 10;
      });
      
      // Development strategies
      pdf.setTextColor(76, 175, 80);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text("Development Strategies", margin, yPos + 20);
      
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.text("Consider these strategies to enhance your career development based on your SCCT profile:", margin, yPos + 35);
      
      yPos += 45;
      getDevelopmentStrategies().forEach((strategy, index) => {
        if (yPos > pageHeight - 20) {
          pdf.addPage();
          
          // Add the same header
          pdf.setFillColor(240, 245, 240);
          pdf.rect(0, 0, pageWidth, 20, 'F');
          
          pdf.setTextColor(100, 100, 100);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'italic');
          pdf.text("SCCT Assessment", margin, 15);
          
          pdf.setTextColor(76, 175, 80);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.text("Development Strategies", pageWidth - margin - 40, 15);
          
          pdf.setDrawColor(200, 200, 200);
          pdf.setLineWidth(0.2);
          pdf.line(0, 20, pageWidth, 20);
          
          yPos = 40;
        }
        
        pdf.setDrawColor(76, 175, 80);
        pdf.setFillColor(76, 175, 80);
        pdf.circle(margin + 4, yPos + 3, 1.5, 'F');
        
        pdf.setTextColor(60, 60, 60);
        pdf.setFont('helvetica', 'normal');
        const splitStrategy = pdf.splitTextToSize(strategy, contentWidth - 15);
        pdf.text(splitStrategy, margin + 10, yPos + 4);
        
        // Adjust yPos based on number of lines
        yPos += 10 + (splitStrategy.length - 1) * 5;
      });
      
      // Add page numbers to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 25, pageHeight - 10);
      }
      
      // Save PDF
      pdf.save('SCCT-Assessment-Results.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Check if we have data to display
  if (Object.keys(scores).length === 0 || sections.length === 0) {
    console.log("No scores or sections data available");
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">No Results Available</h1>
            <p className="mb-8">No assessment results were found. Please complete the assessment first.</p>
            <Button 
              onClick={() => navigate('/assessment/scct')}
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              Take SCCT Assessment
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-gray-600 hover:text-gray-800 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">Your SCCT Assessment Results</h1>
                <p className="text-gray-600">
                  Here's a detailed analysis of your responses to help you understand your career potential.
                </p>
              </div>
              <Button 
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={downloadResults}
                disabled={isDownloading}
              >
                <FileText className="mr-2 h-4 w-4" /> {isDownloading ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </div>
          
          <div ref={resultsRef} className="space-y-6">
            {/* Student Information */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-green-600 mb-4">Student Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <User className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-medium">
                      {studentDetails?.name || 'Anonymous User'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Book className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Class & Section</p>
                    <p className="font-medium">
                      {studentDetails?.class ? `${studentDetails.class} - ${studentDetails.section || 'Not specified'}` : 'Not specified - Not specified'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <School className="h-6 w-6 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">School</p>
                    <p className="font-medium">
                      {studentDetails?.school || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* SCCT Results Header */}
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h2 className="text-2xl font-semibold text-green-600">SCCT Assessment Results</h2>
                  <p className="text-gray-600">Social Cognitive Career Theory Profile</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center bg-green-100 px-4 py-1 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-600 font-medium">{answers.length} Questions Analyzed</span>
                </div>
              </div>
            </div>
            
            {/* Radar Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Your SCCT Profile</h3>
              <div className="h-[400px]">
                <Radar data={getChartData()} options={radarOptions} />
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Note: For 'Perceived Barriers,' higher scores on the chart indicate fewer barriers to career development.
              </p>
            </div>
            
            {/* Section Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section) => {
                const sectionScore = scores[section.id] || 0;
                const percentage = (sectionScore / maxSectionScore) * 100;
                const level = getSectionLevel(section.id);
                
                return (
                  <div key={section.id} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                    <div className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{section.id === 'perceived_barriers' ? 'Level of Barriers' : 'Score'}</span>
                        <span className="text-sm font-medium">{sectionScore}/{maxSectionScore} ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            section.id === 'perceived_barriers'
                              ? (level === 'high' ? 'bg-yellow-500' : level === 'medium' ? 'bg-blue-500' : 'bg-green-500')
                              : (level === 'high' ? 'bg-green-500' : level === 'medium' ? 'bg-blue-500' : 'bg-yellow-500')
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <p className="text-sm mt-4">
                      <span className="font-medium">Interpretation:</span>{' '}
                      {getInterpretation(section.id)}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {/* Career Interests Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Your Career Interests</h3>
              <div className="h-[300px] mb-4">
                <Bar data={getCareerInterestsData()} options={barOptions} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Interest Areas Explained:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li><span className="font-medium">Investigative:</span> Science, research, analytics, technology</li>
                    <li><span className="font-medium">Artistic:</span> Design, media, creative writing, performing arts</li>
                    <li><span className="font-medium">Enterprising:</span> Business, politics, management, sales</li>
                    <li><span className="font-medium">Social:</span> Teaching, counseling, healthcare, community service</li>
                    <li><span className="font-medium">Conventional:</span> Accounting, administration, data management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Your Top Interest Areas:</h4>
                  <p className="text-sm">
                    Based on your responses, you show strongest interest in the areas that scored highest
                    on the chart. These interests can guide your exploration of related career fields and
                    educational opportunities.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Career Suggestions */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Career Path Suggestions</h3>
              <p className="mb-4 text-sm">
                Based on your unique profile, here are some career directions that may align with your
                pattern of confidence, expectations, interests, and perceived barriers:
              </p>
              
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getCareerSuggestions().map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Development Strategies */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Recommended Development Strategies</h3>
              <p className="mb-4 text-sm">
                These personalized strategies can help you develop your career readiness based on your SCCT profile:
              </p>
              
              <ul className="space-y-4">
                {getDevelopmentStrategies().map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Want to explore more about your career options?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment/riasec">
                <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  Try RIASEC Assessment
                </Button>
              </Link>
              <Link to="/assessment/future-pathways">
                <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  Explore Future Pathways
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

export default SCCTResults;
