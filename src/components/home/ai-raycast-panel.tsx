"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { 
  Sparkles, 
  FileText, 
  Search, 
  Cloud, 
  FileCode, 
  MessageSquare,
  ChevronRight,
  Cpu,
  ArrowRight,
  CornerDownLeft,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjects } from "@/stores/projects-store";
import { useSiteCMSStore } from "@/stores/site-cms-store";

interface AIAction {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

export function AiRaycastPanel() {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [activeActionLabel, setActiveActionLabel] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const projects = useProjects();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const dashboardShowcase = useSiteCMSStore((state) => state.cms.dashboardShowcase);

  const actions: AIAction[] = [
    { id: "summarize", label: "Summarize Project", sublabel: "Compress README parameters", icon: <LucideIcons.FileText className="w-3.5 h-3.5 text-accent-blue" /> },
    { id: "find_doc", label: "Find Documentation", sublabel: "Query platform manuals", icon: <LucideIcons.Search className="w-3.5 h-3.5 text-purple-400" /> },
    { id: "health", label: "Check Deployments", sublabel: "Query edge health status", icon: <LucideIcons.Cloud className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: "readme", label: "Generate README", sublabel: "Draft codebase documentation", icon: <LucideIcons.FileCode className="w-3.5 h-3.5 text-amber-400" /> },
    { id: "ask", label: "Ask Anything", sublabel: "Ask about Kiwik systems", icon: <LucideIcons.MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> }
  ];

  // Auto-scroll chat history
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleActionClick = (id: string, label: string) => {
    setActiveAction(id);
    setActiveActionLabel(label);
    setInputVal("");
    
    // Set initial custom welcome message based on selected workflow
    let welcome = "";
    switch (id) {
      case "summarize":
        welcome = "🤖 Selected: Summarize Project. Ask me about any published Kiwik project to compile a summary.";
        break;
      case "find_doc":
        welcome = "🤖 Selected: Find Documentation. Ask about technical features (e.g. Next.js, Prisma, Tailwind version, or rules) to query manual logs.";
        break;
      case "health":
        welcome = "🤖 Selected: Check Deployments. Current edge health: 100% operational. Ask me about serverless aliases, routing latency, or edge nodes.";
        break;
      case "readme":
        welcome = "🤖 Selected: Generate README. Describe your project concept and I'll structure a custom README markdown template.";
        break;
      case "ask":
      default:
        welcome = "🤖 Selected: Ask Anything. Ask me about Kiwik developers, project statuses, tech stacks, or latency values!";
        break;
    }

    setMessages([{ sender: "bot", text: welcome }]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userText = inputVal.trim();
    setInputVal("");
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      // Fetch backend model endpoint response
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { sender: "user", text: userText }],
          projectsContext: projects
        })
      });

      const data = await res.json();
      
      if (data.reply && !data.fallback) {
        setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
        setLoading(false);
        return;
      }
      
      // Intelligent fallback matching rules if no Groq API Key is set in backend
      setTimeout(() => {
        let reply = "";
        const lower = userText.toLowerCase();

        // Answers are derived from the live projects list. These branches used
        // to return hardcoded summaries for CriskaAI, CriskaCloud, CriskaPay,
        // CriskaOS, CriskaBot and Kiwik.1 — none of which exist any more — with
        // invented versions and telemetry. Because the LLM route was failing,
        // this fallback was what visitors actually saw.
        const names = projects.map((p) => p.name).filter(Boolean);
        const match = projects.find(
          (p) =>
            (p.name && lower.includes(p.name.toLowerCase())) ||
            (p.slug && lower.includes(p.slug.toLowerCase()))
        );

        if (activeAction === "summarize" || lower.includes("project") || lower.includes("summar")) {
          if (match) {
            const stack = (match.techStack || []).map((t: any) => t?.name).filter(Boolean).slice(0, 6);
            reply =
              `🤖 **${match.name} Summary**:\n` +
              `- **Status**: ${(match.status || "unknown").replace("-", " ")} (${match.completionPercent ?? 0}% complete)\n` +
              (match.version ? `- **Version**: ${match.version}\n` : "") +
              (stack.length ? `- **Stack**: ${stack.join(", ")}\n` : "") +
              (match.tagline ? `- **Use**: ${match.tagline}` : "");
          } else if (names.length) {
            reply = `🤖 I can compile summaries for ${names.join(", ")}. Which one would you like to explore?`;
          } else {
            reply = "🤖 No projects are published yet.";
          }
        } else if (activeAction === "health" || lower.includes("deploy") || lower.includes("health") || lower.includes("latency")) {
          const live = projects.filter((p) => p.deploymentStatus === "live").length;
          reply =
            `🤖 **Deployment status**:\n- **Projects tracked**: ${projects.length}\n` +
            `- **Live deployments**: ${live}\n` +
            `- **Detail**: open any project for its live and source links.`;
        } else if (lower.includes("tech") || lower.includes("stack") || lower.includes("database")) {
          const allStack = Array.from(
            new Set(projects.flatMap((p) => (p.techStack || []).map((t: any) => t?.name)).filter(Boolean))
          ).slice(0, 12);
          reply = allStack.length
            ? `🤖 **Stack across Kiwik projects**:\n- ${allStack.join("\n- ")}`
            : "🤖 No stack information is published yet.";
        } else {
          reply = `🤖 Chatbot context active under [${activeActionLabel}]. Ask about project metrics, team credentials, or technical documentation parameters!`;
        }

        setMessages(prev => [...prev, { sender: "bot", text: reply }]);
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error("Chat panel error:", err);
      setMessages(prev => [...prev, { sender: "bot", text: "🤖 Telemetry endpoint disconnected. Please verify connection configurations." }]);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[340px] select-none mx-auto xl:mx-0">
      <div className="vision-glass border border-white/50 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 min-h-[580px] justify-between relative overflow-hidden transform-gpu">
        
        {/* Header Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-secondary uppercase tracking-widest font-bold">
              <Sparkles className="w-3 h-3 text-accent-blue" />
              <span>KIWIK AI</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-semibold text-emerald-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{dashboardShowcase?.badges?.[0] || "Ready"}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-text-primary">
            {!activeAction ? "How can I help you today?" : activeActionLabel}
          </h3>
        </div>

        {/* Panel Main Display */}
        <div className="flex-1 flex flex-col justify-between mt-2 gap-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {!activeAction ? (
              // Actions list
              <motion.div 
                key="actions-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-1.5"
              >
                {actions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleActionClick(act.id, act.label)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-200/40 dark:hover:bg-white/5 border border-transparent hover:border-glass-border transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-bg-secondary/60 border border-glass-border text-text-secondary group-hover:scale-105 transition-transform">
                        {act.icon}
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-text-primary tracking-tight leading-tight">
                          {act.label}
                        </div>
                        <div className="text-[9px] text-text-secondary font-mono mt-0.5 leading-none">
                          {act.sublabel}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </motion.div>
            ) : (
              // ACTIVE CHAT SCREEN WINDOW
              <motion.div
                key="chat-screen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col justify-between overflow-hidden"
              >
                {/* Scrollable messages container */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[380px] scrollbar-thin select-text">
                  {messages.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "flex flex-col max-w-[85%] text-[10px] leading-relaxed p-2.5 rounded-2xl border font-mono whitespace-pre-wrap",
                        m.sender === "user" 
                          ? "bg-accent-blue/10 border-accent-blue/20 text-text-primary ml-auto text-right" 
                          : "bg-bg-secondary/40 border-glass-border text-text-secondary mr-auto text-left"
                      )}
                    >
                      {m.text}
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex items-center gap-2 text-accent-blue py-1.5 font-mono text-[9px]">
                      <LucideIcons.Cpu className="w-3 h-3 animate-spin" />
                      <span>{dashboardShowcase?.badges?.[1] || "Thinking..."}</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Text Form */}
                <form onSubmit={handleSendMessage} className="relative mt-4 flex-shrink-0">
                  <input
                    type="text"
                    placeholder="Ask Kiwik AI..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    disabled={loading}
                    className="w-full pl-3 pr-9 py-2 rounded-xl bg-neutral-200/40 dark:bg-white/5 border border-glass-border focus:outline-none focus:border-accent-blue text-[10px] font-mono text-text-primary"
                  />
                  <button 
                    type="submit"
                    disabled={loading || !inputVal.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-accent-blue text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>

                {/* Reset button to list */}
                <button
                  onClick={() => setActiveAction(null)}
                  className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-divider hover:bg-bg-secondary text-[9px] font-mono text-text-secondary font-semibold"
                >
                  <LucideIcons.RefreshCw className="w-2.5 h-2.5" />
                  <span>{dashboardShowcase?.badges?.[2] || "Choose Another Action"}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer shortcuts */}
        <div className="pt-3 border-t border-divider/60 flex items-center justify-between font-mono text-[9px] text-text-secondary select-none">
          <span>Search documentation...</span>
          <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/5 border border-glass-border px-1.5 py-0.5 rounded text-[8px] font-bold">
            ⌘K
          </div>
        </div>

      </div>
    </div>
  );
}
