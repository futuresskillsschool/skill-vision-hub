
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RIASECResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;
  
  useEffect(() => {
    if (!results) {
      navigate('/assessment/riasec');
      return;
    }
    
    window.scrollTo(0, 0);
  }, [results, navigate]);
  
  if (!results) {
    return null;
  }
  
  const { riasecScores } = results;
  
  const typeDescriptions: Record<string, { title: string, description: string, careers: string[] }> = {
    R: {
      title: "Realistic (Doer)",
      description: "You enjoy working with your hands, tools, machines, or animals. You prefer activities that are practical, physical, and concrete rather than abstract or theoretical.",
      careers: ["Engineer", "Mechanic", "Chef", "Carpenter", "Electrician", "Pilot", "Athlete", "Farmer"]
    },
    I: {
      title: "Investigative (Thinker)",
      description: "You like to observe, learn, investigate, analyze, evaluate, or solve problems. You prefer activities that involve thinking, organizing, and understanding rather than feeling or persuading.",
      careers: ["Scientist", "Doctor", "Researcher", "Computer Programmer", "Mathematician", "Detective", "Analyst", "Engineer"]
    },
    A: {
      title: "Artistic (Creator)",
      description: "You're creative, intuitive, and original. You prefer activities that are unstructured and allow for self-expression, creativity, and the use of imagination.",
      careers: ["Artist", "Writer", "Musician", "Actor", "Designer", "Photographer", "Architect", "Fashion Designer"]
    },
    S: {
      title: "Social (Helper)",
      description: "You enjoy working with and helping people. You prefer activities that involve interacting with others, teaching, or helping them improve their well-being.",
      careers: ["Teacher", "Counselor", "Nurse", "Social Worker", "Therapist", "Human Resources", "Coach", "Customer Service"]
    },
    E: {
      title: "Enterprising (Persuader)",
      description: "You like working with people to lead, persuade, or manage them for organizational goals or economic gain. You prefer activities that involve starting up and carrying out projects.",
      careers: ["Manager", "Entrepreneur", "Lawyer", "Salesperson", "Marketing Executive", "Real Estate Agent", "Politician", "Business Owner"]
    },
    C: {
      title: "Conventional (Organizer)",
      description: "You enjoy working with data, details, and processes in a structured way. You prefer activities that involve organizing, following procedures, and working with numbers or records.",
      careers: ["Accountant", "Administrative Assistant", "Financial Analyst", "Banker", "Editor", "Librarian", "Database Manager", "Office Manager"]
    }
  };
  
  const getPrimaryTypes = () => {
    const scores = Object.entries(riasecScores);
    scores.sort((a, b) => Number(b[1]) - Number(a[1]));
    return scores.slice(0, 3).map(item => item[0]);
  };
  
  const getCareerSuggestions = () => {
    const primaryTypes = getPrimaryTypes();
    let careers: string[] = [];
    
    primaryTypes.forEach(type => {
      careers = [...careers, ...typeDescriptions[type].careers.slice(0, 3)];
    });
    
    return [...new Set(careers)].slice(0, 10); // Remove duplicates and limit to 10
  };
  
  const primaryTypes = getPrimaryTypes();
  const careerSuggestions = getCareerSuggestions();
  
  const handleDownloadPDF = async () => {
    const element = document.getElementById('results-content');
    if (!element) return;
    
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('riasec-assessment-results.pdf');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/dashboard" className="inline-flex items-center text-brand-purple hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
              
              <div className="flex justify-between items-center mt-4">
                <h1 className="text-2xl md:text-3xl font-bold">Your RIASEC Assessment Results</h1>
                
                <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
            
            <div id="results-content">
              <Card className="mb-8 p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">Your Holland Code Profile</h2>
                <p className="text-foreground/80 mb-6">
                  Based on your responses, your primary Holland Code types are:
                </p>
                
                <div className="mb-6">
                  {primaryTypes.map((type, index) => (
                    <div key={type} className="mb-6">
                      <h3 className="text-lg font-medium mb-2 text-brand-purple">
                        {index + 1}. {typeDescriptions[type].title}
                      </h3>
                      <p className="text-foreground/80 mb-2">{typeDescriptions[type].description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-3">Your RIASEC Score Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(riasecScores).map(([type, score]) => (
                      <div key={type} className="flex items-center">
                        <span className="w-32 font-medium">{typeDescriptions[type].title.split(" ")[0]}:</span>
                        <div className="flex-grow flex items-center">
                          <div className="relative w-full bg-gray-200 h-4 rounded-full">
                            <div 
                              className="absolute top-0 left-0 h-4 rounded-full bg-brand-purple"
                              style={{ width: `${(Number(score) / 12) * 100}%` }}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm">{String(score)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              <Card className="mb-8 p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">Potential Career Matches</h2>
                <p className="text-foreground/80 mb-6">
                  These career paths may align well with your Holland Code profile:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {careerSuggestions.map((career, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                      <span>{career}</span>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="mb-8 p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">What To Do Next</h2>
                <p className="text-foreground/80 mb-6">
                  Now that you have your RIASEC results, here are some suggested next steps:
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                    <span>Research careers that match your profile in more depth</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                    <span>Talk to a career counselor about your results</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                    <span>Explore educational paths that lead to careers matching your interests</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-purple mr-3 mt-0.5" />
                    <span>Try job shadowing or internships in fields that interest you</span>
                  </li>
                </ul>
              </Card>
            </div>
            
            <div className="flex justify-center">
              <Button asChild className="button-primary">
                <Link to="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RIASECResults;
