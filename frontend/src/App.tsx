import React from 'react';
import { HabitProgressChart } from './components/HabitProgressChart';
import HabitChart from './components/HabitChart';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Habit Tracker Progress</h1>
      {/* <HabitProgressChart /> */}
      <HabitChart />
    </div>
  );
}

export default App;
