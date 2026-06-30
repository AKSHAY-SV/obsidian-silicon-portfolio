import { useState, useEffect, useCallback, useRef } from "react";
import { CopilotMessage, CopilotAnalytics } from "../types/copilot";
import { sanitizeStreamingMarkdown } from "../services/responseFormatter";

const STORAGE_KEY = "silicon_copilot_messages";
const ANALYTICS_KEY = "silicon_copilot_local_analytics";

export const SUGGESTED_QUESTIONS = [
  "What is the Helios-7 Edge AI SoC designed by Akshay?",
  "Tell me about the synthesizable RV32IM Processor Core.",
  "Which EDA and FPGA design tools does Akshay use?",
  "What certifications does Akshay hold?",
  "Show me his academic timeline at MIT Bengaluru.",
  "Explain his MESI cache controller and its challenges."
];

export function useCopilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<CopilotAnalytics>({
    interactionsCount: 0,
    averageConversationLength: 0,
    mostAskedQuestions: [],
    popularProjects: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history and analytics from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }

    const savedAnalytics = localStorage.getItem(ANALYTICS_KEY);
    if (savedAnalytics) {
      try {
        setAnalytics(JSON.parse(savedAnalytics));
      } catch (e) {
        console.error("Failed to parse saved analytics", e);
      }
    }
  }, []);

  // Save messages to localStorage when updated
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [messages]);

  // Track analytics locally and sync to server
  const trackInteraction = async (userQuestion: string, detectedProjectName?: string) => {
    // 1. Update local analytics in state & local storage
    const updatedAnalytics = { ...analytics };
    updatedAnalytics.interactionsCount += 1;

    // Track question
    const qLower = userQuestion.toLowerCase().trim();
    const existingQ = updatedAnalytics.mostAskedQuestions.find(q => q.question.toLowerCase() === qLower);
    if (existingQ) {
      existingQ.count += 1;
    } else {
      updatedAnalytics.mostAskedQuestions.push({ question: userQuestion, count: 1 });
    }
    updatedAnalytics.mostAskedQuestions.sort((a, b) => b.count - a.count);
    updatedAnalytics.mostAskedQuestions = updatedAnalytics.mostAskedQuestions.slice(0, 5);

    // Track project if present
    if (detectedProjectName) {
      const existingP = updatedAnalytics.popularProjects.find(p => p.projectName === detectedProjectName);
      if (existingP) {
        existingP.count += 1;
      } else {
        updatedAnalytics.popularProjects.push({ projectName: detectedProjectName, count: 1 });
      }
      updatedAnalytics.popularProjects.sort((a, b) => b.count - a.count);
      updatedAnalytics.popularProjects = updatedAnalytics.popularProjects.slice(0, 5);
    }

    // Calculate conversation length average
    const userMsgCount = messages.filter(m => m.role === "user").length + 1;
    updatedAnalytics.averageConversationLength = Math.round(
      ((updatedAnalytics.averageConversationLength * (updatedAnalytics.interactionsCount - 1) + userMsgCount) /
        updatedAnalytics.interactionsCount) *
        10
    ) / 10;

    setAnalytics(updatedAnalytics);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(updatedAnalytics));

    // 2. Fire-and-forget server sync
    try {
      await fetch("/api/copilot/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          projectName: detectedProjectName,
          sessionLength: userMsgCount
        })
      });
    } catch (e) {
      // Ignore background track failures in client
    }
  };

  // Auto detect which parts of the portfolio are cited in the response text
  const attributeSources = (text: string): string[] => {
    const sources: string[] = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes("rv32im") || lowerText.includes("pipeline") || lowerText.includes("eight-bit") || lowerText.includes("register") || lowerText.includes("lut")) {
      sources.push("Projects (RTL Core)");
    }
    if (lowerText.includes("helios") || lowerText.includes("soc") || lowerText.includes("7nm") || lowerText.includes("finfet") || lowerText.includes("innovus")) {
      sources.push("Projects (ASIC SoC)");
    }
    if (lowerText.includes("cache") || lowerText.includes("mesi") || lowerText.includes("coherency") || lowerText.includes("snoop")) {
      sources.push("Projects (Memory Cache)");
    }
    if (lowerText.includes("manipal") || lowerText.includes("b.tech") || lowerText.includes("mit") || lowerText.includes("electronics")) {
      sources.push("Education (MIT Bengaluru)");
    }
    if (lowerText.includes("arm") || lowerText.includes("coursera") || lowerText.includes("embedded") || lowerText.includes("ucb") || lowerText.includes("duke")) {
      sources.push("Certifications");
    }
    if (lowerText.includes("systemverilog") || lowerText.includes("verilog") || lowerText.includes("vivado") || lowerText.includes("synopsys")) {
      sources.push("Core Skills & EDA Tools");
    }

    if (sources.length === 0) {
      sources.push("Portfolio Knowledge Base");
    }

    return Array.from(new Set(sources));
  };

  // Send message implementation with full streaming compatibility
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    // Identify if question matches any project keyword
    let detectedProject: string | undefined = undefined;
    const contentLower = content.toLowerCase();
    if (contentLower.includes("rv32im") || contentLower.includes("cpu") || contentLower.includes("processor")) {
      detectedProject = "RV32IM Processor";
    } else if (contentLower.includes("helios") || contentLower.includes("7nm") || contentLower.includes("soc")) {
      detectedProject = "Helios-7 SoC";
    } else if (contentLower.includes("axi") || contentLower.includes("crossbar") || contentLower.includes("interconnect")) {
      detectedProject = "AXI4 Interconnect";
    } else if (contentLower.includes("cache") || contentLower.includes("mesi")) {
      detectedProject = "L2 Cache Controller";
    }

    // Record interaction analytics
    trackInteraction(content, detectedProject);

    // Create user message
    const userMessage: CopilotMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // Prepare message history for Gemini API
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Create container for assistant message
    const assistantMessageId = `msg-${Date.now()}-assistant`;
    const newAssistantMessage: CopilotMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, newAssistantMessage]);

    // Setup abort controller to allow stopping mid-generation
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`Server returned status code ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream is not supported by this server response.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let partialContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        partialContent += chunk;

        // Perform real-time sanitization of inline block formatting
        const sanitizedContent = sanitizeStreamingMarkdown(partialContent);

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: sanitizedContent }
              : msg
          )
        );
      }

      // Final complete pass including full source attribution
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id === assistantMessageId) {
            const finalContent = partialContent.trim();
            const sources = attributeSources(finalContent);
            return {
              ...msg,
              content: finalContent,
              sources,
              suggestedFollowUps: generateFollowUps(finalContent)
            };
          }
          return msg;
        })
      );

    } catch (err: any) {
      if (err.name === "AbortError") {
        // Safe stream cancellation, clean up
        console.log("Copilot streaming generation aborted.");
      } else {
        console.error("Copilot stream fetch failure", err);
        setError(err.message || "An unexpected error occurred. Please try again.");
        // Clean up the incomplete assistant message if empty
        setMessages(prev => prev.filter(m => m.id !== assistantMessageId || m.content.length > 0));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, analytics]);

  // Cancel any active streaming request
  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  // Regenerate last response
  const regenerateLastResponse = useCallback(() => {
    if (messages.length < 2 || isLoading) return;

    // Find the last user message
    const history = [...messages];
    let lastUserIndex = -1;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].role === "user") {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const lastUserMessage = history[lastUserIndex];
    // Keep history up to that last user message and call send
    const cleanedHistory = history.slice(0, lastUserIndex);
    setMessages(cleanedHistory);
    sendMessage(lastUserMessage.content);
  }, [messages, isLoading, sendMessage]);

  // Clear chat logs
  const clearConversation = useCallback(() => {
    stopGeneration();
    setMessages([]);
    setError(null);
  }, [stopGeneration]);

  // Helper to generate dynamic suggested questions based on keywords found in model output
  const generateFollowUps = (text: string): string[] => {
    const textLower = text.toLowerCase();
    const followUps: string[] = [];

    if (textLower.includes("rv32im") || textLower.includes("processor")) {
      followUps.push("How was the RV32IM processor core verified?");
      followUps.push("What's the difference between his single core and SoC projects?");
    }
    if (textLower.includes("helios") || textLower.includes("7nm")) {
      followUps.push("Tell me more about the physical clock tree synthesis on Helios-7.");
      followUps.push("What tools did he use to check NPU power IR drop?");
    }
    if (textLower.includes("cache") || textLower.includes("mesi")) {
      followUps.push("How did snoop buffers prevent Cache coherence deadlocks?");
      followUps.push("Which formal tool verified the L2 cache controller?");
    }
    if (textLower.includes("manipal") || textLower.includes("mit")) {
      followUps.push("What research papers has Akshay published at MIT Bengaluru?");
      followUps.push("What is his GPA/Academic standing in electronics?");
    }

    // Default general follow-ups
    if (followUps.length < 2) {
      followUps.push("Show me Akshay's synthesizable hardware projects.");
      followUps.push("What digital RTL skills does he have?");
    }

    return Array.from(new Set(followUps)).slice(0, 3);
  };

  return {
    messages,
    isOpen,
    isLoading,
    error,
    analytics,
    setIsOpen,
    sendMessage,
    stopGeneration,
    clearConversation,
    regenerateLastResponse,
  };
}
