import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample assessment data mapping - this would typically come from an API or database
const assessmentTitles = {
  'career-vision': 'Career Vision Assessment',
  'scct': 'SCCT Assessment',
  'riasec': 'RIASEC Model Assessment',
  'eq-navigator': 'EQ Navigator Assessment',
  'future-pathways': 'Future Pathways Explorer'
};

// Stream options
const streamOptions = [
  'Business & Commerce',
  'Science & Engineering',
  'Arts & Humanities',
  'Health & Medicine',
  'Information Technology',
  'Education',
  'Other'
];

// Interest options
const interestOptions = [
  'Career Development',
  'Personal Growth',
  'Academic Planning',
  'Skill Development',
  'Leadership',
  'Entrepreneurship',
  'Other'
];

const LeadForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
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
  
  const assessmentTitle = id ? assessmentTitles[id as keyof typeof assessmentTitles] : 'Assessment';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is updated
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
    
    // Clear error when field is updated
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
      // Register the user with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            stream: formData.stream,
            interest: formData.interest
          }
        }
      });
      
      if (authError) throw authError;
      
      // Update the profile with additional information
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            stream: formData.stream,
            interest: formData.interest
          })
          .eq('id', authData.user.id);
          
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }
      
      toast({
        title: "Account created",
        description: "Your information has been saved successfully. Starting your assessment now.",
      });
      
      // Navigate to the correct assessment based on ID
      if (id === 'eq-navigator') {
        navigate('/assessment/eq-navigator');
      } else if (id === 'future-pathways') {
        navigate('/assessment/future-pathways');
      } else if (id === 'riasec') {
        navigate('/assessment/riasec');
      } else {
        // For other assessments, navigate back to the detail page for now
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-block bg-brand-purple/10 text-brand-purple rounded-full px-4 py-1.5 mb-4 text-sm font-medium">
                {assessmentTitle}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Let's Get Started
              </h1>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Please provide your information to begin the assessment. Your data will be used 
                to personalize your results and experience.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-card overflow-hidden animate-fade-in">
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">{errors.firstName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                  
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'border-red-500' : ''}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                  
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
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="button-primary w-full md:w-auto"
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
                        <span className="flex items-center">
                          Begin Assessment <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-foreground/60 animate-fade-in">
              <p>
                Your information is protected by our <a href="/privacy" className="text-brand-purple hover:underline">Privacy Policy</a>.
                We never share your personal data without your explicit consent.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LeadForm;
