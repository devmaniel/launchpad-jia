/**
 * ProgressSteps - Visual step indicator for CV upload process
 */

import React from "react";
import { StepType, UserCV } from "../types";
import { STEPS } from "../constants";
import { assetConstants } from "@/lib/utils/constantsV2";
import { getStepStatus, getStepStatusAssetKey } from "../utils/cvHelpers";
import styles from "../styles/components/ProgressSteps.module.scss";

interface ProgressStepsProps {
  currentStep: StepType | null;
  userCV: UserCV | null;
  buildingCV: boolean;
}

export function ProgressSteps({ currentStep, userCV, buildingCV }: ProgressStepsProps) {
  return (
    <div className={styles.stepContainer}>
      {/* Step Icons and Progress Bars */}
      <div className={styles.step}>
        {STEPS.map((_, index) => {
          const status = getStepStatus(currentStep, index, true, userCV, buildingCV);
          const statusKey = getStepStatusAssetKey(status);

          return (
            <div className={styles.stepBar} key={index}>
              <img alt={status} src={assetConstants[statusKey]} />
              {index < STEPS.length - 1 && (
                <hr
                  className={
                    styles[
                      getStepStatusAssetKey(
                        getStepStatus(currentStep, index, false, userCV, buildingCV)
                      )
                    ]
                  }
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Labels */}
      <div className={styles.step}>
        {STEPS.map((item, index) => {
          const status = getStepStatus(currentStep, index, true, userCV, buildingCV);
          const statusKey = getStepStatusAssetKey(status);

          return (
            <span className={`${styles.stepDetails} ${styles[statusKey]}`} key={index}>
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}
