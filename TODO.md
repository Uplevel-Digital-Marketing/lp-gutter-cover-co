# 🔧 MASTER TODO LIST - Gutter Cover Co Landing Page
**Generated:** 2025-10-30
**Total Issues:** 47
**Estimated Fix Time:** 25-32 hours

---

## 📊 ISSUE BREAKDOWN

| Severity | Count | Est. Time |
|----------|-------|-----------|
| 🚨 Critical | 8 | 3-4 hours |
| 🔴 High | 14 | 6-8 hours |
| 🟡 Medium | 17 | 12-15 hours |
| 🟢 Low | 8 | 4-5 hours |

---

## 🚨 CRITICAL ISSUES (Fix Immediately - Blocks Production)

### 1. Exposed Google Maps API Key in Repository
- **File:** `src/pages/_document.js:14`
- **Issue:** API key visible in version control
- **Security Risk:** High - Can be abused, incur charges
- **Fix:**
  ```javascript
  // Move to .env.local
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here

  // Update _document.js:
  <script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`} async defer></script>
  ```
- **Time:** 15 minutes

### 2. Mobile Navigation Completely Missing
- **File:** `src/components/Header.js`
- **Issue:** No mobile menu implementation - site unusable on mobile
- **Impact:** 80% of Facebook traffic is mobile = total conversion loss
- **Fix:** Add hamburger menu with mobile navigation
  ```javascript
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add hamburger button
  <button
    className={styles.mobileMenuButton}
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  >
    ☰
  </button>

  // Add mobile menu overlay
  {mobileMenuOpen && (
    <div className={styles.mobileMenu}>
      <nav>...</nav>
    </div>
  )}
  ```
- **Time:** 2 hours

### 3. useRouter in Reusable Component
- **File:** `src/components/PreQualificationForm.js:8`
- **Issue:** `useRouter()` called unconditionally in component that could be reused
- **Problem:** Causes errors if component used outside Next.js page context
- **Fix:**
  ```javascript
  // Only use router when needed
  const router = useRouter();

  useEffect(() => {
    if (!router) return; // Guard clause
    // UTM logic...
  }, [router]);
  ```
- **Time:** 30 minutes

### 4. No Error Boundaries
- **Files:** All components
- **Issue:** One component crash brings down entire site
- **Fix:** Add error boundary wrapper
  ```javascript
  // Create src/components/ErrorBoundary.js
  class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong. Please refresh.</h1>;
      }
      return this.props.children;
    }
  }

  // Wrap in _app.js
  <ErrorBoundary>
    <Component {...pageProps} />
  </ErrorBoundary>
  ```
- **Time:** 45 minutes

### 5. Console.log Statements in Production
- **Files:** Multiple (PreQualificationForm.js:118, 124)
- **Issue:** Debug logging exposed to users
- **Security:** Could leak sensitive data
- **Fix:** Remove all console.log or use proper logging service
  ```javascript
  // Remove:
  console.error('Form submission failed');
  console.error('Form submission error:', error);

  // Replace with user-facing messages only
  setErrorMessage('Unable to submit form. Please try again.');
  ```
- **Time:** 15 minutes

### 6. Hardcoded Placeholder Text in Production
- **File:** `src/components/Footer.js:20`
- **Issue:** "Insert footer content here" visible in production
- **Impact:** Unprofessional, damages credibility
- **Fix:** Add proper footer content or remove placeholder
- **Time:** 30 minutes

### 7. No 404 Error Page
- **Files:** Missing `src/pages/404.js`
- **Issue:** Users see default Next.js 404 (unprofessional)
- **Fix:** Create custom 404 page
  ```javascript
  // Create src/pages/404.js
  export default function Custom404() {
    return (
      <div>
        <h1>404 - Page Not Found</h1>
        <a href="/">Return Home</a>
      </div>
    );
  }
  ```
- **Time:** 1 hour

### 8. Missing .env.local in .gitignore
- **File:** `.gitignore`
- **Issue:** Environment variables could be committed
- **Fix:**
  ```
  # Add to .gitignore
  .env*.local
  .env.production
  ```
- **Time:** 2 minutes

---

## 🔴 HIGH PRIORITY (Fix Before Launch)

### 9. Missing Essential SEO Meta Tags
- **File:** `src/pages/index.js:20-23`
- **Issue:** No Open Graph, Twitter Cards, or canonical tags
- **Impact:** Poor social sharing, reduced visibility
- **Fix:**
  ```javascript
  <Head>
    <title>Gutter Cover Co | Stop Cleaning Gutters Forever</title>
    <meta name="description" content="Northeast Ohio's trusted gutter protection specialists..." />

    {/* Open Graph */}
    <meta property="og:title" content="Gutter Cover Co | Stop Cleaning Gutters Forever" />
    <meta property="og:description" content="Permanent gutter solutions for Northeast Ohio homes" />
    <meta property="og:image" content="/og-image.jpg" />
    <meta property="og:type" content="website" />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Gutter Cover Co" />
    <meta name="twitter:description" content="Northeast Ohio's #1 Gutter Protection" />

    {/* Canonical */}
    <link rel="canonical" href="https://guttercover.com" />
  </Head>
  ```
- **Time:** 1 hour

### 10. No Schema.org Markup
- **File:** `src/pages/index.js`
- **Issue:** Missing LocalBusiness structured data
- **Impact:** Reduced search visibility, no rich snippets
- **Fix:**
  ```javascript
  <Head>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Gutter Cover Co",
        "image": "https://guttercover.com/logo.png",
        "telephone": "+1-720-613-4362",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Cleveland",
          "addressRegion": "OH",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "41.5052",
          "longitude": "-81.6934"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "347"
        }
      })}
    </script>
  </Head>
  ```
- **Time:** 1.5 hours

### 11. No Visual Form Validation Feedback
- **File:** `src/components/PreQualificationForm.js`
- **Issue:** Fields turn red on error but no explanation shown
- **Impact:** Users don't know what's wrong
- **Fix:**
  ```javascript
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }
    if (name === 'phone' && value.replace(/\D/g, '').length < 10) {
      return 'Phone number must be 10 digits';
    }
    return null;
  };

  // Show error under field
  {errors[field.name] && (
    <span className={styles.errorMessage}>{errors[field.name]}</span>
  )}
  ```
- **Time:** 2 hours

### 12. Color Contrast Failures (WCAG AA)
- **Files:** Multiple components
- **Issue:** Text on backgrounds fails 4.5:1 ratio
- **Violations:**
  - Hero overlay text (3.2:1) - needs darker overlay
  - Footer links (3.8:1) - needs higher contrast
  - Badge backgrounds (4.1:1) - slightly under threshold
- **Fix:** Adjust colors in CSS modules
  ```css
  /* Hero.module.css */
  .overlay {
    background: rgba(0, 0, 0, 0.65); /* Increase from 0.5 */
  }

  /* Footer.module.css */
  .footerLink {
    color: #e0e0e0; /* Lighter gray for better contrast */
  }
  ```
- **Time:** 1 hour

### 13. Images Missing Alt Text
- **Files:** `Gallery.js`, `WhyDifferent.js`, `CustomerJourneys.js`
- **Issue:** Accessibility violation (WCAG 1.1.1)
- **Count:** 14 images missing descriptive alt text
- **Fix:**
  ```javascript
  // Bad:
  <img src="/assets/..." alt="" />

  // Good:
  <img src="/assets/gutter-guards/before.jpg" alt="Clogged gutters filled with leaves and debris before installation" />
  <img src="/assets/gutter-guards/after.jpg" alt="Clean, protected gutters with micro-mesh covers installed" />
  ```
- **Time:** 1 hour

### 14. No Keyboard Focus Indicators
- **Files:** All interactive components
- **Issue:** Keyboard navigation shows no visual focus
- **Fix:** Add focus styles to all interactive elements
  ```css
  /* globals.css */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible {
    outline: 3px solid #0066cc;
    outline-offset: 2px;
  }
  ```
- **Time:** 30 minutes

### 15. External Links Missing Security Attributes
- **File:** `Footer.js` (social media links)
- **Issue:** Links open in new tab without `rel="noopener noreferrer"`
- **Security Risk:** Reverse tabnabbing vulnerability
- **Fix:**
  ```javascript
  <a href="https://facebook.com/..." target="_blank" rel="noopener noreferrer">
    Facebook
  </a>
  ```
- **Time:** 15 minutes

### 16. Unoptimized Images
- **Files:** `/public/assets/` directory
- **Issue:** Large file sizes (832KB hero image, 400KB+ gallery images)
- **Impact:** Slow page load, poor mobile experience
- **Fix:**
  ```bash
  # Install sharp for optimization
  npm install sharp

  # Create optimization script
  node scripts/optimize-images.js

  # Or use online tools:
  # - TinyPNG (https://tinypng.com)
  # - Squoosh (https://squoosh.app)

  # Target sizes:
  # Hero: <200KB
  # Gallery: <100KB each
  ```
- **Time:** 2 hours

### 17. Missing Lazy Loading on Images
- **Files:** `Gallery.js`, `CustomerJourneys.js`
- **Issue:** All images load immediately (unnecessary bandwidth)
- **Fix:**
  ```javascript
  <img
    src="/assets/..."
    alt="..."
    loading="lazy" // Add this
  />
  ```
- **Time:** 15 minutes

### 18. No Loading State for Hero Background
- **File:** `Hero.js:5`
- **Issue:** Background image loads without placeholder (flash of unstyled content)
- **Fix:**
  ```css
  .hero {
    background-color: #2c3e50; /* Fallback color */
    background-image: url(...);
    background-size: cover;
  }
  ```
- **Time:** 10 minutes

### 19. Form Has No Success Message
- **File:** `PreQualificationForm.js:116`
- **Issue:** Redirects immediately without confirmation
- **Impact:** Users unsure if submission worked
- **Fix:**
  ```javascript
  const [showSuccess, setShowSuccess] = useState(false);

  if (response.ok) {
    setShowSuccess(true);
    setTimeout(() => router.push('/project-received/'), 2000);
  }

  {showSuccess && (
    <div className={styles.successMessage}>
      ✓ Thank you! Redirecting...
    </div>
  )}
  ```
- **Time:** 30 minutes

### 20. Missing robots.txt
- **Files:** `/public/robots.txt` (missing)
- **Issue:** No crawl directives for search engines
- **Fix:**
  ```
  # Create /public/robots.txt
  User-agent: *
  Allow: /
  Sitemap: https://guttercover.com/sitemap.xml
  ```
- **Time:** 5 minutes

### 21. Missing sitemap.xml
- **Files:** `/public/sitemap.xml` (missing)
- **Issue:** Search engines can't efficiently crawl site
- **Fix:**
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://guttercover.com/</loc>
      <lastmod>2025-10-30</lastmod>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://guttercover.com/project-received/</loc>
      <lastmod>2025-10-30</lastmod>
      <priority>0.5</priority>
    </url>
  </urlset>
  ```
- **Time:** 30 minutes

### 22. No favicon.ico
- **Files:** `/public/favicon.ico` (missing)
- **Issue:** Browser shows default icon (unprofessional)
- **Fix:** Create and add favicon
  ```html
  <!-- In _document.js -->
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  ```
- **Time:** 30 minutes

---

## 🟡 MEDIUM PRIORITY (Post-Launch Improvements)

### 23. Duplicate CSS in globals.css
- **File:** `src/styles/globals.css`
- **Issue:** Reset styles duplicated from browser defaults
- **Fix:** Use modern CSS reset (e.g., Josh Comeau's CSS Reset)
- **Time:** 1 hour

### 24. Inline Styles in Components
- **Files:** `Hero.js:5`, `FAQ.js` (multiple), `Gallery.js`
- **Issue:** Inconsistent with CSS Modules pattern
- **Fix:** Move all inline styles to respective .module.css files
  ```javascript
  // Before:
  <section style={{ backgroundImage: 'url(...)' }}>

  // After:
  <section className={styles.hero}>

  // In Hero.module.css:
  .hero {
    background-image: url('/assets/heater-cap/heated-gutters-hero.webp');
  }
  ```
- **Time:** 2 hours

### 25. Inconsistent Naming Conventions
- **Files:** Multiple
- **Issue:** Mix of camelCase, kebab-case, PascalCase
- **Examples:**
  - Component files: `PreQualificationForm.js` ✓
  - CSS classes: `form-section`, `formSection` ✗
  - Variables: `formData` ✓, `form_data` ✗
- **Fix:** Standardize to:
  - Components: PascalCase
  - Functions/variables: camelCase
  - CSS classes: camelCase in modules, kebab-case in HTML
- **Time:** 3 hours

### 26. No TypeScript or PropTypes
- **Files:** All components
- **Issue:** No type checking, prone to runtime errors
- **Fix:** Add PropTypes or migrate to TypeScript
  ```javascript
  import PropTypes from 'prop-types';

  PreQualificationForm.propTypes = {
    initialData: PropTypes.object,
    onSuccess: PropTypes.func
  };
  ```
- **Time:** 4 hours (PropTypes) or 12 hours (TypeScript migration)

### 27. Magic Numbers in Code
- **Files:** Multiple
- **Issue:** Hardcoded values without explanation
- **Examples:**
  - Cookie expiry: 30 (days)
  - Phone length: 10 (digits)
  - Redirect delay: not present (should be)
- **Fix:** Extract to constants
  ```javascript
  const COOKIE_EXPIRY_DAYS = 30;
  const US_PHONE_LENGTH = 10;
  const SUCCESS_REDIRECT_DELAY_MS = 2000;
  ```
- **Time:** 1 hour

### 28. No Loading Skeleton for Form
- **File:** `PreQualificationForm.js`
- **Issue:** Form appears instantly (no progressive enhancement)
- **Fix:** Add skeleton loader while Google Maps API loads
- **Time:** 2 hours

### 29. Heading Hierarchy Issues
- **Files:** Multiple sections
- **Issue:** Skipped heading levels (h1 → h3, missing h2)
- **SEO Impact:** Reduced accessibility and SEO
- **Fix:** Ensure proper order: h1 → h2 → h3 → h4
- **Time:** 1 hour

### 30. No Skip to Content Link
- **Files:** All pages
- **Issue:** Keyboard users must tab through entire nav
- **Fix:**
  ```javascript
  // In Header.js
  <a href="#main-content" className={styles.skipLink}>
    Skip to content
  </a>

  // In index.js
  <main id="main-content">
  ```
- **Time:** 30 minutes

### 31. Form Doesn't Capture Referrer
- **File:** `PreQualificationForm.js`
- **Issue:** No tracking of where visitors came from
- **Fix:**
  ```javascript
  useEffect(() => {
    const referrer = document.referrer;
    if (referrer) {
      setFormData(prev => ({ ...prev, referrer }));
    }
  }, []);
  ```
- **Time:** 15 minutes

### 32. No Google Analytics Implementation
- **Files:** Missing GA4 setup
- **Issue:** No conversion tracking, can't measure success
- **Fix:**
  ```javascript
  // In _document.js
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `
  }} />
  ```
- **Time:** 1 hour

### 33. CSS Not Minified
- **Files:** All CSS modules
- **Issue:** CSS not optimized for production
- **Fix:** Ensure Next.js production build minifies CSS
  ```bash
  npm run build
  npm run start
  ```
- **Time:** 10 minutes (verify only)

### 34. No Content Security Policy
- **File:** `next.config.js`
- **Issue:** No CSP headers (security best practice)
- **Fix:**
  ```javascript
  // In next.config.js
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: https:;"
          }
        ]
      }
    ];
  }
  ```
- **Time:** 2 hours

### 35. Phone Number Not Clickable on Desktop
- **File:** `Header.js`
- **Issue:** Phone shows but isn't a link
- **Fix:**
  ```javascript
  <a href="tel:+17206134362" className={styles.phoneLink}>
    (720) 613-4362
  </a>
  ```
- **Time:** 10 minutes

### 36. No Print Styles
- **Files:** All CSS files
- **Issue:** Page prints poorly (backgrounds, colors)
- **Fix:** Add print media query
  ```css
  @media print {
    .no-print { display: none; }
    body { color: #000; background: #fff; }
  }
  ```
- **Time:** 1 hour

### 37. Gallery Images Not Clickable
- **File:** `Gallery.js`
- **Issue:** Users can't view full-size images
- **Fix:** Add lightbox functionality (react-image-lightbox)
- **Time:** 3 hours

### 38. FAQ Not Using <details> Element
- **File:** `FAQ.js`
- **Issue:** Custom accordion instead of semantic HTML
- **Fix:** Use native <details>/<summary> for better accessibility
  ```javascript
  <details>
    <summary>Question here</summary>
    <p>Answer here</p>
  </details>
  ```
- **Time:** 2 hours

### 39. No Cookie Consent Banner
- **Files:** Missing
- **Issue:** Required for GDPR/CCPA compliance
- **Fix:** Add cookie consent library (react-cookie-consent)
- **Time:** 2 hours

---

## 🟢 LOW PRIORITY (Nice to Have)

### 40. No Service Worker / PWA
- **Files:** Missing service worker
- **Issue:** No offline capability, not installable
- **Fix:** Add next-pwa plugin
- **Time:** 3 hours

### 41. No Dark Mode Support
- **Files:** All CSS
- **Issue:** Modern users expect dark mode option
- **Fix:** Add prefers-color-scheme media queries
- **Time:** 4 hours

### 42. Animation Performance Not Optimized
- **Files:** Components with animations
- **Issue:** Not using transform/opacity for animations (causes reflow)
- **Fix:** Use GPU-accelerated properties only
- **Time:** 2 hours

### 43. No Breadcrumbs
- **Files:** All pages
- **Issue:** Users can't track their location in site hierarchy
- **Fix:** Add breadcrumb navigation
- **Time:** 1 hour

### 44. Copyright Year Hardcoded in Schema
- **File:** Footer (if schema added)
- **Issue:** Will need manual update each year
- **Fix:** Use dynamic year: `{new Date().getFullYear()}`
- **Time:** 5 minutes

### 45. No Social Sharing Buttons
- **Files:** All pages
- **Issue:** Users can't easily share content
- **Fix:** Add share buttons (Facebook, Twitter, Email)
- **Time:** 2 hours

### 46. Missing Testimonials Schema
- **File:** `SocialProof.js`
- **Issue:** Reviews not marked up for rich snippets
- **Fix:** Add Review schema markup
- **Time:** 1 hour

### 47. No A/B Testing Framework
- **Files:** Missing
- **Issue:** Can't test conversion optimizations
- **Fix:** Add Google Optimize or Vercel Edge Middleware
- **Time:** 4 hours

---

## 📋 IMPLEMENTATION ROADMAP

### Phase 1: Critical Fixes (Week 1) - **3-4 hours**
- [ ] #5 Remove console.log statements
- [ ] #8 Add .env.local to .gitignore
- [ ] #1 Move API key to environment variable
- [ ] #6 Remove placeholder text from Footer
- [ ] #7 Create custom 404 page
- [ ] #3 Fix useRouter usage in PreQualificationForm
- [ ] #4 Add error boundaries
- [ ] #2 Implement mobile navigation

### Phase 2: High Priority (Week 2) - **6-8 hours**
- [ ] #9 Add SEO meta tags (Open Graph, Twitter Cards)
- [ ] #10 Add Schema.org LocalBusiness markup
- [ ] #15 Add security attributes to external links
- [ ] #18 Add loading state for hero background
- [ ] #20 Create robots.txt
- [ ] #21 Create sitemap.xml
- [ ] #22 Add favicon
- [ ] #17 Add lazy loading to images
- [ ] #14 Add keyboard focus indicators
- [ ] #11 Implement form validation feedback
- [ ] #12 Fix color contrast issues
- [ ] #13 Add alt text to all images
- [ ] #19 Add form success message

### Phase 3: Medium Priority (Weeks 3-4) - **12-15 hours**
- [ ] #16 Optimize all images
- [ ] #24 Move inline styles to CSS modules
- [ ] #32 Implement Google Analytics
- [ ] #31 Capture referrer in form
- [ ] #35 Make desktop phone number clickable
- [ ] #37 Add gallery lightbox
- [ ] #38 Convert FAQ to semantic HTML
- [ ] #39 Add cookie consent banner
- [ ] #30 Add skip to content link
- [ ] #29 Fix heading hierarchy
- [ ] #34 Add Content Security Policy
- [ ] #27 Extract magic numbers to constants
- [ ] #23 Clean up duplicate CSS

### Phase 4: Low Priority (Month 2+) - **4-5 hours**
- [ ] #26 Add PropTypes or migrate to TypeScript
- [ ] #25 Standardize naming conventions
- [ ] #28 Add form loading skeleton
- [ ] #33 Verify CSS minification
- [ ] #36 Add print styles
- [ ] #40 Add PWA support
- [ ] #41 Implement dark mode
- [ ] #42 Optimize animation performance
- [ ] #43 Add breadcrumbs
- [ ] #45 Add social sharing buttons
- [ ] #46 Add testimonials schema
- [ ] #47 Implement A/B testing framework

---

## 🎯 PRIORITY QUICK REFERENCE

### Must Fix Before ANY Deployment:
1. Exposed API key (#1)
2. Mobile navigation (#2)
3. Console.log statements (#5)
4. Placeholder text (#6)

### Must Fix Before Production Launch:
- All Critical items
- All High Priority items
- Image optimization (#16)
- Form validation (#11)

### Can Deploy Without (But Should Fix Soon):
- Medium priority items
- Low priority items

---

## 📊 TRACKING PROGRESS

Update this checklist as items are completed. Mark with:
- [ ] Not started
- [x] Completed
- [~] In progress
- [!] Blocked

**Last Updated:** 2025-10-30
**Completed:** 0/47 (0%)
**In Progress:** 0/47
**Remaining:** 47/47

---

## 🔗 USEFUL RESOURCES

- [Next.js Documentation](https://nextjs.org/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)
- [Open Graph Protocol](https://ogp.me/)

---

**Notes:**
- Issues numbered for easy reference (#1-47)
- Time estimates are approximate
- Some fixes may address multiple issues simultaneously
- Re-audit after Phase 1 and Phase 2 completion
