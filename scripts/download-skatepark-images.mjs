import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { Jimp } from 'jimp';
import { skateparks } from '../src/data/skateparks.ts';

const outputRoot = path.resolve('public/images/skateparks');
const reportPath = path.resolve('public/images/skateparks/sources.json');
const execFileAsync = promisify(execFile);

const manualOverrides = {
  'skatepark-daverlo-brugge': {
    url: 'https://walraetstraat-assebroek.be/wp-content/uploads/20221011_120306-600x338.jpg',
    sourceQuery: 'manual override',
  },
  'skatepark-de-valkaart-oostkamp': {
    url: 'https://www.oostkamp.be/file/imagecache/4FB71F14302CF4D2A43B3078ADA080D5/Content/c14f1d49-24c6-44f6-a009-80482753d0bf/1102.jpg',
    sourceQuery: 'manual override',
  },
  'skatepark-ridefort-ruddervoorde': {
    url: 'https://www.oostkamp.be/file/imagecache/4FB71F14302CF4D2A43B3078ADA080D5/Content/c14f1d49-24c6-44f6-a009-80482753d0bf/1102.jpg',
    sourceQuery: 'manual override',
  },
  'skatepark-hertsberge-oostkamp': {
    url: 'https://www.oostkamp.be/file/imagecache/4FB71F14302CF4D2A43B3078ADA080D5/Content/c14f1d49-24c6-44f6-a009-80482753d0bf/1102.jpg',
    sourceQuery: 'manual override',
  },
  'skatepark-lichtervelde': {
    url: 'https://www.lichtervelde.be/file/imagecache/7FP0FpjnGe13Dsv0WXT9E0YU7PPSPOo01emOuWVqdU3d/content/fb537e8e-0692-4729-b1ce-2de1eb30206a/2806.jpg',
    sourceQuery: 'manual override',
  },
  'skatepark-luxaplast-marke-kortrijk': {
    url: 'https://www.concretematters.nl/wp-content/uploads/2018/04/kortrijk-luxaplast-centerpiece-solo-1024x512.jpg',
    sourceQuery: 'manual override',
  },
  'skatepark-koksijde': {
    url: 'https://www.visitkoksijde.be/sites/default/files/styles/original_ratio_zero/public/2024-05/skaten%20skater%20Gust-SOF-4025%20%281%29_1.jpg?itok=zzeCOi0i',
    sourceQuery: 'manual override',
  },
  'skatepark-poperinge': {
    url: 'https://befulious.com/skateparks/img/poperinge/poperinge001.jpg',
    sourceQuery: 'manual override',
  },
};

const blockedHosts = [
  'ytimg.com',
  'youtube.com',
  'facebook.com',
  'fbcdn.net',
  'lookaside.fbsbx.com',
  'tiktok.com',
  'pinimg.com',
  'pinterest.com',
  'instagram.com',
  'cdninstagram.com',
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
    .replace(/&quot;/g, '"');
}

function getSearchQueries(park) {
  return [
    `${park.name} ${park.city} skatepark`,
    `${park.name} ${park.city}`,
    `${park.city} skatepark ${park.address}`,
  ];
}

function scoreUrl(url, park) {
  let score = 0;
  const lower = url.toLowerCase();

  if (lower.includes('skate') || lower.includes('park')) score += 2;
  if (lower.includes(park.city.toLowerCase())) score += 4;
  if (lower.includes(park.slug.replaceAll('-', ''))) score += 2;
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) score += 2;
  if (lower.includes('static') || lower.includes('thumbnail')) score -= 2;
  if (lower.includes('logo')) score -= 3;

  return score;
}

async function getImageCandidates(query, park) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC3`;
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'accept-language': 'nl-BE,nl;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Search failed for "${query}" with ${response.status}`);
  }

  const html = await response.text();
  const matches = Array.from(html.matchAll(/murl&quot;:&quot;(.*?)&quot;/g))
    .map((match) => decodeHtml(match[1]))
    .filter(Boolean);

  const unique = Array.from(new Set(matches));

  return unique
    .filter((candidate) => {
      try {
        const parsed = new URL(candidate);
        return !blockedHosts.some((host) => parsed.hostname.includes(host));
      } catch {
        return false;
      }
    })
    .sort((a, b) => scoreUrl(b, park) - scoreUrl(a, park))
    .slice(0, 12);
}

async function downloadCandidate(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      referer: 'https://www.bing.com/',
    },
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`Download failed with ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Not an image: ${contentType}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (buffer.length < 15_000) {
    throw new Error('Image too small');
  }

  return { buffer, contentType };
}

async function writeCover(buffer, outputFile) {
  try {
    const image = await Jimp.read(buffer);
    await image.write(outputFile);
    return true;
  } catch (error) {
    const tempInput = path.join(os.tmpdir(), `skatepark-source-${Date.now()}.img`);
    const tempOutput = path.join(os.tmpdir(), `skatepark-output-${Date.now()}.jpg`);

    try {
      await fs.writeFile(tempInput, buffer);
      await execFileAsync('sips', ['-s', 'format', 'jpeg', tempInput, '--out', tempOutput]);
      const converted = await fs.readFile(tempOutput);
      await fs.writeFile(outputFile, converted);
      return true;
    } catch {
      return false;
    } finally {
      await fs.rm(tempInput, { force: true }).catch(() => {});
      await fs.rm(tempOutput, { force: true }).catch(() => {});
    }
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  await ensureDir(outputRoot);
  const existingReport = await fs
    .readFile(reportPath, 'utf8')
    .then((content) => JSON.parse(content))
    .catch(() => []);
  const report = Array.isArray(existingReport) ? existingReport : [];
  const selectedSlugs = process.argv.slice(2);
  const parksToProcess = selectedSlugs.length
    ? skateparks.filter((park) => selectedSlugs.includes(park.slug))
    : skateparks;

  for (const [index, park] of parksToProcess.entries()) {
    const destinationDir = path.join(outputRoot, park.slug);
    const destinationFile = path.join(destinationDir, 'cover.jpg');
    await ensureDir(destinationDir);

    let success = false;
    let selectedUrl = null;
    let selectedQuery = null;
    const tried = [];

    console.log(`[${index + 1}/${parksToProcess.length}] ${park.name}`);

    const manualOverride = manualOverrides[park.slug];
    if (manualOverride) {
      try {
        const { buffer } = await downloadCandidate(manualOverride.url);
        const written = await writeCover(buffer, destinationFile);
        if (written) {
          success = true;
          selectedUrl = manualOverride.url;
          selectedQuery = manualOverride.sourceQuery;
        }
      } catch (error) {
        tried.push({ query: manualOverride.sourceQuery, candidate: manualOverride.url, error: String(error) });
      }
    }

    for (const query of success ? [] : getSearchQueries(park)) {
      let candidates = [];

      try {
        candidates = await getImageCandidates(query, park);
      } catch (error) {
        tried.push({ query, error: String(error) });
        await sleep(600);
        continue;
      }

      for (const candidate of candidates) {
        try {
          const { buffer } = await downloadCandidate(candidate);
          const written = await writeCover(buffer, destinationFile);

          if (!written) {
            tried.push({ query, candidate, error: 'Unsupported image format for conversion' });
            continue;
          }

          success = true;
          selectedUrl = candidate;
          selectedQuery = query;
          break;
        } catch (error) {
          tried.push({ query, candidate, error: String(error) });
        }

        await sleep(350);
      }

      if (success) {
        break;
      }

      await sleep(800);
    }

    const reportEntry = {
      id: park.id,
      slug: park.slug,
      name: park.name,
      success,
      sourceUrl: selectedUrl,
      sourceQuery: selectedQuery,
      outputFile: path.relative(process.cwd(), destinationFile),
      attempts: tried.slice(0, 20),
    };

    const existingIndex = report.findIndex((entry) => entry.slug === park.slug);
    if (existingIndex >= 0) {
      report[existingIndex] = reportEntry;
    } else {
      report.push(reportEntry);
    }
  }

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  const successCount = report.filter((entry) => entry.success).length;
  const failed = report.filter((entry) => !entry.success).map((entry) => entry.slug);

  console.log(`Done: ${successCount}/${report.length} images saved.`);
  if (failed.length) {
    console.log(`Missing: ${failed.join(', ')}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
