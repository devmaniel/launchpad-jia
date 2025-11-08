import React from "react";
import Image from "next/image";

interface AIInterviewCardProps {
  // Add any props if needed
}

const AIInterviewCard: React.FC<AIInterviewCardProps> = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        borderRadius: 16,
        justifyContent: "center",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px dashed #D5D7DA",
          borderRadius: 16,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          padding: 16,
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Image src="/temp/lock-icon.svg" alt="lock" width={20} height={20} />
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#D5D7DA",
            marginBottom: 0,
          }}
        >
          Core stage, cannot move
        </p>
      </div>

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          backgroundColor: "#F8F9FC",
          padding: 16,
          borderRadius: 16,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Image
              src="/temp/mic.svg"
              alt="user"
              width={16}
              height={16}
            />
            <p
              style={{
                color: "#1E1F3B",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 0,
              }}
            >
              AI Interview
            </p>
            <Image
              src="/temp/help-icon-thin.svg"
              alt="help"
              width={18}
              height={18}
            />
          </div>
          <Image src="/temp/lock-icon.svg" alt="lock" width={16} height={16} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              
              color: "#717680",
              marginBottom: 0,
            }}
          >
            Substages
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                border: "1px solid #D5D7DA",
                padding: "16px 10px",
                borderRadius: 16,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#414651",
                  marginBottom: 0,
                }}
              >
                Waiting Interview
              </p>
              <Image
                src="/temp/zap-circle-btn.svg"
                alt="zap-circle-btn"
                width={35}
                height={35}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                border: "1px solid #D5D7DA",
                padding: "16px 10px",
                borderRadius: 16,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#414651",
                  marginBottom: 0,
                }}
              >
                For Review
              </p>
              <Image
                src="/temp/zap-circle-btn.svg"
                alt="zap-circle-btn"
                width={35}
                height={35}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewCard;
