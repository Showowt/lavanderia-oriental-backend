import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Globe, Moon, Bell, Sparkles, Shield, Link2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function Settings() {
  const { t, language, setLanguage } = useI18n();

  return (
    <div className="p-6 space-y-6" data-testid="settings-page">
      <div>
        <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">{t("settings.general")}</CardTitle>
                  <CardDescription>Configuración general de la aplicación</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t("settings.language")}</Label>
                  <p className="text-sm text-muted-foreground">Selecciona el idioma de la interfaz</p>
                </div>
                <Select value={language} onValueChange={(v) => setLanguage(v as "es" | "en")}>
                  <SelectTrigger className="w-40" data-testid="select-language">
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
                  <p className="text-sm text-muted-foreground">Zona horaria para fechas y horas</p>
                </div>
                <Select defaultValue="america_el_salvador">
                  <SelectTrigger className="w-48" data-testid="select-timezone">
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
                  <Label>{t("settings.currency")}</Label>
                  <p className="text-sm text-muted-foreground">Moneda para precios y totales</p>
                </div>
                <Select defaultValue="usd">
                  <SelectTrigger className="w-40" data-testid="select-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
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
                  <CardDescription>Configura cómo recibir alertas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones de escalaciones</Label>
                  <p className="text-sm text-muted-foreground">Recibe alertas cuando hay escalaciones</p>
                </div>
                <Switch defaultChecked data-testid="switch-escalation-notifications" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Resumen diario</Label>
                  <p className="text-sm text-muted-foreground">Recibe un resumen de actividad cada día</p>
                </div>
                <Switch defaultChecked data-testid="switch-daily-summary" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de nuevos clientes</Label>
                  <p className="text-sm text-muted-foreground">Notifica cuando hay nuevos registros</p>
                </div>
                <Switch data-testid="switch-new-customer-alerts" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">{t("settings.ai")}</CardTitle>
                  <CardDescription>Configura el comportamiento del asistente IA</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Respuestas automáticas</Label>
                  <p className="text-sm text-muted-foreground">Permite que la IA responda automáticamente</p>
                </div>
                <Switch defaultChecked data-testid="switch-auto-responses" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Escalación automática</Label>
                  <p className="text-sm text-muted-foreground">Escala cuando la IA detecta urgencia</p>
                </div>
                <Switch defaultChecked data-testid="switch-auto-escalation" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Tono de voz</Label>
                  <p className="text-sm text-muted-foreground">Estilo de comunicación de la IA</p>
                </div>
                <Select defaultValue="professional">
                  <SelectTrigger className="w-40" data-testid="select-ai-tone">
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{t("settings.integrations")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border bg-accent/5 border-accent/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">WhatsApp Business</span>
                  <span className="text-xs text-accent">Conectado</span>
                </div>
                <p className="text-xs text-muted-foreground">+503 2222-3333</p>
              </div>

              <div className="p-3 rounded-lg border bg-accent/5 border-accent/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Claude AI (Anthropic)</span>
                  <span className="text-xs text-accent">Activo</span>
                </div>
                <p className="text-xs text-muted-foreground">Modelo: claude-sonnet-4</p>
              </div>

              <div className="p-3 rounded-lg border border-dashed">
                <span className="text-sm text-muted-foreground">Agregar integración...</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{t("settings.security")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" data-testid="button-change-password">
                Cambiar contraseña
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-two-factor">
                Configurar 2FA
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive" data-testid="button-sessions">
                Cerrar otras sesiones
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" data-testid="button-cancel">{t("settings.cancel")}</Button>
        <Button className="gold-gradient" data-testid="button-save">{t("settings.saveChanges")}</Button>
      </div>
    </div>
  );
}
