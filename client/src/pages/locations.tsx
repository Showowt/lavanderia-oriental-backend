import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MapPin,
  Plus,
  Phone,
  MessageSquare,
  Clock,
  Star,
  ShoppingBag,
  TrendingUp,
  Truck,
  Edit2,
  X,
  Save,
  Users,
  DollarSign,
  Calendar,
  Navigation
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";

interface LocationData {
  id: string;
  name: string;
  slug?: string;
  address: string;
  city: string;
  phone: string;
  whatsapp?: string;
  isHeadquarters?: boolean;
  isActive: boolean;
  deliveryAvailable: boolean;
  deliveryZone?: string;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  rating: number;
  stats: {
    ordersToday: number;
    ordersWeek: number;
    ordersMonth: number;
    revenueToday: number;
    revenueWeek: number;
    revenueMonth: number;
    conversationsToday: number;
    avgRating: number;
    totalReviews: number;
  };
  staff?: { name: string; role: string; phone: string }[];
  notes?: string;
  createdAt: Date;
}

export default function Locations() {
  const { t } = useI18n();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<LocationData>>({});

  const { data: locations = [], isLoading } = useQuery<LocationData[]>({
    queryKey: ["/api/locations"],
  });

  const isOpen = (location: LocationData) => {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();
    // Simplified: open 7am-6pm Mon-Sat, 7am-5pm Sun
    if (day === 0) return hours >= 7 && hours < 17;
    return hours >= 7 && hours < 18;
  };

  const handleViewLocation = (location: LocationData) => {
    setSelectedLocation(location);
    setEditForm(location);
    setIsModalOpen(true);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
    setIsEditing(false);
    setEditForm({});
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log("Saving location:", editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm(selectedLocation || {});
    setIsEditing(false);
  };

  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const activeLocations = locations.filter(l => l.isActive !== false);
  const deliveryLocations = locations.filter(l => l.deliveryAvailable);
  const avgRating = locations.length > 0
    ? (locations.reduce((sum, l) => sum + (l.rating || 4.5), 0) / locations.length).toFixed(1)
    : "4.8";

  const dayNames: { [key: string]: string } = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  return (
    <div className="p-6 space-y-6" data-testid="locations-page">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("locations.title") || "Sucursales"}</h1>
          <p className="text-muted-foreground">{t("locations.subtitle") || "Gestiona tus sucursales y horarios"}</p>
        </div>
        <Button className="gold-gradient" data-testid="button-add-location">
          <Plus className="h-4 w-4 mr-2" />
          {t("locations.addLocation") || "Nueva Sucursal"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sucursales"
          value={locations.length.toString()}
          icon={MapPin}
        />
        <StatCard
          title="Con Delivery"
          value={deliveryLocations.length.toString()}
          icon={Truck}
          variant="accent"
        />
        <StatCard
          title="Activas Ahora"
          value={activeLocations.filter(l => isOpen(l)).length.toString()}
          icon={Clock}
          variant="primary"
        />
        <StatCard
          title="Rating Promedio"
          value={avgRating}
          icon={Star}
          trend={{ value: 2, isPositive: true }}
        />
      </div>

      {/* Locations Grid */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Todas las Sucursales</CardTitle>
            </div>
            <Badge variant="secondary">{locations.length} sucursales</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">{t("common.loading")}</div>
          ) : (
            <ScrollArea className="h-[calc(100vh-380px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                {locations.map((location) => (
                  <Card
                    key={location.id}
                    className="border hover-elevate cursor-pointer"
                    onClick={() => handleViewLocation(location)}
                    data-testid={`location-item-${location.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{location.name}</h3>
                            {location.isHeadquarters && (
                              <Badge variant="outline" className="text-xs">Casa Matriz</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{location.city}</p>
                        </div>
                        <Badge
                          className={
                            isOpen(location)
                              ? "bg-accent/20 text-accent border-accent/30"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {isOpen(location) ? "Abierto" : "Cerrado"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{location.address}</p>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{location.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-primary" />
                          <span className="font-medium">{location.rating || 4.8}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ShoppingBag className="h-3 w-3" />
                          <span>{location.stats?.ordersToday || 0} hoy</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>{location.stats?.conversationsToday || 0} chats</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {location.deliveryAvailable && (
                          <Badge variant="outline" className="text-xs">
                            <Truck className="h-3 w-3 mr-1" />
                            Delivery
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={location.isActive !== false ? "text-accent border-accent/30" : "text-muted-foreground"}
                        >
                          {location.isActive !== false ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Location Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {selectedLocation?.name}
                {selectedLocation?.isHeadquarters && (
                  <Badge variant="outline" className="ml-2">Casa Matriz</Badge>
                )}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {!isEditing ? (
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

          {selectedLocation && (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedLocation.stats?.ordersToday || 0}</div>
                  <div className="text-xs text-muted-foreground">Pedidos Hoy</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{formatPrice(selectedLocation.stats?.revenueToday || 0)}</div>
                  <div className="text-xs text-muted-foreground">Ingresos Hoy</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{selectedLocation.stats?.conversationsToday || 0}</div>
                  <div className="text-xs text-muted-foreground">Conversaciones</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-primary" />
                    {selectedLocation.stats?.avgRating || selectedLocation.rating || 4.8}
                  </div>
                  <div className="text-xs text-muted-foreground">{selectedLocation.stats?.totalReviews || 0} reseñas</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Información
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="space-y-2">
                          <Label>Nombre</Label>
                          <Input
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dirección</Label>
                          <Textarea
                            value={editForm.address || ""}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ciudad</Label>
                          <Input
                            value={editForm.city || ""}
                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input
                              value={editForm.phone || ""}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>WhatsApp</Label>
                            <Input
                              value={editForm.whatsapp || ""}
                              onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">{selectedLocation.address}</div>
                            <div className="text-sm text-muted-foreground">{selectedLocation.city}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedLocation.phone}</span>
                        </div>
                        {selectedLocation.whatsapp && (
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedLocation.whatsapp}</span>
                          </div>
                        )}
                      </>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Delivery Disponible</span>
                      </div>
                      {isEditing ? (
                        <Switch
                          checked={editForm.deliveryAvailable || false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, deliveryAvailable: checked })}
                        />
                      ) : (
                        <Badge variant={selectedLocation.deliveryAvailable ? "default" : "outline"}>
                          {selectedLocation.deliveryAvailable ? "Sí" : "No"}
                        </Badge>
                      )}
                    </div>

                    {(selectedLocation.deliveryAvailable || editForm.deliveryAvailable) && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Zona de Delivery</Label>
                        {isEditing ? (
                          <Textarea
                            value={editForm.deliveryZone || ""}
                            onChange={(e) => setEditForm({ ...editForm, deliveryZone: e.target.value })}
                            placeholder="Describe las zonas de cobertura..."
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm p-2 bg-muted/50 rounded">
                            {selectedLocation.deliveryZone || "Zona centro y colonias cercanas"}
                          </p>
                        )}
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Estado de la Sucursal</span>
                      {isEditing ? (
                        <Switch
                          checked={editForm.isActive !== false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                        />
                      ) : (
                        <Badge variant={selectedLocation.isActive !== false ? "default" : "secondary"}>
                          {selectedLocation.isActive !== false ? "Activa" : "Inactiva"}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Hours */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Horarios de Atención
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {Object.entries(dayNames).map(([key, label]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium py-2">{label}</TableCell>
                            <TableCell className="text-right py-2">
                              {isEditing ? (
                                <Input
                                  className="w-32 h-8 text-sm text-right"
                                  value={editForm.hours?.[key as keyof typeof editForm.hours] || "7:00 - 18:00"}
                                  onChange={(e) => setEditForm({
                                    ...editForm,
                                    hours: { ...editForm.hours, [key]: e.target.value } as LocationData["hours"]
                                  })}
                                />
                              ) : (
                                <span className="text-muted-foreground">
                                  {selectedLocation.hours?.[key as keyof typeof selectedLocation.hours] || "7:00 - 18:00"}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Esta Semana
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pedidos</span>
                          <span className="font-medium">{selectedLocation.stats?.ordersWeek || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ingresos</span>
                          <span className="font-medium text-accent">{formatPrice(selectedLocation.stats?.revenueWeek || 0)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Este Mes
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pedidos</span>
                          <span className="font-medium">{selectedLocation.stats?.ordersMonth || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Ingresos</span>
                          <span className="font-medium text-accent">{formatPrice(selectedLocation.stats?.revenueMonth || 0)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        Calificación
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Promedio</span>
                          <span className="font-medium">{selectedLocation.stats?.avgRating || selectedLocation.rating || 4.8} / 5.0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Reseñas</span>
                          <span className="font-medium">{selectedLocation.stats?.totalReviews || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Staff (if available) */}
              {selectedLocation.staff && selectedLocation.staff.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Personal Asignado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Teléfono</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedLocation.staff.map((person, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{person.name}</TableCell>
                            <TableCell>{person.role}</TableCell>
                            <TableCell className="text-muted-foreground">{person.phone}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editForm.notes || ""}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="Notas internas sobre esta sucursal..."
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.notes || "Sin notas"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
