import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Star, Target, Heart } from "lucide-react";
import PDFDownloadButton from "./PDFDownloadButton";
import { generateRIASECPDF } from "@/utils/pdfGenerators";
import { StudentDetails } from "../StudentInfoCard";

interface RIASECType {
  name: string;
  title: string;
  description: string;
  careers: string[];
  color: string;
  skills: string[];
}

interface RIASECScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

interface RIASECResultsContentProps {
  scores: RIASECScores;
  riasecTypes: Record<string, RIASECType>;
  studentDetails: StudentDetails | null;
}

const RIASECResultsContent = ({ 
  scores, 
  riasecTypes,
  studentDetails 
}: RIASECResultsContentProps) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const sortedTypes = Object.entries(scores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .map(([type]) => type as keyof typeof riasecTypes);
  
  const primaryType = sortedTypes[0];
  const secondaryType = sortedTypes[1];
  const tertiaryType = sortedTypes[2];
  
  const totalQuestions = Object.values(scores).reduce((a, b) => a + b, 0);
  
  const getPercentage = (score: number) => {
    return Math.round((score / totalQuestions) * 100);
  };
  
  const handleDownloadPDF = async () => {
    if (!studentDetails) {
      console.error("Missing student details for PDF generation");
      return;
    }
    
    const scoresRecord: Record<string, number> = {};
    Object.entries(scores).forEach(([key, value]) => {
      scoresRecord[key] = value;
    });
    
    await generateRIASECPDF({
      scores: scoresRecord,
      riasecTypes,
      studentDetails,
      primaryType,
      secondaryType,
      tertiaryType,
      getPercentage
    });
  };

  return (
    <div ref={resultsRef} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Your RIASEC Profile</h2>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-4">
          <Star className="h-5 w-5 text-brand-purple mr-2" />
          <h3 className="text-xl font-semibold">Your Holland Code: {primaryType}{secondaryType}{tertiaryType}</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Your three-letter Holland Code represents your top three interest areas. These indicate your strongest career preferences and work-related values.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[primaryType, secondaryType, tertiaryType].map((type, index) => {
            const typeInfo = riasecTypes[type as keyof typeof riasecTypes];
            return (
              <div key={type} className={`p-4 rounded-lg ${index === 0 ? 'bg-brand-purple/10 border border-brand-purple/20' : 'bg-gray-50 border border-gray-100'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-brand-purple text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm">
                    {type}
                  </div>
                  <h4 className="font-medium text-gray-900">{typeInfo.name}</h4>
                </div>
                <p className="text-sm text-gray-600">"{typeInfo.title}"</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">RIASEC Score Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(scores).map(([type, score]) => {
            const percentage = getPercentage(score);
            const typeInfo = riasecTypes[type as keyof typeof riasecTypes];
            return (
              <div key={type}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-sm font-medium text-brand-purple mr-2">
                      {type}
                    </div>
                    <span className="text-sm font-medium">{typeInfo.name} ({typeInfo.title})</span>
                  </div>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-brand-purple" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Primary Type: {riasecTypes[primaryType].name}</h3>
        <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-lg p-6">
          <p className="mb-6">{riasecTypes[primaryType].description}</p>
          
          <h4 className="font-medium mb-3">Key Skills & Strengths</h4>
          <ul className="list-disc pl-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
            {riasecTypes[primaryType].skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
          
          <h4 className="font-medium mb-3">Recommended Careers</h4>
          <ul className="list-disc pl-5 grid grid-cols-1 md:grid-cols-2 gap-2">
            {riasecTypes[primaryType].careers.map((career, index) => (
              <li key={index}>{career}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Additional Career Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-5">
            <h4 className="font-medium mb-3">{riasecTypes[secondaryType].name} Careers</h4>
            <ul className="list-disc pl-5 space-y-1">
              {riasecTypes[secondaryType].careers.slice(0, 5).map((career, index) => (
                <li key={index}>{career}</li>
              ))}
            </ul>
          </div>
          
          <div className="border rounded-lg p-5">
            <h4 className="font-medium mb-3">{riasecTypes[tertiaryType].name} Careers</h4>
            <ul className="list-disc pl-5 space-y-1">
              {riasecTypes[tertiaryType].careers.slice(0, 5).map((career, index) => (
                <li key={index}>{career}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
        <div className="bg-gray-50 rounded-lg p-5">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Research careers related to your top Holland Code types</li>
            <li>Consider education paths that align with these interests</li>
            <li>Connect with professionals in fields of interest</li>
            <li>Look for internships or volunteer opportunities</li>
            <li>Take related courses to explore these areas further</li>
          </ol>
        </div>
        
        <div className="mt-6 text-sm text-gray-500 italic">
          <p>Note: This assessment is based on the Holland Occupational Themes (RIASEC) model developed by psychologist John Holland. The results are meant to provide guidance and self-awareness, not to limit your options.</p>
        </div>
      </div>
    </div>
  );
};

export default RIASECResultsContent;
