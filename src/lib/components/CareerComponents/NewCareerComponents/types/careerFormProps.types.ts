/**
 * Props for the main CareerFormV2 component
 */
export interface CareerFormV2Props {
  career?: any;
  formType: string;
  setShowEditModal?: (show: boolean) => void;
  currentStep?: number;
  forcePrefill?: boolean;
}

/**
 * Props for Step components
 */
export interface StepComponentProps {
  onSaveAndContinue?: () => void;
}
