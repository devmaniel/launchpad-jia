export default function RestoreConfirmationModal({ 
  onConfirm, 
  onCancel 
}: { 
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="modal show fade-in-bottom"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.45)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1050,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div 
          className="modal-content" 
          style={{ 
            overflowY: "auto", 
            height: "fit-content", 
            width: "fit-content", 
            background: "#fff", 
            border: "1.5px solid #E9EAEB", 
            borderRadius: 14, 
            boxShadow: "0 8px 32px rgba(30,32,60,0.18)", 
            padding: "24px" 
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
            <i className="la la-exclamation-triangle" style={{ fontSize: 48, color: "#F79009" }}></i>
            <h3 className="modal-title">Restore to Default Pipeline?</h3>
            <span style={{ fontSize: 14, color: "#717680", maxWidth: "352px" }}>
              This will remove all custom stages you've added. This action cannot be undone.
            </span>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 16, width: "100%" }}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onCancel();
                }}
                style={{ 
                  display: "flex", 
                  width: "50%", 
                  flexDirection: "row", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  textAlign: "center", 
                  gap: 8, 
                  backgroundColor: "#FFFFFF", 
                  borderRadius: "60px", 
                  border: "1px solid #D5D7DA", 
                  cursor: "pointer", 
                  padding: "10px 0px" 
                }}
              >
                Cancel
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onConfirm();
                }}
                style={{ 
                  display: "flex", 
                  width: "50%", 
                  flexDirection: "row", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  textAlign: "center", 
                  gap: 8, 
                  backgroundColor: "#DC6803", 
                  color: "#FFFFFF", 
                  borderRadius: "60px", 
                  border: "1px solid #DC6803", 
                  cursor: "pointer", 
                  padding: "10px 0px" 
                }}
              >
                Restore to Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
