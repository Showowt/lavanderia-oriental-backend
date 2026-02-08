import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  DollarSign,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  Download,
  ShoppingBag,
  Star,
  Bot,
  UserCheck,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Percent
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";

interface AnalyticsSummary {
  period: { start: string; end: string };
  conversations: {
    total: number;
    resolved: number;
    escalated: number;
    aiResolutionRate: number;
    trend: number;
  };
  messages: {
    total: number;
    inbound: number;
    outbound: number;
    avgPerConversation: number;
  };
  orders: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
    totalRevenue: number;
    trend: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    vip: number;
  };
  performance: {
    avgResponseTime: string;
    customerSatisfaction: number;
    firstContactResolution: number;
    peakHours: string[];
  };
  topServices: { name: string; count: number; revenue: number }[];
  locationPerformance: { name: string; orders: number; revenue: number }[];
  dailyData: { date: string; conversations: number; orders: number; revenue: number }[];
}

interface LocationData {
  id: string;
  name: string;
  city: string;
}

export default function Analytics() {
  const { t } = useI18n();
  const [dateRange, setDateRange] = useState("week");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const { data: analytics, isLoading } = useQuery<AnalyticsSummary>({
    queryKey: ["/api/analytics/summary", dateRange, selectedLocation],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/summary?range=${dateRange}&locationId=${selectedLocation}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    }
  });

  const { data: locations = [] } = useQuery<LocationData[]>({
    queryKey: ["/api/locations"],
  });

  const { data: dailyData = [] } = useQuery<{ date: string; conversations: number; orders: number; revenue: number }[]>({
    queryKey: ["/api/analytics/daily", dateRange],
  });

  const formatPrice = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatTrend = (trend: number) => {
    const isPositive = trend >= 0;
    return (
      <span className={`flex items-center gap-1 text-xs ${isPositive ? "text-accent" : "text-destructive"}`}>
        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {Math.abs(trend)}%
      </span>
    );
  };

  const handleExport = () => {
    console.log("Exporting analytics report...");
  };

  const dateRangeOptions = [
    { value: "today", label: "Hoy" },
    { value: "week", label: "Esta Semana" },
    { value: "month", label: "Este Mes" },
    { value: "quarter", label: "Este Trimestre" },
  ];

  const topicsData = [
    { topic: "Precios de servicios", count: 312, percentage: 45, trend: 8 },
    { topic: "Horarios y sucursales", count: 198, percentage: 29, trend: -3 },
    { topic: "Estado de pedidos", count: 156, percentage: 23, trend: 12 },
    { topic: "Servicio delivery", count: 134, percentage: 19, trend: 15 },
    { topic: "Lavado de zapatos (DRIP)", count: 89, percentage: 13, trend: 22 },
  ];

  const channelData = [
    { name: "WhatsApp", percentage: 94, color: "bg-accent" },
    { name: "Sitio Web", percentage: 4, color: "bg-primary" },
    { name: "Teléfono", percentage: 2, color: "bg-muted-foreground" },
  ];

  return (
    <div className="p-6 space-y-6" data-testid="analytics-page">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("analytics.title") || "Analíticas"}</h1>
          <p className="text-muted-foreground">{t("analytics.subtitle") || "Métricas y rendimiento del sistema"}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Todas las sucursales" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sucursales</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Conversaciones"
              value={analytics?.conversations.total.toLocaleString() || "0"}
              icon={MessageSquare}
              trend={{ value: analytics?.conversations.trend || 0, isPositive: (analytics?.conversations.trend || 0) >= 0 }}
            />
            <StatCard
              title="Resolución IA"
              value={`${analytics?.conversations.aiResolutionRate || 0}%`}
              icon={Bot}
              variant="primary"
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Ingresos"
              value={formatPrice(analytics?.orders.totalRevenue || 0)}
              icon={DollarSign}
              variant="accent"
              trend={{ value: analytics?.orders.trend || 0, isPositive: (analytics?.orders.trend || 0) >= 0 }}
            />
            <StatCard
              title="Satisfacción"
              value={`${analytics?.performance.customerSatisfaction || 0}%`}
              icon={Star}
              trend={{ value: 2, isPositive: true }}
            />
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="conversations">Conversaciones</TabsTrigger>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="ai">Rendimiento IA</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Daily Trend Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Tendencia Diaria</CardTitle>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    Conversaciones
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    Pedidos
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-48 gap-2">
                {(dailyData.length > 0 ? dailyData : analytics?.dailyData || []).map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-1 items-end h-36">
                      <div
                        className="flex-1 bg-primary/80 rounded-t"
                        style={{ height: `${Math.min(100, (day.conversations / 200) * 100)}%` }}
                      />
                      <div
                        className="flex-1 bg-accent/80 rounded-t"
                        style={{ height: `${Math.min(100, (day.orders / 80) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(day.date).toLocaleDateString("es-SV", { weekday: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI vs Human */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Resolución: IA vs Humano</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-8 py-4">
                  <div className="text-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" className="text-muted" strokeWidth="8" />
                        <circle
                          cx="56" cy="56" r="48" fill="none" stroke="currentColor"
                          className="text-primary"
                          strokeWidth="8"
                          strokeDasharray={`${(analytics?.conversations.aiResolutionRate || 94) * 3.02} 302`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{analytics?.conversations.aiResolutionRate || 94}%</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Bot className="h-4 w-4" />
                      IA
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" className="text-muted" strokeWidth="8" />
                        <circle
                          cx="56" cy="56" r="48" fill="none" stroke="currentColor"
                          className="text-accent"
                          strokeWidth="8"
                          strokeDasharray={`${(100 - (analytics?.conversations.aiResolutionRate || 94)) * 3.02} 302`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{100 - (analytics?.conversations.aiResolutionRate || 94)}%</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <UserCheck className="h-4 w-4" />
                      Humano
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  {analytics?.conversations.resolved || 1172} resueltas por IA • {analytics?.conversations.escalated || 75} por agentes
                </div>
              </CardContent>
            </Card>

            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Horas Pico</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-40 gap-1">
                  {[
                    { hour: "7", volume: 15 },
                    { hour: "8", volume: 28 },
                    { hour: "9", volume: 45 },
                    { hour: "10", volume: 52 },
                    { hour: "11", volume: 48 },
                    { hour: "12", volume: 38 },
                    { hour: "13", volume: 25 },
                    { hour: "14", volume: 42 },
                    { hour: "15", volume: 55 },
                    { hour: "16", volume: 48 },
                    { hour: "17", volume: 62 },
                    { hour: "18", volume: 35 },
                  ].map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t transition-all ${data.volume > 50 ? "bg-primary" : "bg-primary/60"}`}
                        style={{ height: `${(data.volume / 70) * 100}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground">{data.hour}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span>Hora pico: <strong className="text-foreground">5:00 PM</strong></span>
                  <span>Promedio: <strong className="text-foreground">41 msgs/hora</strong></span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Locations */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Rendimiento por Sucursal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(analytics?.locationPerformance || [
                    { name: "San Miguel - Casa Matriz", orders: 156, revenue: 1023.50 },
                    { name: "Lourdes Colón", orders: 98, revenue: 687.30 },
                    { name: "Santa Ana", orders: 87, revenue: 598.20 },
                    { name: "San Miguel - Col. Gavidia", orders: 52, revenue: 345.00 },
                    { name: "Usulután", orders: 30, revenue: 193.50 },
                  ]).map((location, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-sm">{location.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{location.orders} pedidos</span>
                        <span className="font-medium text-accent">{formatPrice(location.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Services */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Servicios Más Populares</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(analytics?.topServices || [
                    { name: "Carga Normal - L+S", count: 187, revenue: 1028.50 },
                    { name: "DRIP Básico", count: 89, revenue: 881.10 },
                    { name: "Carga Pesada - L+S", count: 67, revenue: 435.50 },
                    { name: "DRIP Especial", count: 45, revenue: 580.50 },
                    { name: "Delivery", count: 156, revenue: 312.00 },
                  ]).map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${
                          idx === 0 ? "bg-primary" : idx === 1 ? "bg-accent" : idx === 2 ? "bg-chart-3" : "bg-chart-4"
                        }`} />
                        <span className="font-medium text-sm">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{service.count}</span>
                        <span className="font-medium">{formatPrice(service.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Total Mensajes</span>
              </div>
              <div className="text-2xl font-bold">{analytics?.messages.total.toLocaleString() || "8,934"}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {analytics?.messages.avgPerConversation || 7.2} promedio por conversación
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Tiempo Respuesta</span>
              </div>
              <div className="text-2xl font-bold">{analytics?.performance.avgResponseTime || "2.3s"}</div>
              <div className="text-xs text-accent mt-1">-0.5s vs período anterior</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm">Primera Resolución</span>
              </div>
              <div className="text-2xl font-bold">{analytics?.performance.firstContactResolution || 87}%</div>
              <div className="text-xs text-accent mt-1">+3% vs período anterior</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Escalaciones</span>
              </div>
              <div className="text-2xl font-bold">{analytics?.conversations.escalated || 58}</div>
              <div className="text-xs text-destructive mt-1">+5 vs período anterior</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Topics */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Temas Frecuentes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {topicsData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{item.count}</span>
                        {formatTrend(item.trend)}
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/80 rounded-full transition-all"
                        style={{ width: `${item.percentage * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Channels */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Canales de Contacto</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelData.map((channel, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium">{channel.name}</div>
                      <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className={`h-full ${channel.color} transition-all flex items-center justify-end pr-2`}
                          style={{ width: `${channel.percentage}%` }}
                        >
                          <span className="text-xs font-medium text-white">{channel.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span><strong>WhatsApp</strong> genera el 94% del volumen de conversaciones</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Ingresos del Período</div>
              <div className="text-2xl font-bold text-accent">{formatPrice(analytics?.orders.totalRevenue || 2847.50)}</div>
              <div className="text-xs text-accent mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +{analytics?.orders.trend || 12}% vs período anterior
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Pedidos Completados</div>
              <div className="text-2xl font-bold">{analytics?.orders.completed || 398}</div>
              <div className="text-xs text-muted-foreground mt-1">{analytics?.orders.pending || 13} pendientes</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Ticket Promedio</div>
              <div className="text-2xl font-bold">
                ${((analytics?.orders.totalRevenue || 2847.50) / (analytics?.orders.completed || 398)).toFixed(2)}
              </div>
              <div className="text-xs text-primary mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +5% vs período anterior
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Tasa de Cancelación</div>
              <div className="text-2xl font-bold">
                {((analytics?.orders.cancelled || 12) / (analytics?.orders.total || 423) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-accent mt-1 flex items-center gap-1">
                <ArrowDownRight className="h-3 w-3" />
                -2% vs período anterior
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Service */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Ingresos por Servicio</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { service: "Lavado + Secado", revenue: 8250, orders: 1250, color: "bg-primary", percent: 53 },
                  { service: "Edredones", revenue: 2890, orders: 385, color: "bg-accent", percent: 19 },
                  { service: "DRIP Zapatos", revenue: 2150, orders: 165, color: "bg-chart-3", percent: 14 },
                  { service: "Solo Lavado", revenue: 1450, orders: 483, color: "bg-chart-4", percent: 9 },
                  { service: "Delivery", revenue: 730, orders: 365, color: "bg-chart-5", percent: 5 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.service}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs">{item.orders} pedidos</span>
                        <span className="font-medium">{formatPrice(item.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Revenue by Location */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Ingresos por Sucursal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(analytics?.locationPerformance || [
                  { name: "San Miguel - Casa Matriz", orders: 156, revenue: 4250 },
                  { name: "Lourdes Colón", orders: 98, revenue: 2780 },
                  { name: "Santa Ana", orders: 87, revenue: 3890 },
                  { name: "San Miguel - Col. Gavidia", orders: 52, revenue: 2450 },
                  { name: "Usulután", orders: 30, revenue: 2100 },
                ]).map((location, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-sm">{location.name}</span>
                    </div>
                    <span className="font-bold text-accent">{formatPrice(location.revenue)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Total Clientes</span>
              </div>
              <div className="text-2xl font-bold">{analytics?.customers.total || 856}</div>
              <div className="text-xs text-accent mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +{analytics?.customers.new || 47} nuevos
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <UserCheck className="h-4 w-4" />
                <span className="text-sm">Clientes Recurrentes</span>
              </div>
              <div className="text-2xl font-bold">{analytics?.customers.returning || 809}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {(((analytics?.customers.returning || 809) / (analytics?.customers.total || 856)) * 100).toFixed(0)}% del total
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Star className="h-4 w-4" />
                <span className="text-sm">Clientes VIP</span>
              </div>
              <div className="text-2xl font-bold">{analytics?.customers.vip || 23}</div>
              <div className="text-xs text-primary mt-1">Alto valor de vida</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Percent className="h-4 w-4" />
                <span className="text-sm">Tasa de Retención</span>
              </div>
              <div className="text-2xl font-bold">94.5%</div>
              <div className="text-xs text-accent mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +2.3% vs período anterior
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Segmentación de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { segment: "Clientes Nuevos", count: 47, percent: 5, color: "bg-chart-3" },
                    { segment: "Ocasionales (1-3 pedidos)", count: 312, percent: 36, color: "bg-chart-4" },
                    { segment: "Regulares (4-10 pedidos)", count: 389, percent: 45, color: "bg-primary" },
                    { segment: "Frecuentes (11+ pedidos)", count: 85, percent: 10, color: "bg-accent" },
                    { segment: "VIP (alto valor)", count: 23, percent: 3, color: "bg-chart-5" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>{item.segment}</span>
                          <span className="font-medium">{item.count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent * 2}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Valor de Vida del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary">$45.80</div>
                      <div className="text-sm text-muted-foreground mt-1">LTV Promedio</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-accent">$285.50</div>
                      <div className="text-sm text-muted-foreground mt-1">LTV VIP Promedio</div>
                    </div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="text-sm">
                      <strong>Insight:</strong> Los clientes VIP generan 6x más ingresos que el cliente promedio.
                      Considera programas de lealtad para aumentar la conversión a VIP.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Performance Tab */}
        <TabsContent value="ai" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Bot className="h-4 w-4" />
                <span className="text-sm">Tasa de Resolución</span>
              </div>
              <div className="text-2xl font-bold text-primary">{analytics?.conversations.aiResolutionRate || 94}%</div>
              <div className="text-xs text-accent mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +5% vs mes anterior
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Tiempo Respuesta</span>
              </div>
              <div className="text-2xl font-bold">2.3s</div>
              <div className="text-xs text-muted-foreground mt-1">Promedio</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Ahorro Mensual</span>
              </div>
              <div className="text-2xl font-bold text-accent">$2,400</div>
              <div className="text-xs text-muted-foreground mt-1">vs agentes humanos</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Star className="h-4 w-4" />
                <span className="text-sm">Satisfacción IA</span>
              </div>
              <div className="text-2xl font-bold">4.7/5.0</div>
              <div className="text-xs text-muted-foreground mt-1">Calificación promedio</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Intenciones Detectadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { intent: "Consulta de precios", count: 523, accuracy: 98 },
                  { intent: "Información de sucursales", count: 312, accuracy: 97 },
                  { intent: "Estado de pedido", count: 198, accuracy: 95 },
                  { intent: "Agendar recogida", count: 156, accuracy: 92 },
                  { intent: "Reclamo/Queja", count: 45, accuracy: 88 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{item.intent}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">{item.count}</span>
                      <Badge variant={item.accuracy >= 95 ? "default" : item.accuracy >= 90 ? "secondary" : "outline"}>
                        {item.accuracy}% precisión
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Razones de Escalación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { reason: "Solicitud explícita de agente", count: 28, percent: 48 },
                  { reason: "Reclamo o queja", count: 15, percent: 26 },
                  { reason: "Consulta compleja", count: 8, percent: 14 },
                  { reason: "Baja confianza IA", count: 5, percent: 9 },
                  { reason: "Error técnico", count: 2, percent: 3 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.reason}</span>
                      <span className="text-muted-foreground">{item.count} casos</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-destructive/60 rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cálculo de Ahorro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold">{analytics?.conversations.resolved || 1085}</div>
                  <div className="text-sm text-muted-foreground mt-1">Conversaciones resueltas por IA</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-3xl font-bold">$2.21</div>
                  <div className="text-sm text-muted-foreground mt-1">Ahorro por conversación</div>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <div className="text-3xl font-bold text-accent">$2,397.85</div>
                  <div className="text-sm text-muted-foreground mt-1">Ahorro total este mes</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20 text-sm">
                <strong>Metodología:</strong> Costo promedio de un agente humano ($15/hora) × tiempo promedio por conversación (8.5 min) = $2.21 por conversación.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
