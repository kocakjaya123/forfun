# 🚀 Deployment Guide - LifeQuest

## Vercel Deployment Setup

### Step 1: Set Environment Variables

The application requires Supabase credentials to connect to the database. These must be configured in Vercel before deployment.

**Go to Vercel Dashboard:**
1. Visit https://vercel.com/dashboard
2. Select your **LifeQuest** project
3. Click **Settings**
4. Click **Environment Variables** in the sidebar

**Add the following variables:**

```
Name: VITE_SUPABASE_URL
Value: https://ovkefkvrpzzxqkylyiaz.supabase.co
Environments: Production, Preview, Development
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: sb_publishable_DglNDUNipKiaG1IG_eAq1w_3HAR7lWz
Environments: Production, Preview, Development
```

### Step 2: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the three dots (•••) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 3: Verify

Once deployed:
1. Visit your app URL
2. The WelcomeModal should appear without Supabase errors
3. Check browser console (F12) - no error about "supabaseUrl is required"

---

## Local Development Setup

1. Create `.env.local` file in root directory (template in `.env.example`)
2. Add your Supabase credentials
3. Run `npm run dev`

**Don't commit `.env.local` to git!** It's already in `.gitignore`

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://*****.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase public API key | `sb_publishable_***` |

---

## Troubleshooting

**"Missing Supabase environment variables" error:**
- Verify env vars are set in Vercel Settings > Environment Variables
- Redeploy the project
- Wait for deployment to complete (not just "Ready")

**404 error on favicon:**
- Favicon.svg exists in `/public/favicon.svg`
- Should auto-serve from Vercel

**Database connection fails:**
- Check Supabase project is active and running
- Verify credentials are correct (copy-paste from Supabase dashboard)
- Check network tab for CORS issues

---

## Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Check for errors
npm run lint
```
