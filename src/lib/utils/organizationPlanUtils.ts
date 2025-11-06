/**
 * Utility functions for handling organization plan data consistently
 * Handles both embedded plan objects and planId references
 */

export interface OrganizationPlan {
  jobSlots: number;
  type: string;
  activeJobs?: number;
  expiresAt?: Date;
}

export interface OrganizationPlanResult {
  totalJobSlots: number;
  activeJobs: number;
  hasValidPlan: boolean;
  planType: string | null;
  errorMessage?: string;
}

/**
 * Extract plan information from organization data
 * Handles both embedded plans and planId references
 */
export function getOrganizationPlanInfo(orgData: any): OrganizationPlanResult {
  // Default values
  let totalJobSlots = 0;
  let activeJobs = 0;
  let hasValidPlan = false;
  let planType: string | null = null;
  let errorMessage: string | undefined;

  try {
    // Get extra job slots (always available)
    const extraJobSlots = parseInt(orgData?.extraJobSlots?.toString() || "0");

    // Case 1: Embedded plan object (new structure)
    if (orgData?.plan && typeof orgData.plan === 'object') {
      const planJobSlots = parseInt(orgData.plan.jobSlots?.toString() || "0");
      totalJobSlots = planJobSlots + extraJobSlots;
      activeJobs = parseInt(orgData.plan.activeJobs?.toString() || "0");
      hasValidPlan = true;
      planType = orgData.plan.type || "unknown";
    }
    // Case 2: planId reference (should be handled by API lookup)
    else if (orgData?.planId) {
      // This case should be handled by the API that joins with organization-plans
      // If we reach here, it means the API lookup failed
      errorMessage = "Plan details could not be loaded";
      totalJobSlots = extraJobSlots; // Only use extra slots
      hasValidPlan = false;
    }
    // Case 3: No plan data at all
    else {
      // Determine default slots based on tier
      const defaultSlots = getDefaultSlotsByTier(orgData?.tier);
      totalJobSlots = defaultSlots + extraJobSlots;
      hasValidPlan = defaultSlots > 0;
      planType = orgData?.tier || "free";
      
      if (defaultSlots === 0) {
        errorMessage = "No plan configured for this organization";
      }
    }

  } catch (error) {
    console.error("Error processing organization plan data:", error);
    errorMessage = "Error processing plan information";
    totalJobSlots = 0;
    hasValidPlan = false;
  }

  return {
    totalJobSlots,
    activeJobs,
    hasValidPlan,
    planType,
    errorMessage
  };
}

/**
 * Get default job slots based on organization tier
 */
function getDefaultSlotsByTier(tier: string | undefined): number {
  switch (tier?.toLowerCase()) {
    case 'startup':
      return 3;
    case 'corporate':
      return 10;
    case 'enterprise':
      return 25;
    case 'free':
    default:
      return 0; // Free tier gets no default slots
  }
}

/**
 * Check if organization can create new careers
 */
export function canCreateNewCareer(
  totalJobSlots: number, 
  currentActiveCareers: number,
  hasValidPlan: boolean
): {
  canCreate: boolean;
  reason?: string;
} {
  if (!hasValidPlan) {
    return {
      canCreate: false,
      reason: "No valid plan configured. Please contact administrator."
    };
  }

  if (currentActiveCareers >= totalJobSlots) {
    return {
      canCreate: false,
      reason: `You have reached the maximum number of jobs (${totalJobSlots}) for your plan. Please upgrade to add more jobs.`
    };
  }

  return { canCreate: true };
}

/**
 * Get user-friendly plan status message
 */
export function getPlanStatusMessage(planResult: OrganizationPlanResult): string {
  if (planResult.errorMessage) {
    return planResult.errorMessage;
  }

  if (!planResult.hasValidPlan) {
    return "No plan configured";
  }

  return `${planResult.planType} plan - ${planResult.totalJobSlots} job slots available`;
}
