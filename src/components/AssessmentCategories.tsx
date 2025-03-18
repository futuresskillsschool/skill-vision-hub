
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 'career-vision',
    name: 'Career Vision',
    icon: '🚀',
    color: 'bg-brand-purple/10 text-brand-purple',
    description: 'Clarify your professional goals and aspirations'
  },
  {
    id: 'scct',
    name: 'SCCT',
    icon: '🧠',
    color: 'bg-brand-orange/10 text-brand-orange',
    description: 'Social Cognitive Career Theory assessment'
  },
  {
    id: 'riasec',
    name: 'RIASEC Model',
    icon: '🔎',
    color: 'bg-brand-green/10 text-brand-green',
    description: 'Identify your interests and matching careers'
  },
  {
    id: 'eq-navigator',
    name: 'EQ Navigator',
    icon: '❤️',
    color: 'bg-red-400/10 text-red-500',
    description: 'Evaluate and develop your emotional intelligence'
  },
  {
    id: 'future-pathways',
    name: 'Future Pathways',
    icon: '🌟',
    color: 'bg-brand-blue/10 text-brand-blue',
    description: 'Explore emerging career opportunities'
  }
];

const AssessmentCategories = () => {
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

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h3 className="animate-on-scroll text-brand-purple font-medium text-base mb-2">Assessment Types</h3>
          <h2 className="animate-on-scroll text-2xl md:text-3xl mb-3">Explore Our <span className="text-brand-purple">Assessments</span></h2>
          <p className="animate-on-scroll text-base text-foreground/70 max-w-2xl mx-auto">
            Discover the perfect assessment to guide your personal and professional development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/assessment/${category.id}`}
              className={cn(
                "animate-on-scroll animate-delay group flex flex-col items-center text-center p-6 md:p-8 rounded-xl card-hover bg-white shadow-card",
                "border border-border/40 h-full transition-all duration-300"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "flex items-center justify-center w-16 h-16 rounded-full mb-5", 
                category.color
              )}>
                <span className="text-3xl">{category.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-purple transition-colors">
                {category.name}
              </h3>
              <p className="text-sm md:text-base text-foreground/70 mb-5">
                {category.description}
              </p>
              <div className="mt-auto pt-4">
                <button className="text-brand-purple border border-brand-purple/30 hover:bg-brand-purple hover:text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                  Start Assessment
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssessmentCategories;
