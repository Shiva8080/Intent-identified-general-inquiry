import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { AgentStatus } from "@/components/AgentStatus";
import { processMessage, Message } from "@/lib/agents";
import { Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI-powered customer support assistant. I use a multi-agent system to analyze your questions, generate helpful responses, and escalate urgent issues. How can I help you today?",
      agent: "reply",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgent, setActiveAgent] = useState<"intent" | "reply" | "escalation" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setIsProcessing(true);

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      // Process through multi-agent system
      const agentMessages = await processMessage(userMessage, setActiveAgent);
      
      // Add agent messages one by one with slight delay
      for (const msg of agentMessages) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setMessages((prev) => [...prev, msg]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setActiveAgent(null);
    }
  };

  const exampleQuestions = [
    "I need a refund for my recent purchase",
    "How do I reset my password?",
    "The app is not working properly",
    "I have a billing question about my invoice",
  ];

  const handleExampleClick = (question: string) => {
    if (!isProcessing) {
      setInput(question);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Multi-Agent Support Assistant</h1>
              <p className="text-xs text-muted-foreground">
                Enterprise AI orchestration system
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Agent Status Panel */}
        <div className="mb-6">
          <AgentStatus activeAgent={activeAgent} />
        </div>

        {/* Chat Container */}
        <div className="rounded-xl border border-border bg-card shadow-soft">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
            {isProcessing && !activeAgent && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary animate-pulse-soft">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Example Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-muted-foreground mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isProcessing}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isProcessing}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by Intent Classification • Reply Generation • Escalation Detection
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
