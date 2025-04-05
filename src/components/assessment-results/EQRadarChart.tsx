
import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

interface ChartDataItem {
  domain: string;
  score: number;
  fullMark: number;
}

interface EQRadarChartProps {
  chartData: ChartDataItem[];
}

const EQRadarChart: React.FC<EQRadarChartProps> = ({ chartData }) => {
  return (
    <div className="relative h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="domain" />
          <PolarRadiusAxis angle={30} domain={[0, 10]} />
          <Radar name="EQ Score" dataKey="score" stroke="#F97316" fill="#F97316" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EQRadarChart;
