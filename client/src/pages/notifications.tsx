import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertTriangle, CheckCircle2, UserPlus, AlertCircle, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Notification {
  id: string;
  type: "escalation" | "resolved" | "customer" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "escalation",
    title: "Nueva escalación",
    message: "José López solicita atención urgente sobre ropa dañada",
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
  },
  {
    id: "2",
    type: "resolved",
    title: "Conversación resuelta",
    message: "La consulta de María García fue resuelta por IA",
    timestamp: new Date(Date.now() - 15 * 60000),
    read: false,
  },
  {
    id: "3",
    type: "customer",
    title: "Nuevo cliente",
    message: "Ana Martínez se ha registrado desde WhatsApp",
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
  },
  {
    id: "4",
    type: "system",
    title: "Actualización del sistema",
    message: "El modelo de IA ha sido actualizado a la versión 2.5",
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: true,
  },
  {
    id: "5",
    type: "escalation",
    title: "Escalación pendiente",
    message: "Miguel Torres espera respuesta sobre pedido retrasado",
    timestamp: new Date(Date.now() - 3 * 3600000),
    read: true,
  },
  {
    id: "6",
    type: "resolved",
    title: "Conversación resuelta",
    message: "Consulta de Carlos Hernández sobre horarios resuelta",
    timestamp: new Date(Date.now() - 5 * 3600000),
    read: true,
  },
  {
    id: "7",
    type: "customer",
    title: "Cliente VIP",
    message: "Rosa Mejía ha alcanzado el estado VIP con 50 pedidos",
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
  },
];

export default function Notifications() {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "escalation":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-accent" />;
      case "customer":
        return <UserPlus className="h-5 w-5 text-primary" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return t("activity.justNow");
    if (minutes < 60) return t("activity.minAgo").replace("{min}", String(minutes));
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t("activity.hoursAgo").replace("{hours}", String(hours));
    return date.toLocaleDateString("es-SV");
  };

  const groupNotifications = () => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const earlier: Notification[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 3600000);

    notifications.forEach((n) => {
      const nDate = new Date(n.timestamp);
      if (nDate >= todayStart) {
        today.push(n);
      } else if (nDate >= yesterdayStart) {
        yesterday.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, yesterday, earlier };
  };

  const grouped = groupNotifications();

  const renderNotificationGroup = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground px-1">{title}</h3>
        {items.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read ? "bg-background" : "bg-primary/5 border-primary/20"
            } hover-elevate`}
            data-testid={`notification-item-${notification.id}`}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">{getIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm">{notification.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6" data-testid="notifications-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("notifications.title")}</h1>
          <p className="text-muted-foreground">{t("notifications.subtitle")}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} data-testid="button-mark-all-read">
            <Check className="h-4 w-4 mr-2" />
            {t("notifications.markAllRead")}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{t("notifications.title")}</CardTitle>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} sin leer</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">{t("notifications.noNotifications")}</p>
              <p className="text-sm text-muted-foreground">{t("notifications.allCaughtUp")}</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-6">
                {renderNotificationGroup(t("notifications.today"), grouped.today)}
                {renderNotificationGroup(t("notifications.yesterday"), grouped.yesterday)}
                {renderNotificationGroup(t("notifications.earlier"), grouped.earlier)}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
