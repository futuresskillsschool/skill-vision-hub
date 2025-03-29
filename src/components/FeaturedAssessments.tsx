
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Assessment {
  id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  questionCount: number;
  featured?: boolean;
  path?: string;
}

const assessments: Assessment[] = [
  {
    id: 'career-vision',
    title: 'Career Vision Assessment',
    description: 'Clarify your professional goals and map your ideal career path with our comprehensive vision assessment.',
    image: '/lovable-uploads/97b42e5a-895c-4ce7-bf16-24ceb1b64649.png',
    time: '15 min',
    questionCount: 15,
    featured: true,
    path: '/assessment/career-vision'
  },
  {
    id: 'riasec',
    title: 'RIASEC Model Assessment',
    description: 'Discover your primary interest areas and matching career options based on the proven Holland Code framework.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    time: '20 min',
    questionCount: 12,
    path: '/riasec'
  },
  {
    id: 'eq-navigator',
    title: 'EQ Navigator Assessment',
    description: 'Measure your emotional intelligence and develop crucial soft skills for personal and professional success.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    time: '25 min',
    questionCount: 20,
    path: '/eq-navigator'
  },
  {
    id: 'future-pathways',
    title: 'Future Pathways Assessment',
    description: 'Explore emerging career opportunities and identify the skills you need to thrive in the future of work.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
    time: '25 min',
    questionCount: 18,
    path: '/future-pathways'
  },
  {
    id: 'scct',
    title: 'SCCT Assessment',
    description: 'Apply Social Cognitive Career Theory to understand how your beliefs influence your professional choices.',
    image: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885',
    time: '20 min',
    questionCount: 25,
    path: '/scct'
  }
];

const FeaturedAssessments = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Find the featured assessment or use the first one
  const featuredAssessment = assessments.find(a => a.featured) || assessments[0];
  
  // Filter out the featured assessment from the regular grid
  const regularAssessments = assessments.filter(a => a.id !== featuredAssessment.id).slice(0, 4);
  
  const handleAssessmentClick = (e: React.MouseEvent, assessment: Assessment) => {
    e.preventDefault();
    if (user) {
      // User is logged in, navigate to assessment path
      navigate(assessment.path || `/assessment/${assessment.id}`);
    } else {
      // User is not logged in, redirect to login
      navigate('/login');
    }
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h3 className="animate-on-scroll text-brand-purple font-medium mb-3">Our Assessments</h3>
            <h2 className="animate-on-scroll mb-4">Most Popular <span className="text-brand-purple">Assessments</span></h2>
          </div>
          <div 
            className="animate-on-scroll mt-4 md:mt-0 cursor-pointer"
            onClick={(e) => handleAssessmentClick(e, assessments[0])}
          >
            <Button variant="outline" className="group">
              View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Featured Assessment (Larger Card) */}
        <div className="animate-on-scroll mb-12 overflow-hidden">
          <div 
            className="group relative flex flex-col md:flex-row bg-white rounded-2xl shadow-card overflow-hidden card-hover border border-border/40 cursor-pointer"
            onClick={(e) => handleAssessmentClick(e, featuredAssessment)}
          >
            <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
              <img 
                src={featuredAssessment.image} 
                alt={featuredAssessment.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="md:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="bg-brand-purple/10 text-brand-purple rounded-full px-3 py-1 text-sm font-medium inline-block mb-4 w-fit">
                Featured Assessment
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-brand-purple transition-colors">
                {featuredAssessment.title}
              </h3>
              <p className="text-foreground/70 mb-6 flex-grow">
                {featuredAssessment.description}
              </p>
              <div className="flex items-center text-sm text-foreground/60 mb-6">
                <div className="flex items-center mr-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{featuredAssessment.time}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{featuredAssessment.questionCount} questions</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button className="button-primary w-full sm:w-auto">Start Assessment</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Regular Assessment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regularAssessments.map((assessment, index) => (
            <div 
              key={assessment.id}
              className={cn(
                "animate-on-scroll group flex flex-col bg-white rounded-xl overflow-hidden shadow-card card-hover border border-border/40 cursor-pointer",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={(e) => handleAssessmentClick(e, assessment)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={assessment.image} 
                  alt={assessment.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold mb-2 group-hover:text-brand-purple transition-colors line-clamp-1">
                  {assessment.title}
                </h3>
                <p className="text-foreground/70 text-sm mb-4 line-clamp-2 flex-grow">
                  {assessment.description}
                </p>
                <div className="flex items-center justify-between text-xs text-foreground/60 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{assessment.time}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    <span>{assessment.questionCount} questions</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" className="w-full text-brand-purple border-brand-purple/30 hover:bg-brand-purple/5 hover:border-brand-purple">
                    Take Assessment
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAssessments;
