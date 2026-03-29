import fs from 'fs/promises';
import path from 'path';
import WebSocket from 'ws';
import { skateparks } from '../src/data/skateparks.ts';

const chromeEndpoint = 'http://127.0.0.1:9222';
const outputRoot = path.resolve('public/images/skateparks');
const reportPath = path.resolve('public/images/skateparks/sources.json');
const requiredPhotos = 3;

const queryOverrides = {
  'beastwood-skatepark-brugge': ['Skatepark Beastwood Sint-Michiels', 'Beastwood skatepark Brugge'],
  'skatepark-daverlo-brugge': ['Skatepark Daverlo Assebroek', 'Daverlo skatepark Brugge'],
  'skatepark-groene-meersen-zedelgem': ['Skatepark Groene Meersen Zedelgem', 'Groene Meersen skatepark'],
  'skatepark-jabbeke': ['Skatepark Jabbeke Vlamingveld', 'skatepark jabbeke'],
  'skatepark-ridefort-ruddervoorde': ['Ridefort skatepark Ruddervoorde', 'skatepark ruddervoorde ridefort'],
  'skatepark-hertsberge-oostkamp': ['Skatepark Hertsberge Kerkplein', 'skatepark hertsberge'],
  'skatepark-kerelsplein-roeselare': ['Kerelsplein Roeselare skatepark'],
  'skatepark-ingelmunster': ['Skatepark Ingelmunster Brigandbrug', 'skatepark ingelmunster'],
  'skatepark-tsas-harelbeke': ['TSAS Harelbeke skatepark', 'jeugdcentrum tsas skatepark harelbeke'],
  'skatepark-de-kazerne-anzegem': ['De Kazerne Anzegem skatepark', 'skatepark de kazerne anzegem'],
  'skatepark-velodroom-oostende': ['Skatepark Velodroom Oostende', 'velodroom skatepark oostende'],
  'stedelijk-sportstadion-oudenburg-skatepark': ['Skatepark Oudenburg Bekestraat', 'stedelijk sportstadion oudenburg skatepark'],
  'skatepark-de-pluimen-diksmuide': ['Skatepark De Pluimen Diksmuide', 'de pluimen diksmuide skatepark'],
  'skatepark-blankenberge': ['Skatepark Blankenberge Koning Albert I-laan 114b', 'skatepark blankenberge'],
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(text) {
  return (text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getTokens(...values) {
  const stopWords = new Set([
    'skatepark',
    'skate',
    'park',
    'de',
    'het',
    'den',
    'van',
    'in',
    'laan',
    'straat',
    'sportcentrum',
    'sportstadion',
    'centrum',
    'jeugdcentrum',
  ]);

  return Array.from(
    new Set(
      values
        .flatMap((value) => normalize(value).split(' '))
        .filter((token) => token.length > 2 && !stopWords.has(token)),
    ),
  );
}

function getSearchQueries(park) {
  const defaults = [
    `${park.name}, ${park.address}`,
    `${park.name} ${park.city}`,
    `${park.name}`,
    `skatepark ${park.city} ${park.address}`,
  ];

  return Array.from(new Set([...(queryOverrides[park.slug] ?? []), ...defaults]));
}

function scorePlace(park, candidate) {
  const haystack = normalize(`${candidate.aria} ${candidate.text}`);
  const name = normalize(park.name);
  const city = normalize(park.city);
  const tokens = getTokens(park.name, park.city, park.address);
  let score = 0;

  if (haystack.includes(name)) score += 40;
  if (city && haystack.includes(city)) score += 10;
  if (haystack.includes('skate')) score += 8;
  if (haystack.includes('pump track')) score -= 6;

  for (const token of tokens) {
    if (haystack.includes(token)) {
      score += 6;
    }
  }

  if (candidate.href.includes('/maps/place/')) {
    score += 2;
  }

  return score;
}

function toLargeImage(url) {
  const base = url.split('=')[0];
  return `${base}=w1600-h1200-k-no`;
}

async function createTarget(initialUrl) {
  const response = await fetch(`${chromeEndpoint}/json/new?${encodeURIComponent(initialUrl)}`, {
    method: 'PUT',
  });

  if (!response.ok) {
    throw new Error(`Unable to create Chrome target: ${response.status}`);
  }

  return response.json();
}

async function closeTarget(id) {
  await fetch(`${chromeEndpoint}/json/close/${id}`);
}

async function connectToTarget(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let sequence = 0;
  const pending = new Map();

  ws.on('message', (raw) => {
    const message = JSON.parse(String(raw));

    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);

      if (message.error) {
        reject(message.error);
      } else {
        resolve(message.result);
      }
    }
  });

  await new Promise((resolve, reject) => {
    ws.once('open', resolve);
    ws.once('error', reject);
  });

  async function send(method, params = {}) {
    const id = ++sequence;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  }

  await send('Runtime.enable');
  await send('Page.enable');

  return {
    ws,
    send,
    async evaluate(expression) {
      const result = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });

      return result.result.value;
    },
  };
}

async function openSearch(page, query) {
  const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}?hl=nl`;
  await page.send('Page.navigate', { url: searchUrl });
  await sleep(5000);
}

async function readPlaceCandidates(page) {
  const raw = await page.evaluate(`JSON.stringify(Array.from(document.querySelectorAll('a[href*="/maps/place/"]')).map((element) => ({
    text: (element.innerText || '').trim(),
    aria: element.getAttribute('aria-label') || '',
    href: element.href
  })))`);

  return JSON.parse(raw);
}

async function findBestPlace(page, park) {
  for (const query of getSearchQueries(park)) {
    await openSearch(page, query);

    const currentUrl = await page.evaluate('location.href');
    if (String(currentUrl).includes('/maps/place/')) {
      return {
        placeUrl: currentUrl,
        placeName: park.name,
        query,
      };
    }

    const candidates = await readPlaceCandidates(page);
    if (!candidates.length) {
      continue;
    }

    const ranked = candidates
      .map((candidate) => ({ ...candidate, score: scorePlace(park, candidate) }))
      .sort((left, right) => right.score - left.score);

    const best = ranked[0];
    if (best && best.score >= 16) {
      return {
        placeUrl: best.href,
        placeName: best.aria || best.text || park.name,
        query,
      };
    }
  }

  return null;
}

async function openPhotoContext(page, placeUrl) {
  await page.send('Page.navigate', { url: placeUrl });
  await sleep(5500);
}

async function readPhotoCandidates(page) {
  const raw = await page.evaluate(`JSON.stringify(Array.from(document.images)
    .map((img) => ({
      src: img.currentSrc || img.src,
      width: img.naturalWidth,
      height: img.naturalHeight
    }))
    .filter((img) => img.src.includes('googleusercontent.com/gps-cs-s/') && img.width >= 250 && img.height >= 180)
    .map((img) => ({
      ...img,
      base: img.src.split('=')[0]
    }))
  )`);

  const images = JSON.parse(raw);
  const deduped = [];
  const seen = new Set();

  for (const image of images.sort((left, right) => right.width * right.height - left.width * left.height)) {
    if (seen.has(image.base)) {
      continue;
    }

    seen.add(image.base);
    deduped.push(image);
  }

  return deduped;
}

async function revealMorePhotoCandidates(page) {
  await page.evaluate(`(() => {
    const heading = Array.from(document.querySelectorAll('h2, h3, div, span')).find((element) =>
      /Foto's en video's/i.test((element.textContent || '').trim()),
    );

    if (heading) {
      heading.scrollIntoView({ behavior: 'instant', block: 'center' });
      return 'scrolled';
    }

    window.scrollTo(0, document.body.scrollHeight * 0.35);
    return 'window';
  })()`);

  await sleep(2500);
}

async function downloadImage(url, outputFile) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0 Safari/537.36',
      referer: 'https://www.google.com/maps/',
      'accept-language': 'nl-BE,nl;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Download failed with ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 20_000) {
    throw new Error('Image too small');
  }

  await fs.writeFile(outputFile, buffer);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function loadReport() {
  const existing = await fs
    .readFile(reportPath, 'utf8')
    .then((content) => JSON.parse(content))
    .catch(() => []);

  return Array.isArray(existing) ? existing : [];
}

async function saveReport(report) {
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

async function main() {
  const report = await loadReport();
  const explicitSlugs = process.argv.slice(2);
  const candidateParks = explicitSlugs.length
    ? skateparks.filter((park) => explicitSlugs.includes(park.slug))
    : skateparks;

  const parksToProcess = [];
  for (const park of candidateParks) {
    const coverPath = path.join(outputRoot, park.slug, 'cover.jpg');
    const hasCover = await fs
      .access(coverPath)
      .then(() => true)
      .catch(() => false);

    if (!hasCover || explicitSlugs.includes(park.slug)) {
      parksToProcess.push(park);
    }
  }

  const target = await createTarget('https://www.google.com/maps?hl=nl');
  const page = await connectToTarget(target.webSocketDebuggerUrl);

  try {
    for (const [index, park] of parksToProcess.entries()) {
      console.log(`[${index + 1}/${parksToProcess.length}] ${park.name}`);

      const destinationDir = path.join(outputRoot, park.slug);
      await ensureDir(destinationDir);

      const match = await findBestPlace(page, park);
      if (!match) {
        console.log(`  No Google Maps place found.`);
        continue;
      }

      console.log(`  Place: ${match.placeName}`);
      console.log(`  Query: ${match.query}`);

      await openPhotoContext(page, match.placeUrl);
      let photos = await readPhotoCandidates(page);

      if (photos.length < requiredPhotos) {
        await revealMorePhotoCandidates(page);
        photos = await readPhotoCandidates(page);
      }

      if (!photos.length) {
        console.log('  No usable Google Maps photos found.');
        continue;
      }

      while (photos.length < requiredPhotos) {
        photos.push(photos[photos.length - 1]);
      }

      const selected = photos.slice(0, requiredPhotos);
      const outputFiles = [
        path.join(destinationDir, 'cover.jpg'),
        path.join(destinationDir, 'gallery-1.jpg'),
        path.join(destinationDir, 'gallery-2.jpg'),
      ];

      for (let photoIndex = 0; photoIndex < selected.length; photoIndex += 1) {
        const imageUrl = toLargeImage(selected[photoIndex].base);
        await downloadImage(imageUrl, outputFiles[photoIndex]);
        console.log(`  Saved ${path.basename(outputFiles[photoIndex])}`);
        await sleep(350);
      }

      const reportEntry = {
        id: park.id,
        slug: park.slug,
        name: park.name,
        success: true,
        sourceType: 'google-maps-user-photos',
        sourceQuery: match.query,
        sourceUrl: match.placeUrl,
        placeName: match.placeName,
        outputFile: outputFiles[0].replace(`${process.cwd()}/`, ''),
        galleryFiles: outputFiles.map((file) => file.replace(`${process.cwd()}/`, '')),
        photoUrls: selected.map((photo) => toLargeImage(photo.base)),
        attempts: [],
      };

      const existingIndex = report.findIndex((entry) => entry.slug === park.slug);
      if (existingIndex >= 0) {
        report[existingIndex] = reportEntry;
      } else {
        report.push(reportEntry);
      }

      await saveReport(report);
      await sleep(1200);
    }
  } finally {
    page.ws.close();
    await closeTarget(target.id);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
