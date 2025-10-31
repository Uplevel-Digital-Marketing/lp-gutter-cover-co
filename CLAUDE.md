# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gutter Cover Co** - Single-page landing page for Northeast Ohio gutter protection services. Built with Next.js 15, React 19, focused on lead generation through a pre-qualification form with UTM tracking.

**Tech Stack:**
- Next.js 15.2.3 (Pages Router)
- React 19.0.0
- CSS Modules (component-specific styling)
- Google Maps Places API (address autocomplete)
- js-cookie (UTM parameter persistence)

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture

### Pages Router Structure
- `src/pages/index.js` - Main landing page, imports all section components sequentially
- `src/pages/project-received/index.js` - Thank you page after form submission
- `src/pages/api/submit-form.js` - API route that forwards form data + UTM params to Google Apps Script webhook
- `src/pages/_app.js` - Global app wrapper
- `src/pages/_document.js` - Custom document with Google Maps API script tag

### Component Organization
All components in `src/components/` follow single-responsibility principle:

**Header/Footer:**
- `Header.js` - Top navigation with phone number (no mobile menu yet - see TODO.md #2)
- `Footer.js` - Contains placeholder text that needs replacement (TODO.md #6)

**Landing Page Sections (rendered in order on index.js):**
1. `Hero.js` - Hero section with background image (inline style)
2. `ProblemAwareness.js` - Problem identification
3. `SolutionOverview.js` - Solution presentation
4. `WhyDifferent.js` - Differentiation points
5. `Process.js` - Service process explanation
6. `SeasonalAwareness.js` - Seasonal messaging
7. `CustomerJourneys.js` - Customer testimonials/stories
8. `SocialProof.js` - Trust signals, reviews
9. `FAQ.js` - Frequently asked questions
10. `Gallery.js` - Project gallery
11. `ServiceArea.js` - Geographic service coverage
12. `PreQualificationForm.js` - Lead capture form

**Each component has:**
- Corresponding `.module.css` file in `src/styles/`
- Self-contained styling (no global dependencies except globals.css)

### Form & Tracking System

**PreQualificationForm.js** is the core conversion component:

**Form Fields:**
- `name` - Full name
- `phone` - Phone number (auto-formatted via `formatters.js`)
- `email` - Email address
- `address` - Street address with Google Places autocomplete
- `property_type` - Property type selector
- `issue` - Main gutter issue selector
- `details` - Additional details textarea

**UTM Tracking:**
- Captures 6 UTM parameters from URL on page load: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `up_source`
- Stores parameters in cookies (30-day expiry) using js-cookie
- Includes UTM data in form submission payload
- See `UTM-TRACKING.md` for full implementation details

**Form Submission Flow:**
1. User fills form with Google Places address autocomplete
2. Submit triggers POST to `/api/submit-form`
3. API route forwards data to hardcoded Google Apps Script webhook (line 12)
4. On success: redirects to `/project-received/`
5. On error: shows error message (but logs to console - TODO.md #5)

**Data sent to webhook:**
```javascript
{
  // Form data
  name, phone, email, address, property_type, issue, details,
  // Static metadata
  sender: 'Uplevel',
  activity: 'Form',
  client_id: 'coverco',
  company_id: 'gutterguard1.com',
  // UTM tracking
  utm_source, utm_medium, utm_campaign, utm_content, utm_term, up_source
}
```

### Google Maps Integration

**API Key Location:** Currently hardcoded in `src/pages/_document.js:14` - **CRITICAL SECURITY ISSUE** (TODO.md #1)

**Must move to environment variable:**
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

**Usage:** Address autocomplete in PreQualificationForm, restricts to US addresses only.

## Styling Architecture

**CSS Strategy:**
- CSS Modules for component styles (`.module.css`)
- Global styles in `src/styles/globals.css`
- Some inline styles exist (Hero.js background image) - inconsistent pattern (TODO.md #24)

**Naming Convention:** Mix of camelCase/kebab-case - needs standardization (TODO.md #25)

## Critical Known Issues

See `TODO.md` for comprehensive issue list. Top blockers:

1. **Exposed API key** (TODO #1) - Google Maps key in version control
2. **No mobile navigation** (TODO #2) - Site unusable on mobile
3. **Console.log in production** (TODO #5) - Debug statements exposed
4. **Placeholder footer text** (TODO #6) - "Insert footer content here" visible
5. **No error boundaries** (TODO #4) - One crash brings down entire site

**Total tracked issues:** 47 (8 critical, 14 high, 17 medium, 8 low)

## Environment Variables

**Required:**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps Places API key (not yet configured)

**Optional:**
- `WEBHOOK_URL` - Can replace hardcoded webhook URL in submit-form.js (currently unused)

**Missing .gitignore:** Project lacks `.gitignore` - should add to prevent committing `.env.local`, `node_modules/`, `.next/`

## Code Patterns & Conventions

**Component Structure:**
```javascript
import React, { useState, useEffect } from 'react';
import styles from '../styles/ComponentName.module.css';

const ComponentName = () => {
  // Component logic
  return (
    <section className={styles.section}>
      {/* JSX */}
    </section>
  );
};

export default ComponentName;
```

**useRouter Usage:** Only use in page components or guard with null checks (TODO.md #3)

**Phone Formatting:** Use `formatPhoneNumber()` from `src/utils/formatters.js` for consistent (555) 555-5555 format

## Testing UTM Tracking

Append parameters to any URL to test tracking:
```
http://localhost:3000/?utm_source=google&utm_medium=cpc&utm_campaign=spring2023&up_source=partner
```

Parameters persist in cookies for 30 days, included in all subsequent form submissions.

## Deployment Checklist

**Before ANY deployment:**
- [ ] Move Google Maps API key to environment variable
- [ ] Remove all console.log statements
- [ ] Replace footer placeholder text
- [ ] Add mobile navigation menu
- [ ] Create .gitignore file

**Before production launch:**
- [ ] Complete all Critical + High priority items in TODO.md
- [ ] Add SEO meta tags (Open Graph, Twitter Cards)
- [ ] Add Schema.org LocalBusiness markup
- [ ] Optimize images (hero: 832KB, gallery: 400KB+ each)
- [ ] Add error boundaries
- [ ] Test form submission end-to-end

## Project Goals & Context

**Primary Objective:** Lead generation for gutter protection services in Northeast Ohio

**Target Audience:** Homeowners with gutter cleaning/ice dam problems

**Key Metrics:** Form completion rate, UTM source attribution

**Traffic Sources:** Facebook ads (80% mobile), Google Ads, direct

**Conversion Path:** Landing page → Form fill → Webhook → Sales follow-up
