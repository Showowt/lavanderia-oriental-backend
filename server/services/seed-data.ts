import { db } from "../db";
import { locations, services, knowledgeBase, customers, conversations, messages, orders, notifications, dailyReports } from "@shared/schema";
import { count } from "drizzle-orm";

export async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    const [existingCount] = await db.select({ count: count() }).from(locations);
    if (existingCount && existingCount.count > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }
  } catch (e) {
    console.log("Could not check existing data, proceeding with seed...");
  }

  const locationData = [
    { name: "Sucursal San Miguel", address: "Col. Ciudad Real C. Elizabeth Lote #2", city: "San Miguel", phone: "+503 2222-1111", whatsapp: "+503 7000-1111", isActive: true, hours: { mon: "7:00-19:00", tue: "7:00-19:00", wed: "7:00-19:00", thu: "7:00-19:00", fri: "7:00-19:00", sat: "7:00-17:00", sun: "Cerrado" } },
    { name: "Sucursal Usulután", address: "Calle Dr. Federico Penado, Parada los Pinos", city: "Usulután", phone: "+503 2222-2222", whatsapp: "+503 7000-2222", isActive: true, hours: { mon: "7:00-19:00", tue: "7:00-19:00", wed: "7:00-19:00", thu: "7:00-19:00", fri: "7:00-19:00", sat: "7:00-17:00", sun: "Cerrado" } },
    { name: "Sucursal Lourdes Colón", address: "7a. Calle Oriente atrás de Metrocentro", city: "Lourdes Colón", phone: "+503 2222-3333", whatsapp: "+503 7000-3333", isActive: true, hours: { mon: "7:00-19:00", tue: "7:00-19:00", wed: "7:00-19:00", thu: "7:00-19:00", fri: "7:00-19:00", sat: "7:00-17:00", sun: "Cerrado" } },
    { name: "Sucursal Santa Ana", address: "25a calle pte Plaza Lily antes de PNC", city: "Santa Ana", phone: "+503 2222-4444", whatsapp: "+503 7000-4444", isActive: true, hours: { mon: "7:00-19:00", tue: "7:00-19:00", wed: "7:00-19:00", thu: "7:00-19:00", fri: "7:00-19:00", sat: "7:00-17:00", sun: "Cerrado" } },
    { name: "Sucursal La Unión", address: "Próximamente", city: "La Unión", phone: "+503 2222-5555", whatsapp: "+503 7000-5555", isActive: false, hours: {} },
    { name: "Sucursal Centro San Salvador", address: "6a Calle Poniente #123, Centro Histórico", city: "San Salvador", phone: "+503 2222-6666", whatsapp: "+503 7000-6666", isActive: true, hours: { mon: "7:00-19:00", tue: "7:00-19:00", wed: "7:00-19:00", thu: "7:00-19:00", fri: "7:00-19:00", sat: "7:00-17:00", sun: "Cerrado" } },
    { name: "Sucursal Escalón", address: "Paseo General Escalón #456, Zona Rosa", city: "San Salvador", phone: "+503 2222-7777", whatsapp: "+503 7000-7777", isActive: true, hours: { mon: "7:00-20:00", tue: "7:00-20:00", wed: "7:00-20:00", thu: "7:00-20:00", fri: "7:00-20:00", sat: "8:00-18:00", sun: "9:00-14:00" } },
    { name: "Sucursal Soyapango", address: "Blvd. del Ejército #202, Centro Comercial Plaza Soyapango", city: "Soyapango", phone: "+503 2222-8888", whatsapp: "+503 7000-8888", isActive: true, hours: { mon: "7:00-19:00", tue: "7:00-19:00", wed: "7:00-19:00", thu: "7:00-19:00", fri: "7:00-19:00", sat: "7:00-17:00", sun: "Cerrado" } },
    { name: "Sucursal Antiguo Cuscatlán", address: "Calle La Mascota #303, Colonia Escalón", city: "La Libertad", phone: "+503 2222-9999", whatsapp: "+503 7000-9999", isActive: true, hours: { mon: "7:00-20:00", tue: "7:00-20:00", wed: "7:00-20:00", thu: "7:00-20:00", fri: "7:00-20:00", sat: "8:00-18:00", sun: "9:00-14:00" } },
    { name: "Sucursal Metrocentro", address: "Centro Comercial Metrocentro, Local 45, Nivel 2", city: "San Salvador", phone: "+503 2222-0000", whatsapp: "+503 7000-0000", isActive: true, hours: { mon: "9:00-21:00", tue: "9:00-21:00", wed: "9:00-21:00", thu: "9:00-21:00", fri: "9:00-21:00", sat: "9:00-21:00", sun: "10:00-19:00" } },
  ];

  console.log("Seeding locations...");
  await db.insert(locations).values(locationData);

  const serviceData = [
    { name: "Lavado por Libra", nameEn: "Wash by Pound", price: "3.25", unit: "lb", description: "Lavado, secado y doblado incluido", isActive: true },
    { name: "Secado", nameEn: "Drying", price: "1.00", unit: "10 min", description: "Uso de secadora por 10 minutos", isActive: true },
    { name: "Edredones (pequeño)", nameEn: "Comforters (small)", price: "6.50", unit: "pieza", description: "Lavado y secado de edredones pequeños", isActive: true },
    { name: "Edredones (grande)", nameEn: "Comforters (large)", price: "8.00", unit: "pieza", description: "Lavado y secado de edredones grandes", isActive: true },
    { name: "Planchado", nameEn: "Ironing", price: "1.50", unit: "pieza", description: "Servicio de planchado profesional", isActive: true },
    { name: "Tratamientos Especiales", nameEn: "Special Treatments", price: "5.00", unit: "variable", description: "Manchas difíciles, blanqueado, etc.", isActive: true },
    { name: "Delivery", nameEn: "Delivery Service", price: "2.00", unit: "viaje", description: "Recogida y entrega a domicilio", isActive: true },
    { name: "Lavado en Seco", nameEn: "Dry Cleaning", price: "4.50", unit: "pieza", description: "Limpieza en seco para prendas delicadas", isActive: true },
    { name: "Almidón y Planchado", nameEn: "Starch and Iron", price: "2.00", unit: "pieza", description: "Servicio de almidonado y planchado", isActive: true },
    { name: "Express (mismo día)", nameEn: "Express (same day)", price: "5.00", unit: "lb", description: "Servicio express entrega mismo día", isActive: true },
  ];

  console.log("Seeding services...");
  await db.insert(services).values(serviceData);

  const faqData = [
    { question: "¿Cuál es el precio del lavado por libra?", answer: "El precio del lavado por libra es de $3.25. Este servicio incluye lavado, secado y doblado de su ropa.", keywords: ["precio", "libra", "costo", "lavado"], category: "precios", language: "es", isActive: true },
    { question: "¿Tienen servicio de delivery?", answer: "Sí, ofrecemos servicio de delivery (recogida y entrega a domicilio) por $2.00 por viaje. Puede coordinar la recogida llamando a su sucursal más cercana.", keywords: ["delivery", "domicilio", "entrega", "recogida"], category: "servicios", language: "es", isActive: true },
    { question: "¿Cuál es el horario de atención?", answer: "Nuestras sucursales generalmente atienden de lunes a viernes de 7:00 AM a 7:00 PM, y sábados de 7:00 AM a 5:00 PM. Algunas sucursales como Metrocentro tienen horario extendido. Le recomiendo consultar el horario específico de la sucursal de su interés.", keywords: ["horario", "hora", "abierto", "atención"], category: "horarios", language: "es", isActive: true },
    { question: "¿Cuánto tiempo tardan en tener lista mi ropa?", answer: "El tiempo estándar de entrega es de 24-48 horas. También ofrecemos servicio express con entrega el mismo día por $5.00/lb adicional.", keywords: ["tiempo", "demora", "lista", "entrega"], category: "servicios", language: "es", isActive: true },
    { question: "¿Aceptan edredones y cobijas?", answer: "Sí, lavamos edredones pequeños por $6.50 y grandes por $8.00 cada uno. También aceptamos cobijas, almohadas y otros artículos de cama.", keywords: ["edredones", "cobijas", "cama", "almohadas"], category: "servicios", language: "es", isActive: true },
    { question: "What are your prices?", answer: "Our wash by pound service costs $3.25/lb which includes washing, drying, and folding. We also offer ironing at $1.50/piece and delivery at $2.00/trip.", keywords: ["price", "cost", "prices", "rates"], category: "pricing", language: "en", isActive: true },
    { question: "Where are you located?", answer: "We have 10 locations across El Salvador including San Miguel, Usulután, Santa Ana, San Salvador (multiple locations), Soyapango, and more. Would you like the address of a specific location?", keywords: ["location", "address", "where", "branch"], category: "locations", language: "en", isActive: true },
    { question: "¿Tienen servicio de planchado?", answer: "Sí, ofrecemos servicio de planchado a $1.50 por pieza. También tenemos servicio de almidonado y planchado por $2.00 por pieza.", keywords: ["planchado", "planchar", "arrugas"], category: "servicios", language: "es", isActive: true },
    { question: "¿Cómo puedo saber el estado de mi pedido?", answer: "Puede consultar el estado de su pedido proporcionándome su número de teléfono o número de orden. Le informaré si su ropa está en proceso de lavado, lista para recoger, o cualquier otro estado.", keywords: ["estado", "pedido", "orden", "tracking"], category: "servicios", language: "es", isActive: true },
    { question: "¿Qué sucursales tienen?", answer: "Contamos con 10 sucursales: San Miguel, Usulután, Lourdes Colón, Santa Ana, La Unión (próximamente), Centro San Salvador, Escalón, Soyapango, Antiguo Cuscatlán y Metrocentro.", keywords: ["sucursales", "ubicaciones", "locales"], category: "ubicaciones", language: "es", isActive: true },
  ];

  console.log("Seeding knowledge base...");
  await db.insert(knowledgeBase).values(faqData);

  const customerData = [
    { phone: "+503 7890-1234", name: "María García", email: "maria.garcia@email.com", language: "es", totalOrders: 15, isVip: true, lastContact: new Date() },
    { phone: "+503 7890-5678", name: "Carlos Hernández", email: "carlos.h@email.com", language: "es", totalOrders: 8, isVip: false, lastContact: new Date(Date.now() - 86400000) },
    { phone: "+503 7890-9012", name: "Ana Martínez", email: "ana.martinez@email.com", language: "es", totalOrders: 22, isVip: true, lastContact: new Date(Date.now() - 172800000) },
    { phone: "+503 7890-3456", name: "José López", email: "jose.lopez@email.com", language: "es", totalOrders: 5, isVip: false, lastContact: new Date(Date.now() - 259200000) },
    { phone: "+503 7890-7890", name: "Rosa Pérez", email: "rosa.perez@email.com", language: "es", totalOrders: 30, isVip: true, lastContact: new Date(Date.now() - 43200000) },
    { phone: "+503 7890-1111", name: "Luis Ramírez", email: "luis.ramirez@email.com", language: "es", totalOrders: 12, isVip: false, lastContact: new Date(Date.now() - 345600000) },
    { phone: "+503 7890-2222", name: "Carmen Flores", email: "carmen.flores@email.com", language: "es", totalOrders: 18, isVip: true, lastContact: new Date(Date.now() - 432000000) },
    { phone: "+503 7890-3333", name: "Pedro Sánchez", email: "pedro.sanchez@email.com", language: "en", totalOrders: 6, isVip: false, lastContact: new Date(Date.now() - 518400000) },
  ];

  console.log("Seeding customers...");
  const insertedCustomers = await db.insert(customers).values(customerData).returning();

  console.log("Database seeding completed successfully!");
  return { success: true };
}
