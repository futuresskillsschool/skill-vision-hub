
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { Card } from '@/components/ui/card';

interface RadarChartCardProps {
  data: Array<{
    name: string;
    score: number;
    fullMark: number;
  }>;
  height?: number | string;
  title?: string;
  description?: string;
}

export const RadarChartCard = ({ data, height = 300, title, description }: RadarChartCardProps) => {
  return (
    <div className="mb-8">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      
      <div style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar name="Score" dataKey="score" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface BarChartCardProps {
  data: Array<{
    name: string;
    score: number;
    fullMark?: number;
  }>;
  height?: number | string;
  title?: string;
  description?: string;
}

export const BarChartCard = ({ data, height = 300, title, description }: BarChartCardProps) => {
  return (
    <div className="mb-8">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      
      <div style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CircularProgressIndicator = ({ value, max, size = 'md' }: { value: number; max: number; size?: 'sm' | 'md' | 'lg' }) => {
  const percentage = (value / max) * 100;
  
  const dimensions = {
    sm: { width: 32, height: 32, radius: 40, strokeWidth: 10 },
    md: { width: 48, height: 48, radius: 45, strokeWidth: 8 },
    lg: { width: 64, height: 64, radius: 45, strokeWidth: 8 }
  };
  
  const { width, height, radius, strokeWidth } = dimensions[size];
  const circumference = 2 * Math.PI * radius;
  
  return (
    <div className="relative flex items-center justify-center">
      <div style={{ width: `${width}px`, height: `${height}px` }} className="relative">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            className="text-gray-200" 
            strokeWidth={strokeWidth} 
            stroke="currentColor" 
            fill="transparent" 
            r={radius} 
            cx="50" 
            cy="50" 
          />
          <circle 
            className="text-brand-red" 
            strokeWidth={strokeWidth} 
            stroke="currentColor" 
            fill="transparent" 
            r={radius} 
            cx="50" 
            cy="50" 
            strokeDasharray={`${percentage * circumference / 100} ${circumference}`}
            strokeDashoffset="0" 
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <span className={`font-bold ${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm'}`}>{value}</span>
          {size !== 'sm' && <span className="text-xs text-muted-foreground">/{max}</span>}
        </div>
      </div>
    </div>
  );
};
