
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, TooltipProps, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// Circular Progress Indicator
interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  colorClass?: string;
  trackClass?: string;
  label?: string;
  percentage?: number;
  color?: string;
}

export const CircularProgressIndicator: React.FC<CircularProgressProps> = ({ 
  value, 
  max = 100, 
  size = 'md',
  colorClass,
  trackClass,
  label,
  percentage,
  color
}) => {
  // Calculate percentage if not directly provided
  const calculatedPercentage = percentage !== undefined 
    ? percentage 
    : value !== undefined && max !== 0 
      ? (value / max) * 100 
      : 0;
  
  const radius = size === 'sm' ? 35 : size === 'md' ? 45 : 60;
  const strokeWidth = size === 'sm' ? 5 : size === 'md' ? 7 : 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calculatedPercentage / 100) * circumference;
  
  // Determine sizing based on the size prop
  const containerSize = size === 'sm' ? 'w-20 h-20' : size === 'md' ? 'w-28 h-28' : 'w-40 h-40';
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-2xl';
  const fontSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-sm';
  
  // Determine color class based on color prop or colorClass
  const finalColorClass = colorClass || 
    (color === 'blue' ? 'text-blue-500' : 
    color === 'green' ? 'text-green-500' : 
    color === 'purple' ? 'text-brand-purple' : 
    'text-brand-purple');
  
  const finalTrackClass = trackClass || 
    (color === 'blue' ? 'text-blue-200' : 
    color === 'green' ? 'text-green-200' : 
    color === 'purple' ? 'text-brand-purple/20' : 
    'text-brand-purple/20');
  
  return (
    <div className={cn("relative flex items-center justify-center", containerSize)}>
      {/* Glowing effect */}
      <div className={cn("absolute inset-0 rounded-full opacity-20 blur-md animate-pulse", finalColorClass)}></div>
      
      {/* Track Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${radius * 2 + strokeWidth} ${radius * 2 + strokeWidth}`}>
        <circle
          cx={radius + strokeWidth/2}
          cy={radius + strokeWidth/2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn("transition-all duration-700 ease-out", finalTrackClass)}
        />
        
        {/* Progress Circle */}
        <circle
          cx={radius + strokeWidth/2}
          cy={radius + strokeWidth/2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn("transition-all duration-1000 ease-out", finalColorClass)}
        />
      </svg>
      
      {/* Progress Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold", textSize)}>
          {label || `${Math.round(calculatedPercentage)}%`}
        </span>
        {!label && <span className={cn("text-muted-foreground", fontSize)}>Score</span>}
      </div>
    </div>
  );
};

// Bar Chart Card
interface BarChartCardProps {
  data: any[];
  title: string;
  description?: string;
}

export const BarChartCard: React.FC<BarChartCardProps> = ({ data, title, description }) => {
  // Custom tooltip component for the bar chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-brand-purple">{`Score: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 mb-8 overflow-hidden relative border-2 border-brand-purple/20 shadow-lg">
      <div className="absolute top-0 right-0 h-32 w-32 bg-brand-purple/5 rounded-full -mt-10 -mr-10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 h-32 w-32 bg-brand-green/5 rounded-full -mb-10 -ml-10 blur-2xl"></div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6">{description}</p>}
      
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#666', fontSize: 12 }} 
              axisLine={{ stroke: '#ccc' }}
            />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar 
              dataKey="score" 
              name="Score" 
              fill="url(#colorGradient)" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              barSize={30}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9b87f5" />
                <stop offset="95%" stopColor="#7469ab" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Radar Chart Card
interface RadarChartCardProps {
  data: any[];
  title: string;
  description?: string;
}

export const RadarChartCard: React.FC<RadarChartCardProps> = ({ data, title, description }) => {
  return (
    <Card className="p-6 mb-8 overflow-hidden relative border-2 border-brand-purple/20 shadow-lg">
      <div className="absolute top-0 right-0 h-32 w-32 bg-brand-purple/5 rounded-full -mt-10 -mr-10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 h-32 w-32 bg-brand-green/5 rounded-full -mb-10 -ml-10 blur-2xl"></div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-muted-foreground mb-6">{description}</p>}
      
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius="80%" data={data}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
            <Radar 
              name="Score" 
              dataKey="score" 
              stroke="#9b87f5" 
              fill="#9b87f5" 
              fillOpacity={0.6} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
