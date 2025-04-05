
import {
  useEffect,
  useState,
  useRef,
} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Heart,
  ArrowRight,
  Brain,
  BookOpen,
  PenTool,
  Home,
  Download,
  Check,
  Award,
  ArrowLeft,
  Info,
  User,
  School,
  ZoomIn,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FuturePathwaysResultsProps {
  totalScore: number;
  selectedOptions: string[];
  downloadPdf?: boolean;
  studentId?: string;
  fromDashboard?: boolean;
  questions: Array<{
    id: number;
    scenario: string;
    options: Array<{
      id: string;
      text: string;
      score: number;
    }>;
  }>;
}

interface FuturePathwaysProfile {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  strengthsIntro: string;
  strengths: string[];
  growthIntro: string;
  growthAreas: Array<{
    area: string;
    tip: string;
  }>;
  resources: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
}

interface StudentDetails {
  id: string;
  name: string;
  class: string;
  section: string;
  school: string;
}

const profiles: Record<string, FuturePathwaysProfile> = {
  "tech-innovator": {
    title: "Tech Innovator",
    subtitle: "Future Pathways in Technology",
    description:
      "You have a strong inclination towards technology and innovation! You're likely curious about how things work, enjoy problem-solving, and are excited about the possibilities of future technologies.",
    icon: <Sparkles className="h-8 w-8" />,
    color: "bg-purple-400 text-white",
    strengthsIntro: "Here's what you're great at:",
    strengths: [
      "Understanding and processing your emotions in healthy ways",
      "Showing empathy and supporting others during difficult times",
      "Handling conflicts constructively and seeking win-win solutions",
      "Taking feedback well and using it for personal growth",
    ],
    growthIntro: "Even with strong EQ, there's always room to grow:",
    growthAreas: [
      {
        area: "Continue developing active listening skills",
        tip: "Practice being fully present in conversations without planning what to say next",
      },
      {
        area: "Build resilience for more challenging situations",
        tip: "Reflect on past challenges and identify what helped you overcome them",
      },
    ],
    resources: [
      {
        title: "Mindfulness Practices",
        description: "Daily meditation can further enhance your emotional awareness",
        icon: <Brain />,
      },
      {
        title: "Advanced Empathy Techniques",
        description: "Learn deeper approaches to understanding complex emotions",
        icon: <Heart />,
      },
      {
        title: "Leadership & Emotional Intelligence",
        description: "Develop skills to help others with their emotional growth",
        icon: <BookOpen />,
      },
    ],
  },
  "creative-artist": {
    title: "Creative Artist",
    subtitle: "Future Pathways in Arts and Design",
    description:
      "You have a flair for creativity and artistic expression! You're likely drawn to visual arts, music, writing, or other creative outlets, and you enjoy expressing yourself in unique and innovative ways.",
    icon: <PenTool className="h-8 w-8" />,
    color: "bg-blue-300 text-white",
    strengthsIntro: "Your notable strengths:",
    strengths: [
      "Recognizing your own emotions in many situations",
      "Showing empathy in certain contexts",
      "Working toward better communication during conflicts",
      "Being open to feedback and personal growth",
    ],
    growthIntro: "Areas you can focus on developing:",
    growthAreas: [
      {
        area: "Emotional regulation during stress",
        tip: "Practice taking deep breaths and naming your emotions when feeling overwhelmed",
      },
      {
        area: "Active listening skills",
        tip: "Try to truly understand others before responding by asking clarifying questions",
      },
      {
        area: "Conflict resolution approaches",
        tip: "Focus on finding win-win solutions rather than proving your point",
      },
    ],
    resources: [
      {
        title: "Emotional Awareness Journal",
        description: "Track your emotions daily to identify patterns and triggers",
        icon: <PenTool />,
      },
      {
        title: "Basic Mindfulness Practices",
        description: "Simple meditation exercises to increase emotional awareness",
        icon: <Brain />,
      },
      {
        title: "Communication Skills Development",
        description:
        "Learn techniques for more effective and empathetic conversations",
        icon: <BookOpen />,
      },
    ],
  },
  "social-innovator": {
    title: "Social Innovator",
    subtitle: "Future Pathways in Social Sciences",
    description:
      "You have a passion for helping others and making a positive impact on society! You're likely interested in social issues, enjoy working with people, and are driven to create meaningful change in the world.",
    icon: <Heart className="h-8 w-8" />,
    color: "bg-yellow-300 text-white",
    strengthsIntro: "Here's what you can build on:",
    strengths: [
      "Your willingness to learn and grow emotionally",
      "Moments when you do recognize your own emotions",
      "Times when you've shown care for others",
    ],
    growthIntro: "Focus areas for your development:",
    growthAreas: [
      {
        area: "Emotional self-awareness",
        tip: "Start by simply naming your emotions throughout the day - happy, sad, frustrated, etc.",
      },
      {
        area: "Recognizing emotions in others",
        tip: "Pay attention to facial expressions, tone of voice, and body language when talking to friends",
      },
      {
        area: "Healthy emotional expression",
        tip: "Find safe ways to express feelings like journaling, talking to trusted people, or creative activities",
      },
      {
        area: "Developing empathy",
        tip: 'Practice asking yourself "How might they be feeling right now?" when interacting with others',
      },
    ],
    resources: [
      {
        title: "Emotions Vocabulary Builder",
        description: "Learn to identify and name a wider range of feelings",
        icon: <BookOpen />,
      },
      {
        title: "Basic Emotion Regulation",
        description: "Simple techniques to help manage strong feelings",
        icon: <Brain />,
      },
      {
        title: "Beginner's Guide to Empathy",
        description: "Easy exercises to practice seeing others' perspectives",
        icon: <Heart />,
      },
    ],
  },
  "business-leader": {
    title: "Business Leader",
    subtitle: "Future Pathways in Business and Entrepreneurship",
    description:
      "You have a knack for leadership and business! You're likely ambitious, enjoy taking initiative, and are driven to create and manage successful ventures.",
    icon: <Brain className="h-8 w-8" />,
    color: "bg-green-300 text-white",
    strengthsIntro: "Remember that everyone has EQ strengths:",
    strengths: [
      "Taking this assessment shows your interest in self-improvement",
      "You have the capacity to develop your emotional intelligence",
      "Everyone starts somewhere - this is your beginning",
    ],
    growthIntro: "Key areas to focus on with support:",
    growthAreas: [
      {
        area: "Identifying basic emotions",
        tip: "Start with recognizing when you feel happy, sad, angry, or scared",
      },
      {
        area: "Finding healthy ways to express feelings",
        tip: "Talk to a trusted adult or friend about your emotions instead of keeping them inside",
      },
      {
        area: "Understanding how your actions affect others",
        tip: 'Before reacting, pause and ask "How might this make the other person feel?"',
      },
      {
        area: "Managing strong emotions",
        tip: 'Learn the "stop and breathe" technique when you feel overwhelmed',
      },
    ],
    resources: [
      {
        title: "Teen Emotional Support Resources",
        description: "Find helpful resources designed specifically for young people",
        icon: <BookOpen />,
      },
      {
        title: "Basic Emotions Guide",
        description: "Learn to recognize and name your feelings",
        icon: <Heart />,
      },
      {
        title: "Talking to Adults About Feelings",
        description:
        "Tips for having conversations about emotions with parents, teachers, or counselors",
        icon: <PenTool />,
      },
    ],
  },
};

const FuturePathwaysResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FuturePathwaysProfile | null>(null);
  const [scoreRange, setScoreRange] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(
    null
  );
  const { user } = useAuth();
  const [results, setResults] = useState<any | null>(location.state || null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const state = location.state as FuturePathwaysResultsProps | null;

    if (!state || state.totalScore === undefined) {
      navigate("/assessment/future-pathways");
      return;
    }

    const { totalScore } = state;
    let selectedProfile: FuturePathwaysProfile;
    let range: string;

    if (totalScore >= 32) {
      selectedProfile = profiles["tech-innovator"];
      range = "32-40";
      setScoreRange("32-40");
    } else if (totalScore >= 24) {
      selectedProfile = profiles["creative-artist"];
      range = "24-31";
      setScoreRange("24-31");
    } else if (totalScore >= 16) {
      selectedProfile = profiles["social-innovator"];
      range = "16-23";
      setScoreRange("16-23");
    } else {
      selectedProfile = profiles["business-leader"];
      range = "Below 16";
      setScoreRange("Below 16");
    }

    setProfile(selectedProfile);
    setIsLoading(false);

    if (state.downloadPdf) {
      setTimeout(() => {
        downloadAsPDF();
      }, 1500);
    }

    const fetchStudentDetails = async () => {
      if (results && results.studentId) {
        try {
          const { data, error } = await supabase
            .from("student_details")
            .select("*")
            .eq("id", results.studentId)
            .single();

          if (error) {
            console.error("Error fetching student details:", error);
            return;
          }

          if (data) {
            setStudentDetails(data as StudentDetails);
          }
        } catch (error) {
          console.error("Error in student details fetch:", error);
        }
      }
    };

    fetchStudentDetails();
  }, [location, navigate, user, results]);

  const calculatePercentage = (totalScore: number) => {
    return Math.round((totalScore / 40) * 100);
  };

  const downloadAsPDF = async () => {
    if (!reportRef.current || isGeneratingPDF) return;

    try {
      setIsGeneratingPDF(true);
      toast.info("Preparing your PDF. This may take a moment...");

      // Create a new jsPDF instance with portrait orientation
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // Create header
      pdf.setFillColor(103, 58, 183); // Purple header
      pdf.rect(0, 0, pageWidth, 50, "F");

      // Add slight gradient to header
      for (let i = 0; i < 50; i++) {
        const alpha = 0.03 - i * 0.0006;
        pdf.setFillColor(255, 255, 255, alpha);
        pdf.rect(0, i, pageWidth, 1, "F");
      }

      // Add title
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.text("Future Pathways Assessment", pageWidth / 2, 25, {
        align: "center",
      });

      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.text("Career Exploration Profile", pageWidth / 2, 35, {
        align: "center",
      });

      // Add decorative line
      pdf.setDrawColor(255, 255, 255, 0.5);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 20, 42, pageWidth - margin - 20, 42);

      // Add score section
      pdf.setFillColor(245, 245, 245);
      pdf.roundedRect(margin, 60, contentWidth, 50, 3, 3, "F");

      // Add score details
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Career Assessment Results", margin + 10, 75);

      // Add score chart
      const scoreData = location.state as FuturePathwaysResultsProps;
      const scorePercentage = calculatePercentage(scoreData.totalScore);

      // Draw score circle
      const circleX = margin + 35;
      const circleY = 95;
      const circleRadius = 15;

      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(1);
      pdf.circle(circleX, circleY, circleRadius, "S");

      // Draw progress arc (score percentage)
      const startAngle = -90 * (Math.PI / 180); // Start from top
      const endAngle = startAngle + (scorePercentage / 100) * 2 * Math.PI;

      pdf.setDrawColor(103, 58, 183);
      pdf.setLineWidth(3);

      // Draw arc manually with small line segments
      const segments = 60;
      const angleIncrement = (endAngle - startAngle) / segments;

      for (let i = 0; i < segments; i++) {
        const angle1 = startAngle + i * angleIncrement;
        const angle2 = startAngle + (i + 1) * angleIncrement;

        const x1 = circleX + Math.cos(angle1) * circleRadius;
        const y1 = circleY + Math.sin(angle1) * circleRadius;
        const x2 = circleX + Math.cos(angle2) * circleRadius;
        const y2 = circleY + Math.sin(angle2) * circleRadius;

        pdf.line(x1, y1, x2, y2);
      }

      // Add score text inside circle
      pdf.setTextColor(103, 58, 183);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${scorePercentage}%`, circleX, circleY + 1, {
        align: "center",
      });

      pdf.setFontSize(6);
      pdf.text("Score", circleX, circleY + 6, { align: "center" });

      // Add score details boxes
      const boxWidth = 30;
      const boxY = 85;

      // Your Score box
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(margin + 65, boxY, boxWidth, 20, 2, 2, "F");
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${scoreData.totalScore}`, margin + 65 + boxWidth / 2, boxY + 10, {
        align: "center",
      });
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "normal");
      pdf.text("Your Score", margin + 65 + boxWidth / 2, boxY + 15, {
        align: "center",
      });

      // Max Score box
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(margin + 65 + boxWidth + 5, boxY, boxWidth, 20, 2, 2, "F");
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        "40",
        margin + 65 + boxWidth + 5 + boxWidth / 2,
        boxY + 10,
        { align: "center" }
      );
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "Max Score",
        margin + 65 + boxWidth + 5 + boxWidth / 2,
        boxY + 15,
        { align: "center" }
      );

      // Range box
      pdf.setFillColor(250, 250, 250);
      pdf.roundedRect(
        margin + 65 + (boxWidth + 5) * 2,
        boxY,
        boxWidth,
        20,
        2,
        2,
        "F"
      );
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        scoreRange,
        margin + 65 + (boxWidth + 5) * 2 + boxWidth / 2,
        boxY + 10,
        { align: "center" }
      );
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "Range",
        margin + 65 + (boxWidth + 5) * 2 + boxWidth / 2,
        boxY + 15,
        { align: "center" }
      );

      // Add profile title
      if (profile) {
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${profile.title}`, pageWidth / 2, 125, { align: "center" });

        pdf.setTextColor(120, 120, 120);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(`${profile.subtitle}`, pageWidth / 2, 135, {
          align: "center",
        });

        // Add profile description
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(10);
        const splitDescription = pdf.splitTextToSize(
          profile.description,
          contentWidth - 20
        );
        pdf.text(splitDescription, margin + 10, 150);
      }

      // Add student info if available
      if (studentDetails) {
        const infoY = 180;
        pdf.setFillColor(250, 250, 250);
        pdf.roundedRect(margin, infoY, contentWidth, 50, 3, 3, "F");

        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Student Profile", margin + 10, infoY + 15);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        const infoX = margin + 15;
        pdf.setTextColor(120, 120, 120);
        pdf.text("Name:", infoX, infoY + 25);
        pdf.text("Class & Section:", infoX, infoY + 35);
        pdf.text("School:", infoX, infoY + 45);

        const valueX = margin + 50;
        pdf.setTextColor(60, 60, 60);
        pdf.setFont("helvetica", "bold");
        pdf.text(studentDetails.name, valueX, infoY + 25);
        pdf.text(
          `${studentDetails.class} - ${studentDetails.section}`,
          valueX,
          infoY + 35
        );
        pdf.text(studentDetails.school, valueX, infoY + 45);
      }

      // Add page number and date
      const today = new Date();
      const dateString = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on ${dateString}`, pageWidth / 2, pageHeight - 15, {
        align: "center",
      });
      pdf.text("Page 1 of 3", pageWidth / 2, pageHeight - 10, {
        align: "center",
      });

      // Add second page with EQ breakdown
      pdf.addPage();

      pdf.setFillColor(103, 58, 183, 0.8);
      pdf.rect(0, 0, pageWidth, 15, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("FUTURE PATHWAYS ASSESSMENT RESULTS", pageWidth / 2, 10, {
        align: "center",
      });

      // EQ breakdown section
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Career Pathway Breakdown", margin, 30);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        "Your score represents your inclination towards several key career pathways:",
        margin,
        40
      );

      // Create skills bars
      const skillsStartY = 50;
      const skillHeight = 25;
      const skills = [
        { name: "Tech & Innovation", percentage: scorePercentage * 0.9 },
        { name: "Arts & Design", percentage: scorePercentage * 0.85 },
        { name: "Social Sciences", percentage: scorePercentage * 0.95 },
        { name: "Business & Leadership", percentage: scorePercentage * 0.8 },
      ];

      skills.forEach((skill, index) => {
        const y = skillsStartY + index * skillHeight;

        // Skill name
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(skill.name, margin, y);

        // Percentage
        pdf.text(`${Math.round(skill.percentage)}%`, margin + contentWidth - 10, y, {
          align: "right",
        });

        // Bar background
        pdf.setFillColor(220, 220, 220);
        pdf.roundedRect(margin, y + 5, contentWidth, 8, 2, 2, "F");

        // Bar fill
        pdf.setFillColor(103, 58, 183);
        pdf.roundedRect(
          margin,
          y + 5,
          contentWidth * (skill.percentage / 100),
          8,
          2,
          2,
          "F"
        );
      });

      // Add strengths section if profile exists
      if (profile) {
        const strengthsY = skillsStartY + skills.length * skillHeight + 20;

        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Your Strengths", margin, strengthsY);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(profile.strengthsIntro, margin, strengthsY + 10);

        // Add strength bullets
        profile.strengths.forEach((strength, index) => {
          const bulletY = strengthsY + 20 + index * 10;
          pdf.setFillColor(103, 58, 183);
          pdf.circle(margin + 3, bulletY - 2, 1.5, "F");
          pdf.text(strength, margin + 8, bulletY);
        });

        // Add growth areas
        const growthY = strengthsY + 20 + profile.strengths.length * 10 + 20;

        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Growth Opportunities", margin, growthY);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(profile.growthIntro, margin, growthY + 10);

        let currentY = growthY + 20;

        // Add growth area boxes
        profile.growthAreas.forEach((area, index) => {
          if (currentY > pageHeight - 30) {
            pdf.addPage();

            pdf.setFillColor(103, 58, 183, 0.8);
            pdf.rect(0, 0, pageWidth, 15, "F");

            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            pdf.text("FUTURE PATHWAYS ASSESSMENT RESULTS", pageWidth / 2, 10, {
              align: "center",
            });

            currentY = 30;
          }

          // Growth area box
          pdf.setFillColor(250, 250, 250);
          pdf.roundedRect(margin, currentY, contentWidth, 25, 3, 3, "F");

          // Area title
          pdf.setTextColor(103, 58, 183);
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "bold");
          pdf.text(area.area, margin + 8, currentY + 10);

          // Tip text
          pdf.setTextColor(80, 80, 80);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.text(area.tip, margin + 10, currentY + 18);

          currentY += 30;
        });

        // Add resources if they fit on the current page
        if (currentY + 30 + profile.resources.length * 25 > pageHeight - 25) {
          pdf.addPage();

          pdf.setFillColor(103, 58, 183, 0.8);
          pdf.rect(0, 0, pageWidth, 15, "F");

          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.text("FUTURE PATHWAYS ASSESSMENT RESULTS", pageWidth / 2, 10, {
            align: "center",
          });

          currentY = 30;
        } else {
          currentY += 20;
        }

        // Add resources section
        pdf.setTextColor(80, 80, 80);
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Helpful Resources", margin, currentY);

        currentY += 15;

        // Add resource boxes
        profile.resources.forEach((resource, index) => {
          pdf.setFillColor(250, 250, 250);
          pdf.roundedRect(margin, currentY, contentWidth, 22, 3, 3, "F");

          pdf.setTextColor(103, 58, 183);
          pdf.setFontSize(11);
          pdf.setFont("helvetica", "bold");
          pdf.text(resource.title, margin + 8, currentY + 9);

          pdf.setTextColor(80, 80, 80);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.text(resource.description, margin + 8, currentY + 17);

          currentY += 27;
        });
      }

      // Add footer to the page
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      }

      // Save the PDF
      pdf.save(
        `Future-Pathways-Results-${new Date().toISOString().slice(0, 10)}.pdf`
      );
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Could not generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading || !profile) {
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

  const scoreData = location.state as FuturePathwaysResultsProps;
  const scorePercentage = calculatePercentage(scoreData.totalScore);

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

                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                  Your Future Pathways Results
                </h1>
                <p className="text-gray-600 max-w-2xl">
                  Explore your career pathway profile and discover personalized
                  insights to enhance your social and emotional skills.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => navigate("/assessment/categories")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Back to Assessments
                </Button>
                
                <Button
                  onClick={downloadAsPDF}
                  disabled={isGeneratingPDF}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                >
                  {isGeneratingPDF ? (
                    "Preparing PDF..."
                  ) : (
                    <>
                      <Download className="h-4 w-4" /> Download Report
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div ref={reportRef}>
              <Card className="overflow-hidden mb-8 border-none shadow-md">
                <div
                  className={cn(
                    "py-6 px-8 text-white",
                    profile.color || "bg-purple-400"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      {profile.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{profile.title}</h2>
                      <p className="opacity-90 text-sm font-medium">
                        {profile.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="col-span-2">
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        Your Profile
                      </h3>
                      <p className="text-gray-600">{profile.description}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
                      <div className="mb-2 text-center">
                        <p className="text-sm text-gray-500 mb-1">Your Score</p>
                        <div className="relative">
                          <div className="w-24 h-24 mx-auto">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-2xl font-bold text-purple-600">
                                {scorePercentage}%
                              </span>
                            </div>
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 36 36"
                            >
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#E0E0E0"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#9333ea"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${scorePercentage}, 100`}
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-500">Raw Score</p>
                          <p className="font-semibold text-purple-600">
                            {scoreData.totalScore}/40
                          </p>
                        </div>
                        <div className="bg-white rounded p-2 text-center">
                          <p className="text-xs text-gray-500">Range</p>
                          <p className="font-semibold text-purple-600">
                            {scoreRange}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Your Strengths
                    </h3>
                    <p className="text-gray-600 mb-4">{profile.strengthsIntro}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profile.strengths.map((strength, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-green-50 p-3 rounded-md border border-green-100"
                        >
                          <div className="mt-1 bg-green-100 rounded-full p-1">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <p className="text-gray-700 text-sm">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" /> Growth
                      Opportunities
                    </h3>
                    <p className="text-gray-600 mb-4">{profile.growthIntro}</p>
                    <div className="space-y-4">
                      {profile.growthAreas.map((area, index) => (
                        <div
                          key={index}
                          className="bg-purple-50 rounded-lg p-4 border border-purple-100"
                        >
                          <h4 className="font-medium text-purple-800 mb-2">
                            {area.area}
                          </h4>
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-600 text-sm">{area.tip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                      <BookOpen className="h-5 w-5 text-sky-500 mr-2" /> Helpful
                      Resources
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profile.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col"
                        >
                          <div className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3 text-purple-500">
                            {resource.icon}
                          </div>
                          <h4 className="font-medium text-gray-800 mb-2">
                            {resource.title}
                          </h4>
                          <p className="text-gray-600 text-sm flex-grow">
                            {resource.description}
                          </p>
                          <Button
                            variant="ghost"
                            className="mt-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0 h-auto font-medium text-sm flex justify-start"
                          >
                            Learn more <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {studentDetails && (
                    <div className="mt-8 border-t pt-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Student Name</p>
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-1" />
                            <p className="font-medium">{studentDetails.name}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Class & Section</p>
                          <div className="flex items-center">
                            <ClipboardList className="h-4 w-4 text-gray-400 mr-1" />
                            <p className="font-medium">
                              {studentDetails.class} - {studentDetails.section}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">School</p>
                          <div className="flex items-center">
                            <School className="h-4 w-4 text-gray-400 mr-1" />
                            <p className="font-medium">{studentDetails.school}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={() => navigate("/assessment/future-pathways/take")}
                variant="outline"
                className="mx-2"
              >
                <ZoomIn className="mr-2 h-4 w-4" />
                Take Assessment Again
              </Button>
              <Button onClick={downloadAsPDF} disabled={isGeneratingPDF} className="mx-2 bg-purple-600 hover:bg-purple-700">
                {isGeneratingPDF ? (
                  "Preparing..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FuturePathwaysResults;
