// The upstream Spotify widget crashes on ads and some non-track playback.
// Serve it live when healthy, otherwise return a repository-backed last-good SVG.
// No Spotify credentials or paid storage are needed here.
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

const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="445" viewBox="0 0 320 445"><rect width="320" height="445" rx="14" fill="#101b2b"/><text x="160" y="210" fill="#f7fbff" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="600" text-anchor="middle">Spotify</text><text x="160" y="243" fill="#b6cadb" font-family="Arial,Helvetica,sans-serif" font-size="14" text-anchor="middle">Playback temporarily unavailable</text></svg>`;

function isValidSvg(body: string, contentType: string): boolean {
  if (!contentType.toLowerCase().includes("image/svg+xml") || !body || body.length > 2_000_000) {
    return false;
  }
  const start = body.trimStart().replace(/^<\?xml[^>]*>\s*/i, "");
  return /^<svg(?:\s|>)/i.test(start);
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

function svgResponse(svg: string, source: "live" | "last-good" | "placeholder"): Response {
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=20, stale-while-revalidate=60",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox",
      "X-Spotify-Card-Source": source,
    },
  });
}

export async function GET(): Promise<Response> {
  const live = await fetchSvg(LIVE_URL, 6000);
  if (live) return svgResponse(live, "live");

  const lastGood = await fetchSvg(LAST_GOOD_URL, 5000);
  if (lastGood) return svgResponse(lastGood, "last-good");

  return svgResponse(PLACEHOLDER, "placeholder");
}
