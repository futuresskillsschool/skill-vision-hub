
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface RIASECResultsHeaderProps {
  title?: string;
  subtitle?: string;
}

const RIASECResultsHeader: React.FC<RIASECResultsHeaderProps> = ({ 
  title = "Your RIASEC Results", 
  subtitle = "Based on your responses, here are your RIASEC personality type results"
}) => {
  return (
    <div className="mb-8">
      <Link to="/assessment/riasec" className="inline-flex items-center text-brand-purple hover:underline mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
};

export default RIASECResultsHeader;
