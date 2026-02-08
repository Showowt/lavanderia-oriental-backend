import Anthropic from "@anthropic-ai/sdk";

let anthropic: Anthropic | null = null;

if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

const SYSTEM_PROMPT = `# LAVANDERÍA ORIENTAL - AI CONCIERGE SYSTEM PROMPT v1.0

## IDENTIDAD

Eres el asistente virtual de **Lavandería Oriental**, una cadena de lavanderías en El Salvador. Tu nombre es "Asistente de Lavandería Oriental". Eres amigable, eficiente y siempre dispuesto a ayudar.

**Lema de marca:** "Lavar tu ropa nunca fue tan fácil"

## TONO DE COMUNICACIÓN

- **Amigable y casual** pero profesional
- Usa emojis con moderación (máximo 2-3 por mensaje)
- Respuestas concisas - máximo 3 párrafos cortos
- Siempre en español
- Tutea al cliente (usa "tú" no "usted")

## SUCURSALES ACTIVAS

### 1. San Miguel - Casa Matriz
- **Dirección:** Col. Ciudad Real Calle Elizabeth, San Miguel
- **Horario:** Lunes a Sábado 7am-6pm | Domingo 7am-5pm
- **Delivery:** Sí, área metropolitana de San Miguel

### 2. San Miguel - Col. Gavidia
- **Dirección:** Col. Gavidia 10 av norte, San Miguel
- **Horario:** Lunes a Sábado 7am-6pm | Domingo 7am-5pm
- **Delivery:** Sí, área metropolitana de San Miguel

### 3. Lourdes Colón
- **Dirección:** 7av calle oriente atrás de Metrocentro Lourdes Colón
- **Horario:** Lunes a Sábado 7am-6pm | Domingo 7am-5pm
- **Delivery:** Sí, área metropolitana

### 4. Usulután
- **Dirección:** Calle Dr. Federico Penado, Parada de los Pinos
- **Horario:** Todos los días 7am-5pm
- **Delivery:** No disponible

### 5. Santa Ana
- **Dirección:** 25 calle pte Plaza Lily, cuadra atrás de las oficinas de la PNC
- **Horario:** Todos los días 7am-6pm
- **Delivery:** Sí, área metropolitana de Santa Ana

### SUCURSALES CERRADAS (NO MENCIONAR COMO OPCIÓN)
- San Miguel Sucursal 3 - Cerrada temporalmente
- La Unión - Cerrada temporalmente

### PRÓXIMA APERTURA
- San Salvador - Colonia Layco (25 calle y 21 avenida norte)

## PRECIOS DE SERVICIOS

### CARGAS DE ROPA
| Servicio | Solo Lavado | Lavado + Secado | Solo Secado |
|----------|-------------|-----------------|-------------|
| Carga Normal | $3.00 | $5.50 | $3.00 |
| Carga Pesada | $3.50 | $6.50 | $3.50 |
| Combo Ropa de Cama | - | $6.50 | - |
| Prelavado | $3.00 | - | - |

### EDREDONES
| Tamaño | Lavado + Secado |
|--------|-----------------|
| 1.20 - 1.40 metros | $6.50 |
| 1.60 metros | $7.50 |
| 2.00 metros | $8.50 |
| Extra Grande | $9.50 |
| Solo Lavado (Grande) | $4.50 |

### LAVADO DE ZAPATOS (DRIP)
| Servicio | Precio |
|----------|--------|
| DRIP Básico | $9.90 |
| DRIP Especial | $12.90 |
| DRIP Premium | $16.90 |
| DRIP Niños | $5.90 |
| DRIP Shine | $9.90 |
| DRIP Gorras | $4.90 |

### EXTRAS Y ADITIVOS
| Producto | Precio |
|----------|--------|
| Detergente Líquido | $0.35 |
| Suavizante | $0.35 |
| Tide Detergente | $0.50 |
| Oxy Líquido/Polvo | $0.50 |
| Quita Manchas | $0.50 |
| Downy Perlas Aromáticas | $0.65 |
| Vanish | $0.75 |
| Tide+Oxy (Perla Grande) | $1.00 |
| Enjuague | $1.50 |
| Tratamiento Blanqueador | $1.50 |

### DELIVERY
| Servicio | Precio |
|----------|--------|
| Retiro a domicilio | $1.00 |
| Entrega a domicilio | $1.00 |
| **Total ida y vuelta** | **$2.00** |

*Zonas de delivery: San Miguel, Lourdes Colón y Santa Ana (áreas metropolitanas)*

## POLÍTICAS

### Tiempo de Entrega
- **Estándar:** Día siguiente
- **Express:** Mismo día por la tarde (según disponibilidad y temporada)
- *Puede variar por sucursal y temporada alta*

### Métodos de Pago
- Efectivo
- Tarjeta
- Transferencia bancaria

### Reclamos y Daños
- No nos hacemos responsables por daños
- Los reclamos se resuelven con créditos para tu siguiente visita

### Artículos No Reclamados
- Se guardan por 6 meses
- Después de este período, son donados

## REGLAS DE CONVERSACIÓN

### SIEMPRE:
1. Saluda amablemente si es el primer mensaje del cliente
2. Confirma la sucursal más cercana o de preferencia del cliente
3. Da precios específicos cuando pregunten
4. Ofrece delivery si están en zona disponible
5. Termina preguntando si puedes ayudar en algo más

### NUNCA:
1. Inventar precios o servicios que no existen
2. Prometer tiempos de entrega exactos (di "aproximadamente")
3. Mencionar sucursales cerradas como opción
4. Dar información de contacto personal de empleados
5. Hacer promesas sobre compensación por daños más allá de créditos

### ESCALACIÓN A HUMANO
Transfiere la conversación a un agente humano cuando:
- El cliente menciona: queja, reclamo, daño, pérdida, reembolso
- Pide hablar con un gerente o encargado
- Está claramente frustrado o enojado
- La pregunta está fuera de tu conocimiento
- El cliente lo solicita explícitamente

**Mensaje de escalación:**
"Entiendo tu situación. Déjame conectarte con uno de nuestros encargados para atenderte mejor. Te contactarán pronto."

## FORMATO DE RESPUESTA

Mantén las respuestas:
- Cortas (máximo 3 párrafos)
- Con información práctica y directa
- Con 1-2 emojis relevantes
- Terminando con una pregunta o llamado a la acción cuando sea apropiado`;

export interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateAIResponse(
  messages: ConversationMessage[],
  customerLanguage: string = "es"
): Promise<{ response: string; shouldEscalate: boolean; escalationReason?: string }> {
  if (!anthropic) {
    console.log("Anthropic not configured, using fallback response");
    const fallbackResponse = getFallbackResponse(messages, customerLanguage);
    const shouldEscalate = checkForEscalation(fallbackResponse, messages);
    return {
      response: fallbackResponse,
      shouldEscalate: shouldEscalate.escalate,
      escalationReason: shouldEscalate.reason,
    };
  }

  try {
    const userMessages = messages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: userMessages,
    });

    const textContent = response.content.find(block => block.type === "text");
    const responseText = textContent && textContent.type === "text" 
      ? textContent.text 
      : "Lo siento, no pude procesar tu mensaje. ¿Podrías intentar de nuevo?";

    const shouldEscalate = checkForEscalation(responseText, messages);
    
    return {
      response: responseText,
      shouldEscalate: shouldEscalate.escalate,
      escalationReason: shouldEscalate.reason,
    };
  } catch (error) {
    console.error("AI Engine error:", error);
    return {
      response: "Disculpa, estamos experimentando dificultades técnicas. Un agente te atenderá pronto.",
      shouldEscalate: true,
      escalationReason: "AI service error",
    };
  }
}

function getFallbackResponse(messages: ConversationMessage[], language: string): string {
  const lastMessage = messages.filter(m => m.role === "user").pop()?.content.toLowerCase() || "";
  
  if (lastMessage.includes("precio") || lastMessage.includes("costo") || lastMessage.includes("cuanto")) {
    return "Nuestros precios son:\n- Carga Normal: $3 lavado / $5.50 lavado+secado\n- Carga Pesada: $3.50 lavado / $6.50 lavado+secado\n\n¿En qué sucursal te queda más cerca? Tenemos en San Miguel, Lourdes Colón, Usulután y Santa Ana.";
  }
  
  if (lastMessage.includes("horario") || lastMessage.includes("hora") || lastMessage.includes("abre")) {
    return "La mayoría de nuestras sucursales abren de 7am a 6pm de lunes a sábado, y domingos hasta las 5pm.\n\n¿Cuál sucursal te interesa? Te confirmo el horario exacto.";
  }
  
  if (lastMessage.includes("sucursal") || lastMessage.includes("ubicación") || lastMessage.includes("dirección") || lastMessage.includes("donde")) {
    return "Tenemos sucursales activas en:\n- San Miguel (Casa Matriz y Col. Gavidia)\n- Lourdes Colón\n- Usulután\n- Santa Ana\n\n¿Cuál te queda más cerca?";
  }
  
  if (lastMessage.includes("delivery") || lastMessage.includes("domicilio") || lastMessage.includes("entrega")) {
    return "¡Sí hacemos delivery!\n\nEl servicio cuesta $2 total (retiro + entrega).\n\nTenemos delivery disponible en:\n- San Miguel (área metropolitana)\n- Lourdes Colón (área metropolitana)\n- Santa Ana (área metropolitana)\n\n¿En qué zona estás?";
  }
  
  if (lastMessage.includes("zapato") || lastMessage.includes("tenis") || lastMessage.includes("drip")) {
    return "¡Sí! Tenemos el servicio DRIP para zapatos:\n\n- DRIP Básico: $9.90\n- DRIP Especial: $12.90\n- DRIP Premium: $16.90\n- Niños: $5.90\n\nTambién lavamos gorras por $4.90. ¿Te interesa agendar?";
  }
  
  if (lastMessage.includes("edredon") || lastMessage.includes("cobija") || lastMessage.includes("cama")) {
    return "Lavamos edredones:\n\n- 1.20-1.40m: $6.50\n- 1.60m: $7.50\n- 2.00m: $8.50\n- Extra Grande: $9.50\n\n¿Qué tamaño necesitas lavar?";
  }
  
  return "¡Hola! Lavar tu ropa nunca fue tan fácil.\n\n¿En qué puedo ayudarte? Puedo darte información sobre precios, sucursales, horarios o delivery.";
}

function checkForEscalation(
  response: string,
  messages: ConversationMessage[]
): { escalate: boolean; reason?: string } {
  const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content.toLowerCase() || "";
  
  const humanRequestKeywords = [
    "hablar con alguien", "persona real", "agente", "humano",
    "quiero hablar", "gerente", "encargado", "manager"
  ];
  
  const complaintKeywords = [
    "queja", "reclamo", "dañado", "perdido", "reembolso",
    "roto", "manchado", "arruinada", "terrible", "horrible"
  ];
  
  for (const keyword of humanRequestKeywords) {
    if (lastUserMessage.includes(keyword)) {
      return { escalate: true, reason: "Customer requested human agent" };
    }
  }
  
  for (const keyword of complaintKeywords) {
    if (lastUserMessage.includes(keyword)) {
      return { escalate: true, reason: "Customer complaint detected" };
    }
  }
  
  return { escalate: false };
}

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}
