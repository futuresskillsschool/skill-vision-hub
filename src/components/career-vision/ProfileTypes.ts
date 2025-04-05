
import { BookOpen } from 'lucide-react';
import React from 'react';

export interface CareerProfile {
  title: string;
  subtitle: string;
  icon: JSX.Element;
  description: string;
  characteristics: string[];
  careerPaths: { title: string; description: string }[];
  keySkills: string[];
  relatedInterests: string[];
  resources: { title: string; description: string }[];
}

export interface CareerVisionResultsProps {
  selectedOptions: Record<string, string>;
}

// Create a function to generate BookOpen icon element
const createBookOpenIcon = (): JSX.Element => {
  return React.createElement(BookOpen, { className: "h-8 w-8 text-white" });
};

// Define the profile data
export const RealismProfile: CareerProfile = {
  title: "Realistic",
  subtitle: "The Doer",
  icon: createBookOpenIcon(),
  description: "You enjoy working with your hands and solving concrete problems. You may prefer working outdoors or with tools, machines, or electronics.",
  characteristics: [
    "Practical and hands-on",
    "Enjoys working with tools, machines, or electronics",
    "Values concrete results and tangible outcomes",
    "Prefers action over theory",
    "Good at mechanical or technical tasks"
  ],
  careerPaths: [
    {
      title: "Engineering & Technology",
      description: "Careers involving technical problem-solving, building, and maintaining physical or digital systems."
    },
    {
      title: "Trades & Construction",
      description: "Hands-on careers requiring specialized skills and craftsmanship."
    },
    {
      title: "Agriculture & Environment",
      description: "Careers working with nature, animals, or natural resources."
    }
  ],
  keySkills: [
    "Technical problem-solving",
    "Working with tools or equipment",
    "Building and fixing things",
    "Physical coordination",
    "Mechanical aptitude"
  ],
  relatedInterests: [
    "Working with machines or tools",
    "Building or repairing things",
    "Outdoor activities",
    "Sports and physical activities",
    "Technology and gadgets"
  ],
  resources: [
    {
      title: "Technical Certification Programs",
      description: "Explore certification programs in areas like IT, manufacturing, or skilled trades."
    },
    {
      title: "Apprenticeship Opportunities",
      description: "Look into apprenticeships in fields like construction, electrical work, or manufacturing."
    },
    {
      title: "Hands-On Learning Resources",
      description: "Check out online tutorials and communities for DIY skills and technical knowledge."
    }
  ]
};

export const InvestigativeProfile: CareerProfile = {
  title: "Investigative",
  subtitle: "The Thinker",
  icon: createBookOpenIcon(),
  description: "You enjoy analyzing information and solving abstract problems. You may have a scientific or analytical mindset and enjoy research and intellectual challenges.",
  characteristics: [
    "Analytical and curious",
    "Enjoys solving complex problems",
    "Values knowledge and intellectual pursuits",
    "Prefers working with ideas and data",
    "Good at research and investigation"
  ],
  careerPaths: [
    {
      title: "Science & Research",
      description: "Careers focused on discovery, experimentation, and advancing knowledge."
    },
    {
      title: "Technology & Data",
      description: "Careers analyzing data and developing technological solutions."
    },
    {
      title: "Healthcare & Medicine",
      description: "Careers diagnosing and solving health-related problems."
    }
  ],
  keySkills: [
    "Critical thinking",
    "Research and analysis",
    "Problem-solving",
    "Attention to detail",
    "Scientific method application"
  ],
  relatedInterests: [
    "Science and mathematics",
    "Research and experimentation",
    "Solving puzzles or complex problems",
    "Reading and learning",
    "Technology and innovation"
  ],
  resources: [
    {
      title: "Research Methodology Courses",
      description: "Explore courses in research methods and data analysis."
    },
    {
      title: "Scientific Communities",
      description: "Join online forums and communities dedicated to scientific discovery."
    },
    {
      title: "Data Analysis Tools",
      description: "Learn to use tools for statistical analysis and data visualization."
    }
  ]
};

export const ArtisticProfile: CareerProfile = {
  title: "Artistic",
  subtitle: "The Creator",
  icon: createBookOpenIcon(),
  description: "You enjoy creative expression and aesthetic activities. You may have talents in visual arts, music, writing, or performance and value originality and self-expression.",
  characteristics: [
    "Creative and imaginative",
    "Values self-expression and originality",
    "Enjoys artistic activities",
    "Thinks outside the box",
    "Appreciates beauty and aesthetics"
  ],
  careerPaths: [
    {
      title: "Visual & Digital Arts",
      description: "Careers creating visual content and artistic designs."
    },
    {
      title: "Performance & Entertainment",
      description: "Careers expressing ideas through performance and media."
    },
    {
      title: "Creative Writing & Communication",
      description: "Careers crafting compelling narratives and messages."
    }
  ],
  keySkills: [
    "Creative thinking",
    "Artistic expression",
    "Design sense",
    "Originality",
    "Communication through art"
  ],
  relatedInterests: [
    "Visual arts and design",
    "Music and performance",
    "Writing and storytelling",
    "Fashion and aesthetics",
    "Digital media creation"
  ],
  resources: [
    {
      title: "Creative Portfolio Development",
      description: "Learn how to showcase your creative work effectively."
    },
    {
      title: "Arts Communities",
      description: "Connect with other creative individuals in online forums and local groups."
    },
    {
      title: "Creative Skills Courses",
      description: "Explore classes in design, writing, music, or other creative disciplines."
    }
  ]
};

export const SocialProfile: CareerProfile = {
  title: "Social",
  subtitle: "The Helper",
  icon: createBookOpenIcon(),
  description: "You enjoy working with and helping others. You may be drawn to teaching, counseling, or healthcare roles, and value making a difference in people's lives.",
  characteristics: [
    "Empathetic and supportive",
    "Enjoys helping and working with people",
    "Values positive social impact",
    "Good at communication",
    "Interested in human development"
  ],
  careerPaths: [
    {
      title: "Education & Training",
      description: "Careers focused on teaching, training, and facilitating learning."
    },
    {
      title: "Counseling & Social Services",
      description: "Careers helping people overcome challenges and improve wellbeing."
    },
    {
      title: "Healthcare & Wellness",
      description: "Careers supporting physical and mental health."
    }
  ],
  keySkills: [
    "Interpersonal communication",
    "Empathy and active listening",
    "Teaching and explaining",
    "Conflict resolution",
    "Collaboration"
  ],
  relatedInterests: [
    "Helping and assisting others",
    "Teaching and mentoring",
    "Community involvement",
    "Healthcare and wellness",
    "Psychology and human behavior"
  ],
  resources: [
    {
      title: "Communication Skills Development",
      description: "Explore resources for improving interpersonal and helping skills."
    },
    {
      title: "Volunteer Opportunities",
      description: "Find ways to gain experience helping in your community."
    },
    {
      title: "Human Services Organizations",
      description: "Connect with organizations focused on education, healthcare, and social support."
    }
  ]
};

export const EnterprisingProfile: CareerProfile = {
  title: "Enterprising",
  subtitle: "The Persuader",
  icon: createBookOpenIcon(),
  description: "You enjoy leading, persuading, and influencing others. You may be drawn to sales, management, or entrepreneurship, and value achievement and success.",
  characteristics: [
    "Persuasive and confident",
    "Enjoys leadership and influencing others",
    "Values achievement and risk-taking",
    "Goal-oriented",
    "Good at negotiation and selling"
  ],
  careerPaths: [
    {
      title: "Business & Entrepreneurship",
      description: "Careers building and managing businesses and initiatives."
    },
    {
      title: "Sales & Marketing",
      description: "Careers persuading and influencing customer decisions."
    },
    {
      title: "Leadership & Management",
      description: "Careers directing teams and organizations."
    }
  ],
  keySkills: [
    "Leadership",
    "Persuasion and negotiation",
    "Decision-making",
    "Strategic thinking",
    "Risk assessment"
  ],
  relatedInterests: [
    "Business and entrepreneurship",
    "Leadership and management",
    "Sales and marketing",
    "Public speaking",
    "Politics and influencing"
  ],
  resources: [
    {
      title: "Leadership Development Programs",
      description: "Explore programs designed to enhance your leadership capabilities."
    },
    {
      title: "Entrepreneurship Communities",
      description: "Connect with like-minded entrepreneurs and business professionals."
    },
    {
      title: "Sales and Negotiation Training",
      description: "Learn effective techniques for persuasion and deal-making."
    }
  ]
};

export const ConventionalProfile: CareerProfile = {
  title: "Conventional",
  subtitle: "The Organizer",
  icon: createBookOpenIcon(),
  description: "You enjoy organizing, managing data, and following procedures. You may be drawn to administrative, financial, or operational roles, and value accuracy and structure.",
  characteristics: [
    "Organized and detail-oriented",
    "Enjoys systematic tasks and procedures",
    "Values accuracy and reliability",
    "Methodical approach to work",
    "Good with numbers and data"
  ],
  careerPaths: [
    {
      title: "Finance & Accounting",
      description: "Careers managing financial data and systems."
    },
    {
      title: "Administration & Operations",
      description: "Careers coordinating processes and maintaining systems."
    },
    {
      title: "Information Management",
      description: "Careers organizing and maintaining data and records."
    }
  ],
  keySkills: [
    "Organization",
    "Attention to detail",
    "Data management",
    "Following procedures",
    "Numerical accuracy"
  ],
  relatedInterests: [
    "Working with numbers and data",
    "Organization and classification",
    "Computers and information systems",
    "Business operations",
    "Record-keeping and documentation"
  ],
  resources: [
    {
      title: "Data Management Certification",
      description: "Explore certification in data organization and management systems."
    },
    {
      title: "Process Improvement Methodologies",
      description: "Learn approaches to streamlining and optimizing procedures."
    },
    {
      title: "Administrative Technology Tools",
      description: "Discover software and tools to enhance organizational efficiency."
    }
  ]
};
