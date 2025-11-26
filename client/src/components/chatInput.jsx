import React from "react";
import { styles } from "../styles/chatStyles";

export default function chatInput({input,setInput,sendMessage,disabled}) {
  return (
    <div style={styles.inputArea}>
      <input
        style={styles.input}
        value={input}
        disabled={disabled}
        placeholder="Type your message..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button style={styles.sendButton} disabled={disabled} onClick={sendMessage}>Send</button>
    </div>
  );
}
