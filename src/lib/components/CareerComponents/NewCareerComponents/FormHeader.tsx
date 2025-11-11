"use client";

interface FormHeaderProps {
  formType: string;
  isFormValid: boolean;
  isSavingCareer: boolean;
  onSaveUnpublished: () => void;
  onSavePublished: () => void;
  onSaveAndContinue?: () => void;
  onCancel?: () => void;
  activeStep?: number;
}

export default function FormHeader({
  formType,
  isFormValid,
  isSavingCareer,
  onSaveUnpublished,
  onSavePublished,
  onSaveAndContinue,
  onCancel,
  activeStep = 5,
}: FormHeaderProps) {
  if (formType === "add") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>
          Add new career
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            disabled={!isFormValid || isSavingCareer}
            style={{
              width: "fit-content",
              color: "#414651",
              background: "#fff",
              border: "1px solid #D5D7DA",
              padding: "8px 16px",
              borderRadius: "60px",
              fontWeight: 500,
              cursor: !isFormValid || isSavingCareer ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
            onClick={onSaveUnpublished}
          >
            Save as Unpublished
          </button>
          {activeStep < 5 ? (
            <button
              disabled={!isFormValid || isSavingCareer}
              style={{
                width: "fit-content",
                background: !isFormValid || isSavingCareer ? "#D5D7DA" : "#181D27",
                border: "none",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "60px",
                fontWeight: 500,
                cursor: !isFormValid || isSavingCareer ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={onSaveAndContinue}
            >
              Save and Continue
              <img
                src="/temp/arrow-right.svg"
                alt="arrow"
                width={20}
                height={20}
              />
            </button>
          ) : (
            <button
              disabled={!isFormValid || isSavingCareer}
              style={{
                width: "fit-content",
                background: !isFormValid || isSavingCareer ? "#D5D7DA" : "#181D27",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "60px",
                fontWeight: 500,
                cursor: !isFormValid || isSavingCareer ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={onSavePublished}
            >
              <i
                className="la la-check-circle"
                style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
              ></i>
              Publish
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginBottom: "35px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>
        Edit Career Details
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          style={{
            width: "fit-content",
            color: "#414651",
            background: "#fff",
            border: "1px solid #D5D7DA",
            padding: "8px 16px",
            borderRadius: "60px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          disabled={!isFormValid || isSavingCareer}
          style={{
            width: "fit-content",
            color: "#414651",
            background: "#fff",
            border: "1px solid #D5D7DA",
            padding: "8px 16px",
            borderRadius: "60px",
            cursor: !isFormValid || isSavingCareer ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
          onClick={onSaveUnpublished}
        >
          Save Changes as Unpublished
        </button>
        <button
          disabled={!isFormValid || isSavingCareer}
          style={{
            width: "fit-content",
            background: !isFormValid || isSavingCareer ? "#D5D7DA" : "black",
            color: "#fff",
            border: "1px solid #E9EAEB",
            padding: "8px 16px",
            borderRadius: "60px",
            cursor: !isFormValid || isSavingCareer ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
          onClick={onSavePublished}
        >
          <i
            className="la la-check-circle"
            style={{ color: "#fff", fontSize: 20, marginRight: 8 }}
          ></i>
          Save Changes as Published
        </button>
      </div>
    </div>
  );
}
