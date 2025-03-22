
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import LeadFormHeader from '@/components/lead-form/LeadFormHeader';
import LeadFormPersonalInfo from '@/components/lead-form/LeadFormPersonalInfo';
import LeadFormSelections from '@/components/lead-form/LeadFormSelections';
import LeadFormPassword from '@/components/lead-form/LeadFormPassword';
import LeadFormTerms from '@/components/lead-form/LeadFormTerms';
import LeadFormSubmitButton from '@/components/lead-form/LeadFormSubmitButton';
import { assessmentTitles, streamOptions, interestOptions } from '@/components/lead-form/constants';
import { useLeadForm } from '@/components/lead-form/useLeadForm';

const LeadForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSelectChange,
    handleSubmit
  } = useLeadForm(id);
  
  const assessmentTitle = id ? assessmentTitles[id as keyof typeof assessmentTitles] : 'Assessment';
  
  useEffect(() => {
    // If user is already logged in, redirect to the appropriate assessment
    if (user) {
      if (id === 'career-vision') {
        navigate('/assessment/career-vision/take');
      } else if (id === 'eq-navigator') {
        navigate('/eq-navigator/take');
      } else if (id === 'future-pathways') {
        navigate('/future-pathways/take');
      } else if (id === 'riasec') {
        navigate('/riasec/take');
      } else if (id === 'scct') {
        navigate('/scct/take');
      } else {
        // Fallback to assessment detail page if no specific path
        navigate(`/assessment/${id}`);
      }
    }
  }, [user, id, navigate]);
  
  if (user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <LeadFormHeader assessmentTitle={assessmentTitle} />
            
            <div className="bg-white rounded-xl shadow-card overflow-hidden animate-fade-in">
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <LeadFormPersonalInfo
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                  
                  <LeadFormSelections
                    formData={formData}
                    errors={errors}
                    handleSelectChange={handleSelectChange}
                    streamOptions={streamOptions}
                    interestOptions={interestOptions}
                  />
                  
                  <LeadFormPassword
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                  
                  <LeadFormTerms
                    formData={formData}
                    errors={errors}
                    handleChange={handleChange}
                  />
                  
                  <LeadFormSubmitButton isSubmitting={isSubmitting} />
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
