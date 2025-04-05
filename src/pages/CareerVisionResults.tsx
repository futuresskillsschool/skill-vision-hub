
import {
  ArrowLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Home,
  ClipboardList,
  BookOpen
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import {
  calculateRealism,
  calculateInvestigative,
  calculateArtistic,
  calculateSocial,
  calculateEnterprising,
  calculateConventional,
} from '@/components/career-vision/Helper';
import {
  RealismProfile,
  InvestigativeProfile,
  ArtisticProfile,
  SocialProfile,
  EnterprisingProfile,
  ConventionalProfile,
  CareerProfile,
  CareerVisionResultsProps,
} from '@/components/career-vision/ProfileTypes';
import { toast } from 'sonner';

const CareerVisionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [dominantProfile, setDominantProfile] = useState<CareerProfile | null>(null);
  const [dominantScore, setDominantScore] = useState<number>(0);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const state = location.state as CareerVisionResultsProps | null;

    if (!state) {
      navigate('/assessment/career-vision');
      return;
    }

    const { selectedOptions } = state;

    const realismScore = calculateRealism(selectedOptions);
    const investigativeScore = calculateInvestigative(selectedOptions);
    const artisticScore = calculateArtistic(selectedOptions);
    const socialScore = calculateSocial(selectedOptions);
    const enterprisingScore = calculateEnterprising(selectedOptions);
    const conventionalScore = calculateConventional(selectedOptions);

    let dominant = 'realism';
    let score = realismScore;

    if (investigativeScore > score) {
      dominant = 'investigative';
      score = investigativeScore;
    }

    if (artisticScore > score) {
      dominant = 'artistic';
      score = artisticScore;
    }

    if (socialScore > score) {
      dominant = 'social';
      score = socialScore;
    }

    if (enterprisingScore > score) {
      dominant = 'enterprising';
      score = enterprisingScore;
    }

    if (conventionalScore > score) {
      dominant = 'conventional';
      score = conventionalScore;
    }

    setDominantScore(score);

    switch (dominant) {
      case 'realism':
        setDominantProfile(RealismProfile);
        break;
      case 'investigative':
        setDominantProfile(InvestigativeProfile);
        break;
      case 'artistic':
        setDominantProfile(ArtisticProfile);
        break;
      case 'social':
        setDominantProfile(SocialProfile);
        break;
      case 'enterprising':
        setDominantProfile(EnterprisingProfile);
        break;
      case 'conventional':
        setDominantProfile(ConventionalProfile);
        break;
      default:
        setDominantProfile(RealismProfile);
    }

    setIsLoading(false);
  }, [location, navigate, user]);

  const downloadAsPDF = async () => {
    setIsDownloadingPDF(true);
    toast.info("Feature coming soon!");
    setIsDownloadingPDF(false);
  };

  if (isLoading || !dominantProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-blue-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-t-purple-400 border-r-purple-300/30 border-b-purple-300/10 border-l-purple-300/30 rounded-full animate-spin"></div>
            <p className="text-purple-600 font-medium">Loading your results...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mb-4 text-purple-500 hover:text-purple-600 -ml-3"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">Your Career Vision Results</h1>
                <p className="text-gray-600 max-w-2xl">
                  Based on your selections, your dominant career profile is:
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={downloadAsPDF}
                  variant="outline"
                  className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                  disabled={isDownloadingPDF}
                >
                  {isDownloadingPDF ? (
                    <>
                      <div className="h-4 w-4 border-2 border-purple-600 border-r-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-xl p-8 mb-8 text-center relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 bg-white/20 backdrop-blur-sm"
                >
                  {dominantProfile.icon}
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-bold mb-2">{dominantProfile.title}</h1>
                <p className="text-xl text-white/90 mb-6">{dominantProfile.subtitle}</p>

                <div className="text-left max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold mb-3">Key Characteristics:</h3>
                  <ul className="list-disc pl-5 text-white/80">
                    {dominantProfile.characteristics.map((characteristic: string, index: number) => (
                      <li key={index}>{characteristic}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white rounded-xl p-8 shadow-md mb-8 border border-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    {dominantProfile.icon}
                  </div>
                  Exploring Your Career Path
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">{dominantProfile.description}</p>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Potential Career Paths</h3>

                  <div className="space-y-6">
                    {dominantProfile.careerPaths.map((path: any, index: number) => (
                      <Card key={index} className="p-5 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-gray-800 font-semibold">{path.title}</h4>
                          <Button variant="ghost" size="sm">
                            Learn More <ExternalLink className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                        <p className="text-gray-600">{path.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white rounded-xl p-8 shadow-md mb-8 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <ChevronRight className="h-5 w-5 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Skills and Interests</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Key Skills</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                      {dominantProfile.keySkills.map((skill: string, index: number) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">Related Interests</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                      {dominantProfile.relatedInterests.map((interest: string, index: number) => (
                        <li key={index}>{interest}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white rounded-xl p-8 shadow-md mb-8 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Resources for Further Exploration</h2>
                </div>

                <div className="space-y-4">
                  {dominantProfile.resources.map((resource: any, index: number) => (
                    <Card key={index} className="p-5 border border-gray-200 hover:shadow-md transition-shadow">
                      <h4 className="text-gray-800 font-semibold">{resource.title}</h4>
                      <p className="text-gray-600">{resource.description}</p>
                      <Button variant="link" className="mt-3">
                        Learn More
                      </Button>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 mb-16">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>

              <Button
                onClick={() => navigate('/assessment/career-vision')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Take Another Assessment
              </Button>

              <Button
                onClick={() => navigate('/assessment/categories')}
                variant="outline"
                className="flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <ClipboardList className="h-4 w-4" />
                Back to Assessments
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareerVisionResults;
