// Vercel Serverless Entry Point - Self-contained API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Express } from 'express';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mock data for demo purposes
const mockLocations = [
  { id: "1", name: "San Miguel - Casa Matriz", address: "Col. Ciudad Real Calle Elizabeth", city: "San Miguel", phone: "+503 2661-1234", isActive: true, rating: 4.8 },
  { id: "2", name: "San Miguel - Col. Gavidia", address: "Col. Gavidia 10 av norte", city: "San Miguel", phone: "+503 2661-5678", isActive: true, rating: 4.7 },
  { id: "3", name: "Lourdes Colón", address: "7av calle oriente atrás de Metrocentro", city: "Lourdes Colón", phone: "+503 2318-1234", isActive: true, rating: 4.9 },
  { id: "4", name: "Usulután", address: "Calle Dr. Federico Penado, Parada de los Pinos", city: "Usulután", phone: "+503 2624-1234", isActive: true, rating: 4.6 },
  { id: "5", name: "Santa Ana", address: "25 calle pte Plaza Lily", city: "Santa Ana", phone: "+503 2440-1234", isActive: true, rating: 4.8 }
];

const mockServices = [
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
];

const mockCustomers = [
  { id: "1", name: "María García", phone: "+503 7890-1234", email: "maria@email.com", totalOrders: 12, isVip: false, createdAt: new Date() },
  { id: "2", name: "Carlos Hernández", phone: "+503 7890-5678", email: "carlos@email.com", totalOrders: 8, isVip: false, createdAt: new Date() },
  { id: "3", name: "Ana Martínez", phone: "+503 7890-9012", email: "ana@email.com", totalOrders: 25, isVip: true, createdAt: new Date() },
  { id: "4", name: "José López", phone: "+503 7890-3456", email: "jose@email.com", totalOrders: 5, isVip: false, createdAt: new Date() },
  { id: "5", name: "Rosa Pérez", phone: "+503 7890-7890", email: "rosa@email.com", totalOrders: 35, isVip: true, createdAt: new Date() }
];

const mockConversations = [
  { id: "1", customerId: "1", customerName: "María García", customerPhone: "+503 7890-1234", status: "active", lastMessageAt: new Date(), messageCount: 8, aiHandled: true },
  { id: "2", customerId: "2", customerName: "Carlos Hernández", customerPhone: "+503 7890-5678", status: "resolved", lastMessageAt: new Date(Date.now() - 30 * 60000), messageCount: 5, aiHandled: true },
  { id: "3", customerId: "4", customerName: "José López", customerPhone: "+503 7890-3456", status: "escalated", lastMessageAt: new Date(Date.now() - 15 * 60000), messageCount: 12, aiHandled: false },
  { id: "4", customerId: "3", customerName: "Ana Martínez", customerPhone: "+503 7890-9012", status: "resolved", lastMessageAt: new Date(Date.now() - 60 * 60000), messageCount: 3, aiHandled: true },
  { id: "5", customerId: "5", customerName: "Rosa Pérez", customerPhone: "+503 7890-7890", status: "active", lastMessageAt: new Date(Date.now() - 5 * 60000), messageCount: 6, aiHandled: true }
];

const mockOrders = [
  { id: "ORD001", customerId: "1", customerName: "María García", customerPhone: "+503 7890-1234", locationName: "San Miguel - Casa Matriz", status: "pending", totalAmount: 11.00, hasDelivery: true, createdAt: new Date() },
  { id: "ORD002", customerId: "2", customerName: "Carlos Hernández", customerPhone: "+503 7890-5678", locationName: "Santa Ana", status: "processing", totalAmount: 6.50, hasDelivery: false, createdAt: new Date(Date.now() - 30 * 60000) },
  { id: "ORD003", customerId: "3", customerName: "Ana Martínez", customerPhone: "+503 7890-9012", locationName: "Lourdes Colón", status: "ready", totalAmount: 16.90, hasDelivery: true, createdAt: new Date(Date.now() - 60 * 60000) },
  { id: "ORD004", customerId: "5", customerName: "Rosa Pérez", customerPhone: "+503 7890-7890", locationName: "San Miguel - Casa Matriz", status: "delivered", totalAmount: 8.50, hasDelivery: false, createdAt: new Date(Date.now() - 120 * 60000) }
];

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "demo mode",
    environment: process.env.NODE_ENV || "development"
  });
});

// WhatsApp Webhook - Verification (GET)
app.get("/api/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"] as string;
  const token = req.query["hub.verify_token"] as string;
  const challenge = req.query["hub.challenge"] as string;
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "lavanderia_oriental_verify_2026";

  if (mode === "subscribe" && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// WhatsApp Webhook - Incoming Messages (POST)
app.post("/api/webhook/whatsapp", async (req, res) => {
  try {
    const body = req.body;
    console.log("WhatsApp webhook received:", JSON.stringify(body));
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Dashboard Stats
app.get("/api/dashboard/stats", async (req, res) => {
  res.json({
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
});

// Dashboard Messages (recent chat preview)
app.get("/api/dashboard/messages", async (req, res) => {
  res.json([
    { id: "1", content: "Hola, cuánto cuesta lavar una carga normal?", sender: "inbound", timestamp: new Date(), isAI: false },
    { id: "2", content: "¡Hola! El precio de una carga normal es $3 solo lavado o $5.50 lavado + secado. ¿En qué sucursal te queda más cerca?", sender: "outbound", timestamp: new Date(), isAI: true },
    { id: "3", content: "San Miguel", sender: "inbound", timestamp: new Date(), isAI: false },
    { id: "4", content: "¡Perfecto! En San Miguel tenemos dos sucursales: Casa Matriz en Col. Ciudad Real y Col. Gavidia. Ambas abren de 7am-6pm. ¿Te gustaría delivery? Cuesta $2 total.", sender: "outbound", timestamp: new Date(), isAI: true }
  ]);
});

// Dashboard Activities
app.get("/api/dashboard/activities", async (req, res) => {
  res.json([
    { id: "1", type: "resolved", title: "Conversación resuelta", description: "María García - Consulta de precios", timestamp: new Date(Date.now() - 5 * 60000) },
    { id: "2", type: "message", title: "Nueva conversación", description: "+503 7890-1234", timestamp: new Date(Date.now() - 15 * 60000) },
    { id: "3", type: "newCustomer", title: "Nuevo cliente", description: "Carlos Hernández", timestamp: new Date(Date.now() - 30 * 60000) },
    { id: "4", type: "escalated", title: "Escalación creada", description: "José López - Reclamo", timestamp: new Date(Date.now() - 45 * 60000) },
    { id: "5", type: "resolved", title: "Conversación resuelta", description: "Ana Martínez - Horarios", timestamp: new Date(Date.now() - 60 * 60000) }
  ]);
});

// Dashboard Escalations
app.get("/api/dashboard/escalations", async (req, res) => {
  res.json([
    { id: "1", customerName: "José López", customerPhone: "+503 7890-3456", reason: "Reclamo por ropa dañada", priority: "high", waitTime: 5, timestamp: new Date() },
    { id: "2", customerName: "Miguel Torres", customerPhone: "+503 7890-7890", reason: "Pedido retrasado", priority: "medium", waitTime: 15, timestamp: new Date() }
  ]);
});

// Locations
app.get("/api/locations", async (req, res) => {
  res.json(mockLocations);
});

// Services
app.get("/api/services", async (req, res) => {
  res.json(mockServices);
});

// Customers
app.get("/api/customers", async (req, res) => {
  res.json(mockCustomers);
});

// Conversations
app.get("/api/conversations", async (req, res) => {
  res.json(mockConversations);
});

// Messages by conversation
app.get("/api/conversations/:id/messages", async (req, res) => {
  res.json([
    { id: "1", content: "Hola, cuánto cuesta lavar?", direction: "inbound", createdAt: new Date() },
    { id: "2", content: "¡Hola! Nuestros precios son: Carga Normal $3 lavado / $5.50 lavado+secado", direction: "outbound", createdAt: new Date() }
  ]);
});

// Orders
app.get("/api/orders", async (req, res) => {
  res.json(mockOrders);
});

// Knowledge Base
app.get("/api/knowledge-base", async (req, res) => {
  res.json([
    { id: "1", category: "precios", question: "¿Cuánto cuesta lavar?", answer: "Carga Normal: $3 lavado, $5.50 lavado+secado. Carga Pesada: $3.50 lavado, $6.50 lavado+secado." },
    { id: "2", category: "horarios", question: "¿Cuáles son los horarios?", answer: "Lunes a Sábado 7am-6pm, Domingo 7am-5pm" },
    { id: "3", category: "delivery", question: "¿Tienen delivery?", answer: "Sí, el servicio de delivery cuesta $2 (recogida + entrega). Disponible en San Miguel, Lourdes Colón y Santa Ana." }
  ]);
});

// Analytics Summary
app.get("/api/analytics/summary", async (req, res) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  res.json({
    period: {
      start: weekAgo.toISOString(),
      end: now.toISOString()
    },
    conversations: {
      total: 1247,
      resolved: 1189,
      escalated: 58,
      aiResolutionRate: 94.2
    },
    messages: {
      total: 8934,
      inbound: 4567,
      outbound: 4367,
      avgPerConversation: 7.2
    },
    orders: {
      total: 423,
      completed: 398,
      cancelled: 12,
      pending: 13,
      totalRevenue: 2847.50
    },
    customers: {
      total: 856,
      new: 47,
      returning: 809,
      vip: 23
    },
    performance: {
      avgResponseTime: "2.3s",
      customerSatisfaction: 96,
      peakHours: ["10:00", "14:00", "17:00"]
    },
    topServices: [
      { name: "Carga Normal - Lavado + Secado", count: 187, revenue: 1028.50 },
      { name: "DRIP Básico", count: 89, revenue: 881.10 },
      { name: "Carga Pesada - Lavado + Secado", count: 67, revenue: 435.50 },
      { name: "DRIP Especial", count: 45, revenue: 580.50 },
      { name: "Delivery", count: 156, revenue: 312.00 }
    ],
    locationPerformance: [
      { name: "San Miguel - Casa Matriz", orders: 156, revenue: 1023.50 },
      { name: "Lourdes Colón", orders: 98, revenue: 687.30 },
      { name: "Santa Ana", orders: 87, revenue: 598.20 },
      { name: "San Miguel - Col. Gavidia", orders: 52, revenue: 345.00 },
      { name: "Usulután", orders: 30, revenue: 193.50 }
    ]
  });
});

// Daily reports
app.get("/api/analytics/daily", async (req, res) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    days.push({
      date: date.toISOString().split('T')[0],
      conversations: Math.floor(Math.random() * 50) + 150,
      messages: Math.floor(Math.random() * 200) + 800,
      orders: Math.floor(Math.random() * 20) + 50,
      revenue: Math.floor(Math.random() * 200) + 300,
      newCustomers: Math.floor(Math.random() * 10) + 5
    });
  }
  res.json(days);
});

// Export for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // @ts-ignore - Express handles the request/response
  return app(req, res);
}
