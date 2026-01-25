import { useDailyGoal } from '@/context/DailyGoalContext';
import '../styles/InputDailyGoal.css';
import { useState } from 'react';

export default function InputDailyGoal () {
    const {setDailyGoal} = useDailyGoal();
    const [value, setValue] = useState<number>(5);

    const handleSetGoal = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle daily goal submission logic here

        const num = Number(value)
        if (num > 0) {
            setDailyGoal(num);
        }
    }

    return (
        <div className="input-daily-goal">
            {/* <h3>Input Daily Goal Component</h3> */}
            <form className='input-daily-goal-form' onSubmit={handleSetGoal}>
                <input className="goal-input" type="number" placeholder="Enter daily goal" onChange={(e) => setValue(Number(e.target.value))} />
                <button className="set-goal-button" type="submit">
                    Set Goal
                </button>
            </form>
        </div>
    );
}