import { useState } from "react";

const moods = [
  { emoji: "😊", label: "Happy", color: "#FFD93D" },
  { emoji: "😢", label: "Sad", color: "#6BCFF6" },
  { emoji: "😡", label: "Angry", color: "#FF6B6B" },
  { emoji: "😰", label: "Anxious", color: "#C77DFF" },
  { emoji: "😴", label: "Tired", color: "#95D5B2" },
  { emoji: "🔥", label: "Motivated", color: "#FF9A3C" },
];

export default function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [message, setMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setAiReply("");
  };

  const handleSubmit = async () => {
    if (!selectedMood || !message) return;
    setLoading(true);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `I am feeling ${selectedMood.label} today. ${message}. Give me a short, warm, supportive response in 2-3 lines like a caring friend.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.content[0].text;
    setAiReply(reply);
    setMoodHistory((prev) => [
      { mood: selectedMood, message, reply, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 4),
    ]);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)", padding: "20px", fontFamily: "sans-serif", color: "white" }}>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>🧠 MindSync AI</h1>
        <p style={{ color: "#aaa", marginTop: "8px" }}>Your personal mental wellness companion</p>
      </div>

      {/* Mood Selection */}
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.1rem", color: "#ccc" }}>How are you feeling today?</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelect(mood)}
              style={{
                padding: "12px 20px",
                borderRadius: "50px",
                border: selectedMood?.label === mood.label ? `2px solid ${mood.color}` : "2px solid transparent",
                background: selectedMood?.label === mood.label ? `${mood.color}22` : "rgba(255,255,255,0.08)",
                color: "white",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {mood.emoji} {mood.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
        <h2 style={{ marginTop: 0, fontSize: "1.1rem", color: "#ccc" }}>Tell me more...</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind today?"
          style={{
            width: "100%", height: "100px", background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
            color: "white", padding: "12px", fontSize: "1rem", resize: "none", boxSizing: "border-box"
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!selectedMood || !message || loading}
          style={{
            marginTop: "12px", padding: "12px 30px", borderRadius: "50px",
            background: selectedMood ? `linear-gradient(135deg, ${selectedMood.color}, #fff3)` : "#444",
            border: "none", color: "white", fontSize: "1rem",
            cursor: selectedMood && message ? "pointer" : "not-allowed", fontWeight: "bold"
          }}
        >
          {loading ? "Thinking... 🤔" : "Talk to MindSync AI 🚀"}
        </button>
      </div>

      {/* AI Reply */}
      {aiReply && (
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", marginBottom: "20px", borderLeft: `4px solid ${selectedMood?.color}` }}>
          <h2 style={{ marginTop: 0, fontSize: "1rem", color: "#aaa" }}>🤖 MindSync says:</h2>
          <p style={{ margin: 0, lineHeight: "1.7", fontSize: "1.05rem" }}>{aiReply}</p>
        </div>
      )}

      {/* Mood History */}
      {moodHistory.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.1rem", color: "#ccc" }}>📊 Recent Moods</h2>
          {moodHistory.map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "12px", marginBottom: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>{item.mood.emoji}</span>
              <span style={{ marginLeft: "8px", color: "#aaa", fontSize: "0.85rem" }}>{item.time}</span>
              <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: "#ddd" }}>{item.reply}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}