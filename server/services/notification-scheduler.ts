import { db } from "../db";
import { notifications, orders, customers } from "@shared/schema";
import { eq, and, lte } from "drizzle-orm";
import { sendWhatsAppMessage } from "./whatsapp";

export interface NotificationScheduleRequest {
  customerId: string;
  orderId?: string;
  type: "ready_pickup" | "reminder" | "promo" | "status_update";
  scheduledFor: Date;
  message?: string;
}

export async function scheduleNotification(request: NotificationScheduleRequest): Promise<string> {
  const [notification] = await db.insert(notifications).values({
    customerId: request.customerId,
    orderId: request.orderId,
    type: request.type,
    scheduledFor: request.scheduledFor,
    status: "pending",
  }).returning();

  return notification.id;
}

export async function processScheduledNotifications(): Promise<number> {
  const now = new Date();
  
  const pendingNotifications = await db.query.notifications.findMany({
    where: and(
      eq(notifications.status, "pending"),
      lte(notifications.scheduledFor, now)
    ),
  });

  let processedCount = 0;

  for (const notification of pendingNotifications) {
    try {
      if (!notification.customerId) continue;
      
      const customer = await db.query.customers.findFirst({
        where: eq(customers.phone, notification.customerId),
      });

      if (!customer) {
        const customerById = await db.query.customers.findFirst({
          where: eq(customers.id, notification.customerId),
        });
        if (!customerById) continue;
        await processNotification(notification, customerById);
      } else {
        await processNotification(notification, customer);
      }

      processedCount++;
    } catch (error) {
      console.error(`Failed to process notification ${notification.id}:`, error);
      await db.update(notifications)
        .set({ status: "failed" })
        .where(eq(notifications.id, notification.id));
    }
  }

  return processedCount;
}

async function processNotification(notification: any, customer: any): Promise<void> {
  let message = "";
  
  switch (notification.type) {
    case "ready_pickup":
      if (notification.orderId) {
        message = customer.language === "en"
          ? `Hi ${customer.name}! Your laundry order is ready for pickup. 🧺✨`
          : `¡Hola ${customer.name}! Tu pedido de lavandería está listo para recoger. 🧺✨`;
      }
      break;
    
    case "reminder":
      message = customer.language === "en"
        ? `Hi ${customer.name}! Just a friendly reminder about your laundry at Lavandería Oriental. 📍`
        : `¡Hola ${customer.name}! Un recordatorio amigable sobre tu ropa en Lavandería Oriental. 📍`;
      break;
    
    case "promo":
      message = customer.language === "en"
        ? `Special offer from Lavandería Oriental! 20% off on your next order. Valid this week only! 🎉`
        : `¡Oferta especial de Lavandería Oriental! 20% de descuento en tu próximo pedido. ¡Válido solo esta semana! 🎉`;
      break;
    
    case "status_update":
      message = customer.language === "en"
        ? `Your order status has been updated. Check with your local branch for details.`
        : `El estado de tu pedido ha sido actualizado. Consulta con tu sucursal local para más detalles.`;
      break;
  }

  if (message) {
    await sendWhatsAppMessage(customer.phone, message);
  }

  await db.update(notifications)
    .set({ 
      status: "sent",
      sentAt: new Date(),
    })
    .where(eq(notifications.id, notification.id));
}

export async function cancelNotification(notificationId: string): Promise<boolean> {
  await db.update(notifications)
    .set({ status: "cancelled" })
    .where(and(
      eq(notifications.id, notificationId),
      eq(notifications.status, "pending")
    ));
  
  return true;
}

export async function scheduleOrderReadyNotification(orderId: string, customerId: string, readyTime?: Date): Promise<string> {
  const scheduledTime = readyTime || new Date(Date.now() + 30 * 60 * 1000);
  
  return scheduleNotification({
    customerId,
    orderId,
    type: "ready_pickup",
    scheduledFor: scheduledTime,
  });
}

let schedulerInterval: NodeJS.Timeout | null = null;

export function startNotificationScheduler(intervalMs: number = 60000): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }
  
  schedulerInterval = setInterval(async () => {
    try {
      const processed = await processScheduledNotifications();
      if (processed > 0) {
        console.log(`Processed ${processed} scheduled notifications`);
      }
    } catch (error) {
      console.error("Notification scheduler error:", error);
    }
  }, intervalMs);
  
  console.log("Notification scheduler started");
}

export function stopNotificationScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("Notification scheduler stopped");
  }
}
