import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Contact</h1>
      <p>If you have any questions or feedback:</p>
      <p>Email: jinju2828@gmail.com</p>
      <button 
        onClick={() => navigate("/")}
        style={{
            marginTop: 20,
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
          }}>
        ← Back to Habit Tracker
        </button>
    </div>
  );
}

export default Contact;