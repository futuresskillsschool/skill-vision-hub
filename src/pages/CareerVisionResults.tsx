import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Download, Grid } from 'lucide-react';
import PathwaysTab from '@/components/career-vision/PathwaysTab';
import RIASECTab from '@/components/career-vision/RIASECTab';

const CareerVisionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pathways");
  
  // Extract results data from location state
  const { pathways, riasec } = location.state || { pathways: {}, riasec: {} };
  
  // Prepare chart data for Pathways tab
  const pathwaysChartData = Object.entries(pathways).map(([name, value]) => ({
    name,
    score: value,
  }));
  
  // Prepare chart data for RIASEC tab
  const riasecChartData = Object.entries(riasec).map(([name, value]) => ({
    name,
    score: value,
  }));
  
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Redirect to assessment if there's no results data
    if (!location.state) {
      navigate('/assessment/career-vision');
    }
  }, [location.state, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 flex flex-wrap justify-between items-start">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 text-brand-purple hover:text-brand-purple/80 -ml-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assessment
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Career Vision Results</h1>
              <p className="text-gray-600 max-w-3xl">
                Your comprehensive career profile has been generated based on your responses. Explore the different 
                aspects of your career assessment below.
              </p>
            </div>
            
            <div className="flex mt-4 md:mt-0">
              <Link to="/">
                <Button variant="outline" className="flex items-center">
                  <Grid className="mr-2 h-4 w-4" />
                  Back to Assessments
                </Button>
              </Link>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pathways" className="data-[state=active]:bg-brand-purple/10 data-[state=active]:text-brand-purple">
                Future Pathways
              </TabsTrigger>
              <TabsTrigger value="riasec" className="data-[state=active]:bg-brand-purple/10 data-[state=active]:text-brand-purple">
                RIASEC Profile
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pathways" className="space-y-4">
              <PathwaysTab pathways={pathways} pathwaysChartData={pathwaysChartData} />
            </TabsContent>
            
            <TabsContent value="riasec" className="space-y-4">
              <RIASECTab riasec={riasec} riasecChartData={riasecChartData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerVisionResults;
