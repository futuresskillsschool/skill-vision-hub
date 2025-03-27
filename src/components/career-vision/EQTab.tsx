
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CircularProgressIndicator } from './ChartComponents';
import { eqLevelDescriptions } from './DataTypes';
import { Briefcase, Heart, Brain, Users, Star, Sparkles, Shield, ArrowUpRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface EQTabProps {
  eqScore: number;
}

const EQTab: React.FC<EQTabProps> = ({ eqScore }) => {
  const eqLevel = eqScore < 25 ? "low" : eqScore < 35 ? "medium" : "high";
  
  useEffect(() => {
    // For any initialization effects
  }, []);
  
  // Ensure the score percentage is capped at 100%
  const scorePercentage = Math.min(Math.round((eqScore / 40) * 100), 100);
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
          <div className="bg-gradient-to-br from-green-200 to-blue-200 w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-md">
            <Heart className="h-5 w-5 text-green-600" />
          </div>
          Your EQ Navigator Results
        </h2>
        <p className="text-gray-600 text-lg">
          The EQ Navigator measures your emotional intelligence across different dimensions, including self-awareness, empathy, social skills, and emotional management.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-md border border-green-100"
        >
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-100 to-blue-100 animate-pulse opacity-70"></div>
            <div className="w-56 h-56 relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  className="stroke-green-200" 
                  cx="50" cy="50" r="40" 
                  strokeWidth="8" 
                  fill="none"
                />
                <circle 
                  className="stroke-green-400" 
                  cx="50" cy="50" r="40" 
                  strokeWidth="8" 
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - scorePercentage / 100)}`}
                  transform="rotate(-90 50 50)"
                />
                <text 
                  x="50" y="43" 
                  dominantBaseline="middle" 
                  textAnchor="middle"
                  className="fill-green-500 text-2xl font-bold"
                >
                  {scorePercentage}%
                </text>
                <text 
                  x="50" y="60" 
                  dominantBaseline="middle" 
                  textAnchor="middle"
                  className="fill-gray-500 text-xs"
                >
                  EQ Score
                </text>
              </svg>
            </div>
          </div>
          <motion.p 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-4 text-lg font-medium"
          >
            EQ Score: <span className="text-xl text-green-500">{eqScore}/40</span>
          </motion.p>
          
          <div className="mt-6 w-full space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Self-Awareness</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(scorePercentage * 0.9)}%</span>
              </div>
              <Progress 
                value={scorePercentage * 0.9} 
                className="h-2.5 bg-green-100" 
                indicatorClassName="bg-gradient-to-r from-green-300 to-blue-300"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Empathy</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(scorePercentage * 0.95)}%</span>
              </div>
              <Progress 
                value={scorePercentage * 0.95} 
                className="h-2.5 bg-green-100" 
                indicatorClassName="bg-gradient-to-r from-green-300 to-blue-300"
              />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative overflow-hidden rounded-2xl shadow-lg w-full h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-300 to-blue-300 opacity-90"></div>
            <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"></div>
            <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-20">
              <div className="flex items-start">
                <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="text-2xl font-bold drop-shadow-md">EQ Navigator</h3>
                  <p className="text-white/80 text-sm">Emotional Intelligence Profile</p>
                </div>
              </div>
              
              <div>
                <div className="bg-black/30 backdrop-blur-sm p-5 rounded-xl">
                  <h4 className="font-semibold text-xl mb-2">
                    {eqLevel === "high" ? "Advanced" : 
                     eqLevel === "medium" ? "Growing" : "Developing"} EQ Level
                  </h4>
                  <p className="font-medium text-sm mt-auto text-white/90 mb-4">
                    {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].description.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/80">
                      {Math.round(scorePercentage)}% of maximum EQ score
                    </div>
                    <div className="bg-white/20 rounded-full px-3 py-1 text-xs">
                      {eqScore}/40 points
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
      >
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <Heart className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold">How EQ Benefits Your Career</h3>
        </div>
        <p className="text-gray-600">
          Your emotional intelligence score indicates your ability to understand emotions and use them effectively in various situations.
          Strong EQ skills help with leadership, teamwork, communication, and adapting to workplace challenges.
        </p>
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-xl font-semibold mb-4 flex items-center text-gray-800 mt-8"
      >
        <div className="bg-green-100 p-2 rounded-full mr-2">
          <Heart className="h-5 w-5 text-green-500" />
        </div>
        How EQ Benefits Your Career
      </motion.h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: <Users className="h-5 w-5 text-white" />,
            title: "Leadership Potential",
            description: "High emotional intelligence correlates with stronger leadership abilities, as it enables you to understand team dynamics, motivate others, and navigate workplace challenges.",
            color: "from-green-400 to-blue-400",
            delay: 1.0
          },
          {
            icon: <Heart className="h-5 w-5 text-white" />,
            title: "Team Collaboration",
            description: "EQ helps you work effectively in teams, resolve conflicts, and build positive relationships with colleagues, clients, and stakeholders.",
            color: "from-blue-300 to-blue-400",
            delay: 1.1
          },
          {
            icon: <Star className="h-5 w-5 text-white" />,
            title: "Adaptability",
            description: "Strong emotional intelligence helps you adapt to change, manage stress, and remain resilient in the face of challenges and uncertainty.",
            color: "from-green-300 to-green-400",
            delay: 1.2
          },
          {
            icon: <Brain className="h-5 w-5 text-white" />,
            title: "Decision Making",
            description: "EQ supports better decision-making by helping you understand others' perspectives and consider the emotional implications of different choices.",
            color: "from-blue-300 to-green-400",
            delay: 1.3
          }
        ].map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: item.delay }}
            whileHover={{ 
              y: -5, 
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2 }
            }}
          >
            <Card className="p-5 hover:border-green-300/50 transition-all duration-300 overflow-hidden relative group h-full">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${item.color}"></div>
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h4 className="font-medium text-lg text-gray-800">{item.title}</h4>
              </div>
              <p className="text-sm text-gray-600 pl-3 border-l-2 border-green-100">
                {item.description}
              </p>
              
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default EQTab;
