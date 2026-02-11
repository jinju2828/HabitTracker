import React, { useState } from "react";
import { createHabit, updateHabit, deleteHabit } from "@/api/habitApi";
import { useHabits } from "@/hooks/useHabits";
import '../styles/HabitList.css';

interface Habit {
  id: number;
  name: string;
  isCompleted?: boolean;
}

export const HabitList: React.FC = () => {
  const { habits, fetchHabits } = useHabits();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // ➕ Add
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    await createHabit({ name: newName });
    setNewName("");
    fetchHabits();
  };

  // 💾 Save
  const handleSave = async (id: number) => {
    if (!editingName.trim()) return;

    await updateHabit(id, editingName);
    setEditingId(null);
    setEditingName("");
    fetchHabits();
  };

  // 🗑 Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this habit?")) return;

    await deleteHabit(id);
    fetchHabits();
  };

  // ✅ Mark (이건 로그 API 연결해야 함)
  const handleMark = (id: number, checked: boolean) => {
    console.log("Mark habit", id, checked);
    // 여기서 habit log API 호출
  };

  return (
    <div className="habit-list" style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* ➕ Add Habit */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a New Habit"
          style={{
            flex: 1,
            height: 36,
            padding: "0 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            height: 36,
            padding: "0 14px",
            background: "#4f46e5",
            color: "white",
            borderRadius: 6,
          }}
        >
          Add
        </button>
      </form>

      {/* 📋 Habit Cards */}
      {habits.map((habit: Habit) => (
        <div
          key={habit.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left Side */}
          {editingId === habit.id ? (
            <>
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  marginRight: 8,
                  height: 32,
                  padding: "0 8px",
                }}
              />

              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => handleSave(habit.id)}>💾</button>
                <button onClick={() => setEditingId(null)}>❌</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="checkbox"
                  checked={habit.isCompleted ?? false}
                  onChange={(e) => handleMark(habit.id, e.target.checked)}
                />
                <span className="habit-name">{habit.name}</span>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => {
                    setEditingId(habit.id);
                    setEditingName(habit.name);
                  }}
                >
                  ✏️
                </button>

                <button onClick={() => handleDelete(habit.id)}>
                  🗑
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
