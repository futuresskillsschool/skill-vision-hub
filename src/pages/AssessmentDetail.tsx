
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, Check, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Sample assessment data - this would typically come from an API or database
const assessments = {
  'career-vision': {
    title: 'Career Vision Assessment',
    subtitle: 'Clarify Your Professional Goals',
    description: 'Gain a clear understanding of your professional goals, values, and ideal work environment. This assessment helps you articulate your career vision and create a roadmap for achieving your professional aspirations.',
    image: '/lovable-uploads/97b42e5a-895c-4ce7-bf16-24ceb1b64649.png',
    duration: '15 minutes',
    questions: 25,
    users: '5.2k',
    rating: 4.8,
    benefits: [
      'Identify your core work values and motivations',
      'Clarify your long-term career goals',
      'Understand your ideal work environment',
      'Define success on your own terms',
      'Create an actionable career development plan'
    ],
    ideal: 'Professionals at any stage who want clarity on their career direction, recent graduates determining their path, or anyone considering a career transition.'
  },
  'scct': {
    title: 'SCCT Assessment',
    subtitle: 'Social Cognitive Career Theory',
    description: 'Based on Bandura\'s Social Cognitive Theory, this assessment evaluates how your beliefs about your abilities influence your career choices. Gain insights into the relationship between your self-efficacy, outcome expectations, and career interests.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    duration: '25 minutes',
    questions: 35,
    users: '1.8k',
    rating: 4.5,
    benefits: [
      'Understand how your beliefs influence your career choices',
      'Identify barriers to career development',
      'Develop strategies to overcome career obstacles',
      'Align your self-efficacy with career aspirations',
      'Create a personalized career development roadmap'
    ],
    ideal: 'Mid-career professionals facing obstacles or doubts, individuals with limiting beliefs about their capabilities, or anyone interested in the psychology behind their career choices.'
  },
  'riasec': {
    title: 'RIASEC Model Assessment',
    subtitle: 'Holland Code Career Test',
    description: 'Based on John Holland\'s theory, this assessment categorizes your interests and preferences into six types: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional. Discover which careers align with your personal attributes.',
    image: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b',
    duration: '20 minutes',
    questions: 30,
    users: '8.7k',
    rating: 4.9,
    benefits: [
      'Identify your primary interest areas (Holland Codes)',
      'Discover careers that match your personal attributes',
      'Understand your preferred work environment',
      'Recognize potential areas for skill development',
      'Make more informed educational and career choices'
    ],
    ideal: 'Students choosing a major, early-career professionals exploring options, or career changers wanting to find fields that match their interests and strengths.'
  },
  'eq-navigator': {
    title: 'EQ Navigator Assessment',
    subtitle: 'Emotional Intelligence Evaluation',
    description: 'Measure your emotional intelligence across key dimensions including self-awareness, self-regulation, motivation, empathy, and social skills. Develop the crucial soft skills needed for personal and professional success in today\'s workplace.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    duration: '25 minutes',
    questions: 10, // Updated to match our implementation
    users: '3.4k',
    rating: 4.7,
    benefits: [
      'Measure your emotional intelligence across 5 key dimensions',
      'Identify strengths and growth opportunities in your EQ',
      'Develop strategies to improve your emotional intelligence',
      'Enhance your leadership and interpersonal skills',
      'Improve your ability to navigate workplace relationships'
    ],
    ideal: 'Indian high school students (ages 13-17) wanting to improve their interpersonal effectiveness, conflict resolution skills, or ability to navigate complex social dynamics.'
  },
  'future-pathways': {
    title: 'Future Pathways Assessment',
    subtitle: 'Emerging Career Opportunities',
    description: 'Explore the intersection between your skills, interests, and emerging career fields. This forward-looking assessment helps you identify opportunities in evolving industries and prepare for the future of work.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
    duration: '30 minutes',
    questions: 45,
    users: '2.1k',
    rating: 4.6,
    benefits: [
      'Identify emerging career fields aligned with your profile',
      'Discover the skills needed for future-ready careers',
      'Understand trends reshaping your industry',
      'Create a plan to develop future-proof skills',
      'Position yourself for long-term career success'
    ],
    ideal: 'Forward-thinking professionals concerned about industry disruption, those interested in emerging fields, or anyone wanting to ensure their skills remain relevant in a changing job market.'
  }
};

const AssessmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const assessment = id ? assessments[id as keyof typeof assessments] : null;
  
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
    // For EQ Navigator, go directly to the assessment page
    if (id === 'eq-navigator') {
      navigate('/eq-navigator');
    } else {
      // For other assessments, go to the lead form
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
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center text-brand-purple hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assessments
              </Link>
              
              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
                  {assessment.title}
                </h1>
                <p className="text-xl text-foreground/70 animate-fade-in">
                  {assessment.subtitle}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 animate-fade-in">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl overflow-hidden shadow-card">
                  <img 
                    src={assessment.image} 
                    alt={assessment.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 md:p-8">
                    <p className="text-foreground/80 mb-8">
                      {assessment.description}
                    </p>
                    
                    <h3 className="text-lg font-semibold mb-4">Key Benefits:</h3>
                    <ul className="space-y-3 mb-8">
                      {assessment.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <h3 className="text-lg font-semibold mb-4">Who Is This For?</h3>
                    <p className="text-foreground/80 mb-8">
                      {assessment.ideal}
                    </p>
                    
                    <Button onClick={handleStartAssessment} className="button-primary w-full md:w-auto">
                      Start Assessment
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-card p-6 md:p-8 mb-6 border border-border/40">
                  <h3 className="text-xl font-semibold mb-6">Assessment Details</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Duration</h4>
                        <p className="text-foreground/70">{assessment.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-purple mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <div>
                        <h4 className="font-medium">Questions</h4>
                        <p className="text-foreground/70">{assessment.questions} questions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Completed By</h4>
                        <p className="text-foreground/70">{assessment.users} users</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Average Rating</h4>
                        <div className="flex items-center">
                          <span className="text-foreground/70 mr-2">{assessment.rating}/5</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(assessment.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-brand-purple/10 rounded-xl p-6 md:p-8 border border-brand-purple/20">
                  <h3 className="text-xl font-semibold mb-4">Ready to Begin?</h3>
                  <p className="text-foreground/80 mb-6">
                    Take the first step toward understanding your strengths and potential career paths.
                  </p>
                  <Button onClick={handleStartAssessment} className="button-primary w-full">
                    Start Assessment
                  </Button>
                </div>
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
