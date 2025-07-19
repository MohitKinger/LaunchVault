import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { handle } = await req.json();

    // ✅ Validate handle
    if (!handle || typeof handle !== "string" || handle.trim().length < 3) {
      return NextResponse.json(
        { error: "Invalid handle provided." },
        { status: 400 }
      );
    }

    const twitterUrl = `https://twitter.com/${handle}`;
    const domainUrl = `https://${handle}.com`;

    // ✅ Check both URLs simultaneously
    const [twitterRes, domainRes] = await Promise.all([
      fetch(twitterUrl, { method: "HEAD" }),
      fetch(domainUrl, { method: "HEAD" }),
    ]);

    return NextResponse.json({
      twitterTaken: twitterRes.status !== 404,
      domainTaken: domainRes.status !== 404,
    });
  } catch (err: any) {
    console.error("❌ Error checking handle/domain:", err.message || err);

    return NextResponse.json(
      { error: "Internal server error while checking availability." },
      { status: 500 }
    );
  }
}
