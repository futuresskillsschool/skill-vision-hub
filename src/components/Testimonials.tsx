
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  content: string;
  author: string;
  position: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "The Career Vision assessment was eye-opening! It helped me identify my strengths and values, which led me to make a career pivot I never thought possible.",
    author: "Sarah Johnson",
    position: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    content: "I was stuck in a career rut until I took the RIASEC assessment. The insights were spot-on and gave me the clarity I needed to pursue a more fulfilling path.",
    author: "Marcus Chen",
    position: "Software Engineer",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    content: "The EQ Navigator assessment transformed how I approach leadership. I've seen measurable improvements in my team dynamics since applying what I learned.",
    author: "Priya Patel",
    position: "Team Lead",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h3 className="animate-on-scroll text-brand-purple font-medium mb-3">Testimonials</h3>
          <h2 className="animate-on-scroll mb-4">What <span className="text-brand-purple">Users Say</span> About Our Assessments</h2>
          <p className="animate-on-scroll text-foreground/70 max-w-2xl mx-auto">
            Hear from people who have transformed their careers and lives with our assessments
          </p>
        </div>

        <div className="animate-on-scroll max-w-4xl mx-auto relative">
          <div className="absolute -top-6 left-0 text-brand-purple opacity-20">
            <Quote className="h-20 w-20" />
          </div>
          
          <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 border border-border/40">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={cn(
                  "transition-opacity duration-500 flex flex-col items-center text-center",
                  activeIndex === index ? "opacity-100" : "hidden opacity-0"
                )}
              >
                <p className="text-lg md:text-xl text-foreground/80 mb-8 font-medium italic">
                  "{testimonial.content}"
                </p>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-brand-purple/20 overflow-hidden mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold text-foreground">{testimonial.author}</h4>
                  <p className="text-sm text-foreground/60">{testimonial.position}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-center items-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    activeIndex === index 
                      ? "bg-brand-purple scale-125" 
                      : "bg-brand-purple/30 hover:bg-brand-purple/50"
                  )}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            <Button 
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
