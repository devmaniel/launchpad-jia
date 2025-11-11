/**
 * Hook for handling CV screening process
 */

import { useState } from "react";
import axios from "axios";
import { ScreeningResult, UserCV, DigitalCV, CVData, FileInfo } from "../types";
import { formatUserCVForSubmission, isAllCVEmpty } from "../utils/cvHelpers";

interface UseCVScreeningProps {
  interviewID: string;
  userEmail: string;
  userName: string;
  onSuccess: (result: ScreeningResult) => void;
  onError: (error: string) => void;
}

export function useCVScreening({
  interviewID,
  userEmail,
  userName,
  onSuccess,
  onError,
}: UseCVScreeningProps) {
  const [isScreening, setIsScreening] = useState(false);

  const screenCV = async (
    userCV: UserCV | null,
    digitalCV: string | null,
    hasChanges: boolean,
    file: File | null,
    editingCV: string | null
  ) => {
    // Validation
    if (editingCV !== null) {
      onError("Please save the changes first.");
      return false;
    }

    if (!userCV || isAllCVEmpty(userCV)) {
      onError("No details to be saved.");
      return false;
    }

    let parsedDigitalCV: DigitalCV = {
      errorRemarks: null,
      digitalCV: [],
    };

    if (digitalCV) {
      parsedDigitalCV = JSON.parse(digitalCV);

      if (parsedDigitalCV.errorRemarks) {
        onError(
          "Please fix the errors in the CV first.\n\n" + parsedDigitalCV.errorRemarks
        );
        return false;
      }
    }

    setIsScreening(true);

    try {
      // Save CV if there are changes
      if (hasChanges) {
        const formattedUserCV = formatUserCVForSubmission(userCV);
        parsedDigitalCV.digitalCV = formattedUserCV;

        const data: CVData = {
          name: userName,
          cvData: parsedDigitalCV,
          email: userEmail,
          fileInfo: null,
        };

        if (file) {
          data.fileInfo = {
            name: file.name,
            size: file.size,
            type: file.type,
          };
        }

        await axios({
          method: "POST",
          url: `/api/whitecloak/save-cv`,
          data,
        });

        // Update localStorage
        localStorage.setItem(
          "userCV",
          JSON.stringify({ ...data, ...data.cvData })
        );
      }

      // Screen CV
      const screenResponse = await axios({
        url: "/api/whitecloak/screen-cv",
        method: "POST",
        data: {
          interviewID,
          userEmail,
        },
      });

      const result = screenResponse.data;

      if (result.error) {
        onError(result.message);
        return false;
      }

      onSuccess(result);
      return true;
    } catch (err) {
      console.error("Error screening CV:", err);
      onError("Error screening CV. Please try again.");
      return false;
    } finally {
      setIsScreening(false);
    }
  };

  return {
    isScreening,
    screenCV,
  };
}
