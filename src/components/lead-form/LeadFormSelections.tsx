
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LeadFormSelectionsProps = {
  formData: {
    stream: string;
    interest: string;
  };
  errors: Record<string, string>;
  handleSelectChange: (name: string, value: string) => void;
  streamOptions: string[];
  interestOptions: string[];
};

const LeadFormSelections = ({ 
  formData, 
  errors, 
  handleSelectChange,
  streamOptions,
  interestOptions
}: LeadFormSelectionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="stream">Stream <span className="text-red-500">*</span></Label>
        <Select 
          value={formData.stream} 
          onValueChange={(value) => handleSelectChange('stream', value)}
        >
          <SelectTrigger className={errors.stream ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select your stream" />
          </SelectTrigger>
          <SelectContent>
            {streamOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.stream && (
          <p className="text-red-500 text-sm">{errors.stream}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="interest">Area of Interest <span className="text-red-500">*</span></Label>
        <Select 
          value={formData.interest} 
          onValueChange={(value) => handleSelectChange('interest', value)}
        >
          <SelectTrigger className={errors.interest ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select your interest" />
          </SelectTrigger>
          <SelectContent>
            {interestOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.interest && (
          <p className="text-red-500 text-sm">{errors.interest}</p>
        )}
      </div>
    </div>
  );
};

export default LeadFormSelections;
