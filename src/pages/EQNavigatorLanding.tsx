
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Clock, Brain, Users, Heart, Sparkles, ChevronRight } from 'lucide-react';

const EQNavigatorLanding = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[hsl(var(--brand-red))/5] to-[hsl(var(--brand-pink))/10]">
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
              <span className="inline-block bg-[hsl(var(--brand-red))/10] text-[hsl(var(--brand-red))] px-4 py-1.5 rounded-full font-medium text-sm mb-4">
                EQ Navigator Assessment
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--brand-red))] to-[hsl(var(--brand-red-dark))] bg-clip-text text-transparent">
                Discover Your Emotional Intelligence
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Measure your emotional intelligence and develop crucial soft skills for personal and professional success in today's workplace.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-16 border border-[hsl(var(--brand-red))/20] overflow-hidden relative"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[hsl(var(--brand-pink))/20] to-[hsl(var(--brand-red))/10] rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br from-[hsl(var(--brand-orange))/10] to-[hsl(var(--brand-pink))/20] rounded-full blur-3xl"></div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <Heart className="h-6 w-6 text-[hsl(var(--brand-red))] mr-2" />
                    What You'll Learn
                  </h2>
                  <ul className="space-y-5">
                    <li className="flex items-start">
                      <div className="bg-[hsl(var(--brand-red))/10] p-2 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-[hsl(var(--brand-red))]" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Self-Awareness</span>
                        <p className="text-gray-600 mt-1">Understand your emotions, strengths, weaknesses, and how they impact your behavior and decisions.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[hsl(var(--brand-red))/10] p-2 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-[hsl(var(--brand-red))]" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Social Skills</span>
                        <p className="text-gray-600 mt-1">Assess your ability to build relationships, communicate effectively, and navigate social complexities.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[hsl(var(--brand-red))/10] p-2 rounded-full mr-3 mt-1">
                        <Check className="h-5 w-5 text-[hsl(var(--brand-red))]" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">Empathy</span>
                        <p className="text-gray-600 mt-1">Measure your ability to understand others' emotions and perspectives in various situations.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <Card className="p-6 border-[hsl(var(--brand-red))/20 bg-gradient-to-br from-white to-[hsl(var(--brand-red))/5] shadow-lg">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-semibold text-gray-800">Assessment Details</h3>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-2 text-[hsl(var(--brand-red))]" />
                      <span>25 minutes</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Questions</span>
                      <span className="font-medium text-gray-800">20 questions</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Sections</span>
                      <span className="font-medium text-gray-800">4 sections</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Format</span>
                      <span className="font-medium text-gray-800">Multiple choice</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/eq-navigator/take')}
                    className="w-full bg-gradient-to-r from-[hsl(var(--brand-red))] to-[hsl(var(--brand-red-dark))] hover:from-[hsl(var(--brand-red-dark))] hover:to-[hsl(var(--brand-red))] text-white shadow-md hover:shadow-lg transition-all duration-300"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Assessment
                  </Button>
                </Card>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">EQ Dimensions</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-[hsl(var(--brand-red))/20 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[hsl(var(--brand-red))/10] rounded-full flex items-center justify-center mb-5">
                    <Brain className="h-7 w-7 text-[hsl(var(--brand-red))]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Self-Regulation</h3>
                  <p className="text-gray-600">
                    Assess your ability to control impulsive feelings and behaviors, manage emotions in healthy ways, and adapt to changing circumstances.
                  </p>
                </Card>
                
                <Card className="p-6 border-[hsl(var(--brand-red))/20 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[hsl(var(--brand-red))/10] rounded-full flex items-center justify-center mb-5">
                    <Heart className="h-7 w-7 text-[hsl(var(--brand-red))]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Empathy</h3>
                  <p className="text-gray-600">
                    Measure your ability to understand the emotions, needs, and concerns of other people, pick up on emotional cues, and feel comfortable socially.
                  </p>
                </Card>
                
                <Card className="p-6 border-[hsl(var(--brand-red))/20 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[hsl(var(--brand-red))/10] rounded-full flex items-center justify-center mb-5">
                    <Users className="h-7 w-7 text-[hsl(var(--brand-red))]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Social Skills</h3>
                  <p className="text-gray-600">
                    Evaluate how well you manage relationships, navigate social networks, influence and inspire others, and build effective teams.
                  </p>
                </Card>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-r from-[hsl(var(--brand-red))] to-[hsl(var(--brand-red-dark))] rounded-2xl p-8 md:p-10 text-white shadow-xl mb-16"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to discover your EQ?</h2>
                  <p className="text-white/90 max-w-xl">
                    Take our comprehensive assessment and gain valuable insights into your emotional intelligence strengths and areas for growth.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/eq-navigator/take')}
                  size="lg"
                  className="bg-white text-[hsl(var(--brand-red))] hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]"
                >
                  Take Assessment Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Benefits of High EQ</h2>
              <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
                Emotional intelligence is a key factor in personal and professional success. Research shows that individuals with high EQ often outperform those with high IQ alone.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-md border border-[hsl(var(--brand-red))/10 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-[hsl(var(--brand-red))/10] rounded-full mx-auto flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-[hsl(var(--brand-red))]" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-800">Better Relationships</h3>
                  <p className="text-gray-600 text-sm">Build deeper connections with others through emotional understanding</p>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-md border border-[hsl(var(--brand-red))/10 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-[hsl(var(--brand-red))/10] rounded-full mx-auto flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-[hsl(var(--brand-red))]" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-800">Career Success</h3>
                  <p className="text-gray-600 text-sm">Navigate workplace dynamics and lead more effectively</p>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-md border border-[hsl(var(--brand-red))/10 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-[hsl(var(--brand-red))/10] rounded-full mx-auto flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-[hsl(var(--brand-red))]" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-800">Better Decisions</h3>
                  <p className="text-gray-600 text-sm">Make choices that align with your values and long-term goals</p>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-md border border-[hsl(var(--brand-red))/10 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-[hsl(var(--brand-red))/10] rounded-full mx-auto flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-[hsl(var(--brand-red))]" />
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-800">Mental Wellbeing</h3>
                  <p className="text-gray-600 text-sm">Manage stress and maintain a positive emotional state</p>
                </div>
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
