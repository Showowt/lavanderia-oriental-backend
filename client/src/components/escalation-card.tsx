import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import type { EscalationItem } from "@shared/schema";

interface EscalationListProps {
  escalations: EscalationItem[];
  onTakeOver?: (id: string) => void;
}

export function EscalationList({ escalations, onTakeOver }: EscalationListProps) {
  const getPriorityBadge = (priority: EscalationItem['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-chart-4/20 text-chart-4 border-chart-4/30 text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="text-xs">Low</Badge>;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    return new Date(date).toLocaleTimeString('es-SV', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="h-full flex flex-col border-destructive/20" data-testid="escalation-list">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <CardTitle className="text-base">Escalations</CardTitle>
          </div>
          <Badge variant="destructive" className="text-xs">
            {escalations.length} pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        {escalations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4" data-testid="escalation-empty-state">
            <CheckCircle2 className="h-8 w-8 mb-2 text-accent" />
            <p className="text-sm">No pending escalations</p>
          </div>
        ) : (
          <ScrollArea className="h-full px-4 pb-4">
            <div className="space-y-3">
              {escalations.map((escalation) => (
                <div 
                  key={escalation.id} 
                  className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 space-y-2"
                  data-testid={`escalation-item-${escalation.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{escalation.customerName}</p>
                      <p className="text-xs text-muted-foreground">{escalation.customerPhone}</p>
                    </div>
                    {getPriorityBadge(escalation.priority)}
                  </div>
                  
                  <p className="text-sm text-foreground/80 line-clamp-2">
                    {escalation.reason}
                  </p>
                  
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(escalation.timestamp)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-xs"
                        data-testid={`button-call-${escalation.id}`}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-7 px-2 text-xs gold-gradient"
                        onClick={() => onTakeOver?.(escalation.id)}
                        data-testid={`button-takeover-${escalation.id}`}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Take Over
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
