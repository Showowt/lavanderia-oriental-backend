import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  MessageSquare,
  Filter,
  Sparkles,
  Phone,
  MoreVertical,
  Send,
  User,
  UserCheck,
  ArrowRightLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShoppingBag,
  Tag,
  StickyNote,
  ChevronRight,
  Bot
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationWithCustomer {
  id: string;
  status: string;
  customerId: string;
  startedAt: Date | null;
  customerName: string;
  customerPhone: string;
  lastMessageAt: Date;
  messageCount: number;
  aiHandled: boolean;
  lastMessage?: string;
  branchName?: string;
}

interface Message {
  id: string;
  content: string;
  direction: "inbound" | "outbound";
  timestamp: Date;
  aiGenerated?: boolean;
  intent?: string;
  confidence?: number;
}

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferredBranch?: string;
  customerSince?: Date;
  lifetimeValue: number;
  totalOrders: number;
  tags: string[];
  recentOrders: { id: string; date: Date; amount: number; status: string }[];
  notes: { id: string; content: string; createdAt: Date; author: string }[];
}

export default function Conversations() {
  const { t } = useI18n();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [showCustomerPanel, setShowCustomerPanel] = useState(true);

  const { data: conversations = [], isLoading } = useQuery<ConversationWithCustomer[]>({
    queryKey: ["/api/conversations"],
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/conversations", selectedConversationId, "messages"],
    queryFn: async () => {
      if (!selectedConversationId) return [];
      const res = await fetch(`/api/conversations/${selectedConversationId}/messages`);
      if (!res.ok) return getMockMessages();
      return res.json();
    },
    enabled: !!selectedConversationId,
  });

  // Mock messages for demo
  function getMockMessages(): Message[] {
    const now = Date.now();
    return [
      { id: "1", direction: "inbound", content: "Hola, buenos días. ¿Cuánto cuesta lavar una carga normal?", timestamp: new Date(now - 10 * 60000), aiGenerated: false },
      { id: "2", direction: "outbound", content: "¡Buenos días! El precio de una carga normal es:\n• Solo lavado: $3.00\n• Lavado + secado: $5.50\n\n¿En qué sucursal le queda más cerca?", timestamp: new Date(now - 9 * 60000), aiGenerated: true, intent: "pricing_inquiry", confidence: 0.98 },
      { id: "3", direction: "inbound", content: "San Miguel", timestamp: new Date(now - 8 * 60000), aiGenerated: false },
      { id: "4", direction: "outbound", content: "¡Perfecto! En San Miguel tenemos dos sucursales:\n\n📍 Casa Matriz - Col. Ciudad Real, C. Elizabeth\n📍 Col. Gavidia - 10 Av Norte\n\nAmbas abren de 7am a 6pm (L-S) y 7am a 5pm (D).\n\n¿Le gustaría servicio de delivery? Cuesta $2 total (recogida + entrega).", timestamp: new Date(now - 7 * 60000), aiGenerated: true, intent: "branch_info", confidence: 0.95 },
      { id: "5", direction: "inbound", content: "Sí, me interesa el delivery", timestamp: new Date(now - 5 * 60000), aiGenerated: false },
      { id: "6", direction: "outbound", content: "¡Excelente! Para programar su recogida necesito:\n\n1. Dirección completa\n2. Horario preferido\n3. Cantidad aproximada de ropa\n\n¿Me puede proporcionar estos datos?", timestamp: new Date(now - 4 * 60000), aiGenerated: true, intent: "delivery_scheduling", confidence: 0.92 },
    ];
  }

  // Mock customer profile
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const customerProfile: CustomerProfile | null = selectedConversation ? {
    id: selectedConversation.customerId,
    name: selectedConversation.customerName,
    phone: selectedConversation.customerPhone,
    email: "cliente@email.com",
    preferredBranch: "San Miguel - Casa Matriz",
    customerSince: new Date(2024, 0, 15),
    lifetimeValue: 234.50,
    totalOrders: 18,
    tags: ["Regular", "Delivery", "VIP"],
    recentOrders: [
      { id: "#1234", date: new Date(2026, 1, 5), amount: 12.50, status: "completed" },
      { id: "#1198", date: new Date(2026, 0, 28), amount: 8.25, status: "completed" },
      { id: "#1156", date: new Date(2026, 0, 15), amount: 15.00, status: "completed" },
    ],
    notes: [
      { id: "1", content: "Prefiere recogida después de las 5pm", createdAt: new Date(2026, 0, 5), author: "María" },
      { id: "2", content: "Alérgica a fragancias fuertes - usar hipoalergénico", createdAt: new Date(2025, 11, 15), author: "Admin" },
    ],
  } : null;

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.customerPhone?.includes(searchQuery);

    if (filter === "all") return matchesSearch;
    if (filter === "active") return conv.status === "active" && matchesSearch;
    if (filter === "resolved") return conv.status === "resolved" && matchesSearch;
    if (filter === "escalated") return conv.status === "escalated" && matchesSearch;
    return matchesSearch;
  });

  const getStatusBadge = (status: string, size: "sm" | "default" = "default") => {
    const baseClass = size === "sm" ? "text-xs px-1.5 py-0.5" : "";
    switch (status) {
      case "active":
        return <Badge className={`bg-accent/20 text-accent border-accent/30 ${baseClass}`}>
          <Sparkles className="h-3 w-3 mr-1" />
          AI Active
        </Badge>;
      case "resolved":
        return <Badge variant="secondary" className={baseClass}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Resolved
        </Badge>;
      case "escalated":
        return <Badge variant="destructive" className={baseClass}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          Escalated
        </Badge>;
      case "human_active":
        return <Badge className={`bg-primary/20 text-primary border-primary/30 ${baseClass}`}>
          <UserCheck className="h-3 w-3 mr-1" />
          Human Active
        </Badge>;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString("es-SV", { month: "short", day: "numeric" });
  };

  const formatMessageTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("es-SV", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const handleSendMessage = () => {
    if (!replyMessage.trim()) return;
    console.log("Sending message:", replyMessage);
    setReplyMessage("");
  };

  const handleTakeOver = () => {
    console.log("Taking over conversation:", selectedConversationId);
  };

  const handleEscalate = () => {
    console.log("Escalating conversation:", selectedConversationId);
  };

  const handleResolve = () => {
    console.log("Resolving conversation:", selectedConversationId);
  };

  return (
    <div className="h-[calc(100vh-65px)] flex" data-testid="conversations-page">
      {/* Left Panel - Conversation List */}
      <div className="w-80 border-r border-border flex flex-col bg-card shrink-0">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Conversations
            </h1>
            <Badge variant="secondary">{filteredConversations.length}</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-conversations"
            />
          </div>
          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-8">
              <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
              <TabsTrigger value="active" className="text-xs px-2">Active</TabsTrigger>
              <TabsTrigger value="escalated" className="text-xs px-2">Escalated</TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs px-2">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No conversations</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedConversationId === conversation.id
                      ? "bg-primary/5 border-l-2 border-primary"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  data-testid={`conversation-item-${conversation.id}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {conversation.customerName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm truncate">{conversation.customerName}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTime(conversation.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conversation.lastMessage || conversation.customerPhone}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {getStatusBadge(conversation.status, "sm")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Middle Panel - Conversation Detail */}
      {selectedConversationId && selectedConversation ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Conversation Header */}
          <div className="navy-gradient px-4 py-3 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-10 w-10 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {selectedConversation.customerName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white truncate">{selectedConversation.customerName}</p>
                  {getStatusBadge(selectedConversation.status)}
                </div>
                <p className="text-xs text-white/70 flex items-center gap-2">
                  {selectedConversation.customerPhone}
                  {selectedConversation.branchName && (
                    <>
                      <span>•</span>
                      <span>{selectedConversation.branchName}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <Phone className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setShowCustomerPanel(!showCustomerPanel)}
              >
                <User className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Transfer
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Block Customer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 wave-pattern bg-background/50">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Date Separator */}
              <div className="flex items-center gap-4 my-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">Today</span>
                <Separator className="flex-1" />
              </div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.direction === "inbound" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
                      message.direction === "inbound"
                        ? "bg-card border border-border"
                        : message.aiGenerated
                        ? "bg-secondary border border-primary/20"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.aiGenerated && message.direction === "outbound" && (
                      <div className="flex items-center gap-1 mb-1.5 text-xs text-primary">
                        <Bot className="h-3 w-3" />
                        <span>AI Response</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center justify-between gap-3 mt-1.5 ${
                      message.direction === "inbound"
                        ? "text-muted-foreground"
                        : message.aiGenerated
                        ? "text-muted-foreground"
                        : "text-primary-foreground/70"
                    }`}>
                      <span className="text-xs">{formatMessageTime(message.timestamp)}</span>
                      {message.intent && message.confidence && (
                        <span className="text-xs opacity-70">
                          {message.intent} ({Math.round(message.confidence * 100)}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 border-t border-border bg-card shrink-0">
            <div className="flex items-center gap-2 max-w-3xl mx-auto">
              <Input
                placeholder="Type a message..."
                className="flex-1"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
              />
              <Button size="icon" className="gold-gradient shrink-0" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 mt-3 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <SiWhatsapp className="h-3.5 w-3.5 text-green-500" />
                <span>Connected to WhatsApp Business API</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedConversation.status === "active" && selectedConversation.aiHandled && (
                  <Button variant="outline" size="sm" className="h-8" onClick={handleTakeOver}>
                    <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                    Take Over
                  </Button>
                )}
                {selectedConversation.status !== "resolved" && (
                  <>
                    <Button variant="outline" size="sm" className="h-8 text-destructive hover:text-destructive" onClick={handleEscalate}>
                      <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                      Escalate
                    </Button>
                    <Button size="sm" className="h-8 bg-accent hover:bg-accent/90" onClick={handleResolve}>
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      Mark Resolved
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">Select a conversation</p>
            <p className="text-sm text-muted-foreground/70">Choose from the list to view messages</p>
          </div>
        </div>
      )}

      {/* Right Panel - Customer Profile */}
      {selectedConversationId && showCustomerPanel && customerProfile && (
        <div className="w-80 border-l border-border bg-card shrink-0 flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {customerProfile.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{customerProfile.name}</h3>
                <p className="text-sm text-muted-foreground">{customerProfile.phone}</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Contact Info */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Contact</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <SiWhatsapp className="h-4 w-4 text-green-500" />
                    {customerProfile.phone}
                  </p>
                  {customerProfile.email && (
                    <p className="text-muted-foreground">{customerProfile.email}</p>
                  )}
                  {customerProfile.preferredBranch && (
                    <p className="text-muted-foreground">📍 {customerProfile.preferredBranch}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Stats */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Statistics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-semibold">{customerProfile.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-semibold">${customerProfile.lifetimeValue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Lifetime Value</p>
                  </div>
                </div>
                {customerProfile.customerSince && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Customer since {customerProfile.customerSince.toLocaleDateString("es-SV", { month: "short", year: "numeric" })}
                  </p>
                )}
              </div>

              <Separator />

              {/* Tags */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {customerProfile.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    + Add
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Recent Orders */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  Recent Orders
                </h4>
                <div className="space-y-2">
                  {customerProfile.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.date.toLocaleDateString("es-SV", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.amount.toFixed(2)}</p>
                        <Badge variant="secondary" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                  View All Orders
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>

              <Separator />

              {/* Notes */}
              <div>
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <StickyNote className="h-3 w-3" />
                  Notes
                </h4>
                <div className="space-y-2">
                  {customerProfile.notes.map((note) => (
                    <div key={note.id} className="p-2 rounded-lg bg-muted/30 text-sm">
                      <p className="text-foreground">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.createdAt.toLocaleDateString("es-SV", { month: "short", day: "numeric" })} - {note.author}
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                  + Add Note
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
