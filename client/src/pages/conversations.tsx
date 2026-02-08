import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageSquare, Filter, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";

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
}

export default function Conversations() {
  const { t } = useI18n();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations = [], isLoading } = useQuery<ConversationWithCustomer[]>({
    queryKey: ["/api/conversations"],
  });

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.customerPhone?.includes(searchQuery);
    
    if (filter === "all") return matchesSearch;
    if (filter === "active") return conv.status === "active" && matchesSearch;
    if (filter === "resolved") return conv.status === "resolved" && matchesSearch;
    if (filter === "escalated") return conv.status === "escalated" && matchesSearch;
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-accent/20 text-accent border-accent/30">{t("conversations.active")}</Badge>;
      case "resolved":
        return <Badge variant="secondary">{t("conversations.resolved")}</Badge>;
      case "escalated":
        return <Badge variant="destructive">{t("conversations.escalated")}</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return t("activity.justNow");
    if (minutes < 60) return t("activity.minAgo").replace("{min}", String(minutes));
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t("activity.hoursAgo").replace("{hours}", String(hours));
    return new Date(date).toLocaleDateString("es-SV");
  };

  return (
    <div className="p-6 space-y-6" data-testid="conversations-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("conversations.title")}</h1>
          <p className="text-muted-foreground">{t("conversations.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("conversations.search")}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-conversations"
            />
          </div>
          <Button variant="outline" size="icon" data-testid="button-filter">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">{t("conversations.all")}</TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active">{t("conversations.active")}</TabsTrigger>
          <TabsTrigger value="resolved" data-testid="tab-resolved">{t("conversations.resolved")}</TabsTrigger>
          <TabsTrigger value="escalated" data-testid="tab-escalated">{t("conversations.escalated")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{t("conversations.title")}</CardTitle>
            </div>
            <Badge variant="secondary">{filteredConversations.length} {t("conversations.messages")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">{t("common.loading")}</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">{t("conversations.noConversations")}</p>
              <p className="text-sm text-muted-foreground">{t("conversations.startNew")}</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="divide-y divide-border">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-4 hover-elevate cursor-pointer"
                    data-testid={`conversation-item-${conversation.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {conversation.customerName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-medium truncate">{conversation.customerName || "Unknown"}</span>
                            {conversation.aiHandled && (
                              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatTime(conversation.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-2">
                          {conversation.customerPhone}
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(conversation.status)}
                          <span className="text-xs text-muted-foreground">
                            {conversation.messageCount} {t("conversations.messages")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
