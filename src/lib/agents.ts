// Simulated multi-agent system based on the uploaded notebook

export interface Message {
  role: "user" | "assistant";
  content: string;
  agent?: "intent" | "reply" | "escalation";
  metadata?: {
    intent?: string;
    escalation?: boolean;
  };
}

// Intent classification
const classifyIntent = (message: string): string => {
  const lower = message.toLowerCase();
  
  if (lower.includes("refund") || lower.includes("money back") || lower.includes("cancel")) {
    return "refund_request";
  }
  if (lower.includes("bug") || lower.includes("error") || lower.includes("not working") || lower.includes("broken")) {
    return "technical_issue";
  }
  if (lower.includes("how to") || lower.includes("help") || lower.includes("guide") || lower.includes("tutorial")) {
    return "help_request";
  }
  if (lower.includes("billing") || lower.includes("invoice") || lower.includes("charge") || lower.includes("payment")) {
    return "billing_inquiry";
  }
  if (lower.includes("account") || lower.includes("login") || lower.includes("password") || lower.includes("access")) {
    return "account_issue";
  }
  
  return "general_inquiry";
};

// Generate reply based on intent
const generateReply = (intent: string, message: string): string => {
  const replies: Record<string, string> = {
    refund_request: "I understand you're requesting a refund. Our refund policy allows returns within 30 days of purchase. I'll need to verify your order details to process this. Could you please provide your order number?",
    technical_issue: "I'm sorry you're experiencing technical difficulties. I've logged this issue and our technical team will investigate. In the meantime, have you tried clearing your cache or using a different browser?",
    help_request: "I'd be happy to help! I can provide you with step-by-step guidance or direct you to our comprehensive knowledge base. What specific feature or process would you like assistance with?",
    billing_inquiry: "I can help you with your billing question. Our billing team can provide detailed information about your charges, payment methods, and invoices. What specific aspect of your billing would you like to discuss?",
    account_issue: "I understand you're having account access issues. For security purposes, I'll need to verify your identity. Could you please confirm the email address associated with your account?",
    general_inquiry: "Thank you for reaching out! I'm here to assist you with any questions you have about our services. How can I help you today?",
  };

  return replies[intent] || replies.general_inquiry;
};

// Determine if escalation is needed
const shouldEscalate = (intent: string, message: string): boolean => {
  const urgentKeywords = ["urgent", "immediately", "asap", "critical", "emergency", "now", "frustrated", "angry", "legal"];
  const escalationIntents = ["refund_request", "account_issue"];
  
  const hasUrgentKeyword = urgentKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
  
  return hasUrgentKeyword || escalationIntents.includes(intent);
};

// Main orchestrator
export const processMessage = async (
  userMessage: string,
  onAgentChange: (agent: "intent" | "reply" | "escalation" | null) => void
): Promise<Message[]> => {
  const messages: Message[] = [];

  // Step 1: Intent Classification
  onAgentChange("intent");
  await delay(1000);
  const intent = classifyIntent(userMessage);

  // Step 2: Generate Reply
  onAgentChange("reply");
  await delay(1500);
  const reply = generateReply(intent, userMessage);

  // Step 3: Check Escalation
  onAgentChange("escalation");
  await delay(800);
  const escalation = shouldEscalate(intent, userMessage);

  onAgentChange(null);

  // Add intent classification message
  messages.push({
    role: "assistant",
    content: `Intent identified: ${intent.replace(/_/g, " ")}`,
    agent: "intent",
    metadata: { intent },
  });

  // Add main reply
  messages.push({
    role: "assistant",
    content: reply,
    agent: "reply",
    metadata: { intent, escalation },
  });

  // Add escalation warning if needed
  if (escalation) {
    messages.push({
      role: "assistant",
      content: "This conversation has been flagged for human review due to the urgency or complexity of your request. A specialist will follow up with you shortly.",
      agent: "escalation",
      metadata: { escalation: true },
    });
  }

  return messages;
};

// Utility delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
