"use client";

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/lib/resume/store';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResumeChat() {
  const store = useResumeStore();

  const { messages, setMessages, input, handleInputChange, handleSubmit, addToolResult, isLoading, error } = useChat({
    api: '/api/resume-ai',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "مرحباً بك! أنا مساعدك الشخصي وخبير التوظيف التقني. جاهز لمساعدتك في كتابة أو تصميم سيرتك الذاتية؟ (مثلاً اطلب مني تغيير لون السيرة، أو إضافة خبرة جديدة)."
      }
    ]
  });

  useEffect(() => {
    const saved = localStorage.getItem('resume-chat');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {}
    }
  }, [setMessages]);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('resume-chat', JSON.stringify(messages));
    }
  }, [messages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Tool Calls and Update Store
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'assistant') return;

    if (lastMessage.toolInvocations) {
      lastMessage.toolInvocations.forEach(invocation => {
        if (invocation.state === 'call') {
          const args = invocation.args as any;
          try {
            switch (invocation.toolName) {
              case 'update_basics':
                store.updateBasics(args);
                break;
              case 'update_summary':
                store.updateSummary(args.summary);
                break;
              case 'update_skills':
                store.updateSkills(args.skills);
                break;
              case 'add_or_update_project':
                store.addOrUpdateProject(args);
                break;
              case 'delete_project':
                store.deleteProject(args.id);
                break;
              case 'update_bullet_point':
                store.updateBulletPoint(args.projectId, args.bulletIndex, args.newText);
                break;
              case 'update_education':
                store.updateEducation(args.education);
                break;
              case 'update_certifications':
                store.updateCertifications(args.certifications);
                break;
              case 'update_design':
                store.updateDesign(args);
                break;
            }
            // Respond to AI that the tool succeeded
            addToolResult({ toolCallId: invocation.toolCallId, result: "Updated successfully." });
          } catch (e) {
            addToolResult({ toolCallId: invocation.toolCallId, result: "Failed to update." });
          }
        }
      });
    }
  }, [messages, store, addToolResult]);

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-primary/5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">AI Resume Coach</h2>
          <p className="text-xs text-muted-foreground">Interactive ATS optimization</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map(m => (
          <div key={m.id} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "")}>
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
              m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            )}>
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            
            <div className={cn(
              "max-w-[80%] rounded-lg px-4 py-3 text-sm",
              m.role === 'user' 
                ? "bg-[#000000] dark:bg-[#ffffff] text-foreground dark:text-black rounded-lg shadow-sm px-4 py-2" 
                : "bg-secondary text-foreground border border-border rounded-lg shadow-sm px-4 py-2"
            )}>
              {m.content && <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>}
              
              {/* Show tool calls */}
              {m.toolInvocations?.map((tool, i) => (
                <div key={i} className="mt-2 text-xs bg-muted border border-border rounded-md p-3 text-muted-foreground font-mono text-sm">
                  <span className="text-[#de1d8d] font-semibold">⚡ Action:</span> {tool.toolName}
                  {tool.state === 'result' ? ' (Done)' : ' (Executing...)'}
                </div>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-3 rounded-lg rounded-tl-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">يعالج...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center my-4">
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-lg text-center max-w-[80%] border border-destructive/20">
              حدث خطأ أثناء الاتصال: {error.message || 'يرجى التأكد من مفتاح الذكاء الاصطناعي'}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t border-border pt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0070f3] focus:ring-1 focus:ring-[#0070f3] transition-all"
            value={input}
            onChange={handleInputChange}
            placeholder="E.g., Make my summary more impactful..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="rounded-md shrink-0 h-10 w-10 vercel-button-primary" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <div className="text-[10px] text-center text-muted-foreground mt-2">
          Powered by AI. Verify all generated changes.
        </div>
      </div>
    </div>
  );
}
