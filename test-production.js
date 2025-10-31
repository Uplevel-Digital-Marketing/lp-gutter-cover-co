#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

const TEST_URL = 'http://localhost:3000';
const RESULTS_DIR = path.join(__dirname, 'test-results');

// Device configurations
const DEVICES = {
  'iPhone SE': { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1' },
  'iPhone 13 Pro': { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1' },
  'Samsung Galaxy S21': { width: 360, height: 800, deviceScaleFactor: 3, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36' },
  'Desktop 1920x1080': { width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  'Laptop 1366x768': { width: 1366, height: 768, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
};

// Critical checks
const CRITICAL_CHECKS = [
  'No horizontal scroll on any viewport',
  'Touch targets all 44px+ on mobile',
  'Form inputs are 16px font (prevents iOS zoom)',
  'Mobile menu opens/closes smoothly',
  'Form validation shows error messages',
  'Page loads in under 3 seconds',
  'LCP measurement works',
  'No console errors',
  'All images load properly'
];

async function ensureResultsDir() {
  try {
    await fs.mkdir(RESULTS_DIR, { recursive: true });
    console.log(`✓ Results directory ready: ${RESULTS_DIR}`);
  } catch (err) {
    console.error('Error creating results directory:', err);
  }
}

async function checkHorizontalScroll(page) {
  return await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
}

async function checkTouchTargets(page) {
  return await page.evaluate(() => {
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], [onclick]');
    const results = [];

    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const minSize = 44;

      if (width < minSize || height < minSize) {
        results.push({
          element: el.tagName,
          text: el.textContent?.trim().substring(0, 30) || el.getAttribute('aria-label') || 'N/A',
          width: Math.round(width),
          height: Math.round(height),
          pass: false
        });
      }
    });

    return results;
  });
}

async function checkFormInputSize(page) {
  return await page.evaluate(() => {
    const inputs = document.querySelectorAll('input, textarea, select');
    const results = [];

    inputs.forEach(input => {
      const styles = window.getComputedStyle(input);
      const fontSize = parseFloat(styles.fontSize);

      results.push({
        type: input.type || input.tagName,
        id: input.id || 'N/A',
        fontSize: fontSize,
        pass: fontSize >= 16
      });
    });

    return results;
  });
}

async function measureCoreWebVitals(page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const vitals = { lcp: null, fid: null, cls: null };

      // LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          vitals.lcp = entries[entries.length - 1].renderTime || entries[entries.length - 1].loadTime;
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        vitals.cls = clsValue;
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          vitals.fid = entries[0].processingStart - entries[0].startTime;
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      setTimeout(() => {
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
        resolve(vitals);
      }, 3000);
    });
  });
}

async function getConsoleErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  return errors;
}

async function testDevice(browser, deviceName, deviceConfig) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${deviceName} (${deviceConfig.width}x${deviceConfig.height})`);
  console.log('='.repeat(60));

  const context = await browser.newContext({
    viewport: { width: deviceConfig.width, height: deviceConfig.height },
    deviceScaleFactor: deviceConfig.deviceScaleFactor,
    isMobile: deviceConfig.isMobile,
    hasTouch: deviceConfig.hasTouch,
    userAgent: deviceConfig.userAgent
  });

  const page = await context.newPage();
  const results = {
    device: deviceName,
    viewport: `${deviceConfig.width}x${deviceConfig.height}`,
    timestamp: new Date().toISOString(),
    checks: {}
  };

  // Track console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });

  try {
    // Load page and measure time
    const startTime = Date.now();
    await page.goto(TEST_URL, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    console.log(`✓ Page loaded in ${loadTime}ms`);
    results.loadTime = loadTime;
    results.checks.loadTimeUnder3s = loadTime < 3000;

    // Wait a bit for page to settle
    await page.waitForTimeout(2000);

    // Take screenshot
    const screenshotPath = path.join(RESULTS_DIR, `${deviceName.replace(/\s+/g, '-')}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✓ Screenshot saved: ${screenshotPath}`);

    // Check horizontal scroll
    const hasHorizontalScroll = await checkHorizontalScroll(page);
    results.checks.noHorizontalScroll = !hasHorizontalScroll;
    console.log(`${hasHorizontalScroll ? '✗' : '✓'} Horizontal scroll: ${hasHorizontalScroll ? 'DETECTED' : 'None'}`);

    // Check touch targets (mobile only)
    if (deviceConfig.isMobile) {
      const smallTargets = await checkTouchTargets(page);
      results.checks.touchTargets = {
        pass: smallTargets.length === 0,
        smallTargets: smallTargets
      };
      console.log(`${smallTargets.length === 0 ? '✓' : '✗'} Touch targets: ${smallTargets.length === 0 ? 'All pass' : `${smallTargets.length} too small`}`);
      if (smallTargets.length > 0) {
        console.log('  Small targets:', smallTargets.slice(0, 3));
      }
    }

    // Check form input sizes (mobile only)
    if (deviceConfig.isMobile) {
      const inputSizes = await checkFormInputSize(page);
      const failedInputs = inputSizes.filter(i => !i.pass);
      results.checks.formInputs = {
        pass: failedInputs.length === 0,
        inputs: inputSizes
      };
      console.log(`${failedInputs.length === 0 ? '✓' : '✗'} Form inputs: ${failedInputs.length === 0 ? 'All 16px+' : `${failedInputs.length} too small`}`);
      if (failedInputs.length > 0) {
        console.log('  Small inputs:', failedInputs);
      }
    }

    // Test mobile menu (mobile only)
    if (deviceConfig.isMobile) {
      try {
        const menuButton = await page.$('[aria-label*="menu" i], [aria-label*="navigation" i], button.hamburger, .hamburger');
        if (menuButton) {
          await menuButton.click();
          await page.waitForTimeout(500);
          const menuScreenshot = path.join(RESULTS_DIR, `${deviceName.replace(/\s+/g, '-')}-menu-open.png`);
          await page.screenshot({ path: menuScreenshot });

          await menuButton.click();
          await page.waitForTimeout(500);
          console.log('✓ Mobile menu test: Pass');
          results.checks.mobileMenu = true;
        } else {
          console.log('⚠ Mobile menu button not found');
          results.checks.mobileMenu = false;
        }
      } catch (err) {
        console.log('✗ Mobile menu test failed:', err.message);
        results.checks.mobileMenu = false;
      }
    }

    // Test form validation
    try {
      const form = await page.$('form');
      if (form) {
        const submitButton = await page.$('button[type="submit"], input[type="submit"]');
        if (submitButton) {
          await submitButton.click();
          await page.waitForTimeout(1000);

          const errorMessages = await page.$$('[role="alert"], .error, .invalid');
          results.checks.formValidation = errorMessages.length > 0;
          console.log(`${errorMessages.length > 0 ? '✓' : '⚠'} Form validation: ${errorMessages.length > 0 ? 'Working' : 'No errors shown'}`);
        }
      }
    } catch (err) {
      console.log('⚠ Form validation test skipped:', err.message);
    }

    // Measure Core Web Vitals
    const vitals = await measureCoreWebVitals(page);
    results.coreWebVitals = {
      lcp: vitals.lcp ? `${(vitals.lcp / 1000).toFixed(2)}s` : 'N/A',
      fid: vitals.fid ? `${vitals.fid.toFixed(2)}ms` : 'N/A',
      cls: vitals.cls ? vitals.cls.toFixed(3) : 'N/A',
      lcpPass: vitals.lcp ? vitals.lcp < 2500 : null,
      fidPass: vitals.fid ? vitals.fid < 100 : null,
      clsPass: vitals.cls ? vitals.cls < 0.1 : null
    };

    console.log('\nCore Web Vitals:');
    console.log(`  LCP: ${results.coreWebVitals.lcp} ${results.coreWebVitals.lcpPass ? '✓' : results.coreWebVitals.lcpPass === false ? '✗' : ''}`);
    console.log(`  FID: ${results.coreWebVitals.fid} ${results.coreWebVitals.fidPass ? '✓' : results.coreWebVitals.fidPass === false ? '✗' : ''}`);
    console.log(`  CLS: ${results.coreWebVitals.cls} ${results.coreWebVitals.clsPass ? '✓' : results.coreWebVitals.clsPass === false ? '✗' : ''}`);

    // Check console errors
    results.checks.noConsoleErrors = consoleErrors.length === 0;
    console.log(`${consoleErrors.length === 0 ? '✓' : '✗'} Console errors: ${consoleErrors.length === 0 ? 'None' : consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('  Errors:', consoleErrors.slice(0, 3));
    }

    // Check all images loaded
    const imageCheck = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      const failed = images.filter(img => !img.complete || img.naturalWidth === 0);
      return {
        total: images.length,
        failed: failed.length,
        failedSrcs: failed.map(img => img.src).slice(0, 5)
      };
    });

    results.checks.imagesLoaded = {
      pass: imageCheck.failed === 0,
      total: imageCheck.total,
      failed: imageCheck.failed,
      failedSrcs: imageCheck.failedSrcs
    };
    console.log(`${imageCheck.failed === 0 ? '✓' : '✗'} Images: ${imageCheck.total} total, ${imageCheck.failed} failed`);

  } catch (error) {
    console.error('Error during testing:', error.message);
    results.error = error.message;
  } finally {
    await context.close();
  }

  return results;
}

async function runTests() {
  console.log('🚀 Starting comprehensive production testing...\n');
  console.log(`Target URL: ${TEST_URL}`);
  console.log(`Results directory: ${RESULTS_DIR}\n`);

  await ensureResultsDir();

  const browser = await chromium.launch({ headless: true });
  const allResults = [];

  try {
    for (const [deviceName, deviceConfig] of Object.entries(DEVICES)) {
      const result = await testDevice(browser, deviceName, deviceConfig);
      allResults.push(result);

      // Save individual result
      const resultPath = path.join(RESULTS_DIR, `${deviceName.replace(/\s+/g, '-')}-results.json`);
      await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
    }

    // Generate summary report
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY REPORT');
    console.log('='.repeat(60));

    const summary = {
      timestamp: new Date().toISOString(),
      devicesTested: allResults.length,
      results: allResults,
      criticalChecks: {}
    };

    // Aggregate critical checks
    CRITICAL_CHECKS.forEach(check => {
      const key = check.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
      summary.criticalChecks[key] = {
        description: check,
        devices: {}
      };

      allResults.forEach(result => {
        const devicePass = checkCriteria(result, check);
        summary.criticalChecks[key].devices[result.device] = devicePass;
      });
    });

    // Save summary
    const summaryPath = path.join(RESULTS_DIR, 'summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`\n✓ Summary saved: ${summaryPath}`);

    // Console summary
    console.log('\nCritical Checks Across All Devices:');
    Object.entries(summary.criticalChecks).forEach(([key, data]) => {
      const passCount = Object.values(data.devices).filter(v => v).length;
      const totalCount = Object.keys(data.devices).length;
      console.log(`  ${passCount === totalCount ? '✓' : '✗'} ${data.description}: ${passCount}/${totalCount} pass`);
    });

  } finally {
    await browser.close();
  }

  console.log('\n✅ Testing complete!');
  console.log(`Results saved to: ${RESULTS_DIR}`);
}

function checkCriteria(result, criterion) {
  switch(criterion) {
    case 'No horizontal scroll on any viewport':
      return result.checks.noHorizontalScroll;
    case 'Touch targets all 44px+ on mobile':
      return result.checks.touchTargets?.pass ?? true;
    case 'Form inputs are 16px font (prevents iOS zoom)':
      return result.checks.formInputs?.pass ?? true;
    case 'Mobile menu opens/closes smoothly':
      return result.checks.mobileMenu ?? true;
    case 'Form validation shows error messages':
      return result.checks.formValidation ?? false;
    case 'Page loads in under 3 seconds':
      return result.checks.loadTimeUnder3s;
    case 'LCP measurement works':
      return result.coreWebVitals?.lcp !== 'N/A';
    case 'No console errors':
      return result.checks.noConsoleErrors;
    case 'All images load properly':
      return result.checks.imagesLoaded?.pass;
    default:
      return null;
  }
}

runTests().catch(console.error);
