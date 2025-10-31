# 🔧 Vercel Deployment Troubleshooting

## Current Issue: 404 Error + Google Maps Invalid Key

### Root Cause
The Google Places API crashes before the page loads, causing a 404 error.

### Fix Applied
✅ Added error handling to Google Places API initialization (just pushed to GitHub)

---

## ⚠️ Critical: Verify Environment Variables in Vercel

### Step-by-Step Check:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select project: `lp-gutter-cover-co`

2. **Check Environment Variables:**
   - Settings → Environment Variables
   - Verify these EXACT variable names exist:

   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   WEBHOOK_URL
   ```

3. **Common Mistakes:**
   - ❌ Variable name typo (case-sensitive!)
   - ❌ Missing `NEXT_PUBLIC_` prefix on Maps key
   - ❌ Not selected for "Production" environment
   - ❌ Extra spaces in variable value
   - ❌ Quotes around value (don't add quotes!)

4. **Correct Configuration:**

   **Variable 1:**
   ```
   Name: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   Value: AIzaSyAHU006iaNiNPp0p0bZ_6g2T37Ch-e_Bqs
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   **Variable 2:**
   ```
   Name: WEBHOOK_URL
   Value: https://script.google.com/macros/s/AKfycbwRGdRJSI-5JS-tYeDfilllOSyo50uDo68FyyrluPwqz2mq6kn2B4iMS8s0maPy0S7Krw/exec
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

5. **After Adding/Fixing Variables:**
   - Click "Redeploy" in Vercel dashboard
   - OR wait for automatic deployment from GitHub push (just completed)

---

## 🔍 Additional Checks

### Check 1: Google Maps API Key Valid

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key: `AIzaSyAHU006iaNiNPp0p0bZ_6g2T37Ch-e_Bqs`
3. Verify:
   - ✅ Places API is enabled
   - ✅ No restrictions blocking vercel.app domain
   - ✅ Key is not expired/disabled

### Check 2: Vercel Deployment Logs

1. Vercel Dashboard → Deployments → Latest deployment
2. Check "Build Logs" for errors
3. Check "Runtime Logs" for errors

Common errors:
- "Module not found" → Missing dependency
- "Invalid API key" → Env var not set correctly
- "404" → Route not found or build failed

### Check 3: Browser Console

After deployment, open site and check console:
- ✅ No "Cannot read properties of undefined"
- ✅ No "InvalidKey" warnings
- ✅ Page loads without errors

---

## 🚀 Manual Redeploy Steps

If Vercel hasn't auto-deployed the latest fix:

1. **Trigger New Deployment:**
   - Vercel Dashboard → Project
   - Deployments tab → Top deployment
   - Click "..." menu → Redeploy

2. **Or Force Push to GitHub:**
   ```bash
   git commit --allow-empty -m "chore: trigger Vercel redeploy"
   git push origin main
   ```

---

## ✅ Expected Behavior After Fix

### On Homepage (/)
- ✅ Page loads without 404
- ✅ Mobile menu works
- ✅ Form is visible
- ✅ Address input works (with or without autocomplete)
- ✅ No console errors (except deprecation warning - safe to ignore)

### If Google Maps Still Shows Warning
**This is OK:**
```
"InvalidKey" warning → API key not configured or restricted
```

**The form will still work!** Address input becomes a regular text field.

**To fix warning permanently:**
- Add Vercel domain to Google Cloud Console API restrictions
- Or remove domain restrictions from API key

---

## 🎯 Quick Test Checklist

After redeployment, test these on Vercel URL:

**Mobile (Use phone or Chrome DevTools):**
- [ ] Page loads (no 404)
- [ ] Hamburger menu opens/closes
- [ ] Form inputs don't zoom on iOS
- [ ] Can fill out and submit form
- [ ] No JavaScript errors in console

**Desktop:**
- [ ] Page loads
- [ ] Navigation visible (no hamburger)
- [ ] Form works
- [ ] 2-column layout

---

## 📞 If Still Having Issues

### Get Deployment URL:
- Vercel Dashboard → Project → Latest deployment URL
- Share the full error message from browser console
- Check Vercel Runtime Logs for server errors

### Common Solutions:

**404 Error Persists:**
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+F5)
- Try incognito/private window
- Check Vercel deployment status (Building → Ready)

**Environment Variables Not Working:**
- Must redeploy after adding env vars
- Check variable names EXACTLY match
- Verify "Production" is checked

**Form Not Submitting:**
- Check WEBHOOK_URL is set
- Test webhook endpoint directly
- Check browser network tab for failed requests

---

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Homepage loads without 404
2. ✅ No red errors in browser console
3. ✅ Form can be filled out
4. ✅ Mobile menu functions properly
5. ⚠️ Only warning: Google Maps deprecation (safe to ignore)

---

**Latest fix pushed to GitHub.** Vercel will auto-deploy in ~2-3 minutes.

Check deployment status: https://vercel.com/dashboard
