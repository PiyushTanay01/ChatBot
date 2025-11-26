import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://chat-bot-omega-wheat.vercel.ap
      "http://localhost:3000"                     
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors()); // handle preflight

app.use(express.json());

app.use("/chat", chatRoutes);
app.use("/session", sessionRoutes);
app.use("/faq", faqRoutes);

export default app;
