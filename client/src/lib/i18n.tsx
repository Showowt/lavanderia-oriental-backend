import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "es" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navigation
    "nav.dashboard": "Panel Principal",
    "nav.conversations": "Conversaciones",
    "nav.customers": "Clientes",
    "nav.locations": "Sucursales",
    "nav.analytics": "Analíticas",
    "nav.notifications": "Notificaciones",
    "nav.settings": "Configuración",
    "nav.help": "Ayuda",
    "nav.menu": "Menú",
    "nav.system": "Sistema",
    
    // Dashboard
    "dashboard.title": "Panel de Concierge IA",
    "dashboard.subtitle": "El Salvador • 7 Sucursales • WhatsApp Business API",
    "dashboard.live": "En Vivo",
    "dashboard.allLocations": "Todas las Sucursales",
    
    // Stats
    "stats.totalConversations": "Total de Conversaciones",
    "stats.activeNow": "Activas Ahora",
    "stats.aiResolutionRate": "Tasa de Resolución IA",
    "stats.escalations": "Escalaciones",
    "stats.avgResponseTime": "Tiempo de Respuesta Promedio",
    "stats.messagesProcessed": "Mensajes Procesados",
    "stats.resolvedToday": "Resueltas Hoy",
    "stats.customerSatisfaction": "Satisfacción del Cliente",
    "stats.today": "Hoy",
    "stats.liveConversations": "Conversaciones en vivo",
    "stats.withoutHumanIntervention": "Sin intervención humana",
    "stats.pendingReview": "Pendientes de revisión",
    "stats.last24Hours": "Últimas 24 horas",
    "stats.vsLastWeek": "vs semana pasada",
    
    // WhatsApp Chat
    "chat.aiActive": "IA Activa",
    "chat.aiResponse": "Respuesta IA",
    "chat.typeMessage": "Escribe un mensaje...",
    "chat.connectedToWhatsApp": "Conectado a WhatsApp Business API",
    "chat.live": "En Vivo",
    "chat.recentConversation": "Conversación Reciente",
    
    // Activity Feed
    "activity.title": "Actividad Reciente",
    "activity.activities": "actividades",
    "activity.noActivities": "No hay actividades recientes",
    "activity.justNow": "Ahora mismo",
    "activity.minAgo": "hace {min} min",
    "activity.hoursAgo": "hace {hours} h",
    
    // Escalations
    "escalations.title": "Escalaciones",
    "escalations.pending": "pendientes",
    "escalations.noPending": "Sin escalaciones pendientes",
    "escalations.highPriority": "Alta Prioridad",
    "escalations.mediumPriority": "Media",
    "escalations.lowPriority": "Baja",
    "escalations.call": "Llamar",
    "escalations.takeOver": "Tomar Control",
    
    // Performance
    "performance.title": "Resumen de Rendimiento",
    "performance.firstContactResolution": "Resolución en Primer Contacto",
    "performance.avgRating": "Calificación Promedio",
    "performance.avgResponseTime": "Tiempo de Respuesta Prom.",
    "performance.costSavings": "Ahorro de Costos",
    "performance.thisMonth": "Este Mes",
    
    // Conversations Page
    "conversations.title": "Conversaciones",
    "conversations.subtitle": "Gestiona todas las conversaciones de WhatsApp",
    "conversations.search": "Buscar conversaciones...",
    "conversations.all": "Todas",
    "conversations.active": "Activas",
    "conversations.resolved": "Resueltas",
    "conversations.escalated": "Escaladas",
    "conversations.noConversations": "No hay conversaciones",
    "conversations.startNew": "Las nuevas conversaciones aparecerán aquí",
    "conversations.messages": "mensajes",
    "conversations.lastMessage": "Último mensaje",
    
    // Customers Page
    "customers.title": "Clientes",
    "customers.subtitle": "Directorio de clientes y historial de pedidos",
    "customers.search": "Buscar clientes...",
    "customers.addCustomer": "Agregar Cliente",
    "customers.totalCustomers": "Total de Clientes",
    "customers.activeThisMonth": "Activos Este Mes",
    "customers.newThisWeek": "Nuevos Esta Semana",
    "customers.avgOrderValue": "Valor Promedio de Pedido",
    "customers.noCustomers": "No hay clientes registrados",
    "customers.orders": "pedidos",
    "customers.lastOrder": "Último pedido",
    "customers.viewProfile": "Ver Perfil",
    "customers.sendMessage": "Enviar Mensaje",
    
    // Locations Page
    "locations.title": "Sucursales",
    "locations.subtitle": "Administra tus 7 sucursales en El Salvador",
    "locations.addLocation": "Agregar Sucursal",
    "locations.totalLocations": "Total de Sucursales",
    "locations.activeToday": "Activas Hoy",
    "locations.totalOrders": "Pedidos Totales",
    "locations.avgRating": "Calificación Promedio",
    "locations.open": "Abierto",
    "locations.closed": "Cerrado",
    "locations.conversations": "conversaciones",
    "locations.ordersToday": "pedidos hoy",
    "locations.viewDetails": "Ver Detalles",
    "locations.editLocation": "Editar",
    
    // Analytics Page
    "analytics.title": "Analíticas",
    "analytics.subtitle": "Métricas de rendimiento y estadísticas",
    "analytics.overview": "Vista General",
    "analytics.conversations": "Conversaciones",
    "analytics.revenue": "Ingresos",
    "analytics.customers": "Clientes",
    "analytics.thisWeek": "Esta Semana",
    "analytics.thisMonth": "Este Mes",
    "analytics.thisYear": "Este Año",
    "analytics.conversationVolume": "Volumen de Conversaciones",
    "analytics.aiVsHuman": "Resoluciones IA vs Humano",
    "analytics.topLocations": "Sucursales Principales",
    "analytics.peakHours": "Horas Pico",
    
    // Notifications Page
    "notifications.title": "Notificaciones",
    "notifications.subtitle": "Centro de notificaciones y alertas",
    "notifications.markAllRead": "Marcar todo como leído",
    "notifications.noNotifications": "No hay notificaciones",
    "notifications.allCaughtUp": "¡Estás al día!",
    "notifications.today": "Hoy",
    "notifications.yesterday": "Ayer",
    "notifications.earlier": "Anteriores",
    "notifications.newEscalation": "Nueva escalación",
    "notifications.conversationResolved": "Conversación resuelta",
    "notifications.newCustomer": "Nuevo cliente",
    "notifications.systemAlert": "Alerta del sistema",
    
    // Settings Page
    "settings.title": "Configuración",
    "settings.subtitle": "Preferencias y configuración de la aplicación",
    "settings.general": "General",
    "settings.notifications": "Notificaciones",
    "settings.ai": "Configuración de IA",
    "settings.integrations": "Integraciones",
    "settings.security": "Seguridad",
    "settings.language": "Idioma",
    "settings.theme": "Tema",
    "settings.dark": "Oscuro",
    "settings.light": "Claro",
    "settings.system": "Sistema",
    "settings.timezone": "Zona Horaria",
    "settings.currency": "Moneda",
    "settings.saveChanges": "Guardar Cambios",
    "settings.cancel": "Cancelar",
    
    // Help Page
    "help.title": "Centro de Ayuda",
    "help.subtitle": "Documentación y recursos de soporte",
    "help.search": "Buscar en la documentación...",
    "help.gettingStarted": "Comenzando",
    "help.gettingStartedDesc": "Aprende los conceptos básicos del sistema",
    "help.whatsappIntegration": "Integración WhatsApp",
    "help.whatsappIntegrationDesc": "Configura y administra tu conexión",
    "help.aiConfiguration": "Configuración de IA",
    "help.aiConfigurationDesc": "Personaliza las respuestas automáticas",
    "help.reportsAnalytics": "Reportes y Analíticas",
    "help.reportsAnalyticsDesc": "Entiende tus métricas",
    "help.contactSupport": "Contactar Soporte",
    "help.email": "Correo electrónico",
    "help.phone": "Teléfono",
    "help.hours": "Lunes a Viernes, 8:00 AM - 6:00 PM",
    "help.faq": "Preguntas Frecuentes",
    
    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.retry": "Reintentar",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.view": "Ver",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.export": "Exportar",
    "common.import": "Importar",
    "common.refresh": "Actualizar",
    "common.close": "Cerrar",
    "common.back": "Volver",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
    "common.yes": "Sí",
    "common.no": "No",
    "common.elSalvador": "El Salvador",
    
    // Branding
    "brand.name": "Lavandería Oriental",
    "brand.tagline": "AI Concierge",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.conversations": "Conversations",
    "nav.customers": "Customers",
    "nav.locations": "Locations",
    "nav.analytics": "Analytics",
    "nav.notifications": "Notifications",
    "nav.settings": "Settings",
    "nav.help": "Help",
    "nav.menu": "Menu",
    "nav.system": "System",
    
    // Dashboard
    "dashboard.title": "AI Concierge Dashboard",
    "dashboard.subtitle": "El Salvador • 7 Locations • WhatsApp Business API",
    "dashboard.live": "Live",
    "dashboard.allLocations": "All Locations",
    
    // Stats
    "stats.totalConversations": "Total Conversations",
    "stats.activeNow": "Active Now",
    "stats.aiResolutionRate": "AI Resolution Rate",
    "stats.escalations": "Escalations",
    "stats.avgResponseTime": "Avg Response Time",
    "stats.messagesProcessed": "Messages Processed",
    "stats.resolvedToday": "Resolved Today",
    "stats.customerSatisfaction": "Customer Satisfaction",
    "stats.today": "Today",
    "stats.liveConversations": "Live conversations",
    "stats.withoutHumanIntervention": "Without human intervention",
    "stats.pendingReview": "Pending review",
    "stats.last24Hours": "Last 24 hours",
    "stats.vsLastWeek": "vs last week",
    
    // WhatsApp Chat
    "chat.aiActive": "AI Active",
    "chat.aiResponse": "AI Response",
    "chat.typeMessage": "Type a message...",
    "chat.connectedToWhatsApp": "Connected to WhatsApp Business API",
    "chat.live": "Live",
    "chat.recentConversation": "Recent Conversation",
    
    // Activity Feed
    "activity.title": "Recent Activity",
    "activity.activities": "activities",
    "activity.noActivities": "No recent activities",
    "activity.justNow": "Just now",
    "activity.minAgo": "{min} min ago",
    "activity.hoursAgo": "{hours}h ago",
    
    // Escalations
    "escalations.title": "Escalations",
    "escalations.pending": "pending",
    "escalations.noPending": "No pending escalations",
    "escalations.highPriority": "High Priority",
    "escalations.mediumPriority": "Medium",
    "escalations.lowPriority": "Low",
    "escalations.call": "Call",
    "escalations.takeOver": "Take Over",
    
    // Performance
    "performance.title": "Performance Summary",
    "performance.firstContactResolution": "First Contact Resolution",
    "performance.avgRating": "Avg. Rating",
    "performance.avgResponseTime": "Avg. Response Time",
    "performance.costSavings": "Cost Savings",
    "performance.thisMonth": "This Month",
    
    // Conversations Page
    "conversations.title": "Conversations",
    "conversations.subtitle": "Manage all WhatsApp conversations",
    "conversations.search": "Search conversations...",
    "conversations.all": "All",
    "conversations.active": "Active",
    "conversations.resolved": "Resolved",
    "conversations.escalated": "Escalated",
    "conversations.noConversations": "No conversations",
    "conversations.startNew": "New conversations will appear here",
    "conversations.messages": "messages",
    "conversations.lastMessage": "Last message",
    
    // Customers Page
    "customers.title": "Customers",
    "customers.subtitle": "Customer directory and order history",
    "customers.search": "Search customers...",
    "customers.addCustomer": "Add Customer",
    "customers.totalCustomers": "Total Customers",
    "customers.activeThisMonth": "Active This Month",
    "customers.newThisWeek": "New This Week",
    "customers.avgOrderValue": "Avg Order Value",
    "customers.noCustomers": "No customers registered",
    "customers.orders": "orders",
    "customers.lastOrder": "Last order",
    "customers.viewProfile": "View Profile",
    "customers.sendMessage": "Send Message",
    
    // Locations Page
    "locations.title": "Locations",
    "locations.subtitle": "Manage your 7 locations in El Salvador",
    "locations.addLocation": "Add Location",
    "locations.totalLocations": "Total Locations",
    "locations.activeToday": "Active Today",
    "locations.totalOrders": "Total Orders",
    "locations.avgRating": "Avg Rating",
    "locations.open": "Open",
    "locations.closed": "Closed",
    "locations.conversations": "conversations",
    "locations.ordersToday": "orders today",
    "locations.viewDetails": "View Details",
    "locations.editLocation": "Edit",
    
    // Analytics Page
    "analytics.title": "Analytics",
    "analytics.subtitle": "Performance metrics and statistics",
    "analytics.overview": "Overview",
    "analytics.conversations": "Conversations",
    "analytics.revenue": "Revenue",
    "analytics.customers": "Customers",
    "analytics.thisWeek": "This Week",
    "analytics.thisMonth": "This Month",
    "analytics.thisYear": "This Year",
    "analytics.conversationVolume": "Conversation Volume",
    "analytics.aiVsHuman": "AI vs Human Resolutions",
    "analytics.topLocations": "Top Locations",
    "analytics.peakHours": "Peak Hours",
    
    // Notifications Page
    "notifications.title": "Notifications",
    "notifications.subtitle": "Notification center and alerts",
    "notifications.markAllRead": "Mark all as read",
    "notifications.noNotifications": "No notifications",
    "notifications.allCaughtUp": "You're all caught up!",
    "notifications.today": "Today",
    "notifications.yesterday": "Yesterday",
    "notifications.earlier": "Earlier",
    "notifications.newEscalation": "New escalation",
    "notifications.conversationResolved": "Conversation resolved",
    "notifications.newCustomer": "New customer",
    "notifications.systemAlert": "System alert",
    
    // Settings Page
    "settings.title": "Settings",
    "settings.subtitle": "App preferences and configuration",
    "settings.general": "General",
    "settings.notifications": "Notifications",
    "settings.ai": "AI Configuration",
    "settings.integrations": "Integrations",
    "settings.security": "Security",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.dark": "Dark",
    "settings.light": "Light",
    "settings.system": "System",
    "settings.timezone": "Timezone",
    "settings.currency": "Currency",
    "settings.saveChanges": "Save Changes",
    "settings.cancel": "Cancel",
    
    // Help Page
    "help.title": "Help Center",
    "help.subtitle": "Documentation and support resources",
    "help.search": "Search documentation...",
    "help.gettingStarted": "Getting Started",
    "help.gettingStartedDesc": "Learn the basics of the system",
    "help.whatsappIntegration": "WhatsApp Integration",
    "help.whatsappIntegrationDesc": "Configure and manage your connection",
    "help.aiConfiguration": "AI Configuration",
    "help.aiConfigurationDesc": "Customize automatic responses",
    "help.reportsAnalytics": "Reports & Analytics",
    "help.reportsAnalyticsDesc": "Understand your metrics",
    "help.contactSupport": "Contact Support",
    "help.email": "Email",
    "help.phone": "Phone",
    "help.hours": "Monday to Friday, 8:00 AM - 6:00 PM",
    "help.faq": "FAQ",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.retry": "Retry",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.import": "Import",
    "common.refresh": "Refresh",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.yes": "Yes",
    "common.no": "No",
    "common.elSalvador": "El Salvador",
    
    // Branding
    "brand.name": "Lavandería Oriental",
    "brand.tagline": "AI Concierge",
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language;
      return saved || "es"; // Default to Spanish
    }
    return "es";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  return useI18n();
}
