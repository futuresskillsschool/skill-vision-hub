
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
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

    const elements = heroRef.current?.querySelectorAll('.animate-on-scroll');
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
    <section ref={heroRef} className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-brand-light-purple/10 rounded-full blur-3xl"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-1/3 right-10 md:right-24 w-12 h-12 bg-brand-purple rounded-xl rotate-12 opacity-70 animate-float" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1/3 left-10 md:left-32 w-8 h-8 bg-brand-orange rounded-lg rotate-45 opacity-60 animate-float" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-on-scroll bg-brand-purple/10 text-brand-purple rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            Discover Your True Potential
          </div>
          
          <h1 className="animate-on-scroll mb-6 mx-auto max-w-3xl">
            Find Your Path And <span className="relative">
              <span className="relative z-10 text-brand-purple">Grow</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-brand-light-purple/30 rounded-full -z-0"></span>
            </span> With Assessment-Driven Insights
          </h1>
          
          <p className="animate-on-scroll text-lg md:text-xl text-foreground/80 mb-8 mx-auto max-w-2xl">
            Access our carefully crafted assessments to discover your strengths, 
            define your career path, and develop critical skills for the future of work.
          </p>
          
          <div className="animate-on-scroll flex justify-center">
            <Button 
              onClick={scrollToAssessments} 
              className="button-primary text-base group"
            >
              Explore Assessments <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
