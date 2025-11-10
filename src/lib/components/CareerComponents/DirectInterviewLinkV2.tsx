import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useAppContext } from "@/lib/context/AppContext";
import { candidateActionToast, copyTextToClipboard, loadingToast, successToast } from "@/lib/Utils";
import { toast } from "react-toastify";

export default function DirectInterviewLinkV2(props: { formData: any, setFormData: (formData: any) => void }) {
  const { user } = useAppContext();
  const [isOpen, setIsOpen] = React.useState(true);

  const { formData, setFormData } = props;

  async function updateCareer(
    dataUpdates: any,
    loadingMessage: string,
    sucessMessage: string
  ) {
    let userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    loadingToast(loadingMessage);
    // Handle slug if it's an array or string

    const response = await axios.post("/api/update-career", {
      _id: formData._id,
      lastEditedBy: userInfoSlice,
      ...dataUpdates,
    });

    if (response.status === 200) {
      successToast(sucessMessage, 1200);
      toast.dismiss("loading-toast");
    }
  }

  const [shareLink, setLink] = useState(null);

  async function generateLink() {
    const directLink = `/direct-interview/${formData._id}`;

    await updateCareer(
      {
        directInterviewLink: directLink,
        updatedAt: Date.now(),
      },
      "Generating Link...",
      "Sucessfully Created Direct Link"
    );

    let dynamicLink = `${window.location.origin}${directLink}`;
    setLink(dynamicLink);
    copyTextToClipboard(dynamicLink);
    setFormData({ ...formData, directInterviewLink: `/direct-interview/${formData._id}` });
  }

  async function disableLink() {
    await updateCareer(
      {
        directInterviewLink: null,
        updatedAt: Date.now(),
      },
      "Removing Direct Link",
      "Sucessfully Removed Direct Link"
    );

    setLink(null);
    setFormData({ ...formData, directInterviewLink: null });
  }

  useEffect(() => {
      if (formData?.directInterviewLink) {
        let dynamicLink = `${window.location.origin.includes("hirejia.ai") ? 
          "https://www.hellojia.ai" : window.location.origin}${formData.directInterviewLink}`;

        setLink(dynamicLink);
      }
  }, [formData?.directInterviewLink]);

  return (
    <>
      {formData && (
        <div
          style={{
            width: "100%",
            border: "1px solid #EAECF5",
            borderRadius: 16,
            padding: 16,
            backgroundColor: "#F8F9FC",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              onClick={() => setIsOpen((p) => !p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsOpen((p) => !p);
                }
              }}
              aria-expanded={isOpen}
              aria-controls="direct-interview-link-content"
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            >
              <Image
                src="/icons/chevron.svg"
                alt=""
                width={20}
                height={20}
                style={{
                  transition: "transform 0.2s ease",
                  transform: isOpen ? "rotate(0deg)" : "rotate(-180deg)",
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1F2430",
                }}
              >
                Direct Interview Link
              </p>
            </div>
            <button
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <Image
                src="/temp/edit-pen-circle-btn.svg"
                alt="edit"
                width={32}
                height={32}
              />
            </button>
          </div>

          {isOpen && (
            <div id="direct-interview-link-content" style={{ marginTop: 16 }}>
              <div
                style={{
                  border: "1px solid #EAECF5",
                  borderRadius: 12,
                  padding: 16,
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {shareLink && (
                  <>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", gap: 10 }}>
                      <input
                        type="text"
                        className="form-control"
                        value={shareLink}
                        readOnly={true}
                        style={{ fontSize: 14, color: "#414651" }}
                      />
                      <div
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 8 }}
                        onClick={() => {
                          navigator.clipboard.writeText(shareLink);
                          candidateActionToast(
                            "Career Link Copied to Clipboard",
                            1300,
                            <i className="la la-link mr-1 text-info"></i>
                          );
                        }}
                      >
                        <i className="la la-copy" style={{ fontSize: 20, color: "#535862" }}></i>
                      </div>
                    </div>
                    <p style={{ margin: 0, textAlign: "center", fontSize: 14, color: "#717680", fontWeight: 400 }}>
                      Share the link to an applicant for a direct interview.
                    </p>

                    <div style={{ display: "flex", flexDirection: "row", gap: 10, width: "100%" }}>
                      <a href={shareLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flex: 1 }}>
                        <div style={{ color: "#414651", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: 60, cursor: "pointer", whiteSpace: "nowrap", fontWeight: 700, fontSize: 14, width: "100%" }}>
                          <Image src="/temp/link.svg" alt="" width={16} height={16} /> Open link
                        </div>
                      </a>
                      <button
                        style={{ flex: 1, color: "#B32318", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#FEF3F2", border: "1px solid #FEF3F2", padding: "8px 16px", borderRadius: 60, cursor: "pointer", whiteSpace: "nowrap", fontWeight: 700, fontSize: 14 }}
                        onClick={disableLink}
                      >
                        <i className="la la-ban"></i> Disable link
                      </button>
                      <p style={{ margin: 0, fontSize: 14, color: "#717680", textAlign: "center", fontWeight: 400, marginTop: 8 }}>
                        Be careful, this action cannot be undone.
                      </p>
                    </div>
                  </>
                )}

                {!shareLink && (
                  <button 
                    style={{ color: "#414651",display: "flex", justifyContent: "center", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #D5D7DA", padding: "8px 16px", borderRadius: 60, cursor: "pointer", whiteSpace: "nowrap", fontWeight: 700, fontSize: 14, width: "100%" }}
                    onClick={generateLink}
                  >
                    <Image src="/temp/link.svg" alt="" width={16} height={16} /> Generate Direct Interview Link
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
