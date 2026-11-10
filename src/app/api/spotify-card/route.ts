import { get, put } from "@vercel/blob";

// The upstream widget can fail during ads and non-track playback. Keep each
// healthy card in Blob so an offline response or a cold start cannot erase it.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const LIVE_URL =
  "https://spotify-github-profile.kittinanx.com/api/view" +
  "?uid=31ransghntv6c7ihvjpjkkn54uju" +
  "&cover_image=true&theme=default&show_offline=true" +
  "&background_color=101b2b&interchange=false" +
  "&profanity=false&hide_remaster=false";

const LAST_GOOD_URL =
  "https://raw.githubusercontent.com/ryouy/ryouy/refs/heads/main/assets/spotify-last-good.svg";

const STORED_CARD_PATH = "spotify/last-playing.svg";

const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="445" viewBox="0 0 320 445"><rect width="320" height="445" rx="14" fill="#101b2b"/><text x="160" y="210" fill="#f7fbff" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="600" text-anchor="middle">Spotify</text><text x="160" y="243" fill="#b6cadb" font-family="Arial,Helvetica,sans-serif" font-size="14" text-anchor="middle">Playback temporarily unavailable</text></svg>`;

function isValidSvg(body: string, contentType: string): boolean {
  if (!contentType.toLowerCase().includes("image/svg+xml") || !body || body.length > 2_000_000) {
    return false;
  }
  const start = body.trimStart().replace(/^<\?xml[^>]*>\s*/i, "");
  return /^<svg(?:\s|>)/i.test(start);
}

// Keep a fast in-memory copy too; Blob is the durable copy shared by instances.
// The old GitHub snapshot remains a fallback if Blob is temporarily unavailable.
let lastPlayingSvg: string | null = null;
let lastStoredSvg: string | null = null;

function isPlayingTrack(svg: string): boolean {
  const normalized = svg.toLowerCase();
  return normalized.includes('class="artist">') &&
    normalized.includes('class="song">') &&
    !normalized.includes("currently not playing on spotify") &&
    !normalized.includes("nothing playing on spotify") &&
    !normalized.includes('class="artist">offline</div>');
}

async function fetchSvg(url: string, timeoutMs: number): Promise<string | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return null;
    const body = await response.text();
    return isValidSvg(body, response.headers.get("content-type") ?? "") ? body : null;
  } catch {
    return null;
  }
}

async function readStoredTrack(): Promise<string | null> {
  try {
    // Bypass the Blob CDN cache: overwritten cards must be visible immediately.
    const result = await get(STORED_CARD_PATH, { access: "private", useCache: false });
    if (result?.statusCode !== 200) return null;
    const svg = await new Response(result.stream).text();
    if (!isValidSvg(svg, result.blob.contentType) || !isPlayingTrack(svg)) return null;
    lastStoredSvg = svg;
    return svg;
  } catch (error) {
    console.warn("Spotify stored card unavailable:", error);
    return null;
  }
}

async function savePlayingTrack(svg: string): Promise<void> {
  if (lastStoredSvg === svg) return;

  try {
    const existing = await get(STORED_CARD_PATH, { access: "private", useCache: false });
    let ifMatch: string | undefined;
    if (existing?.statusCode === 200) {
      const previous = await new Response(existing.stream).text();
      if (previous === svg) {
        lastStoredSvg = svg;
        return;
      }
      ifMatch = existing.blob.etag;
    }

    // Save only real song cards, and avoid clobbering another instance's write.
    await put(STORED_CARD_PATH, svg, {
      access: "private",
      allowOverwrite: true,
      contentType: "image/svg+xml",
      ...(ifMatch ? { ifMatch } : {}),
    });
    lastStoredSvg = svg;
  } catch (error) {
    // A storage outage must never break the live image.
    console.warn("Spotify card could not be persisted:", error);
  }
}

type CardMode = "light" | "dark";

// The provider's default SVG fixes its text colors to white. Recolor the
// actual SVG (including cached tracks) so light mode keeps readable contrast.
function applyCardMode(svg: string, mode: CardMode): string {
  if (mode === "dark") return svg;
  return svg
    .replace("background-color: #101b2b;", "background-color: #f6f8fa;")
    .replace("color: #fff;", "color: #24292f;")
    .replace("color: #b3b3b3;", "color: #57606a;")
    .replace("color: #53b14f;", "color: #1a7f37;")
    .replace('fill="#101b2b"', 'fill="#f6f8fa"')
    .replace('fill="#f7fbff"', 'fill="#24292f"')
    .replace('fill="#b6cadb"', 'fill="#57606a"');
}

function svgResponse(svg: string, source: "live" | "memory" | "stored" | "last-good" | "placeholder", mode: CardMode): Response {
  return new Response(applyCardMode(svg, mode), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=20, stale-while-revalidate=60",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox",
      "X-Spotify-Card-Source": source,
      "X-Spotify-Card-Mode": mode,
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  const mode: CardMode = new URL(request.url).searchParams.get("mode") === "light" ? "light" : "dark";
  const live = await fetchSvg(LIVE_URL, 6000);
  if (live && isPlayingTrack(live)) {
    lastPlayingSvg = live;
    await savePlayingTrack(live);
    return svgResponse(live, "live", mode);
  }

  // The shared Blob is authoritative; a different warm instance may have
  // cached an older song in memory.
  const stored = await readStoredTrack();
  if (stored) {
    lastPlayingSvg = stored;
    return svgResponse(stored, "stored", mode);
  }

  // An ad, pause or offline response never replaces a previously played song.
  if (lastPlayingSvg) return svgResponse(lastPlayingSvg, "memory", mode);

  const lastGood = await fetchSvg(LAST_GOOD_URL, 5000);
  if (lastGood && isPlayingTrack(lastGood)) return svgResponse(lastGood, "last-good", mode);

  return svgResponse(PLACEHOLDER, "placeholder", mode);
}
