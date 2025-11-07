"use client";

import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";

interface JobDescriptionProps {
  description: string;
  setDescription: (value: string) => void;
  descriptionError?: boolean;
  onDescriptionBlur?: () => void;
}

export default function JobDescription({
  description,
  setDescription,
  descriptionError,
  onDescriptionBlur,
}: JobDescriptionProps) {
  return (
    <div className="">
      <div className="layered-card-middle">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 16,
              color: "#181D27",
              fontWeight: 700,
              padding: "8px 0px 0px 12px",
            }}
          >
            2. Job Description
          </span>
        </div>
        <div className="layered-card-content" style={{gap: '0 !important',}}>
          <RichTextEditor 
            setText={setDescription} 
            text={description} 
            error={!!descriptionError}
            onBlur={onDescriptionBlur}
          />
        </div>
      </div>
    </div>
  );
}
