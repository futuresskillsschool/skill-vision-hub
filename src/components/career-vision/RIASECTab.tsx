
import React from 'react';
import { Card } from '@/components/ui/card';
import { RadarChartCard } from './ChartComponents';
import { riasecDescriptions } from './DataTypes';

interface RIASECTabProps {
  riasec: Record<string, number>;
  riasecChartData: any[];
}

const RIASECTab: React.FC<RIASECTabProps> = ({ riasec, riasecChartData }) => {
  return (
    <>
      <RadarChartCard 
        data={riasecChartData}
        title="Your RIASEC Profile"
        description="The RIASEC model identifies your work-related interests and preferences across six categories: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional."
      />
      
      <h3 className="text-xl font-semibold mb-4">Your Top RIASEC Categories</h3>
      
      <div className="space-y-6 mb-8">
        {Object.entries(riasec)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 3)
          .map(([category, score], index) => {
            const catKey = category as keyof typeof riasecDescriptions;
            const catInfo = riasecDescriptions[catKey];
            if (!catInfo) return null;
            
            return (
              <Card key={category} className="p-6">
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    index === 0 ? 'bg-brand-purple/10 text-brand-purple' : 
                    index === 1 ? 'bg-brand-blue/10 text-brand-blue' : 
                    'bg-brand-green/10 text-brand-green'
                  }`}>
                    <span className="text-lg font-bold">{category}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-lg">{catInfo.title}</h4>
                      <span className="text-sm font-medium bg-gray-100 rounded-full px-3 py-1">
                        Score: {score}/10
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{catInfo.description}</p>
                    
                    <div>
                      <h5 className="font-medium mb-2">Potential Career Paths:</h5>
                      <p className="text-sm">{catInfo.careers || "No career information available"}</p>
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

export default RIASECTab;
