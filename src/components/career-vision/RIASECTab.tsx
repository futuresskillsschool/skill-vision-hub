
import React from 'react';
import { Card } from '@/components/ui/card';
import { RadarChartCard } from './ChartComponents';
import { riasecDescriptions } from './DataTypes';

interface RIASECTabProps {
  riasec: Record<string, number>;
  riasecChartData: any[];
}

const RIASECTab: React.FC<RIASECTabProps> = ({ riasec, riasecChartData }) => {
  // Define score threshold for low scores
  const LOW_SCORE_THRESHOLD = 3;
  
  // Sort categories by score (highest to lowest)
  const sortedCategories = Object.entries(riasec)
    .sort((a, b) => (b[1] as number) - (a[1] as number));
  
  // Get top 3 categories
  const topCategories = sortedCategories.slice(0, 3);
  
  // Get low-scoring categories (score <= threshold)
  const lowCategories = sortedCategories.filter(([_, score]) => (score as number) <= LOW_SCORE_THRESHOLD);

  return (
    <>
      <RadarChartCard 
        data={riasecChartData}
        title="Your RIASEC Profile"
        description="The RIASEC model identifies your work-related interests and preferences across six categories: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional."
      />
      
      <h3 className="text-xl font-semibold mb-4">Your Top RIASEC Categories</h3>
      
      <div className="space-y-6 mb-8">
        {topCategories.map(([category, score], index) => {
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
      
      {lowCategories.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-4">Areas for Growth</h3>
          
          <div className="space-y-6 mb-8">
            {lowCategories.map(([category, score]) => {
              const catKey = category as keyof typeof riasecDescriptions;
              const catInfo = riasecDescriptions[catKey];
              if (!catInfo) return null;
              
              return (
                <Card key={category} className="p-6 border-orange-200 bg-orange-50">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-orange-100 text-orange-600">
                      <span className="text-lg font-bold">{category}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-lg">{catInfo.title}</h4>
                        <span className="text-sm font-medium bg-orange-100 text-orange-600 rounded-full px-3 py-1">
                          Score: {score}/10
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        Your lower score in this area suggests this may not be your primary interest or strength. 
                        Consider whether developing skills in this area might complement your stronger areas.
                      </p>
                      
                      <div>
                        <h5 className="font-medium mb-2">Development Suggestions:</h5>
                        <p className="text-sm">
                          {category === 'R' && "Consider hands-on activities or technical courses that can build practical skills."}
                          {category === 'I' && "Explore research projects or analytical activities to develop investigative abilities."}
                          {category === 'A' && "Try creative hobbies or artistic expression to enhance your creative thinking."}
                          {category === 'S' && "Volunteer or join group activities to develop interpersonal and helping skills."}
                          {category === 'E' && "Look for leadership opportunities or projects requiring persuasion and initiative."}
                          {category === 'C' && "Practice organizational tasks and detail-oriented work to improve these skills."}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default RIASECTab;
