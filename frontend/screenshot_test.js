import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to login...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
  
  // Login as admin
  console.log('Logging in...');
  await page.type('input[type="email"]', 'admin@gmail.com');
  await page.type('input[type="password"]', '12345');
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('Logged in successfully. Navigating to Admin Dashboard...');

  // Go to Admin Dashboard
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });

  // Click Add Product tab
  console.log('Clicking Add Product tab...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const addTab = tabs.find(t => t.textContent.includes('Add Product'));
    if (addTab) addTab.click();
  });

  // Wait for the search box
  await page.waitForSelector('input[placeholder*="Search products"]', { visible: true });
  
  // Type in the search box
  console.log('Typing search query...');
  await page.type('input[placeholder*="Search products"]', 'Chocolate');

  // Wait for suggestions dropdown
  console.log('Waiting for API suggestions...');
  await page.waitForSelector('.absolute.z-10.w-full.mt-2.bg-white', { visible: true, timeout: 5000 });

  // Take screenshot of the suggestions
  await page.screenshot({ path: 'admin_search_suggestions.png' });
  console.log('Screenshot saved: admin_search_suggestions.png');

  // Click the first suggestion
  console.log('Clicking a suggestion...');
  await page.evaluate(() => {
    const suggestion = document.querySelector('.absolute.z-10.w-full.mt-2.bg-white > div');
    if (suggestion) suggestion.click();
  });

  // Wait a moment for state to update
  await new Promise(r => setTimeout(r, 500));

  // Take screenshot of the filled form
  await page.screenshot({ path: 'admin_form_filled.png' });
  console.log('Screenshot saved: admin_form_filled.png');

  await browser.close();
})();
