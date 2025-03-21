
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface AssessmentResult {
  id: string;
  user_id: string;
  assessment_type: string;
  result_data: {
    [key: string]: any;
    scores?: Record<string, number>;
    primary_result?: string;
  };
  created_at: string;
  updated_at: string;
}

const ASSESSMENT_TYPES: Record<string, { name: string, color: string, icon: JSX.Element }> = {
  'riasec': {
    name: 'RIASEC Model Assessment',
    color: 'bg-brand-purple',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a4 4 0 0 1-8 0 4 4 0 0 1 8 0z"/><path d="M12 2a2.83 2.83 0 0 0-2.83 2.83c0 .5.24 1.13.73 1.55a4.5 4.5 0 0 0 4.71-.46 2.3 2.3 0 0 0 .17-3.23 2.83 2.83 0 0 0-2.78-.7z"/><path d="M12 22a2.83 2.83 0 0 0 2.83-2.83c0-.5-.24-1.13-.72-1.55a4.49 4.49 0 0 0-4.71.46 2.3 2.3 0 0 0-.17 3.23 2.83 2.83 0 0 0 2.77.69z"/><path d="M4.73 10.5a2.83 2.83 0 0 0-1.95 2.83c0 .5.24 1.13.72 1.55a4.5 4.5 0 0 0 4.71-.46 2.3 2.3 0 0 0 .17-3.22 2.83 2.83 0 0 0-3.65-.7z"/><path d="M18.52 19.5a2.83 2.83 0 0 0 2.72-2c.58-2.5-2.32-4.3-4.5-2.3a2.83 2.83 0 0 0 1.78 4.3z"/><path d="M20.52 10.5a2.83 2.83 0 0 0-2.72-2c-.58 2.5 2.32 4.3 4.5 2.3a2.83 2.83 0 0 0-1.78-4.3z"/><path d="M4.73 19.5a2.83 2.83 0 0 0 1.95-2.83c0-.5-.24-1.13-.72-1.55a4.5 4.5 0 0 0-4.71.46 2.3 2.3 0 0 0-.17 3.22 2.83 2.83 0 0 0 3.65.7z"/></svg>
  },
  'eq-navigator': {
    name: 'EQ Navigator Assessment',
    color: 'bg-brand-green',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M7 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"></path><path d="M16 3h5v5"></path><path d="M10 14 21 3"></path></svg>
  },
  'future-pathways': {
    name: 'Future Pathways Assessment',
    color: 'bg-brand-orange',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path d="m14.5 9.5 1-1"></path><path d="m18 12 1-1"></path><path d="m14.5 14.5 1 1"></path><path d="m18 16 1 1"></path><path d="m9.5 14.5-1 1"></path><path d="m6 16-1 1"></path><path d="m9.5 9.5-1-1"></path><path d="m6 8-1-1"></path><path d="M12 20v2"></path><path d="M12 2v2"></path></svg>
  },
  'career-vision': {
    name: 'Career Vision Assessment',
    color: 'bg-brand-blue',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 16V8a5 5 0 0 1 10 0v8"></path><path d="M21 16V8a5 5 0 0 0-10 0"></path><path d="M3 16h18"></path><path d="M12 8v8"></path><path d="M7 21h10"></path><path d="M12 16v5"></path></svg>
  },
  'scct-assessment': {
    name: 'SCCT Assessment',
    color: 'bg-brand-pink',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h8"></path><path d="M8 9h2"></path></svg>
  }
};

interface AssessmentTableProps {
  assessments: AssessmentResult[];
}

const AssessmentTable = ({ assessments }: AssessmentTableProps) => {
  const navigate = useNavigate();

  const getAssessmentDetails = (type: string) => {
    return ASSESSMENT_TYPES[type] || {
      name: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ') + ' Assessment',
      color: 'bg-gray-500',
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><path d="M9 3v18"></path><path d="M3 9h18"></path></svg>
    };
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getPrimaryResult = (result: AssessmentResult) => {
    return result.result_data?.primary_result || 'Completed';
  };

  if (assessments.length === 0) {
    return (
      <Card className="p-6 text-center bg-muted/30">
        <p className="text-muted-foreground">You haven't completed any assessments yet.</p>
        <Button 
          onClick={() => navigate('/')} 
          variant="default"
          className="mt-4"
        >
          Explore Assessments
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => {
        const { name, color, icon } = getAssessmentDetails(assessment.assessment_type);
        const maxScore = assessment.result_data?.scores ? 
          Object.values<number>(assessment.result_data.scores).reduce((a, b) => a + b, 0) : null;
        const score = maxScore;

        return (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-5 hover:shadow-md transition-shadow border border-border/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", color)}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Completed on {getFormattedDate(assessment.created_at)}
                    </p>
                    <div className="mt-1">
                      <span className={cn("text-sm font-medium px-2 py-0.5 rounded-full", 
                        `bg-${color.split('-')[1]}/10 text-${color.split('-')[1]}`
                      )}>
                        {getPrimaryResult(assessment)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {score && maxScore && (
                  <div className="w-full md:w-1/3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Score</span>
                      <span className="font-medium">{score}/{maxScore}</span>
                    </div>
                    <Progress value={(score / maxScore) * 100} 
                      className={cn("h-2", 
                        `bg-${color.split('-')[1]}/20`
                      )} 
                    />
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/${assessment.assessment_type}-results`, { 
                      state: { 
                        scores: assessment.result_data.scores,
                        fromDashboard: true
                      } 
                    })}
                    className="text-sm"
                  >
                    View Results
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate(`/${assessment.assessment_type}-results`, { 
                      state: { 
                        scores: assessment.result_data.scores,
                        downloadPdf: true,
                        fromDashboard: true
                      } 
                    })}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AssessmentTable;
