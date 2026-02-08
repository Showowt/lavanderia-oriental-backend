import { randomUUID } from "crypto";
import type { 
  User, InsertUser, 
  Location, InsertLocation,
  Customer, InsertCustomer,
  Conversation, InsertConversation,
  Message, InsertMessage,
  Order, InsertOrder,
  DashboardStats, 
  ChatMessage, 
  ActivityItem, 
  EscalationItem 
} from "@shared/schema";

export interface CustomerWithDetails {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  lastOrderDate?: Date | null;
  isVip?: boolean;
}

export interface ConversationWithDetails {
  id: string;
  status: string;
  customerId: string;
  startedAt: Date | null;
  customerName: string;
  customerPhone: string;
  lastMessageAt: Date;
  messageCount: number;
  aiHandled: boolean;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomersWithDetails(): Promise<CustomerWithDetails[]>;
  getConversationsWithDetails(): Promise<ConversationWithDetails[]>;
  
  getDashboardStats(locationId?: string): Promise<DashboardStats>;
  getChatMessages(): Promise<ChatMessage[]>;
  getActivities(): Promise<ActivityItem[]>;
  getEscalations(): Promise<EscalationItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private locations: Map<string, Location>;
  private customers: Map<string, Customer>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.locations = new Map();
    this.customers = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.orders = new Map();
    
    this.seedData();
  }

  private seedData() {
    const locationData: InsertLocation[] = [
      { name: "Sucursal Centro", address: "6a Calle Poniente #123", city: "San Salvador", phone: "+503 2222-1111", whatsapp: "+503 7000-1111", isActive: true },
      { name: "Sucursal Escalón", address: "Paseo General Escalón #456", city: "San Salvador", phone: "+503 2222-2222", whatsapp: "+503 7000-2222", isActive: true },
      { name: "Sucursal Santa Ana", address: "Av. Independencia Sur #789", city: "Santa Ana", phone: "+503 2222-3333", whatsapp: "+503 7000-3333", isActive: true },
      { name: "Sucursal San Miguel", address: "Calle Chaparrastique #101", city: "San Miguel", phone: "+503 2222-4444", whatsapp: "+503 7000-4444", isActive: true },
      { name: "Sucursal Soyapango", address: "Blvd. del Ejército #202", city: "Soyapango", phone: "+503 2222-5555", whatsapp: "+503 7000-5555", isActive: true },
      { name: "Sucursal Antiguo Cuscatlán", address: "Calle La Mascota #303", city: "La Libertad", phone: "+503 2222-6666", whatsapp: "+503 7000-6666", isActive: true },
      { name: "Sucursal Metrocentro", address: "Centro Comercial Metrocentro, Local 45", city: "San Salvador", phone: "+503 2222-7777", whatsapp: "+503 7000-7777", isActive: true },
    ];

    locationData.forEach(loc => {
      const id = randomUUID();
      const now = new Date();
      this.locations.set(id, {
        ...loc,
        id,
        hours: null,
        slug: null,
        email: null,
        notes: null,
        latitude: null,
        longitude: null,
        rating: null,
        reviewCount: null,
        imageUrl: null,
        deliveryAvailable: true,
        deliveryRadius: null,
        deliveryFee: null,
        maxCapacity: null,
        currentLoad: null,
        status: 'active',
        createdAt: now,
        updatedAt: now
      } as Location);
    });

    const customerData = [
      { phone: "+503 7890-1234", name: "María García", language: "es", totalOrders: 12 },
      { phone: "+503 7890-5678", name: "Carlos Hernández", language: "es", totalOrders: 8 },
      { phone: "+503 7890-9012", name: "Ana Martínez", language: "es", totalOrders: 15 },
      { phone: "+503 7890-3456", name: "José López", language: "es", totalOrders: 5 },
      { phone: "+503 7890-7890", name: "Rosa Pérez", language: "es", totalOrders: 20 },
    ];

    customerData.forEach(cust => {
      const id = randomUUID();
      const now = new Date();
      this.customers.set(id, {
        ...cust,
        id,
        email: null,
        notes: null,
        preferredLocationId: null,
        isVip: cust.totalOrders >= 15,
        isBlocked: false,
        totalSpent: String(cust.totalOrders * 6.5),
        avgOrderValue: null,
        loyaltyPoints: cust.totalOrders * 10,
        lastOrderAt: now,
        lastContact: now,
        createdAt: now,
        updatedAt: now
      } as Customer);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomersWithDetails(): Promise<CustomerWithDetails[]> {
    const customers = Array.from(this.customers.values());
    return customers.map((c, idx) => ({
      id: c.id,
      name: c.name || "Unknown",
      phone: c.phone,
      email: `${(c.name || "user").toLowerCase().replace(/\s+/g, ".")}@email.com`,
      totalOrders: c.totalOrders || 0,
      lastOrderDate: c.lastContact,
      isVip: (c.totalOrders || 0) >= 15,
    }));
  }

  async getConversationsWithDetails(): Promise<ConversationWithDetails[]> {
    const customers = Array.from(this.customers.values());
    const now = new Date();
    
    return customers.map((c, idx) => ({
      id: `conv-${idx + 1}`,
      status: idx === 0 ? "active" : idx === 1 ? "escalated" : "resolved",
      customerId: c.id,
      startedAt: new Date(now.getTime() - (idx * 3600000)),
      customerName: c.name || "Unknown",
      customerPhone: c.phone,
      lastMessageAt: new Date(now.getTime() - (idx * 10 * 60000)),
      messageCount: Math.floor(Math.random() * 15) + 3,
      aiHandled: idx !== 1,
    }));
  }

  async getDashboardStats(locationId?: string): Promise<DashboardStats> {
    return {
      totalConversations: 147,
      activeConversations: 12,
      resolvedToday: 89,
      escalations: 3,
      aiResolutionRate: 94,
      avgResponseTime: "2.3s",
      messagesProcessed: 1247,
      customerSatisfaction: 96
    };
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    const now = new Date();
    return [
      {
        id: "msg-1",
        direction: "inbound",
        content: "Hola, buenos días. Quisiera saber el precio del lavado por libra.",
        timestamp: new Date(now.getTime() - 15 * 60000),
        aiGenerated: false
      },
      {
        id: "msg-2",
        direction: "outbound",
        content: "¡Buenos días! Gracias por comunicarse con Lavandería Oriental. El precio del lavado por libra es de $0.75. Este servicio incluye lavado, secado y doblado. ¿Hay algo más en lo que pueda ayudarle?",
        timestamp: new Date(now.getTime() - 14 * 60000),
        aiGenerated: true
      },
      {
        id: "msg-3",
        direction: "inbound",
        content: "¿Tienen servicio de planchado también?",
        timestamp: new Date(now.getTime() - 10 * 60000),
        aiGenerated: false
      },
      {
        id: "msg-4",
        direction: "outbound",
        content: "¡Sí! Ofrecemos servicio de planchado a $0.50 por pieza. También tenemos paquetes especiales que incluyen lavado y planchado. ¿Le gustaría conocer más detalles?",
        timestamp: new Date(now.getTime() - 9 * 60000),
        aiGenerated: true
      },
      {
        id: "msg-5",
        direction: "inbound",
        content: "Perfecto. ¿Cuál es la sucursal más cercana a la Escalón?",
        timestamp: new Date(now.getTime() - 5 * 60000),
        aiGenerated: false
      },
      {
        id: "msg-6",
        direction: "outbound",
        content: "La sucursal más cercana es nuestra Sucursal Escalón, ubicada en Paseo General Escalón #456. Estamos abiertos de lunes a sábado de 7:00 AM a 7:00 PM. ¿Desea que le envíe la ubicación en Google Maps?",
        timestamp: new Date(now.getTime() - 4 * 60000),
        aiGenerated: true
      }
    ];
  }

  async getActivities(): Promise<ActivityItem[]> {
    const now = new Date();
    return [
      {
        id: "act-1",
        type: "message",
        customerName: "María García",
        customerPhone: "+503 7890-1234",
        content: "New conversation started about pricing",
        timestamp: new Date(now.getTime() - 2 * 60000),
        locationName: "Sucursal Escalón"
      },
      {
        id: "act-2",
        type: "resolved",
        customerName: "Carlos Hernández",
        customerPhone: "+503 7890-5678",
        content: "Order status inquiry resolved by AI",
        timestamp: new Date(now.getTime() - 8 * 60000),
        locationName: "Sucursal Centro"
      },
      {
        id: "act-3",
        type: "order",
        customerName: "Ana Martínez",
        customerPhone: "+503 7890-9012",
        content: "New pickup request scheduled for tomorrow",
        timestamp: new Date(now.getTime() - 15 * 60000),
        locationName: "Sucursal Santa Ana"
      },
      {
        id: "act-4",
        type: "escalation",
        customerName: "José López",
        customerPhone: "+503 7890-3456",
        content: "Customer complaint about damaged item",
        timestamp: new Date(now.getTime() - 25 * 60000),
        locationName: "Sucursal Metrocentro"
      },
      {
        id: "act-5",
        type: "message",
        customerName: "Rosa Pérez",
        customerPhone: "+503 7890-7890",
        content: "Inquiry about express service",
        timestamp: new Date(now.getTime() - 35 * 60000),
        locationName: "Sucursal Soyapango"
      },
      {
        id: "act-6",
        type: "resolved",
        customerName: "Luis Ramírez",
        customerPhone: "+503 7890-1111",
        content: "Location hours question answered",
        timestamp: new Date(now.getTime() - 45 * 60000),
        locationName: "Sucursal Centro"
      },
      {
        id: "act-7",
        type: "order",
        customerName: "Carmen Flores",
        customerPhone: "+503 7890-2222",
        content: "Delivery completed successfully",
        timestamp: new Date(now.getTime() - 55 * 60000),
        locationName: "Sucursal Antiguo Cuscatlán"
      },
      {
        id: "act-8",
        type: "message",
        customerName: "Pedro Sánchez",
        customerPhone: "+503 7890-3333",
        content: "Price inquiry for dry cleaning",
        timestamp: new Date(now.getTime() - 65 * 60000),
        locationName: "Sucursal San Miguel"
      }
    ];
  }

  async getEscalations(): Promise<EscalationItem[]> {
    const now = new Date();
    return [
      {
        id: "esc-1",
        customerName: "José López",
        customerPhone: "+503 7890-3456",
        reason: "Customer reports damaged silk blouse after dry cleaning. Requesting compensation.",
        priority: "high",
        timestamp: new Date(now.getTime() - 25 * 60000),
        conversationId: "conv-1",
        locationName: "Sucursal Metrocentro"
      },
      {
        id: "esc-2",
        customerName: "Miguel Torres",
        customerPhone: "+503 7890-4444",
        reason: "Dispute about pricing. Customer claims different rate was quoted.",
        priority: "medium",
        timestamp: new Date(now.getTime() - 45 * 60000),
        conversationId: "conv-2",
        locationName: "Sucursal Centro"
      },
      {
        id: "esc-3",
        customerName: "Elena Vásquez",
        customerPhone: "+503 7890-5555",
        reason: "Customer requested to speak with manager about delayed order.",
        priority: "low",
        timestamp: new Date(now.getTime() - 90 * 60000),
        conversationId: "conv-3",
        locationName: "Sucursal Escalón"
      }
    ];
  }
}

export const storage = new MemStorage();
