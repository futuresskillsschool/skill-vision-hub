import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Target, Heart, Sparkles, Download } from 'lucide-react';
import { CircularProgressIndicator } from './ChartComponents';
import { 
  CareerRecommendation, 
  riasecDescriptions, 
  pathwaysDescriptions, 
  eqLevelDescriptions 
} from './DataTypes';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, CartesianGrid, XAxis, Tooltip, Bar } from 'recharts';
import { StudentDetails } from '@/components/assessment/StudentInfoCard';

interface CircularProgressProps {
  percentage: number;
  label: string;
  color: string;
}

interface OverviewTabProps {
  riasec: Record<string, number>;
  pathways: Record<string, number>;
  eqScore: number;
  careerRecommendations: CareerRecommendation[];
  topRiasecCategories: string[];
  topPathwaysClusters: string[];
  riasecChartData: any[];
  pathwaysChartData: any[];
  handleDownloadPDF: () => void;
  studentDetails?: StudentDetails | null;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  riasec,
  pathways,
  eqScore,
  careerRecommendations,
  topRiasecCategories,
  topPathwaysClusters,
  riasecChartData,
  pathwaysChartData,
  handleDownloadPDF,
  studentDetails
}) => {
  const eqLevel = eqScore < 25 ? "low" : eqScore < 35 ? "medium" : "high";
  // Ensure the score percentage is capped at 100%
  const scorePercentage = Math.min(Math.round((eqScore / 40) * 100), 100);

  return (
    <>
      {studentDetails && (
        <Card className="p-6 bg-blue-50 mb-8">
          <div className="flex items-center mb-4">
            <Heart className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold">Student Profile</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="font-medium">{studentDetails.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Class & Section</p>
              <p className="font-medium">{studentDetails.class} - {studentDetails.section}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">School</p>
              <p className="font-medium">{studentDetails.school}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-brand-blue/5">
          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 text-brand-blue mr-2" />
            <p className="font-semibold">RIASEC Profile</p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your top interests are in the {topRiasecCategories.map(c => {
              const desc = riasecDescriptions[c as keyof typeof riasecDescriptions];
              return desc ? desc.title : c;
            }).join(", ")} areas.
          </p>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riasecChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <Radar name="Score" dataKey="score" fill="#4285F4" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6 bg-brand-blue/5">
          <div className="flex items-center mb-4">
            <Target className="h-5 w-5 text-brand-blue mr-2" />
            <p className="font-semibold">Future Pathways</p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your top career clusters are {topPathwaysClusters.map(c => {
              const desc = pathwaysDescriptions[c as keyof typeof pathwaysDescriptions];
              return desc ? desc.title.split(' & ')[0] : c;
            }).join(" and ")}.
          </p>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pathwaysChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar dataKey="score" fill="#4285F4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6 bg-blue-50">
          <div className="flex items-center mb-4">
            <Heart className="h-5 w-5 text-blue-600 mr-2" />
            <p className="font-semibold">EQ Navigator</p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your emotional intelligence is at the {
              eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].title
            } level.
          </p>
          <div className="flex items-center justify-center h-[120px]">
            <CircularProgressIndicator 
              percentage={scorePercentage} 
              label="EQ Score" 
              color="blue" 
            />
          </div>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 mt-8">Your Top Career Recommendations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {careerRecommendations.map((rec, index) => (
          <Card key={index} className="overflow-hidden">
            <div className={`p-2 text-white text-center ${
              index === 0 ? 'bg-blue-600' : 
              index === 1 ? 'bg-brand-blue' : 'bg-blue-500'
            }`}>
              <div className="text-sm font-medium">Match: {rec.match}%</div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-3">{rec.title}</h3>
              <ul className="space-y-2 text-sm">
                {rec.careers.map((career, i) => (
                  <li key={i} className="flex items-start">
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 ${
                      index === 0 ? 'bg-blue-600' : 
                      index === 1 ? 'bg-brand-blue' : 'bg-blue-500'
                    }`}></span>
                    {career}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="p-6 bg-blue-50 mb-6">
        <div className="flex items-center mb-4">
          <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-semibold">Your Unique Career Profile</h3>
        </div>
        <p className="mb-4">
          Based on your combined assessment results, you have a unique blend of interests, aptitudes, and emotional intelligence that positions you well for careers that involve 
          {topRiasecCategories.includes('R') && " technical problem-solving,"}
          {topRiasecCategories.includes('I') && " analysis and investigation,"}
          {topRiasecCategories.includes('A') && " creativity and self-expression,"}
          {topRiasecCategories.includes('S') && " helping and working with people,"}
          {topRiasecCategories.includes('E') && " leadership and persuasion,"}
          {topRiasecCategories.includes('C') && " organization and attention to detail,"}
          {topPathwaysClusters.includes('tech-innovator') && " technology innovation,"}
          {topPathwaysClusters.includes('digital-creator') && " digital content creation,"}
          {topPathwaysClusters.includes('data-analyst') && " data analysis,"}
          {topPathwaysClusters.includes('entrepreneur') && " entrepreneurship,"}
          {topPathwaysClusters.includes('helper') && " helping others through technology,"} 
          {eqLevel === "high" && " with a strong ability to navigate social and emotional situations."}
          {eqLevel === "medium" && " with a growing ability to navigate social and emotional situations."}
          {eqLevel === "low" && " with opportunities to develop your emotional intelligence skills further."}
        </p>
        <p>
          Continue exploring the detailed results in each tab to learn more about your specific strengths in each area.
        </p>
      </Card>
      
      <Button 
        variant="outline" 
        onClick={handleDownloadPDF} 
        className="w-full md:hidden flex items-center justify-center gap-2 mt-4"
      >
        <Download className="h-4 w-4" />
        Download Comprehensive PDF
      </Button>
    </>
  );
};

export default OverviewTab;
