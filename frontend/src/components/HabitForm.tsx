// src/components/HabitForm/HabitForm.tsx
import React, { useState } from "react";
import { createHabit } from "@/api/habitApi";
import { useHabits } from "@/hooks/useHabits";

export const HabitForm: React.FC = () => {
  const [name, setName] = useState("");
  const { habits, fetchHabits } = useHabits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createHabit({ name });
      setName("");
      fetchHabits();
    } catch (err) {
      console.error("Failed to create habit:", err);
    }
  };

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      {/* 🔹 입력 + 버튼 */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit"
          required
          style={{
            flex: 1,
            height: 36,              // ⭐ 높이 줄임
            padding: "0 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            height: 36,
            padding: "0 14px",
            borderRadius: 6,
            background: "#4f46e5",
            color: "white",
            fontSize: 14,
            whiteSpace: "nowrap",
          }}
        >
          Add
        </button>
      </form>

      {/* 🔹 습관 리스트 */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {habits.map((habit) => (
          <li
            key={habit.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: 6,
              background: "#f9f9f9",
              marginBottom: 8,
              color: "#333",
            }}
          >
            <span>{habit.name}</span>

            {/* 🔜 나중에 여기 버튼 추가 */}
            {/* <div>
              <button>Edit</button>
              <button>Delete</button>
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
};
