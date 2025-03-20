
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = ctaRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const scrollToAssessments = () => {
    const assessmentSection = document.getElementById('assessment-categories');
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={ctaRef}
      className="py-16 md:py-20 bg-brand-purple text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>

      {/* Floating shapes */}
      <div className="absolute top-1/4 right-10 md:right-20 w-8 h-8 bg-white/20 rounded-lg rotate-12 animate-float" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1/4 left-10 md:left-24 w-6 h-6 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-on-scroll inline-block bg-white/20 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            Ready to discover your potential?
          </div>
          
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-6">
            Take the First Step – <br className="hidden md:block" />
            <span className="relative">
              <span className="relative z-10">Start Your Assessment Today!</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-white/20 rounded-full -z-0"></span>
            </span>
          </h2>
          
          <p className="animate-on-scroll text-white/80 mb-8 mx-auto max-w-2xl">
            Join thousands of professionals who have discovered their strengths and found clarity in their career path with our scientifically validated assessments.
          </p>
          
          <div className="animate-on-scroll flex justify-center">
            <Button 
              onClick={scrollToAssessments}
              className="bg-white text-brand-purple hover:bg-white/90 px-8 py-6 rounded-full text-base font-semibold shadow-lg group"
            >
              Explore Assessments <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
