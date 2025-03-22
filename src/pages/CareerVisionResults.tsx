import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Star, Target, Heart, BrainCircuit, Briefcase, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface RiasecDescription {
  title: string;
  description: string;
  careers: string;
}

const riasecDescriptions: Record<string, RiasecDescription> = {
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

interface PathwaysDescription {
  title: string;
  description: string;
  careers: string;
}

const pathwaysDescriptions: Record<string, PathwaysDescription> = {
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

interface EqLevelDescription {
  title: string;
  description: string;
  tips: string;
}

const eqLevelDescriptions: Record<string, EqLevelDescription> = {
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

const getCareerRecommendations = (riasecScores: Record<string, number>, pathwaysScores: Record<string, number>, eqScore: number) => {
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ];
  
  return recommendations.sort((a, b) => b.match - a.match).slice(0, 3);
};

const CareerVisionResults = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [results, setResults] = useState<any>(location.state || null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!results && user) {
      // This would be implemented if we had a function to fetch results
      // fetchUserResults('career-vision').then(setResults);
    }
  }, [results, user]);
  
  if (!results) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-6">Results Not Available</h1>
              <p className="mb-8">We couldn't find your assessment results. Please take the assessment first.</p>
              <Link to="/assessment/career-vision">
                <Button>Take the Assessment</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const { riasec, pathways, eq } = results;
  
  const riasecChartData = Object.entries(riasec).map(([category, score]) => ({
    name: riasecDescriptions[category as keyof typeof riasecDescriptions].title,
    score: score as number,
    fullMark: 10,
  }));
  
  const pathwaysChartData = Object.entries(pathways).map(([cluster, score]) => ({
    name: pathwaysDescriptions[cluster as keyof typeof pathwaysDescriptions].title.split(' ')[0],
    score: score as number,
    fullMark: 25,
  }));
  
  const eqScore = eq.totalScore;
  const eqLevel = eqScore < 25 ? "low" : eqScore < 35 ? "medium" : "high";
  const eqPercentage = (eqScore / 40) * 100;
  
  const careerRecommendations = getCareerRecommendations(riasec, pathways, eqScore);
  
  const topRiasecCategories = Object.entries(riasec)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3)
    .map(([category]) => category);
  
  const topPathwaysClusters = Object.entries(pathways)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 2)
    .map(([cluster]) => cluster);
  
  const handleDownloadPDF = async () => {
    const element = document.getElementById('results-container');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('Career-Vision-Assessment-Results.pdf');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto" id="results-container">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <Link to="/assessment/career-vision" className="inline-flex items-center text-brand-purple hover:underline mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Assessment
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold">Your Career Vision Results</h1>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleDownloadPDF} 
                className="hidden md:flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-card"
            >
              <div className="p-6 md:p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-8 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="riasec">RIASEC Profile</TabsTrigger>
                    <TabsTrigger value="pathways">Future Pathways</TabsTrigger>
                    <TabsTrigger value="eq">EQ Navigator</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card className="p-6 bg-brand-blue/5">
                        <div className="flex items-center mb-4">
                          <Star className="h-5 w-5 text-brand-blue mr-2" />
                          <h3 className="font-semibold">RIASEC Profile</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your top interests are in the {topRiasecCategories.map(c => riasecDescriptions[c as keyof typeof riasecDescriptions].title).join(", ")} areas.
                        </p>
                        <div className="h-[120px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riasecChartData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="name" />
                              <Radar name="Score" dataKey="score" fill="#9b87f5" fillOpacity={0.5} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                      
                      <Card className="p-6 bg-brand-green/5">
                        <div className="flex items-center mb-4">
                          <Target className="h-5 w-5 text-brand-green mr-2" />
                          <h3 className="font-semibold">Future Pathways</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your top career clusters are {topPathwaysClusters.map(c => pathwaysDescriptions[c as keyof typeof pathwaysDescriptions].title.split(' & ')[0]).join(" and ")}.
                        </p>
                        <div className="h-[120px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pathwaysChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <Tooltip />
                              <Bar dataKey="score" fill="#4CAF50" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Card>
                      
                      <Card className="p-6 bg-brand-red/5">
                        <div className="flex items-center mb-4">
                          <Heart className="h-5 w-5 text-brand-red mr-2" />
                          <h3 className="font-semibold">EQ Navigator</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your emotional intelligence is at the {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].title} level.
                        </p>
                        <div className="flex items-center justify-center h-[120px]">
                          <div className="relative w-32 h-32">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                              <circle 
                                className="text-gray-200" 
                                strokeWidth="10" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="40" 
                                cx="50" 
                                cy="50" 
                              />
                              <circle 
                                className="text-brand-red" 
                                strokeWidth="10" 
                                stroke="currentColor" 
                                fill="transparent" 
                                r="40" 
                                cx="50" 
                                cy="50" 
                                strokeDasharray={`${eqPercentage * 2.51} 251`}
                                strokeDashoffset="0" 
                                strokeLinecap="round" 
                              />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                              <span className="text-xl font-semibold">{eqScore}/40</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-6 mt-8">Your Top Career Recommendations</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {careerRecommendations.map((rec, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className={`p-2 text-white text-center ${
                            index === 0 ? 'bg-brand-purple' : 
                            index === 1 ? 'bg-brand-blue' : 'bg-brand-green'
                          }`}>
                            <div className="text-sm font-medium">Match: {rec.match}%</div>
                          </div>
                          <div className="p-5">
                            <h3 className="font-semibold text-lg mb-3">{rec.title}</h3>
                            <ul className="space-y-2 text-sm">
                              {rec.careers.map((career, i) => (
                                <li key={i} className="flex items-start">
                                  <span className={`inline-block w-2 h-2 rounded-full mt-1.5 mr-2 ${
                                    index === 0 ? 'bg-brand-purple' : 
                                    index === 1 ? 'bg-brand-blue' : 'bg-brand-green'
                                  }`}></span>
                                  {career}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <Card className="p-6 bg-brand-purple/5 mb-6">
                      <div className="flex items-center mb-4">
                        <Sparkles className="h-5 w-5 text-brand-purple mr-2" />
                        <h3 className="font-semibold">Your Unique Career Profile</h3>
                      </div>
                      <p className="mb-4">
                        Based on your combined assessment results, you have a unique blend of interests, aptitudes, and emotional intelligence that positions you well for careers that involve 
                        {topRiasecCategories.includes('R') && " technical problem-solving,"}
                        {topRiasecCategories.includes('I') && " analysis and investigation,"}
                        {topRiasecCategories.includes('A') && " creativity and self-expression,"}
                        {topRiasecCategories.includes('S') && " helping and working with people,"}
                        {topRiasecCategories.includes('E') && " leadership and persuasion,"}
                        {topRiasecCategories.includes('C') && " organization and attention to detail,"}
                        {topPathwaysClusters.includes('tech-innovator') && " technology innovation,"}
                        {topPathwaysClusters.includes('digital-creator') && " digital content creation,"}
                        {topPathwaysClusters.includes('data-analyst') && " data analysis,"}
                        {topPathwaysClusters.includes('entrepreneur') && " entrepreneurship,"}
                        {topPathwaysClusters.includes('helper') && " helping others through technology,"} 
                        {eqLevel === "high" && " with a strong ability to navigate social and emotional situations."}
                        {eqLevel === "medium" && " with a growing ability to navigate social and emotional situations."}
                        {eqLevel === "low" && " with opportunities to develop your emotional intelligence skills further."}
                      </p>
                      <p>
                        Continue exploring the detailed results in each tab to learn more about your specific strengths in each area.
                      </p>
                    </Card>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadPDF} 
                      className="w-full md:hidden flex items-center justify-center gap-2 mt-4"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="riasec" className="mt-0">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Your RIASEC Profile</h2>
                      <p className="text-muted-foreground">
                        The RIASEC model identifies your work-related interests and preferences across six categories: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.
                      </p>
                    </div>
                    
                    <div className="h-[300px] mb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riasecChartData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="name" />
                          <PolarRadiusAxis angle={30} domain={[0, 10]} />
                          <Radar name="Score" dataKey="score" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.6} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">Your Top RIASEC Categories</h3>
                    
                    <div className="space-y-6 mb-8">
                      {Object.entries(riasec)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 3)
                        .map(([category, score], index) => {
                          const catInfo = riasecDescriptions[category as keyof typeof riasecDescriptions];
                          return (
                            <Card key={category} className="p-6">
                              <div className="flex items-start">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                                  index === 0 ? 'bg-brand-purple/10 text-brand-purple' : 
                                  index === 1 ? 'bg-brand-blue/10 text-brand-blue' : 
                                  'bg-brand-green/10 text-brand-green'
                                }`}>
                                  <span className="text-lg font-bold">{category}</span>
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-lg">{catInfo.title}</h4>
                                    <span className="text-sm font-medium bg-gray-100 rounded-full px-3 py-1">
                                      Score: {score}/10
                                    </span>
                                  </div>
                                  
                                  <p className="text-muted-foreground mb-4">{catInfo.description}</p>
                                  
                                  <div>
                                    <h5 className="font-medium mb-2">Potential Career Paths:</h5>
                                    <p className="text-sm">{catInfo.careers}</p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pathways" className="mt-0">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Your Future Pathways Explorer Results</h2>
                      <p className="text-muted-foreground">
                        The Future Pathways Explorer identifies emerging career clusters that align with your interests and preferences, focusing on technology-enabled roles and industries of the future.
                      </p>
                    </div>
                    
                    <div className="h-[300px] mb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pathwaysChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="score" fill="#4CAF50" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-4">Your Top Future Career Clusters</h3>
                    
                    <div className="space-y-6 mb-8">
                      {Object.entries(pathways)
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 3)
                        .map(([cluster, score], index) => {
                          const clusterInfo = pathwaysDescriptions[cluster as keyof typeof pathwaysDescriptions];
                          return (
                            <Card key={cluster} className="p-6">
                              <div className="flex items-start">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                                  index === 0 ? 'bg-brand-green/10 text-brand-green' : 
                                  index === 1 ? 'bg-brand-blue/10 text-brand-blue' : 
                                  'bg-brand-purple/10 text-brand-purple'
                                }`}>
                                  {index === 0 ? (
                                    <BrainCircuit className="h-5 w-5" />
                                  ) : index === 1 ? (
                                    <Sparkles className="h-5 w-5" />
                                  ) : (
                                    <Target className="h-5 w-5" />
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-lg">{clusterInfo.title}</h4>
                                    <span className="text-sm font-medium bg-gray-100 rounded-full px-3 py-1">
                                      Score: {score}/25
                                    </span>
                                  </div>
                                  
                                  <p className="text-muted-foreground mb-4">{clusterInfo.description}</p>
                                  
                                  <div>
                                    <h5 className="font-medium mb-2">Future-Focused Careers:</h5>
                                    <p className="text-sm">{clusterInfo.careers}</p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="eq" className="mt-0">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Your EQ Navigator Results</h2>
                      <p className="text-muted-foreground">
                        The EQ Navigator measures your emotional intelligence across different dimensions, including self-awareness, empathy, social skills, and emotional management.
                      </p>
                    </div>
                    
                    <div className="flex justify-center mb-8">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle 
                            className="text-gray-200" 
                            strokeWidth="8" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="45" 
                            cx="50" 
                            cy="50" 
                          />
                          <circle 
                            className="text-brand-red" 
                            strokeWidth="8" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="45" 
                            cx="50" 
                            cy="50" 
                            strokeDasharray={`${eqPercentage * 2.83} 283`}
                            strokeDashoffset="0" 
                            strokeLinecap="round" 
                          />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold">{eqScore}</span>
                          <span className="text-sm text-muted-foreground">out of 40</span>
                        </div>
                      </div>
                    </div>
                    
                    <Card className={`p-6 ${
                      eqLevel === "high" ? "bg-green-50 border-green-200" :
                      eqLevel === "medium" ? "bg-yellow-50 border-yellow-200" :
                      "bg-red-50 border-red-200"
                    } mb-8`}>
                      <h3 className="text-xl font-semibold mb-2">
                        {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].title}
                      </h3>
                      <p className="mb-4">
                        {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].description}
                      </p>
                      <div>
                        <h4 className="font-medium mb-2">Development Tips:</h4>
                        <p className="text-sm">
                          {eqLevelDescriptions[eqLevel as keyof typeof eqLevelDescriptions].tips}
                        </p>
                      </div>
                    </Card>
                    
                    <h3 className="text-xl font-semibold mb-4">How EQ Benefits Your Career</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <Card className="p-5">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center mr-3">
                            <Briefcase className="h-4 w-4 text-brand-red" />
                          </div>
                          <h4 className="font-medium">Leadership Potential</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          High emotional intelligence correlates with stronger leadership abilities, as it enables you to understand team dynamics, motivate others, and navigate workplace challenges.
                        </p>
                      </Card>
                      
                      <Card className="p-5">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center mr-3">
                            <Briefcase className="h-4 w-4 text-brand-blue" />
                          </div>
                          <h4 className="font-medium">Team Collaboration</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          EQ helps you work effectively in teams, resolve conflicts, and build positive relationships with colleagues, clients, and stakeholders.
                        </p>
                      </Card>
                      
                      <Card className="p-5">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center mr-3">
                            <Briefcase className="h-4 w-4 text-brand-green" />
                          </div>
                          <h4 className="font-medium">Adaptability</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Strong emotional intelligence helps you adapt to change, manage stress, and remain resilient in the face of challenges and uncertainty.
                        </p>
                      </Card>
                      
                      <Card className="p-5">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center mr-3">
                            <Briefcase className="h-4 w-4 text-brand-purple" />
                          </div>
                          <h4 className="font-medium">Decision Making</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          EQ supports better decision-making by helping you understand others' perspectives and consider the emotional implications of different choices.
                        </p>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CareerVisionResults;
