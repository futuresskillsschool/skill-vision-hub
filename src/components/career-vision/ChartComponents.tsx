
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
import { motion } from 'framer-motion';

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
  
  const getColorClass = (percentage: number) => {
    if (percentage >= 87.5) return "text-green-500";
    if (percentage >= 75) return "text-emerald-500";
    if (percentage >= 62.5) return "text-teal-500";
    if (percentage >= 50) return "text-cyan-500";
    if (percentage >= 37.5) return "text-blue-500";
    if (percentage >= 25) return "text-indigo-500";
    if (percentage >= 12.5) return "text-purple-500";
    return "text-red-500";
  };
  
  const animationDuration = 1.5;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex items-center justify-center"
    >
      <div style={{ width: `${width * 1.5}px`, height: `${height * 1.5}px` }} className="relative">
        {/* Gradient background glow effect */}
        <div className="absolute inset-0 rounded-full blur-md bg-gradient-to-tr from-brand-purple/50 via-brand-red/30 to-transparent"></div>
        
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background track with subtle pattern */}
          <defs>
            <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="rgba(200,200,200,0.2)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          
          {/* Subtle glow effect under the progress ring */}
          <circle 
            className="text-gray-100" 
            strokeWidth={strokeWidth - 0.5} 
            stroke="url(#diagonalHatch)" 
            fill="transparent" 
            r={radius} 
            cx="50" 
            cy="50" 
          />
          
          {/* Background circle */}
          <circle 
            className="text-gray-200" 
            strokeWidth={strokeWidth} 
            stroke="currentColor" 
            fill="transparent" 
            r={radius} 
            cx="50" 
            cy="50" 
          />
          
          {/* Animated progress ring */}
          <motion.circle 
            className={getColorClass(percentage)}
            strokeWidth={strokeWidth} 
            stroke="currentColor" 
            fill="transparent" 
            r={radius} 
            cx="50" 
            cy="50" 
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round" 
            initial={{ strokeDashoffset: circumference }}
            animate={{ 
              strokeDashoffset: circumference - (percentage * circumference / 100) 
            }}
            transition={{ 
              duration: animationDuration,
              ease: "easeInOut"
            }}
          />
          
          {/* Decorative dots along the circle */}
          {[0, 90, 180, 270].map((angle, i) => (
            <motion.circle
              key={i}
              cx={50 + (radius + 5) * Math.cos(angle * Math.PI / 180)}
              cy={50 + (radius + 5) * Math.sin(angle * Math.PI / 180)}
              r={1}
              fill={percentage >= (i+1) * 25 ? "#8860FF" : "#D1D5DB"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 * i, duration: 0.3 }}
            />
          ))}
        </svg>
        
        {/* Score Display */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: animationDuration * 0.8, duration: 0.5 }}
        >
          <span className={`font-bold ${
            size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm'
          } text-gray-800`}>
            {value}
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground">/{max}</span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
