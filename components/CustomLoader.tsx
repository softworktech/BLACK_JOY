// components/CustomLoader.tsx
export function CustomLoader() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "300px"
    }}>
      <div style={{
        border: "6px solid #f3f3f3",
        borderTop: "6px solid #FF6700", // orange color
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        animation: "spin 1s linear infinite"
      }}></div>

      {/* Keyframes for spin */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
