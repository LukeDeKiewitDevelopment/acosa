// Image audit: where each image in src/assets/images is used, plus exact and
// near-duplicate files. Run: node scripts/image-audit.mjs
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imageDir = join(root, "src", "assets", "images");
const sourceDirs = [
  "src/content",
  "src/pages",
  "src/components",
  "src/layouts",
  "src/lib",
];
const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;
const SOURCE_EXT = /\.(astro|tsx?|ya?ml|mdoc|md|json)$/i;

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const toPosix = (path) => path.split(sep).join("/");
const images = walk(imageDir).filter((f) => IMAGE_EXT.test(f));
const sources = sourceDirs
  .flatMap((d) => walk(join(root, d)))
  .filter((f) => SOURCE_EXT.test(f))
  .map((f) => ({
    file: toPosix(relative(root, f)),
    text: readFileSync(f, "utf8"),
  }));

// Difference hash: 9x8 greyscale, one bit per horizontal gradient.
async function dHash(file) {
  const px = await sharp(file)
    .greyscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer();
  let bits = "";
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++)
      bits += px[y * 9 + x] > px[y * 9 + x + 1] ? "1" : "0";
  return bits;
}
const hamming = (a, b) => [...a].filter((c, i) => c !== b[i]).length;

const rows = [];
for (const file of images) {
  const rel = toPosix(relative(join(root, "src", "assets"), file)); // images/pages/...
  const usedBy = sources
    .filter(({ text }) => text.includes(rel.replace(/^images\//, "images/")))
    .map(({ file: f }) => f);
  rows.push({
    image: rel,
    sha1: createHash("sha1").update(readFileSync(file)).digest("hex"),
    hash: await dHash(file),
    usedBy,
  });
}

const exact = new Map();
for (const row of rows)
  exact.set(row.sha1, [...(exact.get(row.sha1) ?? []), row.image]);

const near = [];
for (let i = 0; i < rows.length; i++)
  for (let j = i + 1; j < rows.length; j++) {
    const d = hamming(rows[i].hash, rows[j].hash);
    if (d <= 8 && rows[i].sha1 !== rows[j].sha1)
      near.push([rows[i].image, rows[j].image, d]);
  }

console.log("## Usage\n");
for (const row of rows.filter((r) => r.usedBy.length > 0))
  console.log(`- ${row.image} <- ${row.usedBy.join(", ")}`);
console.log("\n## Unused\n");
for (const row of rows.filter((r) => r.usedBy.length === 0))
  console.log(`- ${row.image}`);
console.log("\n## Exact duplicates (same bytes)\n");
for (const group of [...exact.values()].filter((g) => g.length > 1))
  console.log(`- ${group.join(" = ")}`);
console.log("\n## Near duplicates (dHash distance <= 8)\n");
for (const [a, b, d] of near) console.log(`- ${a} ~ ${b} (distance ${d})`);
