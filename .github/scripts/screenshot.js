const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // Ensure screenshots directory exists
  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: 'screenshots/', size: { width: 1280, height: 800 } }
  });
  const page = await context.newPage();
  await page.goto('https://ludoo0d0a.github.io/captain/');

  // Take a screenshot of the environments dashboard
  await page.screenshot({ path: 'screenshots/dashboard.png', fullPage: true });

  // Start the flow for the GIF
  // 1. Show environments dashboard (already loaded)
  await page.waitForTimeout(1200);

  // 2. Switch to applications dashboard
  await page.click('button:has-text("Applications")');
  await page.waitForTimeout(1200);

  // 3. Add a new application
  await page.click('a:has-text("Manage Applications")');
  await page.waitForSelector('input[placeholder="New application name"]', { timeout: 5000 });
  await page.fill('input[placeholder="New application name"]', 'DemoApp');
  await page.click('button:has-text("Add")');
  await page.waitForTimeout(1000);
  await page.goBack(); // Return to applications dashboard
  await page.waitForTimeout(1000);

  // 4. Open settings
  await page.click('button:has-text("Settings")');
  await page.waitForTimeout(1200);

  // End recording
  await page.close();
  await browser.close();

  // Rename the video to demo.webm (Playwright auto-names it)
  const files = fs.readdirSync('screenshots').filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    fs.renameSync(`screenshots/${files[0]}`, 'screenshots/demo.webm');
  }
})(); 