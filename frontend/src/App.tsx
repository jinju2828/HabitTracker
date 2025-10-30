import React from 'react';
import { HabitForm } from './components/HabitForm';
import { useHabits } from './hooks/useHabits';
import { HabitCard } from './components/HabitCard';
import { HabitProgressChart } from './components/HabitProgressChart';

function App() {
  const { habits } = useHabits();

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌿 Habit Tracker</h1>

      {/* 습관 추가 */}
      <HabitForm />

      {/* 오늘의 습관 카드 */}
      <h2 style={{ marginTop: 20 }}>Today's Habits</h2>
      {habits.map((habit) => (
        <HabitCard key={habit.id} id={habit.id} name={habit.name} />
      ))}

      {/* 각 습관 진행 차트 */}
      <h2 style={{ marginTop: 30 }}>Each Habit Progress</h2>
      <HabitProgressChart />
    </div>
  );
}

export default App;
