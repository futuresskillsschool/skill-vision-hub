
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Clock, Brain, Target, Lightbulb } from 'lucide-react';

const SCCTLanding = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-orange-50 to-amber-50">
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
                SCCT Assessment
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Based on Social Cognitive Career Theory, explore how your beliefs and experiences shape your career choices.
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
                      <div className="bg-brand-orange/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-orange" />
                      </div>
                      <div>
                        <span className="font-medium">Self-Efficacy Beliefs</span>
                        <p className="text-muted-foreground">Understand how your confidence in your abilities influences your career choices and performance.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-orange/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-orange" />
                      </div>
                      <div>
                        <span className="font-medium">Outcome Expectations</span>
                        <p className="text-muted-foreground">Explore how your beliefs about the consequences of your actions shape your career decisions.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-orange/10 p-1 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-orange" />
                      </div>
                      <div>
                        <span className="font-medium">Career Barriers</span>
                        <p className="text-muted-foreground">Identify barriers to your career development and strategies to overcome them.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-6 border-brand-orange/10 bg-brand-orange/5">
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
                      <span className="font-medium">25 questions</span>
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
                    onClick={() => navigate('/assessment/scct/take')}
                    className="w-full bg-brand-orange hover:bg-brand-orange/90"
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
              <h2 className="text-2xl font-bold mb-6 text-center">Key SCCT Components</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-brand-orange/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-brand-orange" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Self-Efficacy</h3>
                  <p className="text-muted-foreground">
                    Your confidence in your ability to successfully perform specific tasks or achieve particular outcomes in your career.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-orange/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-brand-orange" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Career Goals</h3>
                  <p className="text-muted-foreground">
                    How you set, prioritize, and pursue your professional objectives, and how these align with your values and interests.
                  </p>
                </Card>
                
                <Card className="p-6 border-brand-orange/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-brand-orange" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Learning Experiences</h3>
                  <p className="text-muted-foreground">
                    How your past experiences, successes, and challenges have shaped your career beliefs and decisions.
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
                onClick={() => navigate('/assessment/scct/take')}
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
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

export default SCCTLanding;
