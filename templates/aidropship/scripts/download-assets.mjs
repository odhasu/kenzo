import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const BASE = "https://go.aidropshippingbuilder.com";

// Unique assets to download
const ASSETS = [
  // Partner logos
  { url: `${BASE}/.netlify/images?url=/assets/Wix.com_website_logo.svg.png&w=200&fm=avif`, name: "partners/wix.avif" },
  { url: `${BASE}/.netlify/images?url=/assets/TikTok_logo.svg.png&w=200&fm=avif`, name: "partners/tiktok.avif" },
  { url: `${BASE}/.netlify/images?url=/assets/autods.png&w=200&fm=avif`, name: "partners/autods.avif" },
  { url: `${BASE}/.netlify/images?url=/assets/Hostinger_logo_purple.svg.png&w=200&fm=avif`, name: "partners/hostinger.avif" },

  // Hero / How it works
  { url: `${BASE}/.netlify/images?url=/assets/storebuilder.png&w=1600&fm=avif`, name: "storebuilder.avif" },

  // Course mockup
  { url: `${BASE}/.netlify/images?url=/assets/course/client-natural.jpg&w=800&fm=avif`, name: "course-mockup.avif" },

  // Zoom / coaching
  { url: `${BASE}/.netlify/images?url=/assets/zoom/nathan.jpg&w=800&fm=avif`, name: "zoom-coach.avif" },

  // Founder
  { url: `${BASE}/.netlify/images?url=/assets/founder/nathan-times-square.jpg&w=1200&fm=avif`, name: "founder.avif" },

  // Store screenshots (6 stores)
  { url: `${BASE}/.netlify/images?url=/assets/stores/01.avif&w=900&fm=avif`, name: "stores/01.avif" },
  { url: `${BASE}/.netlify/images?url=/assets/stores/02.avif&w=900&fm=avif`, name: "stores/02.avif" },
  { url: `${BASE}/.netlify/images?url=/assets/stores/03.avif&w=900&fm=avif`, name: "stores/03.avif" },
  { url: `${BASE}/.netlify/images?url=/assets/stores/04.avif&w=900&fm=avif`, name: "stores/04.avif" },
  { url: `${BASE}/.netlify/images?url=/assets/stores/05.avif&w=900&fm=avif`, name: "stores/05.avif" },
  { url: `${BASE}/.netlify/images?url=/assets/stores/06.avif&w=900&fm=avif`, name: "stores/06.avif" },

  // Favicons
  { url: `${BASE}/assets/favicon-32.png`, name: "seo/favicon-32.png" },
  { url: `${BASE}/assets/favicon-16.png`, name: "seo/favicon-16.png" },
  { url: `${BASE}/assets/apple-touch-icon-180.png`, name: "seo/apple-touch-icon-180.png" },
  { url: `${BASE}/assets/apple-touch-icon-512.png`, name: "seo/apple-touch-icon-512.png" },
];

async function downloadAsset({ url, name }) {
  const filePath = join(PUBLIC, name);
  if (existsSync(filePath)) {
    console.log(`  ✓ ${name} (cached)`);
    return;
  }
  mkdirSync(dirname(filePath), { recursive: true });
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(filePath, buf);
    console.log(`  ✓ ${name} (${(buf.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`);
  }
}

async function main() {
  console.log(`Downloading ${ASSETS.length} assets...\n`);

  // Batch in groups of 4
  const BATCH = 4;
  for (let i = 0; i < ASSETS.length; i += BATCH) {
    const batch = ASSETS.slice(i, i + BATCH);
    await Promise.all(batch.map(downloadAsset));
  }

  console.log(`\nDone. ${ASSETS.length} assets processed.`);
}

main();
