import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Sparkles,
  Plus,
  Edit2,
  DollarSign,
  Tag,
  Package,
  X,
  Save,
  TrendingUp,
  BarChart3,
  Trash2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";

interface ServiceData {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  categoryName?: string;
  description?: string;
  price: number;
  priceLavado?: number;
  priceLavadoSecado?: number;
  priceSecado?: number;
  pricePlanchado?: number;
  unit?: string;
  displayOrder?: number;
  isActive: boolean;
  stats?: {
    ordersToday: number;
    ordersWeek: number;
    ordersMonth: number;
    revenueMonth: number;
  };
  createdAt?: Date;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  serviceCount: number;
}

export default function Services() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewService, setIsNewService] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ServiceData>>({});

  const { data: services = [], isLoading } = useQuery<ServiceData[]>({
    queryKey: ["/api/services"],
  });

  const { data: categories = [] } = useQuery<CategoryData[]>({
    queryKey: ["/api/service-categories"],
  });

  const categoryOptions = [
    { id: "all", name: "Todos", slug: "all" },
    { id: "lavado", name: "Lavado", slug: "lavado" },
    { id: "edredones", name: "Edredones", slug: "edredones" },
    { id: "drip", name: "DRIP Zapatos", slug: "drip" },
    { id: "extras", name: "Extras", slug: "extras" },
    { id: "delivery", name: "Delivery", slug: "delivery" },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return "$0.00";
    return `$${price.toFixed(2)}`;
  };

  const handleViewService = (service: ServiceData) => {
    setSelectedService(service);
    setEditForm(service);
    setIsModalOpen(true);
    setIsEditing(false);
    setIsNewService(false);
  };

  const handleNewService = () => {
    setSelectedService(null);
    setEditForm({
      name: "",
      nameEn: "",
      category: "lavado",
      description: "",
      price: 0,
      isActive: true
    });
    setIsModalOpen(true);
    setIsEditing(true);
    setIsNewService(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setIsEditing(false);
    setIsNewService(false);
    setEditForm({});
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log("Saving service:", editForm);
    setIsEditing(false);
    if (isNewService) {
      handleCloseModal();
    }
  };

  const handleCancelEdit = () => {
    if (isNewService) {
      handleCloseModal();
    } else {
      setEditForm(selectedService || {});
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    console.log("Deleting service:", selectedService?.id);
    handleCloseModal();
  };

  const activeServices = services.filter(s => s.isActive !== false);
  const totalRevenue = services.reduce((sum, s) => sum + (s.stats?.revenueMonth || 0), 0);
  const avgPrice = services.length > 0
    ? (services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(2)
    : "0.00";

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "lavado": return "🧺";
      case "edredones": return "🛏️";
      case "drip": return "👟";
      case "extras": return "✨";
      case "delivery": return "🚚";
      default: return "📦";
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="services-page">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("services.title") || "Servicios"}</h1>
          <p className="text-muted-foreground">{t("services.subtitle") || "Gestiona precios y catálogo de servicios"}</p>
        </div>
        <Button className="gold-gradient" onClick={handleNewService} data-testid="button-add-service">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Servicio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Servicios"
          value={services.length.toString()}
          icon={Package}
        />
        <StatCard
          title="Servicios Activos"
          value={activeServices.length.toString()}
          icon={Sparkles}
          variant="accent"
        />
        <StatCard
          title="Categorías"
          value={categoryOptions.length - 1}
          icon={Tag}
          variant="primary"
        />
        <StatCard
          title="Precio Promedio"
          value={`$${avgPrice}`}
          icon={DollarSign}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar servicios..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-services"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex-wrap h-auto">
          {categoryOptions.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} data-testid={`tab-${cat.id}`}>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Services Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Catálogo de Servicios</CardTitle>
            </div>
            <Badge variant="secondary">{filteredServices.length} servicios</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">{t("common.loading")}</div>
          ) : filteredServices.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">No hay servicios</p>
              <p className="text-sm text-muted-foreground">Agrega servicios al catálogo</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow
                    key={service.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewService(service)}
                    data-testid={`service-row-${service.id}`}
                  >
                    <TableCell className="text-center text-lg">
                      {getCategoryIcon(service.category)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{service.name}</div>
                        {service.description && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {service.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {formatPrice(service.price)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          service.isActive !== false
                            ? "bg-accent/20 text-accent border-accent/30"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {service.isActive !== false ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewService(service);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Price Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Tabla de Precios Rápida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span className="text-lg">🧺</span>
                Cargas de Ropa
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>Carga Normal (L+S)</span>
                  <span className="font-medium text-primary">$5.50</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>Carga Pesada (L+S)</span>
                  <span className="font-medium text-primary">$6.50</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>Solo Lavado (Normal)</span>
                  <span className="font-medium text-primary">$3.00</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>Solo Lavado (Pesada)</span>
                  <span className="font-medium text-primary">$3.50</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span className="text-lg">👟</span>
                DRIP Zapatos
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>DRIP Básico</span>
                  <span className="font-medium text-primary">$9.90</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>DRIP Especial</span>
                  <span className="font-medium text-primary">$12.90</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>DRIP Premium</span>
                  <span className="font-medium text-primary">$16.90</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>DRIP Niños</span>
                  <span className="font-medium text-primary">$5.90</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span className="text-lg">🛏️</span>
                Edredones
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>1.20-1.40m</span>
                  <span className="font-medium text-primary">$6.50</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>1.60m</span>
                  <span className="font-medium text-primary">$7.50</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>2.00m+</span>
                  <span className="font-medium text-primary">$8.50</span>
                </div>
                <div className="flex justify-between p-2 bg-accent/10 rounded border border-accent/20">
                  <span className="flex items-center gap-1">
                    <span>🚚</span> Delivery
                  </span>
                  <span className="font-medium text-accent">$2.00</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Detail/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {isNewService ? "Nuevo Servicio" : selectedService?.name}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {!isEditing && !isNewService ? (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" />
                      Guardar
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Service Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre (Español)</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Ej: Carga Normal - Lavado + Secado"
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded">{selectedService?.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Nombre (Inglés)</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.nameEn || ""}
                      onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                      placeholder="Ej: Normal Load - Wash + Dry"
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded">{selectedService?.nameEn || "-"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Categoría</Label>
                  {isEditing ? (
                    <Select
                      value={editForm.category || "lavado"}
                      onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.filter(c => c.id !== "all").map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {getCategoryIcon(cat.id)} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded flex items-center gap-2">
                      {getCategoryIcon(selectedService?.category || "")}
                      <span className="capitalize">{selectedService?.category}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Precio Principal</Label>
                  {isEditing ? (
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        className="pl-9"
                        value={editForm.price || 0}
                        onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-primary">{formatPrice(selectedService?.price)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Unidad</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.unit || ""}
                      onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                      placeholder="Ej: por carga, por par, por pieza"
                    />
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded">{selectedService?.unit || "por servicio"}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label>Estado</Label>
                  {isEditing ? (
                    <Switch
                      checked={editForm.isActive !== false}
                      onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                    />
                  ) : (
                    <Badge
                      className={
                        selectedService?.isActive !== false
                          ? "bg-accent/20 text-accent border-accent/30"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {selectedService?.isActive !== false ? "Activo" : "Inactivo"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Multiple Prices (for services with variants) */}
            {(editForm.category === "lavado" || selectedService?.category === "lavado") && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Precios por Tipo de Servicio</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Solo Lavado</Label>
                    {isEditing ? (
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-9 h-9"
                          value={editForm.priceLavado || 0}
                          onChange={(e) => setEditForm({ ...editForm, priceLavado: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-medium">{formatPrice(selectedService?.priceLavado)}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Lavado + Secado</Label>
                    {isEditing ? (
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-9 h-9"
                          value={editForm.priceLavadoSecado || 0}
                          onChange={(e) => setEditForm({ ...editForm, priceLavadoSecado: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-medium">{formatPrice(selectedService?.priceLavadoSecado)}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Solo Secado</Label>
                    {isEditing ? (
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-9 h-9"
                          value={editForm.priceSecado || 0}
                          onChange={(e) => setEditForm({ ...editForm, priceSecado: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-medium">{formatPrice(selectedService?.priceSecado)}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Planchado</Label>
                    {isEditing ? (
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-9 h-9"
                          value={editForm.pricePlanchado || 0}
                          onChange={(e) => setEditForm({ ...editForm, pricePlanchado: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-medium">{formatPrice(selectedService?.pricePlanchado)}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <Label>Descripción</Label>
              {isEditing ? (
                <Textarea
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Descripción del servicio..."
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                  {selectedService?.description || "Sin descripción"}
                </p>
              )}
            </div>

            {/* Stats (only for existing services) */}
            {!isNewService && selectedService?.stats && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Estadísticas
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold">{selectedService.stats.ordersToday}</div>
                      <div className="text-xs text-muted-foreground">Hoy</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold">{selectedService.stats.ordersWeek}</div>
                      <div className="text-xs text-muted-foreground">Esta Semana</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold">{selectedService.stats.ordersMonth}</div>
                      <div className="text-xs text-muted-foreground">Este Mes</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold text-accent">{formatPrice(selectedService.stats.revenueMonth)}</div>
                      <div className="text-xs text-muted-foreground">Ingresos Mes</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Delete Button */}
            {!isNewService && isEditing && (
              <div className="pt-4 border-t">
                <Button variant="outline" className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Servicio
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
