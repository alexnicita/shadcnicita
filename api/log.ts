import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const timestamp = new Date().toISOString();
  const { method, url, headers } = req;

  // Log basic request info
  console.log(`[${timestamp}] ${method} ${url}`);
  console.log(`User-Agent: ${headers["user-agent"]}`);
  console.log(`Referer: ${headers.referer || "Direct"}`);
  console.log(`IP: ${headers["x-forwarded-for"] || "Unknown"}`);

  // Log any body data for POST requests
  const body = (method === "POST" ? (req.body as any) : undefined) || undefined;
  if (body) {
    console.log("Request Body:", JSON.stringify(body));
  }

  // Fire-and-forget Slack notification for blog page views, if configured
  try {
    const webhook = process.env.SLACK_WEBHOOK_URL;
    const pagePath = body?.page as string | undefined;
    if (webhook && pagePath && pagePath.startsWith("/blog")) {
      const ref = (body?.referrer as string) || (headers.referer as string) || "Direct";
      const ua = (body?.userAgent as string) || (headers["user-agent"] as string) || "Unknown";
      const text = `New blog view: ${pagePath}\nReferrer: ${ref}\nUA: ${ua}\nTime: ${timestamp}`;
      // Don't await to keep response snappy
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).catch(() => {});
    }
  } catch {
    // Ignore notification errors
  }

  // Respond quickly
  res.status(200).json({
    logged: true,
    timestamp,
    message: "Request logged successfully",
  });
}
