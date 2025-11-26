import React from "react";
import { styles } from "../styles/chatStyles";

export default function TopActions({ summarizeConversation, suggestNextActions }) {
  return (
    <div style={styles.topButtons}>
      <button style={styles.smallBtn} onClick={summarizeConversation}>Summarize</button>
      <button style={styles.smallBtn} onClick={suggestNextActions}>Next Actions</button>
    </div>
  );
}
