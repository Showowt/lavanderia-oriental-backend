import { db } from "../db";
import { customers, conversations, messages } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { generateAIResponse, type ConversationMessage } from "./ai-engine";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

export interface IncomingWhatsAppMessage {
  From: string;
  To: string;
  Body: string;
  MessageSid: string;
  ProfileName?: string;
}

export async function processIncomingMessage(message: IncomingWhatsAppMessage): Promise<string> {
  const phoneNumber = message.From.replace("whatsapp:", "");
  const messageContent = message.Body;
  const customerName = message.ProfileName || "Cliente";
  
  let customer = await db.query.customers.findFirst({
    where: eq(customers.phone, phoneNumber),
  });
  
  if (!customer) {
    const [newCustomer] = await db.insert(customers).values({
      phone: phoneNumber,
      name: customerName,
      language: detectLanguage(messageContent),
      lastContact: new Date(),
    }).returning();
    customer = newCustomer;
  } else {
    await db.update(customers)
      .set({ lastContact: new Date(), name: customerName || customer.name })
      .where(eq(customers.id, customer.id));
  }
  
  let conversation = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.customerId, customer.id),
      eq(conversations.status, "active")
    ),
    orderBy: [desc(conversations.startedAt)],
  });
  
  if (!conversation) {
    const [newConversation] = await db.insert(conversations).values({
      customerId: customer.id,
      status: "active",
      startedAt: new Date(),
      aiHandled: true,
    }).returning();
    conversation = newConversation;
  }
  
  await db.insert(messages).values({
    conversationId: conversation.id,
    direction: "inbound",
    content: messageContent,
    messageType: "text",
    waMessageId: message.MessageSid,
    aiGenerated: false,
  });
  
  const conversationHistory = await db.query.messages.findMany({
    where: eq(messages.conversationId, conversation.id),
    orderBy: [messages.createdAt],
    limit: 20,
  });
  
  const aiMessages: ConversationMessage[] = conversationHistory.map(msg => ({
    role: msg.direction === "inbound" ? "user" as const : "assistant" as const,
    content: msg.content,
  }));
  
  const aiResult = await generateAIResponse(aiMessages, customer.language || "es");
  
  await db.insert(messages).values({
    conversationId: conversation.id,
    direction: "outbound",
    content: aiResult.response,
    messageType: "text",
    aiGenerated: true,
  });
  
  if (aiResult.shouldEscalate) {
    await db.update(conversations)
      .set({ 
        status: "escalated",
        aiHandled: false,
      })
      .where(eq(conversations.id, conversation.id));
  }
  
  return aiResult.response;
}

export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
    console.log("Twilio not configured. Message would be sent to:", to);
    console.log("Message:", message);
    return true;
  }
  
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    // Handle both formats: with or without whatsapp: prefix
    const fromNumber = TWILIO_WHATSAPP_NUMBER.startsWith("whatsapp:") 
      ? TWILIO_WHATSAPP_NUMBER 
      : `whatsapp:${TWILIO_WHATSAPP_NUMBER}`;
    const toNumber = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
    
    const body = new URLSearchParams({
      From: fromNumber,
      To: toNumber,
      Body: message,
    });
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Twilio API error:", errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
}

function detectLanguage(text: string): string {
  const spanishIndicators = ["hola", "buenos", "gracias", "por favor", "quiero", "necesito", "dónde", "cuánto"];
  const englishIndicators = ["hello", "hi", "thanks", "please", "want", "need", "where", "how much"];
  
  const lowerText = text.toLowerCase();
  
  let spanishCount = 0;
  let englishCount = 0;
  
  for (const word of spanishIndicators) {
    if (lowerText.includes(word)) spanishCount++;
  }
  
  for (const word of englishIndicators) {
    if (lowerText.includes(word)) englishCount++;
  }
  
  return englishCount > spanishCount ? "en" : "es";
}

export function verifyWebhook(mode: string, token: string, challenge: string): string | null {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "lavanderia_oriental_verify_token";
  
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return challenge;
  }
  
  return null;
}
