const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runAudit() {
  const results = {
    mobile: {},
    desktop: {},
    performance: {},
    console: [],
    network: [],
    accessibility: {},
    timestamp: new Date().toISOString()
  };

  const browser = await chromium.launch({ headless: true });

  try {
    // ===== MOBILE TESTING (iPhone SE 375x667) =====
    console.log('\n📱 Starting Mobile Audit (iPhone SE 375x667)...\n');

    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    });

    const mobilePage = await mobileContext.newPage();

    // Capture console messages
    mobilePage.on('console', msg => {
      results.console.push({ type: msg.type(), text: msg.text(), context: 'mobile' });
    });

    // Capture network requests
    mobilePage.on('response', response => {
      results.network.push({
        url: response.url(),
        status: response.status(),
        type: response.request().resourceType(),
        context: 'mobile'
      });
    });

    // Navigate and wait for load
    console.log('Navigating to http://localhost:3000...');
    await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(2000); // Extra wait for any animations

    console.log('✓ Page loaded\n');

    // Take full page screenshot
    console.log('Capturing mobile screenshots...');
    await mobilePage.screenshot({
      path: '/tmp/mobile-full-page.png',
      fullPage: true
    });

    // Hero section screenshot
    await mobilePage.screenshot({
      path: '/tmp/mobile-hero.png',
      clip: { x: 0, y: 0, width: 375, height: 667 }
    });

    console.log('✓ Screenshots saved\n');

    // Test 1: Check if hamburger menu exists
    console.log('Testing mobile navigation...');
    const hamburger = await mobilePage.$('[aria-label*="menu" i], button.hamburger, button[aria-controls="mobile-menu"]');
    results.mobile.hasHamburger = !!hamburger;

    if (hamburger) {
      // Get bounding box to check touch target size
      const box = await hamburger.boundingBox();
      results.mobile.hamburgerSize = box ? { width: box.width, height: box.height } : null;
      results.mobile.hamburgerTouchTarget = box && box.width >= 44 && box.height >= 44 ? 'PASS' : 'FAIL';

      // Test menu open/close
      await hamburger.click();
      await mobilePage.waitForTimeout(500);
      const menuOpen = await mobilePage.$('[role="dialog"], .mobile-menu.open, nav.open');
      results.mobile.menuOpens = !!menuOpen;

      if (menuOpen) {
        await mobilePage.screenshot({ path: '/tmp/mobile-menu-open.png' });
        // Close menu
        const closeButton = await mobilePage.$('button[aria-label*="close" i]');
        if (closeButton) {
          await closeButton.click();
          await mobilePage.waitForTimeout(500);
        }
      }
    }
    console.log('✓ Navigation tested\n');

    // Test 2: Check phone number is clickable
    console.log('Testing phone number link...');
    const phoneLink = await mobilePage.$('a[href^="tel:"]');
    results.mobile.hasClickablePhone = !!phoneLink;
    if (phoneLink) {
      const phoneBox = await phoneLink.boundingBox();
      results.mobile.phoneTouchTarget = phoneBox && phoneBox.height >= 44 ? 'PASS' : 'FAIL';
    }
    console.log('✓ Phone link tested\n');

    // Test 3: Form testing
    console.log('Testing form inputs...');
    const formInputs = await mobilePage.$$('input, textarea, select');
    results.mobile.formInputCount = formInputs.length;
    results.mobile.formInputDetails = [];

    for (const input of formInputs) {
      const fontSize = await input.evaluate(el => window.getComputedStyle(el).fontSize);
      const type = await input.evaluate(el => el.tagName + (el.type ? `[${el.type}]` : ''));
      const box = await input.boundingBox();

      results.mobile.formInputDetails.push({
        type,
        fontSize,
        height: box?.height,
        preventsZoom: parseInt(fontSize) >= 16 ? 'YES' : 'NO'
      });
    }

    // Check submit button
    const submitButton = await mobilePage.$('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      const submitBox = await submitButton.boundingBox();
      const submitWidth = await submitButton.evaluate(el => el.offsetWidth);
      results.mobile.submitButton = {
        exists: true,
        touchTarget: submitBox && submitBox.height >= 44 ? 'PASS' : 'FAIL',
        isFullWidth: submitWidth >= 300 ? 'YES' : 'NO'
      };
    }
    console.log('✓ Form tested\n');

    // Test 4: Hero section
    console.log('Testing hero section...');
    const hero = await mobilePage.$('section:first-of-type, .hero, [class*="hero"]');
    if (hero) {
      const bgImage = await hero.evaluate(el => window.getComputedStyle(el).backgroundImage);
      results.mobile.heroBgImage = bgImage !== 'none' ? 'YES' : 'NO';

      const ctaButton = await mobilePage.$('section:first-of-type button, .hero button, a.cta');
      if (ctaButton) {
        const ctaBox = await ctaButton.boundingBox();
        results.mobile.ctaButton = {
          exists: true,
          touchTarget: ctaBox && ctaBox.height >= 44 ? 'PASS' : 'FAIL'
        };
      }
    }
    console.log('✓ Hero section tested\n');

    // Test 5: Check for horizontal scroll
    console.log('Checking for horizontal scroll...');
    const hasHorizontalScroll = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    results.mobile.hasHorizontalScroll = hasHorizontalScroll ? 'FAIL' : 'PASS';
    console.log('✓ Scroll tested\n');

    // Performance metrics for mobile
    console.log('Collecting mobile performance metrics...');
    const mobileMetrics = await mobilePage.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0];

      return {
        loadTime: perf ? perf.loadEventEnd - perf.fetchStart : 0,
        domContentLoaded: perf ? perf.domContentLoadedEventEnd - perf.fetchStart : 0,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: lcp?.startTime || 0
      };
    });
    results.performance.mobile = mobileMetrics;
    console.log('✓ Mobile performance collected\n');

    await mobileContext.close();

    // ===== DESKTOP TESTING (1920x1080) =====
    console.log('\n💻 Starting Desktop Audit (1920x1080)...\n');

    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const desktopPage = await desktopContext.newPage();

    console.log('Navigating to http://localhost:3000...');
    await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(2000);
    console.log('✓ Page loaded\n');

    // Take desktop screenshots
    console.log('Capturing desktop screenshots...');
    await desktopPage.screenshot({
      path: '/tmp/desktop-full-page.png',
      fullPage: true
    });

    await desktopPage.screenshot({
      path: '/tmp/desktop-hero.png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    console.log('✓ Screenshots saved\n');

    // Test desktop navigation
    console.log('Testing desktop navigation...');
    const desktopNav = await desktopPage.$('nav:not(.mobile)');
    results.desktop.hasDesktopNav = !!desktopNav;
    results.desktop.hamburgerHidden = !(await desktopPage.isVisible('[aria-label*="menu" i], button.hamburger').catch(() => false));
    console.log('✓ Navigation tested\n');

    // Test form layout
    console.log('Testing form layout...');
    const formContainer = await desktopPage.$('form');
    if (formContainer) {
      const formWidth = await formContainer.evaluate(el => el.offsetWidth);
      const formDisplay = await formContainer.evaluate(el => window.getComputedStyle(el).display);
      const formGrid = await formContainer.evaluate(el => window.getComputedStyle(el).gridTemplateColumns);

      results.desktop.formLayout = {
        width: formWidth,
        display: formDisplay,
        gridColumns: formGrid,
        isMultiColumn: formGrid && formGrid.split(' ').length > 1 ? 'YES' : 'NO'
      };
    }
    console.log('✓ Form layout tested\n');

    // Performance metrics for desktop
    console.log('Collecting desktop performance metrics...');
    const desktopMetrics = await desktopPage.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint')[0];

      return {
        loadTime: perf ? perf.loadEventEnd - perf.fetchStart : 0,
        domContentLoaded: perf ? perf.domContentLoadedEventEnd - perf.fetchStart : 0,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: lcp?.startTime || 0
      };
    });
    results.performance.desktop = desktopMetrics;
    console.log('✓ Desktop performance collected\n');

    await desktopContext.close();

  } catch (error) {
    results.error = error.message;
    console.error('\n❌ Error during audit:', error.message);
  } finally {
    await browser.close();
  }

  // Save results
  fs.writeFileSync('/tmp/audit-results.json', JSON.stringify(results, null, 2));
  console.log('\n✅ Audit complete! Results saved to /tmp/audit-results.json\n');

  // Print summary
  console.log('='.repeat(60));
  console.log('AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log('\n📱 MOBILE (375x667):');
  console.log(`  Hamburger Menu: ${results.mobile.hasHamburger ? '✓' : '✗'}`);
  console.log(`  Touch Target Size: ${results.mobile.hamburgerTouchTarget || 'N/A'}`);
  console.log(`  Menu Opens: ${results.mobile.menuOpens ? '✓' : '✗'}`);
  console.log(`  Clickable Phone: ${results.mobile.hasClickablePhone ? '✓' : '✗'}`);
  console.log(`  Form Inputs: ${results.mobile.formInputCount}`);
  console.log(`  Horizontal Scroll: ${results.mobile.hasHorizontalScroll}`);
  console.log(`  LCP: ${results.performance.mobile.largestContentfulPaint.toFixed(0)}ms`);

  console.log('\n💻 DESKTOP (1920x1080):');
  console.log(`  Desktop Nav: ${results.desktop.hasDesktopNav ? '✓' : '✗'}`);
  console.log(`  Hamburger Hidden: ${results.desktop.hamburgerHidden ? '✓' : '✗'}`);
  console.log(`  Multi-column Form: ${results.desktop.formLayout?.isMultiColumn || 'N/A'}`);
  console.log(`  LCP: ${results.performance.desktop.largestContentfulPaint.toFixed(0)}ms`);

  console.log(`\n⚠️  Console Messages: ${results.console.length}`);
  console.log(`🌐 Network Requests: ${results.network.length}`);
  console.log('\n' + '='.repeat(60) + '\n');
}

runAudit().catch(console.error);
