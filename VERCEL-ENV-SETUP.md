# Vercel Environment Variables Setup

## Quick Reference

**File to import:** `.env.production`

---

## Step-by-Step Instructions

### Option 1: Manual Entry (Recommended)

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click **Settings** (left sidebar)
   - Click **Environment Variables**

2. **Add Required Variables**

   **Variable 1 (CRITICAL):**
   ```
   Key:   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   Value: AIzaSyAHU006iaNiNPp0p0bZ_6g2T37Ch-e_Bqs

   Apply to: ✅ Production ✅ Preview ✅ Development
   ```

   **Variable 2 (REQUIRED):**
   ```
   Key:   WEBHOOK_URL
   Value: https://script.google.com/macros/s/AKfycbwRGdRJSI-5JS-tYeDfilllOSyo50uDo68FyyrluPwqz2mq6kn2B4iMS8s0maPy0S7Krw/exec

   Apply to: ✅ Production ✅ Preview ✅ Development
   ```

3. **Add Optional Metadata Variables** (have defaults, but recommended for clarity)

   ```
   Key:   SENDER_NAME
   Value: Uplevel
   Apply to: ✅ Production ✅ Preview ✅ Development

   Key:   ACTIVITY_TYPE
   Value: Form
   Apply to: ✅ Production ✅ Preview ✅ Development

   Key:   CLIENT_ID
   Value: coverco
   Apply to: ✅ Production ✅ Preview ✅ Development

   Key:   COMPANY_ID
   Value: gutterguard1.com
   Apply to: ✅ Production ✅ Preview ✅ Development
   ```

4. **Save and Redeploy**
   - Click **Save** after adding each variable
   - After all variables are added, trigger a new deployment
   - OR: Push a commit to trigger auto-deployment

---

### Option 2: Import from File

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click **Settings** → **Environment Variables**

2. **Click "Import .env"** button (if available)

3. **Paste contents of `.env.production`** or upload the file

4. **Select Environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Click "Import"**

6. **Trigger Redeploy**

---

## Verification Checklist

After setting environment variables, verify each one:

### In Vercel Dashboard

- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = 39 characters (ends with `-e_Bqs`)
- [ ] `WEBHOOK_URL` = Starts with `https://script.google.com`
- [ ] Variables applied to all 3 environments
- [ ] No typos in variable names (case-sensitive)

### After Deployment

Visit production site and check:

1. **Google Maps API Key**
   - [ ] Open browser DevTools → Console
   - [ ] No "InvalidKeyMapError" messages
   - [ ] Type in address field → Autocomplete dropdown appears

2. **Form Submission**
   - [ ] Fill form → Submit → Redirects to /project-received/
   - [ ] Check webhook destination receives data
   - [ ] Try submitting twice quickly → See rate limit error

3. **Inline Errors**
   - [ ] Submit invalid form → See red error banner in form
   - [ ] No alert() popup appears

---

## Common Issues & Solutions

### Issue: "Maps API key is invalid"

**Cause:** Key is truncated or has typos

**Solution:**
1. Check the key length = 39 characters
2. Ensure it ends with `-e_Bqs`
3. Copy-paste directly from `.env.production`
4. Redeploy after updating

---

### Issue: "Webhook configuration missing"

**Cause:** `WEBHOOK_URL` not set

**Solution:**
1. Add `WEBHOOK_URL` environment variable
2. Copy exact URL from `.env.production`
3. Apply to all environments
4. Redeploy

---

### Issue: Form submissions not reaching webhook

**Cause:** Incorrect `WEBHOOK_URL` or webhook permissions

**Solution:**
1. Verify webhook URL is correct
2. Test webhook directly with Postman/curl
3. Check Google Apps Script deployment settings
4. Ensure webhook accepts POST requests
5. Check Vercel function logs for errors

---

### Issue: Rate limiting not working

**Cause:** Using serverless functions (memory resets)

**Note:** In-memory rate limiting resets when serverless functions restart. For production-grade rate limiting, consider:
- Vercel Edge Config
- Redis
- Upstash (serverless Redis)

Current implementation is adequate for moderate traffic.

---

## Environment-Specific Notes

### Production
- Use production Google Apps Script webhook
- Ensure API key has production domain restrictions
- Enable all security features

### Preview (Staging)
- Can use same webhook or separate test webhook
- Same API key (restrict to vercel.app domains)
- Test new features before production

### Development
- Can use same variables as production
- Or use separate test webhook for local development

---

## Security Best Practices

1. **Never commit** `.env.production` or `.env.local` to Git
   - Already in `.gitignore` ✅

2. **Rotate API keys** if exposed
   - Google Cloud Console → Credentials → Regenerate

3. **Monitor webhook** for suspicious activity
   - Check Google Apps Script logs
   - Look for spam submissions

4. **Restrict API key** in Google Cloud Console
   - HTTP referrers: `*.vercel.app/*`, `guttercover.com/*`
   - API restrictions: Maps JavaScript API, Places API

5. **Use separate webhooks** for production vs staging
   - Prevents test data mixing with real leads

---

## Quick Copy-Paste Format

For manual entry in Vercel, copy each line individually:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAHU006iaNiNPp0p0bZ_6g2T37Ch-e_Bqs
WEBHOOK_URL=https://script.google.com/macros/s/AKfycbwRGdRJSI-5JS-tYeDfilllOSyo50uDo68FyyrluPwqz2mq6kn2B4iMS8s0maPy0S7Krw/exec
SENDER_NAME=Uplevel
ACTIVITY_TYPE=Form
CLIENT_ID=coverco
COMPANY_ID=gutterguard1.com
```

---

## Testing Your Setup

After importing variables and deploying:

```bash
# Test Maps API loads (in browser console)
window.google.maps.importLibrary('places').then(() => console.log('✅ Maps API loaded'));

# Test form submission
# 1. Visit production URL
# 2. Fill out form completely
# 3. Submit
# 4. Should redirect to /project-received/
# 5. Check webhook destination for data
```

---

## Support

**If issues persist:**
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Ensure variable names match exactly (case-sensitive)
5. Redeploy after any variable changes

**Reference:** See `audit/FORM-SUBMISSION-AUDIT-2025-11-03.md` for complete technical details
