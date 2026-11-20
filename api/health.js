// Minimal Vercel serverless health endpoint.
// This endpoint intentionally does not read, return, or test database secrets.
// It performs no database writes and handles no traveler information.

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  return res.status(200).json({
    ok: true,
    service: "travel-entry-assist-api",
    stage: "scaffolding-only"
  });
}
