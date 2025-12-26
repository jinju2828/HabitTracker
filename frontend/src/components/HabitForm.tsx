import React, { useState } from "react";
import { createHabit, updateHabit, deleteHabit } from "@/api/habitApi";
import { useHabits } from "@/hooks/useHabits";

export const HabitForm: React.FC = () => {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const { habits, fetchHabits } = useHabits();

  // ➕ 새 습관
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createHabit({ name });
    setName("");
    fetchHabits();
  };

  // 💾 저장
  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;

    await updateHabit(id, editingName );
    setEditingId(null);
    setEditingName("");
    fetchHabits();
  };

  // 🗑 삭제
  const handleDelete = async (id: number) => {
    const ok = window.confirm("Delete this habit?");
    if (!ok) return;

    await deleteHabit(id);
    fetchHabits();
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* ➕ 입력 */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      {/* 📋 리스트 */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {habits.map((habit) => (
          <li
            key={habit.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              marginBottom: 8,
              background: "#f9f9f9",
              borderRadius: 6,
              color: "#333",
            }}
          >
            {editingId === habit.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1,
                    height: 32,
                    marginRight: 8,
                    padding: "0 8px",
                  }}
                />
                <button onClick={() => handleUpdate(habit.id)}>💾</button>
                <button onClick={() => setEditingId(null)}>❌</button>
              </>
            ) : (
              <>
                <span>{habit.name}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => {
                      setEditingId(habit.id);
                      setEditingName(habit.name);
                    }}
                  >
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(habit.id)}>🗑</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
