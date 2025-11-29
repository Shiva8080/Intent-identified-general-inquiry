import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  agent?: "intent" | "reply" | "escalation";
  metadata?: {
    intent?: string;
    escalation?: boolean;
  };
}

export const ChatMessage = ({ role, content, agent, metadata }: ChatMessageProps) => {
  const isUser = role === "user";

  const getAgentColor = () => {
    if (!agent) return "bg-primary";
    switch (agent) {
      case "intent":
        return "bg-agent-intent";
      case "reply":
        return "bg-agent-reply";
      case "escalation":
        return "bg-agent-escalation";
    }
  };

  const getAgentName = () => {
    if (!agent) return "Assistant";
    switch (agent) {
      case "intent":
        return "Intent Classifier";
      case "reply":
        return "Reply Agent";
      case "escalation":
        return "Escalation Agent";
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-muted" : getAgentColor()
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>
      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser && "items-end")}>
        {!isUser && agent && (
          <span className="text-xs font-medium text-muted-foreground">
            {getAgentName()}
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border shadow-sm"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        {metadata && (
          <div className="flex flex-wrap gap-2 mt-1">
            {metadata.intent && (
              <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                Intent: {metadata.intent}
              </span>
            )}
            {metadata.escalation && (
              <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">
                ⚠️ Escalation Required
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
