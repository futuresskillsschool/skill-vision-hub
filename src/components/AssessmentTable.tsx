
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Download, FileText, Brain, Rocket, Lightbulb, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

type AssessmentResult = {
  id: string;
  user_id: string;
  assessment_type: string;
  result_data: {
    scores?: Record<string, number>;
    primary_result?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
};

const assessmentTypeInfo = {
  'RIASEC': {
    name: 'RIASEC Model Assessment',
    icon: <FileText className="h-5 w-5" />,
    color: 'bg-brand-purple',
    route: '/riasec-results'
  },
  'EQ': {
    name: 'EQ Navigator Assessment',
    icon: <Brain className="h-5 w-5" />,
    color: 'bg-brand-orange',
    route: '/eq-navigator/results'
  },
  'FUTURE': {
    name: 'Future Pathways Explorer',
    icon: <Rocket className="h-5 w-5" />,
    color: 'bg-brand-green',
    route: '/future-pathways/results'
  },
  'CAREER': {
    name: 'Career Vision Assessment',
    icon: <Lightbulb className="h-5 w-5" />,
    color: 'bg-indigo-500',
    route: '/career-vision/results'
  },
  'SCCT': {
    name: 'SCCT Assessment',
    icon: <UserRound className="h-5 w-5" />,
    color: 'bg-amber-500',
    route: '/scct/results'
  }
};

const AssessmentTable = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        // Fetch assessment results for the user
        const { data, error } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setAssessments(data || []);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError('Failed to load your assessments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [navigate]);

  const getColorClass = (type: string): string => {
    return assessmentTypeInfo[type as keyof typeof assessmentTypeInfo]?.color || 'bg-gray-500';
  };

  const getIcon = (type: string) => {
    return assessmentTypeInfo[type as keyof typeof assessmentTypeInfo]?.icon || <FileText className="h-5 w-5" />;
  };

  const getName = (type: string): string => {
    return assessmentTypeInfo[type as keyof typeof assessmentTypeInfo]?.name || type;
  };

  const getResultsRoute = (type: string): string => {
    return assessmentTypeInfo[type as keyof typeof assessmentTypeInfo]?.route || '/';
  };

  if (loading) {
    return <p className="text-center py-5">Loading your assessments...</p>;
  }

  if (error) {
    return <p className="text-center py-5 text-red-500">{error}</p>;
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">You haven't taken any assessments yet.</p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Start an Assessment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <div key={assessment.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", getColorClass(assessment.assessment_type))}>
                {getIcon(assessment.assessment_type)}
              </div>
              <div>
                <h3 className="font-medium">{getName(assessment.assessment_type)}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(assessment.created_at).toLocaleDateString()}
                </p>
                {assessment.result_data?.primary_result && (
                  <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 bg-gray-100 rounded-full">
                    {assessment.result_data.primary_result}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(getResultsRoute(assessment.assessment_type))}
              >
                View Results
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssessmentTable;
