
import React from 'react';

type LeadFormHeaderProps = {
  assessmentTitle: string;
};

const LeadFormHeader = ({ assessmentTitle }: LeadFormHeaderProps) => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-block bg-brand-purple/10 text-brand-purple rounded-full px-4 py-1.5 mb-4 text-sm font-medium">
        {assessmentTitle}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Let's Get Started
      </h1>
      <p className="text-foreground/70 max-w-2xl mx-auto">
        Please provide your information to begin the assessment. Your data will be used 
        to personalize your results and experience.
      </p>
    </div>
  );
};

export default LeadFormHeader;
