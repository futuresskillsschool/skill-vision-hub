
import { useEffect, useRef, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  
  useEffect(() => {
    if (!location.state) {
      navigate('/assessment/scct');
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
  }, [location.state, navigate, user, storeAssessmentResult, scores, sections, answers]);
  
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
          backgroundColor: 'rgba(255, 149, 0, 0.2)',
          borderColor: 'rgba(255, 149, 0, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 149, 0, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255, 149, 0, 1)',
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
      
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      const x = (pdfWidth - scaledWidth) / 2;
      const y = 10;
      
      pdf.addImage(
        imgData, 
        'PNG', 
        x, 
        y, 
        scaledWidth, 
        scaledHeight
      );
      
      pdf.save('SCCT-Assessment-Results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  // If no data, redirect back to assessment
  if (Object.keys(scores).length === 0) return null;
  
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
                className="mb-4 text-brand-orange hover:text-brand-orange/80 -ml-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your SCCT Results</h1>
              <p className="text-foreground/70 max-w-3xl">
                Based on your answers, we've analyzed your career confidence, interests, and challenges using
                the Social Cognitive Career Theory framework. These insights can help guide your educational
                and career decisions.
              </p>
            </div>
            
            <Button 
              className="flex items-center bg-brand-orange text-white hover:bg-brand-orange/90 mt-4 md:mt-0"
              onClick={downloadResults}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-4 w-4" /> {isDownloading ? 'Generating PDF...' : 'Download Results'}
            </Button>
          </div>
          
          <div 
            ref={resultsRef}
            id="results-content"
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl mx-auto animate-fade-in"
          >
            <div className="bg-brand-orange/10 p-6 md:p-8 border-b border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-brand-orange mb-1">SCCT Assessment Results</h2>
                  <p className="text-foreground/70">Social Cognitive Career Theory Profile</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className="flex items-center bg-brand-orange/20 px-3 py-1 rounded-full text-sm font-medium text-brand-orange">
                    <Star className="h-4 w-4 mr-1 fill-brand-orange" />
                    {answers.length} Questions Analyzed
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              {/* Main Profile Chart */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-6">Your SCCT Profile</h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-[300px] md:h-[400px]">
                  <Radar data={getChartData()} options={radarOptions} />
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Note: For 'Perceived Barriers,' higher scores on the chart indicate fewer barriers to career development.
                </p>
              </div>
              
              {/* Section Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {sections.map((section) => {
                  const sectionScore = scores[section.id] || 0;
                  const percentage = (sectionScore / maxSectionScore) * 100;
                  const level = getSectionLevel(section.id);
                  
                  return (
                    <Card key={section.id} className="border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* Career Interests Chart */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-6">Your Career Interests</h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-[300px]">
                  <Bar data={getCareerInterestsData()} options={barOptions} />
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4">Career Path Suggestions</h3>
                <p className="mb-4 text-sm">
                  Based on your unique profile, here are some career directions that may align with your
                  pattern of confidence, expectations, interests, and perceived barriers:
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getCareerSuggestions().map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-brand-orange/20 rounded-full flex items-center justify-center text-brand-orange mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Development Strategies */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Recommended Development Strategies</h3>
                <p className="mb-4 text-sm">
                  These personalized strategies can help you develop your career readiness based on your SCCT profile:
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <ul className="space-y-4">
                    {getDevelopmentStrategies().map((strategy, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-brand-orange/20 rounded-full flex items-center justify-center text-brand-orange mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-foreground/70">
                <p>
                  Note: This assessment is based on Social Cognitive Career Theory developed by Robert Lent, Steven Brown, and Gail Hackett.
                  The results are meant to provide guidance and self-awareness, not to limit your options.
                  Consider discussing these results with a career counselor or mentor for deeper insights.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Want to explore more about your career options?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/assessment/riasec">
                <Button variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange/5">
                  Try RIASEC Assessment
                </Button>
              </Link>
              <Link to="/assessment/future-pathways">
                <Button variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange/5">
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
