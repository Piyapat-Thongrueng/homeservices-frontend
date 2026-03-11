import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }

  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/orders/my-orders/${encodeURIComponent(userId)}`,
      {
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "Backend error",
        status: response.status,
        details: text || response.statusText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Proxy /api/orders/my-orders error:", err);
    return res.status(502).json({
      error: "Cannot reach backend",
      message: err instanceof Error ? err.message : "Network error",
    });
  }
}

