import fs from "fs";
import path from "path";

const FAQ_FILE = path.join(process.cwd(), "server", "faqs.json");

let FAQS = [];
try {
  FAQS = JSON.parse(fs.readFileSync(FAQ_FILE, "utf8"));
} catch (err) {
  console.warn("FAQ file missing or invalid");
}

export function faqController(req, res) {
  res.json({ faqs: FAQS });
}
