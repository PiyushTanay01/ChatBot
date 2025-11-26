const BASE_URL = "https://techstore-support-api.onrender.com";

export const sendChatMessage = (message, sessionId) =>
  fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  }).then(res => res.json());

export const summarizeChat = (sessionId) =>
  fetch(`${BASE_URL}/session/${sessionId}/summarize`, {
    method: "POST",
  }).then(res => res.json());

export const suggestNextSteps = (sessionId) =>
  fetch(`${BASE_URL}/session/${sessionId}/suggest`, {
    method: "POST",
  }).then(res => res.json());
