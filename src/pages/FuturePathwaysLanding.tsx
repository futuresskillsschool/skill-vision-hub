
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Clock, Rocket, Laptop, LineChart } from 'lucide-react';

const FuturePathwaysLanding = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#ffffff] via-{#4caf50} to-[#e1fee2]">
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
                Future Pathways Explorer
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore emerging career opportunities and identify future-proof skills for the evolving job market.
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
                  <h2 className="text-2xl font-bold mb-4">What You'll Discover</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-brand-green/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-green" />
                      </div>
                      <div>
                        <span className="font-medium">Emerging Career Fields</span>
                        <p className="text-muted-foreground">Identify growing industries and career opportunities that align with your skills and interests.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-green/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-green" />
                      </div>
                      <div>
                        <span className="font-medium">Future-Ready Skills</span>
                        <p className="text-muted-foreground">Understand which skills will be most valuable in the changing job market of tomorrow.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-green/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-green" />
                      </div>
                      <div>
                        <span className="font-medium">Technology Adaptation</span>
                        <p className="text-muted-foreground">Assess your readiness to adapt to new technologies and digital transformation.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-6 border-brand-green/10 bg-brand-green/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Assessment Details</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>25 minutes</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Questions</span>
                      <span className="font-medium">18 questions</span>
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
                    onClick={() => navigate('/future-pathways/take')}
                    className="w-full bg-brand-green hover:bg-brand-green/90"
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
              <h2 className="text-2xl font-bold mb-6 text-center">Explore Future Career Clusters</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-brand-green/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
                    <Laptop className="h-6 w-6 text-brand-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Digital & Technology</h3>
                  <p className="text-muted-foreground">
                    Explore careers in artificial intelligence, data science, cybersecurity, and other emerging tech fields shaping our future.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-green/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
                    <Rocket className="h-6 w-6 text-brand-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Innovation & Entrepreneurship</h3>
                  <p className="text-muted-foreground">
                    Discover opportunities in startups, innovation management, and creating solutions for tomorrow's challenges.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-green/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6 text-brand-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sustainable Development</h3>
                  <p className="text-muted-foreground">
                    Explore careers focused on creating a more sustainable future through green technology, renewable energy, and environmental solutions.
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
                onClick={() => navigate('/future-pathways/take')}
                size="lg"
                className="bg-brand-green hover:bg-brand-green/90"
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

export default FuturePathwaysLanding;
