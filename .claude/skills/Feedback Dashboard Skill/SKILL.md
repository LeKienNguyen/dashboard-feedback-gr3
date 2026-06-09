description: Launch the feedback-dashboard dev server and smoke-test it with Playwright

# Run skill — feedback-dashboard

## Dev server

```bash
cd "/Users/user/Documents/digital trans/feedback-dashboard"
npm run dev &
echo $! > /tmp/dev.pid
timeout 30 bash -c 'until curl -sf http://localhost:5173 >/dev/null 2>&1 || curl -sf http://localhost:5174 >/dev/null 2>&1; do sleep 1; done'
```

Port 5173 is the default; Vite bumps to 5174 if something already holds 5173. To stop:

```bash
kill $(cat /tmp/dev.pid) 2>/dev/null || pkill -f vite
```

## Browser driver

`chromium-cli` is not available on this machine. Use Playwright from a temp dir:

```bash
mkdir -p /tmp/pw-test && cd /tmp/pw-test
[ -f package.json ] || npm init -y
[ -d node_modules/playwright ] || npm install playwright@1.60.0
```

Then write a `.mjs` script importing from `playwright` and run it with `node`.

## Representative smoke test

```js
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()

// /submit — fill and submit a form entry
await page.goto('http://localhost:5174/submit')   // adjust port if needed
await page.waitForSelector('text=Share your feedback')
await page.fill('input[name="name"]', 'Smoke Test')
await page.selectOption('select[name="location"]', 'District 1')
await page.selectOption('select[name="rating"]', '5')
await page.fill('textarea[name="comment"]', 'Smoke test comment.')
await page.click('button:has-text("Submit feedback")')
await page.waitForSelector('text=Thanks! Your feedback has been submitted.')
await page.screenshot({ path: '/tmp/fb-submit.png', fullPage: true })

// /admin — verify entry appears with green sentiment row
await page.goto('http://localhost:5174/admin')
await page.waitForSelector('text=Feedback overview')
await page.waitForSelector('text=Smoke Test')
await page.screenshot({ path: '/tmp/fb-admin.png', fullPage: true })

// Check no JS errors
const errors = []
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
if (errors.length) console.error('Console errors:', errors)

await browser.close()
```

Screenshots land at `/tmp/fb-submit.png` and `/tmp/fb-admin.png`.

## Gotchas

- **Port** — Check `/tmp/vite-dev.log` or the terminal for the actual port (5173 or 5174). Update `goto()` accordingly.
- **React controlled inputs** — Always use `fill` / `selectOption`, never `eval el.value = …`. The latter bypasses React's onChange and the field stays blank.
- **Slow first paint** — Vite compiles routes on demand; the first `nav` can take 10 s+. `waitForSelector` handles it; `sleep` does not.
- **localStorage is per-origin** — Each `chromium.launch()` gets a fresh profile with empty localStorage. That is intentional for test isolation; it is not a bug.
