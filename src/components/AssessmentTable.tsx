
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Download, 
  FileText, 
  Calendar, 
  CheckCircle,
  Info,
  User
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const ASSESSMENT_TYPES: Record<string, { name: string, color: string, icon: JSX.Element, questionCount: number }> = {
  'riasec': {
    name: 'RIASEC Model Assessment',
    color: 'bg-brand-purple',
    questionCount: 36,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a4 4 0 0 1-8 0 4 4 0 0 1 8 0z"/><path d="M12 2a2.83 2.83 0 0 0-2.83 2.83c0 .5.24 1.13.73 1.55a4.5 4.5 0 0 0 4.71-.46 2.3 2.3 0 0 0 .17-3.23 2.83 2.83 0 0 0-2.78-.7z"/><path d="M12 22a2.83 2.83 0 0 0 2.83-2.83c0-.5-.24-1.13-.72-1.55a4.49 4.49 0 0 0-4.71.46 2.3 2.3 0 0 0-.17 3.23 2.83 2.83 0 0 0 2.77.69z"/><path d="M4.73 10.5a2.83 2.83 0 0 0-1.95 2.83c0 .5.24 1.13.72 1.55a4.5 4.5 0 0 0 4.71-.46 2.3 2.3 0 0 0 .17-3.22 2.83 2.83 0 0 0-3.65-.7z"/><path d="M18.52 19.5a2.83 2.83 0 0 0 2.72-2c.58-2.5-2.32-4.3-4.5-2.3a2.83 2.83 0 0 0 1.78 4.3z"/><path d="M20.52 10.5a2.83 2.83 0 0 0-2.72-2c-.58 2.5 2.32 4.3 4.5 2.3a2.83 2.83 0 0 0-1.78-4.3z"/><path d="M4.73 19.5a2.83 2.83 0 0 0 1.95-2.83c0-.5-.24-1.13-.72-1.55a4.5 4.5 0 0 0-4.71.46 2.3 2.3 0 0 0-.17 3.22 2.83 2.83 0 0 0 3.65.7z"/></svg>
  },
  'eq-navigator': {
    name: 'EQ Navigator Assessment',
    color: 'bg-brand-green',
    questionCount: 20,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M7 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"></path><path d="M16 3h5v5"></path><path d="M10 14 21 3"></path></svg>
  },
  'future-pathways': {
    name: 'Future Pathways Assessment',
    color: 'bg-brand-orange',
    questionCount: 18,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path d="m14.5 9.5 1-1"></path><path d="m18 12 1-1"></path><path d="m14.5 14.5 1 1"></path><path d="m18 16 1 1"></path><path d="m9.5 14.5-1 1"></path><path d="m6 16-1 1"></path><path d="m9.5 9.5-1-1"></path><path d="m6 8-1-1"></path><path d="M12 20v2"></path><path d="M12 2v2"></path></svg>
  },
  'career-vision': {
    name: 'Career Vision Assessment',
    color: 'bg-brand-blue',
    questionCount: 15,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 16V8a5 5 0 0 1 10 0v8"></path><path d="M21 16V8a5 5 0 0 0-10 0"></path><path d="M3 16h18"></path><path d="M12 8v8"></path><path d="M7 21h10"></path><path d="M12 16v5"></path></svg>
  },
  'scct': {
    name: 'SCCT Assessment',
    color: 'bg-brand-pink',
    questionCount: 25,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h8"></path><path d="M8 9h2"></path></svg>
  }
};

interface AssessmentTableProps {
  assessments: AssessmentResult[];
}

const AssessmentTable = ({ assessments }: AssessmentTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewType, setViewType] = useState<'cards' | 'table'>('cards');

  const getAssessmentDetails = (type: string) => {
    return ASSESSMENT_TYPES[type] || {
      name: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ') + ' Assessment',
      color: 'bg-gray-500',
      questionCount: 0,
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><path d="M9 3v18"></path><path d="M3 9h18"></path></svg>
    };
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getPrimaryResult = (result: AssessmentResult) => {
    if (result.assessment_type === 'eq-navigator') {
      return result.result_data?.primary_result || 'Completed';
    }
    return result.result_data?.primary_result || 'Completed';
  };

  const handleViewResults = (assessment: AssessmentResult) => {
    console.log('Viewing results for assessment:', assessment);
    
    // Navigate to the specific assessment results page with the complete result_data
    navigate(`/assessment/${assessment.assessment_type}/results`, { 
      state: { 
        ...assessment.result_data,
        fromDashboard: true
      } 
    });
  };

  const handleDownloadPDF = (assessment: AssessmentResult) => {
    try {
      console.log('Downloading PDF for assessment:', assessment);
      
      navigate(`/assessment/${assessment.assessment_type}/results`, { 
        state: { 
          ...assessment.result_data,
          downloadPdf: true,
          fromDashboard: true
        } 
      });
      
      toast({
        title: "Preparing Download",
        description: "Your results are being prepared for download.",
      });
    } catch (error) {
      console.error('Error navigating to download results:', error);
      toast({
        title: "Download Error",
        description: "There was a problem preparing your download. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (assessments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8 text-center bg-white/70 backdrop-blur-sm">
          <div className="py-10">
            <div className="flex justify-center mb-4">
              <FileText className="h-12 w-12 text-muted-foreground opacity-40" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Assessments Found</h3>
            <p className="text-muted-foreground mb-6">You haven't completed any assessments yet.</p>
            <Button 
              onClick={() => navigate('/')} 
              variant="default"
              className="bg-brand-blue hover:bg-brand-blue/90 text-white"
            >
              Explore Assessments
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="bg-muted/20 p-1 rounded-lg inline-flex">
          <Button 
            variant={viewType === 'cards' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setViewType('cards')}
            className={viewType === 'cards' ? 'bg-white shadow-sm' : ''}
          >
            Cards
          </Button>
          <Button 
            variant={viewType === 'table' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setViewType('table')}
            className={viewType === 'table' ? 'bg-white shadow-sm' : ''}
          >
            Table
          </Button>
        </div>
      </div>
      
      {viewType === 'cards' ? (
        <div className="space-y-4">
          {assessments.map((assessment, index) => {
            const { name, color, icon, questionCount } = getAssessmentDetails(assessment.assessment_type);
            const maxScore = assessment.result_data?.scores ? 
              Object.values<number>(assessment.result_data.scores).reduce((a, b) => a + b, 0) : null;
            const score = maxScore;

            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-5 hover:shadow-md transition-shadow border border-border/40 bg-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", color)}>
                        {icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{name}</h3>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {getFormattedDate(assessment.created_at)}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={cn("text-sm font-medium px-2 py-0.5 rounded-full", 
                            `bg-${color.split('-')[1]}/10 text-${color.split('-')[1]}`
                          )}>
                            {getPrimaryResult(assessment)}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center text-xs text-muted-foreground cursor-help">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {questionCount} Q
                                  <Info className="h-3 w-3 ml-0.5" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This assessment has {questionCount} questions</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                    
                    {score && maxScore && (
                      <div className="w-full md:w-1/3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completion</span>
                          <span className="font-medium">
                            <CheckCircle className="h-3 w-3 inline mr-1 text-green-500" />
                            100%
                          </span>
                        </div>
                        <Progress value={100} 
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
                        onClick={() => handleViewResults(assessment)}
                        className="text-sm text-brand-blue border-brand-blue hover:bg-brand-blue/5"
                      >
                        View Results
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-brand-blue hover:bg-brand-blue/5"
                        onClick={() => handleDownloadPDF(assessment)}
                        title="Download PDF"
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
      ) : (
        <Card className="border overflow-hidden backdrop-blur-sm bg-white/90">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment Type</TableHead>
                  <TableHead>Date Completed</TableHead>
                  <TableHead>Primary Result</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => {
                  const { name, color, icon } = getAssessmentDetails(assessment.assessment_type);
                  
                  return (
                    <TableRow key={assessment.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", color)}>
                            {icon}
                          </div>
                          <span>{name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getFormattedDate(assessment.created_at)}</TableCell>
                      <TableCell>
                        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", 
                          `bg-${color.split('-')[1]}/10 text-${color.split('-')[1]}`
                        )}>
                          {getPrimaryResult(assessment)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewResults(assessment)}
                            className="text-xs text-brand-blue border-brand-blue hover:bg-brand-blue/5"
                          >
                            View
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 text-brand-blue hover:bg-brand-blue/5"
                            onClick={() => handleDownloadPDF(assessment)}
                            title="Download PDF"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AssessmentTable;
