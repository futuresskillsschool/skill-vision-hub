
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import FormHeader from "./form/FormHeader";
import StudentFormContent from "./form/StudentFormContent";

interface StudentDetailsFormProps {
  assessmentType: string;
  resultsData: any;
  onSubmitSuccess: (studentDetails: any) => void;
}

const StudentDetailsForm = ({ 
  assessmentType, 
  resultsData, 
  onSubmitSuccess 
}: StudentDetailsFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = async (data: {
    name: string;
    class: string;
    section: string;
    school: string;
  }) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting student details:", data);
      
      // Create studentDetails object
      const studentDetails = {
        id: Date.now().toString(), // Generate a random ID
        name: data.name,
        class: data.class,
        section: data.section,
        school: data.school
      };

      toast({
        title: "Information saved",
        description: "Your details have been saved successfully.",
      });

      // Call the onSubmitSuccess callback with the student details
      onSubmitSuccess(studentDetails);
      
    } catch (error) {
      console.error("Error saving student details:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto"
    >
      <FormHeader 
        title="Student Information"
        description="Please provide your details before viewing your assessment results"
      />
      
      <StudentFormContent 
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </motion.div>
  );
};

export default StudentDetailsForm;
