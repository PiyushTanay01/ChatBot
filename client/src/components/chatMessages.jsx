import React from "react";
import { styles } from "../styles/chatStyles";

export default function chatMessages({ messages, loading, chatEndRef }) {
  return (
    <div style={styles.chatBox}>
      {messages.map((msg, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column" }}>
          <div style={styles.msgBubble(msg.role)}>{msg.text}</div>
          <div style={styles.timestamp}>{msg.time.toLocaleTimeString()}</div>
        </div>
      ))}
      {loading && <div style={styles.msgBubble("model")}><em>Typing...</em></div>}
      <div ref={chatEndRef}></div>
    </div>
  );
}
