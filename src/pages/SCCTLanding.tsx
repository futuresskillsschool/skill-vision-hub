
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Clock, Brain, Target, Lightbulb, FileText, Sparkles, ArrowRight } from 'lucide-react';
import AssessmentDetailsPanel from '@/components/assessment/AssessmentDetailsPanel';

const SCCTLanding = () => {
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
              className="mb-8 md:mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">
                SCCT Assessment
              </h1>
              <p className="text-xl text-gray-600">
                Social Cognitive Career Theory
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3">
                  <div className="mb-8">
                    <img 
                      src="/lovable-uploads/dea5b485-1122-4e7c-b1b1-60d9d112b417.png" 
                      alt="SCCT Assessment" 
                      className="w-full h-auto rounded-xl shadow-md"
                    />
                  </div>
                  
                  <div className="prose max-w-none mb-8">
                    <p className="text-gray-700 text-lg">
                      Based on Bandura's Social Cognitive Theory, this assessment evaluates 
                      how your beliefs about your abilities influence your career choices. Gain 
                      insights into the relationship between your self-efficacy, outcome 
                      expectations, and career interests.
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Key Benefits:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-pastel-purple/20 p-1 rounded-full mr-3 mt-1 text-pastel-purple-dark">
                          <Check className="h-5 w-5" />
                        </div>
                        <span className="text-gray-700">Understand how your beliefs influence your career choices</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-pastel-purple/20 p-1 rounded-full mr-3 mt-1 text-pastel-purple-dark">
                          <Check className="h-5 w-5" />
                        </div>
                        <span className="text-gray-700">Identify barriers to career development</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-pastel-purple/20 p-1 rounded-full mr-3 mt-1 text-pastel-purple-dark">
                          <Check className="h-5 w-5" />
                        </div>
                        <span className="text-gray-700">Develop strategies to overcome career obstacles</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-pastel-purple/20 p-1 rounded-full mr-3 mt-1 text-pastel-purple-dark">
                          <Check className="h-5 w-5" />
                        </div>
                        <span className="text-gray-700">Align your self-efficacy with career aspirations</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-pastel-purple/20 p-1 rounded-full mr-3 mt-1 text-pastel-purple-dark">
                          <Check className="h-5 w-5" />
                        </div>
                        <span className="text-gray-700">Create a personalized career development roadmap</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <AssessmentDetailsPanel 
                    duration="20 minutes" 
                    questions={25} 
                    onStartAssessment={() => navigate('/scct/take')}
                  />
                </div>
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
                <Card className="p-6 border-pastel-purple/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-pastel-purple/20 rounded-full flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-pastel-purple-dark" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Self-Efficacy</h3>
                  <p className="text-muted-foreground">
                    Your confidence in your ability to successfully perform specific tasks or achieve particular outcomes in your career.
                  </p>
                </Card>
                
                <Card className="p-6 border-pastel-purple/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-pastel-purple/20 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-pastel-purple-dark" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Career Goals</h3>
                  <p className="text-muted-foreground">
                    How you set, prioritize, and pursue your professional objectives, and how these align with your values and interests.
                  </p>
                </Card>
                
                <Card className="p-6 border-pastel-purple/20 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-pastel-purple/20 rounded-full flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-pastel-purple-dark" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Learning Experiences</h3>
                  <p className="text-muted-foreground">
                    How your past experiences, successes, and challenges have shaped your career beliefs and decisions.
                  </p>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SCCTLanding;
