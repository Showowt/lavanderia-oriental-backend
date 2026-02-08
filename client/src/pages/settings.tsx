import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Sparkles,
  Shield,
  Link2,
  Building2,
  MessageSquare,
  Brain,
  BookOpen,
  Users,
  Database,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Clock,
  AlertTriangle,
  Download,
  Upload,
  Key
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "agent";
  status: "active" | "inactive";
  lastLogin?: Date;
}

interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

interface EscalationKeyword {
  id: string;
  keyword: string;
  priority: "low" | "medium" | "high";
}

// Mock data
const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "Fabricio Estrada", email: "fabricio@lavanderiaoriental.com.sv", role: "admin", status: "active", lastLogin: new Date() },
  { id: "2", name: "María López", email: "maria@lavanderiaoriental.com.sv", role: "manager", status: "active", lastLogin: new Date(Date.now() - 86400000) },
  { id: "3", name: "Carlos Mejía", email: "carlos@lavanderiaoriental.com.sv", role: "agent", status: "active", lastLogin: new Date(Date.now() - 172800000) },
  { id: "4", name: "Ana García", email: "ana@lavanderiaoriental.com.sv", role: "agent", status: "inactive" },
];

const mockKnowledgeBase: KnowledgeEntry[] = [
  { id: "1", question: "¿Cuánto cuesta el lavado de ropa?", answer: "Carga Normal: $3.00 solo lavado, $5.50 lavado + secado. Carga Pesada: $3.50 solo lavado, $6.50 lavado + secado.", category: "precios", isActive: true },
  { id: "2", question: "¿Tienen servicio de delivery?", answer: "Sí, ofrecemos delivery por $2.00 (recogida y entrega). Disponible en San Miguel y alrededores.", category: "servicios", isActive: true },
  { id: "3", question: "¿Cuál es el horario de atención?", answer: "Lunes a Sábado: 7:00am - 6:00pm. Domingos: 7:00am - 5:00pm.", category: "horarios", isActive: true },
  { id: "4", question: "¿Qué incluye el servicio DRIP?", answer: "DRIP es nuestro servicio especializado de limpieza de zapatos. DRIP Básico ($9.90), Especial ($12.90), Premium ($16.90), Niños ($5.90).", category: "servicios", isActive: true },
];

const mockEscalationKeywords: EscalationKeyword[] = [
  { id: "1", keyword: "queja", priority: "high" },
  { id: "2", keyword: "reclamo", priority: "high" },
  { id: "3", keyword: "daño", priority: "high" },
  { id: "4", keyword: "gerente", priority: "high" },
  { id: "5", keyword: "devolución", priority: "medium" },
  { id: "6", keyword: "urgente", priority: "medium" },
  { id: "7", keyword: "problema", priority: "low" },
];

export default function Settings() {
  const { t, language, setLanguage } = useI18n();
  const [activeTab, setActiveTab] = useState("general");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeEntry[]>(mockKnowledgeBase);
  const [escalationKeywords, setEscalationKeywords] = useState<EscalationKeyword[]>(mockEscalationKeywords);

  // Modal states
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState<KnowledgeEntry | null>(null);

  // Form states
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "agent" as const });
  const [newKnowledge, setNewKnowledge] = useState({ question: "", answer: "", category: "general" });
  const [newKeyword, setNewKeyword] = useState({ keyword: "", priority: "medium" as const });

  // Business settings
  const [businessSettings, setBusinessSettings] = useState({
    name: "Lavandería Oriental",
    phone: "+503 2222-3333",
    whatsapp: "+503 7947-5950",
    email: "info@lavanderiaoriental.com.sv",
    website: "lavanderiaoriental.com.sv",
    address: "San Miguel, El Salvador"
  });

  // WhatsApp settings
  const [whatsappSettings, setWhatsappSettings] = useState({
    greeting: "¡Hola! 👋 Bienvenido a Lavandería Oriental. ¿En qué podemos ayudarte hoy?",
    away: "Gracias por contactarnos. En este momento estamos fuera de horario. Te responderemos pronto. Horario: L-S 7am-6pm, D 7am-5pm",
    autoReplyEnabled: true,
    autoReplyStart: "07:00",
    autoReplyEnd: "18:00"
  });

  // AI settings
  const [aiSettings, setAiSettings] = useState({
    model: "claude-sonnet-4",
    confidenceThreshold: 0.7,
    maxResponseLength: 500,
    temperature: 0.7,
    autoEscalate: true,
    escalateOnLowConfidence: true,
    escalateAfterAttempts: 3
  });

  const handleAddMember = () => {
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: "active"
    };
    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: "", email: "", role: "agent" });
    setShowAddMember(false);
  };

  const handleAddKnowledge = () => {
    const entry: KnowledgeEntry = {
      id: Date.now().toString(),
      question: newKnowledge.question,
      answer: newKnowledge.answer,
      category: newKnowledge.category,
      isActive: true
    };
    setKnowledgeBase([...knowledgeBase, entry]);
    setNewKnowledge({ question: "", answer: "", category: "general" });
    setShowAddKnowledge(false);
  };

  const handleAddKeyword = () => {
    const kw: EscalationKeyword = {
      id: Date.now().toString(),
      keyword: newKeyword.keyword,
      priority: newKeyword.priority
    };
    setEscalationKeywords([...escalationKeywords, kw]);
    setNewKeyword({ keyword: "", priority: "medium" });
    setShowAddKeyword(false);
  };

  const getRoleBadge = (role: TeamMember["role"]) => {
    switch (role) {
      case "admin": return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Admin</Badge>;
      case "manager": return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Manager</Badge>;
      case "agent": return <Badge variant="outline">Agente</Badge>;
    }
  };

  const getPriorityBadge = (priority: EscalationKeyword["priority"]) => {
    switch (priority) {
      case "high": return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Alta</Badge>;
      case "medium": return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Media</Badge>;
      case "low": return <Badge variant="outline">Baja</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6" data-testid="settings-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
        </div>
        <Button className="gold-gradient" data-testid="button-save">
          <Check className="h-4 w-4 mr-2" />
          {t("settings.saveChanges")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-7 w-full max-w-4xl">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Negocio</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">IA</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Conocimiento</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Equipo</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Preferencias Regionales</CardTitle>
                    <CardDescription>Idioma, zona horaria y formato</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("settings.language")}</Label>
                    <p className="text-sm text-muted-foreground">Idioma de la interfaz</p>
                  </div>
                  <Select value={language} onValueChange={(v) => setLanguage(v as "es" | "en")}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("settings.timezone")}</Label>
                    <p className="text-sm text-muted-foreground">Zona horaria</p>
                  </div>
                  <Select defaultValue="america_el_salvador">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america_el_salvador">America/El_Salvador</SelectItem>
                      <SelectItem value="america_guatemala">America/Guatemala</SelectItem>
                      <SelectItem value="america_mexico_city">America/Mexico_City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Formato de fecha</Label>
                    <p className="text-sm text-muted-foreground">Cómo mostrar fechas</p>
                  </div>
                  <Select defaultValue="dd_mm_yyyy">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy_mm_dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">{t("settings.notifications")}</CardTitle>
                    <CardDescription>Alertas y notificaciones</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Escalaciones</Label>
                    <p className="text-sm text-muted-foreground">Alertas de escalación</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Resumen diario</Label>
                    <p className="text-sm text-muted-foreground">Email con resumen</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Nuevos clientes</Label>
                    <p className="text-sm text-muted-foreground">Notificar registros</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sonidos</Label>
                    <p className="text-sm text-muted-foreground">Alertas sonoras</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Información del Negocio</CardTitle>
                  <CardDescription>Datos de contacto y perfil de la empresa</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del negocio</Label>
                  <Input
                    value={businessSettings.name}
                    onChange={(e) => setBusinessSettings({...businessSettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono principal</Label>
                  <Input
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings({...businessSettings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Business</Label>
                  <Input
                    value={businessSettings.whatsapp}
                    onChange={(e) => setBusinessSettings({...businessSettings, whatsapp: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings({...businessSettings, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sitio web</Label>
                  <Input
                    value={businessSettings.website}
                    onChange={(e) => setBusinessSettings({...businessSettings, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dirección principal</Label>
                  <Input
                    value={businessSettings.address}
                    onChange={(e) => setBusinessSettings({...businessSettings, address: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Settings */}
        <TabsContent value="whatsapp" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Mensajes Automáticos</CardTitle>
                    <CardDescription>Saludo y mensaje de ausencia</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Mensaje de bienvenida</Label>
                  <Textarea
                    rows={3}
                    value={whatsappSettings.greeting}
                    onChange={(e) => setWhatsappSettings({...whatsappSettings, greeting: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Se envía al iniciar conversación</p>
                </div>

                <div className="space-y-2">
                  <Label>Mensaje fuera de horario</Label>
                  <Textarea
                    rows={3}
                    value={whatsappSettings.away}
                    onChange={(e) => setWhatsappSettings({...whatsappSettings, away: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Se envía fuera del horario de atención</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Horario de Respuesta</CardTitle>
                    <CardDescription>Configura horario de respuestas automáticas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Respuestas automáticas</Label>
                    <p className="text-sm text-muted-foreground">Activar IA en horario</p>
                  </div>
                  <Switch
                    checked={whatsappSettings.autoReplyEnabled}
                    onCheckedChange={(v) => setWhatsappSettings({...whatsappSettings, autoReplyEnabled: v})}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hora inicio</Label>
                    <Input
                      type="time"
                      value={whatsappSettings.autoReplyStart}
                      onChange={(e) => setWhatsappSettings({...whatsappSettings, autoReplyStart: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hora fin</Label>
                    <Input
                      type="time"
                      value={whatsappSettings.autoReplyEnd}
                      onChange={(e) => setWhatsappSettings({...whatsappSettings, autoReplyEnd: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 className="h-4 w-4 text-accent" />
                    <span className="font-medium text-sm">Conexión Twilio</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Estado: <span className="text-accent">Conectado</span></p>
                  <p className="text-xs text-muted-foreground">Número: {businessSettings.whatsapp}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Configuración del Modelo</CardTitle>
                    <CardDescription>Parámetros de Claude AI</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modelo</Label>
                    <p className="text-sm text-muted-foreground">Versión de Claude</p>
                  </div>
                  <Select value={aiSettings.model} onValueChange={(v) => setAiSettings({...aiSettings, model: v})}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-sonnet-4">Claude Sonnet 4</SelectItem>
                      <SelectItem value="claude-haiku-4">Claude Haiku 4</SelectItem>
                      <SelectItem value="claude-opus-4">Claude Opus 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Umbral de confianza</Label>
                    <span className="text-sm text-muted-foreground">{Math.round(aiSettings.confidenceThreshold * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.95"
                    step="0.05"
                    value={aiSettings.confidenceThreshold}
                    onChange={(e) => setAiSettings({...aiSettings, confidenceThreshold: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Escalar si la confianza es menor</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Longitud máxima</Label>
                    <span className="text-sm text-muted-foreground">{aiSettings.maxResponseLength} chars</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1000"
                    step="50"
                    value={aiSettings.maxResponseLength}
                    onChange={(e) => setAiSettings({...aiSettings, maxResponseLength: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tono</Label>
                    <p className="text-sm text-muted-foreground">Estilo de respuestas</p>
                  </div>
                  <Select defaultValue="professional">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profesional</SelectItem>
                      <SelectItem value="friendly">Amigable</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Escalación Automática</CardTitle>
                    <CardDescription>Cuándo transferir a humano</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Escalación automática</Label>
                    <p className="text-sm text-muted-foreground">Activar detección</p>
                  </div>
                  <Switch
                    checked={aiSettings.autoEscalate}
                    onCheckedChange={(v) => setAiSettings({...aiSettings, autoEscalate: v})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Escalar por confianza baja</Label>
                    <p className="text-sm text-muted-foreground">Si IA no está segura</p>
                  </div>
                  <Switch
                    checked={aiSettings.escalateOnLowConfidence}
                    onCheckedChange={(v) => setAiSettings({...aiSettings, escalateOnLowConfidence: v})}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Intentos antes de escalar</Label>
                    <p className="text-sm text-muted-foreground">Después de X intentos</p>
                  </div>
                  <Select
                    value={aiSettings.escalateAfterAttempts.toString()}
                    onValueChange={(v) => setAiSettings({...aiSettings, escalateAfterAttempts: parseInt(v)})}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Palabras clave de escalación</Label>
                    <Button variant="outline" size="sm" onClick={() => setShowAddKeyword(true)}>
                      <Plus className="h-3 w-3 mr-1" />
                      Agregar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {escalationKeywords.map((kw) => (
                      <div key={kw.id} className="flex items-center gap-1 px-2 py-1 rounded bg-muted">
                        <span className="text-sm">{kw.keyword}</span>
                        {getPriorityBadge(kw.priority)}
                        <button
                          onClick={() => setEscalationKeywords(escalationKeywords.filter(k => k.id !== kw.id))}
                          className="ml-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Knowledge Base */}
        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Base de Conocimiento</CardTitle>
                    <CardDescription>Preguntas frecuentes para la IA</CardDescription>
                  </div>
                </div>
                <Button onClick={() => setShowAddKnowledge(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar entrada
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledgeBase.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{entry.category}</Badge>
                          {!entry.isActive && <Badge variant="secondary">Inactivo</Badge>}
                        </div>
                        <p className="font-medium mb-2">{entry.question}</p>
                        <p className="text-sm text-muted-foreground">{entry.answer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={entry.isActive}
                          onCheckedChange={(v) => {
                            setKnowledgeBase(knowledgeBase.map(e =>
                              e.id === entry.id ? {...e, isActive: v} : e
                            ));
                          }}
                        />
                        <Button variant="ghost" size="icon" onClick={() => setEditingKnowledge(entry)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setKnowledgeBase(knowledgeBase.filter(e => e.id !== entry.id))}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Equipo</CardTitle>
                    <CardDescription>Administrar usuarios y permisos</CardDescription>
                  </div>
                </div>
                <Button onClick={() => setShowAddMember(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar usuario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium">{member.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          {getRoleBadge(member.role)}
                          {member.status === "inactive" && (
                            <Badge variant="secondary">Inactivo</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        {member.lastLogin && (
                          <p className="text-xs text-muted-foreground">
                            Último acceso: {member.lastLogin.toLocaleDateString("es-SV")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {member.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTeamMembers(teamMembers.filter(m => m.id !== member.id))}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">Datos y Respaldo</CardTitle>
                    <CardDescription>Exportar e importar datos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar conversaciones
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar clientes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar órdenes
                </Button>
                <Separator />
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar base de conocimiento
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">{t("settings.security")}</CardTitle>
                    <CardDescription>Seguridad y acceso</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Key className="h-4 w-4 mr-2" />
                  Cambiar contraseña
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Configurar 2FA
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive">
                  <X className="h-4 w-4 mr-2" />
                  Cerrar otras sesiones
                </Button>
                <Separator />
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium">Claves API</p>
                  <p className="text-xs text-muted-foreground mt-1">Anthropic: ••••••••••4a3b</p>
                  <p className="text-xs text-muted-foreground">Twilio: ••••••••••8f2c</p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">{t("settings.integrations")}</CardTitle>
                    <CardDescription>Servicios conectados</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-accent/5 border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">WhatsApp Business</span>
                      <Badge className="bg-accent/20 text-accent border-accent/30">Conectado</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">+503 7947-5950</p>
                    <p className="text-xs text-muted-foreground mt-1">Twilio API</p>
                  </div>

                  <div className="p-4 rounded-lg border bg-accent/5 border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Claude AI</span>
                      <Badge className="bg-accent/20 text-accent border-accent/30">Activo</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">claude-sonnet-4</p>
                    <p className="text-xs text-muted-foreground mt-1">Anthropic API</p>
                  </div>

                  <div className="p-4 rounded-lg border bg-accent/5 border-accent/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Supabase</span>
                      <Badge className="bg-accent/20 text-accent border-accent/30">Conectado</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">PostgreSQL</p>
                    <p className="text-xs text-muted-foreground mt-1">us-east-1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Team Member Modal */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                placeholder="Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                placeholder="juan@lavanderiaoriental.com.sv"
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={newMember.role} onValueChange={(v) => setNewMember({...newMember, role: v as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="agent">Agente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMember(false)}>Cancelar</Button>
            <Button onClick={handleAddMember}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Knowledge Entry Modal */}
      <Dialog open={showAddKnowledge} onOpenChange={setShowAddKnowledge}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Entrada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Pregunta</Label>
              <Input
                value={newKnowledge.question}
                onChange={(e) => setNewKnowledge({...newKnowledge, question: e.target.value})}
                placeholder="¿Cuánto cuesta...?"
              />
            </div>
            <div className="space-y-2">
              <Label>Respuesta</Label>
              <Textarea
                rows={3}
                value={newKnowledge.answer}
                onChange={(e) => setNewKnowledge({...newKnowledge, answer: e.target.value})}
                placeholder="El precio es..."
              />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={newKnowledge.category} onValueChange={(v) => setNewKnowledge({...newKnowledge, category: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="precios">Precios</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="horarios">Horarios</SelectItem>
                  <SelectItem value="ubicaciones">Ubicaciones</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddKnowledge(false)}>Cancelar</Button>
            <Button onClick={handleAddKnowledge}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Escalation Keyword Modal */}
      <Dialog open={showAddKeyword} onOpenChange={setShowAddKeyword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Palabra Clave</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Palabra clave</Label>
              <Input
                value={newKeyword.keyword}
                onChange={(e) => setNewKeyword({...newKeyword, keyword: e.target.value})}
                placeholder="queja, reclamo, etc."
              />
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={newKeyword.priority} onValueChange={(v) => setNewKeyword({...newKeyword, priority: v as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Alta - Escalación inmediata</SelectItem>
                  <SelectItem value="medium">Media - Revisar contexto</SelectItem>
                  <SelectItem value="low">Baja - Monitorear</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddKeyword(false)}>Cancelar</Button>
            <Button onClick={handleAddKeyword}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
