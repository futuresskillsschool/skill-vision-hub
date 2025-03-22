
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Clock, Brain, Users, Heart } from 'lucide-react';

const EQNavigatorLanding = () => {
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
                EQ Navigator Assessment
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Measure your emotional intelligence and develop crucial soft skills for personal and professional success in today's workplace.
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
                      <div className="bg-brand-red/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-red" />
                      </div>
                      <div>
                        <span className="font-medium">Self-Awareness</span>
                        <p className="text-muted-foreground">Understand your emotions, strengths, weaknesses, and how they impact your behavior and decisions.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-red/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-red" />
                      </div>
                      <div>
                        <span className="font-medium">Social Skills</span>
                        <p className="text-muted-foreground">Assess your ability to build relationships, communicate effectively, and navigate social complexities.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-red/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-red" />
                      </div>
                      <div>
                        <span className="font-medium">Empathy</span>
                        <p className="text-muted-foreground">Measure your ability to understand others' emotions and perspectives in various situations.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-6 border-brand-red/10 bg-brand-red/5">
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
                      <span className="font-medium">20 questions</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Sections</span>
                      <span className="font-medium">4 sections</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span>Format</span>
                      <span className="font-medium">Multiple choice</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/eq-navigator/take')}
                    className="w-full bg-brand-red hover:bg-brand-red/90"
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
              <h2 className="text-2xl font-bold mb-6 text-center">EQ Dimensions</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-brand-red/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-brand-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Self-Regulation</h3>
                  <p className="text-muted-foreground">
                    Assess your ability to control impulsive feelings and behaviors, manage emotions in healthy ways, and adapt to changing circumstances.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-red/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-brand-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Empathy</h3>
                  <p className="text-muted-foreground">
                    Measure your ability to understand the emotions, needs, and concerns of other people, pick up on emotional cues, and feel comfortable socially.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-red/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-brand-red" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Social Skills</h3>
                  <p className="text-muted-foreground">
                    Evaluate how well you manage relationships, navigate social networks, influence and inspire others, and build effective teams.
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
                onClick={() => navigate('/eq-navigator/take')}
                size="lg"
                className="bg-brand-red hover:bg-brand-red/90"
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

export default EQNavigatorLanding;
