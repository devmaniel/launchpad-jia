"use client";

export default function TipsContainer() {
  return (
    <div style={{ width: "20%", position: "sticky", top: 20 }}>
      <div className="layered-card-middle">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 0px 0px 12px",
          }}
        >
          <img 
            src="/icons/tips_and_updates.svg" 
            alt="Tips Icon" 
            style={{ width: 20, height: 20 }}
          />
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#181D27",
              margin: 0,
            }}
          >
            Tips
          </h3>
        </div>
        <div className="layered-card-content">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#181D27",
                  margin: 0,
                  display: "inline",
                }}
              >
                Use clear, standard job titles{" "}
              </h4>
              <p
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  lineHeight: 1.5,
                  margin: 0,
                  display: "inline",
                }}
              >
                for better searchability (e.g., "Software Engineer" instead of
                "Code Ninja" or "Tech Rockstar").
              </p>
            </div>

            <div>
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#181D27",
                  margin: 0,
                  display: "inline",
                }}
              >
                Avoid abbreviations{" "}
              </h4>
              <p
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  lineHeight: 1.5,
                  margin: 0,
                  display: "inline",
                }}
              >
                or internal role codes that applicants may not understand (e.g.,
                use "QA Engineer" instead of "QE II" or "QA-L2").
              </p>
            </div>

            <div>
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#181D27",
                  margin: 0,
                  display: "inline",
                }}
              >
                Keep it concise{" "}
              </h4>
              <p
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  lineHeight: 1.5,
                  margin: 0,
                  display: "inline",
                }}
              >
                — job titles should be no more than a few words (2–4 max),
                avoiding fluff or marketing terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}