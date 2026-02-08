import { db } from "../db";
import { knowledgeBase, services, locations } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface SearchResult {
  question: string;
  answer: string;
  category: string;
  relevanceScore: number;
}

export async function searchKnowledgeBase(
  query: string,
  language: string = "es",
  limit: number = 5
): Promise<SearchResult[]> {
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  const entries = await db.query.knowledgeBase.findMany({
    where: and(
      eq(knowledgeBase.isActive, true),
      eq(knowledgeBase.language, language)
    ),
  });

  const scoredResults = entries.map(entry => {
    let score = 0;
    const questionLower = entry.question.toLowerCase();
    const answerLower = entry.answer.toLowerCase();
    const entryKeywords = entry.keywords || [];

    for (const keyword of keywords) {
      if (questionLower.includes(keyword)) score += 3;
      if (answerLower.includes(keyword)) score += 1;
      if (entryKeywords.some(k => k?.toLowerCase().includes(keyword))) score += 2;
    }

    return {
      question: entry.question,
      answer: entry.answer,
      category: entry.category || "general",
      relevanceScore: score,
    };
  });

  return scoredResults
    .filter(r => r.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

export async function getServicePricing(serviceName?: string, language: string = "es"): Promise<string> {
  let servicesList = await db.query.services.findMany({
    where: eq(services.isActive, true),
  });

  if (serviceName) {
    const lowerName = serviceName.toLowerCase();
    servicesList = servicesList.filter(s => 
      s.name.toLowerCase().includes(lowerName) ||
      (s.nameEn && s.nameEn.toLowerCase().includes(lowerName))
    );
  }

  if (servicesList.length === 0) {
    return language === "es"
      ? "No encontré ese servicio. Nuestros servicios incluyen: lavado por libra, planchado, edredones, y delivery."
      : "I couldn't find that service. Our services include: wash by pound, ironing, comforters, and delivery.";
  }

  const priceList = servicesList.map(s => {
    const name = language === "en" && s.nameEn ? s.nameEn : s.name;
    return `${name}: $${s.price}/${s.unit}`;
  }).join("\n");

  return language === "es"
    ? `Nuestros precios:\n${priceList}`
    : `Our prices:\n${priceList}`;
}

export async function getLocationInfo(locationQuery?: string, language: string = "es"): Promise<string> {
  let locationsList = await db.query.locations.findMany({
    where: eq(locations.isActive, true),
  });

  if (locationQuery) {
    const lowerQuery = locationQuery.toLowerCase();
    locationsList = locationsList.filter(l =>
      l.name.toLowerCase().includes(lowerQuery) ||
      (l.city && l.city.toLowerCase().includes(lowerQuery)) ||
      (l.address && l.address.toLowerCase().includes(lowerQuery))
    );
  }

  if (locationsList.length === 0) {
    return language === "es"
      ? "No encontré esa sucursal. Tenemos sucursales en San Miguel, Usulután, Santa Ana, y San Salvador."
      : "I couldn't find that branch. We have branches in San Miguel, Usulután, Santa Ana, and San Salvador.";
  }

  const locationInfo = locationsList.map(l => {
    const hours = l.hours as Record<string, string> || {};
    const todayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];
    const todayHours = hours[todayKey] || "Cerrado";
    
    return language === "es"
      ? `📍 ${l.name}\n   ${l.address || ""}, ${l.city || ""}\n   📞 ${l.phone}\n   🕐 Hoy: ${todayHours}`
      : `📍 ${l.name}\n   ${l.address || ""}, ${l.city || ""}\n   📞 ${l.phone}\n   🕐 Today: ${todayHours}`;
  }).join("\n\n");

  return locationInfo;
}

export async function findNearestLocation(city: string, language: string = "es"): Promise<string> {
  const cityLower = city.toLowerCase();
  
  const allLocations = await db.query.locations.findMany({
    where: eq(locations.isActive, true),
  });

  const cityMatches = allLocations.filter(l =>
    (l.city && l.city.toLowerCase().includes(cityLower)) ||
    l.name.toLowerCase().includes(cityLower) ||
    (l.address && l.address.toLowerCase().includes(cityLower))
  );

  if (cityMatches.length > 0) {
    const loc = cityMatches[0];
    return language === "es"
      ? `La sucursal más cercana es ${loc.name}, ubicada en ${loc.address || ""}, ${loc.city || ""}. Teléfono: ${loc.phone}. WhatsApp: ${loc.whatsapp || loc.phone}`
      : `The nearest branch is ${loc.name}, located at ${loc.address || ""}, ${loc.city || ""}. Phone: ${loc.phone}. WhatsApp: ${loc.whatsapp || loc.phone}`;
  }

  return language === "es"
    ? "No encontré sucursales en esa zona. ¿Podrías indicarme en qué ciudad te encuentras?"
    : "I couldn't find branches in that area. Could you tell me which city you're in?";
}

export async function getOpenLocations(language: string = "es"): Promise<string> {
  const now = new Date();
  const dayKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const allLocations = await db.query.locations.findMany({
    where: eq(locations.isActive, true),
  });

  const openLocations = allLocations.filter(loc => {
    const hours = loc.hours as Record<string, string> || {};
    const todayHours = hours[dayKey];
    
    if (!todayHours || todayHours.toLowerCase() === "cerrado" || todayHours.toLowerCase() === "closed") {
      return false;
    }

    const [openStr, closeStr] = todayHours.split("-");
    if (!openStr || !closeStr) return false;

    const [openHour, openMin] = openStr.split(":").map(Number);
    const [closeHour, closeMin] = closeStr.split(":").map(Number);
    
    const openTime = openHour * 60 + (openMin || 0);
    const closeTime = closeHour * 60 + (closeMin || 0);

    return currentTime >= openTime && currentTime < closeTime;
  });

  if (openLocations.length === 0) {
    return language === "es"
      ? "En este momento todas nuestras sucursales están cerradas. Nuestro horario general es de lunes a sábado."
      : "All our branches are currently closed. Our general hours are Monday to Saturday.";
  }

  const list = openLocations.map(l => `• ${l.name} (${l.city || ""})`).join("\n");

  return language === "es"
    ? `Sucursales abiertas ahora:\n${list}`
    : `Currently open branches:\n${list}`;
}
