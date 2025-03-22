import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { assessments } from '@/components/assessment/AssessmentData';
import AssessmentHeader from '@/components/assessment/AssessmentHeader';
import AssessmentContent from '@/components/assessment/AssessmentContent';
import AssessmentDetailsPanel from '@/components/assessment/AssessmentDetailsPanel';
import { useAuth } from '@/contexts/AuthContext';

const AssessmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const assessment = id ? assessments[id] : null;
  
  useEffect(() => {
    if (!assessment) {
      navigate('/not-found');
    }
    
    window.scrollTo(0, 0);
  }, [assessment, navigate]);
  
  if (!assessment) {
    return null;
  }

  const handleStartAssessment = () => {
    // Check if there's a specific path for this assessment
    if (assessment.path) {
      navigate(assessment.path);
    } else {
      // If user is logged in, go directly to assessment if possible
      // Otherwise, navigate to lead form
      if (user) {
        // Check if there's a "take" path available
        const assessmentId = id as string;
        if (assessmentId === 'career-vision') {
          navigate('/assessment/career-vision/take');
        } else if (assessmentId === 'eq-navigator') {
          navigate('/eq-navigator/take');
        } else if (assessmentId === 'future-pathways') {
          navigate('/future-pathways/take');
        } else if (assessmentId === 'riasec') {
          navigate('/riasec/take');
        } else if (assessmentId === 'scct') {
          navigate('/scct/take');
        } else {
          // Fallback to lead form if no specific take path
          navigate(`/assessment/${id}/lead-form`);
        }
      } else {
        // Not logged in - go to lead form
        navigate(`/assessment/${id}/lead-form`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Header section */}
        <section className="bg-brand-purple/5 pt-12 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <AssessmentHeader 
              title={assessment.title} 
              subtitle={assessment.subtitle} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 animate-fade-in">
              <div className="lg:col-span-3">
                <AssessmentContent
                  image={assessment.image}
                  title={assessment.title}
                  description={assessment.description}
                  benefits={assessment.benefits}
                  ideal={assessment.ideal}
                  onStartAssessment={handleStartAssessment}
                />
              </div>
              
              <div className="lg:col-span-2">
                <AssessmentDetailsPanel
                  duration={assessment.duration}
                  questions={assessment.questions}
                  onStartAssessment={handleStartAssessment}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AssessmentDetail;
