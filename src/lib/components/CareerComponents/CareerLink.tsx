"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { candidateActionToast } from "../../Utils";

export default function CareerLink(props: {career: any}) {
    const { career } = props;
    const [shareLink, setShareLink] = useState("");
    const [isOpen, setIsOpen] = React.useState(true);

    useEffect(() => {
        let careerRedirection = "applicant";
        if (career.orgID === "682d3fc222462d03263b0881") {
            careerRedirection = "whitecloak";
        }
        setShareLink(`https://www.hellojia.ai/${careerRedirection}/job-openings/${career._id}`);
    }, [career]);

    return (
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
                    aria-controls="career-link-content"
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
                        Career Link
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

            {isOpen && shareLink && (
                <div id="career-link-content" style={{ marginTop: 16 }}>
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
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", gap: 10 }}>
                            <input
                                type="text"
                                value={shareLink}
                                readOnly={true}
                                style={{ fontSize: "1rem", color: "#414651", backgroundColor: "#FFFFFF", border: "1px solid #E9EAEB", borderRadius: "8px", padding: "8px", width: "100%", fontFamily: "inherit" }}
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
                                <Image
                                    src="/temp/copy.svg"
                                    alt="Copy link"
                                    width={20}
                                    height={20}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}