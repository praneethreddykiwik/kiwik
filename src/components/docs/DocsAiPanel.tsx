"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Bot, User, RefreshCw, Code, BookOpen, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { DocArticle } from "@/types/docs-types";
import { useProjects } from "@/stores/projects-store";

interface DocsAiPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentArticle: DocArticle;
}

interface Message {
  sender: "user" | "bot";
  text: string;
}

export function DocsAiPanel({ isOpen, onClose, currentArticle }: DocsAiPanelProps) {
  // Real project list, so the assistant answers from the same data the
  // rest of the site shows.
  const projects = useProjects();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: `Hello! I am your Kiwik AI Documentation Assistant. I have indexed **"${currentArticle.title}"**. How can I help you?`
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputVal.trim();
    if (!textToSend || loading) return;

    if (!queryText) setInputVal("");
    setMessages(prev => [...prev, { sender: "user", text: textToSend }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { sender: "user", text: textToSend }],
          // Must be an array — the API treats a non-array context as "no
          // projects exist", which made this panel answer "Kiwik has no
          // projects listed" to every question.
          projectsContext: projects,
          docContext: { title: currentArticle?.title, sections: currentArticle?.sections }
        })
      });

      const data = await res.json();
      if (data.reply && !data.fallback) {
        setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
        setLoading(false);
        return;
      }

      // Intelligent Fallback
      setTimeout(() => {
        let reply = "";
        const lower = textToSend.toLowerCase();

        if (lower.includes("summar")) {
          reply = `🤖 **Summary of "${currentArticle.title}"**:\n\n` +
            currentArticle.sections.map(s => `* **${s.heading}**: ${s.bodyMarkdown.slice(0, 120)}...`).join("\n");
        } else if (lower.includes("code") || lower.includes("example")) {
          reply = `🤖 Here is a code snippet related to **"${currentArticle.title}"**:\n\n\`\`\`typescript\nimport { useSiteCMSStore } from "@/stores/site-cms-store";\n\nexport function KiwikDocsModule() {\n  const cms = useSiteCMSStore(s => s.cms);\n  return <div>Loaded {cms.settings.siteName}</div>;\n}\n\`\`\``;
        } else {
          reply = `🤖 Based on **"${currentArticle.title}"** (${currentArticle.subtitle}):\n\nThis module is maintained by **${currentArticle.author}** and was last updated on ${currentArticle.lastUpdated}. You can test endpoints in the API explorer or component props in the playground above!`;
        }

        setMessages(prev => [...prev, { sender: "bot", text: reply }]);
        setLoading(false);
      }, 700);

    } catch (err: any) {
      setMessages(prev => [...prev, { sender: "bot", text: "Encountered an issue processing query. Using client documentation index." }]);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="w-full max-w-lg h-full max-h-[700px] rounded-3xl bg-[#060607]/95 border border-white/10 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl text-slate-100"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Ask Kiwik AI</h4>
                <p className="text-[10px] text-slate-400 font-mono">Indexing: {currentArticle.title}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="p-3 border-b border-white/10 bg-white/5 flex gap-2 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => handleSend("Summarize this documentation page")}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3 h-3" /> Summarize Page
            </button>
            <button
              onClick={() => handleSend("Generate a code example for this module")}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Code className="w-3 h-3" /> Generate Code
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white/10 text-indigo-400 border border-white/10"
                  }`}
                >
                  {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white font-semibold"
                      : "bg-white/5 border border-white/10 text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Kiwik AI indexing documentation...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-white/10 bg-white/5 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about this document..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
