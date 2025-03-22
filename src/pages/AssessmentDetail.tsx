
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { assessments } from '@/components/assessment/AssessmentData';
import AssessmentHeader from '@/components/assessment/AssessmentHeader';
import AssessmentContent from '@/components/assessment/AssessmentContent';
import AssessmentDetailsPanel from '@/components/assessment/AssessmentDetailsPanel';

const AssessmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
      navigate(`/assessment/${id}/lead-form`);
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
