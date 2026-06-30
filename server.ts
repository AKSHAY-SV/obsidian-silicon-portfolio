import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { buildSystemInstruction } from "./src/services/contextBuilder";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory Analytics
const analytics = {
  interactionsCount: 0,
  averageConversationLength: 0,
  totalSessions: 0,
  mostAskedQuestions: [] as { question: string; count: number }[],
  popularProjects: [] as { projectName: string; count: number }[],
};

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Analytics tracking endpoint
app.post("/api/copilot/track", (req, res) => {
  try {
    const { question, projectName, sessionLength } = req.body;

    analytics.interactionsCount += 1;

    if (sessionLength !== undefined) {
      if (analytics.totalSessions === 0) {
        analytics.totalSessions = 1;
        analytics.averageConversationLength = sessionLength;
      } else {
        const totalLen = analytics.averageConversationLength * analytics.totalSessions + sessionLength;
        analytics.totalSessions += 1;
        analytics.averageConversationLength = Math.round((totalLen / analytics.totalSessions) * 10) / 10;
      }
    }

    if (question) {
      const qLower = question.trim().toLowerCase();
      const existingQ = analytics.mostAskedQuestions.find(
        (q) => q.question.toLowerCase() === qLower
      );
      if (existingQ) {
        existingQ.count += 1;
      } else {
        analytics.mostAskedQuestions.push({ question: question.trim(), count: 1 });
      }
      // Sort and limit
      analytics.mostAskedQuestions.sort((a, b) => b.count - a.count);
      analytics.mostAskedQuestions = analytics.mostAskedQuestions.slice(0, 10);
    }

    if (projectName) {
      const pTrimmed = projectName.trim();
      const existingP = analytics.popularProjects.find(
        (p) => p.projectName === pTrimmed
      );
      if (existingP) {
        existingP.count += 1;
      } else {
        analytics.popularProjects.push({ projectName: pTrimmed, count: 1 });
      }
      // Sort and limit
      analytics.popularProjects.sort((a, b) => b.count - a.count);
      analytics.popularProjects = analytics.popularProjects.slice(0, 10);
    }

    res.json({ success: true, analytics });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics endpoint
app.get("/api/copilot/analytics", (req, res) => {
  res.json(analytics);
});

// Stream Gemini Chat API Route
app.post("/api/copilot/chat", async (req, res) => {
  // Set up streaming response headers
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.write("Error: 'messages' array is required in the request body.");
      res.end();
      return;
    }

    const ai = getAI();
    const systemInstruction = buildSystemInstruction();

    // Map roles to role format: 'user' or 'model'. Gemini content format expects 'user' and 'model'.
    const contents = messages.map((m: any) => {
      const role = m.role === "assistant" ? "model" : "user";
      return {
        role,
        parts: [{ text: m.content }],
      };
    });

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.2, // Keep it precise and deterministic for factual Q&A
      },
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }

    res.end();
  } catch (err: any) {
    console.error("Gemini stream error:", err);
    res.write(`Error: ${err.message || "Internal server error connecting to Gemini API."}`);
    res.end();
  }
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
