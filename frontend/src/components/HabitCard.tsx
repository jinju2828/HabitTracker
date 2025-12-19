import React from "react";

interface HabitCardProps {
  id: number;
  name: string;
  isCompleted: boolean;
  onChange: (completed: boolean) => void;
  disabled?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  id,
  name,
  isCompleted,
  onChange,
  disabled = false,
}) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: disabled ? "#888" : "#333",
      }}
    >
      <div>{name}</div>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span>{isCompleted ? "Done" : "Mark"}</span>
      </label>
    </div>
  );
};
