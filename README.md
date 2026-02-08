# Lavandería Oriental - WhatsApp AI Concierge

🧺 **AI-powered WhatsApp customer service system for Lavandería Oriental**, a laundry chain in El Salvador with 5 locations.

Built by [MachineMind Consulting](https://machinemindconsulting.com)

## Features

- **24/7 AI Response** - Instant WhatsApp replies powered by Claude AI
- **Multi-Location Support** - 5 active locations with delivery zones
- **Bilingual** - Natural Spanish conversation with English fallback
- **Order Tracking** - Customer order status and notifications
- **Smart Escalation** - Automatic handoff to human staff when needed
- **Admin Dashboard** - Real-time analytics and conversation management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Express 5, Node.js ESM, TypeScript |
| Database | PostgreSQL (Supabase), Drizzle ORM |
| AI | Claude claude-sonnet-4-20250514 (Anthropic) |
| Messaging | Twilio WhatsApp Business API |
| Hosting | Vercel |

## Project Structure

```
├── client/              # React frontend
│   └── src/
│       ├── components/  # UI components (shadcn/ui)
│       ├── pages/       # Route pages
│       ├── hooks/       # Custom React hooks
│       └── lib/         # Utilities
├── server/              # Express backend
│   ├── services/        # Business logic
│   │   ├── ai-engine.ts      # Claude AI integration
│   │   ├── whatsapp.ts       # Twilio WhatsApp
│   │   ├── knowledge-retrieval.ts
│   │   ├── analytics.ts
│   │   └── notification-scheduler.ts
│   ├── routes.ts        # API endpoints
│   └── db.ts            # Database connection
├── shared/              # Shared types & schemas
│   └── schema.ts        # Drizzle schema (11 tables)
└── dist/                # Production build output
```

## Database Schema

11 tables supporting full customer service operations:

- `customers` - Customer profiles by phone number
- `conversations` - Chat sessions with status tracking
- `messages` - Individual messages (inbound/outbound)
- `orders` - Order management with status workflow
- `locations` - 5 laundry locations with hours & delivery
- `services` - Service catalog with pricing
- `service_categories` - Service groupings
- `knowledge_base` - FAQ and AI training data
- `notifications` - Scheduled customer notifications
- `escalations` - Human handoff tracking
- `daily_reports` - Analytics aggregation

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (or npm)
- Supabase account
- Anthropic API key
- Twilio account with WhatsApp

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/lavanderia-oriental.git
cd lavanderia-oriental

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `ANTHROPIC_API_KEY` | Claude API key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | WhatsApp number (format: `whatsapp:+503XXXXXXXX`) |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification token |

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to `main`

### Build Commands

```bash
pnpm build    # Build for production
pnpm start    # Start production server
pnpm check    # TypeScript type checking
```

## API Endpoints

### WhatsApp Webhook
- `POST /api/webhook/whatsapp` - Incoming messages
- `GET /api/webhook/whatsapp` - Verification

### Dashboard
- `GET /api/conversations` - List conversations
- `GET /api/customers` - List customers
- `GET /api/analytics/summary` - Dashboard stats
- `GET /api/locations` - Location list
- `GET /api/services` - Service catalog

## Locations

| # | Location | Status |
|---|----------|--------|
| 1 | San Miguel | ✅ Active |
| 2 | Usulután | ✅ Active |
| 3 | Lourdes Colón | ✅ Active |
| 4 | Santa Ana | ✅ Active |
| 5 | La Unión | ✅ Active |

## License

MIT © MachineMind Consulting

---

**Contact:** phil@machinemindconsulting.com | WhatsApp: +1 954-445-1638
