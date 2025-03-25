
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import refactored components
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

const CareerVisionResults = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [results, setResults] = useState<AssessmentResults | null>(location.state || null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!results && user) {
      // This would be implemented if we had a function to fetch results
      // fetchUserResults('career-vision').then(setResults);
    }
  }, [results, user]);
  
  if (!results) {
    return (
      <div className="min-h-screen flex flex-col">
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
    const element = document.getElementById('results-container');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('Career-Vision-Assessment-Results.pdf');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto" id="results-container">
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
                className="hidden md:flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
            
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
                  </TabsContent>
                  
                  <TabsContent value="riasec" className="mt-0">
                    <RIASECTab 
                      riasec={riasec}
                      riasecChartData={riasecChartData}
                    />
                  </TabsContent>
                  
                  <TabsContent value="pathways" className="mt-0">
                    <PathwaysTab 
                      pathways={pathways}
                      pathwaysChartData={pathwaysChartData}
                    />
                  </TabsContent>
                  
                  <TabsContent value="eq" className="mt-0">
                    <EQTab eqScore={eqScore} />
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerVisionResults;
