"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setChat(prev => [...prev, userMsg]);

    // Call HF backend API
    const res = await fetch(`${backend}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input })
    });

    const data = await res.json();
    const botMsg = { role: "assistant", content: data.answer };

    setChat(prev => [...prev, botMsg]);
    setInput("");
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.heading}>YouTube Comment RAG</h1>

      <div style={styles.chatBox}>
        {chat.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.msg,
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#DCF8C6" : "#EEE"
            }}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          placeholder="Ask something about the comments..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </main>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    display: "flex",
    flexDirection: "column"
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    height: "65vh",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "20px"
  },
  msg: {
    padding: "10px",
    borderRadius: "8px",
    maxWidth: "80%"
  },
  inputRow: {
    display: "flex",
    gap: "10px"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #aaa"
  },
  button: {
    padding: "10px 18px",
    borderRadius: "8px",
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};
