// Vercel Serverless Entry Point
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Express } from 'express';
import { createServer } from 'http';
import { db, isDbConnected } from '../server/db';
import { locations, customers, conversations, messages, orders, services, knowledgeBase, notifications, dailyReports } from '../shared/schema';
import { eq, desc, and, sql, count } from 'drizzle-orm';
import { processIncomingMessage, verifyWebhook, sendWhatsAppMessage } from '../server/services/whatsapp';
import { seedDatabase } from '../server/services/seed-data';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initialized = false;

async function initializeApp() {
  if (initialized) return;
  
  // Seed database on cold start
  try {
    await seedDatabase();
  } catch (error) {
    console.error("Database seeding error:", error);
  }
  
  initialized = true;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: isDbConnected() ? "connected" : "not configured",
    environment: process.env.NODE_ENV || "development"
  });
});

// WhatsApp Webhook - Verification (GET)
app.get("/api/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"] as string;
  const token = req.query["hub.verify_token"] as string;
  const challenge = req.query["hub.challenge"] as string;

  const result = verifyWebhook(mode, token, challenge);
  if (result) {
    res.status(200).send(result);
  } else {
    res.sendStatus(403);
  }
});

// WhatsApp Webhook - Incoming Messages (POST)
app.post("/api/webhook/whatsapp", async (req, res) => {
  try {
    const body = req.body;
    
    // Twilio format
    if (body.From && body.Body) {
      const response = await processIncomingMessage({
        From: body.From,
        To: body.To,
        Body: body.Body,
        MessageSid: body.MessageSid
      });
      res.status(200).json({ success: true, response });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Dashboard Stats
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    if (!isDbConnected()) {
      // Return mock data when database is not connected
      return res.json({
        totalConversations: 1247,
        activeConversations: 24,
        todayMessages: 156,
        pendingOrders: 8,
        aiResolutionRate: 94,
        avgResponseTime: "2.3s",
        messagesProcessed: 156,
        resolvedToday: 42,
        customerSatisfaction: 96,
        escalations: 3
      });
    }

    const [totalConversations] = await db.select({ count: count() }).from(conversations);
    const [activeConversations] = await db.select({ count: count() }).from(conversations).where(eq(conversations.status, 'active'));
    const [todayMessages] = await db.select({ count: count() }).from(messages).where(sql`DATE(${messages.createdAt}) = CURRENT_DATE`);
    const [pendingOrders] = await db.select({ count: count() }).from(orders).where(eq(orders.status, 'pending'));
    const [resolvedToday] = await db.select({ count: count() }).from(conversations).where(and(eq(conversations.status, 'resolved'), sql`DATE(${conversations.updatedAt}) = CURRENT_DATE`));
    const [escalations] = await db.select({ count: count() }).from(conversations).where(eq(conversations.status, 'escalated'));

    res.json({
      totalConversations: totalConversations?.count || 0,
      activeConversations: activeConversations?.count || 0,
      todayMessages: todayMessages?.count || 0,
      pendingOrders: pendingOrders?.count || 0,
      aiResolutionRate: 94,
      avgResponseTime: "2.3s",
      messagesProcessed: todayMessages?.count || 0,
      resolvedToday: resolvedToday?.count || 0,
      customerSatisfaction: 96,
      escalations: escalations?.count || 0
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

// Dashboard Messages (recent chat preview)
app.get("/api/dashboard/messages", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json([
        { id: "1", content: "Hola, cuánto cuesta lavar una carga normal?", sender: "inbound", timestamp: new Date(), isAI: false },
        { id: "2", content: "¡Hola! El precio de una carga normal es $3 solo lavado o $5.50 lavado + secado. ¿En qué sucursal te queda más cerca?", sender: "outbound", timestamp: new Date(), isAI: true },
        { id: "3", content: "San Miguel", sender: "inbound", timestamp: new Date(), isAI: false },
        { id: "4", content: "¡Perfecto! En San Miguel tenemos dos sucursales: Casa Matriz en Col. Ciudad Real y Col. Gavidia. Ambas abren de 7am-6pm. ¿Te gustaría delivery? Cuesta $2 total.", sender: "outbound", timestamp: new Date(), isAI: true }
      ]);
    }

    const recentMessages = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(10);

    // Transform to chat format
    const chatMessages = recentMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.direction,
      timestamp: msg.createdAt,
      isAI: msg.aiGenerated || msg.direction === 'outbound'
    }));

    res.json(chatMessages);
  } catch (error) {
    console.error("Dashboard messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Dashboard Activities
app.get("/api/dashboard/activities", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json([
        { id: "1", type: "resolved", title: "Conversación resuelta", description: "María García - Consulta de precios", timestamp: new Date(Date.now() - 5 * 60000) },
        { id: "2", type: "message", title: "Nueva conversación", description: "+503 7890-1234", timestamp: new Date(Date.now() - 15 * 60000) },
        { id: "3", type: "newCustomer", title: "Nuevo cliente", description: "Carlos Hernández", timestamp: new Date(Date.now() - 30 * 60000) },
        { id: "4", type: "escalated", title: "Escalación creada", description: "José López - Reclamo", timestamp: new Date(Date.now() - 45 * 60000) },
        { id: "5", type: "resolved", title: "Conversación resuelta", description: "Ana Martínez - Horarios", timestamp: new Date(Date.now() - 60 * 60000) }
      ]);
    }

    // Get recent activities from various sources
    const recentConversations = await db.select().from(conversations).orderBy(desc(conversations.updatedAt)).limit(5);
    const recentCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt)).limit(3);

    const activities = [
      ...recentConversations.map(conv => ({
        id: `conv-${conv.id}`,
        type: conv.status === 'resolved' ? 'resolved' : conv.status === 'escalated' ? 'escalated' : 'message',
        title: conv.status === 'resolved' ? 'Conversación resuelta' : conv.status === 'escalated' ? 'Escalación creada' : 'Nueva conversación',
        description: `Conversación ${conv.id}`,
        timestamp: conv.updatedAt
      })),
      ...recentCustomers.map(cust => ({
        id: `cust-${cust.id}`,
        type: 'newCustomer',
        title: 'Nuevo cliente',
        description: cust.name || cust.phone,
        timestamp: cust.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()).slice(0, 8);

    res.json(activities);
  } catch (error) {
    console.error("Dashboard activities error:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// Dashboard Escalations
app.get("/api/dashboard/escalations", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json([
        { id: "1", customerName: "José López", customerPhone: "+503 7890-3456", reason: "Reclamo por ropa dañada", priority: "high", waitTime: 5, timestamp: new Date() },
        { id: "2", customerName: "Miguel Torres", customerPhone: "+503 7890-7890", reason: "Pedido retrasado", priority: "medium", waitTime: 15, timestamp: new Date() }
      ]);
    }

    const escalatedConversations = await db.select({
      id: conversations.id,
      customerId: conversations.customerId,
      status: conversations.status,
      startedAt: conversations.startedAt,
      updatedAt: conversations.updatedAt
    }).from(conversations).where(eq(conversations.status, 'escalated')).orderBy(desc(conversations.updatedAt)).limit(5);

    // Enrich with customer info
    const escalations = await Promise.all(escalatedConversations.map(async (esc) => {
      const [customer] = await db.select().from(customers).where(eq(customers.id, esc.customerId)).limit(1);
      return {
        id: esc.id,
        customerName: customer?.name || 'Cliente',
        customerPhone: customer?.phone || '',
        reason: 'Requiere atención humana',
        priority: 'high',
        waitTime: Math.floor((Date.now() - new Date(esc.updatedAt!).getTime()) / 60000),
        timestamp: esc.updatedAt
      };
    }));

    res.json(escalations);
  } catch (error) {
    console.error("Dashboard escalations error:", error);
    res.status(500).json({ error: "Failed to fetch escalations" });
  }
});

// Locations
app.get("/api/locations", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json([
        { id: "1", name: "San Miguel - Casa Matriz", address: "Col. Ciudad Real Calle Elizabeth", city: "San Miguel", phone: "+503 2661-1234", isActive: true, rating: 4.8 },
        { id: "2", name: "San Miguel - Col. Gavidia", address: "Col. Gavidia 10 av norte", city: "San Miguel", phone: "+503 2661-5678", isActive: true, rating: 4.7 },
        { id: "3", name: "Lourdes Colón", address: "7av calle oriente atrás de Metrocentro", city: "Lourdes Colón", phone: "+503 2318-1234", isActive: true, rating: 4.9 },
        { id: "4", name: "Usulután", address: "Calle Dr. Federico Penado, Parada de los Pinos", city: "Usulután", phone: "+503 2624-1234", isActive: true, rating: 4.6 },
        { id: "5", name: "Santa Ana", address: "25 calle pte Plaza Lily", city: "Santa Ana", phone: "+503 2440-1234", isActive: true, rating: 4.8 }
      ]);
    }

    const allLocations = await db.select().from(locations);
    res.json(allLocations);
  } catch (error) {
    console.error("Locations error:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// Services
app.get("/api/services", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json([
        { id: "1", name: "Carga Normal - Lavado", category: "lavado", price: 3.00, isActive: true },
        { id: "2", name: "Carga Normal - Lavado + Secado", category: "lavado", price: 5.50, isActive: true },
        { id: "3", name: "Carga Pesada - Lavado", category: "lavado", price: 3.50, isActive: true },
        { id: "4", name: "Carga Pesada - Lavado + Secado", category: "lavado", price: 6.50, isActive: true },
        { id: "5", name: "Edredón 1.20-1.40m", category: "edredones", price: 6.50, isActive: true },
        { id: "6", name: "Edredón 1.60m", category: "edredones", price: 7.50, isActive: true },
        { id: "7", name: "Edredón 2.00m", category: "edredones", price: 8.50, isActive: true },
        { id: "8", name: "DRIP Básico", category: "drip", price: 9.90, isActive: true },
        { id: "9", name: "DRIP Especial", category: "drip", price: 12.90, isActive: true },
        { id: "10", name: "DRIP Premium", category: "drip", price: 16.90, isActive: true },
        { id: "11", name: "DRIP Niños", category: "drip", price: 5.90, isActive: true },
        { id: "12", name: "Delivery (ida y vuelta)", category: "delivery", price: 2.00, isActive: true }
      ]);
    }

    const allServices = await db.select().from(services);
    res.json(allServices);
  } catch (error) {
    console.error("Services error:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// Customers
app.get("/api/customers", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json([
        { id: "1", name: "María García", phone: "+503 7890-1234", email: "maria@email.com", totalOrders: 12, isVip: false, createdAt: new Date() },
        { id: "2", name: "Carlos Hernández", phone: "+503 7890-5678", email: "carlos@email.com", totalOrders: 8, isVip: false, createdAt: new Date() },
        { id: "3", name: "Ana Martínez", phone: "+503 7890-9012", email: "ana@email.com", totalOrders: 25, isVip: true, createdAt: new Date() },
        { id: "4", name: "José López", phone: "+503 7890-3456", email: "jose@email.com", totalOrders: 5, isVip: false, createdAt: new Date() },
        { id: "5", name: "Rosa Pérez", phone: "+503 7890-7890", email: "rosa@email.com", totalOrders: 35, isVip: true, createdAt: new Date() }
      ]);
    }

    const allCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt));
    res.json(allCustomers);
  } catch (error) {
    console.error("Customers error:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// Conversations
app.get("/api/conversations", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json([
        { id: "1", customerId: "1", customerName: "María García", customerPhone: "+503 7890-1234", status: "active", lastMessageAt: new Date(), messageCount: 8, aiHandled: true },
        { id: "2", customerId: "2", customerName: "Carlos Hernández", customerPhone: "+503 7890-5678", status: "resolved", lastMessageAt: new Date(Date.now() - 30 * 60000), messageCount: 5, aiHandled: true },
        { id: "3", customerId: "4", customerName: "José López", customerPhone: "+503 7890-3456", status: "escalated", lastMessageAt: new Date(Date.now() - 15 * 60000), messageCount: 12, aiHandled: false },
        { id: "4", customerId: "3", customerName: "Ana Martínez", customerPhone: "+503 7890-9012", status: "resolved", lastMessageAt: new Date(Date.now() - 60 * 60000), messageCount: 3, aiHandled: true },
        { id: "5", customerId: "5", customerName: "Rosa Pérez", customerPhone: "+503 7890-7890", status: "active", lastMessageAt: new Date(Date.now() - 5 * 60000), messageCount: 6, aiHandled: true }
      ]);
    }

    const allConversations = await db.select().from(conversations).orderBy(desc(conversations.updatedAt));
    res.json(allConversations);
  } catch (error) {
    console.error("Conversations error:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Messages by conversation
app.get("/api/conversations/:id/messages", async (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversationMessages = await db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
    res.json(conversationMessages);
  } catch (error) {
    console.error("Messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Orders
app.get("/api/orders", async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json([
        { id: "ORD001", customerId: "1", customerName: "María García", customerPhone: "+503 7890-1234", locationName: "San Miguel - Casa Matriz", status: "pending", totalAmount: 11.00, hasDelivery: true, createdAt: new Date() },
        { id: "ORD002", customerId: "2", customerName: "Carlos Hernández", customerPhone: "+503 7890-5678", locationName: "Santa Ana", status: "processing", totalAmount: 6.50, hasDelivery: false, createdAt: new Date(Date.now() - 30 * 60000) },
        { id: "ORD003", customerId: "3", customerName: "Ana Martínez", customerPhone: "+503 7890-9012", locationName: "Lourdes Colón", status: "ready", totalAmount: 16.90, hasDelivery: true, createdAt: new Date(Date.now() - 60 * 60000) },
        { id: "ORD004", customerId: "5", customerName: "Rosa Pérez", customerPhone: "+503 7890-7890", locationName: "San Miguel - Casa Matriz", status: "delivered", totalAmount: 8.50, hasDelivery: false, createdAt: new Date(Date.now() - 120 * 60000) }
      ]);
    }

    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    res.json(allOrders);
  } catch (error) {
    console.error("Orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Knowledge Base
app.get("/api/knowledge-base", async (req, res) => {
  try {
    const allKnowledge = await db.select().from(knowledgeBase);
    res.json(allKnowledge);
  } catch (error) {
    console.error("Knowledge base error:", error);
    res.status(500).json({ error: "Failed to fetch knowledge base" });
  }
});

// Export for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initializeApp();
  // @ts-ignore - Express handles the request/response
  return app(req, res);
}
