
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Grid } from 'lucide-react';

interface ResultsHeaderProps {
  title: string;
  subtitle?: string;
  onDownload?: () => void;
  isDownloading?: boolean;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ 
  title, 
  subtitle, 
  onDownload, 
  isDownloading = false 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8 flex flex-wrap justify-between items-center">
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-brand-orange hover:text-brand-orange/80 -ml-3"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {subtitle && (
          <p className="text-foreground/70 max-w-3xl">{subtitle}</p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
        <Link to="/">
          <Button variant="outline" className="flex items-center">
            <Grid className="mr-2 h-4 w-4" />
            Back to Assessments
          </Button>
        </Link>
        
        {onDownload && (
          <Button 
            className="flex items-center bg-brand-orange text-white hover:bg-brand-orange/90"
            onClick={onDownload}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" /> 
            {isDownloading ? 'Generating PDF...' : 'Download Results'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultsHeader;
