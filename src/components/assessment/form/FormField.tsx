
import React from "react";
import {
  FormField as UIFormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface FormFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  Icon: LucideIcon;
}

const FormField = ({ control, name, label, placeholder, Icon }: FormFieldProps) => {
  return (
    <UIFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center text-base">
            <Icon className="h-4 w-4 mr-2 text-brand-orange" />
            {label}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="border-gray-300 focus-visible:ring-brand-orange/50"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
