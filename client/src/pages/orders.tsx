import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  ShoppingBag,
  Plus,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  DollarSign,
  Filter,
  Eye
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";

interface OrderData {
  id: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  locationId?: string;
  locationName?: string;
  status: string;
  totalAmount?: number;
  items?: string;
  createdAt: Date | null;
  completedAt?: Date | null;
  hasDelivery?: boolean;
}

export default function Orders() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading } = useQuery<OrderData[]>({
    queryKey: ["/api/orders"],
  });

  const statusOptions = [
    { id: "all", name: "Todos" },
    { id: "pending", name: "Pendientes" },
    { id: "processing", name: "En Proceso" },
    { id: "ready", name: "Listos" },
    { id: "delivered", name: "Entregados" },
    { id: "cancelled", name: "Cancelados" },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone?.includes(searchQuery) ||
      order.id?.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Pendiente</Badge>;
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">En Proceso</Badge>;
      case "ready":
        return <Badge className="bg-accent/20 text-accent border-accent/30">Listo</Badge>;
      case "delivered":
        return <Badge variant="secondary">Entregado</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "processing":
        return <Package className="h-4 w-4 text-blue-600" />;
      case "ready":
        return <CheckCircle2 className="h-4 w-4 text-accent" />;
      case "delivered":
        return <Truck className="h-4 w-4 text-muted-foreground" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-SV", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount: number | undefined) => {
    if (!amount) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  const pendingCount = orders.filter(o => o.status === "pending").length;
  const processingCount = orders.filter(o => o.status === "processing").length;
  const readyCount = orders.filter(o => o.status === "ready").length;
  const todayRevenue = orders
    .filter(o => o.status === "delivered" && o.createdAt && new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="p-6 space-y-6" data-testid="orders-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("orders.title") || "Pedidos"}</h1>
          <p className="text-muted-foreground">{t("orders.subtitle") || "Gestiona pedidos y entregas"}</p>
        </div>
        <Button className="gold-gradient" data-testid="button-new-order">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Pedido
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pedidos Pendientes"
          value={pendingCount.toString()}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="En Proceso"
          value={processingCount.toString()}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Listos para Entrega"
          value={readyCount.toString()}
          icon={CheckCircle2}
          variant="accent"
        />
        <StatCard
          title="Ingresos Hoy"
          value={formatPrice(todayRevenue)}
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, teléfono o # pedido..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-orders"
          />
        </div>
        <Button variant="outline" size="icon" data-testid="button-filter">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex-wrap h-auto">
          {statusOptions.map((status) => (
            <TabsTrigger key={status.id} value={status.id} data-testid={`tab-${status.id}`}>
              {status.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Lista de Pedidos</CardTitle>
            </div>
            <Badge variant="secondary">{filteredOrders.length} pedidos</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">{t("common.loading")}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">No hay pedidos</p>
              <p className="text-sm text-muted-foreground">Los pedidos aparecerán aquí</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-480px)]">
              <div className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 hover-elevate"
                    data-testid={`order-item-${order.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {order.customerName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "??"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{order.customerName || "Cliente"}</span>
                          <span className="text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {order.customerPhone}
                          {order.locationName && ` • ${order.locationName}`}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          {getStatusBadge(order.status)}
                          {order.hasDelivery && (
                            <Badge variant="outline" className="text-xs">
                              <Truck className="h-3 w-3 mr-1" />
                              Delivery
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-primary mb-2">
                          {formatPrice(order.totalAmount)}
                        </div>
                        <Button variant="ghost" size="sm" data-testid={`button-view-${order.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span>Pendientes</span>
                </div>
                <span className="font-bold">{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span>En Proceso</span>
                </div>
                <span className="font-bold">{processingCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>Listos</span>
                </div>
                <span className="font-bold">{readyCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Entregados Hoy</span>
                </div>
                <span className="font-bold">
                  {orders.filter(o => o.status === "delivered" && o.createdAt && new Date(o.createdAt).toDateString() === new Date().toDateString()).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" data-testid="button-pending-today">
              <Clock className="h-4 w-4 mr-2" />
              Ver Pedidos Pendientes
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-ready-delivery">
              <Truck className="h-4 w-4 mr-2" />
              Pedidos Listos para Delivery
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-export-report">
              <DollarSign className="h-4 w-4 mr-2" />
              Exportar Reporte del Día
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
