import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, MoreVertical, Send, Sparkles, User } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { ChatMessage } from "@shared/schema";

interface WhatsAppChatProps {
  customerName: string;
  customerPhone: string;
  messages: ChatMessage[];
  isTyping?: boolean;
  onSendMessage?: (message: string) => void;
}

export function WhatsAppChat({ customerName, customerPhone, messages, isTyping = false }: WhatsAppChatProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-SV', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden" data-testid="whatsapp-chat">
      {/* WhatsApp Header - Navy with Gold accents */}
      <div className="navy-gradient px-4 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 border-2 border-primary/30">
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white truncate">{customerName}</p>
              <Badge variant="outline" className="text-primary border-primary/30 text-xs shrink-0" data-testid="badge-ai-active">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
            </div>
            <p className="text-xs text-white/70">{customerPhone}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="text-white/70" data-testid="button-call-customer">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/70" data-testid="button-chat-options">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages with wave pattern */}
      <ScrollArea className="flex-1 p-4 wave-pattern bg-background/50">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.direction === 'inbound' ? 'justify-start' : 'justify-end'}`}
              data-testid={`chat-message-${message.id}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.direction === 'inbound'
                    ? 'bg-card border border-border'
                    : message.aiGenerated
                    ? 'bg-secondary text-secondary-foreground border border-primary/20'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {message.aiGenerated && message.direction === 'outbound' && (
                  <div className="flex items-center gap-1 mb-1 text-xs text-primary">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Response</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.direction === 'inbound' 
                    ? 'text-muted-foreground' 
                    : message.aiGenerated 
                    ? 'text-muted-foreground' 
                    : 'text-primary-foreground/70'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator with gold dots */}
          {isTyping && (
            <div className="flex justify-end" data-testid="typing-indicator">
              <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-3 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
                <div className="w-2 h-2 rounded-full bg-primary typing-dot" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Type a message..." 
            className="flex-1"
            data-testid="input-chat-message"
          />
          <Button size="icon" className="gold-gradient shrink-0" data-testid="button-send-message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground" data-testid="chat-status-bar">
          <SiWhatsapp className="h-3.5 w-3.5 text-green-500" />
          <span>Connected to WhatsApp Business API</span>
          <span className="ml-auto flex items-center gap-1" data-testid="status-live">
            <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-gold" />
            Live
          </span>
        </div>
      </div>
    </Card>
  );
}
