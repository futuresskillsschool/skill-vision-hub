
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { User, KeyRound, Mail, Phone, Briefcase, School, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const streamOptions = [
  'Business & Commerce',
  'Science & Engineering',
  'Arts & Humanities',
  'Health & Medicine',
  'Information Technology',
  'Education',
  'Other'
];

const interestOptions = [
  'Career Development',
  'Personal Growth',
  'Academic Planning',
  'Skill Development',
  'Leadership',
  'Entrepreneurship',
  'Other'
];

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    stream: '',
    interest: '',
    class: '',
    section: '',
    school: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
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

    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }

    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
    }

    if (!formData.school.trim()) {
      newErrors.school = 'School name is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
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
      
      if (authData.user) {
        // Update profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
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
        
        // Create student details record
        const { error: studentError } = await supabase
          .from('student_details')
          .insert({
            user_id: authData.user.id,
            name: `${formData.firstName} ${formData.lastName}`,
            class: formData.class,
            section: formData.section,
            school: formData.school,
            assessment_type: 'signup'
          });
          
        if (studentError) {
          console.error('Error creating student record:', studentError);
        }
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email to verify your account.",
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto bg-white rounded-xl shadow-card p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-brand-purple" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
              <p className="text-muted-foreground">Join Future Skills School to access our assessments and resources</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="pl-10"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <div className="relative">
                    <Input
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      required
                      className="pl-10"
                      placeholder="e.g. 10th"
                    />
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.class && <p className="text-red-500 text-sm">{errors.class}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <div className="relative">
                    <Input
                      id="section"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      required
                      className="pl-10"
                      placeholder="e.g. A"
                    />
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.section && <p className="text-red-500 text-sm">{errors.section}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <div className="relative">
                  <Input
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    required
                    className="pl-10"
                    placeholder="Your school name"
                  />
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.school && <p className="text-red-500 text-sm">{errors.school}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stream">Stream</Label>
                  <Select 
                    value={formData.stream} 
                    onValueChange={(value) => handleSelectChange('stream', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {streamOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.stream && <p className="text-red-500 text-sm">{errors.stream}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interest">Area of Interest</Label>
                  <Select 
                    value={formData.interest} 
                    onValueChange={(value) => handleSelectChange('interest', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent>
                      {interestOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.interest && <p className="text-red-500 text-sm">{errors.interest}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-purple hover:bg-brand-dark-purple"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-6">
                <p>Already have an account? <Link to="/login" className="text-brand-purple hover:underline">Sign in</Link></p>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;
