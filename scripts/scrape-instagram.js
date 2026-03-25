import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = 'dailygrindskateshop';
const MAX_POSTS = 100;
const OUTPUT_FILE = path.join(__dirname, '../src/data/instagramPosts.ts');
const IMAGE_DIR = path.join(__dirname, '../public/images/instagram');
const SESSIONID = process.env.INSTAGRAM_SESSIONID;

const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0',
  'X-IG-App-ID': '936619743392459',
  Referer: `https://www.instagram.com/${USERNAME}/`,
  ...(SESSIONID ? { Cookie: `sessionid=${SESSIONID}` } : {})
};

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

function extensionFromContentType(contentType) {
  if (!contentType) return '.jpg';
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('webp')) return '.webp';
  return '.jpg';
}

function sanitizeCaption(caption) {
  if (!caption) return 'Daily Grind Instagram post';

  const normalized = caption.replace(/\s+/g, ' ').trim();
  if (!normalized) return 'Daily Grind Instagram post';

  return normalized.length > 120 ? `${normalized.slice(0, 117)}...` : normalized;
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJsonWithRetry(url, attempts = 10) {
  let lastError = null;

  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await axios.get(url, {
        headers: REQUEST_HEADERS,
        timeout: 20000
      });
      return response.data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      const retryable = status === 401 || status === 429 || status >= 500;

      if (!retryable || i === attempts - 1) {
        throw lastError;
      }

      await wait((i + 1) * 7000);
    }
  }

  throw lastError;
}

function resetImageDirectory() {
  for (const fileName of fs.readdirSync(IMAGE_DIR)) {
    if (fileName.startsWith('.')) continue;
    fs.unlinkSync(path.join(IMAGE_DIR, fileName));
  }
}

function getImageCandidatesFromItem(item) {
  if (!item) return [];

  // media_type: 1 = image, 2 = video, 8 = carousel
  if (item.media_type === 1) {
    return [item];
  }

  if (item.media_type === 8 && Array.isArray(item.carousel_media)) {
    return item.carousel_media.filter((media) => media?.media_type === 1);
  }

  return [];
}

function getImageCandidatesFromProfileNode(node) {
  if (!node) return [];

  if (node.is_video) {
    return [];
  }

  if (!node.display_url && !node.thumbnail_src) {
    return [];
  }

  return [
    {
      image_versions2: {
        candidates: [{ url: node.display_url || node.thumbnail_src }]
      }
    }
  ];
}

function hasAtLeastImagePost(item) {
  return getImageCandidatesFromItem(item).length > 0;
}

async function scrapeInstagramPosts() {
  const profileData = await getJsonWithRetry(
    `https://i.instagram.com/api/v1/users/web_profile_info/?username=${USERNAME}`
  );
  const user = profileData?.data?.user;
  const userId = user?.id;
  const expectedPostCount = user?.edge_owner_to_timeline_media?.count ?? null;

  if (!userId) {
    throw new Error('Could not determine Instagram user id.');
  }

  const allItems = [];
  let nextMaxId = null;
  let hasMore = true;
  let usedFeedPagination = false;

  while (hasMore) {
    const feedUrl = nextMaxId
      ? `https://i.instagram.com/api/v1/feed/user/${userId}/?count=33&max_id=${encodeURIComponent(nextMaxId)}`
      : `https://i.instagram.com/api/v1/feed/user/${userId}/?count=33`;

    let page;
    try {
      page = await getJsonWithRetry(feedUrl);
    } catch (error) {
      if (error?.response?.status === 401 && !SESSIONID) {
        if (allItems.length > 0) {
          // Keep whatever was fetched before the throttle.
          hasMore = false;
          break;
        }

        // Fallback to profile page items (usually latest image posts only).
        const edges = user?.edge_owner_to_timeline_media?.edges ?? [];
        for (const edge of edges) {
          const node = edge?.node;
          if (!node) continue;
          allItems.push({
            code: node.shortcode,
            media_type: node.is_video ? 2 : 1,
            image_versions2: {
              candidates: [{ url: node.display_url || node.thumbnail_src || '' }]
            },
            caption: {
              text: node?.edge_media_to_caption?.edges?.[0]?.node?.text ?? ''
            },
            accessibility_caption: node?.accessibility_caption || 'Daily Grind Instagram post',
            taken_at: node?.taken_at_timestamp || null
          });
        }
        hasMore = false;
        break;
      }
      throw error;
    }
    const items = page?.items ?? [];

    allItems.push(...items);
    usedFeedPagination = true;
    hasMore = Boolean(page?.more_available);
    nextMaxId = page?.next_max_id ?? null;

    const imagePostCount = allItems.filter(hasAtLeastImagePost).length;
    if (imagePostCount >= MAX_POSTS) {
      hasMore = false;
    }

    await wait(2200);
  }

  allItems.sort((a, b) => {
    const aTs = a?.taken_at ?? 0;
    const bTs = b?.taken_at ?? 0;
    return bTs - aTs;
  });

  const posts = [];
  let postIdCounter = 1;
  let imageCounter = 0;

  for (const item of allItems) {
    if (posts.length >= MAX_POSTS) {
      break;
    }

    const shortcode = item?.code;
    if (!shortcode) continue;

    const imageMedia = getImageCandidatesFromItem(item);
    if (!imageMedia.length) {
      // Skip pure video posts.
      continue;
    }

    const localImagePaths = [];

    for (let i = 0; i < imageMedia.length; i += 1) {
      const media = imageMedia[i];
      const remoteImageUrl = media?.image_versions2?.candidates?.[0]?.url;
      if (!remoteImageUrl) continue;

      try {
        const imageResponse = await axios.get(remoteImageUrl, {
          responseType: 'arraybuffer',
          headers: REQUEST_HEADERS,
          timeout: 25000
        });

        const ext = extensionFromContentType(imageResponse.headers['content-type']);
        const suffix = imageMedia.length > 1 ? `-${i + 1}` : '';
        const fileName = `${shortcode}${suffix}${ext}`;
        const filePath = path.join(IMAGE_DIR, fileName);

        fs.writeFileSync(filePath, imageResponse.data);
        localImagePaths.push(`/images/instagram/${fileName}`);
        imageCounter += 1;
      } catch (error) {
        console.warn(`Skipping image for ${shortcode}: ${error.message}`);
      }
    }

    if (!localImagePaths.length) {
      continue;
    }

    posts.push({
      id: postIdCounter,
      shortcode,
      permalink: `https://www.instagram.com/p/${shortcode}/`,
      imageUrl: localImagePaths[0],
      caption: sanitizeCaption(item?.caption?.text ?? ''),
      alt: item?.accessibility_caption || 'Daily Grind Instagram post',
      timestamp: item?.taken_at || null
    });

    postIdCounter += 1;
  }

  if (!posts.length || imageCounter === 0) {
    throw new Error('Could not download Instagram images locally.');
  }

  if (expectedPostCount && posts.length < expectedPostCount && !SESSIONID) {
    console.warn(
      `Partial scrape (${posts.length}/${expectedPostCount}) because Instagram blocked anonymous pagination. ` +
      'Set INSTAGRAM_SESSIONID to fetch all posts.'
    );
  }

  const fileContent = `export interface InstagramPost {\n  id: number;\n  shortcode: string;\n  permalink: string;\n  imageUrl: string;\n  caption: string;\n  alt: string;\n  timestamp: number | null;\n}\n\nexport const instagramPosts: InstagramPost[] = ${JSON.stringify(posts, null, 2)};\n`;

  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
  console.log(
    `Saved ${posts.length}/${MAX_POSTS} Instagram posts and ${imageCounter} images to ${OUTPUT_FILE}` +
    (usedFeedPagination ? '' : ' (profile fallback mode)')
  );
}

scrapeInstagramPosts().catch((error) => {
  console.error(`Instagram scrape failed: ${error.message}`);
  process.exit(1);
});
