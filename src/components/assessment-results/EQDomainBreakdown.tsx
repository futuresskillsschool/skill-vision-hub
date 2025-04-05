
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ScoresObj {
  [key: string]: number | string;
}

interface EQDomainBreakdownProps {
  scores: ScoresObj;
}

const EQDomainBreakdown: React.FC<EQDomainBreakdownProps> = ({ scores }) => {
  const domainDescriptions: Record<string, string> = {
    "selfAwareness": "Understanding your own emotions and how they affect your behavior.",
    "selfRegulation": "Managing your emotions and impulses effectively.",
    "motivation": "Using your emotions to achieve goals and persist through challenges.",
    "empathy": "Understanding and sharing the feelings of others.",
    "socialSkills": "Managing relationships and building rapport with others."
  };

  return (
    <div className="space-y-6">
      {Object.entries(scores || {}).map(([domain, scoreValue]) => {
        const score = typeof scoreValue === 'number' ? scoreValue : 0;
        return (
          <Card key={domain} className="bg-brand-orange/5 border border-brand-orange/10">
            <div className="p-4">
              <h4 className="text-lg font-semibold text-brand-orange mb-2">
                {domain.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-foreground/80 mb-3">
                {domainDescriptions[domain] || "Description not available."}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score:</span>
                <span className="text-sm font-semibold">{score}/10</span>
              </div>
              <Progress value={(score / 10) * 100} className="mt-2" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default EQDomainBreakdown;
