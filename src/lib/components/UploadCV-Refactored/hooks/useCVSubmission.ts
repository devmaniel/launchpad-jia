/**
 * Hook for handling CV file submission and digitalization
 */

import { useState } from "react";
import axios from "axios";
import { CORE_API_URL } from "@/lib/Utils";
import { parseDigitalCVToUserCV } from "../utils/cvHelpers";
import { UserCV } from "../types";

interface UseCVSubmissionProps {
  userEmail: string;
  onSuccess: (digitalCV: string, userCV: UserCV) => void;
  onError: (error: string) => void;
}

export function useCVSubmission({ userEmail, onSuccess, onError }: UseCVSubmissionProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const submitFile = async (file: File) => {
    setIsProcessing(true);

    try {
      // Step 1: Upload file to core API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fName", file.name);
      formData.append("userEmail", userEmail);

      const uploadResponse = await axios({
        method: "POST",
        url: `${CORE_API_URL}/upload-cv`,
        data: formData,
      });

      // Step 2: Digitalize CV chunks
      const digitalizeResponse = await axios({
        method: "POST",
        url: `/api/whitecloak/digitalize-cv`,
        data: { chunks: uploadResponse.data.cvChunks },
      });

      const digitalCVString = digitalizeResponse.data.result;
      const userCV = parseDigitalCVToUserCV(digitalCVString);

      onSuccess(digitalCVString, userCV);
    } catch (err) {
      console.error("Error processing CV:", err);
      onError("Error building CV. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    submitFile,
  };
}
