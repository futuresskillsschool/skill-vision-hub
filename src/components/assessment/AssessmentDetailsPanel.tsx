
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
        className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-brand-orange/30"
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
          <div className="bg-brand-orange/10 p-2 rounded-full mr-3">
            <FileText className="h-5 w-5 text-brand-orange" />
          </div>
          Assessment Details
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-start bg-brand-orange/5 p-4 rounded-lg transition-all hover:bg-brand-orange/10">
            <Clock className="h-5 w-5 text-brand-orange mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-800">Duration</h4>
              <p className="text-gray-600">{duration}</p>
            </div>
          </div>
          
          <div className="flex items-start bg-brand-orange/5 p-4 rounded-lg transition-all hover:bg-brand-orange/10">
            <FileText className="h-5 w-5 text-brand-orange mr-3 mt-0.5" />
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
        className="bg-gradient-to-br from-brand-orange/10 to-brand-orange/5 rounded-xl p-6 md:p-8 border border-brand-orange/30 shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
          <Sparkles className="h-5 w-5 text-brand-orange mr-2" />
          Ready to Begin?
        </h3>
        <p className="text-gray-600 mb-6">
          Take the first step toward understanding your strengths and potential career paths.
        </p>
        <Button 
          onClick={onStartAssessment} 
          className="w-full bg-gradient-to-r from-brand-orange to-brand-orange/80 hover:from-brand-orange hover:to-brand-orange text-white shadow-md hover:shadow-lg transition-all duration-300"
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
