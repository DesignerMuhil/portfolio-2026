/* =========================================================
   CONVERT IMAGES  →  WebP
   Run from the project root:  node scripts/convert-images.mjs

   - Finds every PNG / JPG under src/assets that is bigger than MIN_KB
   - Resizes it so the longest side is at most MAX_SIDE
   - Saves a WebP next to it
   - Moves the original to ../image-backup (outside your project)
   - Updates image imports in your .js, .jsx and .css files to .webp
========================================================= */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "src", "assets");
const SRC = path.join(ROOT, "src");
const BACKUP = path.join(ROOT, "..", "image-backup");

const MIN_KB = 200;    // skip files smaller than this
const MAX_SIDE = 1920; // longest side in pixels
const QUALITY = 82;    // WebP quality (80-85 is a good range)

const IMAGE = /\.(png|jpe?g)$/i;
const CODE = /\.(jsx?|css)$/i;

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";

const files = (await walk(ASSETS)).filter((f) => IMAGE.test(f));
const renamed = []; // { from, to } (file names only)
let before = 0;
let after = 0;

for (const file of files) {
  const { size } = await fs.stat(file);
  if (size < MIN_KB * 1024) continue;

  const dir = path.dirname(file);
  const base = path.basename(file, path.extname(file));
  const target = path.join(dir, base + ".webp");

  try {
    await sharp(file)
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(target);
  } catch (error) {
    console.log("SKIPPED (error):", path.relative(ROOT, file), error.message);
    continue;
  }

  const newSize = (await fs.stat(target)).size;
  before += size;
  after += newSize;

  const backupPath = path.join(BACKUP, path.relative(ROOT, file));
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.rename(file, backupPath);

  renamed.push({ from: path.basename(file), to: base + ".webp" });
  console.log(`${path.relative(ROOT, file)}  ${mb(size)} → ${mb(newSize)}`);
}

/* update references inside your code */
let edited = 0;
for (const file of (await walk(SRC)).filter((f) => CODE.test(f))) {
  let text = await fs.readFile(file, "utf8");
  let changed = text;
  for (const { from, to } of renamed) {
    const pattern = new RegExp("(?<=[/\"'`(])" + escapeRegExp(from), "g");
    changed = changed.replace(pattern, to);
  }
  if (changed !== text) {
    await fs.writeFile(file, changed);
    edited += 1;
    console.log("updated imports in", path.relative(ROOT, file));
  }
}

console.log("\nDone.");
console.log(`Converted ${renamed.length} images: ${mb(before)} → ${mb(after)}`);
console.log(`Files with updated imports: ${edited}`);
console.log(`Originals are saved in: ${BACKUP}`);
