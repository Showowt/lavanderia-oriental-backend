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
    const [totalCustomers] = await db.select({ count: count() }).from(customers);
    const [activeConversations] = await db.select({ count: count() }).from(conversations).where(eq(conversations.status, 'active'));
    const [todayMessages] = await db.select({ count: count() }).from(messages).where(sql`DATE(${messages.createdAt}) = CURRENT_DATE`);
    const [pendingOrders] = await db.select({ count: count() }).from(orders).where(eq(orders.status, 'pending'));
    
    res.json({
      totalCustomers: totalCustomers?.count || 0,
      activeConversations: activeConversations?.count || 0,
      todayMessages: todayMessages?.count || 0,
      pendingOrders: pendingOrders?.count || 0
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
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
