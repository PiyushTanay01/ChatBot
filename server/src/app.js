import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";

const app = express();
app.use(
  cors({
    origin: [
      "https://techstore-support.vercel.app",   // your deployed frontend
      "http://localhost:3000"                   // local development
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.use("/chat", chatRoutes);
app.use("/session", sessionRoutes);
app.use("/faq", faqRoutes);

export default app;
