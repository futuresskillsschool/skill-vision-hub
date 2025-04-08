
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  stream: string;
  interest: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};

export const useLeadForm = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    stream: '',
    interest: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.stream) {
      newErrors.stream = 'Please select a stream';
    }

    if (!formData.interest) {
      newErrors.interest = 'Please select an area of interest';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Fix: Ensure proper metadata structure when signing up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            // Explicitly structure the user metadata with proper field names
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            stream: formData.stream,
            interest: formData.interest
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Fix: Ensure proper field mapping when updating profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            // Explicitly map each field to its corresponding column
            id: authData.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            stream: formData.stream,
            interest: formData.interest,
            email: formData.email
          });
          
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
        
        // Create student details record using stream as class and interest as section
        const { error: studentError } = await supabase
          .from('student_details')
          .insert({
            user_id: authData.user.id,
            name: `${formData.firstName} ${formData.lastName}`,
            class: formData.stream, // Using stream as class for lead form
            section: formData.interest, // Using interest as section for lead form
            school: 'Not specified', // Default value
            assessment_type: id || 'lead' // Using assessment ID or default
          });
          
        if (studentError) {
          console.error('Error creating student record:', studentError);
        }
      }
      
      toast({
        title: "Account created",
        description: "Your information has been saved successfully. Starting your assessment now.",
      });
      
      if (id === 'eq-navigator') {
        navigate('/eq-navigator');
      } else if (id === 'future-pathways') {
        navigate('/future-pathways');
      } else if (id === 'riasec' || id === 'riasec-model') {
        navigate('/riasec');
      } else {
        navigate(`/assessment/${id}`);
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSelectChange,
    handleSubmit
  };
};
