import { useHabits } from '../hooks/useHabits';
import '../styles/DailyGoal.css';

export const DailyGoal: React.FC = () => {
    const {habits} = useHabits()

    
    return (
        <div className="daily-goal">Your Daily Goal</div>
    );
};
