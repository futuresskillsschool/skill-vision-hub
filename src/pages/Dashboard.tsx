
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  User,
  FileText,
  Settings,
  Calendar
} from 'lucide-react';
import AssessmentTable from '@/components/AssessmentTable';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { AssessmentResult } from '@/components/AssessmentTable';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form schema for user profile
const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  school: z.string().optional(),
  class: z.string().optional(),
  section: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState<any>(null);

  // Setup form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      school: '',
      class: '',
      section: '',
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setProfileLoading(true);

        // Fetch assessment results
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (assessmentError) {
          throw assessmentError;
        }

        if (assessmentData) {
          setAssessments(assessmentData as AssessmentResult[]);
        }

        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // Fetch latest student details
        const { data: studentData, error: studentError } = await supabase
          .from('student_details')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (studentError) {
          throw studentError;
        }

        // Combine profile and student details
        if (profileData || (studentData && studentData.length > 0)) {
          const latestStudentDetail = studentData?.[0];
          setStudentDetails(latestStudentDetail);

          // Set form values based on combined data
          form.reset({
            firstName: profileData?.first_name || latestStudentDetail?.name?.split(' ')[0] || '',
            lastName: profileData?.last_name || (latestStudentDetail?.name?.split(' ').slice(1).join(' ')) || '',
            email: profileData?.email || user.email || '',
            phone: profileData?.phone || '',
            school: latestStudentDetail?.school || '',
            class: latestStudentDetail?.class || '',
            section: latestStudentDetail?.section || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Failed to load data",
          description: "There was a problem loading your information. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
        setProfileLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast, form]);

  const onSubmitProfile = async (data: ProfileFormValues) => {
    if (!user) return;

    try {
      toast({
        title: "Saving changes...",
        description: "Please wait while we update your profile."
      });

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Update or create student details if school information was provided
      if (data.school || data.class || data.section) {
        // Check if we need to update existing record or create new one
        if (studentDetails?.id) {
          const { error: studentError } = await supabase
            .from('student_details')
            .update({
              name: `${data.firstName} ${data.lastName}`,
              school: data.school,
              class: data.class,
              section: data.section
            })
            .eq('id', studentDetails.id);

          if (studentError) throw studentError;
        } else {
          // Create new student detail record
          const { error: studentError } = await supabase
            .from('student_details')
            .insert({
              user_id: user.id,
              name: `${data.firstName} ${data.lastName}`,
              school: data.school || '',
              class: data.class || '',
              section: data.section || '',
              assessment_type: 'profile' // Marking this as coming from profile
            });

          if (studentError) throw studentError;
        }
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Your Personal Dashboard</h1>
                <p className="text-muted-foreground">Manage your profile and review your assessment results</p>
              </header>
            </motion.div>
            
            <Tabs defaultValue="assessments" className="space-y-8">
              <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none h-auto p-1 bg-muted/20 mb-4">
                <TabsTrigger value="assessments" className="flex items-center gap-2 py-2.5">
                  <FileText className="h-4 w-4" />
                  <span>My Assessments</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2 py-2.5">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="assessments" className="space-y-6">
                <Card className="p-6 border border-blue-100 bg-white/80 backdrop-blur-sm shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-brand-blue" />
                        Assessment History
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        Review and download your completed assessments
                      </p>
                    </div>
                    
                    {assessments.length > 0 && (
                      <Button 
                        onClick={() => navigate('/')}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                      >
                        Take New Assessment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-muted-foreground">Loading your assessments...</p>
                    </div>
                  ) : (
                    <AssessmentTable assessments={assessments} />
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="profile" className="space-y-6">
                <Card className="p-6 border border-blue-100 bg-white/80 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                      <p className="text-muted-foreground text-sm">
                        Manage your personal information and preferences
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  {profileLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-brand-blue border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-muted-foreground">Loading your profile...</p>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">First Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Your first name" 
                                    {...field} 
                                    className="border-gray-300 focus-visible:ring-brand-blue/50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Last Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Your last name" 
                                    {...field} 
                                    className="border-gray-300 focus-visible:ring-brand-blue/50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email"
                                    placeholder="Your email address" 
                                    {...field} 
                                    className="border-gray-300 focus-visible:ring-brand-blue/50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base">Phone Number</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Your phone number (optional)" 
                                    {...field} 
                                    className="border-gray-300 focus-visible:ring-brand-blue/50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="pt-4">
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-brand-blue" />
                            School Information
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                              control={form.control}
                              name="school"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base">School Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Your school name" 
                                      {...field} 
                                      className="border-gray-300 focus-visible:ring-brand-blue/50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="class"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-base">Class</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g., 10th, 11th, 12th" 
                                      {...field} 
                                      className="border-gray-300 focus-visible:ring-brand-blue/50"
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
                                  <FormLabel className="text-base">Section</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g., A, B, C" 
                                      {...field} 
                                      className="border-gray-300 focus-visible:ring-brand-blue/50"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            className="w-full md:w-auto bg-brand-blue hover:bg-brand-blue/90 text-white"
                            disabled={form.formState.isSubmitting}
                          >
                            {form.formState.isSubmitting ? "Saving..." : "Save Profile Changes"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
