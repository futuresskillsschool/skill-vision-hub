
import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download,
  User,
  School,
  BookOpen
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SCCTResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  
  // Get results data from location state
  const resultsData = location.state;
  
  // Download PDF function
  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;
    
    try {
      setLoading(true);
      
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add image to PDF, fitting to page width while maintaining aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 15;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('SCCT-Assessment-Results.pdf');
      
      toast.success("PDF downloaded successfully");
      setLoading(false);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to download PDF");
      setLoading(false);
    }
  };
  
  // Redirect if no results data
  useEffect(() => {
    if (!resultsData) {
      console.log("No results data found, redirecting to assessment page");
      navigate('/assessment/scct');
    } else if (resultsData.downloadPdf) {
      // Auto-download PDF if specified
      handleDownloadPDF();
    }
  }, [resultsData, navigate]);
  
  // Safety check to avoid rendering errors if no data
  if (!resultsData?.scores || !resultsData?.sections) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Results Not Available</h1>
            <p className="mb-6">Your assessment results are missing or incomplete.</p>
            <Button 
              onClick={() => navigate('/assessment/scct')}
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              Return to Assessment
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Calculate result levels based on scores
  const getLevelFromScore = (score: number, maxPossible: number) => {
    const percentage = (score / maxPossible) * 100;
    if (percentage >= 80) return { level: "High", color: "bg-green-500" };
    if (percentage >= 60) return { level: "Moderate-High", color: "bg-emerald-400" };
    if (percentage >= 40) return { level: "Moderate", color: "bg-yellow-400" };
    if (percentage >= 20) return { level: "Moderate-Low", color: "bg-orange-400" };
    return { level: "Low", color: "bg-red-500" };
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-card overflow-hidden" ref={resultsRef}>
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-orange to-brand-yellow p-6 md:p-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold">Your SCCT Assessment Results</h1>
              <p className="mt-2 text-white/80">
                Understanding your career development through the lens of Social Cognitive Career Theory
              </p>
            </div>
            
            {/* Student information */}
            <div className="p-6 md:p-8 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-medium">{resultsData.studentName || "Anonymous User"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <School className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">School</p>
                    <p className="font-medium">{resultsData.school || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-medium">{resultsData.class || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results summary */}
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4">Your SCCT Factors</h2>
              
              <div className="space-y-6">
                {resultsData.sections.map((section: any) => {
                  const sectionScore = resultsData.scores[section.id] || 0;
                  const maxPossible = section.questions.length * 5; // 5 is max score per question
                  const { level, color } = getLevelFromScore(sectionScore, maxPossible);
                  
                  return (
                    <div key={section.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4 md:p-6 border-b">
                        <h3 className="font-semibold text-lg">{section.title}</h3>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                      
                      <div className="p-4 md:p-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Your Level: {level}</span>
                          <span className="text-sm font-medium">{sectionScore}/{maxPossible} points</span>
                        </div>
                        
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${color}`}
                            style={{ width: `${(sectionScore / maxPossible) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">What this means:</h4>
                          <p className="text-gray-600 text-sm">
                            {level === "High" || level === "Moderate-High" 
                              ? section.interpretation.high 
                              : section.interpretation.low
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 p-4 md:p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <p className="text-sm text-gray-600">
                  Use these insights to focus on strengthening areas where you scored lower, and 
                  leverage your strengths in areas where you scored higher. Consider discussing your 
                  results with a career counselor or mentor for personalized guidance.
                </p>
              </div>
            </div>
          </div>
          
          {/* Download button */}
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleDownloadPDF}
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              {loading ? "Generating PDF..." : "Download Results as PDF"}
            </Button>
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

export default SCCTResults;
