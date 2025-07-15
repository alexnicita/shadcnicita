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
  if (method === "POST" && req.body) {
    console.log("Request Body:", JSON.stringify(req.body));
  }

  // Respond quickly
  res.status(200).json({
    logged: true,
    timestamp,
    message: "Request logged successfully",
  });
}
