
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChartCard } from './ChartComponents';
import { pathwaysDescriptions } from './DataTypes';
import { BrainCircuit, Sparkles, Target } from 'lucide-react';

interface PathwaysTabProps {
  pathways: Record<string, number>;
  pathwaysChartData: any[];
}

const PathwaysTab: React.FC<PathwaysTabProps> = ({ pathways, pathwaysChartData }) => {
  return (
    <>
      <BarChartCard 
        data={pathwaysChartData}
        title="Your Future Pathways Explorer Results"
        description="The Future Pathways Explorer identifies emerging career clusters that align with your interests and preferences, focusing on technology-enabled roles and industries of the future."
      />
      
      <h3 className="text-xl font-semibold mb-4">Your Top Future Career Clusters</h3>
      
      <div className="space-y-6 mb-8">
        {Object.entries(pathways)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 3)
          .map(([cluster, score], index) => {
            const clusterKey = cluster as keyof typeof pathwaysDescriptions;
            const clusterInfo = pathwaysDescriptions[clusterKey];
            if (!clusterInfo) return null;
            
            return (
              <Card key={cluster} className="p-6">
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    index === 0 ? 'bg-brand-green/10 text-brand-green' : 
                    index === 1 ? 'bg-brand-blue/10 text-brand-blue' : 
                    'bg-brand-purple/10 text-brand-purple'
                  }`}>
                    {index === 0 ? (
                      <BrainCircuit className="h-5 w-5" />
                    ) : index === 1 ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      <Target className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-lg">{clusterInfo.title}</h4>
                      <span className="text-sm font-medium bg-gray-100 rounded-full px-3 py-1">
                        Score: {score}/25
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{clusterInfo.description}</p>
                    
                    <div>
                      <h5 className="font-medium mb-2">Future-Focused Careers:</h5>
                      <p className="text-sm">{clusterInfo.careers || "No career information available"}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>
    </>
  );
};

export default PathwaysTab;
