
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CircularProgressIndicator } from './ChartComponents';
import { eqLevelDescriptions } from './DataTypes';
import { Briefcase, Heart, Brain, Users, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface EQTabProps {
  eqScore: number;
}

const EQTab: React.FC<EQTabProps> = ({ eqScore }) => {
  const eqLevel = eqScore < 25 ? "low" : eqScore < 35 ? "medium" : "high";
  
  useEffect(() => {
    // For any initialization effects
  }, []);
  
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Sparkles className="h-6 w-6 text-brand-red mr-2 animate-pulse" />
          Your EQ Navigator Results
        </h2>
        <p className="text-muted-foreground">
          The EQ Navigator measures your emotional intelligence across different dimensions, including self-awareness, empathy, social skills, and emotional management.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-red/10 to-brand-purple/20 animate-pulse"></div>
            <CircularProgressIndicator value={eqScore} max={40} size="lg" />
          </div>
          <motion.p 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-4 text-lg"
          >
            EQ Score: <span className="font-semibold text-xl text-brand-red">{eqScore}/40</span>
          </motion.p>
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
            className="relative max-w-xs overflow-hidden rounded-2xl shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-brand-red/20 to-brand-orange/20 opacity-70"></div>
            <img 
              src="/lovable-uploads/ebf39e97-383d-44ee-8568-12a8b1dc889b.png" 
              alt="EQ Navigator" 
              className="w-full h-auto rounded-lg relative z-10"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white z-20">
              <div className="flex items-start">
                <Heart className="h-6 w-6 text-brand-red mr-2" />
                <h3 className="text-2xl font-bold">EQ Navigator</h3>
              </div>
              <div>
                <p className="font-medium text-lg mt-auto">
                  Your emotional intelligence is at the {
                    eqLevel === "high" ? "Advanced" : 
                    eqLevel === "medium" ? "Growing" : "Developing"
                  } EQ level.
                </p>
                <div className="mt-2 flex items-center">
                  <div className="relative w-16 h-16">
                    <CircularProgressIndicator value={eqScore} max={40} size="md" />
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
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className={`p-6 border-2 overflow-hidden relative ${
          eqLevel === "high" ? "border-green-300 shadow-[0_0_15px_rgba(76,175,80,0.3)]" :
          eqLevel === "medium" ? "border-yellow-300 shadow-[0_0_15px_rgba(255,193,7,0.3)]" :
          "border-red-300 shadow-[0_0_15px_rgba(244,67,54,0.3)]"
        } mb-8 rounded-xl`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${
            eqLevel === "high" ? "from-green-50 to-green-100" :
            eqLevel === "medium" ? "from-yellow-50 to-yellow-100" :
            "from-red-50 to-red-100"
          } opacity-60`}></div>
          
          <div className="relative z-10">
            <h3 className={`text-xl font-semibold mb-2 ${
              eqLevel === "high" ? "text-green-700" :
              eqLevel === "medium" ? "text-yellow-700" :
              "text-red-700"
            }`}>
              {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].title}
            </h3>
            <p className="mb-4">
              {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].description}
            </p>
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Star className={`h-4 w-4 mr-2 ${
                  eqLevel === "high" ? "text-green-500" :
                  eqLevel === "medium" ? "text-yellow-500" :
                  "text-red-500"
                }`} />
                Development Tips:
              </h4>
              <p className="text-sm">
                {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].tips}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-xl font-semibold mb-4"
      >
        How EQ Benefits Your Career
      </motion.h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: <Users className="h-4 w-4 text-brand-red" />,
            title: "Leadership Potential",
            description: "High emotional intelligence correlates with stronger leadership abilities, as it enables you to understand team dynamics, motivate others, and navigate workplace challenges.",
            color: "brand-red",
            delay: 1.0
          },
          {
            icon: <Heart className="h-4 w-4 text-brand-blue" />,
            title: "Team Collaboration",
            description: "EQ helps you work effectively in teams, resolve conflicts, and build positive relationships with colleagues, clients, and stakeholders.",
            color: "brand-blue",
            delay: 1.1
          },
          {
            icon: <Star className="h-4 w-4 text-brand-green" />,
            title: "Adaptability",
            description: "Strong emotional intelligence helps you adapt to change, manage stress, and remain resilient in the face of challenges and uncertainty.",
            color: "brand-green",
            delay: 1.2
          },
          {
            icon: <Brain className="h-4 w-4 text-brand-purple" />,
            title: "Decision Making",
            description: "EQ supports better decision-making by helping you understand others' perspectives and consider the emotional implications of different choices.",
            color: "brand-purple",
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
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
              transition: { duration: 0.2 }
            }}
          >
            <Card className="p-5 hover:border-brand-purple/50 transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className={`w-8 h-8 rounded-full bg-${item.color}/10 flex items-center justify-center mr-3`}>
                  {item.icon}
                </div>
                <h4 className="font-medium">{item.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
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
