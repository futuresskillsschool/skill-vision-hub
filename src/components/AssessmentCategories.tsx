
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const assessmentCategories = [
  {
    id: 'career-vision',
    title: 'Career Vision Assessment',
    description: 'Clarify your career aspirations and align them with your values, strengths, and long-term goals.',
    icon: '🎯',
    color: 'bg-brand-blue/10',
    textColor: 'text-brand-blue',
    path: '/assessment/career-vision'
  },
  {
    id: 'scct',
    title: 'SCCT Assessment',
    description: 'Based on Social Cognitive Career Theory, explore how your beliefs and experiences shape your career choices.',
    icon: '🧠',
    color: 'bg-brand-orange/10', 
    textColor: 'text-brand-orange',
    path: '/scct'
  },
  {
    id: 'riasec',
    title: 'RIASEC Model Assessment',
    description: 'Discover your Holland Code and find career matches based on your interests, abilities, and preferences.',
    icon: '🧩',
    color: 'bg-brand-purple/10',
    textColor: 'text-brand-purple',
    path: '/riasec'
  },
  {
    id: 'eq-navigator',
    title: 'EQ Navigator Assessment',
    description: 'Measure your emotional intelligence and develop crucial soft skills for personal and professional success.',
    icon: '❤️',
    color: 'bg-brand-red/10',
    textColor: 'text-brand-red',
    path: '/eq-navigator'
  },
  {
    id: 'future-pathways',
    title: 'Future Pathways Explorer',
    description: 'Map your interests to futuristic career clusters and discover tech-focused career paths of tomorrow.',
    icon: '🚀',
    color: 'bg-brand-green/10',
    textColor: 'text-brand-green',
    path: '/future-pathways'
  }
];

const AssessmentCategories = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLearnMore = (e: React.MouseEvent, category: any) => {
    e.preventDefault();
    if (user) {
      // User is logged in, navigate to assessment landing page
      navigate(`/assessment/${category.id}`);
    } else {
      // User is not logged in, redirect to login page
      navigate('/login', { 
        state: { 
          returnPath: `/assessment/${category.id}`,
          message: 'Please log in to access the assessment' 
        } 
      });
    }
  };

  return (
    <section id="assessment-categories" className="py-16 md:py-24 bg-background/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Assessment Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our scientifically validated assessments designed to help you 
            discover your strengths and navigate your career journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessmentCategories.map((category) => (
            <Card key={category.id} className="relative overflow-hidden border-border/40 hover:border-brand-purple/40 hover:shadow-md transition-all">
              <div className="p-6">
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center text-2xl mb-4`}>
                  {category.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-6">{category.description}</p>
                
                <Button 
                  variant="outline" 
                  className="group" 
                  onClick={(e) => handleLearnMore(e, category)}
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssessmentCategories;
