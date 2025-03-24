
import { Clock, FileText, Sparkles } from 'lucide-react';
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
        className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6 border border-brand-purple/20"
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <div className="bg-brand-purple/10 p-1.5 rounded-full mr-2">
            <FileText className="h-5 w-5 text-brand-purple" />
          </div>
          Assessment Details
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-start bg-brand-purple/5 p-3 rounded-lg transition-all hover:bg-brand-purple/10">
            <Clock className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium">Duration</h4>
              <p className="text-foreground/70">{duration}</p>
            </div>
          </div>
          
          <div className="flex items-start bg-brand-purple/5 p-3 rounded-lg transition-all hover:bg-brand-purple/10">
            <FileText className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium">Questions</h4>
              <p className="text-foreground/70">{questions} questions</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-gradient-to-br from-brand-purple/20 to-purple-100 rounded-xl p-6 md:p-8 border border-brand-purple/20 shadow-md overflow-hidden relative"
      >
        <div className="absolute -top-12 -right-12 h-24 w-24 bg-brand-purple/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 h-24 w-24 bg-brand-purple/10 rounded-full blur-2xl"></div>
        
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Sparkles className="h-5 w-5 text-brand-purple mr-2" />
          Ready to Begin?
        </h3>
        <p className="text-foreground/80 mb-6">
          Take the first step toward understanding your strengths and potential career paths.
        </p>
        <Button 
          onClick={onStartAssessment} 
          className="w-full bg-gradient-to-r from-brand-purple to-purple-700 hover:from-purple-700 hover:to-brand-purple text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          size="lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Start Assessment
        </Button>
      </motion.div>
    </>
  );
};

export default AssessmentDetailsPanel;
