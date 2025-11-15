import Step1 from "./01CareerDetails&TeamAccess/Step1";
import Step2 from "./02CVReview&Pre-screening/Step2";
import Step3 from "./03AISetupInterview/Step3";
import Step4 from "./04PipelineStages/Step4";
import Step5 from "./05ReviewCareer/Step5";

interface StepRendererProps {
  activeStep: number;
  stepProps: {
    step1: any;
    step2: any;
    step3: any;
    step4: any;
    step5: any;
  };
}

/**
 * Component to render the appropriate step based on activeStep
 * Reduces conditional rendering clutter in main component
 */
export default function StepRenderer({ activeStep, stepProps }: StepRendererProps) {
  switch (activeStep) {
    case 1:
      return <Step1 {...stepProps.step1} />;
    case 2:
      return <Step2 {...stepProps.step2} />;
    case 3:
      return <Step3 {...stepProps.step3} />;
    case 4:
      return <Step4 {...stepProps.step4} />;
    case 5:
      return <Step5 {...stepProps.step5} />;
    default:
      return null;
  }
}
