const { chromium } = require('playwright');
const fs = require('fs');

async function completeAudit() {
  const browser = await chromium.launch({ headless: true });
  const results = { mobile: {}, desktop: {}, performance: {}, console: [], network: [] };

  try {
    // ========== MOBILE AUDIT (iPhone SE) ==========
    console.log('\n📱 MOBILE AUDIT (iPhone SE 375x667)\n');

    const mobile = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
      isMobile: true,
      hasTouch: true
    });

    const mobilePage = await mobile.newPage();

    mobilePage.on('console', msg => results.console.push({
      type: msg.type(),
      text: msg.text(),
      context: 'mobile'
    }));

    mobilePage.on('response', resp => results.network.push({
      url: resp.url(),
      status: resp.status(),
      type: resp.request().resourceType(),
      context: 'mobile'
    }));

    await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(3000);

    // Screenshots
    await mobilePage.screenshot({ path: '/tmp/mobile-full.png', fullPage: true });
    await mobilePage.screenshot({ path: '/tmp/mobile-viewport.png' });

    // Form section screenshot
    const formSection = await mobilePage.$('form, section:has(form), #contact');
    if (formSection) {
      await formSection.screenshot({ path: '/tmp/mobile-form.png' });
    }

    // Hamburger menu test
    const hamburger = await mobilePage.$('[class*="hamburger"], button[aria-label*="menu" i], [class*="menuButton"]');
    if (hamburger) {
      const box = await hamburger.boundingBox();
      results.mobile.hamburger = {
        exists: true,
        size: box,
        touchTarget: (box?.width >= 44 && box?.height >= 44) ? 'PASS' : 'FAIL'
      };

      // Force click using JavaScript to bypass animation
      try {
        await hamburger.evaluate(el => el.click());
        await mobilePage.waitForTimeout(800);
        await mobilePage.screenshot({ path: '/tmp/mobile-menu-open.png' });
        results.mobile.menuOpened = true;
      } catch (e) {
        results.mobile.menuOpened = false;
        results.mobile.menuError = e.message;
      }
    }

    // Phone link
    const phoneLink = await mobilePage.$('a[href^="tel:"]');
    if (phoneLink) {
      const phoneBox = await phoneLink.boundingBox();
      const phoneText = await phoneLink.textContent();
      results.mobile.phoneLink = {
        exists: true,
        text: phoneText,
        size: phoneBox,
        touchTarget: phoneBox?.height >= 44 ? 'PASS' : 'FAIL'
      };
    } else {
      results.mobile.phoneLink = { exists: false };
    }

    // Form analysis
    const inputs = await mobilePage.$$('input:not([type="hidden"]), textarea, select');
    results.mobile.formInputs = [];

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      const type = await input.getAttribute('type');
      const fontSize = await input.evaluate(el => window.getComputedStyle(el).fontSize);
      const box = await input.boundingBox();

      results.mobile.formInputs.push({
        id, name, type,
        fontSize,
        height: box?.height,
        preventsZoom: parseInt(fontSize) >= 16
      });
    }

    // Submit button
    const submitBtn = await mobilePage.$('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      const submitBox = await submitBtn.boundingBox();
      const submitText = await submitBtn.textContent();
      const submitWidth = await submitBtn.evaluate(el => el.offsetWidth);

      results.mobile.submitButton = {
        exists: true,
        text: submitText?.trim(),
        size: submitBox,
        touchTarget: submitBox?.height >= 44 ? 'PASS' : 'FAIL',
        isWide: submitWidth >= 300
      };
    }

    // Check for horizontal scroll
    const horizontalScroll = await mobilePage.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    results.mobile.horizontalScroll = horizontalScroll ? 'FAIL' : 'PASS';

    // Hero section
    const hero = await mobilePage.$('section:first-of-type, .hero, [class*="hero"]');
    if (hero) {
      const bgImage = await hero.evaluate(el => window.getComputedStyle(el).backgroundImage);
      const ctaBtn = await mobilePage.$('section:first-of-type button, .hero button, a[class*="btn"][class*="primary"]');

      results.mobile.hero = {
        hasBgImage: bgImage !== 'none',
        ctaExists: !!ctaBtn
      };

      if (ctaBtn) {
        const ctaBox = await ctaBtn.boundingBox();
        results.mobile.hero.ctaTouchTarget = (ctaBox?.height >= 44) ? 'PASS' : 'FAIL';
      }
    }

    // Performance metrics
    results.performance.mobile = await mobilePage.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint').slice(-1)[0];

      return {
        loadTime: nav ? nav.loadEventEnd - nav.fetchStart : 0,
        domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.fetchStart : 0,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: lcp?.startTime || 0
      };
    });

    await mobile.close();

    // ========== DESKTOP AUDIT (1920x1080) ==========
    console.log('\n💻 DESKTOP AUDIT (1920x1080)\n');

    const desktop = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const desktopPage = await desktop.newPage();

    desktopPage.on('console', msg => results.console.push({
      type: msg.type(),
      text: msg.text(),
      context: 'desktop'
    }));

    await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(3000);

    // Screenshots
    await desktopPage.screenshot({ path: '/tmp/desktop-full.png', fullPage: true });
    await desktopPage.screenshot({ path: '/tmp/desktop-viewport.png' });

    // Form section
    const desktopForm = await desktopPage.$('form, section:has(form), #contact');
    if (desktopForm) {
      await desktopForm.screenshot({ path: '/tmp/desktop-form.png' });
    }

    // Nav test
    const desktopNav = await desktopPage.$('nav:not([class*="mobile"])');
    const hamburgerVisible = await desktopPage.isVisible('[class*="hamburger"], button[aria-label*="menu" i]').catch(() => false);

    results.desktop.navigation = {
      desktopNavExists: !!desktopNav,
      hamburgerHidden: !hamburgerVisible
    };

    // Form layout
    const form = await desktopPage.$('form');
    if (form) {
      const formWidth = await form.evaluate(el => el.offsetWidth);
      const formDisplay = await form.evaluate(el => window.getComputedStyle(el).display);
      const formGrid = await form.evaluate(el => window.getComputedStyle(el).gridTemplateColumns);

      results.desktop.formLayout = {
        width: formWidth,
        display: formDisplay,
        gridColumns: formGrid,
        isMultiColumn: formGrid && formGrid.split(' ').length > 1
      };
    }

    // Performance
    results.performance.desktop = await desktopPage.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint').slice(-1)[0];

      return {
        loadTime: nav ? nav.loadEventEnd - nav.fetchStart : 0,
        domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.fetchStart : 0,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: lcp?.startTime || 0
      };
    });

    await desktop.close();

  } catch (error) {
    results.error = error.message;
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
  }

  fs.writeFileSync('/tmp/complete-audit.json', JSON.stringify(results, null, 2));

  // Print Summary
  console.log('\n' + '='.repeat(70));
  console.log('                    AUDIT COMPLETE');
  console.log('='.repeat(70));

  console.log('\n📱 MOBILE (iPhone SE 375x667):');
  console.log('─'.repeat(70));
  console.log(`  ✓ Hamburger Menu: ${results.mobile.hamburger?.exists ? 'Found' : 'Not found'}`);
  console.log(`    - Size: ${results.mobile.hamburger?.size?.width}x${results.mobile.hamburger?.size?.height}px`);
  console.log(`    - Touch Target (44x44): ${results.mobile.hamburger?.touchTarget || 'N/A'}`);
  console.log(`    - Menu Opens: ${results.mobile.menuOpened ? '✓' : '✗'}`);
  console.log(`  ✓ Phone Link: ${results.mobile.phoneLink?.exists ? 'Found' : 'Not found'}`);
  if (results.mobile.phoneLink?.exists) {
    console.log(`    - Text: ${results.mobile.phoneLink.text}`);
    console.log(`    - Touch Target: ${results.mobile.phoneLink.touchTarget}`);
  }
  console.log(`  ✓ Form Inputs: ${results.mobile.formInputs?.length || 0} found`);
  results.mobile.formInputs?.forEach((input, i) => {
    const zoom = input.preventsZoom ? '✓' : '✗ WILL ZOOM';
    console.log(`    ${i+1}. ${input.name || input.id} (${input.type}): ${input.fontSize} ${zoom}`);
  });
  console.log(`  ✓ Submit Button: ${results.mobile.submitButton?.exists ? 'Found' : 'Not found'}`);
  if (results.mobile.submitButton?.exists) {
    console.log(`    - Text: ${results.mobile.submitButton.text}`);
    console.log(`    - Touch Target: ${results.mobile.submitButton.touchTarget}`);
    console.log(`    - Width: ${results.mobile.submitButton.size?.width}px (${results.mobile.submitButton.isWide ? 'Good' : 'Narrow'})`);
  }
  console.log(`  ✓ Horizontal Scroll: ${results.mobile.horizontalScroll}`);
  console.log(`  ✓ Hero Background: ${results.mobile.hero?.hasBgImage ? 'Yes' : 'No'}`);
  console.log(`  ✓ CTA Touch Target: ${results.mobile.hero?.ctaTouchTarget || 'N/A'}`);

  console.log('\n⚡ MOBILE PERFORMANCE:');
  console.log(`    Load Time: ${results.performance.mobile?.loadTime?.toFixed(0)}ms`);
  console.log(`    DOM Content Loaded: ${results.performance.mobile?.domContentLoaded?.toFixed(0)}ms`);
  console.log(`    First Paint: ${results.performance.mobile?.firstPaint?.toFixed(0)}ms`);
  console.log(`    FCP: ${results.performance.mobile?.firstContentfulPaint?.toFixed(0)}ms`);
  console.log(`    LCP: ${results.performance.mobile?.largestContentfulPaint?.toFixed(0)}ms ${results.performance.mobile?.largestContentfulPaint < 2500 ? '✓ GOOD' : '✗ NEEDS IMPROVEMENT'}`);

  console.log('\n💻 DESKTOP (1920x1080):');
  console.log('─'.repeat(70));
  console.log(`  ✓ Desktop Nav: ${results.desktop.navigation?.desktopNavExists ? 'Found' : 'Not found'}`);
  console.log(`  ✓ Hamburger Hidden: ${results.desktop.navigation?.hamburgerHidden ? 'Yes' : 'No'}`);
  console.log(`  ✓ Form Layout: ${results.desktop.formLayout?.display || 'N/A'}`);
  console.log(`    - Grid Columns: ${results.desktop.formLayout?.gridColumns || 'none'}`);
  console.log(`    - Multi-column: ${results.desktop.formLayout?.isMultiColumn ? 'Yes' : 'No'}`);

  console.log('\n⚡ DESKTOP PERFORMANCE:');
  console.log(`    Load Time: ${results.performance.desktop?.loadTime?.toFixed(0)}ms`);
  console.log(`    FCP: ${results.performance.desktop?.firstContentfulPaint?.toFixed(0)}ms`);
  console.log(`    LCP: ${results.performance.desktop?.largestContentfulPaint?.toFixed(0)}ms ${results.performance.desktop?.largestContentfulPaint < 2500 ? '✓ GOOD' : '✗ NEEDS IMPROVEMENT'}`);

  console.log('\n⚠️  CONSOLE MESSAGES:');
  const errors = results.console.filter(c => c.type === 'error');
  const warnings = results.console.filter(c => c.type === 'warning');
  console.log(`    Errors: ${errors.length}`);
  console.log(`    Warnings: ${warnings.length}`);
  warnings.forEach(w => console.log(`      - ${w.text.substring(0, 100)}`));

  console.log('\n🌐 NETWORK:');
  const totalRequests = results.network.length;
  const images = results.network.filter(n => n.type === 'image').length;
  const scripts = results.network.filter(n => n.type === 'script').length;
  console.log(`    Total Requests: ${totalRequests}`);
  console.log(`    Images: ${images}`);
  console.log(`    Scripts: ${scripts}`);

  console.log('\n📸 SCREENSHOTS SAVED:');
  console.log(`    /tmp/mobile-full.png`);
  console.log(`    /tmp/mobile-viewport.png`);
  console.log(`    /tmp/mobile-form.png`);
  console.log(`    /tmp/mobile-menu-open.png`);
  console.log(`    /tmp/desktop-full.png`);
  console.log(`    /tmp/desktop-viewport.png`);
  console.log(`    /tmp/desktop-form.png`);

  console.log('\n📊 Full results: /tmp/complete-audit.json\n');
  console.log('='.repeat(70) + '\n');
}

runAudit().catch(console.error);

async function runAudit() {
  await completeAudit();
}
