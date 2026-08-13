"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "@/stores/projects-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Fuse from "fuse.js";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  projectsRef?: any[];
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am Kiwik.1 AI assistant. Ask me anything about Kiwik's projects, tech stack, or team members. You can also use the microphone to talk to me!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const projects = useProjects();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const speechToText = event.results[0][0].transcript;
          setInputValue(speechToText);
          handleSend(speechToText);
        };

        rec.onerror = (e: any) => {
          console.error("Speech recognition error", e);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, [projects]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1"); // remove markdown links
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage: Message = { id: `user-${Date.now()}`, sender: "user", text: query, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          projectsContext: projects,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (!resData.fallback && resData.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: resData.reply,
              timestamp: new Date(),
            },
          ]);
          speakText(resData.reply);
          return;
        }
      }
    } catch (err) {
      console.warn("Error calling chat API, falling back to local processing", err);
    }

    // Local fallback processing
    const { text, matchedProjects } = generateResponse(query);
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date(),
        projectsRef: matchedProjects,
      },
    ]);
    speakText(text);
  };

  const generateResponse = (rawQuery: string): { text: string; matchedProjects: any[] } => {
    // 1. Convert to lowercase and strip punctuation
    let query = rawQuery.toLowerCase().trim();
    
    // Resolve conversational noise and conversational phrases
    const noisePhrases = [
      "tell me about", "what is", "show me", "can you tell me", "do you have", 
      "give me details on", "details on", "information about", "info on", 
      "who is", "please tell me about", "ok tell me about", "ok", "hey", "hi", "hello"
    ];
    
    let searchPhrase = query;
    noisePhrases.forEach(phrase => {
      // Use word boundaries or simple replace to strip noise phrases
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      searchPhrase = searchPhrase.replace(regex, "").trim();
    });

    // 2. Map common voice-transcription phonetic mispronunciations
    const phonetics: { [key: string]: string } = {
      "cubic dot ai": "kiwik.1",
      "cubic dot one": "kiwik.1",
      "cubic": "kiwik.1",
      "kiwi": "kiwik.1",
      "kyiv": "kiwik.1",
      "civic": "kiwik.1",
      "chris gayle": "criskaai",
      "chris copy": "criskapay",
      "chris cloud": "criskacloud",
      "crescent cloud": "criskacloud",
      "chris os": "criskaos",
      "chris bot": "criskabot",
      "text tag": "tech stack",
      "text tags": "tech stack",
      "tech tag": "tech stack",
      "tech tags": "tech stack",
      "uses": "purpose"
    };

    Object.keys(phonetics).forEach(key => {
      if (query.includes(key)) {
        query = query.replace(new RegExp(key, 'g'), phonetics[key]);
      }
      if (searchPhrase.includes(key)) {
        searchPhrase = searchPhrase.replace(new RegExp(key, 'g'), phonetics[key]);
      }
    });

    let matchedProjects: any[] = [];
    let text = "";

    // 3. Handle list queries ("list all the projects", etc.)
    const isListQuery = query.includes("list") || query.includes("all projects") || query.includes("all the projects") || query.includes("what are the projects") || query.includes("projects mentioned") || query.includes("show all");
    if (isListQuery) {
      text = `Here is a complete list of the **${projects.length} Kiwik projects** currently active:\n\n` +
        projects.map((p, i) => `${i + 1}. **${p.name}** (${p.category}) — *${p.tagline}*`).join("\n") +
        `\n\nAsk me about any specific project or their tech stack to get live telemetry!`;
      return { text, matchedProjects: projects };
    }

    // 4. Handle team / contributors queries
    if (query.includes("people") || query.includes("worked") || query.includes("contributors") || query.includes("team") || query.includes("who built")) {
      const allContributorsMap = new Map<string, { name: string; role: string; projects: string[] }>();
      projects.forEach((p) => {
        if (p.contributors) {
          p.contributors.forEach((c) => {
            const existing = allContributorsMap.get(c.name) || { name: c.name, role: c.role, projects: [] };
            existing.projects.push(p.name);
            allContributorsMap.set(c.name, existing);
          });
        }
      });

      const uniqueContributors = Array.from(allContributorsMap.values());
      if (uniqueContributors.length > 0) {
        text = `Here is our team and contributors who engineered the projects:\n\n` + 
          uniqueContributors.map(c => `* **${c.name}** (${c.role}) — Worked on: *${c.projects.join(", ")}*`).join("\n");
      } else {
        text = "Our systems indicate the projects are engineered and maintained by **Kiwik Core Team**.";
      }
      return { text, matchedProjects };
    }

    // 5. Handle direct substring scans for projects (highest priority match)
    const directMatch = projects.find(p => {
      const pName = (p.name || "").toLowerCase();
      const pSlug = (p.slug || "").toLowerCase();
      // Compare without spaces/dots/dashes
      const cleanPName = pName.replace(/[\.\-\s]/g, "");
      const cleanPSlug = pSlug.replace(/[\.\-\s]/g, "");
      const cleanQ = query.replace(/[\.\-\s]/g, "");
      const cleanSP = searchPhrase.replace(/[\.\-\s]/g, "");

      return cleanQ.includes(cleanPName) || cleanQ.includes(cleanPSlug) || 
             cleanSP.includes(cleanPName) || cleanSP.includes(cleanPSlug) ||
             (cleanPName === "kiwik1" && (cleanQ.includes("kiwik") || cleanQ.includes("kiwi")));
    });

    if (directMatch) {
      matchedProjects = [directMatch];
      text = `Here are details on **${directMatch.name}** (${directMatch.category} project, v${directMatch.version || "1.0.0"}): \n\n* **Status**: ${(directMatch.status || "").replace("-", " ")} (${directMatch.completionPercent}% complete)\n* **Tagline**: ${directMatch.tagline}\n* **Stack**: ${(directMatch.techStack || []).map(t => t.name).join(", ")}\n\nYou can click below to explore its live edge monitor or full documentation.`;
      return { text, matchedProjects };
    }

    // 6. Setup Fuse.js for secondary fuzzy search matches
    const fuse = new Fuse(projects, {
      keys: ["name", "category", "tagline", "description", "techStack.name"],
      threshold: 0.55,
    });

    const results = fuse.search(searchPhrase || query);

    // 7. Handle README / Documentation queries
    if (query.includes("readme") || query.includes("documentation") || query.includes("doc")) {
      const matched = results.length > 0 ? results[0].item : null;
      if (matched) {
        text = `Here is a summary of the **README.md** documentation for **${matched.name}**:\n\n* **Description**: ${matched.description}\n* **Key Stack**: ${(matched.techStack || []).slice(0, 5).map((t: any) => t.name).join(", ")}\n* **Details**: Check out the full markdown tab on its detail page below!`;
        return { text, matchedProjects: [matched] };
      } else {
        text = `Which project's README would you like to explore?${projects.length ? ` (e.g. ${projects.slice(0, 3).map(p => p.name).join(", ")})` : ""}`;
        return { text, matchedProjects };
      }
    }

    // 8. Handle tech stack queries
    const isTechQuery = query.includes("tech") || query.includes("stack") || query.includes("work") || query.includes("language") || query.includes("framework");
    if (isTechQuery) {
      const targets = results.length > 0 ? results.map(r => r.item) : projects;
      matchedProjects = targets.slice(0, 4);
      text = `Here is the tech stack used in our key projects:\n\n` +
        matchedProjects.map(p => `* **${p.name}**: uses *${(p.techStack || []).map((t: any) => t.name).slice(0, 6).join(", ")}*`).join("\n") +
        `\n\nExplore any of these projects below for detailed telemetry!`;
      return { text, matchedProjects };
    }

    // 9. Process fuzzy match results
    if (results.length > 0) {
      const match = results[0].item;
      matchedProjects = [match];
      text = `Here are details on **${match.name}** (${match.category} project, v${match.version || "1.0.0"}): \n\n* **Status**: ${(match.status || "").replace("-", " ")} (${match.completionPercent}% complete)\n* **Tagline**: ${match.tagline}\n* **Stack**: ${(match.techStack || []).map(t => t.name).join(", ")}\n\nYou can click below to explore its live edge monitor or full documentation.`;
      return { text, matchedProjects };
    }

    // Fallbacks
    if (query.includes("hello") || query.includes("hi ") || query.includes("hey")) {
      text = `Hi there! Welcome to Kiwik.1. Ask me about our projects${projects.length ? ` (like ${projects.slice(0, 2).map(p => p.name).join(", ")})` : ""}, their tech stack, or the partner showcase at /partners.`;
    } else {
      text = `I'm here to help you navigate our ecosystems! I'm indexing **${projects.length} Kiwik projects**: ${projects.map(p => p.name).join(", ")}. Ask me about their tech stacks, README files, or team members!`;
    }

    return { text, matchedProjects };
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="chat-trigger-pill"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(true)}
              className="px-5 py-3 rounded-full bg-glass-bg border border-glass-border shadow-2xl backdrop-blur-2xl text-xs font-bold text-text-primary flex items-center gap-2.5 cursor-pointer hover:bg-glass-bg-hover transition-all active:scale-95 [box-shadow:0_12px_40px_rgba(0,0,0,0.15)]"
            >
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-accent-blue animate-pulse" />
              <span>Ask Kiwik AI</span>
            </motion.button>
          ) : (
            <motion.button
              key="chat-close-circle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="p-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center border border-rose-500/20 cursor-pointer"
              aria-label="Close AI Assistant"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[420px] h-[min(580px,calc(100dvh-8rem))] rounded-2xl border border-glass-border bg-glass-bg backdrop-blur-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-bg-secondary/60 border-b border-divider flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent-blue/15 flex items-center justify-center border border-accent-blue/30 text-accent-blue">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-text-primary flex items-center gap-1.5">
                    Kiwik Assistant
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-text-secondary">On-board Project Telemetry</p>
                </div>
              </div>

              {/* Sound Settings */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isMuted ? "text-text-secondary hover:text-text-primary" : "text-accent-blue bg-accent-blue/10"
                  )}
                  title={isMuted ? "Unmute speech feedback" : "Mute speech feedback"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex flex-col max-w-[85%]", {
                    "self-end ml-auto items-end": msg.sender === "user",
                    "self-start mr-auto items-start": msg.sender === "bot",
                  })}
                >
                  <div
                    className={cn("p-3 rounded-2xl text-xs leading-relaxed", {
                      "bg-accent-blue text-white rounded-tr-none": msg.sender === "user",
                      "bg-bg-secondary/60 border border-glass-border text-text-primary rounded-tl-none":
                        msg.sender === "bot",
                    })}
                  >
                    {msg.text}
                  </div>

                  {/* Render Quick Project Reference Cards */}
                  {msg.projectsRef && msg.projectsRef.length > 0 && (
                    <div className="mt-2 w-full space-y-2">
                      {msg.projectsRef.map((proj) => (
                        <Link
                          key={proj.id}
                          href={`/projects/${proj.slug}`}
                          className="block p-2 rounded-xl bg-glass-bg-hover hover:bg-glass-bg-active border border-glass-border transition-colors text-[11px]"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-text-primary">{proj.name}</span>
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-glass-bg border border-glass-border text-text-secondary">
                              {proj.category}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-text-secondary mt-1 font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Controls */}
            <div className="p-3 border-t border-divider bg-bg-secondary/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 bg-glass-bg border border-glass-border rounded-xl px-3 py-1.5"
              >
                {/* Voice button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={cn(
                    "p-2 rounded-lg transition-colors flex items-center justify-center shrink-0",
                    isListening
                      ? "bg-rose-500/20 text-rose-500 animate-pulse border border-rose-500/30"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                  title={isListening ? "Listening... click to stop" : "Start speaking"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isListening ? "Listening to your voice..." : "Ask Kiwik AI..."}
                  className="flex-1 bg-transparent border-none text-xs text-text-primary focus:outline-none placeholder:text-text-secondary/50 font-medium"
                />

                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-accent-blue hover:bg-blue-600 text-white transition-colors flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
