
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { LogIn, User, KeyRound, Mail, Phone, School, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [school, setSchool] = useState('');
  const [phone, setPhone] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Login successful",
          description: "Welcome back to Future Skills School!",
        });
        
        navigate('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: name.split(' ')[0] || '',
              last_name: name.split(' ').slice(1).join(' ') || '',
              phone
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Update profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              first_name: name.split(' ')[0] || '',
              last_name: name.split(' ').slice(1).join(' ') || '',
              phone: phone,
              email: email
            });
            
          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
          
          // Create student details record
          const { error: studentError } = await supabase
            .from('student_details')
            .insert({
              user_id: data.user.id,
              name: name,
              class: className,
              section: section,
              school: school,
              assessment_type: 'signup'
            });
            
          if (studentError) {
            console.error('Error creating student record:', studentError);
          }
        }
        
        toast({
          title: "Account created successfully",
          description: "Welcome to Future Skills School!",
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: isLogin ? "Login failed" : "Signup failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto bg-white rounded-xl shadow-card p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-8 w-8 text-brand-purple" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create an Account'}</h1>
              <p className="text-muted-foreground">
                {isLogin 
                  ? 'Sign in to access your assessments and results' 
                  : 'Join Future Skills School to access our assessments'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class</Label>
                      <div className="relative">
                        <Input
                          id="className"
                          type="text"
                          placeholder="e.g. 10th"
                          value={className}
                          onChange={(e) => setClassName(e.target.value)}
                          required={!isLogin}
                          className="pl-10"
                        />
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <div className="relative">
                        <Input
                          id="section"
                          type="text"
                          placeholder="e.g. A"
                          value={section}
                          onChange={(e) => setSection(e.target.value)}
                          required={!isLogin}
                          className="pl-10"
                        />
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <div className="relative">
                      <Input
                        id="school"
                        type="text"
                        placeholder="Your school name"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        required={!isLogin}
                        className="pl-10"
                      />
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={!isLogin}
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && <a href="#" className="text-sm text-brand-purple hover:underline">Forgot password?</a>}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-purple hover:bg-brand-dark-purple"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isLogin ? 'Signing in...' : 'Creating Account...') 
                  : (isLogin ? 'Sign In' : 'Sign Up')}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-6">
                <p>
                  {isLogin 
                    ? "Don't have an account? " 
                    : "Already have an account? "}
                  <Button 
                    variant="link" 
                    className="p-0 text-brand-purple hover:underline"
                    onClick={toggleAuthMode}
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Button>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
