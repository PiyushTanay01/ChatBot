import prisma from "../db/prisma.js";
import extractText from "../utils/extractText.js";
import { callGemini } from "../services/geminiService.js";

export async function summarizeConversation(req, res) {
  const { id } = req.params;

  try {
    const history = await prisma.message.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: "asc" }
    });

    if (history.length < 3) {
      return res.json({ session_id: id, summary: "Not enough conversation to summarize yet." });
    }

    const text = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

    const systemInstruction = `
Summarize the conversation & provide next actions in JSON:
{
  "summary": "",
  "next_actions": ["", "", ""]
}
`;

    const geminiData = await callGemini({
      systemInstruction,
      contents: [{ role: "user", parts: [{ text }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 400 }
    });

    let summaryText = extractText(geminiData)
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(summaryText);

    res.json({
      session_id: id,
      summary: parsed.summary,
      next_actions: parsed.next_actions
    });

  } catch (err) {
    console.error("Summarize Error:", err);
    res.status(500).json({ error: "Failed to summarize" });
  }
}
