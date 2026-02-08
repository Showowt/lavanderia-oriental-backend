import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb, date, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  isHeadquarters: boolean("is_headquarters").default(false),
  status: varchar("status", { length: 20 }).default("active"),
  deliveryAvailable: boolean("delivery_available").default(false),
  deliveryZone: text("delivery_zone"),
  hours: jsonb("hours"),
  hoursMonday: varchar("hours_monday", { length: 20 }),
  hoursTuesday: varchar("hours_tuesday", { length: 20 }),
  hoursWednesday: varchar("hours_wednesday", { length: 20 }),
  hoursThursday: varchar("hours_thursday", { length: 20 }),
  hoursFriday: varchar("hours_friday", { length: 20 }),
  hoursSaturday: varchar("hours_saturday", { length: 20 }),
  hoursSunday: varchar("hours_sunday", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("4.5"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export const serviceCategories = pgTable("service_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 50 }),
  description: text("description"),
  icon: varchar("icon", { length: 10 }),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({ id: true, createdAt: true });
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }),
  preferredLocationId: varchar("preferred_location_id"),
  language: varchar("language", { length: 10 }).default("es"),
  totalOrders: integer("total_orders").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  lastOrderAt: timestamp("last_order_at"),
  notes: text("notes"),
  isVip: boolean("is_vip").default(false),
  isBlocked: boolean("is_blocked").default(false),
  lastContact: timestamp("last_contact"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  locationId: varchar("location_id"),
  status: varchar("status", { length: 20 }).default("active"),
  channel: varchar("channel", { length: 20 }).default("whatsapp"),
  assignedAgent: varchar("assigned_agent", { length: 100 }),
  escalationReason: text("escalation_reason"),
  resolutionNotes: text("resolution_notes"),
  messageCount: integer("message_count").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  endedAt: timestamp("ended_at"),
  escalatedTo: varchar("escalated_to", { length: 100 }),
  summary: text("summary"),
  aiHandled: boolean("ai_handled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(),
  direction: varchar("direction", { length: 10 }).notNull(),
  content: text("content").notNull(),
  messageType: varchar("message_type", { length: 20 }).default("text"),
  waMessageId: varchar("wa_message_id", { length: 100 }),
  aiGenerated: boolean("ai_generated").default(false),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number", { length: 20 }),
  customerId: varchar("customer_id").notNull(),
  locationId: varchar("location_id"),
  status: varchar("status", { length: 30 }).default("pending"),
  itemsDescription: text("items_description"),
  itemsJson: jsonb("items_json"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).default("0"),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  paymentMethod: varchar("payment_method", { length: 20 }),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  isDelivery: boolean("is_delivery").default(false),
  deliveryAddress: text("delivery_address"),
  pickupScheduledAt: timestamp("pickup_scheduled_at"),
  estimatedReady: timestamp("estimated_ready"),
  actualReady: timestamp("actual_ready"),
  deliveredAt: timestamp("delivered_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id"),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }),
  nameEn: varchar("name_en", { length: 100 }),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  priceLavado: decimal("price_lavado", { precision: 10, scale: 2 }).default("0"),
  priceLavadoSecado: decimal("price_lavado_secado", { precision: 10, scale: 2 }).default("0"),
  priceLavadoPlanchado: decimal("price_lavado_planchado", { precision: 10, scale: 2 }).default("0"),
  priceSecado: decimal("price_secado", { precision: 10, scale: 2 }).default("0"),
  pricePlanchado: decimal("price_planchado", { precision: 10, scale: 2 }).default("0"),
  priceOtros: decimal("price_otros", { precision: 10, scale: 2 }).default("0"),
  unit: varchar("unit", { length: 30 }),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const knowledgeBase = pgTable("knowledge_base", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  keywords: text("keywords").array(),
  category: varchar("category", { length: 50 }),
  language: varchar("language", { length: 10 }).default("es"),
  priority: integer("priority").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;
export type KnowledgeBase = typeof knowledgeBase.$inferSelect;

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id"),
  orderId: varchar("order_id"),
  type: varchar("type", { length: 30 }).notNull(),
  title: varchar("title", { length: 200 }),
  message: text("message"),
  channel: varchar("channel", { length: 20 }).default("whatsapp"),
  status: varchar("status", { length: 20 }).default("pending"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export const dailyReports = pgTable("daily_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  locationId: varchar("location_id"),
  reportDate: date("report_date").notNull(),
  totalConversations: integer("total_conversations").default(0),
  aiResolved: integer("ai_resolved").default(0),
  humanResolved: integer("human_resolved").default(0),
  escalations: integer("escalations").default(0),
  newCustomers: integer("new_customers").default(0),
  totalOrders: integer("total_orders").default(0),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0"),
  avgResponseTimeSeconds: integer("avg_response_time_seconds"),
  customerSatisfaction: decimal("customer_satisfaction", { precision: 3, scale: 2 }),
  aiResolutionRate: decimal("ai_resolution_rate", { precision: 5, scale: 2 }),
  summary: text("summary"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDailyReportSchema = createInsertSchema(dailyReports).omit({ id: true, createdAt: true });
export type InsertDailyReport = z.infer<typeof insertDailyReportSchema>;
export type DailyReport = typeof dailyReports.$inferSelect;

export const escalations = pgTable("escalations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id"),
  customerId: varchar("customer_id"),
  priority: varchar("priority", { length: 10 }).default("medium"),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  assignedTo: varchar("assigned_to", { length: 100 }),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEscalationSchema = createInsertSchema(escalations).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEscalation = z.infer<typeof insertEscalationSchema>;
export type Escalation = typeof escalations.$inferSelect;

export const systemConfig = pgTable("system_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSystemConfigSchema = createInsertSchema(systemConfig).omit({ id: true, updatedAt: true });
export type InsertSystemConfig = z.infer<typeof insertSystemConfigSchema>;
export type SystemConfig = typeof systemConfig.$inferSelect;

export interface DashboardStats {
  totalConversations: number;
  activeConversations: number;
  resolvedToday: number;
  escalations: number;
  aiResolutionRate: number;
  avgResponseTime: string;
  messagesProcessed: number;
  customerSatisfaction: number;
}

export interface ActivityItem {
  id: string;
  type: 'message' | 'escalation' | 'resolved' | 'order';
  customerName: string;
  customerPhone: string;
  content: string;
  timestamp: Date;
  locationName?: string;
}

export interface ChatMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: Date;
  aiGenerated?: boolean;
}

export interface EscalationItem {
  id: string;
  customerName: string;
  customerPhone: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  conversationId: string;
  locationName?: string;
}

export interface PerformanceMetrics {
  firstContactResolution: {
    percentage: number;
    total: number;
    resolved: number;
  };
  averageRating: {
    score: number;
    maxScore: number;
    totalReviews: number;
  };
  averageResponseTime: {
    seconds: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  costSavings: {
    amount: number;
    currency: string;
    period: 'day' | 'week' | 'month';
    calculation: string;
  };
}
