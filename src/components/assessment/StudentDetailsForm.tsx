
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import FormHeader from "./form/FormHeader";
import StudentFormContent from "./form/StudentFormContent";

interface StudentDetailsFormProps {
  assessmentType: string;
  resultsData: any;
  onSubmitSuccess: (studentId: string) => void;
}

const StudentDetailsForm = ({ 
  assessmentType, 
  resultsData, 
  onSubmitSuccess 
}: StudentDetailsFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log("StudentDetailsForm - Assessment type:", assessmentType);
  console.log("StudentDetailsForm - Results data:", resultsData);
  
  const onSubmit = async (data: {
    name: string;
    class: string;
    section: string;
    school: string;
  }) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting student details:", data);
      console.log("Assessment type:", assessmentType);
      
      // Save student details to Supabase
      const { data: studentData, error } = await supabase
        .from("student_details")
        .insert({
          name: data.name,
          class: data.class,
          section: data.section,
          school: data.school,
          assessment_type: assessmentType,
          user_id: user?.id || null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Student details saved, ID:", studentData.id);
      
      toast({
        title: "Information saved",
        description: "Your details have been saved successfully.",
      });

      // Call the onSubmitSuccess callback with the student ID
      onSubmitSuccess(studentData.id);
      
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
