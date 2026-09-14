"use client";

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/resume/store';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResumeChat() {
  const store = useResumeStore();
  const { messages, input, handleInputChange, handleSubmit, addToolResult, isLoading } = useChat({
    api: '/api/resume-ai',
    initialMessages: [
      {
        id: 'initial',
        role: 'assistant',
        content: "Hello! I'm your AI Career Coach. Let's craft an outstanding ATS-friendly resume. I can update your summary, refine your project bullets using the X-Y-Z formula, or organize your skills. What would you like to improve first?"
      }
    ]
  });

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
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
              m.role === 'user' 
                ? "bg-primary text-primary-foreground rounded-tr-sm" 
                : "bg-secondary/50 text-foreground rounded-tl-sm border"
            )}>
              {m.content && <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>}
              
              {/* Show tool calls */}
              {m.toolInvocations?.map((tool, i) => (
                <div key={i} className="mt-2 text-xs bg-background/50 border rounded p-2 text-muted-foreground font-mono">
                  <span className="text-primary font-semibold">⚡ Action:</span> {tool.toolName}
                  {tool.state === 'result' ? ' (Done)' : ' (Executing...)'}
                </div>
              ))}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0 mt-1">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-secondary/50 border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 rounded-full border bg-muted/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={input}
            onChange={handleInputChange}
            placeholder="E.g., Make my summary more impactful..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={isLoading || !input.trim()}>
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
