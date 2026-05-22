"use client";
import { useState } from "react";

export default function CloudShell() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "system", text: "🚀 MosinLSOps Agentic Shell v1.0.0. System Ready." },
    { type: "system", text: "Type your infrastructure command below..." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleCommand = async (e) => {
    if (e.key === "Enter" && input.trim()) {
      const cmd = input.trim();
      setInput("");
      setHistory((prev) => [...prev, { type: "user", text: `root@mosinlsops:~$ ${cmd}` }]);
      setLoading(true);

      try {
        // Yahan par humne tumhara naya Render URL daal diya hai!
        const response = await fetch("https://mosinls-ops.onrender.com/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command: cmd })
        });
        const data = await response.json();
        setHistory((prev) => [...prev, { type: "ai", text: data.response || "No response from AI." }]);
      } catch (error) {
        setHistory((prev) => [...prev, { type: "error", text: "🚨 Connection Refused: Backend Engine is Offline." }]);
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#0a0a0a", color: "#00ff00", minHeight: "100vh", padding: "30px", fontFamily: "monospace" }}>
      <h1 style={{ color: "white", marginBottom: "5px" }}>MosinLSOps Cloud-Shell</h1>
      <p style={{ color: "gray", marginBottom: "30px" }}>AI-Native Operational Intelligence Layer</p>
      
      <div style={{ marginBottom: "20px" }}>
        {history.map((line, idx) => (
          <div key={idx} style={{ 
            color: line.type === 'error' ? '#ff3333' : line.type === 'user' ? 'white' : '#00ff00', 
            whiteSpace: "pre-wrap", 
            marginBottom: "15px",
            lineHeight: "1.5"
          }}>
            {line.text}
          </div>
        ))}
        {loading && <div style={{ color: "#ffff00" }}>⚙️ AI Engine is formulating execution plan...</div>}
      </div>
      
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <span style={{ color: "#3399ff", marginRight: "10px", fontWeight: "bold" }}>root@mosinlsops:~$</span>
        <input 
          autoFocus 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={handleCommand}
          style={{ 
            backgroundColor: "transparent", 
            color: "white", 
            border: "none", 
            outline: "none", 
            width: "100%", 
            fontSize: "16px", 
            fontFamily: "monospace" 
          }} 
          disabled={loading}
          placeholder="e.g., Write a Dockerfile for a Python app..."
        />
      </div>
    </div>
  );
}
