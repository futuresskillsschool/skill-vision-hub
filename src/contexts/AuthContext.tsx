
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Define types for user and session
type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

type Session = {
  user: User | null;
};

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
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSession({ user: parsedUser });
    }
    setIsLoading(false);
  }, []);

  const signOut = async () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('assessmentResults');
      setUser(null);
      setSession(null);
      
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
      // Get existing results from localStorage
      const storedResults = localStorage.getItem('assessmentResults');
      let assessmentResults = storedResults ? JSON.parse(storedResults) : {};
      
      // Update or create the assessment result
      assessmentResults[assessmentType] = {
        ...resultData,
        updatedAt: new Date().toISOString()
      };
      
      // Store back in localStorage
      localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
      
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
      // Get profile data from localStorage
      const storedProfile = localStorage.getItem('userProfile');
      return storedProfile ? JSON.parse(storedProfile) : null;
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
      // Save profile data to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profileData));

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
