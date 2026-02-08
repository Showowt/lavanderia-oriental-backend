# Lavandería Oriental - Quick Deploy Guide

## Option A: GitHub → Vercel (Recommended)

### Step 1: Create GitHub Repository
```bash
# In GitHub, create a new repo named "lavanderia-oriental"
# Then run these commands locally:

cd /path/to/Lavenderia-Oriental
git remote add origin https://github.com/YOUR_USERNAME/lavanderia-oriental.git
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select "lavanderia-oriental"
4. Configure environment variables:
   - `DATABASE_URL` → Your Supabase connection string
   - `ANTHROPIC_API_KEY` → Your Claude API key
   - `TWILIO_ACCOUNT_SID` → (optional, for WhatsApp)
   - `TWILIO_AUTH_TOKEN` → (optional, for WhatsApp)
   - `TWILIO_PHONE_NUMBER` → (optional, for WhatsApp)
   - `WHATSAPP_VERIFY_TOKEN` → (optional, for WhatsApp)
5. Click "Deploy"

### Step 3: Configure Supabase
```bash
# Run migrations
npm run db:push
```

---

## Option B: Direct Vercel CLI

```bash
cd /path/to/Lavenderia-Oriental
npm install
vercel login
vercel deploy --prod
```

When prompted, set environment variables in Vercel dashboard.

---

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection | `postgresql://...` |
| `ANTHROPIC_API_KEY` | Claude API key | `sk-ant-...` |
| `TWILIO_ACCOUNT_SID` | Twilio account (optional) | `AC...` |
| `TWILIO_AUTH_TOKEN` | Twilio auth (optional) | `...` |
| `TWILIO_PHONE_NUMBER` | WhatsApp number (optional) | `+503...` |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification (optional) | `random-string` |

---

## Post-Deploy Verification

1. **Health Check**: `https://your-app.vercel.app/api/health`
2. **Dashboard**: `https://your-app.vercel.app/`
3. **WhatsApp Webhook**: `https://your-app.vercel.app/api/webhook/whatsapp`

---

## Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

The app will auto-seed sample data on first deploy.
