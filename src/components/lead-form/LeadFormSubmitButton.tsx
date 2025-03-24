
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

type LeadFormSubmitButtonProps = {
  isSubmitting: boolean;
};

const LeadFormSubmitButton = ({ isSubmitting }: LeadFormSubmitButtonProps) => {
  return (
    <div className="pt-4">
      <Button 
        type="submit" 
        className="bg-gradient-to-r from-brand-purple to-purple-700 hover:from-purple-600 hover:to-brand-purple text-white w-full md:w-auto shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center font-medium">
            Begin Assessment <Sparkles className="mx-1 h-4 w-4" /> <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  );
};

export default LeadFormSubmitButton;
