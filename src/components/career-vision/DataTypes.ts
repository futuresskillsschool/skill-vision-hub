
export interface RiasecDescription {
  title: string;
  description: string;
  careers: string;
}

export interface PathwaysDescription {
  title: string;
  description: string;
  careers: string;
}

export interface EqLevelDescription {
  title: string;
  description: string;
  tips: string;
}

export interface CareerRecommendation {
  title: string;
  match: number;
  careers: string[];
  riasecCategory?: string[];  // Added property for PDF generation
  cluster?: string;          // Added property for PDF generation
}

export interface AssessmentResults {
  riasec: Record<string, number>;
  pathways: Record<string, number>;
  eq: {
    totalScore: number;
    selfAwareness: number;
    selfRegulation: number;
    socialAwareness: number;
    relationshipManagement: number;
  };
  studentId?: string;
  assessmentType?: string;
}

export const riasecDescriptions: Record<string, RiasecDescription> = {
  R: {
    title: "Realistic",
    description: "You're practical and hands-on, enjoying work with tools, machines, and technology. You likely value concrete results and prefer straightforward tasks.",
    careers: "Engineering, Construction, Agriculture, Mechanics, Computer Hardware, Technical Support, Athletic Training"
  },
  I: {
    title: "Investigative",
    description: "You're analytical and intellectual, enjoying solving complex problems. You value knowledge, independent thinking, and scientific or mathematical challenges.",
    careers: "Science, Research, Medicine, Data Analysis, Programming, Mathematics, Technical Writing"
  },
  A: {
    title: "Artistic",
    description: "You're creative and expressive, enjoying activities that allow self-expression. You value aesthetics, innovation, and working without rigid rules.",
    careers: "Visual Arts, Performing Arts, Writing, Design, Music, Photography, Architecture, Content Creation"
  },
  S: {
    title: "Social",
    description: "You're helpful and cooperative, enjoying working with and helping people. You value being of service, relationships, and collaborative environments.",
    careers: "Teaching, Counseling, Social Work, Healthcare, Customer Service, HR, Community Services"
  },
  E: {
    title: "Enterprising",
    description: "You're persuasive and goal-oriented, enjoying leadership and influencing others. You value status, competition, and achieving objectives.",
    careers: "Management, Sales, Marketing, Law, Politics, Entrepreneurship, Real Estate"
  },
  C: {
    title: "Conventional",
    description: "You're organized and detail-oriented, enjoying structured tasks and clear expectations. You value efficiency, stability, and orderly environments.",
    careers: "Accounting, Administration, Data Management, Logistics, Banking, Quality Control, Office Management"
  }
};

export const pathwaysDescriptions: Record<string, PathwaysDescription> = {
  "tech-innovator": {
    title: "Tech Innovator & Builder",
    description: "You enjoy creating and working with technology. You're likely to thrive in roles that involve building, designing, or developing technological solutions.",
    careers: "Software Developer, AI Engineer, Robotics Engineer, Cybersecurity Specialist, IoT Developer, AR/VR Designer"
  },
  "digital-creator": {
    title: "Digital Creator & Storyteller",
    description: "You're creative and expressive in digital environments. You're likely to excel in roles that involve creating content, telling stories, or designing digital experiences.",
    careers: "Digital Content Creator, UX/UI Designer, Game Developer, Social Media Manager, Digital Marketer, Multimedia Artist"
  },
  "data-analyst": {
    title: "Data Analyst & Scientist",
    description: "You enjoy working with numbers, patterns, and information. You're likely to thrive in roles that involve analyzing data, identifying trends, and making data-driven decisions.",
    careers: "Data Scientist, Business Analyst, Machine Learning Engineer, Data Visualization Specialist, Market Research Analyst"
  },
  "entrepreneur": {
    title: "Future-Focused Entrepreneur & Leader",
    description: "You're innovative, ambitious, and forward-thinking. You're likely to excel in roles that involve leadership, creating new ventures, or driving innovation.",
    careers: "Startup Founder, Innovation Manager, Product Manager, Business Development, Growth Hacker, Venture Capitalist"
  },
  "helper": {
    title: "Tech-Enabled Helper & Problem Solver",
    description: "You care about making a positive impact and solving important problems. You're likely to thrive in roles that use technology to help others or address societal challenges.",
    careers: "Health Tech Specialist, EdTech Developer, Sustainability Analyst, Accessibility Specialist, Digital Health Coordinator"
  }
};

export const eqLevelDescriptions: Record<string, EqLevelDescription> = {
  low: {
    title: "Developing EQ",
    description: "You're at the beginning of your emotional intelligence journey. With practice, you can develop greater awareness of your emotions and those of others.",
    tips: "Practice identifying your emotions, keep a feelings journal, ask for feedback from others, and practice active listening."
  },
  medium: {
    title: "Growing EQ",
    description: "You have a good foundation in emotional intelligence. You're aware of emotions but may still be developing your ability to manage them effectively in all situations.",
    tips: "Practice empathy exercises, develop conflict resolution skills, work on stress management, and continue building self-awareness."
  },
  high: {
    title: "Advanced EQ",
    description: "You have strong emotional intelligence skills. You're likely aware of your emotions and those of others, and can navigate social situations effectively.",
    tips: "Mentor others in EQ skills, take on leadership roles that require emotional management, and continue refining your abilities in complex situations."
  }
};

export const getCareerRecommendations = (
  riasecScores: Record<string, number>, 
  pathwaysScores: Record<string, number>, 
  eqScore: number
): CareerRecommendation[] => {
  const topRiasecEntries = Object.entries(riasecScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  const topPathwaysEntries = Object.entries(pathwaysScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);
  
  const eqLevel = eqScore < 25 ? "low" : eqScore < 35 ? "medium" : "high";
  
  const recommendations = [
    {
      title: "Technology & Innovation",
      match: (
        (topRiasecEntries.some(([key]) => ["R", "I"].includes(key)) ? 30 : 0) +
        (topPathwaysEntries.some(([key]) => ["tech-innovator", "data-analyst"].includes(key)) ? 40 : 0) +
        (eqLevel === "high" ? 10 : 0)
      ),
      careers: [
        "Software Developer",
        "Data Scientist",
        "AI/ML Engineer",
        "Cybersecurity Specialist",
        "UX/UI Designer"
      ],
      // Add RIASEC categories and cluster info for PDF generation
      riasecCategory: topRiasecEntries.some(([key]) => ["R", "I"].includes(key)) 
        ? topRiasecEntries.filter(([key]) => ["R", "I"].includes(key)).map(([key]) => key) 
        : topRiasecEntries.map(([key]) => key).slice(0, 1),
      cluster: "Technology & Innovation"
    },
    {
      title: "Creative & Digital Media",
      match: (
        (topRiasecEntries.some(([key]) => ["A", "E"].includes(key)) ? 30 : 0) +
        (topPathwaysEntries.some(([key]) => ["digital-creator"].includes(key)) ? 40 : 0) +
        (eqLevel === "medium" || eqLevel === "high" ? 10 : 0)
      ),
      careers: [
        "Digital Content Creator",
        "Game Developer",
        "Social Media Manager",
        "Digital Marketer",
        "Multimedia Artist"
      ],
      // Add RIASEC categories and cluster info for PDF generation
      riasecCategory: topRiasecEntries.some(([key]) => ["A", "E"].includes(key)) 
        ? topRiasecEntries.filter(([key]) => ["A", "E"].includes(key)).map(([key]) => key) 
        : topRiasecEntries.map(([key]) => key).slice(0, 1),
      cluster: "Creative & Digital Media"
    },
    {
      title: "Business & Entrepreneurship",
      match: (
        (topRiasecEntries.some(([key]) => ["E", "C"].includes(key)) ? 30 : 0) +
        (topPathwaysEntries.some(([key]) => ["entrepreneur"].includes(key)) ? 40 : 0) +
        (eqLevel === "high" ? 20 : eqLevel === "medium" ? 10 : 0)
      ),
      careers: [
        "Startup Founder",
        "Product Manager",
        "Business Development",
        "Management Consultant",
        "Growth Strategist"
      ],
      // Add RIASEC categories and cluster info for PDF generation
      riasecCategory: topRiasecEntries.some(([key]) => ["E", "C"].includes(key)) 
        ? topRiasecEntries.filter(([key]) => ["E", "C"].includes(key)).map(([key]) => key) 
        : topRiasecEntries.map(([key]) => key).slice(0, 1),
      cluster: "Business & Entrepreneurship"
    },
    {
      title: "Education & Helping Professions",
      match: (
        (topRiasecEntries.some(([key]) => ["S", "A"].includes(key)) ? 30 : 0) +
        (topPathwaysEntries.some(([key]) => ["helper"].includes(key)) ? 40 : 0) +
        (eqLevel === "high" ? 20 : eqLevel === "medium" ? 10 : 0)
      ),
      careers: [
        "EdTech Specialist",
        "Career Counselor",
        "Online Learning Designer",
        "Mental Health App Developer",
        "Education Consultant"
      ],
      // Add RIASEC categories and cluster info for PDF generation
      riasecCategory: topRiasecEntries.some(([key]) => ["S", "A"].includes(key)) 
        ? topRiasecEntries.filter(([key]) => ["S", "A"].includes(key)).map(([key]) => key) 
        : topRiasecEntries.map(([key]) => key).slice(0, 1),
      cluster: "Education & Helping Professions"
    },
    {
      title: "Healthcare & Wellness Technology",
      match: (
        (topRiasecEntries.some(([key]) => ["S", "I"].includes(key)) ? 30 : 0) +
        (topPathwaysEntries.some(([key]) => ["helper", "tech-innovator"].includes(key)) ? 30 : 0) +
        (eqLevel === "high" ? 15 : eqLevel === "medium" ? 10 : 0)
      ),
      careers: [
        "Health Tech Developer",
        "Telemedicine Coordinator",
        "Health Data Analyst",
        "Wellness App Designer",
        "Healthcare AI Specialist"
      ],
      // Add RIASEC categories and cluster info for PDF generation
      riasecCategory: topRiasecEntries.some(([key]) => ["S", "I"].includes(key)) 
        ? topRiasecEntries.filter(([key]) => ["S", "I"].includes(key)).map(([key]) => key) 
        : topRiasecEntries.map(([key]) => key).slice(0, 1),
      cluster: "Healthcare & Wellness Technology"
    },
    {
      title: "Research & Analysis",
      match: (
        (topRiasecEntries.some(([key]) => ["I", "C"].includes(key)) ? 35 : 0) +
        (topPathwaysEntries.some(([key]) => ["data-analyst"].includes(key)) ? 35 : 0) +
        (eqLevel === "medium" || eqLevel === "high" ? 5 : 0)
      ),
      careers: [
        "Market Research Analyst",
        "Data Visualization Specialist",
        "Research Scientist",
        "Business Intelligence Analyst",
        "Economic Analyst"
      ],
      // Add RIASEC categories and cluster info for PDF generation
      riasecCategory: topRiasecEntries.some(([key]) => ["I", "C"].includes(key)) 
        ? topRiasecEntries.filter(([key]) => ["I", "C"].includes(key)).map(([key]) => key) 
        : topRiasecEntries.map(([key]) => key).slice(0, 1),
      cluster: "Research & Analysis"
    }
  ];
  
  return recommendations.sort((a, b) => b.match - a.match).slice(0, 3);
};
