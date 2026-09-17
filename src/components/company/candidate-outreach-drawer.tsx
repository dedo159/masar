"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, User, Building2, CheckCheck, Sparkles, MessageCircle, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ATSCandidate } from "@/app/api/company/ats/route";
import type { OutreachMessage } from "@/app/api/company/outreach/route";

interface CandidateOutreachDrawerProps {
  candidate: ATSCandidate;
  onClose: () => void;
}

export function CandidateOutreachDrawer({
  candidate,
  onClose,
}: CandidateOutreachDrawerProps) {
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "مرحباً، يسعدنا اهتمامك بالتدريب معنا!",
    "هل يناسبك موعد المقابلة المبدئية هذا الأسبوع؟",
    "يرجى مراجعة تفاصيل التحدي البرمجي المرسل.",
    "تم استلام استفسارك وسيقوم الفريق بمراجعته.",
  ];

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch(`/api/company/outreach?candidateId=${candidate.id}`);
        const data = await res.json();
        if (data?.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }
    loadMessages();
  }, [candidate.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || sending) return;

    setSending(true);
    setInputText("");

    try {
      const res = await fetch("/api/company/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidate.id,
          text,
          sender: "recruiter",
        }),
      });

      const data = await res.json();
      if (data?.message) {
        setMessages((prev) => [...prev, data.message]);

        // Simulate student reply after 1.5s for rich interactivity
        setTimeout(() => {
          const simulatedReply: OutreachMessage = {
            id: `reply-${Date.now()}`,
            candidateId: candidate.id,
            sender: "candidate",
            text: "شكراً لتواصلكم ومتابعتكم الكريمة! تم الاطلاع وسأوافيكم بأي متطلبات إضافية في أقرب وقت.",
            timestamp: new Date().toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }),
            read: true,
          };
          setMessages((prev) => [...prev, simulatedReply]);
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border-r md:border-r border-border h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {candidate.avatar ? (
                <img src={candidate.avatar} alt={candidate.name} className="h-full w-full object-cover rounded-full" />
              ) : (
                candidate.name.split(" ").slice(0, 2).map((n) => n[0]).join("")
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground truncate">{candidate.name}</h3>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono">
                  {candidate.readinessScore}% جاهزية
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {candidate.university} · {candidate.major}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-secondary/15">
          <div className="text-center py-2">
            <span className="text-[10px] text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-full border border-border">
              قناة مراسلة مشفرة ومباشرة مع الطالب
            </span>
          </div>

          {messages.map((msg) => {
            const isRecruiter = msg.sender === "recruiter";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isRecruiter ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    isRecruiter
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card border border-border text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 flex items-center gap-1 ${
                      isRecruiter ? "text-primary-foreground/70 justify-end" : "text-muted-foreground justify-start"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isRecruiter && <CheckCheck className="h-3 w-3" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reply Chips */}
        <div className="px-3 pt-2 pb-1 border-t border-border/80 bg-card overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(reply)}
              className="text-[10px] font-medium whitespace-nowrap px-2.5 py-1 rounded-full border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالة مباشرة للمرشح..."
              className="flex-1 h-10 px-3.5 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={!inputText.trim() || sending}
              size="icon"
              className="h-10 w-10 rounded-xl shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
