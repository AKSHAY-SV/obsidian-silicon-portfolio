import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, X, Trash2, Cpu, Sparkles, Terminal, ShieldAlert, Zap, BarChart2, MessageSquare, CornerDownLeft, Play, RefreshCw 
} from "lucide-react";
import { SUGGESTED_QUESTIONS } from "../../hooks/useCopilot";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import SuggestionCard from "./SuggestionCard";

interface CopilotWindowProps {
  copilotState: {
    messages: any[];
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
    analytics: any;
    setIsOpen: (open: boolean) => void;
    sendMessage: (content: string) => Promise<void>;
    stopGeneration: () => void;
    clearConversation: () => void;
    regenerateLastResponse: () => void;
  };
}

export default function CopilotWindow({ copilotState }: CopilotWindowProps) {
  const {
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
  } = copilotState;

  const [input, setInput] = useState("");
  const [showAnalyticsTab, setShowAnalyticsTab] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleSuggestionClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <motion.div
      id="copilot-window"
      className="fixed bottom-24 right-6 w-[440px] max-w-[calc(100vw-3rem)] h-[620px] max-h-[calc(100vh-8rem)] rounded-3xl backdrop-blur-xl bg-zinc-950/90 border border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden z-50 font-sans"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60 bg-zinc-900/40">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Cpu className="h-5 w-5 animate-pulse" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-ping" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold font-display text-zinc-100 flex items-center gap-1.5">
              Silicon Copilot
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300">
                v1.2
              </span>
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">
              {showAnalyticsTab ? "System Diagnostic Monitor" : "Principal AI Engineer Core"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Analytics monitor Toggle */}
          <button
            onClick={() => setShowAnalyticsTab(!showAnalyticsTab)}
            className={`p-2 rounded-xl border transition-all duration-200 ${
              showAnalyticsTab
                ? "bg-purple-950/40 border-purple-800/40 text-purple-400"
                : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            }`}
            title="Local Analytics Diagnostic Monitor"
          >
            <BarChart2 className="h-4 w-4" />
          </button>

          {/* Clear conversation logs */}
          <button
            onClick={clearConversation}
            className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/40 transition-all duration-200"
            title="Clear memory logs"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          {/* Close assist button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-all duration-200"
            title="Minimize"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CONTENT PANEL */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4" ref={scrollContainerRef}>
        <AnimatePresence mode="wait">
          {showAnalyticsTab ? (
            /* ANALYTICS TERMINAL VIEW */
            <motion.div
              key="analytics"
              className="space-y-4 font-mono text-xs text-zinc-400 h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 text-purple-400 border-b border-zinc-800/40 pb-2 mb-2">
                <Terminal className="h-4 w-4" />
                <span className="font-semibold text-zinc-300">COPILOT_DIAGNOSTICS.sh</span>
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <div className="text-zinc-500 text-[10px]">TOTAL_INTERACTIONS</div>
                  <div className="text-xl font-bold font-sans text-purple-400 mt-1">
                    {analytics.interactionsCount}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <div className="text-zinc-500 text-[10px]">AVG_CONV_LENGTH</div>
                  <div className="text-xl font-bold font-sans text-purple-400 mt-1">
                    {analytics.averageConversationLength} <span className="text-xs font-mono text-zinc-500">msgs</span>
                  </div>
                </div>
              </div>

              {/* Popular projects section */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-2.5">
                <div className="text-zinc-400 text-[11px] border-b border-zinc-800/60 pb-1.5 font-sans font-medium flex items-center justify-between">
                  <span>MOST REFERENCED PROJECTS</span>
                  <span className="text-[9px] text-zinc-600 font-mono">COUNT</span>
                </div>
                {analytics.popularProjects.length === 0 ? (
                  <div className="text-[11px] text-zinc-600 italic py-1">No references registered yet.</div>
                ) : (
                  <div className="space-y-1.5">
                    {analytics.popularProjects.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="text-purple-300">↳ {p.projectName}</span>
                        <span className="text-zinc-500">{p.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Asked questions section */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-2.5">
                <div className="text-zinc-400 text-[11px] border-b border-zinc-800/60 pb-1.5 font-sans font-medium flex items-center justify-between">
                  <span>POPULAR USER QUERIES</span>
                  <span className="text-[9px] text-zinc-600 font-mono">COUNT</span>
                </div>
                {analytics.mostAskedQuestions.length === 0 ? (
                  <div className="text-[11px] text-zinc-600 italic py-1">No questions captured yet.</div>
                ) : (
                  <div className="space-y-1.5">
                    {analytics.mostAskedQuestions.map((q, idx) => (
                      <div key={idx} className="flex justify-between items-start text-[11px] gap-4">
                        <span className="text-zinc-300 truncate">↳ "{q.question}"</span>
                        <span className="text-zinc-500 flex-shrink-0">{q.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-[10px] text-zinc-600 flex items-center gap-1.5 pt-2">
                <Zap className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span>Gemini API Stream Client: OK (gemini-3.5-flash)</span>
              </div>
            </motion.div>
          ) : messages.length === 0 ? (
            /* EMPTY CONVERSATION GREETING VIEW */
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center text-center h-full py-4 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-900/30 to-zinc-900 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                  <Cpu className="h-8 w-8 animate-pulse text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold font-display text-zinc-200">
                    Akshay's Silicon Copilot
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-xs mt-1">
                    Ask me anything about Akshay's synthesizable processor cores, 7nm Edge-AI SoC, achievements, education, and VLSI expertise.
                  </p>
                </div>
              </div>

              {/* BENTO GRID SUGGESTED TOPICS */}
              <div className="w-full space-y-2.5">
                <div className="text-[10px] text-zinc-500 font-mono text-left tracking-wider uppercase ml-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-purple-400" /> Suggested Inquiries
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED_QUESTIONS.slice(0, 4).map((question, idx) => (
                    <SuggestionCard
                      key={idx}
                      question={question}
                      onClick={handleSuggestionClick}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* MAIN CHAT CONVERSATION LOGS VIEW */
            <motion.div
              key="chat"
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onFollowUpClick={handleSuggestionClick}
                />
              ))}

              {/* Typing loader */}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <TypingIndicator />
              )}

              {/* Error fallback display */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-900/40 text-red-400 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-400" />
                  <div className="space-y-1">
                    <p className="font-semibold font-display">Connection Interrupted</p>
                    <p className="text-red-400/80 leading-relaxed">{error}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER INPUT CONTROLS SECTION */}
      <div className="p-4 border-t border-zinc-800/60 bg-zinc-900/30">
        {!showAnalyticsTab && (
          <form onSubmit={handleSubmit} className="flex gap-2 relative items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query hardware design capabilities..."
              disabled={isLoading}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800/80 focus:bg-zinc-900 text-zinc-100 placeholder-zinc-500 text-xs rounded-2xl pl-4 pr-11 py-3.5 border border-zinc-800 hover:border-zinc-700/80 focus:border-purple-800/60 focus:outline-none transition-all"
            />

            <div className="absolute right-2 flex items-center gap-1">
              {isLoading ? (
                /* Streaming status indicator or STOP button */
                <button
                  type="button"
                  onClick={stopGeneration}
                  className="p-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-purple-100 hover:text-white transition-colors cursor-pointer"
                  title="Stop generating"
                >
                  <motion.div
                    className="h-3 w-3 bg-white"
                    animate={{ scale: [1, 0.8, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </button>
              ) : (
                /* Send icon button */
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    input.trim()
                      ? "bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                      : "bg-zinc-800/40 text-zinc-600 cursor-not-allowed"
                  }`}
                  title="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>
        )}

        {showAnalyticsTab && (
          <div className="text-center">
            <button
              onClick={() => setShowAnalyticsTab(false)}
              className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1.5 mx-auto py-1"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Return to Active Assistant Chat</span>
            </button>
          </div>
        )}

        {/* Dynamic regenerate helper display */}
        {!isLoading && messages.length >= 2 && !showAnalyticsTab && (
          <div className="flex justify-between items-center mt-2.5 px-1">
            <span className="text-[10px] text-zinc-500 font-mono">
              Press Enter <CornerDownLeft className="inline h-2 w-2 text-zinc-600" /> to dispatch
            </span>
            <button
              onClick={regenerateLastResponse}
              className="text-[10px] text-zinc-500 hover:text-purple-400 font-mono flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> Regenerate response
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
