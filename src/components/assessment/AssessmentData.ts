
export type Assessment = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  duration: string;
  questions: number;
  benefits: string[];
  ideal: string;
  path: string;
};

export type AssessmentsData = {
  [key: string]: Assessment;
};

// Sample assessment data - this would typically come from an API or database
export const assessments: AssessmentsData = {
  'career-vision': {
    title: 'Career Vision Assessment',
    subtitle: 'Clarify Your Professional Goals',
    description: 'Our most comprehensive assessment combining RIASEC Model, Future Pathways Explorer, and EQ Navigator to give you a complete picture of your career potential. Discover your ideal career path based on your interests, future-focused skills, and emotional intelligence.',
    image: '/lovable-uploads/97b42e5a-895c-4ce7-bf16-24ceb1b64649.png',
    duration: '30 minutes',
    questions: 37,
    benefits: [
      'Identify your RIASEC profile (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)',
      'Discover emerging career clusters that match your interests and skills',
      'Measure your emotional intelligence and its impact on your career potential',
      'Get personalized career recommendations based on all three assessments',
      'Create an actionable career development plan based on comprehensive insights'
    ],
    ideal: 'Professionals at any stage who want deep insights into their career direction, recent graduates determining their path, or anyone considering a career transition who wants a comprehensive assessment.',
    path: '/assessment/career-vision'
  },
  'scct': {
    title: 'SCCT Assessment',
    subtitle: 'Social Cognitive Career Theory',
    description: 'Based on Bandura\'s Social Cognitive Theory, this assessment evaluates how your beliefs about your abilities influence your career choices. Gain insights into the relationship between your self-efficacy, outcome expectations, and career interests.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    duration: '20 minutes',
    questions: 25,
    benefits: [
      'Understand how your beliefs influence your career choices',
      'Identify barriers to career development',
      'Develop strategies to overcome career obstacles',
      'Align your self-efficacy with career aspirations',
      'Create a personalized career development roadmap'
    ],
    ideal: 'Mid-career professionals facing obstacles or doubts, individuals with limiting beliefs about their capabilities, or anyone interested in the psychology behind their career choices.',
    path: '/scct'
  },
  'riasec': {
    title: 'RIASEC Model Assessment',
    subtitle: 'Holland Code Career Test',
    description: 'Based on John Holland\'s theory, this assessment categorizes your interests and preferences into six types: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional. Discover which careers align with your personal attributes.',
    image: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b',
    duration: '20 minutes',
    questions: 12,
    benefits: [
      'Identify your primary interest areas (Holland Codes)',
      'Discover careers that match your personal attributes',
      'Understand your preferred work environment',
      'Recognize potential areas for skill development',
      'Make more informed educational and career choices'
    ],
    ideal: 'Students choosing a major, early-career professionals exploring options, or career changers wanting to find fields that match their interests and strengths.',
    path: '/riasec'
  },
  'eq-navigator': {
    title: 'EQ Navigator Assessment',
    subtitle: 'Emotional Intelligence Evaluation',
    description: 'Measure your emotional intelligence across key dimensions including self-awareness, self-regulation, motivation, empathy, and social skills. Develop the crucial soft skills needed for personal and professional success in today\'s workplace.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
    duration: '25 minutes',
    questions: 20,
    benefits: [
      'Measure your emotional intelligence across 5 key dimensions',
      'Identify strengths and growth opportunities in your EQ',
      'Develop strategies to improve your emotional intelligence',
      'Enhance your leadership and interpersonal skills',
      'Improve your ability to navigate workplace relationships'
    ],
    ideal: 'Indian high school students (ages 13-17) wanting to improve their interpersonal effectiveness, conflict resolution skills, or ability to navigate complex social dynamics.',
    path: '/eq-navigator'
  },
  'future-pathways': {
    title: 'Future Pathways Assessment',
    subtitle: 'Emerging Career Opportunities',
    description: 'Explore the intersection between your skills, interests, and emerging career fields. This forward-looking assessment helps you identify opportunities in evolving industries and prepare for the future of work.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
    duration: '25 minutes',
    questions: 18,
    benefits: [
      'Identify emerging career fields aligned with your profile',
      'Discover the skills needed for future-ready careers',
      'Understand trends reshaping your industry',
      'Create a plan to develop future-proof skills',
      'Position yourself for long-term career success'
    ],
    ideal: 'Forward-thinking professionals concerned about industry disruption, those interested in emerging fields, or anyone wanting to ensure their skills remain relevant in a changing job market.',
    path: '/future-pathways'
  }
};
