// Vercel Serverless Entry Point
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Express } from 'express';
import { createServer } from 'http';
import { db } from '../server/db';
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
  res.json({ status: "ok", timestamp: new Date().toISOString() });
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
