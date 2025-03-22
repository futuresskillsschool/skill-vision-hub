
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Clock, BrainCircuit, Target, Sparkles } from 'lucide-react';

const CareerVisionLanding = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
                Career Vision Assessment
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover your ideal career path with our comprehensive assessment combining 
                RIASEC Model, Future Pathways Explorer, and EQ Navigator.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-card p-6 md:p-8 mb-12"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-brand-purple/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-purple" />
                      </div>
                      <div>
                        <span className="font-medium">Your RIASEC Profile</span>
                        <p className="text-muted-foreground">Understand your interests and preferences across six categories: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-purple/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-purple" />
                      </div>
                      <div>
                        <span className="font-medium">Future Career Clusters</span>
                        <p className="text-muted-foreground">Discover emerging career fields that align with your skills and interests, focusing on future-ready opportunities.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-purple/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-purple" />
                      </div>
                      <div>
                        <span className="font-medium">Emotional Intelligence Profile</span>
                        <p className="text-muted-foreground">Measure your emotional intelligence and understand how it impacts your career potential and workplace relationships.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-6 border-brand-purple/10 bg-brand-purple/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Assessment Details</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>30 minutes</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Questions</span>
                      <span className="font-medium">37 questions</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Sections</span>
                      <span className="font-medium">3 sections</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span>Format</span>
                      <span className="font-medium">Multiple choice</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/assessment/career-vision/take')}
                    className="w-full bg-brand-purple hover:bg-brand-purple/90"
                    size="lg"
                  >
                    Start Assessment
                  </Button>
                </Card>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">About The Assessment Sections</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-brand-blue/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">RIASEC Profile</h3>
                  <p className="text-muted-foreground">
                    Based on Holland's Theory, this section helps identify your interests and preferences across six personality types, giving insight into careers that match your attributes.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-green/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
                    <BrainCircuit className="h-6 w-6 text-brand-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Future Pathways</h3>
                  <p className="text-muted-foreground">
                    This forward-looking assessment identifies emerging career clusters and industries that align with your skills and interests, preparing you for the future of work.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-red/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-brand-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">EQ Navigator</h3>
                  <p className="text-muted-foreground">
                    Evaluate your emotional intelligence across key dimensions including self-awareness, empathy, and social skills that are crucial for workplace success.
                  </p>
                </Card>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <Button 
                onClick={() => navigate('/assessment/career-vision/take')}
                size="lg"
                className="bg-brand-purple hover:bg-brand-purple/90"
              >
                Take the Assessment Now
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerVisionLanding;
