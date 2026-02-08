# LAVANDERÍA ORIENTAL - SISTEMA COMPLETO
## WhatsApp AI Concierge + Admin Dashboard + Marketing Website

---

## 📋 SYSTEM OVERVIEW

This is a **complete AI-powered customer service system** for Lavandería Oriental, consisting of:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Marketing Website** | Next.js 14 | Public-facing website (lavanderiaoriental.com.sv) |
| **WhatsApp AI Concierge** | Claude AI + Twilio | 24/7 automated customer service |
| **Admin Dashboard** | React + Vite | Staff management interface |
| **Database** | PostgreSQL (Supabase) | Customer, order, conversation data |

---

## 🗄️ DATABASE SCHEMA (13 Tables)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LAVANDERÍA ORIENTAL DB                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐    ┌──────────────┐    ┌──────────┐                   │
│  │ customers │───▶│ conversations │───▶│ messages  │                   │
│  └──────────┘    └──────────────┘    └──────────┘                   │
│       │                  │                                            │
│       │                  │                                            │
│       ▼                  ▼                                            │
│  ┌──────────┐    ┌────────────┐    ┌─────────────┐                  │
│  │  orders   │    │ escalations │    │ daily_reports│                  │
│  └──────────┘    └────────────┘    └─────────────┘                  │
│                                                                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐                   │
│  │ locations │    │ services  │    │ service_cats  │                   │
│  └──────────┘    └──────────┘    └──────────────┘                   │
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────┐            │
│  │ knowledge_base│    │ notifications │    │ system_config│            │
│  └──────────────┘    └──────────────┘    └─────────────┘            │
│                                                                       │
│  ┌──────────┐                                                        │
│  │  users   │ (Admin auth)                                           │
│  └──────────┘                                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 DEPLOYMENT GUIDE

### Step 1: Supabase Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project in region closest to El Salvador (us-east-1)
   - Note your project URL and anon/service keys

2. **Run Schema SQL**
   ```bash
   # In Supabase SQL Editor, run:
   # database/schema.sql (creates all 13 tables)
   # database/seed.sql (populates initial data)
   ```

3. **Get Connection String**
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```

### Step 2: WhatsApp Business API (Twilio)

1. **Create Twilio Account**
   - Sign up at [twilio.com](https://twilio.com)
   - Enable WhatsApp Sandbox or Business API

2. **Get Credentials**
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxx
   TWILIO_WHATSAPP_NUMBER=whatsapp:+503xxxxxxxx
   ```

3. **Configure Webhook**
   ```
   Webhook URL: https://your-domain.vercel.app/api/webhook/whatsapp
   Method: POST
   ```

### Step 3: Claude AI API

1. **Get Anthropic API Key**
   - Sign up at [console.anthropic.com](https://console.anthropic.com)
   - Create API key

2. **Add to Environment**
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx
   ```

### Step 4: Deploy Backend + Dashboard

**Option A: Vercel (Recommended)**

```bash
# Clone repository
git clone https://github.com/YOUR_ORG/lavanderia-oriental.git
cd lavanderia-oriental

# Install dependencies
npm install

# Set environment variables in Vercel dashboard
# Then deploy
vercel --prod
```

**Option B: Railway/Render**

```bash
# Push to GitHub
# Connect to Railway/Render
# Set environment variables
# Deploy
```

### Step 5: Deploy Marketing Website

```bash
cd lavanderia-oriental-website
npm install
npm run build
vercel --prod
```

---

## 🔧 ENVIRONMENT VARIABLES

Create `.env` file:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
SUPABASE_URL=https://PROJECT.supabase.co
SUPABASE_ANON_KEY=eyJxxxxxxxxxx
SUPABASE_SERVICE_KEY=eyJxxxxxxxxxx

# AI (Anthropic Claude)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxx

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+50379475950
WHATSAPP_VERIFY_TOKEN=lavanderia_oriental_verify_token

# App
NODE_ENV=production
PORT=5000
```

---

## 📱 WHATSAPP AI FEATURES

### Automated Responses
- Prices and services information
- Location and hours
- Delivery availability
- Order status inquiries
- FAQ handling

### Smart Escalation
Automatically escalates to human when:
- Customer mentions: queja, reclamo, daño, gerente
- Customer explicitly requests human agent
- AI confidence is low
- Technical error occurs

### Sample Conversation Flow

```
Customer: Hola, cuánto cuesta lavar?
AI: Nuestros precios son:
    - Carga Normal: $3 lavado / $5.50 lavado+secado
    - Carga Pesada: $3.50 lavado / $6.50 lavado+secado
    
    ¿En qué sucursal te queda más cerca?

Customer: San Miguel
AI: ¡Perfecto! En San Miguel tenemos dos sucursales:
    - Casa Matriz en Col. Ciudad Real
    - Col. Gavidia en 10 av norte
    
    Ambas abren de 7am-6pm (L-S) y 7am-5pm (D).
    ¿Te gustaría delivery? Cuesta $2 total. 🚗
```

---

## 🖥️ ADMIN DASHBOARD FEATURES

### Dashboard Home
- Total conversations
- Active chats
- AI resolution rate
- Customer satisfaction
- Real-time activity feed

### Conversations
- View all WhatsApp conversations
- Filter by status (active, escalated, resolved)
- Read full chat history
- Take over from AI

### Customers
- Customer profiles by phone number
- Order history
- VIP status management
- Total spend tracking

### Locations
- Manage 5 branches
- Update hours and delivery zones
- Enable/disable locations

### Analytics
- Daily/weekly/monthly reports
- AI vs human resolution rates
- Revenue tracking
- Customer acquisition

---

## 📂 PROJECT STRUCTURE

```
lavanderia-oriental/
├── client/                 # React Admin Dashboard
│   └── src/
│       ├── components/     # UI components
│       ├── pages/          # Dashboard pages
│       ├── hooks/          # Custom hooks
│       └── lib/            # Utilities
├── server/                 # Express Backend
│   ├── services/
│   │   ├── ai-engine.ts    # Claude AI integration
│   │   ├── whatsapp.ts     # Twilio WhatsApp
│   │   ├── analytics.ts    # Reporting
│   │   └── seed-data.ts    # Initial data
│   ├── routes.ts           # API endpoints
│   └── db.ts               # Database connection
├── shared/
│   └── schema.ts           # Drizzle ORM schema
├── database/
│   ├── schema.sql          # PostgreSQL DDL
│   └── seed.sql            # Initial data
└── api/
    └── index.ts            # Vercel serverless entry
```

---

## 🔌 API ENDPOINTS

### WhatsApp Webhook
```
POST /api/webhook/whatsapp  - Incoming messages
GET  /api/webhook/whatsapp  - Verification
```

### Dashboard APIs
```
GET /api/dashboard/stats     - Dashboard statistics
GET /api/dashboard/messages  - Recent messages
GET /api/dashboard/activities - Activity feed
GET /api/dashboard/escalations - Pending escalations
```

### Data APIs
```
GET /api/conversations       - List conversations
GET /api/customers           - List customers
GET /api/locations           - Location list
GET /api/services            - Service catalog
GET /api/orders              - Order list
GET /api/knowledge-base      - FAQ database
GET /api/analytics/summary   - Analytics overview
```

---

## 💰 PRICING TABLE (Pre-loaded)

### Cargas de Ropa
| Servicio | Solo Lavado | Lavado + Secado |
|----------|-------------|-----------------|
| Carga Normal | $3.00 | $5.50 |
| Carga Pesada | $3.50 | $6.50 |

### DRIP Zapatos
| Servicio | Precio |
|----------|--------|
| DRIP Básico | $9.90 |
| DRIP Especial | $12.90 |
| DRIP Premium | $16.90 |
| DRIP Niños | $5.90 |

### Delivery
| Servicio | Precio |
|----------|--------|
| Recogida + Entrega | $2.00 |

---

## 📞 SUPPORT

**Client:** Fabricio Estrada  
**WhatsApp:** +503 7947-5950  
**Domain:** lavanderiaoriental.com.sv

**Built by:** MachineMind Consulting  
**Contact:** phil@machinemindconsulting.com

---

## ⚡ QUICK DEPLOY CHECKLIST

- [ ] Create Supabase project
- [ ] Run schema.sql in SQL Editor
- [ ] Run seed.sql in SQL Editor
- [ ] Create Twilio account
- [ ] Enable WhatsApp Sandbox/Business
- [ ] Get Anthropic API key
- [ ] Clone repository
- [ ] Set environment variables
- [ ] Deploy to Vercel
- [ ] Configure Twilio webhook URL
- [ ] Test WhatsApp messaging
- [ ] Verify admin dashboard
- [ ] Connect custom domain
