import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Sparkles, Plus, Edit2, DollarSign, Tag, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";

interface ServiceData {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  isActive?: boolean;
}

export default function Services() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: services = [], isLoading } = useQuery<ServiceData[]>({
    queryKey: ["/api/services"],
  });

  const categories = [
    { id: "all", name: "Todos" },
    { id: "lavado", name: "Lavado" },
    { id: "edredones", name: "Edredones" },
    { id: "drip", name: "DRIP Zapatos" },
    { id: "extras", name: "Extras" },
    { id: "delivery", name: "Delivery" },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="p-6 space-y-6" data-testid="services-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("services.title") || "Servicios"}</h1>
          <p className="text-muted-foreground">{t("services.subtitle") || "Gestiona precios y servicios"}</p>
        </div>
        <Button className="gold-gradient" data-testid="button-add-service">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Servicio
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Servicios"
          value={services.length.toString()}
          icon={Package}
        />
        <StatCard
          title="Categorías"
          value="5"
          icon={Tag}
          variant="accent"
        />
        <StatCard
          title="Servicio Más Popular"
          value="Lavado+Sec"
          icon={Sparkles}
          variant="primary"
        />
        <StatCard
          title="Ingreso Promedio"
          value="$6.50"
          icon={DollarSign}
        />
      </div>

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

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex-wrap h-auto">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} data-testid={`tab-${cat.id}`}>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Catálogo de Servicios</CardTitle>
            <Badge variant="secondary" className="ml-auto">{filteredServices.length}</Badge>
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
            <ScrollArea className="h-[calc(100vh-480px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                {filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className="border hover-elevate"
                    data-testid={`service-item-${service.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {service.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(service.price)}
                          </span>
                        </div>
                      </div>

                      {service.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {service.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-${service.id}`}>
                          <Edit2 className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Badge
                          className={
                            service.isActive !== false
                              ? "bg-accent/20 text-accent border-accent/30"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {service.isActive !== false ? "Activo" : "Inactivo"}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tabla de Precios Rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Cargas de Ropa
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>Carga Normal (L+S)</span>
                  <span className="font-medium">$5.50</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>Carga Pesada (L+S)</span>
                  <span className="font-medium">$6.50</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>Solo Lavado</span>
                  <span className="font-medium">$3.00</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                DRIP Zapatos
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>DRIP Básico</span>
                  <span className="font-medium">$9.90</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>DRIP Especial</span>
                  <span className="font-medium">$12.90</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>DRIP Premium</span>
                  <span className="font-medium">$16.90</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-3" />
                Edredones
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>1.20-1.40m</span>
                  <span className="font-medium">$6.50</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>1.60m</span>
                  <span className="font-medium">$7.50</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span>2.00m+</span>
                  <span className="font-medium">$8.50+</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
