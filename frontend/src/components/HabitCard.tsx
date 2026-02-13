import React from "react";

type HabitCardProps = {
  habit: {
    id: number;
    name: string;
    isCompleted: boolean;
  };
  isEditing: boolean;
  editingName: string;
  onEditStart: () => void;
  onEditChange: (value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: () => void;
  onToggle: (checked: boolean) => void;
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isEditing,
  editingName,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  onDelete,
  onToggle,
}) => {
  if (!habit) return null;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
      }}
    >
      {isEditing ? (
        <>
          <input
            value={editingName}
            onChange={(e) => onEditChange(e.target.value)}
          />
          <button onClick={onEditSave}>💾 Save</button>
          <button onClick={onEditCancel}>❌ Cancel</button>
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{habit.name}</span>
            <div>
              <button onClick={onEditStart}>✏️</button>
              <button onClick={onDelete}>🗑</button>
            </div>
          </div>

          <label style={{ display: "flex", gap: 8 }}>
            <input
              type="checkbox"
              checked={habit.isCompleted}
              onChange={(e) => onToggle(e.target.checked)}
            />
            <span>{habit.isCompleted ? "Done" : "Mark for today"}</span>
          </label>
        </>
      )}
    </div>
  );
};
