
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  label: string;
}

const SubmitButton = ({ isSubmitting, label }: SubmitButtonProps) => {
  return (
    <div className="pt-4">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-brand-orange to-brand-orange/80 hover:from-brand-orange hover:to-brand-orange text-white shadow-md hover:shadow-lg transition-all duration-300"
        size="lg"
      >
        {isSubmitting ? "Saving..." : label}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default SubmitButton;
