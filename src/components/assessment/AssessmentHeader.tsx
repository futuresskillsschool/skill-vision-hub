
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type AssessmentHeaderProps = {
  title: string;
  subtitle: string;
};

const AssessmentHeader = ({ title, subtitle }: AssessmentHeaderProps) => {
  return (
    <div className="mb-8">
      <Link to="/" className="inline-flex items-center text-brand-purple hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Assessments
      </Link>
      
      <div className="max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
          {title}
        </h1>
        <p className="text-xl text-foreground/70 animate-fade-in">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AssessmentHeader;
