
import React from 'react';

type LeadFormHeaderProps = {
  assessmentTitle: string;
};

const LeadFormHeader = ({ assessmentTitle }: LeadFormHeaderProps) => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Student Information
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Please provide your details before viewing your assessment results
      </p>
    </div>
  );
};

export default LeadFormHeader;
