import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowRight, User, School, BookOpen, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface StudentDetailsFormProps {
  assessmentType: string;
  resultsData: any;
  onSubmitSuccess: (studentId: string) => void;
}

// Create a schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  class: z.string().min(1, { message: "Class is required" }),
  section: z.string().min(1, { message: "Section is required" }),
  school: z.string().min(1, { message: "School name is required" }),
});

type FormValues = z.infer<typeof formSchema>;

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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      class: "",
      section: "",
      school: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Student Information
        </h2>
        <p className="text-gray-600">
          Please provide your details before viewing your assessment results
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-base">
                  <User className="h-4 w-4 mr-2 text-brand-orange" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    className="border-gray-300 focus-visible:ring-brand-orange/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-base">
                    <BookOpen className="h-4 w-4 mr-2 text-brand-orange" />
                    Class
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 10th, 11th, 12th"
                      {...field}
                      className="border-gray-300 focus-visible:ring-brand-orange/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-base">
                    <UsersRound className="h-4 w-4 mr-2 text-brand-orange" />
                    Section
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., A, B, C"
                      {...field}
                      className="border-gray-300 focus-visible:ring-brand-orange/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-base">
                  <School className="h-4 w-4 mr-2 text-brand-orange" />
                  School Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your school name"
                    {...field}
                    className="border-gray-300 focus-visible:ring-brand-orange/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-brand-orange to-brand-orange/80 hover:from-brand-orange hover:to-brand-orange text-white shadow-md hover:shadow-lg transition-all duration-300"
              size="lg"
            >
              {isSubmitting ? "Saving..." : "Continue to Results"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default StudentDetailsForm;
