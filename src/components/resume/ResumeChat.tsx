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
        content: "ظ…ط±ط­ط¨ط§ظ‹ ط¨ظƒ! ط£ظ†ط§ ظ…ط³ط§ط¹ط¯ظƒ ط§ظ„ط´ط®طµظٹ ظˆط®ط¨ظٹط± ط§ظ„طھظˆط¸ظٹظپ ط§ظ„طھظ‚ظ†ظٹ. ط¬ط§ظ‡ط² ظ„ظ…ط³ط§ط¹ط¯طھظƒ ظپظٹ ظƒطھط§ط¨ط© ط£ظˆ طھطµظ…ظٹظ… ط³ظٹط±طھظƒ ط§ظ„ط°ط§طھظٹط©طں (ظ…ط«ظ„ط§ظ‹ ط§ط·ظ„ط¨ ظ…ظ†ظٹ طھط؛ظٹظٹط± ظ„ظˆظ† ط§ظ„ط³ظٹط±ط©طŒ ط£ظˆ ط¥ط¶ط§ظپط© ط®ط¨ط±ط© ط¬ط¯ظٹط¯ط©)."
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
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-primary/5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">AI Resume Coach</h2>
          <p className="text-xs text-white/40">Interactive ATS optimization</p>
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
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
              m.role === 'user' 
                ? "fintech-gradient-purple text-white rounded-tr-sm shadow-sm" 
                : "bg-white/5 text-white rounded-tl-sm border border-white/10"
            )}>
              {m.content && <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>}
              
              {/* Show tool calls */}
              {m.toolInvocations?.map((tool, i) => (
                <div key={i} className="mt-2 text-xs bg-black/20 border border-white/5 rounded-md p-2 text-white/50 font-mono">
                  <span className="text-[#EC4899] font-bold">âڑ، Action:</span> {tool.toolName}
                  {tool.state === 'result' ? ' (Done)' : ' (Executing...)'}
                </div>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 text-white/70 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">ظٹط¹ط§ظ„ط¬...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center my-4">
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-xl text-center max-w-[80%] border border-destructive/20">
              ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„ط§طھطµط§ظ„: {error.message || 'ظٹط±ط¬ظ‰ ط§ظ„طھط£ظƒط¯ ظ…ظ† ظ…ظپطھط§ط­ ط§ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ'}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-transparent border-t border-white/5 pt-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 rounded-[16px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
            value={input}
            onChange={handleInputChange}
            placeholder="E.g., Make my summary more impactful..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="rounded-[16px] shrink-0 h-11 w-11 fintech-gradient-purple text-white border-0 hover:fintech-glow-purple" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <div className="text-[10px] text-center text-white/40 mt-2">
          Powered by AI. Verify all generated changes.
        </div>
      </div>
    </div>
  );
}
