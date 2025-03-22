
type BenefitItem = string;

type AssessmentBenefitsProps = {
  benefits: BenefitItem[];
  ideal: string;
};

const AssessmentBenefits = ({ benefits, ideal }: AssessmentBenefitsProps) => {
  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Key Benefits:</h3>
      <ul className="space-y-3 mb-8">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-purple mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      
      <h3 className="text-lg font-semibold mb-4">Who Is This For?</h3>
      <p className="text-foreground/80 mb-8">
        {ideal}
      </p>
    </>
  );
};

export default AssessmentBenefits;
