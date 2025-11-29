import { cn } from "@/lib/utils";
import { Brain, MessageSquare, AlertTriangle } from "lucide-react";

interface AgentStatusProps {
  activeAgent: "intent" | "reply" | "escalation" | null;
}

export const AgentStatus = ({ activeAgent }: AgentStatusProps) => {
  const agents = [
    {
      id: "intent" as const,
      name: "Intent Classifier",
      icon: Brain,
      description: "Analyzing message intent",
      color: "agent-intent",
    },
    {
      id: "reply" as const,
      name: "Reply Agent",
      icon: MessageSquare,
      description: "Generating response",
      color: "agent-reply",
    },
    {
      id: "escalation" as const,
      name: "Escalation Agent",
      icon: AlertTriangle,
      description: "Checking escalation need",
      color: "agent-escalation",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {agents.map((agent) => {
        const Icon = agent.icon;
        const isActive = activeAgent === agent.id;

        return (
          <div
            key={agent.id}
            className={cn(
              "relative overflow-hidden rounded-lg border p-4 transition-all duration-300",
              isActive
                ? "border-primary shadow-elevated scale-105"
                : "border-border bg-card hover:border-muted-foreground/30"
            )}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent animate-pulse-soft" />
            )}
            <div className="relative flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  isActive ? `bg-${agent.color} text-white` : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{agent.name}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {isActive ? agent.description : "Idle"}
                </p>
              </div>
              {isActive && (
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft [animation-delay:0.4s]" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
