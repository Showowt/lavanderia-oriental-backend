// Vercel Serverless Entry Point - Self-contained API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Express } from 'express';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ============================================
// MOCK DATA
// ============================================

const mockLocations = [
  {
    id: "1",
    name: "San Miguel - Casa Matriz",
    slug: "san-miguel-casa-matriz",
    address: "Col. Ciudad Real Calle Elizabeth #45",
    city: "San Miguel",
    phone: "+503 2661-1234",
    whatsapp: "+503 7947-5950",
    isHeadquarters: true,
    isActive: true,
    deliveryAvailable: true,
    deliveryZone: "Col. Ciudad Real, Col. Medina, Centro de San Miguel, Col. Roosevelt",
    hours: {
      monday: "7:00 - 18:00",
      tuesday: "7:00 - 18:00",
      wednesday: "7:00 - 18:00",
      thursday: "7:00 - 18:00",
      friday: "7:00 - 18:00",
      saturday: "7:00 - 18:00",
      sunday: "7:00 - 17:00"
    },
    rating: 4.8,
    stats: {
      ordersToday: 23,
      ordersWeek: 156,
      ordersMonth: 623,
      revenueToday: 145.50,
      revenueWeek: 987.25,
      revenueMonth: 4156.75,
      conversationsToday: 18,
      avgRating: 4.8,
      totalReviews: 234
    },
    staff: [
      { name: "María López", role: "Gerente", phone: "+503 7890-1111" },
      { name: "Carlos Martínez", role: "Operador", phone: "+503 7890-2222" }
    ],
    notes: "Sucursal principal con mayor flujo de clientes",
    createdAt: new Date(2020, 0, 15)
  },
  {
    id: "2",
    name: "San Miguel - Col. Gavidia",
    slug: "san-miguel-gavidia",
    address: "Col. Gavidia 10 Av Norte #123",
    city: "San Miguel",
    phone: "+503 2661-5678",
    whatsapp: "+503 7947-5951",
    isHeadquarters: false,
    isActive: true,
    deliveryAvailable: true,
    deliveryZone: "Col. Gavidia, Col. Paniagua, Barrio San Felipe",
    hours: {
      monday: "7:00 - 18:00",
      tuesday: "7:00 - 18:00",
      wednesday: "7:00 - 18:00",
      thursday: "7:00 - 18:00",
      friday: "7:00 - 18:00",
      saturday: "7:00 - 18:00",
      sunday: "7:00 - 17:00"
    },
    rating: 4.7,
    stats: {
      ordersToday: 15,
      ordersWeek: 98,
      ordersMonth: 412,
      revenueToday: 89.00,
      revenueWeek: 623.50,
      revenueMonth: 2678.25,
      conversationsToday: 12,
      avgRating: 4.7,
      totalReviews: 156
    },
    staff: [
      { name: "Ana García", role: "Encargada", phone: "+503 7890-3333" }
    ],
    createdAt: new Date(2021, 3, 10)
  },
  {
    id: "3",
    name: "Lourdes Colón",
    slug: "lourdes-colon",
    address: "7 Av Calle Oriente, atrás de Metrocentro",
    city: "Lourdes Colón",
    phone: "+503 2318-1234",
    whatsapp: "+503 7947-5952",
    isHeadquarters: false,
    isActive: true,
    deliveryAvailable: true,
    deliveryZone: "Lourdes Colón centro, Res. Las Palmas, Col. Santa Rosa",
    hours: {
      monday: "7:00 - 18:00",
      tuesday: "7:00 - 18:00",
      wednesday: "7:00 - 18:00",
      thursday: "7:00 - 18:00",
      friday: "7:00 - 18:00",
      saturday: "7:00 - 18:00",
      sunday: "7:00 - 17:00"
    },
    rating: 4.9,
    stats: {
      ordersToday: 18,
      ordersWeek: 124,
      ordersMonth: 498,
      revenueToday: 112.75,
      revenueWeek: 798.50,
      revenueMonth: 3245.00,
      conversationsToday: 14,
      avgRating: 4.9,
      totalReviews: 189
    },
    staff: [
      { name: "Roberto Hernández", role: "Gerente", phone: "+503 7890-4444" },
      { name: "Lucía Pérez", role: "Operadora", phone: "+503 7890-5555" }
    ],
    notes: "Mejor rating de todas las sucursales",
    createdAt: new Date(2022, 6, 20)
  },
  {
    id: "4",
    name: "Usulután",
    slug: "usulutan",
    address: "Calle Dr. Federico Penado, Parada de los Pinos",
    city: "Usulután",
    phone: "+503 2624-1234",
    whatsapp: "+503 7947-5953",
    isHeadquarters: false,
    isActive: true,
    deliveryAvailable: false,
    hours: {
      monday: "7:00 - 18:00",
      tuesday: "7:00 - 18:00",
      wednesday: "7:00 - 18:00",
      thursday: "7:00 - 18:00",
      friday: "7:00 - 18:00",
      saturday: "7:00 - 17:00",
      sunday: "8:00 - 14:00"
    },
    rating: 4.6,
    stats: {
      ordersToday: 8,
      ordersWeek: 52,
      ordersMonth: 208,
      revenueToday: 48.50,
      revenueWeek: 312.25,
      revenueMonth: 1356.00,
      conversationsToday: 6,
      avgRating: 4.6,
      totalReviews: 87
    },
    staff: [
      { name: "Fernando Torres", role: "Encargado", phone: "+503 7890-6666" }
    ],
    createdAt: new Date(2023, 1, 5)
  },
  {
    id: "5",
    name: "Santa Ana",
    slug: "santa-ana",
    address: "25 Calle Pte, Plaza Lily Local #8",
    city: "Santa Ana",
    phone: "+503 2440-1234",
    whatsapp: "+503 7947-5954",
    isHeadquarters: false,
    isActive: true,
    deliveryAvailable: true,
    deliveryZone: "Centro de Santa Ana, Col. El Palmar, Col. Santa Lucía",
    hours: {
      monday: "7:00 - 18:00",
      tuesday: "7:00 - 18:00",
      wednesday: "7:00 - 18:00",
      thursday: "7:00 - 18:00",
      friday: "7:00 - 18:00",
      saturday: "7:00 - 18:00",
      sunday: "7:00 - 17:00"
    },
    rating: 4.8,
    stats: {
      ordersToday: 12,
      ordersWeek: 87,
      ordersMonth: 356,
      revenueToday: 78.25,
      revenueWeek: 567.50,
      revenueMonth: 2312.75,
      conversationsToday: 9,
      avgRating: 4.8,
      totalReviews: 145
    },
    staff: [
      { name: "Sandra Vásquez", role: "Gerente", phone: "+503 7890-7777" }
    ],
    createdAt: new Date(2023, 8, 15)
  }
];

const mockServices = [
  { id: "1", name: "Carga Normal - Lavado", nameEn: "Normal Load - Wash", category: "lavado", price: 3.00, priceLavado: 3.00, priceLavadoSecado: 5.50, unit: "por carga", isActive: true, description: "Hasta 8 libras de ropa", stats: { ordersToday: 12, ordersWeek: 89, ordersMonth: 356, revenueMonth: 1068.00 } },
  { id: "2", name: "Carga Normal - Lavado + Secado", nameEn: "Normal Load - Wash + Dry", category: "lavado", price: 5.50, priceLavado: 3.00, priceLavadoSecado: 5.50, unit: "por carga", isActive: true, description: "Hasta 8 libras de ropa, incluye secado completo", stats: { ordersToday: 28, ordersWeek: 187, ordersMonth: 748, revenueMonth: 4114.00 } },
  { id: "3", name: "Carga Pesada - Lavado", nameEn: "Heavy Load - Wash", category: "lavado", price: 3.50, priceLavado: 3.50, priceLavadoSecado: 6.50, unit: "por carga", isActive: true, description: "8-15 libras de ropa", stats: { ordersToday: 8, ordersWeek: 56, ordersMonth: 224, revenueMonth: 784.00 } },
  { id: "4", name: "Carga Pesada - Lavado + Secado", nameEn: "Heavy Load - Wash + Dry", category: "lavado", price: 6.50, priceLavado: 3.50, priceLavadoSecado: 6.50, unit: "por carga", isActive: true, description: "8-15 libras de ropa, incluye secado completo", stats: { ordersToday: 15, ordersWeek: 98, ordersMonth: 392, revenueMonth: 2548.00 } },
  { id: "5", name: "Edredón 1.20-1.40m", nameEn: "Comforter 1.20-1.40m", category: "edredones", price: 6.50, unit: "por pieza", isActive: true, description: "Edredones tamaño individual", stats: { ordersToday: 3, ordersWeek: 21, ordersMonth: 84, revenueMonth: 546.00 } },
  { id: "6", name: "Edredón 1.60m", nameEn: "Comforter 1.60m", category: "edredones", price: 7.50, unit: "por pieza", isActive: true, description: "Edredones tamaño matrimonial", stats: { ordersToday: 4, ordersWeek: 28, ordersMonth: 112, revenueMonth: 840.00 } },
  { id: "7", name: "Edredón 2.00m+", nameEn: "Comforter 2.00m+", category: "edredones", price: 8.50, unit: "por pieza", isActive: true, description: "Edredones tamaño king/queen", stats: { ordersToday: 2, ordersWeek: 14, ordersMonth: 56, revenueMonth: 476.00 } },
  { id: "8", name: "DRIP Básico", nameEn: "DRIP Basic", category: "drip", price: 9.90, unit: "por par", isActive: true, description: "Limpieza exterior básica de zapatos", stats: { ordersToday: 6, ordersWeek: 42, ordersMonth: 168, revenueMonth: 1663.20 } },
  { id: "9", name: "DRIP Especial", nameEn: "DRIP Special", category: "drip", price: 12.90, unit: "por par", isActive: true, description: "Limpieza completa exterior e interior", stats: { ordersToday: 4, ordersWeek: 28, ordersMonth: 112, revenueMonth: 1444.80 } },
  { id: "10", name: "DRIP Premium", nameEn: "DRIP Premium", category: "drip", price: 16.90, unit: "por par", isActive: true, description: "Limpieza premium con restauración", stats: { ordersToday: 2, ordersWeek: 14, ordersMonth: 56, revenueMonth: 946.40 } },
  { id: "11", name: "DRIP Niños", nameEn: "DRIP Kids", category: "drip", price: 5.90, unit: "por par", isActive: true, description: "Limpieza de zapatos infantiles", stats: { ordersToday: 3, ordersWeek: 21, ordersMonth: 84, revenueMonth: 495.60 } },
  { id: "12", name: "Delivery", nameEn: "Delivery", category: "delivery", price: 2.00, unit: "ida y vuelta", isActive: true, description: "Recogida y entrega a domicilio", stats: { ordersToday: 18, ordersWeek: 126, ordersMonth: 504, revenueMonth: 1008.00 } }
];

const mockCustomers = [
  { id: "1", name: "María García", phone: "+503 7890-1234", email: "maria@email.com", totalOrders: 18, lifetimeValue: 234.50, isVip: false, preferredBranch: "San Miguel", lastOrderDate: new Date(), createdAt: new Date(2024, 0, 15), notes: "" },
  { id: "2", name: "Carlos Hernández", phone: "+503 7890-5678", email: "carlos@email.com", totalOrders: 12, lifetimeValue: 156.00, isVip: false, preferredBranch: "Santa Ana", lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), createdAt: new Date(2024, 2, 10), notes: "" },
  { id: "3", name: "Ana Martínez", phone: "+503 7890-9012", email: "ana@email.com", totalOrders: 45, lifetimeValue: 598.50, isVip: true, preferredBranch: "Lourdes Colón", lastOrderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), createdAt: new Date(2023, 5, 20), notes: "Cliente frecuente, preferencia por DRIP" },
  { id: "4", name: "José López", phone: "+503 7890-3456", email: "jose@email.com", totalOrders: 5, lifetimeValue: 67.25, isVip: false, preferredBranch: "San Miguel", lastOrderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), createdAt: new Date(2025, 8, 1), notes: "" },
  { id: "5", name: "Rosa Pérez", phone: "+503 7890-7890", email: "rosa@email.com", totalOrders: 52, lifetimeValue: 689.00, isVip: true, preferredBranch: "Usulután", lastOrderDate: new Date(), createdAt: new Date(2023, 1, 5), notes: "Mejor cliente de Usulután" },
  { id: "6", name: "Miguel Torres", phone: "+503 7890-4444", email: "miguel@email.com", totalOrders: 8, lifetimeValue: 108.00, isVip: false, preferredBranch: "San Miguel", lastOrderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), createdAt: new Date(2024, 6, 15), notes: "" },
  { id: "7", name: "Elena Vásquez", phone: "+503 7890-5555", email: "elena@email.com", totalOrders: 22, lifetimeValue: 287.00, isVip: true, preferredBranch: "Santa Ana", lastOrderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), createdAt: new Date(2024, 0, 1), notes: "" },
  { id: "8", name: "Pedro Sánchez", phone: "+503 7890-6666", email: "pedro@email.com", totalOrders: 3, lifetimeValue: 42.50, isVip: false, preferredBranch: "Lourdes Colón", lastOrderDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), createdAt: new Date(2025, 10, 20), notes: "" }
];

const mockConversations = [
  { id: "1", customerId: "1", customerName: "María García", customerPhone: "+503 7890-1234", status: "active", lastMessageAt: new Date(), messageCount: 8, aiHandled: true, lastMessage: "Sí, me interesa el delivery", branchName: "San Miguel - Casa Matriz" },
  { id: "2", customerId: "2", customerName: "Carlos Hernández", customerPhone: "+503 7890-5678", status: "resolved", lastMessageAt: new Date(Date.now() - 30 * 60000), messageCount: 5, aiHandled: true, lastMessage: "Gracias, ya recogí mi ropa", branchName: "Santa Ana" },
  { id: "3", customerId: "4", customerName: "José López", customerPhone: "+503 7890-3456", status: "escalated", lastMessageAt: new Date(Date.now() - 15 * 60000), messageCount: 12, aiHandled: false, lastMessage: "Quiero hablar con un gerente", branchName: "San Miguel - Col. Gavidia" },
  { id: "4", customerId: "3", customerName: "Ana Martínez", customerPhone: "+503 7890-9012", status: "resolved", lastMessageAt: new Date(Date.now() - 60 * 60000), messageCount: 3, aiHandled: true, lastMessage: "Perfecto, gracias", branchName: "Lourdes Colón" },
  { id: "5", customerId: "5", customerName: "Rosa Pérez", customerPhone: "+503 7890-7890", status: "active", lastMessageAt: new Date(Date.now() - 5 * 60000), messageCount: 6, aiHandled: true, lastMessage: "¿Cuánto cuesta lavar edredones?", branchName: "Usulután" },
  { id: "6", customerId: "6", customerName: "Miguel Torres", customerPhone: "+503 7890-4444", status: "active", lastMessageAt: new Date(Date.now() - 2 * 60000), messageCount: 4, aiHandled: true, lastMessage: "¿Tienen servicio express?", branchName: "San Miguel - Casa Matriz" },
  { id: "7", customerId: "7", customerName: "Elena Vásquez", customerPhone: "+503 7890-5555", status: "resolved", lastMessageAt: new Date(Date.now() - 120 * 60000), messageCount: 7, aiHandled: true, lastMessage: "Excelente servicio", branchName: "Santa Ana" }
];

const mockOrders = [
  {
    id: "ORD001",
    orderNumber: "LO-2026-0001",
    customerId: "1",
    customerName: "María García",
    customerPhone: "+503 7890-1234",
    customerEmail: "maria@email.com",
    locationId: "1",
    locationName: "San Miguel - Casa Matriz",
    status: "pending",
    items: [
      { id: "i1", serviceName: "Carga Normal - Lavado + Secado", quantity: 2, unitPrice: 5.50, total: 11.00 }
    ],
    subtotal: 11.00,
    deliveryFee: 2.00,
    discount: 0,
    totalAmount: 13.00,
    paymentMethod: "efectivo",
    paymentStatus: "pending",
    isDelivery: true,
    deliveryAddress: "Col. Ciudad Real, Calle Elizabeth #15, San Miguel",
    estimatedReady: new Date(Date.now() + 2 * 60 * 60000),
    timeline: [
      { id: "t1", status: "created", label: "Pedido creado", timestamp: new Date(), note: "Pedido recibido por WhatsApp" }
    ],
    notes: "Cliente solicita llamada antes de entregar",
    createdAt: new Date()
  },
  {
    id: "ORD002",
    orderNumber: "LO-2026-0002",
    customerId: "2",
    customerName: "Carlos Hernández",
    customerPhone: "+503 7890-5678",
    customerEmail: "carlos@email.com",
    locationId: "5",
    locationName: "Santa Ana",
    status: "processing",
    items: [
      { id: "i2", serviceName: "Carga Pesada - Lavado + Secado", quantity: 1, unitPrice: 6.50, total: 6.50 }
    ],
    subtotal: 6.50,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 6.50,
    paymentMethod: "efectivo",
    paymentStatus: "paid",
    isDelivery: false,
    estimatedReady: new Date(Date.now() + 1 * 60 * 60000),
    timeline: [
      { id: "t1", status: "processing", label: "En proceso", timestamp: new Date(Date.now() - 15 * 60000), note: "Ropa en lavadora" },
      { id: "t2", status: "created", label: "Pedido creado", timestamp: new Date(Date.now() - 30 * 60000) }
    ],
    createdAt: new Date(Date.now() - 30 * 60000)
  },
  {
    id: "ORD003",
    orderNumber: "LO-2026-0003",
    customerId: "3",
    customerName: "Ana Martínez",
    customerPhone: "+503 7890-9012",
    customerEmail: "ana@email.com",
    locationId: "3",
    locationName: "Lourdes Colón",
    status: "ready",
    items: [
      { id: "i3", serviceName: "DRIP Premium", quantity: 1, unitPrice: 16.90, total: 16.90 }
    ],
    subtotal: 16.90,
    deliveryFee: 2.00,
    discount: 0,
    totalAmount: 18.90,
    paymentMethod: "tarjeta",
    paymentStatus: "paid",
    isDelivery: true,
    deliveryAddress: "Res. Las Palmas, Casa #8, Lourdes Colón",
    timeline: [
      { id: "t1", status: "ready", label: "Listo para entrega", timestamp: new Date(Date.now() - 10 * 60000), note: "Zapatos limpiados, esperando delivery" },
      { id: "t2", status: "processing", label: "En proceso", timestamp: new Date(Date.now() - 40 * 60000) },
      { id: "t3", status: "created", label: "Pedido creado", timestamp: new Date(Date.now() - 60 * 60000) }
    ],
    createdAt: new Date(Date.now() - 60 * 60000)
  },
  {
    id: "ORD004",
    orderNumber: "LO-2026-0004",
    customerId: "5",
    customerName: "Rosa Pérez",
    customerPhone: "+503 7890-7890",
    customerEmail: "rosa@email.com",
    locationId: "1",
    locationName: "San Miguel - Casa Matriz",
    status: "delivered",
    items: [
      { id: "i4", serviceName: "Edredón 2.00m", quantity: 1, unitPrice: 8.50, total: 8.50 }
    ],
    subtotal: 8.50,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 8.50,
    paymentMethod: "efectivo",
    paymentStatus: "paid",
    isDelivery: false,
    timeline: [
      { id: "t1", status: "delivered", label: "Entregado", timestamp: new Date(Date.now() - 30 * 60000), note: "Cliente recogió en sucursal" },
      { id: "t2", status: "ready", label: "Listo para entrega", timestamp: new Date(Date.now() - 60 * 60000) },
      { id: "t3", status: "processing", label: "En proceso", timestamp: new Date(Date.now() - 100 * 60000) },
      { id: "t4", status: "created", label: "Pedido creado", timestamp: new Date(Date.now() - 120 * 60000) }
    ],
    createdAt: new Date(Date.now() - 120 * 60000)
  },
  {
    id: "ORD005",
    orderNumber: "LO-2026-0005",
    customerId: "6",
    customerName: "Miguel Torres",
    customerPhone: "+503 7890-4444",
    customerEmail: "miguel@email.com",
    locationId: "2",
    locationName: "San Miguel - Col. Gavidia",
    status: "pending",
    items: [
      { id: "i5", serviceName: "Carga Normal - Lavado + Secado", quantity: 3, unitPrice: 5.50, total: 16.50 },
      { id: "i6", serviceName: "DRIP Básico", quantity: 2, unitPrice: 9.90, total: 19.80 }
    ],
    subtotal: 36.30,
    deliveryFee: 2.00,
    discount: 3.63,
    totalAmount: 34.67,
    paymentMethod: "efectivo",
    paymentStatus: "pending",
    isDelivery: true,
    deliveryAddress: "Col. Gavidia, 10 Av Norte #25, San Miguel",
    estimatedReady: new Date(Date.now() + 3 * 60 * 60000),
    timeline: [
      { id: "t1", status: "created", label: "Pedido creado", timestamp: new Date(Date.now() - 5 * 60000), note: "Descuento VIP 10% aplicado" }
    ],
    notes: "Cliente VIP - aplicar descuento 10%",
    createdAt: new Date(Date.now() - 5 * 60000)
  },
  {
    id: "ORD006",
    orderNumber: "LO-2026-0006",
    customerId: "7",
    customerName: "Elena Vásquez",
    customerPhone: "+503 7890-5555",
    customerEmail: "elena@email.com",
    locationId: "5",
    locationName: "Santa Ana",
    status: "processing",
    items: [
      { id: "i7", serviceName: "Carga Pesada - Lavado + Secado", quantity: 2, unitPrice: 6.50, total: 13.00 },
      { id: "i8", serviceName: "Edredón 1.60m", quantity: 1, unitPrice: 7.50, total: 7.50 }
    ],
    subtotal: 20.50,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 20.50,
    paymentMethod: "tarjeta",
    paymentStatus: "paid",
    isDelivery: false,
    estimatedReady: new Date(Date.now() + 90 * 60000),
    timeline: [
      { id: "t1", status: "processing", label: "En proceso", timestamp: new Date(Date.now() - 20 * 60000), note: "Primera carga en secadora" },
      { id: "t2", status: "created", label: "Pedido creado", timestamp: new Date(Date.now() - 45 * 60000) }
    ],
    createdAt: new Date(Date.now() - 45 * 60000)
  },
  {
    id: "ORD007",
    orderNumber: "LO-2026-0007",
    customerId: "8",
    customerName: "Pedro Sánchez",
    customerPhone: "+503 7890-6666",
    customerEmail: "pedro@email.com",
    locationId: "4",
    locationName: "Usulután",
    status: "ready",
    items: [
      { id: "i9", serviceName: "DRIP Especial", quantity: 1, unitPrice: 12.90, total: 12.90 }
    ],
    subtotal: 12.90,
    deliveryFee: 0,
    discount: 0,
    totalAmount: 12.90,
    paymentMethod: "efectivo",
    paymentStatus: "pending",
    isDelivery: false,
    timeline: [
      { id: "t1", status: "ready", label: "Listo para entrega", timestamp: new Date(Date.now() - 15 * 60000) },
      { id: "t2", status: "processing", label: "En proceso", timestamp: new Date(Date.now() - 50 * 60000) },
      { id: "t3", status: "created", label: "Pedido creado", timestamp: new Date(Date.now() - 75 * 60000) }
    ],
    createdAt: new Date(Date.now() - 75 * 60000)
  },
  {
    id: "ORD008",
    orderNumber: "LO-2026-0008",
    customerId: "3",
    customerName: "Ana Martínez",
    customerPhone: "+503 7890-9012",
    customerEmail: "ana@email.com",
    locationId: "3",
    locationName: "Lourdes Colón",
    status: "delivered",
    items: [
      { id: "i10", serviceName: "Carga Normal - Lavado + Secado", quantity: 4, unitPrice: 5.50, total: 22.00 },
      { id: "i11", serviceName: "Delivery", quantity: 1, unitPrice: 2.00, total: 2.00 }
    ],
    subtotal: 22.00,
    deliveryFee: 2.00,
    discount: 2.20,
    totalAmount: 21.80,
    paymentMethod: "tarjeta",
    paymentStatus: "paid",
    isDelivery: true,
    deliveryAddress: "Res. Las Palmas, Casa #8, Lourdes Colón",
    timeline: [
      { id: "t1", status: "delivered", label: "Entregado", timestamp: new Date(Date.now() - 180 * 60000), note: "Entregado a familiar" },
      { id: "t2", status: "ready", label: "Listo para entrega", timestamp: new Date(Date.now() - 210 * 60000) },
      { id: "t3", status: "processing", label: "En proceso", timestamp: new Date(Date.now() - 280 * 60000) },
      { id: "t4", status: "created", label: "Pedido creado", timestamp: new Date(Date.now() - 300 * 60000) }
    ],
    notes: "Descuento VIP 10% - cliente frecuente",
    createdAt: new Date(Date.now() - 300 * 60000)
  }
];

const mockEscalations = [
  { id: "1", conversationId: "3", customerId: "4", customerName: "José López", customerPhone: "+503 7890-3456", reason: "Reclamo por ropa dañada", priority: "high", status: "pending", assignedTo: null, locationName: "San Miguel - Col. Gavidia", createdAt: new Date(Date.now() - 45 * 60000), resolvedAt: null },
  { id: "2", conversationId: "8", customerId: "6", customerName: "Miguel Torres", customerPhone: "+503 7890-4444", reason: "Pedido retrasado", priority: "medium", status: "pending", assignedTo: null, locationName: "San Miguel - Casa Matriz", createdAt: new Date(Date.now() - 30 * 60000), resolvedAt: null },
  { id: "3", conversationId: "9", customerId: "2", customerName: "Carlos Hernández", customerPhone: "+503 7890-5678", reason: "Consulta de facturación", priority: "low", status: "resolved", assignedTo: "María López", locationName: "Santa Ana", createdAt: new Date(Date.now() - 120 * 60000), resolvedAt: new Date(Date.now() - 60 * 60000) }
];

const mockKnowledgeBase = [
  { id: "1", category: "precios", question: "¿Cuánto cuesta lavar?", answer: "Carga Normal: $3 lavado, $5.50 lavado+secado. Carga Pesada: $3.50 lavado, $6.50 lavado+secado.", isActive: true, createdAt: new Date(2024, 0, 1) },
  { id: "2", category: "horarios", question: "¿Cuáles son los horarios?", answer: "Lunes a Sábado 7am-6pm, Domingo 7am-5pm", isActive: true, createdAt: new Date(2024, 0, 1) },
  { id: "3", category: "delivery", question: "¿Tienen delivery?", answer: "Sí, el servicio de delivery cuesta $2 (recogida + entrega). Disponible en San Miguel, Lourdes Colón y Santa Ana.", isActive: true, createdAt: new Date(2024, 0, 1) },
  { id: "4", category: "servicios", question: "¿Qué servicios ofrecen?", answer: "Lavado de ropa, edredones, y limpieza de zapatos DRIP.", isActive: true, createdAt: new Date(2024, 0, 1) },
  { id: "5", category: "drip", question: "¿Qué es DRIP?", answer: "DRIP es nuestro servicio de limpieza profesional de zapatos. Tenemos Básico ($9.90), Especial ($12.90), Premium ($16.90) y Niños ($5.90).", isActive: true, createdAt: new Date(2024, 0, 1) }
];

const mockUsers = [
  { id: "1", name: "Fabricio Estrada", email: "fabricio@lavanderiaoriental.com.sv", role: "admin", status: "active", lastLogin: new Date(), createdAt: new Date(2020, 0, 1) },
  { id: "2", name: "María López", email: "maria@lavanderiaoriental.com.sv", role: "manager", status: "active", lastLogin: new Date(Date.now() - 86400000), createdAt: new Date(2021, 3, 10) },
  { id: "3", name: "Carlos Mejía", email: "carlos@lavanderiaoriental.com.sv", role: "agent", status: "active", lastLogin: new Date(Date.now() - 172800000), createdAt: new Date(2022, 6, 20) },
  { id: "4", name: "Ana García", email: "ana@lavanderiaoriental.com.sv", role: "agent", status: "inactive", lastLogin: null, createdAt: new Date(2023, 1, 5) }
];

const mockNotifications = [
  { id: "1", type: "escalation", title: "Nueva escalación", message: "José López requiere atención", read: false, createdAt: new Date(Date.now() - 5 * 60000) },
  { id: "2", type: "order", title: "Nuevo pedido", message: "Pedido #LO-2026-0005 creado", read: false, createdAt: new Date(Date.now() - 15 * 60000) },
  { id: "3", type: "customer", title: "Nuevo cliente VIP", message: "Elena Vásquez ahora es VIP", read: true, createdAt: new Date(Date.now() - 60 * 60000) },
  { id: "4", type: "system", title: "Resumen diario", message: "42 conversaciones resueltas ayer", read: true, createdAt: new Date(Date.now() - 24 * 60 * 60000) }
];

const mockSystemConfig = {
  business: {
    name: "Lavandería Oriental",
    phone: "+503 2222-3333",
    whatsapp: "+503 7947-5950",
    email: "info@lavanderiaoriental.com.sv",
    website: "lavanderiaoriental.com.sv",
    address: "San Miguel, El Salvador"
  },
  whatsapp: {
    greeting: "¡Hola! 👋 Bienvenido a Lavandería Oriental. ¿En qué podemos ayudarte hoy?",
    away: "Gracias por contactarnos. En este momento estamos fuera de horario. Te responderemos pronto.",
    autoReplyEnabled: true,
    autoReplyStart: "07:00",
    autoReplyEnd: "18:00"
  },
  ai: {
    model: "claude-sonnet-4",
    confidenceThreshold: 0.7,
    maxResponseLength: 500,
    tone: "professional",
    autoEscalate: true,
    escalateOnLowConfidence: true,
    escalateAfterAttempts: 3,
    escalationKeywords: ["queja", "reclamo", "daño", "gerente", "devolución", "urgente"]
  },
  notifications: {
    escalations: true,
    dailySummary: true,
    newCustomers: false,
    sounds: true
  }
};

// ============================================
// HEALTH & SYSTEM
// ============================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "demo mode",
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0"
  });
});

// ============================================
// WHATSAPP WEBHOOK
// ============================================

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

app.post("/api/webhook/whatsapp", async (req, res) => {
  try {
    const body = req.body;
    console.log("WhatsApp webhook received:", JSON.stringify(body));
    // In production, process message with Claude AI here
    res.status(200).json({ success: true, message: "Message received" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// DASHBOARD
// ============================================

app.get("/api/dashboard/stats", async (req, res) => {
  res.json({
    totalConversations: 1247,
    activeConversations: 24,
    todayMessages: 156,
    pendingOrders: mockOrders.filter(o => o.status === "pending").length,
    aiResolutionRate: 94,
    avgResponseTime: "2.3s",
    messagesProcessed: 156,
    resolvedToday: 42,
    customerSatisfaction: 96,
    escalations: mockEscalations.filter(e => e.status === "pending").length
  });
});

app.get("/api/dashboard/messages", async (req, res) => {
  const now = Date.now();
  res.json([
    { id: "1", direction: "inbound", content: "Hola, cuánto cuesta lavar una carga normal?", timestamp: new Date(now - 4 * 60000), aiGenerated: false },
    { id: "2", direction: "outbound", content: "¡Hola! El precio de una carga normal es $3 solo lavado o $5.50 lavado + secado. ¿En qué sucursal te queda más cerca?", timestamp: new Date(now - 3 * 60000), aiGenerated: true },
    { id: "3", direction: "inbound", content: "San Miguel", timestamp: new Date(now - 2 * 60000), aiGenerated: false },
    { id: "4", direction: "outbound", content: "¡Perfecto! En San Miguel tenemos dos sucursales: Casa Matriz en Col. Ciudad Real y Col. Gavidia. Ambas abren de 7am-6pm. ¿Te gustaría delivery? Cuesta $2 total.", timestamp: new Date(now - 1 * 60000), aiGenerated: true }
  ]);
});

app.get("/api/dashboard/activities", async (req, res) => {
  res.json([
    { id: "1", type: "resolved", customerName: "María García", customerPhone: "+503 7890-1234", content: "Conversación resuelta - Consulta de precios", timestamp: new Date(Date.now() - 5 * 60000), locationName: "San Miguel - Casa Matriz" },
    { id: "2", type: "message", customerName: "Carlos Hernández", customerPhone: "+503 7890-5678", content: "Nueva conversación iniciada", timestamp: new Date(Date.now() - 15 * 60000), locationName: "Santa Ana" },
    { id: "3", type: "order", customerName: "Ana Martínez", customerPhone: "+503 7890-9012", content: "Nuevo pedido creado - $16.90", timestamp: new Date(Date.now() - 30 * 60000), locationName: "Lourdes Colón" },
    { id: "4", type: "escalation", customerName: "José López", customerPhone: "+503 7890-3456", content: "Escalación creada - Reclamo por ropa dañada", timestamp: new Date(Date.now() - 45 * 60000), locationName: "San Miguel - Col. Gavidia" },
    { id: "5", type: "resolved", customerName: "Rosa Pérez", customerPhone: "+503 7890-7890", content: "Conversación resuelta - Horarios de atención", timestamp: new Date(Date.now() - 60 * 60000), locationName: "Usulután" }
  ]);
});

app.get("/api/dashboard/escalations", async (req, res) => {
  res.json(mockEscalations.filter(e => e.status === "pending").map(e => ({
    id: e.id,
    customerName: e.customerName,
    customerPhone: e.customerPhone,
    reason: e.reason,
    priority: e.priority,
    waitTime: Math.floor((Date.now() - new Date(e.createdAt).getTime()) / 60000),
    timestamp: e.createdAt,
    conversationId: e.conversationId
  })));
});

app.get("/api/dashboard/performance", async (req, res) => {
  res.json({
    firstContactResolution: { percentage: 87, total: 1247, resolved: 1085 },
    averageRating: { score: 4.8, maxScore: 5.0, totalReviews: 234 },
    averageResponseTime: { seconds: 2.3, trend: "improving" },
    costSavings: { amount: 2400, currency: "USD", period: "month", calculation: "1085 AI conversations × $2.21 saved per conversation" }
  });
});

// ============================================
// LOCATIONS
// ============================================

app.get("/api/locations", async (req, res) => {
  res.json(mockLocations);
});

app.get("/api/locations/:id", async (req, res) => {
  const location = mockLocations.find(l => l.id === req.params.id);
  if (!location) {
    return res.status(404).json({ error: "Location not found" });
  }
  res.json(location);
});

app.patch("/api/locations/:id", async (req, res) => {
  const location = mockLocations.find(l => l.id === req.params.id);
  if (!location) {
    return res.status(404).json({ error: "Location not found" });
  }
  // In production, update in database
  res.json({ ...location, ...req.body, updatedAt: new Date() });
});

// ============================================
// SERVICES
// ============================================

app.get("/api/services", async (req, res) => {
  const category = req.query.category as string;
  if (category) {
    res.json(mockServices.filter(s => s.category === category));
  } else {
    res.json(mockServices);
  }
});

app.get("/api/services/:id", async (req, res) => {
  const service = mockServices.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json(service);
});

app.post("/api/services", async (req, res) => {
  const newService = {
    id: Date.now().toString(),
    ...req.body,
    stats: { ordersToday: 0, ordersWeek: 0, ordersMonth: 0, revenueMonth: 0 },
    createdAt: new Date()
  };
  res.status(201).json(newService);
});

app.patch("/api/services/:id", async (req, res) => {
  const service = mockServices.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json({ ...service, ...req.body, updatedAt: new Date() });
});

app.delete("/api/services/:id", async (req, res) => {
  res.json({ success: true, message: "Service deleted" });
});

app.get("/api/service-categories", async (req, res) => {
  res.json([
    { id: "lavado", name: "Lavado", slug: "lavado", icon: "🧺", description: "Servicio de lavado de ropa", serviceCount: 4 },
    { id: "edredones", name: "Edredones", slug: "edredones", icon: "🛏️", description: "Lavado de edredones y cobijas", serviceCount: 3 },
    { id: "drip", name: "DRIP Zapatos", slug: "drip", icon: "👟", description: "Limpieza profesional de calzado", serviceCount: 4 },
    { id: "extras", name: "Extras", slug: "extras", icon: "✨", description: "Servicios adicionales", serviceCount: 0 },
    { id: "delivery", name: "Delivery", slug: "delivery", icon: "🚚", description: "Servicio de recogida y entrega", serviceCount: 1 }
  ]);
});

// ============================================
// CUSTOMERS
// ============================================

app.get("/api/customers", async (req, res) => {
  const vip = req.query.vip;
  if (vip === "true") {
    res.json(mockCustomers.filter(c => c.isVip));
  } else {
    res.json(mockCustomers);
  }
});

app.get("/api/customers/:id", async (req, res) => {
  const customer = mockCustomers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }
  // Include customer's orders and conversations
  const customerOrders = mockOrders.filter(o => o.customerId === customer.id);
  const customerConversations = mockConversations.filter(c => c.customerId === customer.id);
  res.json({
    ...customer,
    orders: customerOrders,
    conversations: customerConversations
  });
});

app.patch("/api/customers/:id", async (req, res) => {
  const customer = mockCustomers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }
  res.json({ ...customer, ...req.body, updatedAt: new Date() });
});

// ============================================
// CONVERSATIONS
// ============================================

app.get("/api/conversations", async (req, res) => {
  const status = req.query.status as string;
  if (status) {
    res.json(mockConversations.filter(c => c.status === status));
  } else {
    res.json(mockConversations);
  }
});

app.get("/api/conversations/:id", async (req, res) => {
  const conversation = mockConversations.find(c => c.id === req.params.id);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }
  res.json(conversation);
});

app.get("/api/conversations/:id/messages", async (req, res) => {
  const now = Date.now();
  res.json([
    { id: "1", direction: "inbound", content: "Hola, buenos días. ¿Cuánto cuesta lavar una carga normal?", timestamp: new Date(now - 10 * 60000), aiGenerated: false },
    { id: "2", direction: "outbound", content: "¡Buenos días! El precio de una carga normal es:\n• Solo lavado: $3.00\n• Lavado + secado: $5.50\n\n¿En qué sucursal le queda más cerca?", timestamp: new Date(now - 9 * 60000), aiGenerated: true, intent: "pricing_inquiry", confidence: 0.98 },
    { id: "3", direction: "inbound", content: "San Miguel", timestamp: new Date(now - 8 * 60000), aiGenerated: false },
    { id: "4", direction: "outbound", content: "¡Perfecto! En San Miguel tenemos dos sucursales:\n\n📍 Casa Matriz - Col. Ciudad Real, C. Elizabeth\n📍 Col. Gavidia - 10 Av Norte\n\nAmbas abren de 7am a 6pm (L-S) y 7am a 5pm (D).\n\n¿Le gustaría servicio de delivery? Cuesta $2 total (recogida + entrega).", timestamp: new Date(now - 7 * 60000), aiGenerated: true, intent: "branch_info", confidence: 0.95 },
    { id: "5", direction: "inbound", content: "Sí, me interesa el delivery", timestamp: new Date(now - 5 * 60000), aiGenerated: false },
    { id: "6", direction: "outbound", content: "¡Excelente! Para programar su recogida necesito:\n\n1. Dirección completa\n2. Horario preferido\n3. Cantidad aproximada de ropa\n\n¿Me puede proporcionar estos datos?", timestamp: new Date(now - 4 * 60000), aiGenerated: true, intent: "delivery_scheduling", confidence: 0.92 }
  ]);
});

app.patch("/api/conversations/:id", async (req, res) => {
  const conversation = mockConversations.find(c => c.id === req.params.id);
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }
  res.json({ ...conversation, ...req.body, updatedAt: new Date() });
});

app.post("/api/conversations/:id/messages", async (req, res) => {
  const { content } = req.body;
  const newMessage = {
    id: Date.now().toString(),
    direction: "outbound",
    content,
    timestamp: new Date(),
    aiGenerated: false
  };
  res.status(201).json(newMessage);
});

// ============================================
// ORDERS
// ============================================

app.get("/api/orders", async (req, res) => {
  const status = req.query.status as string;
  const locationId = req.query.locationId as string;

  let orders = [...mockOrders];
  if (status) {
    orders = orders.filter(o => o.status === status);
  }
  if (locationId) {
    orders = orders.filter(o => o.locationId === locationId);
  }
  res.json(orders);
});

app.get("/api/orders/:id", async (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

app.post("/api/orders", async (req, res) => {
  const orderCount = mockOrders.length + 1;
  const newOrder = {
    id: `ORD${String(orderCount).padStart(3, '0')}`,
    orderNumber: `LO-2026-${String(orderCount).padStart(4, '0')}`,
    ...req.body,
    status: "pending",
    paymentStatus: "pending",
    timeline: [
      { id: "t1", status: "created", label: "Pedido creado", timestamp: new Date() }
    ],
    createdAt: new Date()
  };
  res.status(201).json(newOrder);
});

app.patch("/api/orders/:id", async (req, res) => {
  const order = mockOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  // Add timeline entry if status changed
  const updatedOrder = { ...order, ...req.body, updatedAt: new Date() };
  if (req.body.status && req.body.status !== order.status) {
    updatedOrder.timeline = [
      { id: `t${Date.now()}`, status: req.body.status, label: getStatusLabel(req.body.status), timestamp: new Date() },
      ...order.timeline
    ];
  }
  res.json(updatedOrder);
});

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pedido pendiente",
    processing: "En proceso",
    ready: "Listo para entrega",
    delivered: "Entregado",
    cancelled: "Cancelado"
  };
  return labels[status] || status;
}

// ============================================
// ESCALATIONS
// ============================================

app.get("/api/escalations", async (req, res) => {
  const status = req.query.status as string;
  if (status) {
    res.json(mockEscalations.filter(e => e.status === status));
  } else {
    res.json(mockEscalations);
  }
});

app.get("/api/escalations/:id", async (req, res) => {
  const escalation = mockEscalations.find(e => e.id === req.params.id);
  if (!escalation) {
    return res.status(404).json({ error: "Escalation not found" });
  }
  res.json(escalation);
});

app.post("/api/escalations", async (req, res) => {
  const newEscalation = {
    id: Date.now().toString(),
    ...req.body,
    status: "pending",
    assignedTo: null,
    createdAt: new Date(),
    resolvedAt: null
  };
  res.status(201).json(newEscalation);
});

app.patch("/api/escalations/:id", async (req, res) => {
  const escalation = mockEscalations.find(e => e.id === req.params.id);
  if (!escalation) {
    return res.status(404).json({ error: "Escalation not found" });
  }
  const updatedEscalation = { ...escalation, ...req.body };
  if (req.body.status === "resolved" && escalation.status !== "resolved") {
    updatedEscalation.resolvedAt = new Date();
  }
  res.json(updatedEscalation);
});

// ============================================
// KNOWLEDGE BASE
// ============================================

app.get("/api/knowledge-base", async (req, res) => {
  const category = req.query.category as string;
  if (category) {
    res.json(mockKnowledgeBase.filter(kb => kb.category === category));
  } else {
    res.json(mockKnowledgeBase);
  }
});

app.get("/api/knowledge-base/:id", async (req, res) => {
  const entry = mockKnowledgeBase.find(kb => kb.id === req.params.id);
  if (!entry) {
    return res.status(404).json({ error: "Knowledge base entry not found" });
  }
  res.json(entry);
});

app.post("/api/knowledge-base", async (req, res) => {
  const newEntry = {
    id: Date.now().toString(),
    ...req.body,
    isActive: true,
    createdAt: new Date()
  };
  res.status(201).json(newEntry);
});

app.patch("/api/knowledge-base/:id", async (req, res) => {
  const entry = mockKnowledgeBase.find(kb => kb.id === req.params.id);
  if (!entry) {
    return res.status(404).json({ error: "Knowledge base entry not found" });
  }
  res.json({ ...entry, ...req.body, updatedAt: new Date() });
});

app.delete("/api/knowledge-base/:id", async (req, res) => {
  res.json({ success: true, message: "Knowledge base entry deleted" });
});

// ============================================
// USERS / TEAM
// ============================================

app.get("/api/users", async (req, res) => {
  const role = req.query.role as string;
  if (role) {
    res.json(mockUsers.filter(u => u.role === role));
  } else {
    res.json(mockUsers);
  }
});

app.get("/api/users/:id", async (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.post("/api/users", async (req, res) => {
  const newUser = {
    id: Date.now().toString(),
    ...req.body,
    status: "active",
    lastLogin: null,
    createdAt: new Date()
  };
  res.status(201).json(newUser);
});

app.patch("/api/users/:id", async (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ ...user, ...req.body, updatedAt: new Date() });
});

app.delete("/api/users/:id", async (req, res) => {
  res.json({ success: true, message: "User deleted" });
});

// ============================================
// NOTIFICATIONS
// ============================================

app.get("/api/notifications", async (req, res) => {
  const unreadOnly = req.query.unread === "true";
  if (unreadOnly) {
    res.json(mockNotifications.filter(n => !n.read));
  } else {
    res.json(mockNotifications);
  }
});

app.patch("/api/notifications/:id", async (req, res) => {
  const notification = mockNotifications.find(n => n.id === req.params.id);
  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }
  res.json({ ...notification, ...req.body });
});

app.post("/api/notifications/mark-all-read", async (req, res) => {
  res.json({ success: true, message: "All notifications marked as read" });
});

// ============================================
// SYSTEM CONFIG
// ============================================

app.get("/api/system/config", async (req, res) => {
  res.json(mockSystemConfig);
});

app.patch("/api/system/config", async (req, res) => {
  // In production, update in database
  res.json({ ...mockSystemConfig, ...req.body, updatedAt: new Date() });
});

app.get("/api/system/integrations", async (req, res) => {
  res.json({
    whatsapp: { status: "connected", phone: "+503 7947-5950", provider: "Twilio" },
    ai: { status: "active", model: "claude-sonnet-4", provider: "Anthropic" },
    database: { status: "connected", type: "PostgreSQL", provider: "Supabase" }
  });
});

// ============================================
// ANALYTICS
// ============================================

app.get("/api/analytics/summary", async (req, res) => {
  const range = req.query.range || "week";
  const locationId = req.query.locationId as string;
  const now = new Date();
  let startDate: Date;

  switch (range) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "quarter":
      startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const dailyData = [];
  const days = Math.min(7, Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)));
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dailyData.push({
      date: date.toISOString().split('T')[0],
      conversations: Math.floor(Math.random() * 50) + 150,
      orders: Math.floor(Math.random() * 20) + 50,
      revenue: Math.floor(Math.random() * 200) + 300
    });
  }

  res.json({
    period: { start: startDate.toISOString(), end: now.toISOString() },
    conversations: { total: 1247, resolved: 1172, escalated: 75, aiResolutionRate: 94, trend: 12 },
    messages: { total: 8934, inbound: 4567, outbound: 4367, avgPerConversation: 7.2 },
    orders: { total: 423, completed: 398, cancelled: 12, pending: 13, totalRevenue: 2847.50, trend: 8 },
    customers: { total: 856, new: 47, returning: 809, vip: 23 },
    performance: { avgResponseTime: "2.3s", customerSatisfaction: 96, firstContactResolution: 87, peakHours: ["10:00", "14:00", "17:00"] },
    topServices: [
      { name: "Carga Normal - L+S", count: 187, revenue: 1028.50 },
      { name: "DRIP Básico", count: 89, revenue: 881.10 },
      { name: "Carga Pesada - L+S", count: 67, revenue: 435.50 },
      { name: "DRIP Especial", count: 45, revenue: 580.50 },
      { name: "Delivery", count: 156, revenue: 312.00 }
    ],
    locationPerformance: [
      { id: "1", name: "San Miguel - Casa Matriz", orders: 156, revenue: 1023.50 },
      { id: "3", name: "Lourdes Colón", orders: 98, revenue: 687.30 },
      { id: "5", name: "Santa Ana", orders: 87, revenue: 598.20 },
      { id: "2", name: "San Miguel - Col. Gavidia", orders: 52, revenue: 345.00 },
      { id: "4", name: "Usulután", orders: 30, revenue: 193.50 }
    ],
    aiPerformance: {
      totalResponses: 4367,
      avgConfidence: 0.91,
      intentsDetected: { pricing: 1234, hours: 876, delivery: 654, services: 543, other: 1060 },
      escalationReasons: { keyword: 32, lowConfidence: 28, userRequest: 15 }
    },
    dailyData
  });
});

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

app.get("/api/analytics/conversations", async (req, res) => {
  res.json({
    byStatus: { active: 24, resolved: 1172, escalated: 51 },
    byBranch: [
      { name: "San Miguel - Casa Matriz", count: 456 },
      { name: "Lourdes Colón", count: 312 },
      { name: "Santa Ana", count: 287 },
      { name: "San Miguel - Col. Gavidia", count: 134 },
      { name: "Usulután", count: 58 }
    ],
    byHour: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: i >= 7 && i <= 18 ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 5)
    })),
    avgDuration: "4.2 min",
    avgMessages: 7.2
  });
});

app.get("/api/analytics/revenue", async (req, res) => {
  res.json({
    today: 473.75,
    week: 3289.00,
    month: 13748.75,
    byService: [
      { name: "Carga Normal - L+S", amount: 4114.00 },
      { name: "Carga Pesada - L+S", amount: 2548.00 },
      { name: "DRIP Básico", amount: 1663.20 },
      { name: "DRIP Especial", amount: 1444.80 },
      { name: "Delivery", amount: 1008.00 }
    ],
    byBranch: [
      { name: "San Miguel - Casa Matriz", amount: 4156.75 },
      { name: "Lourdes Colón", amount: 3245.00 },
      { name: "Santa Ana", amount: 2312.75 },
      { name: "San Miguel - Col. Gavidia", amount: 2678.25 },
      { name: "Usulután", amount: 1356.00 }
    ],
    trend: 8
  });
});

// ============================================
// EXPORT HANDLER
// ============================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // @ts-ignore - Express handles the request/response
  return app(req, res);
}
