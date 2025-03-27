
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Clock, Puzzle, Users, Briefcase } from 'lucide-react';

const RIASECLanding = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f9f7ff] via-[#f0ebff] to-[#eae3ff]">
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
                RIASEC Model Assessment
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover your Holland Code and find career matches based on your interests, abilities, and preferences.
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
                        <span className="font-medium">Your Holland Code</span>
                        <p className="text-muted-foreground">Identify your primary interest areas across six dimensions: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-purple/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-purple" />
                      </div>
                      <div>
                        <span className="font-medium">Career Matches</span>
                        <p className="text-muted-foreground">Discover careers that align with your unique combination of interests and preferred work environments.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-purple/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-purple" />
                      </div>
                      <div>
                        <span className="font-medium">Work Environment Fit</span>
                        <p className="text-muted-foreground">Understand which types of work environments and job cultures will bring out your best qualities.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-6 border-brand-purple/10 bg-brand-purple/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Assessment Details</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>20 minutes</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Questions</span>
                      <span className="font-medium">12 questions</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Sections</span>
                      <span className="font-medium">1 section</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span>Format</span>
                      <span className="font-medium">Interest rating scale</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/riasec/take')}
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
              <h2 className="text-2xl font-bold mb-6 text-center">The RIASEC Model</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 border-brand-purple/20 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">Realistic (R)</h3>
                  <p className="text-muted-foreground">
                    Prefer working with objects, machines, tools, plants, or animals. Often enjoy outdoor work and hands-on problem solving.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-purple/20 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">Investigative (I)</h3>
                  <p className="text-muted-foreground">
                    Enjoy researching, analyzing, inquiry, and solving abstract problems. Often drawn to scientific or mathematical fields.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-purple/20 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">Artistic (A)</h3>
                  <p className="text-muted-foreground">
                    Prefer creative, original, and independent activities that allow self-expression through art, music, writing, or performance.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-purple/20 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">Social (S)</h3>
                  <p className="text-muted-foreground">
                    Enjoy working with, helping, teaching, counseling, or serving others. Value building relationships and solving people problems.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-purple/20 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">Enterprising (E)</h3>
                  <p className="text-muted-foreground">
                    Prefer leading, persuading, and managing others. Often enjoy business, sales, politics, or entrepreneurial activities.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-purple/20 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">Conventional (C)</h3>
                  <p className="text-muted-foreground">
                    Enjoy working with data, details, following procedures, and organizing. Value structure, stability, and clear expectations.
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
                onClick={() => navigate('/riasec/take')}
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

export default RIASECLanding;
