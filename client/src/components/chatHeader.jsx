import React from "react";
import { styles } from "../styles/chatStyles";

export default function chatHeader({ status }) {
  return (
    <div style={styles.header}>
      <h2 style={{ margin: 0 }}>TechStore Support Bot</h2>
      <div style={{ ...styles.statusBadge, color: status === "escalated" ? "#d9534f" : "#0d6efd" }}>
        {status.toUpperCase()}
      </div>
    </div>
  );
}
