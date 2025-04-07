
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import FormField from "./FormField";
import SubmitButton from "./SubmitButton";
import { User, School, BookOpen, UsersRound } from "lucide-react";

// Create a schema for form validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  class: z.string().min(1, { message: "Class is required" }),
  section: z.string().min(1, { message: "Section is required" }),
  school: z.string().min(1, { message: "School name is required" }),
});

export type StudentFormValues = z.infer<typeof formSchema>;

interface StudentFormContentProps {
  onSubmit: (data: StudentFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const StudentFormContent = ({ onSubmit, isSubmitting }: StudentFormContentProps) => {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      class: "",
      section: "",
      school: "",
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
          Icon={User}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="class"
            label="Class"
            placeholder="e.g., 10th, 11th, 12th"
            Icon={BookOpen}
          />

          <FormField
            control={form.control}
            name="section"
            label="Section"
            placeholder="e.g., A, B, C"
            Icon={UsersRound}
          />
        </div>

        <FormField
          control={form.control}
          name="school"
          label="School Name"
          placeholder="Enter your school name"
          Icon={School}
        />

        <SubmitButton isSubmitting={isSubmitting} label="Continue to Results" />
      </form>
    </Form>
  );
};

export default StudentFormContent;
