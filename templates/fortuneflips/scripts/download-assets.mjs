import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../public");

// Assets to download from resellingautomation.com
const ASSETS = [
  // VSL thumbnail
  {
    url: "https://resellingautomation.com/assets/vsl-thumbnail-BA6OM7ay.webp",
    dest: "images/vsl-thumbnail.webp",
  },
  // Student video thumbnail
  {
    url: "https://resellingautomation.com/assets/student-thumb-1-LLxSpBX8.webp",
    dest: "images/student-thumb-1.webp",
  },
  // Result screenshots
  { url: "https://resellingautomation.com/16871bab-84e3-4aa7-80c3-4dcbdb897cb3.webp", dest: "images/results/result-1.webp" },
  { url: "https://resellingautomation.com/9956c04a-5e15-429d-bc8b-56df0db9ad44.webp", dest: "images/results/result-4.webp" },
  { url: "https://resellingautomation.com/a57d7ed6-3912-41b0-91a4-594413e74c22.webp", dest: "images/results/result-6.webp" },
  { url: "https://resellingautomation.com/c29e4a6d-54c5-498a-8233-2eeb8d331922.webp", dest: "images/results/result-8.webp" },
  { url: "https://resellingautomation.com/5231e5c8-cd02-48a4-92a6-b09c849c9dfb.webp", dest: "images/results/result-11.webp" },
  { url: "https://resellingautomation.com/944a462e-431f-4b9f-aff0-09ec13072d59.webp", dest: "images/results/result-12.webp" },
  { url: "https://resellingautomation.com/d36aaa08-380f-4ac1-9b94-ff4bc48b6050.webp", dest: "images/results/result-15.webp" },
  { url: "https://resellingautomation.com/7c806e5b-3b2d-4d1c-b8cb-18ea7cfde335.webp", dest: "images/results/student-cash.webp" },
  { url: "https://resellingautomation.com/86998f79-198f-45ec-bf8c-bcb49a002080.webp", dest: "images/results/student-colognes.webp" },
  { url: "https://resellingautomation.com/1968d52d-3d9d-497c-9d32-44e6f09fb94b.webp", dest: "images/results/result-2.webp" },
  { url: "https://resellingautomation.com/3d974d3b-509d-4087-a248-c6deaef7224c.webp", dest: "images/results/result-3.webp" },
  { url: "https://resellingautomation.com/1b94ebb8-0704-4d3e-a8a3-e432735aac1e.webp", dest: "images/results/result-5.webp" },
  { url: "https://resellingautomation.com/ddfd8da3-3536-421c-96ab-da54c8c03105.webp", dest: "images/results/result-7.webp" },
  { url: "https://resellingautomation.com/8b475737-c92f-4c32-a51d-4bc6a04b9be8.webp", dest: "images/results/result-9.webp" },
  { url: "https://resellingautomation.com/ce31d22d-7c61-4df8-a684-51beefd87064.webp", dest: "images/results/result-10.webp" },
  { url: "https://resellingautomation.com/5399c35b-1d6d-4770-811f-1437e8959414.webp", dest: "images/results/result-13.webp" },
  { url: "https://resellingautomation.com/8badf70d-07f7-4ca7-99d0-b4f4299a067c.webp", dest: "images/results/result-14.webp" },
  { url: "https://resellingautomation.com/dfe6fb56-7f0d-4a8f-a23e-50dffcba99fe.webp", dest: "images/results/student-stan-store.webp" },
  { url: "https://resellingautomation.com/c2756956-d83a-4203-878b-359796c6ca27.webp", dest: "images/results/student-5k-colognes.webp" },
];

/**
 * @param {string} url
 * @param {string} dest
 * @returns {Promise<{ success: boolean; error?: string }>}
 */
async function downloadFile(url, dest) {
  const destPath = path.join(PUBLIC_DIR, dest);
  const destDir = path.dirname(destPath);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Skip if already downloaded
  if (fs.existsSync(destPath)) {
    console.log(`  Skip (exists): ${dest}`);
    return { success: true };
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    console.log(`  OK: ${dest} (${(buffer.length / 1024).toFixed(1)} KB)`);
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

async function main() {
  console.log(`Downloading ${ASSETS.length} assets to public/...\n`);

  // Download in batches of 4
  const BATCH_SIZE = 4;
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < ASSETS.length; i += BATCH_SIZE) {
    const batch = ASSETS.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((a) => downloadFile(a.url, a.dest))
    );
    for (const r of results) {
      if (r.success) ok++;
      else {
        fail++;
        console.error(`  FAIL: ${r.error}`);
      }
    }
  }

  console.log(`\nDone: ${ok} downloaded, ${fail} failed, ${ASSETS.length - ok - fail} skipped`);
}

main().catch(console.error);
