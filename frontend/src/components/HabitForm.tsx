// src/components/HabitForm/HabitForm.tsx
import React, { useState } from 'react';
import { createHabit } from '@/api/habitApi';
import { useHabits } from '@/hooks/useHabits';

// 새 습관 추가
export const HabitForm: React.FC = () => {
  const [name, setName] = useState('');
  const { habits, fetchHabits } = useHabits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createHabit({ name });
      setName('');
      fetchHabits();
    } catch (err) {
      console.error('Failed to create habit:', err);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit} 
            style={{
              // width: "100%",
              // height: "40px",
              maxWidth: 640, // ⭐ 카드랑 통일
              display: "flex",
              gap: 8,
        }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Habit"
          required
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <button type="submit"
                style={{
                  padding: "8px 14px",
                  height: "36px",
                  borderRadius: 6,
                  background: "#4f46e5",
                  color: "white",
                }}>
            Add Habit
          </button>
      </form>

      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>{habit.name}</li>
        ))}
      </ul>
    </div>
  );
};
