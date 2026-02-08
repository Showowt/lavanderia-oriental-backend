import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  MessageSquare as MessageIcon, 
  Sparkles, 
  BarChart3,
  Mail,
  Phone,
  Clock,
  ExternalLink
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useI18n } from "@/lib/i18n";

export default function Help() {
  const { t } = useI18n();

  const helpTopics = [
    {
      icon: BookOpen,
      titleKey: "help.gettingStarted",
      descKey: "help.gettingStartedDesc",
      color: "text-primary",
    },
    {
      icon: SiWhatsapp,
      titleKey: "help.whatsappIntegration",
      descKey: "help.whatsappIntegrationDesc",
      color: "text-green-500",
    },
    {
      icon: Sparkles,
      titleKey: "help.aiConfiguration",
      descKey: "help.aiConfigurationDesc",
      color: "text-primary",
    },
    {
      icon: BarChart3,
      titleKey: "help.reportsAnalytics",
      descKey: "help.reportsAnalyticsDesc",
      color: "text-accent",
    },
  ];

  const faqs = [
    {
      question: "¿Cómo configuro el bot de WhatsApp?",
      answer: "Para configurar el bot de WhatsApp, ve a Configuración > Integraciones y sigue las instrucciones para conectar tu cuenta de WhatsApp Business. Necesitarás tener una cuenta de Meta Business verificada.",
    },
    {
      question: "¿Cómo personalizo las respuestas automáticas de la IA?",
      answer: "En Configuración > Configuración de IA puedes ajustar el tono de voz, agregar respuestas personalizadas para preguntas frecuentes, y definir cuándo el sistema debe escalar a un agente humano.",
    },
    {
      question: "¿Cómo agrego una nueva sucursal?",
      answer: "Ve a Sucursales y haz clic en 'Agregar Sucursal'. Ingresa la información de la ubicación incluyendo dirección, teléfono y horarios de operación. La nueva sucursal aparecerá inmediatamente en el sistema.",
    },
    {
      question: "¿Cómo exporto los reportes de actividad?",
      answer: "En la sección de Analíticas, encontrarás un botón de exportar en la esquina superior derecha. Puedes exportar los datos en formato CSV o PDF para cualquier rango de fechas.",
    },
    {
      question: "¿Qué hago si un cliente solicita hablar con un humano?",
      answer: "El sistema detecta automáticamente cuando un cliente quiere hablar con una persona y crea una escalación. Verás estas en el panel de Escalaciones donde puedes tomar el control de la conversación.",
    },
    {
      question: "¿Cómo actualizo los precios de los servicios?",
      answer: "Los precios se pueden actualizar en Configuración > Servicios. Los cambios se reflejan inmediatamente en las respuestas del bot de IA cuando los clientes preguntan por precios.",
    },
  ];

  return (
    <div className="p-6 space-y-6" data-testid="help-page">
      <div>
        <h1 className="text-2xl font-bold">{t("help.title")}</h1>
        <p className="text-muted-foreground">{t("help.subtitle")}</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("help.search")}
          className="pl-9"
          data-testid="input-search-help"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpTopics.map((topic, idx) => (
          <Card key={idx} className="hover-elevate cursor-pointer" data-testid={`help-topic-${idx}`}>
            <CardContent className="p-4">
              <topic.icon className={`h-8 w-8 mb-3 ${topic.color}`} />
              <h3 className="font-semibold mb-1">{t(topic.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(topic.descKey)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{t("help.faq")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger className="text-left" data-testid={`faq-trigger-${idx}`}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{t("help.contactSupport")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("help.email")}</p>
                  <p className="text-sm text-muted-foreground">soporte@lavanderia.sv</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t("help.phone")}</p>
                  <p className="text-sm text-muted-foreground">+503 2222-3333</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Horario</p>
                  <p className="text-sm text-muted-foreground">{t("help.hours")}</p>
                </div>
              </div>

              <Button className="w-full gold-gradient" data-testid="button-contact-support">
                <MessageIcon className="h-4 w-4 mr-2" />
                Iniciar Chat de Soporte
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <ExternalLink className="h-4 w-4 text-accent" />
                </div>
                <span className="font-medium">Recursos Adicionales</span>
              </div>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  Documentación completa
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  Videos tutoriales
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  Comunidad de usuarios
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                  Estado del sistema
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
