import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Users, Plus, Phone, MessageSquare, ShoppingBag, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { StatCard } from "@/components/stat-card";

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  lastOrderDate?: Date | null;
  isVip?: boolean;
}

export default function Customers() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers = [], isLoading } = useQuery<CustomerData[]>({
    queryKey: ["/api/customers"],
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("es-SV", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6" data-testid="customers-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("customers.title")}</h1>
          <p className="text-muted-foreground">{t("customers.subtitle")}</p>
        </div>
        <Button className="gold-gradient" data-testid="button-add-customer">
          <Plus className="h-4 w-4 mr-2" />
          {t("customers.addCustomer")}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("customers.totalCustomers")}
          value={customers.length.toString()}
          icon={Users}
        />
        <StatCard
          title={t("customers.activeThisMonth")}
          value={Math.floor(customers.length * 0.7).toString()}
          icon={User}
          variant="accent"
        />
        <StatCard
          title={t("customers.newThisWeek")}
          value="12"
          icon={Plus}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title={t("customers.avgOrderValue")}
          value="$18.50"
          icon={ShoppingBag}
          variant="primary"
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("customers.search")}
          className="pl-9 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-customers"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{t("customers.title")}</CardTitle>
            <Badge variant="secondary" className="ml-auto">{filteredCustomers.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">{t("common.loading")}</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">{t("customers.noCustomers")}</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-420px)]">
              <div className="divide-y divide-border">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-4 hover-elevate"
                    data-testid={`customer-item-${customer.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {customer.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{customer.name}</span>
                          {customer.isVip && (
                            <Badge className="bg-primary/20 text-primary border-0 text-xs">VIP</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </span>
                          {customer.email && (
                            <span className="truncate">{customer.email}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{customer.totalOrders || 0} {t("customers.orders")}</span>
                          <span>{t("customers.lastOrder")}: {formatDate(customer.lastOrderDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="icon" data-testid={`button-message-${customer.id}`}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-call-${customer.id}`}>
                          <Phone className="h-4 w-4" />
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
    </div>
  );
}
