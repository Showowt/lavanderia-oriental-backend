import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  MapPin,
  Settings,
  BarChart3,
  Bell,
  HelpCircle,
  Package,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export function AppSidebar() {
  const [location] = useLocation();
  const { t } = useI18n();
  const { user, isDemoMode } = useAuth();

  const mainNavItems = [
    {
      titleKey: "nav.dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      titleKey: "nav.conversations",
      url: "/conversations",
      icon: MessageSquare,
      badge: "24",
    },
    {
      titleKey: "nav.customers",
      url: "/customers",
      icon: Users,
    },
    {
      titleKey: "nav.locations",
      url: "/locations",
      icon: MapPin,
      badge: "5",
    },
    {
      titleKey: "nav.services",
      url: "/services",
      icon: Package,
    },
    {
      titleKey: "nav.orders",
      url: "/orders",
      icon: ShoppingBag,
    },
  ];

  const secondaryNavItems = [
    {
      titleKey: "nav.analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      titleKey: "nav.notifications",
      url: "/notifications",
      icon: Bell,
    },
    {
      titleKey: "nav.settings",
      url: "/settings",
      icon: Settings,
    },
    {
      titleKey: "nav.help",
      url: "/help",
      icon: HelpCircle,
    },
  ];

  return (
    <Sidebar data-testid="app-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">LO</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm truncate">{t("brand.name")}</h2>
            <div className="flex items-center gap-1.5 text-xs text-sidebar-foreground/70">
              <SiWhatsapp className="h-3 w-3 text-green-400" />
              <span>{t("brand.tagline")}</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.menu")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.titleKey.split('.')[1]}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{t(item.titleKey)}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs h-5 px-1.5 bg-primary/20 text-primary border-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.system")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    data-testid={`nav-${item.titleKey.split('.')[1]}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium truncate">{user?.name || 'Usuario'}</p>
              {isDemoMode && (
                <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
