export default function extractText(data) {
  try {
    const parts = data?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
      return parts.map(p => (typeof p.text === "string" ? p.text : "")).join("\n").trim();
    }
    return null;
  } catch {
    return null;
  }
}
