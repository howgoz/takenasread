#!/usr/bin/env node
/**
 * Generates web-optimized images and a manifest for each gallery from
 * images/source/<category>/*.{jpg,jpeg,png}. Drop a new photo in the matching
 * source folder and this regenerates everything on the next build — no
 * HTML/JS changes needed.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SOURCE_ROOT = path.join(ROOT, "images", "source");
const IMAGE_EXT = /\.(jpe?g|png)$/i;

function slugify(filename) {
  return (
    filename
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + ".jpg"
  );
}

function listSourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.test(f))
    .sort();
}

async function buildHero() {
  const srcDir = path.join(SOURCE_ROOT, "hero");
  const outDir = path.join(ROOT, "images", "hero");
  fs.mkdirSync(outDir, { recursive: true });

  const files = listSourceFiles(srcDir);
  const names = [];
  for (const file of files) {
    const name = slugify(file);
    await sharp(path.join(srcDir, file))
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .jpeg({ quality: 74, mozjpeg: true })
      .toFile(path.join(outDir, name));
    names.push(name);
  }

  fs.writeFileSync(
    path.join(outDir, "manifest.js"),
    `window.HERO_IMAGES = ${JSON.stringify(names, null, 2)};\n`
  );
  console.log(`hero: ${names.length} image(s)`);
}

async function buildGallery(category) {
  const srcDir = path.join(SOURCE_ROOT, category);
  const thumbDir = path.join(ROOT, "images", category, "thumb");
  const fullDir = path.join(ROOT, "images", category, "full");
  fs.mkdirSync(thumbDir, { recursive: true });
  fs.mkdirSync(fullDir, { recursive: true });

  const files = listSourceFiles(srcDir);
  const names = [];
  for (const file of files) {
    const name = slugify(file);
    const input = path.join(srcDir, file);
    await sharp(input)
      .rotate()
      .resize({ width: 900, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(thumbDir, name));
    await sharp(input)
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(path.join(fullDir, name));
    names.push(name);
  }

  fs.writeFileSync(
    path.join(ROOT, "images", category, "manifest.js"),
    `window.${category.toUpperCase()}_IMAGES = ${JSON.stringify(names, null, 2)};\n`
  );
  console.log(`${category}: ${names.length} image(s)`);
}

(async () => {
  await buildHero();
  await buildGallery("commercial");
  await buildGallery("artistic");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
