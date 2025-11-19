import React from "react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string | number;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const completed = payload[0]?.value;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ddd",
        padding: "8px 12px",
        borderRadius: 6,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <p style={{ 
        margin: 0, 
        color: "#555"
        }}>
        <strong>{label}</strong>
      </p>
      <p style={{ 
        margin: 0, 
        color: "#555"
        }}>
        Habit: {completed === 1 ? "✅ Completed" : "❌ Not Completed"}
      </p>
    </div>
  );
};
