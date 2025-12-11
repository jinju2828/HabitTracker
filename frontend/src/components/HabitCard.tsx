import React from 'react';

interface HabitCardProps {
  id: number;
  name: string;
  completed: boolean;
  onChange: (id: number, completed: boolean) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ id, name, completed, onChange }) => {
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
      }}
    >
      <div>{name}</div>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => onChange(id, e.target.checked)}
        />
        <span>{completed ? "Done" : "Mark"}</span>
      </label>
    </div>
  );
};
