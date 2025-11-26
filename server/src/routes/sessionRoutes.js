import express from "express";
import { summarizeConversation } from "../controllers/summaryController.js";
import { suggestNextActions } from "../controllers/suggestionController.js";

const router = express.Router();

router.post("/:id/summarize", summarizeConversation);
router.post("/:id/suggest", suggestNextActions);

export default router;
