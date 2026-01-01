import { useHabits } from '../hooks/useHabits';
import '../styles/DailyGoal.css';
import { useAllHabitLogs } from "../hooks/useAllHabitLogs";

export const DailyGoal: React.FC = () => {
    const {habits} = useHabits()
    const {allLogs} = useAllHabitLogs()

    console.log('DailyGoal habits:', habits.length);
    console.log('DailyGoal:', allLogs);
    
    return (
        <div className="daily-goal">Your Daily Goal: Complete 5 habits</div>
    );
};
