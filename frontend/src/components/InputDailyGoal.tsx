export default function InputDailyGoal () {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle daily goal submission logic here
    }

    return (
        <div className="input-daily-goal">
            <h3>Input Daily Goal Component</h3>
            <form onSubmit={handleSubmit}>
                <input type="number" placeholder="Enter daily goal" />
                <button type="submit">
                    Set Goal
                </button>
            </form>
        </div>
    );
}