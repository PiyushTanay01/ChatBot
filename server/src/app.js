import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://chat-bot-omega-wheat.vercel.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);



app.use(express.json());

app.use("/chat", chatRoutes);
app.use("/session", sessionRoutes);
app.use("/faq", faqRoutes);

export default app;
