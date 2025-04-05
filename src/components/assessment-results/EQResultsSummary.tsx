
import React from 'react';
import { Card } from '@/components/ui/card';
import EQRadarChart from './EQRadarChart';
import EQDomainBreakdown from './EQDomainBreakdown';

interface ScoresObj {
  [key: string]: number | string;
}

interface ChartDataItem {
  domain: string;
  score: number;
  fullMark: number;
}

interface EQResultsSummaryProps {
  scores: ScoresObj;
  chartData: ChartDataItem[];
}

const EQResultsSummary: React.FC<EQResultsSummaryProps> = ({ scores, chartData }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm max-w-4xl mx-auto">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-brand-orange mb-4">Your Emotional Intelligence Profile</h2>
          <p className="text-foreground/70">
            Here's a breakdown of your emotional intelligence across different domains:
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">EQ Navigator Scores</h3>
          <EQRadarChart chartData={chartData} />
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Domain Breakdown</h3>
          <EQDomainBreakdown scores={scores} />
        </div>
      </div>
    </div>
  );
};

export default EQResultsSummary;
