
import { Clock, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-[hsl(var(--brand-red))/20]"
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
          <div className="bg-[hsl(var(--brand-red))/10] p-2 rounded-full mr-3">
            <FileText className="h-5 w-5 text-[hsl(var(--brand-red))]" />
          </div>
          Assessment Details
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-start bg-[hsl(var(--brand-red))/5] p-4 rounded-lg transition-all hover:bg-[hsl(var(--brand-red))/10]">
            <Clock className="h-5 w-5 text-[hsl(var(--brand-red))] mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800">Duration</h4>
              <p className="text-gray-600">{duration}</p>
            </div>
          </div>
          
          <div className="flex items-start bg-[hsl(var(--brand-red))/5] p-4 rounded-lg transition-all hover:bg-[hsl(var(--brand-red))/10]">
            <FileText className="h-5 w-5 text-[hsl(var(--brand-red))] mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800">Questions</h4>
              <p className="text-gray-600">{questions} questions</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-gradient-to-br from-[hsl(var(--brand-red))/10] to-[hsl(var(--brand-pink))/20] rounded-xl p-6 md:p-8 border border-[hsl(var(--brand-red))/20] shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
          <Sparkles className="h-5 w-5 text-[hsl(var(--brand-red))] mr-2" />
          Ready to Begin?
        </h3>
        <p className="text-gray-600 mb-6">
          Take the first step toward understanding your strengths and potential career paths.
        </p>
        <Button 
          onClick={onStartAssessment} 
          className="w-full bg-gradient-to-r from-[hsl(var(--brand-red))] to-[hsl(var(--brand-red-dark))] hover:from-[hsl(var(--brand-red-dark))] hover:to-[hsl(var(--brand-red))] text-white shadow-md hover:shadow-lg transition-all duration-300"
          size="lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Start Assessment
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </motion.div>
    </>
  );
};

export default AssessmentDetailsPanel;
