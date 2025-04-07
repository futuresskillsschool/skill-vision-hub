
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChartCard } from './ChartComponents';
import { pathwaysDescriptions } from './DataTypes';
import { BrainCircuit, Sparkles, Target, Zap, BookOpen, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface PathwaysTabProps {
  pathways: Record<string, number>;
  pathwaysChartData: any[];
}

const PathwaysTab: React.FC<PathwaysTabProps> = ({ pathways, pathwaysChartData }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <BarChartCard 
          data={pathwaysChartData}
          title="Your Future Pathways Explorer Results"
          description="The Future Pathways Explorer identifies emerging career clusters that align with your interests and preferences, focusing on technology-enabled roles and industries of the future."
        />
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-xl font-semibold mb-4 flex items-center"
      >
        <div className="bg-brand-green/10 p-2 rounded-full mr-2">
          <Target className="h-5 w-5 text-brand-green" />
        </div>
        Your Top Future Career Clusters
      </motion.h3>
      
      <div className="space-y-6 mb-8">
        {Object.entries(pathways)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 3)
          .map(([cluster, score], index) => {
            const clusterKey = cluster as keyof typeof pathwaysDescriptions;
            const clusterInfo = pathwaysDescriptions[clusterKey];
            if (!clusterInfo) return null;
            
            // Use different icons for each card
            const icons = [
              <BrainCircuit className="h-5 w-5" />,
              <Sparkles className="h-5 w-5" />,
              <Lightbulb className="h-5 w-5" />
            ];
            
            const iconBgColors = [
              'bg-gradient-to-br from-green-400 to-green-600 text-white',
              'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
              'bg-gradient-to-br from-purple-400 to-purple-600 text-white'
            ];
            
            const cardColors = [
              'from-green-50 to-transparent',
              'from-blue-50 to-transparent',
              'from-purple-50 to-transparent'
            ];
            
            const borderColors = [
              'border-green-200 shadow-[0_0_15px_rgba(76,175,80,0.1)]',
              'border-blue-200 shadow-[0_0_15px_rgba(66,165,245,0.1)]',
              'border-purple-200 shadow-[0_0_15px_rgba(156,39,176,0.1)]'
            ];
            
            return (
              <motion.div
                key={cluster}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 }
                }}
              >
                <Card className={`p-6 border-2 ${borderColors[index]} overflow-hidden relative`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${cardColors[index]} opacity-60`}></div>
                  
                  <div className="flex items-start relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${iconBgColors[index]} shadow-lg`}>
                      {icons[index]}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-lg">{clusterInfo.title}</h4>
                        <span className="text-sm font-medium bg-white rounded-full px-3 py-1 shadow-sm">
                          Score: {score}/25
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{clusterInfo.description}</p>
                      
                      <div className="bg-white/70 p-4 rounded-lg backdrop-blur-sm border border-gray-100">
                        <h5 className="font-medium mb-2 flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-brand-orange" />
                          Future-Focused Careers:
                        </h5>
                        <p className="text-sm">{Array.isArray(clusterInfo.careers) ? clusterInfo.careers.join(", ") : clusterInfo.careers}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
      </div>
    </>
  );
};

export default PathwaysTab;
