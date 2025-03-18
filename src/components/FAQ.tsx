
import { useEffect, useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What are skill assessments?",
    answer: "Skill assessments are scientifically designed tools that evaluate your abilities, interests, personality traits, and preferences to provide insights into your strengths and potential career paths. Our assessments use validated methodologies to deliver personalized results that can guide your professional development decisions."
  },
  {
    question: "How long does each assessment take?",
    answer: "The time required varies by assessment. Most of our assessments take between 15-30 minutes to complete. The Career Vision assessment takes approximately 15 minutes, the RIASEC Model assessment takes about 20 minutes, and our more comprehensive assessments like the EQ Navigator may take up to 30 minutes."
  },
  {
    question: "Are the assessments scientifically validated?",
    answer: "Yes, all our assessments are based on well-established psychological theories and have been validated through extensive research. We regularly update our assessment tools to incorporate the latest scientific findings and ensure they remain relevant and accurate."
  },
  {
    question: "How will the results help me?",
    answer: "Your assessment results provide valuable insights into your strengths, preferences, and potential career matches. They can help you make more informed decisions about your education and career path, identify areas for personal growth, and better understand how your unique attributes align with different professional environments."
  },
  {
    question: "Can I retake an assessment?",
    answer: "Yes, you can retake any assessment after 3 months. This waiting period ensures that your results aren't influenced by your memory of previous questions and allows time for potential personal growth and changes in your perspectives or skills."
  },
  {
    question: "Are my assessment results private?",
    answer: "Absolutely. We take your privacy seriously. Your assessment results and personal information are kept confidential and are never shared with third parties without your explicit consent. You have complete control over who can access your results."
  }
];

const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h3 className="animate-on-scroll text-brand-purple font-medium mb-3">FAQ</h3>
          <h2 className="animate-on-scroll mb-4">Frequently Asked <span className="text-brand-purple">Questions</span></h2>
          <p className="animate-on-scroll text-foreground/70 max-w-2xl mx-auto">
            Find answers to common questions about our assessments and how they can help you
          </p>
        </div>

        <div className="animate-on-scroll max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50">
                <AccordionTrigger className="text-left font-medium py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
