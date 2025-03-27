
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f9f7ff] via-[#f0ebff] to-[#eae3ff]">
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
              <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full font-medium text-sm mb-4">
                Emotional Intelligence Assessment
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Discover Your Emotional Intelligence
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
                Measure your emotional intelligence and develop crucial soft skills for personal and professional success in today's workplace.
              </p>
              
              {/* <Button 
                onClick={handleStartAssessment}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Assessment Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button> */}
              
              {/* <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-purple-500" />
                  <span>25 minutes</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-purple-500" />
                  <span>10 questions</span>
                </div>
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Immediate results</span>
                </div>
              </div> */}
            </div>
            
            {/* Main Features Section */}
            <div className="grid md:grid-cols-2 gap-10 mb-16">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <Heart className="h-6 w-6 text-purple-600 mr-2" />
                  What You'll Learn
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                      <Check className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Self-Awareness</span>
                      <p className="text-gray-600 mt-1">Understand your emotions, strengths, weaknesses, and how they impact your behavior and decisions.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                      <Check className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Social Skills</span>
                      <p className="text-gray-600 mt-1">Assess your ability to build relationships, communicate effectively, and navigate social complexities.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                      <Check className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800">Empathy</span>
                      <p className="text-gray-600 mt-1">Measure your ability to understand others' emotions and perspectives in various situations.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <Card className="overflow-hidden border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-4">
                  <CardTitle className="flex justify-between items-center">
                    <span>Assessment Details</span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-purple-600" />
                      <span>25 minutes</span>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    What to expect when taking this assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Questions</span>
                      <span className="font-medium text-gray-800">10 questions</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Format</span>
                      <span className="font-medium text-gray-800">Scenario-based</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Results</span>
                      <span className="font-medium text-gray-800">Immediate feedback</span>
                    </div>
                    {/* <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Certificate</span>
                      <span className="font-medium text-gray-800">Available upon completion</span>
                    </div> */}
                  </div>
                  
                  <Button 
                    onClick={handleStartAssessment}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
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
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">EQ Dimensions</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border border-purple-100 bg-white hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                      <Brain className="h-7 w-7 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Self-Regulation</h3>
                    <p className="text-gray-600 text-center">
                      Control impulsive feelings and behaviors, manage emotions in healthy ways, and adapt to changing circumstances.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-purple-100 bg-white hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                      <Heart className="h-7 w-7 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Empathy</h3>
                    <p className="text-gray-600 text-center">
                      Understand the emotions, needs, and concerns of other people, pick up on emotional cues, and feel comfortable socially.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border border-purple-100 bg-white hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-5 mx-auto">
                      <Users className="h-7 w-7 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-center text-gray-800">Social Skills</h3>
                    <p className="text-gray-600 text-center">
                      Manage relationships, navigate social networks, influence and inspire others, and build effective teams.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-10 text-white shadow-xl mb-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to discover your EQ?</h2>
                  <p className="text-white/90 max-w-xl">
                    Take our comprehensive assessment and gain valuable insights into your emotional intelligence strengths and areas for growth.
                  </p>
                </div>
                <Button 
                  onClick={handleStartAssessment}
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px] whitespace-nowrap"
                >
                  Take Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Benefits Section */}
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-8 text-gray-800">Benefits of High EQ</h2>
              <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
                Emotional intelligence is a key factor in personal and professional success. Research shows that individuals with high EQ often outperform those with high IQ alone.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border border-purple-100 bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-800">Better Relationships</h3>
                    <p className="text-gray-600 text-sm">Build deeper connections with others</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-purple-100 bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-800">Career Success</h3>
                    <p className="text-gray-600 text-sm">Navigate workplace dynamics effectively</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-purple-100 bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-800">Better Decisions</h3>
                    <p className="text-gray-600 text-sm">Make choices aligned with your values</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-purple-100 bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-800">Mental Wellbeing</h3>
                    <p className="text-gray-600 text-sm">Manage stress and emotional states</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* <Button 
                onClick={handleStartAssessment}
                size="lg" 
                className="mt-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
              >
                Start Your EQ Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button> */}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EQNavigatorLanding;
