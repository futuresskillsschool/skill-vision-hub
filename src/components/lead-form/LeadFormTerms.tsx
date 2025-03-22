
import React from 'react';

type LeadFormTermsProps = {
  formData: {
    agreeToTerms: boolean;
  };
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const LeadFormTerms = ({ 
  formData, 
  errors, 
  handleChange 
}: LeadFormTermsProps) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="w-4 h-4 text-brand-purple bg-gray-100 border-gray-300 rounded focus:ring-brand-purple focus:ring-offset-0"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor="agreeToTerms" className="text-gray-600">
          I agree to the <a href="/terms" className="text-brand-purple hover:underline">Terms of Service</a> and <a href="/privacy" className="text-brand-purple hover:underline">Privacy Policy</a> <span className="text-red-500">*</span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>
        )}
      </div>
    </div>
  );
};

export default LeadFormTerms;
