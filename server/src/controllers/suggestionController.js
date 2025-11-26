import prisma from "../db/prisma.js";
import extractText from "../utils/extractText.js";
import { callGemini } from "../services/geminiService.js";

export async function suggestNextActions(req, res) {
  const { id } = req.params;

  try {
    const history = await prisma.message.findMany({
      where: { sessionId: id },
      orderBy: { createdAt: "asc" }
    });

    if (history.length < 3) {
      return res.json({ session_id: id, suggestions: "- Not enough conversation for suggestions yet." });
    }

    const text = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

    const systemInstruction = `
Provide 3 next actions, JSON only:
{
 "actions": ["", "", ""]
}
`;

    const geminiData = await callGemini({
      systemInstruction,
      contents: [{ role: "user", parts: [{ text }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 200 }
    });

    const aiText = extractText(geminiData).trim();

    const parsed = JSON.parse(
      aiText.replace(/```json/gi, "").replace(/```/g, "").trim()
    );

    const formatted = `🧭 Recommended Next Actions:\n\n${parsed.actions
      .map(a => `- ${a}`)
      .join("\n")}`;

    res.json({ session_id: id, suggestions: formatted });

  } catch (err) {
    console.error("Suggestion Error:", err);
    res.status(500).json({ error: "Suggestion failed" });
  }
}
