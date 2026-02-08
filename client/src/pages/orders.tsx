import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ShoppingBag,
  Plus,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  DollarSign,
  Phone,
  MapPin,
  Calendar,
  Printer,
  Bell,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  StickyNote,
  X,
  ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";

interface OrderItem {
  id: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface TimelineEvent {
  id: string;
  status: string;
  label: string;
  timestamp: Date;
  note?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  locationId: string;
  locationName: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus: string;
  isDelivery: boolean;
  deliveryAddress?: string;
  estimatedReady?: Date;
  timeline: TimelineEvent[];
  notes?: string;
  createdAt: Date;
}

export default function Orders() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: orders = [], isLoading } = useQuery<OrderData[]>({
    queryKey: ["/api/orders"],
  });

  const { data: locations = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["/api/locations"],
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
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesBranch = branchFilter === "all" || order.locationId === branchFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case "created":
        return <ShoppingBag className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "ready":
        return <CheckCircle2 className="h-4 w-4" />;
      case "delivered":
        return <Truck className="h-4 w-4" />;
      default:
        return <ArrowRight className="h-4 w-4" />;
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

  const formatDateShort = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-SV", {
      day: "numeric",
      month: "short",
    });
  };

  const formatPrice = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  const getServicesSummary = (items: OrderItem[]) => {
    if (!items || items.length === 0) return "-";
    if (items.length === 1) return items[0].serviceName;
    return `${items[0].serviceName} +${items.length - 1}`;
  };

  const handleViewOrder = (order: OrderData) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setNewNote("");
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote, "to order:", selectedOrder?.id);
      setNewNote("");
    }
  };

  const handleMarkComplete = () => {
    console.log("Marking complete:", selectedOrder?.id);
  };

  const handleSendReminder = () => {
    console.log("Sending reminder:", selectedOrder?.id);
  };

  const handleReportIssue = () => {
    console.log("Reporting issue:", selectedOrder?.id);
  };

  const handlePrint = () => {
    console.log("Printing order:", selectedOrder?.id);
  };

  const pendingCount = orders.filter(o => o.status === "pending").length;
  const processingCount = orders.filter(o => o.status === "processing").length;
  const readyCount = orders.filter(o => o.status === "ready").length;
  const todayRevenue = orders
    .filter(o => o.status === "delivered" && o.createdAt && new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="p-6 space-y-6" data-testid="orders-page">
      {/* Header */}
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

      {/* Stats Cards */}
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

      {/* Filters */}
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
        <div className="flex gap-2">
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-branch">
              <SelectValue placeholder="Todas las sucursales" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sucursales</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="flex-wrap h-auto">
          {statusOptions.map((status) => (
            <TabsTrigger key={status.id} value={status.id} data-testid={`tab-${status.id}`}>
              {status.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Orders Table */}
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
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Pedido #</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Sucursal</TableHead>
                    <TableHead>Servicios</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewOrder(order)}
                      data-testid={`order-row-${order.id}`}
                    >
                      <TableCell className="font-mono text-sm">
                        {order.orderNumber || `#${order.id.slice(0, 8)}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {order.customerName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{order.customerName}</div>
                            <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{order.locationName}</TableCell>
                      <TableCell className="text-sm">{getServicesSummary(order.items)}</TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {formatPrice(order.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateShort(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrder(order);
                          }}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    Página {currentPage} de {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Pedido {selectedOrder?.orderNumber || `#${selectedOrder?.id?.slice(0, 8)}`}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer & Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedOrder.customerName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      Información del Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {selectedOrder.customerPhone}
                    </div>
                    {selectedOrder.customerEmail && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        {selectedOrder.customerEmail}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {selectedOrder.locationName}
                    </div>
                    {selectedOrder.isDelivery && selectedOrder.deliveryAddress && (
                      <div className="p-2 bg-muted/50 rounded text-sm">
                        <div className="flex items-center gap-1 text-accent font-medium mb-1">
                          <Truck className="h-3 w-3" />
                          Delivery
                        </div>
                        {selectedOrder.deliveryAddress}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Detalles del Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estado:</span>
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fecha de Creación:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    {selectedOrder.estimatedReady && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Entrega Estimada:</span>
                        <span>{formatDate(selectedOrder.estimatedReady)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pago:</span>
                      <Badge variant={selectedOrder.paymentStatus === "paid" ? "default" : "outline"}>
                        {selectedOrder.paymentStatus === "paid" ? "Pagado" : "Pendiente"}
                      </Badge>
                    </div>
                    {selectedOrder.paymentMethod && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Método:</span>
                        <span className="capitalize">{selectedOrder.paymentMethod}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Items Table */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Servicios</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Servicio</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Precio Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.serviceName}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatPrice(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-medium">{formatPrice(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="p-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.deliveryFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Delivery</span>
                        <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                      </div>
                    )}
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm text-accent">
                        <span>Descuento</span>
                        <span>-{formatPrice(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Historial del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {selectedOrder.timeline?.map((event, index) => (
                      <div key={event.id} className="flex gap-4 pb-4 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            {getTimelineIcon(event.status)}
                          </div>
                          {index < selectedOrder.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{event.label}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</span>
                          </div>
                          {event.note && (
                            <p className="text-sm text-muted-foreground mt-1">{event.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    Notas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedOrder.notes && (
                    <div className="p-3 bg-muted/50 rounded text-sm">
                      {selectedOrder.notes}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Agregar una nota..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 justify-end pt-2 border-t">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button variant="outline" onClick={handleSendReminder}>
                  <Bell className="h-4 w-4 mr-2" />
                  Enviar Recordatorio
                </Button>
                <Button variant="outline" className="text-destructive" onClick={handleReportIssue}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Reportar Problema
                </Button>
                {selectedOrder.status !== "delivered" && selectedOrder.status !== "cancelled" && (
                  <Button className="gold-gradient" onClick={handleMarkComplete}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Marcar Completado
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
