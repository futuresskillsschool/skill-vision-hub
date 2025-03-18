
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
        <div className="text-center mb-12 md:mb-16">
          <h3 className="animate-on-scroll text-brand-purple font-medium mb-3">Assessment Types</h3>
          <h2 className="animate-on-scroll mb-4">Explore Our <span className="text-brand-purple">Assessments</span></h2>
          <p className="animate-on-scroll text-lg text-foreground/70 max-w-2xl mx-auto">
            Discover the perfect assessment to guide your personal and professional development
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/assessment/${category.id}`}
              className={cn(
                "animate-on-scroll animate-delay group flex flex-col items-center text-center p-6 rounded-xl card-hover bg-white shadow-card",
                "border border-border/40"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "flex items-center justify-center w-14 h-14 rounded-full mb-4", 
                category.color
              )}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-purple transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-foreground/70">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssessmentCategories;
