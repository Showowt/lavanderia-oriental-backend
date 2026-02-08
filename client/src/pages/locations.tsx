import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Plus, Phone, MessageSquare, Clock, Star, ShoppingBag, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";
import type { Location } from "@shared/schema";

export default function Locations() {
  const { t } = useI18n();

  const { data: locations = [], isLoading } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const isOpen = (location: Location) => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 7 && hours < 20;
  };

  return (
    <div className="p-6 space-y-6" data-testid="locations-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("locations.title")}</h1>
          <p className="text-muted-foreground">{t("locations.subtitle")}</p>
        </div>
        <Button className="gold-gradient" data-testid="button-add-location">
          <Plus className="h-4 w-4 mr-2" />
          {t("locations.addLocation")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("locations.totalLocations")}
          value={locations.length.toString()}
          icon={MapPin}
        />
        <StatCard
          title={t("locations.activeToday")}
          value={locations.filter((l) => isOpen(l)).length.toString()}
          icon={Clock}
          variant="accent"
        />
        <StatCard
          title={t("locations.totalOrders")}
          value="1,234"
          icon={ShoppingBag}
          subtitle={t("stats.today")}
        />
        <StatCard
          title={t("locations.avgRating")}
          value="4.8"
          icon={Star}
          variant="primary"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{t("locations.title")}</CardTitle>
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
                    className="border hover-elevate"
                    data-testid={`location-item-${location.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-semibold">{location.name}</h3>
                          <p className="text-sm text-muted-foreground">{location.address}</p>
                        </div>
                        <Badge
                          className={
                            isOpen(location)
                              ? "bg-accent/20 text-accent border-accent/30"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {isOpen(location) ? t("locations.open") : t("locations.closed")}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{location.phone}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {(location as any).conversationsToday || 0} {t("locations.conversations")}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="h-4 w-4" />
                            {(location as any).ordersToday || 0} {t("locations.ordersToday")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 text-primary" />
                          <span className="font-medium">{(location as any).rating || "4.8"}</span>
                          <span className="text-muted-foreground">/ 5.0</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${location.id}`}>
                          {t("locations.viewDetails")}
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-edit-${location.id}`}>
                          {t("locations.editLocation")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
