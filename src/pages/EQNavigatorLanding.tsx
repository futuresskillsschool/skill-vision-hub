
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Check, 
  Clock, 
  Brain, 
  Users, 
  Heart, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

const EQNavigatorLanding = () => {
  const navigate = useNavigate();
  
  const handleStartAssessment = () => {
    navigate('/assessment/eq-navigator/take');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#6b46c1] via-[#7e57c2] to-[#9575cd]">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-16 pt-8">
              <span className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full font-medium text-sm mb-4 backdrop-blur-sm">
                Emotional Intelligence Assessment
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Discover Your Emotional Intelligence
              </h1>
              <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8">
                Measure your emotional intelligence and develop crucial soft skills for personal and professional success in today's workplace.
              </p>
              
              <Button 
                onClick={handleStartAssessment}
                size="lg"
                className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Assessment Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-white/80">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-white" />
                  <span>25 minutes</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-white" />
                  <span>10 questions</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-white" />
                  <span>Immediate results</span>
                </div>
              </div>
            </div>
            
            {/* Main Features Section */}
            <div className="grid md:grid-cols-2 gap-10 mb-16">
              <Card className="bg-white/10 backdrop-blur-md border-none text-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Heart className="h-6 w-6 text-pink-300 mr-2" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold">Self-Awareness</span>
                        <p className="text-white/80 mt-1">Understand your emotions, strengths, weaknesses, and how they impact your behavior and decisions.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold">Social Skills</span>
                        <p className="text-white/80 mt-1">Assess your ability to build relationships, communicate effectively, and navigate social complexities.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-white/20 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="font-semibold">Empathy</span>
                        <p className="text-white/80 mt-1">Measure your ability to understand others' emotions and perspectives in various situations.</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-r from-purple-500/80 to-indigo-500/80 backdrop-blur-md text-white">
                <CardHeader className="border-b border-white/10 pb-4">
                  <CardTitle className="flex justify-between items-center">
                    <span>Assessment Details</span>
                    <div className="flex items-center text-white/80 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-white" />
                      <span>25 minutes</span>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    What to expect when taking this assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-white/80">Questions</span>
                      <span className="font-medium">10 questions</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-white/80">Format</span>
                      <span className="font-medium">Scenario-based</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-white/80">Results</span>
                      <span className="font-medium">Immediate feedback</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-white/80">Certificate</span>
                      <span className="font-medium">Available upon completion</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleStartAssessment}
                    className="w-full bg-white text-purple-700 hover:bg-white/90 shadow-md hover:shadow-lg transition-all duration-300"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Begin Assessment
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* EQ Dimensions Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-center text-white">EQ Dimensions</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-none bg-white/10 backdrop-blur-md text-white hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-5 mx-auto">
                      <Brain className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-center">Self-Regulation</h3>
                    <p className="text-white/80 text-center">
                      Control impulsive feelings and behaviors, manage emotions in healthy ways, and adapt to changing circumstances.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-none bg-white/10 backdrop-blur-md text-white hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-5 mx-auto">
                      <Heart className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-center">Empathy</h3>
                    <p className="text-white/80 text-center">
                      Understand the emotions, needs, and concerns of other people, pick up on emotional cues, and feel comfortable socially.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-none bg-white/10 backdrop-blur-md text-white hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-5 mx-auto">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-center">Social Skills</h3>
                    <p className="text-white/80 text-center">
                      Manage relationships, navigate social networks, influence and inspire others, and build effective teams.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorLanding;
