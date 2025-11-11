"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function FullScreenLoadingAnimation({ title, subtext }: { title: string, subtext: string }) {
    
    // Prevent body scroll when loading overlay is shown
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const loadingContent = (
        <div
        className="modal show fade-in-bottom"
        style={{
          display: "block",
          background: "rgba(0,0,0,0.65)",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
        }}
        >
            <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
            }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 24px", width: "100%" }}>
                <img alt="loading" src="/gifs/analysis-loading.gif" style={{objectFit: "cover"}} width={100} height={100} />
                <span style={{ fontSize: 18, color: "#FFFFFF", fontWeight: 700 }}>{title}</span>
                <span style={{ fontSize: 14, color: "#FFFFFF" }}>{subtext}</span>
              </div>
            </div>
        </div>
    );

    // Render loading overlay using portal to document.body
    return typeof document !== 'undefined' ? createPortal(loadingContent, document.body) : null;
}
