#!/usr/bin/env node
/**
 * Downloads the placeholder photography from Unsplash into /public/images.
 * Images are committed to the repo, so this only needs re-running to swap photos.
 * Usage: npm run fetch-images            (skips files that already exist)
 *        npm run fetch-images -- --force (re-downloads everything)
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "public/images");
const force = process.argv.includes("--force");

// name → Unsplash photo id (https://unsplash.com/photos/<id>)
export const IMAGES = {
  "hero.jpg": { id: "photo-1519699047748-de8e457a634e", w: 1800, h: 2250 },
  "salon.jpg": { id: "photo-1560066984-138dadb4c035", w: 1400, h: 1750 },
  "haircut.jpg": { id: "photo-1562322140-8baeececf3df", w: 1000, h: 1250 },
  "blow-dry.jpg": { id: "photo-1580618672591-eb180b1a973f", w: 1000, h: 1250 },
  "balayage.jpg": { id: "photo-1522337360788-8b13dee7a37e", w: 1000, h: 1250 },
  "colour.jpg": { id: "photo-1492106087820-71f1a00d2b11", w: 1000, h: 1250 },
  "treatment.jpg": { id: "photo-1634449571010-02389ed0f9b0", w: 1000, h: 1250 },
  "nails.jpg": { id: "photo-1604654894610-df63bc536371", w: 1000, h: 1250 },
  "facial.jpg": { id: "photo-1570172619644-dfd03ed5d881", w: 1000, h: 1250 },
  "makeup.jpg": { id: "photo-1487412947147-5cebf100ffc2", w: 1000, h: 1250 },
  "beauty-room.jpg": { id: "photo-1633681926022-84c23e8cb2d6", w: 1000, h: 1250 },
  "massage.jpg": { id: "photo-1544161515-4ab6ce6db874", w: 1000, h: 1250 },
  "bridal.jpg": { id: "photo-1525258946800-98cfd641d0de", w: 1000, h: 1250 },
  "curls.jpg": { id: "photo-1589156280159-27698a70f29e", w: 1000, h: 1250 },
};

const exists = (p) => access(p).then(() => true, () => false);

await mkdir(OUT, { recursive: true });
for (const [file, { id, w, h }] of Object.entries(IMAGES)) {
  const dest = path.join(OUT, file);
  if (!force && (await exists(dest))) {
    console.log(`skip  ${file}`);
    continue;
  }
  const url = `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=faces,entropy&fm=jpg&q=78`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL  ${file} (${res.status}) ${url}`);
    process.exitCode = 1;
    continue;
  }
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`ok    ${file}`);
}
