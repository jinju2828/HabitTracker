import React from 'react';
import { HabitProgressChart } from './components/HabitProgressChart';
import HabitChart from './components/HabitChart';
import { HabitForm } from './components/HabitForm';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Habit Tracker Progress</h1>
      <HabitForm />
      <HabitChart />
      <HabitProgressChart />
    </div>
  );
}

export default App;
