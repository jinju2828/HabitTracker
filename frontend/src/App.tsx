import { HabitProgressChart } from './components/HabitProgressChart';
import HabitChart from './components/HabitChart';
import { HabitForm } from './components/HabitForm';
import { useHabits } from './hooks/useHabits';
import { HabitCard } from './components/HabitCard';
import { HabitChartType } from './components/HabitChartType';

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

      <h2 style={{ marginTop: 30 }}>Select Chart Type</h2>
      <HabitChartType />

      <h2 style={{ marginTop: 30 }}>Progress Chart</h2>
      <HabitChart />

      <h2 style={{ marginTop: 30 }}>Each Habit Progress</h2>
      <HabitProgressChart />
    </div>
  );
}

export default App;
