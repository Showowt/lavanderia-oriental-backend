import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, MessageSquare, DollarSign, Clock, Sparkles, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";

export default function Analytics() {
  const { t } = useI18n();

  const weeklyData = [
    { day: "Lun", conversations: 45, resolved: 42 },
    { day: "Mar", conversations: 52, resolved: 48 },
    { day: "Mié", conversations: 38, resolved: 35 },
    { day: "Jue", conversations: 61, resolved: 58 },
    { day: "Vie", conversations: 55, resolved: 51 },
    { day: "Sáb", conversations: 72, resolved: 68 },
    { day: "Dom", conversations: 31, resolved: 29 },
  ];

  const topLocations = [
    { name: "San Miguel - Casa Matriz", conversations: 245, revenue: "$4,250" },
    { name: "Santa Ana", conversations: 198, revenue: "$3,890" },
    { name: "Lourdes Colón", conversations: 156, revenue: "$2,780" },
    { name: "San Miguel - Col. Gavidia", conversations: 134, revenue: "$2,450" },
    { name: "Usulután", conversations: 112, revenue: "$2,100" },
  ];

  const peakHours = [
    { hour: "8:00", volume: 15 },
    { hour: "9:00", volume: 28 },
    { hour: "10:00", volume: 45 },
    { hour: "11:00", volume: 52 },
    { hour: "12:00", volume: 38 },
    { hour: "13:00", volume: 25 },
    { hour: "14:00", volume: 42 },
    { hour: "15:00", volume: 55 },
    { hour: "16:00", volume: 48 },
    { hour: "17:00", volume: 62 },
    { hour: "18:00", volume: 35 },
  ];

  return (
    <div className="p-6 space-y-6" data-testid="analytics-page">
      <div>
        <h1 className="text-2xl font-bold">{t("analytics.title")}</h1>
        <p className="text-muted-foreground">{t("analytics.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("stats.totalConversations")}
          value="1,247"
          icon={MessageSquare}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title={t("stats.aiResolutionRate")}
          value="94%"
          icon={Sparkles}
          variant="primary"
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title={t("stats.avgResponseTime")}
          value="2.3s"
          icon={Clock}
          variant="accent"
        />
        <StatCard
          title={t("performance.costSavings")}
          value="$8,450"
          icon={DollarSign}
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">{t("analytics.overview")}</TabsTrigger>
          <TabsTrigger value="conversations" data-testid="tab-conversations">{t("analytics.conversations")}</TabsTrigger>
          <TabsTrigger value="revenue" data-testid="tab-revenue">{t("analytics.revenue")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{t("analytics.conversationVolume")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyData.map((data, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-10 text-sm text-muted-foreground">{data.day}</span>
                      <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden flex">
                        <div
                          className="h-full bg-primary/80"
                          style={{ width: `${(data.conversations / 80) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-sm font-medium text-right">{data.conversations}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{t("analytics.aiVsHuman")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-8 py-6">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full border-8 border-primary flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold">94%</span>
                    </div>
                    <span className="text-sm text-muted-foreground">IA</span>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full border-8 border-accent flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold">6%</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Humano</span>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  1,172 resueltas por IA • 75 por agentes humanos
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{t("analytics.topLocations")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topLocations.map((location, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-sm">{location.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">{location.conversations} conv.</span>
                        <span className="font-medium text-accent">{location.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{t("analytics.peakHours")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-40 gap-1">
                  {peakHours.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary/80 rounded-t"
                        style={{ height: `${(data.volume / 70) * 100}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground">{data.hour.split(":")[0]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Métricas de Conversación</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Tiempo promedio de respuesta</span>
                  <span className="font-mono font-medium">2.3s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Mensajes por conversación</span>
                  <span className="font-mono font-medium">4.2</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Tasa de resolución en primer contacto</span>
                  <span className="font-mono font-medium text-accent">87%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Satisfacción del cliente</span>
                  <span className="font-mono font-medium text-primary">4.8/5.0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Temas Frecuentes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { topic: "Precios de servicios", count: 312, percentage: 45 },
                  { topic: "Horarios y sucursales", count: 198, percentage: 29 },
                  { topic: "Estado de pedidos", count: 156, percentage: 23 },
                  { topic: "Servicio delivery", count: 134, percentage: 19 },
                  { topic: "Lavado de zapatos (DRIP)", count: 89, percentage: 13 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.topic}</span>
                      <span className="text-muted-foreground">{item.count} consultas</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/80 rounded-full"
                        style={{ width: `${item.percentage * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Conversaciones por Canal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-3xl font-bold text-accent mb-1">94%</div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">4%</div>
                  <p className="text-sm text-muted-foreground">Sitio Web</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold mb-1">2%</div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Ingresos del Mes</div>
              <div className="text-2xl font-bold text-accent">$15,470</div>
              <div className="text-xs text-accent mt-1">+12% vs mes anterior</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Pedidos Completados</div>
              <div className="text-2xl font-bold">1,847</div>
              <div className="text-xs text-muted-foreground mt-1">Este mes</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Ticket Promedio</div>
              <div className="text-2xl font-bold">$8.38</div>
              <div className="text-xs text-primary mt-1">+5% vs mes anterior</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Delivery Generado</div>
              <div className="text-2xl font-bold">$1,240</div>
              <div className="text-xs text-muted-foreground mt-1">620 entregas</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Ingresos por Servicio</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { service: "Lavado + Secado", revenue: "$8,250", orders: 1250, color: "bg-primary" },
                  { service: "Edredones", revenue: "$2,890", orders: 385, color: "bg-accent" },
                  { service: "DRIP Zapatos", revenue: "$2,150", orders: 165, color: "bg-chart-3" },
                  { service: "Solo Lavado", revenue: "$1,450", orders: 483, color: "bg-chart-4" },
                  { service: "Delivery", revenue: "$730", orders: 365, color: "bg-chart-5" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-medium text-sm">{item.service}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">{item.orders} pedidos</span>
                      <span className="font-medium">{item.revenue}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Ingresos por Sucursal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {topLocations.map((location, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-sm">{location.name}</span>
                    </div>
                    <span className="font-medium text-accent">{location.revenue}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
