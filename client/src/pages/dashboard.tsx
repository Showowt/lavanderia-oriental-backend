import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/stat-card";
import { WhatsAppChat } from "@/components/whatsapp-chat";
import { ActivityFeed } from "@/components/activity-feed";
import { EscalationList } from "@/components/escalation-card";
import { LocationSelector } from "@/components/location-selector";
import { useI18n } from "@/lib/i18n";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Zap,
  CheckCircle,
  Star
} from "lucide-react";
import type { DashboardStats, ChatMessage, ActivityItem, EscalationItem, Location, PerformanceMetrics } from "@shared/schema";

export default function Dashboard() {
  const { t } = useI18n();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  const { data: locationsData } = useQuery<Location[]>({
    queryKey: ['/api/locations'],
  });

  const locations = (locationsData || [])
    .filter(loc => loc.isActive)
    .map(loc => ({ id: loc.id, name: loc.name, city: loc.city || undefined }));

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats', selectedLocation],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/stats?locationId=${selectedLocation}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    }
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/dashboard/messages'],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<ActivityItem[]>({
    queryKey: ['/api/dashboard/activities'],
  });

  const { data: escalations, isLoading: escalationsLoading } = useQuery<EscalationItem[]>({
    queryKey: ['/api/dashboard/escalations'],
  });

  const { data: performance, isLoading: performanceLoading } = useQuery<PerformanceMetrics>({
    queryKey: ['/api/dashboard/performance'],
  });

  return (
    <div className="p-6 space-y-6 wave-pattern min-h-screen" data-testid="dashboard-page">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            {t("dashboard.title")}
            <Badge variant="outline" className="text-primary border-primary/30 font-normal">
              <Zap className="h-3 w-3 mr-1" />
              {t("dashboard.live")}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <LocationSelector 
          locations={locations}
          selectedId={selectedLocation}
          onSelect={setSelectedLocation}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title={t("stats.totalConversations")}
              value={stats?.totalConversations || 0}
              subtitle={t("stats.today")}
              icon={MessageSquare}
              trend={{ value: 12, isPositive: true }}
              variant="primary"
            />
            <StatCard
              title={t("stats.activeNow")}
              value={stats?.activeConversations || 0}
              subtitle={t("stats.liveConversations")}
              icon={Users}
              variant="accent"
            />
            <StatCard
              title={t("stats.aiResolutionRate")}
              value={`${stats?.aiResolutionRate || 0}%`}
              subtitle={t("stats.withoutHumanIntervention")}
              icon={TrendingUp}
              trend={{ value: 5, isPositive: true }}
              variant="default"
            />
            <StatCard
              title={t("stats.escalations")}
              value={stats?.escalations || 0}
              subtitle={t("stats.pendingReview")}
              icon={AlertTriangle}
              variant="warning"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              title={t("stats.avgResponseTime")}
              value={stats?.avgResponseTime || "0s"}
              icon={Clock}
            />
            <StatCard
              title={t("stats.messagesProcessed")}
              value={stats?.messagesProcessed || 0}
              subtitle={t("stats.last24Hours")}
              icon={Zap}
            />
            <StatCard
              title={t("stats.resolvedToday")}
              value={stats?.resolvedToday || 0}
              icon={CheckCircle}
            />
            <StatCard
              title={t("stats.customerSatisfaction")}
              value={`${stats?.customerSatisfaction || 0}%`}
              icon={Star}
              trend={{ value: 2, isPositive: true }}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[500px]">
          {messagesLoading ? (
            <Card className="h-full p-4">
              <Skeleton className="h-12 w-full mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className={`h-12 ${i % 2 === 0 ? 'w-3/4' : 'w-2/3 ml-auto'}`} />
                ))}
              </div>
            </Card>
          ) : (
            <WhatsAppChat
              customerName="María García"
              customerPhone="+503 7890-1234"
              messages={messages || []}
              isTyping={true}
            />
          )}
        </div>

        <div className="lg:col-span-1 h-[500px]">
          {activitiesLoading ? (
            <Card className="h-full p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <ActivityFeed activities={activities || []} />
          )}
        </div>

        <div className="lg:col-span-1 h-[500px]">
          {escalationsLoading ? (
            <Card className="h-full p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <EscalationList 
              escalations={escalations || []} 
              onTakeOver={(id) => console.log('Taking over:', id)}
            />
          )}
        </div>
      </div>

      <Card data-testid="performance-summary">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t("performance.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {performanceLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-9 w-20 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-primary" data-testid="fcr-value">
                  {performance?.firstContactResolution.percentage || 87}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t("performance.firstContactResolution")}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-accent" data-testid="rating-value">
                  {performance?.averageRating.score || 4.8}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("performance.avgRating")} ({performance?.averageRating.maxScore || 5.0})
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono" data-testid="response-time-value">
                  {performance?.averageResponseTime.seconds || 2.3}s
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t("performance.avgResponseTime")}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-mono text-chart-4" data-testid="savings-value">
                  ${performance?.costSavings.amount
                    ? (performance.costSavings.amount >= 1000
                        ? `${(performance.costSavings.amount / 1000).toFixed(1)}k`
                        : performance.costSavings.amount)
                    : '2.4k'}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t("performance.costSavings")} ({t("performance.thisMonth")})</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
