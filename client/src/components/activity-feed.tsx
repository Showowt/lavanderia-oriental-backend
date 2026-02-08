import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertTriangle, CheckCircle, Package } from "lucide-react";
import type { ActivityItem } from "@shared/schema";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'escalation':
        return <AlertTriangle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'order':
        return <Package className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'message':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'escalation':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'resolved':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'order':
        return 'bg-chart-4/10 text-chart-4 border-chart-4/20';
    }
  };

  const getDotColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'message':
        return 'bg-primary';
      case 'escalation':
        return 'bg-destructive';
      case 'resolved':
        return 'bg-accent';
      case 'order':
        return 'bg-chart-4';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString('es-SV', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="h-full flex flex-col" data-testid="activity-feed">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Activity Feed</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {activities.length} activities
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4 pb-4">
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="flex gap-3 items-start"
                data-testid={`activity-item-${activity.id}`}
              >
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full ${getDotColor(activity.type)}`} />
                  {index < activities.length - 1 && (
                    <div className="w-px h-full bg-border mt-1 min-h-[40px]" />
                  )}
                </div>
                
                {/* Activity content */}
                <div className="flex-1 min-w-0 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`p-1 rounded-md border ${getActivityColor(activity.type)}`} data-testid={`activity-icon-${activity.type}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <span className="font-medium text-sm" data-testid={`activity-customer-${activity.id}`}>{activity.customerName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0" data-testid={`activity-time-${activity.id}`}>
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {activity.content}
                  </p>
                  {activity.locationName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.locationName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
