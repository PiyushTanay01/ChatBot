import prisma from "../db/prisma.js";
import { callGemini } from "../services/geminiService.js";
import extractText from "../utils/extractText.js";

export async function handleChat(req, res) {
  const { message, sessionId } = req.body;

  try {
    if (!message) return res.status(400).json({ error: "Message is required" });

    let session = sessionId
      ? await prisma.session.findUnique({ where: { id: sessionId } })
      : null;

    if (!session) {
      session = await prisma.session.create({ data: { status: "active" } });
    }

    // anger detection
    const angerWords = ["angry", "furious", "upset", "mad", "frustrated"];
    const isAngry = angerWords.some(w => message.toLowerCase().includes(w));

    if (isAngry) {
      const escalation = "I'm sorry you're upset. I'll escalate this to a human agent.";

      await prisma.message.create({ data: { role: "user", content: message, sessionId: session.id } });
      await prisma.message.create({ data: { role: "assistant", content: escalation, sessionId: session.id } });
      await prisma.session.update({ where: { id: session.id }, data: { status: "escalated" } });

      return res.json({ session_id: session.id, response: escalation, status: "escalated" });
    }

    const history = await prisma.message.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" }
    });

    const systemInstruction = `
You are TechStore's AI Support Agent.
Policies:
- 30-day return policy
- Free shipping over $50
Be helpful and polite.
Ask clarifying questions if needed.
`;

    const contents = [
      { role: "user", parts: [{ text: systemInstruction }] },
      ...history.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
      { role: "user", parts: [{ text: message }] }
    ];

    const geminiData = await callGemini({ systemInstruction, contents });
    const aiText = extractText(geminiData) || "Could you clarify please?";

    await prisma.message.create({ data: { role: "user", content: message, sessionId: session.id } });
    await prisma.message.create({ data: { role: "assistant", content: aiText, sessionId: session.id } });

    res.json({ session_id: session.id, response: aiText, status: "active" });

  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
}
