import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ REQUIRED IN NEXT 16

  if (!id) {
    return NextResponse.json(
      { error: "Invalid paste id" },
      { status: 400 }
    );
  }

  const testMode = process.env.TEST_MODE === "1";
  const now = testMode
    ? new Date(Number(req.headers.get("x-test-now-ms")))
    : new Date();

  const { rows } = await pool.query(
    `
    UPDATE pastes
    SET view_count = view_count + 1
    WHERE id = $1
      AND (expires_at IS NULL OR expires_at > $2)
      AND (max_views IS NULL OR view_count < max_views)
    RETURNING content, expires_at, max_views, view_count
    `,
    [id, now]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  const row = rows[0];

  return NextResponse.json({
    content: row.content,
    remaining_views:
      row.max_views === null
        ? null
        : row.max_views - row.view_count,
    expires_at: row.expires_at,
  });
}
