// Spotify's upstream endpoint returns an app-only spotify: URI.
// Resolve it on the server and send browsers to the equivalent HTTPS URL.
export const dynamic = "force-dynamic";

export async function GET() {
  const fallback = "https://open.spotify.com/user/31ransghntv6c7ihvjpjkkn54uju";
  let destination = fallback;
  try {
    const response = await fetch(
      "https://spotify-github-profile.kittinanx.com/api/view?uid=31ransghntv6c7ihvjpjkkn54uju&redirect=true",
      { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(8000) }
    );
    const location = response.headers.get("location") || "";
    const uri = /^spotify:(track|episode):([A-Za-z0-9]{22})$/.exec(location);
    if (uri) {
      destination = `https://open.spotify.com/${uri[1]}/${uri[2]}`;
    } else if (location) {
      const url = new URL(location);
      if (url.protocol === "https:" && url.hostname === "open.spotify.com") {
        destination = url.href;
      }
    }
  } catch {
    // Keep the card useful when playback is offline or the provider is down.
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      "Cache-Control": "no-store, max-age=0",
      "Vercel-CDN-Cache-Control": "no-store",
    },
  });
}
