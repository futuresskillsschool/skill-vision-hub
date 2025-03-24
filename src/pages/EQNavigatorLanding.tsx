
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Clock, Brain, Users, Heart, Sparkles } from 'lucide-react';

const EQNavigatorLanding = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-pink-50 to-red-50">
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
              <div className="inline-block mb-6">
                <div className="relative h-24 w-24 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-pink-400 opacity-20 blur-xl animate-pulse"></div>
                  <div className="relative bg-white bg-opacity-70 backdrop-blur-sm rounded-full h-full w-full flex items-center justify-center border-2 border-red-200 shadow-lg">
                    <Heart className="h-12 w-12 text-brand-red" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-red-700">
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
              className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12 border border-red-100"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                    <Sparkles className="h-6 w-6 mr-2 text-brand-red" />
                    What You'll Learn
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-brand-red/10 p-1.5 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-red" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Self-Awareness</span>
                        <p className="text-muted-foreground">Understand your emotions, strengths, weaknesses, and how they impact your behavior and decisions.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-red/10 p-1.5 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-red" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Social Skills</span>
                        <p className="text-muted-foreground">Assess your ability to build relationships, communicate effectively, and navigate social complexities.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-brand-red/10 p-1.5 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-brand-red" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800">Empathy</span>
                        <p className="text-muted-foreground">Measure your ability to understand others' emotions and perspectives in various situations.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-6 border-2 border-brand-red/30 bg-gradient-to-br from-brand-red/5 to-red-100/50 shadow-lg overflow-hidden relative group">
                  <div className="absolute -top-12 -right-12 h-24 w-24 bg-brand-red/10 rounded-full blur-2xl group-hover:bg-brand-red/20 transition-all duration-700"></div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Assessment Details</h3>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-brand-red" />
                      <span>25 minutes</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-2 border-b border-brand-red/10">
                      <span className="text-gray-700">Questions</span>
                      <span className="font-medium">20 questions</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-brand-red/10">
                      <span className="text-gray-700">Sections</span>
                      <span className="font-medium">4 sections</span>
                    </div>
                    <div className="flex justify-between items-center pb-2">
                      <span className="text-gray-700">Format</span>
                      <span className="font-medium">Multiple choice</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/eq-navigator/take')}
                    className="w-full bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    size="lg"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
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
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 flex items-center justify-center">
                <div className="bg-brand-red/10 p-2 rounded-full mr-3">
                  <Brain className="h-6 w-6 text-brand-red" />
                </div>
                EQ Dimensions
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 border-2 border-brand-red/10 hover:border-brand-red/30 bg-white backdrop-blur-sm transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-red/20 to-red-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                      <Brain className="h-6 w-6 text-brand-red" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Self-Regulation</h3>
                    <p className="text-muted-foreground">
                      Assess your ability to control impulsive feelings and behaviors, manage emotions in healthy ways, and adapt to changing circumstances.
                    </p>
                  </Card>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 border-2 border-brand-red/10 hover:border-brand-red/30 bg-white backdrop-blur-sm transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-red/20 to-red-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                      <Heart className="h-6 w-6 text-brand-red" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Empathy</h3>
                    <p className="text-muted-foreground">
                      Measure your ability to understand the emotions, needs, and concerns of other people, pick up on emotional cues, and feel comfortable socially.
                    </p>
                  </Card>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 border-2 border-brand-red/10 hover:border-brand-red/30 bg-white backdrop-blur-sm transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-red/20 to-red-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                      <Users className="h-6 w-6 text-brand-red" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Social Skills</h3>
                    <p className="text-muted-foreground">
                      Evaluate how well you manage relationships, navigate social networks, influence and inspire others, and build effective teams.
                    </p>
                  </Card>
                </motion.div>
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
                className="bg-gradient-to-r from-brand-red to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Take the Assessment Now
              </Button>
              
              <div className="mt-3 text-sm text-muted-foreground">
                Unlock insights about your emotional intelligence
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorLanding;
