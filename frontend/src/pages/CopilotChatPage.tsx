import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Bot,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCopilotStore } from '@/store/copilotStore';
import { copilotApi } from '@/api/client';

export const CopilotChatPage: React.FC = () => {
  const { messages, isLoading, addMessage, setLoading } = useCopilotStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    addMessage({
      sender: 'user',
      text,
    });
    setInputText('');
    setLoading(true);

    try {
      const response = await copilotApi.chat(text);
      addMessage({
        sender: 'assistant',
        text: response.message,
        confidence: response.confidence,
        recommendations: response.recommendations,
        next_actions: response.next_actions,
      });
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'What skills am I missing to become a Senior Backend Engineer?',
    'Create a 3-month action roadmap for my Docker and Redis skill gaps',
    'How do my skills compare with Razorpay job requirements?',
    'What are the best free courses for Kafka and distributed systems?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto animate-in fade-in-50 duration-500">
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">AI Career Copilot</h1>
              <Badge variant="success" className="text-[10px] gap-1">
                <ShieldCheck className="size-3" />
                <span>Domain Guardrails Active</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by Gemini 3.5 Flash Lite with Central ContextBuilder
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex size-8 rounded-lg items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground border border-border'
              }`}
            >
              {msg.sender === 'user' ? <User className="size-4" /> : <Bot className="size-4 text-primary" />}
            </div>

            <div className={`space-y-3 max-w-[80%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-card border border-border rounded-tl-none text-foreground shadow-xs'
                }`}
              >
                {msg.text}
              </div>

              {/* Structured Recommendations Card if provided by AI */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Targeted Recommendations
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {msg.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-border bg-card/60 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{rec.title}</span>
                            <Badge
                              variant={rec.priority === 'HIGH' ? 'destructive' : 'warning'}
                              className="text-[9px] px-1.5 py-0"
                            >
                              {rec.priority} PRIORITY
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1">{rec.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concrete Next Actions */}
              {msg.next_actions && msg.next_actions.length > 0 && (
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1.5">
                  <span className="font-bold text-emerald-400 block mb-1">Weekly Action Plan:</span>
                  {msg.next_actions.map((act, i) => (
                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex size-8 rounded-lg bg-muted items-center justify-center border border-border">
              <Bot className="size-4 text-primary animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border text-sm text-muted-foreground flex items-center gap-2">
              <RefreshCw className="size-4 animate-spin" />
              <span>Analyzing student profile & generating guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="pt-3 pb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(p)}
            className="whitespace-nowrap rounded-full border border-border bg-card/80 px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Message Input Bar */}
      <div className="pt-2 border-t border-border flex items-center gap-2">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask your Career Copilot about roadmaps, skill gaps, or interview prep..."
          className="h-11"
        />
        <Button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="h-11 px-5 gap-2"
        >
          <Send className="size-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
};
