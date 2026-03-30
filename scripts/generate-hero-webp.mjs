import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const heroDir = path.join(projectRoot, 'public', 'images', 'hero');

const outputs = [
  { suffix: '960', width: 960, quality: 72 },
  { suffix: '1600', width: 1600, quality: 74 },
];

const banners = [1, 2, 3];

async function run() {
  for (const id of banners) {
    const input = path.join(heroDir, `hero-banner-${id}.jpg`);

    for (const output of outputs) {
      const target = path.join(heroDir, `hero-banner-${id}-${output.suffix}.webp`);
      await sharp(input)
        .resize({ width: output.width, withoutEnlargement: true })
        .webp({ quality: output.quality })
        .toFile(target);
      console.log(`Generated ${path.relative(projectRoot, target)}`);
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
