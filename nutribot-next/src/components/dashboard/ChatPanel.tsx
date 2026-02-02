"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Cpu } from "lucide-react";
import { motion as Motion, AnimatePresence } from "motion/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

import { toast } from "sonner";

interface ChatPanelProps {
  onUpdateNutrition?: (data: any) => void;
  onUpdateSummary?: (content: string) => void;
  onUpdateCalendar?: (data: any[]) => void;
}

export function ChatPanel({ onUpdateNutrition, onUpdateSummary, onUpdateCalendar }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("llama3.2:3b");
  const [userContext, setUserContext] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your MealMate AI. I can help you plan your week's meals or find healthy recipes. What's on your mind today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load user context from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Ensure numeric values are numbers
        const context = {
          ...userData,
          age: userData.age ? parseInt(userData.age) : undefined,
          height: userData.height ? parseFloat(userData.height) : undefined,
          weight: userData.weight ? parseFloat(userData.weight) : undefined
        };
        setUserContext(context);

        // Personalize welcome message if user known
        if (userData.username) {
          setMessages(prev => [
            {
              ...prev[0],
              text: `Hi ${userData.username}! I'm your MealMate AI. Ready to plan some healthy meals towards your goal of ${userData.goal || 'healthy living'}?`
            }
          ]);
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Prepare history for context
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: history,
          model: selectedModel,
          // Use real user context if available, otherwise fallback (or empty)
          context: userContext || {
            role: "guest",
            goal: "healthy living"
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Update Dashboard Panels if data is available
      if (data.nutrition_summary && onUpdateNutrition) {
        onUpdateNutrition(data.nutrition_summary);
      }
      if (data.meal_plan_summary && onUpdateSummary) {
        onUpdateSummary(data.meal_plan_summary);
      }
      if (data.meal_calendar && onUpdateCalendar) {
        onUpdateCalendar(data.meal_calendar);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Failed to connect to AI backend. Is it running?");

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, I'm having trouble connecting to the server right now. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <GlassCard className="h-full" contentClassName="p-0 h-full flex flex-col" icon={<Sparkles size={20} />}>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-6 py-4 border-b border-white/20 flex items-center justify-between bg-emerald-50/30">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-500" />
            <h3 className="font-medium text-slate-800">AI Meal Chat</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/40 px-2 py-1 rounded-lg border border-white/40">
              <Cpu size={12} />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent border-none outline-none focus:ring-0 text-slate-600 font-bold uppercase cursor-pointer"
              >
                <option value="llama3.2:3b">LLaMA-3.2 (Default)</option>
                <option value="qwen2.5:7b-instruct-q5_K_M">Fine Tune Model (Qwen)</option>
              </select>
            </div>
            <button
              onClick={() => setMessages([messages[0]])}
              className="text-[10px] bg-white/50 hover:bg-white px-2 py-1 rounded-md border border-white/40 text-emerald-700 font-bold transition-all"
            >
              NEW SESSION
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent"
        >
          {messages.map((msg) => (
            <Motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : "bg-white border border-emerald-50 text-slate-700 rounded-bl-none"
                )}
              >
                {msg.sender === 'ai' ? (
                  <div className="prose prose-sm prose-emerald max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 text-slate-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
                <div
                  suppressHydrationWarning
                  className={cn(
                    "text-[10px] mt-2 opacity-60",
                    msg.sender === "user" ? "text-right" : "text-left"
                  )}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </Motion.div>
          ))}

          {isTyping && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-emerald-50 p-4 rounded-2xl rounded-bl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </Motion.div>
          )}
        </div>

        <div className="p-4 bg-emerald-50/20 border-t border-white/20">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask for recipes, calories, meal plans..."
              className="w-full bg-white/80 border border-emerald-100 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200/50 focus:border-emerald-300 transition-all shadow-sm group-hover:shadow-md"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-2 p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2">
            AI can make mistakes. Please verify ingredients for allergies.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
