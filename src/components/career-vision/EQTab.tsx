
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CircularProgressIndicator } from './ChartComponents';
import { eqLevelDescriptions } from './DataTypes';
import { Briefcase, Heart, Brain, Users, Star, Sparkles, Shield, ArrowUpRight } from 'lucide-react';
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
          <div className="bg-gradient-to-br from-brand-red to-brand-purple w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-md">
            <Heart className="h-5 w-5 text-white" />
          </div>
          Your EQ Navigator Results
        </h2>
        <p className="text-muted-foreground text-lg">
          The EQ Navigator measures your emotional intelligence across different dimensions, including self-awareness, empathy, social skills, and emotional management.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-red/10 to-brand-purple/20 animate-pulse"></div>
            <CircularProgressIndicator 
              value={eqScore} 
              max={40} 
              size="lg" 
              colorClass="text-brand-red"
              trackClass="text-brand-red/20"
              label={`${eqScore}/40`}
            />
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
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/40 via-brand-red/30 to-brand-orange/20"></div>
            <img 
              src="/lovable-uploads/2a57ac38-c970-47f4-9845-ae1dfc4315f1.png" 
              alt="EQ Navigator" 
              className="w-full h-auto rounded-lg relative z-10"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white z-20">
              <div className="flex items-start">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold ml-2 drop-shadow-md">EQ Navigator</h3>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-xl">
                <p className="font-medium text-lg mt-auto drop-shadow-md">
                  Your emotional intelligence is at the {
                    eqLevel === "high" ? "Advanced" : 
                    eqLevel === "medium" ? "Growing" : "Developing"
                  } EQ level.
                </p>
                <div className="mt-2 flex items-center">
                  <div className="relative w-16 h-16">
                    <CircularProgressIndicator 
                      value={eqScore} 
                      max={40} 
                      size="md" 
                      colorClass="text-white"
                      trackClass="text-white/20"
                    />
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
          eqLevel === "high" ? "border-green-300 shadow-[0_0_20px_rgba(76,175,80,0.25)]" :
          eqLevel === "medium" ? "border-yellow-300 shadow-[0_0_20px_rgba(255,193,7,0.25)]" :
          "border-red-300 shadow-[0_0_20px_rgba(244,67,54,0.25)]"
        } mb-8 rounded-xl`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${
            eqLevel === "high" ? "from-green-50 to-green-100" :
            eqLevel === "medium" ? "from-yellow-50 to-yellow-100" :
            "from-red-50 to-red-100"
          } opacity-70`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                eqLevel === "high" ? "bg-green-100 text-green-700" :
                eqLevel === "medium" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {eqLevel === "high" ? <Shield className="h-6 w-6" /> : 
                 eqLevel === "medium" ? <Star className="h-6 w-6" /> : 
                 <Brain className="h-6 w-6" />}
              </div>
              <h3 className={`text-xl font-semibold ${
                eqLevel === "high" ? "text-green-700" :
                eqLevel === "medium" ? "text-yellow-700" :
                "text-red-700"
              }`}>
                {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].title}
              </h3>
            </div>
            
            <p className="mb-4 mt-4 text-lg">
              {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].description}
            </p>
            
            <div className="mt-6 bg-white/50 p-4 rounded-lg backdrop-blur-sm">
              <h4 className="font-medium mb-3 flex items-center">
                <Star className={`h-5 w-5 mr-2 ${
                  eqLevel === "high" ? "text-green-500" :
                  eqLevel === "medium" ? "text-yellow-500" :
                  "text-red-500"
                }`} />
                Development Tips:
              </h4>
              <p className="text-base">
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
        className="text-xl font-semibold mb-4 flex items-center"
      >
        <div className="bg-brand-purple/10 p-2 rounded-full mr-2">
          <Heart className="h-5 w-5 text-brand-purple" />
        </div>
        How EQ Benefits Your Career
      </motion.h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: <Users className="h-5 w-5 text-white" />,
            title: "Leadership Potential",
            description: "High emotional intelligence correlates with stronger leadership abilities, as it enables you to understand team dynamics, motivate others, and navigate workplace challenges.",
            color: "from-brand-red to-brand-pink",
            delay: 1.0
          },
          {
            icon: <Heart className="h-5 w-5 text-white" />,
            title: "Team Collaboration",
            description: "EQ helps you work effectively in teams, resolve conflicts, and build positive relationships with colleagues, clients, and stakeholders.",
            color: "from-brand-blue to-brand-purple",
            delay: 1.1
          },
          {
            icon: <Star className="h-5 w-5 text-white" />,
            title: "Adaptability",
            description: "Strong emotional intelligence helps you adapt to change, manage stress, and remain resilient in the face of challenges and uncertainty.",
            color: "from-brand-green to-brand-teal",
            delay: 1.2
          },
          {
            icon: <Brain className="h-5 w-5 text-white" />,
            title: "Decision Making",
            description: "EQ supports better decision-making by helping you understand others' perspectives and consider the emotional implications of different choices.",
            color: "from-brand-purple to-brand-indigo",
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
            <Card className="p-5 hover:border-brand-purple/50 transition-all duration-300 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${item.color}"></div>
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h4 className="font-medium text-lg">{item.title}</h4>
              </div>
              <p className="text-base text-muted-foreground pl-3 border-l-2 border-gray-100">
                {item.description}
              </p>
              <div className="mt-3 pt-2 text-sm font-medium flex items-center justify-end text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <ArrowUpRight className="h-3 w-3 ml-1" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default EQTab;
