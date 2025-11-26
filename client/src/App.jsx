import React, { useState, useEffect, useRef } from "react";
import ChatHeader from "./components/chatHeader";
import TopActions from "./components/TopActions";
import ChatMessages from "./components/chatMessages";
import ChatInput from "./components/chatInput";
import { sendChatMessage, summarizeChat, suggestNextSteps } from "./api/chatApi";
import { styles } from "./styles/chatStyles";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "model", text: "Hello! I'm the TechStore Support Bot. How can I help you today?", time: new Date() }
  ]);
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = input;

    setMessages(prev => [...prev, { role: "user", text: userMessage, time: new Date() }]);
    setInput("");
    setLoading(true);

    const data = await sendChatMessage(userMessage, sessionId);
    if (data.session_id) setSessionId(data.session_id);
    setStatus(data.status);

    setMessages(prev => [...prev, { role: "model", text: data.response, time: new Date() }]);
    setLoading(false);
  };

  const summarizeConversation = async () => {
    const data = await summarizeChat(sessionId);
    setMessages(prev => [...prev, { role: "model", text: "📝 Conversation Summary:\n\n" + data.summary, time: new Date() }]);
  };

  const suggestNextActions = async () => {
    const data = await suggestNextSteps(sessionId);
    setMessages(prev => [...prev, { role: "model", text: data.suggestions, time: new Date() }]);
  };

  return (
    <div style={styles.container}>
      <ChatHeader status={status} />
      <TopActions summarizeConversation={summarizeConversation} suggestNextActions={suggestNextActions} />
      <ChatMessages messages={messages} loading={loading} chatEndRef={chatEndRef} />
      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} disabled={status === "escalated"} />
    </div>
  );
}

export default App;
