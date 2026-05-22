"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Hacker Connection to Database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CloudShell() {
  // Auth States
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [authMsg, setAuthMsg] = useState("");

  // Terminal States
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "system", text: "🚀 MosinLSOps Agentic Shell v1.0.0. System Ready." },
    { type: "system", text: "Type your infrastructure command below..." }
  ]);
  const [loading, setLoading] = useState(false);

  // Check Login Status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Secure Auth System
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthMsg("Processing...");
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthMsg("🚨 " + error.message);
      else setAuthMsg("Access Granted!");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthMsg("🚨 " + error.message);
      else setAuthMsg("✅ Account Created! Click 'Login Here' below to enter.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // AI Command Execution
  const handleCommand = async (e) => {
    if (e.key === "Enter" && input.trim()) {
      const cmd = input.trim();
      setInput("");
      setHistory((prev) => [...prev, { type: "user", text: `root@mosinlsops:~$ ${cmd}` }]);
      setLoading(true);

      try {
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

  // ------------------------------------
  // UI 1: LOGIN SCREEN (Locked State)
  // ------------------------------------
  if (!session) {
    return (
      <div style={{ backgroundColor: "#0a0a0a", color: "#00ff00", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
        <div style={{ border: "1px solid #00ff00", padding: "40px", borderRadius: "10px", width: "400px", textAlign: "center", boxShadow: "0 0 20px #00ff0033" }}>
          <h2 style={{ color: "white", letterSpacing: "2px", margin: "0 0 5px 0" }}>MosinLSOps</h2>
          <p style={{ color: "gray", marginBottom: "30px" }}>SECURE CLOUD TERMINAL</p>
          
          <form onSubmit={handleAuth}>
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: "90%", padding: "12px", marginBottom: "15px", backgroundColor: "#111", color: "#0f0", border: "1px solid #333", outline: "none" }} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: "90%", padding: "12px", marginBottom: "20px", backgroundColor: "#111", color: "#0f0", border: "1px solid #333", outline: "none" }} 
            />
            <button type="submit" style={{ width: "95%", padding: "12px", backgroundColor: "#00ff00", color: "#000", fontWeight: "bold", cursor: "pointer", border: "none", fontSize: "16px" }}>
              {isLogin ? "INITIALIZE SYSTEM" : "GENERATE KEYS (SIGN UP)"}
            </button>
          </form>
          
          <p style={{ marginTop: "15px", color: "#ff3333" }}>{authMsg}</p>
          
          <p style={{ marginTop: "20px", cursor: "pointer", color: "#3399ff", textDecoration: "underline" }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "[ No Keys? Create Account ]" : "[ Have Keys? Login Here ]"}
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------
  // UI 2: ACTUAL TERMINAL (Unlocked State)
  // ------------------------------------
  return (
    <div style={{ backgroundColor: "#0a0a0a", color: "#00ff00", minHeight: "100vh", padding: "30px", fontFamily: "monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "15px", marginBottom: "20px" }}>
        <div>
          <h1 style={{ color: "white", margin: "0 0 5px 0" }}>MosinLSOps Cloud-Shell</h1>
          <span style={{ color: "gray", fontSize: "14px" }}>Logged in as: {session.user.email}</span>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: "transparent", color: "#ff3333", border: "1px solid #ff3333", padding: "8px 15px", cursor: "pointer", borderRadius: "5px" }}>
          DISCONNECT
        </button>
      </div>
      
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
          placeholder="e.g., Write a highly available Kubernetes YAML..."
        />
      </div>
    </div>
  );
}
