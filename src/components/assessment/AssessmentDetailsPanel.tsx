
import { Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AssessmentDetailsPanelProps = {
  duration: string;
  questions: number;
  onStartAssessment: () => void;
};

const AssessmentDetailsPanel = ({ 
  duration, 
  questions, 
  onStartAssessment 
}: AssessmentDetailsPanelProps) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-card p-6 md:p-8 mb-6 border border-border/40">
        <h3 className="text-xl font-semibold mb-6">Assessment Details</h3>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium">Duration</h4>
              <p className="text-foreground/70">{duration}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium">Questions</h4>
              <p className="text-foreground/70">{questions} questions</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-brand-purple/10 rounded-xl p-6 md:p-8 border border-brand-purple/20">
        <h3 className="text-xl font-semibold mb-4">Ready to Begin?</h3>
        <p className="text-foreground/80 mb-6">
          Take the first step toward understanding your strengths and potential career paths.
        </p>
        <Button onClick={onStartAssessment} className="button-primary w-full">
          Start Assessment
        </Button>
      </div>
    </>
  );
};

export default AssessmentDetailsPanel;
