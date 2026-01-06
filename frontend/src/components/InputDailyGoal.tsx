import '../styles/InputDailyGoal.css';

export default function InputDailyGoal () {

    const handleSetGoal = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle daily goal submission logic here
    }

    return (
        <div className="input-daily-goal">
            <h3>Input Daily Goal Component</h3>
            <form onSubmit={handleSetGoal}>
                <input className="goal-input" type="number" placeholder="Enter daily goal" />
                <button className="set-goal-button" type="submit">
                    Set Goal
                </button>
            </form>
        </div>
    );
}