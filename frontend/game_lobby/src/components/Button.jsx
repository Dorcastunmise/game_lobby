export default function Button({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "0.7rem 1.5rem",
        margin: "0.3rem",
        borderRadius: "8px",
        border: "none",
        backgroundColor: disabled ? "#ccc" : "#4f46e5",
        color: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: "bold",
        fontSize: "1rem",
        transition: "0.2s",
      }}
      onMouseEnter={e => !disabled && (e.target.style.backgroundColor = "#3730a3")}
      onMouseLeave={e => !disabled && (e.target.style.backgroundColor = "#4f46e5")}
    >
      {children}
    </button>
  );
}
