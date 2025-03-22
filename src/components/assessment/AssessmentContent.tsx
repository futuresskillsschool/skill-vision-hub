
import { Button } from '@/components/ui/button';
import AssessmentBenefits from './AssessmentBenefits';
import { useAuth } from '@/contexts/AuthContext';

type AssessmentContentProps = {
  image: string;
  title: string;
  description: string;
  benefits: string[];
  ideal: string;
  onStartAssessment: () => void;
};

const AssessmentContent = ({ 
  image, 
  title, 
  description, 
  benefits, 
  ideal, 
  onStartAssessment 
}: AssessmentContentProps) => {
  const { user } = useAuth();
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card">
      <img 
        src={image} 
        alt={title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6 md:p-8">
        <p className="text-foreground/80 mb-8">
          {description}
        </p>
        
        <AssessmentBenefits benefits={benefits} ideal={ideal} />
        
        <Button onClick={onStartAssessment} className="button-primary w-full md:w-auto">
          Start Assessment
        </Button>
      </div>
    </div>
  );
};

export default AssessmentContent;
