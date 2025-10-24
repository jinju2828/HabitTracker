import React from 'react';
import { HabitProgressChart } from './components/HabitProgressChart';
import HabitChart from './components/HabitChart';
import { HabitForm } from './components/HabitForm';
import { useHabits } from './hooks/useHabits';
import { HabitCard } from './components/HabitCard';

function App() {
  const { habits } = useHabits();

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌿 Habit Tracker</h1>
      <HabitForm />

      <h2 style={{ marginTop: 20 }}>Today's Habits</h2>
      {habits.map((habit) => (
        <HabitCard key={habit.id} id={habit.id} name={habit.name} />
      ))}

      <h2 style={{ marginTop: 30 }}>Progress Chart</h2>
      <HabitChart />

      <h2 style={{ marginTop: 30 }}>All Habits Progress</h2>
      <HabitProgressChart />
    </div>
  );
}

export default App;
