import { useHabits } from '../hooks/useHabits';
import '../styles/DailyGoal.css';
import { useAllHabitLogs } from "../hooks/useAllHabitLogs";
import { useState } from 'react';
import InputDailyGoal from './InputDailyGoal';

// const DAILY_GOAL = 5;

interface HabitLog {
  log_date: string; // "YYYY-MM-DD"
  completed: number | boolean;
}

interface Props {
  allLogs: HabitLog[];
}


export default function DailyGoal ({ allLogs }: Props) {
    const {habits} = useHabits()
    // const {allLogs} = useAllHabitLogs()
    const default_daily_goal = 5;
    const [DAILY_GOAL, setDailyGoal] = useState(default_daily_goal);

    console.log('DailyGoal habits:', habits.length);
    console.log('DailyGoal:', allLogs);
    
    const todayLocal = new Date().toLocaleDateString("en-CA");

    const todayCompletedCount = Object.values(allLogs)
        .flat()
        .filter((log) => {
        return (
            log.log_date.slice(0, 10) === todayLocal &&
            log.completed
        );
        }).length;


    return (
        <div className="daily-goal">
        <h3>Daily Goal</h3>
        <InputDailyGoal />
        <p>
            {todayCompletedCount} / {DAILY_GOAL} completed
        </p>

        {todayCompletedCount >= DAILY_GOAL && (
            <p className="goal-done">🎉 Goal achieved!</p>
        )}
        </div>
    );

};
