
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  storeAssessmentResult: (assessmentType: string, resultData: any) => Promise<void>;
  getUserProfile: () => Promise<any>;
  updateUserProfile: (profileData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for active session on mount
    const getSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const storeAssessmentResult = async (assessmentType: string, resultData: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to save results.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('assessment_results')
        .insert({
          user_id: user.id,
          assessment_type: assessmentType,
          result_data: resultData
        });

      if (error) throw error;

      toast({
        title: "Results saved",
        description: "Your assessment results have been saved successfully.",
      });
    } catch (error: any) {
      console.error('Error storing assessment result:', error);
      toast({
        title: "Error saving results",
        description: error.message || "There was a problem saving your results.",
        variant: "destructive",
      });
    }
  };

  const getUserProfile = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const updateUserProfile = async (profileData: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message || "There was a problem updating your profile.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    storeAssessmentResult,
    getUserProfile,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
