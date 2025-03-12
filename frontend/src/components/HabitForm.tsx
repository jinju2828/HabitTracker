// src/components/HabitForm/HabitForm.tsx
import React, { useState } from 'react';
import { createHabit } from '@/api/habitApi';
import { useHabits } from '@/hooks/useHabits';

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
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Habit"
          required
        />
        <button type="submit">Add Habit</button>
      </form>

      <ul>
        {habits.map((habit) => (
          <li key={habit.id}>{habit.name}</li>
        ))}
      </ul>
    </div>
  );
};
