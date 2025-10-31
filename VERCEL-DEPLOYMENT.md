# 🚀 Vercel Deployment Guide - Gutter Cover Co Landing Page

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import from GitHub: `Uplevel-Digital-Marketing/lp-gutter-cover-co`

2. **Configure Environment Variables:**
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAHU006iaNiNPp0p0bZ_6g2T37Ch-e_Bqs
   WEBHOOK_URL=https://script.google.com/macros/s/AKfycbwRGdRJSI-5JS-tYeDfilllOSyo50uDo68FyyrluPwqz2mq6kn2B4iMS8s0maPy0S7Krw/exec
   ```

3. **Deploy:**
   - Click "Deploy"
   - Vercel auto-detects Next.js configuration
   - First deployment ~2-3 minutes

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: lp-gutter-cover-co
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
vercel env add WEBHOOK_URL

# Deploy to production
vercel --prod
```

---

## Required Environment Variables

**CRITICAL:** These must be added to Vercel before deployment works:

### 1. NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- **Value:** `AIzaSyAHU006iaNiNPp0p0bZ_6g2T37Ch-e_Bqs`
- **Purpose:** Google Places API for address autocomplete
- **Scope:** Production, Preview, Development

### 2. WEBHOOK_URL
- **Value:** `https://script.google.com/macros/s/AKfycbwRGdRJSI-5JS-tYeDfilllOSyo50uDo68FyyrluPwqz2mq6kn2B4iMS8s0maPy0S7Krw/exec`
- **Purpose:** Form submission endpoint (Google Apps Script)
- **Scope:** Production, Preview, Development

**In Vercel Dashboard:**
1. Project Settings → Environment Variables
2. Add each variable above
3. Select "Production", "Preview", "Development"
4. Save

---

## Vercel Configuration

### Auto-Detected Settings ✅

Vercel will automatically detect:
- **Framework:** Next.js 15.2.3
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `next dev`

**No vercel.json needed** - Next.js is auto-configured.

### Custom Domain Setup (Optional)

```bash
# Add custom domain in Vercel dashboard
# Project Settings → Domains → Add Domain

# Recommended: guttercover.com
# Auto-configures DNS and SSL certificate
```

---

## Post-Deployment Checklist

### After First Deploy:

1. **Update URLs in Code:**
   - [ ] Update canonical URL in `src/pages/index.js`
   - [ ] Update Open Graph URLs
   - [ ] Update Schema.org URL
   - [ ] Update sitemap.xml domain

2. **Test Production Site:**
   - [ ] Test mobile menu on real iPhone
   - [ ] Test form submission end-to-end
   - [ ] Verify Google Places autocomplete works
   - [ ] Test UTM parameter tracking
   - [ ] Check all images load
   - [ ] Verify no console errors

3. **SEO Setup:**
   - [ ] Submit sitemap to Google Search Console
   - [ ] Verify robots.txt accessible
   - [ ] Test social media sharing (Facebook, Twitter)
   - [ ] Check Schema.org markup with Rich Results Test

4. **Analytics:**
   - [ ] Add Google Analytics 4 (optional)
   - [ ] Set up Vercel Analytics (optional)
   - [ ] Configure conversion tracking

---

## Deployment Configuration

### Build Settings (Auto-Configured)

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Environment Variables Required

```bash
# Production
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAHU006iaNiNPp0p0bZ_6g2T37Ch-e_Bqs
WEBHOOK_URL=https://script.google.com/macros/s/AKfycbwRGdRJSI-5JS-tYeDfilllOSyo50uDo68FyyrluPwqz2mq6kn2B4iMS8s0maPy0S7Krw/exec
```

---

## Troubleshooting

### Common Issues:

**Build Fails:**
- Verify `package.json` has all dependencies
- Check Node.js version (Vercel uses Node 18+)
- Review build logs in Vercel dashboard

**Environment Variables Not Working:**
- Ensure variables are set for Production environment
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)

**Google Maps Not Loading:**
- Verify API key is set in Vercel env vars
- Check API key has Places API enabled
- Verify domain is authorized in Google Cloud Console

**Form Submissions Failing:**
- Check WEBHOOK_URL is set correctly
- Verify Google Apps Script webhook is accessible
- Test webhook URL directly with curl/Postman

---

## Performance Optimizations (Already Configured)

### ✅ Built-In Next.js Optimizations:
- Image optimization (automatic)
- Font optimization (automatic)
- Code splitting (automatic)
- Static page generation (automatic)
- CSS minification (automatic)
- JavaScript minification (automatic)

### ✅ Vercel Edge Network:
- Global CDN (automatic)
- SSL certificate (automatic)
- HTTP/2 (automatic)
- Brotli compression (automatic)

---

## Monitoring & Analytics

### Vercel Analytics (Optional - Paid Feature)
```bash
npm install @vercel/analytics

# Add to _app.js:
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### Vercel Web Vitals (Free)
- Automatic Core Web Vitals tracking
- View in Vercel Dashboard → Analytics
- Monitors LCP, FID, CLS

---

## Continuous Deployment

**Auto-Deploy on Git Push:** ✅ Enabled by default

- Push to `main` → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployment with URL

---

## Pre-Launch Checklist

### Code Quality ✅
- [x] .gitignore configured
- [x] No secrets in code
- [x] Environment variables documented
- [x] Mobile-first optimized
- [x] Error boundaries implemented
- [x] Form validation working

### SEO Ready ✅
- [x] Meta tags (OG, Twitter)
- [x] Schema.org markup
- [x] robots.txt
- [x] sitemap.xml
- [x] Canonical URLs

### Performance ✅
- [x] Images optimized (using Next.js Image)
- [x] 16px form inputs (prevents iOS zoom)
- [x] Touch targets 44px+
- [x] Google Maps async loading
- [x] No console errors

### Mobile-First ✅
- [x] Responsive navigation
- [x] Single-column mobile form
- [x] Full-width mobile buttons
- [x] No horizontal scroll
- [x] Touch-friendly UI

---

## Important Notes

### Domain Configuration
After deploying, update these URLs from placeholder to actual domain:

**Files to update:**
- `src/pages/index.js` - Open Graph URLs, Twitter URLs, canonical
- `public/sitemap.xml` - Change guttercover.com to actual domain

### Security
- `.env.local` is in `.gitignore` ✅
- API keys secured in Vercel environment ✅
- Webhook URL not exposed in client code ✅

### Custom Domain DNS
If using custom domain (e.g., guttercover.com):

```
# Add these DNS records:
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Support

**Vercel Documentation:**
- https://vercel.com/docs/frameworks/nextjs
- https://vercel.com/docs/environment-variables
- https://vercel.com/docs/custom-domains

**Project Repository:**
- https://github.com/Uplevel-Digital-Marketing/lp-gutter-cover-co

---

**Ready to deploy!** Just connect the repo in Vercel dashboard and add environment variables.
