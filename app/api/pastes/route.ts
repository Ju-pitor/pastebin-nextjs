import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;


    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Invalid content" },
        { status: 400 }
      );
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "Invalid ttl_seconds" },
        { status: 400 }
      );
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "Invalid max_views" },
        { status: 400 }
      );
    }

    const expiresAt =
      ttl_seconds !== undefined
        ? new Date(Date.now() + ttl_seconds * 1000)
        : null;

    const result = await pool.query(
      `
      INSERT INTO pastes (content, expires_at, max_views)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [content, expiresAt, max_views ?? null]
    );

    const id = result.rows[0].id;

    return NextResponse.json({
  id,
  url: `/p/${id}`,
});

  } catch (err) {
    console.error("POST /api/pastes failed:", err);

   
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
