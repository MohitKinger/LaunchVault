import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();

    if (!idea || idea.trim().length < 3) {
      return NextResponse.json(
        { error: "Startup idea is too short. Please enter a valid idea." },
        { status: 400 }
      );
    }

    const prompt = `
You are a startup mentor. For the idea: "${idea}", respond strictly in this JSON format only:
{
  "pros": "1. Point one.\\n2. Point two.\\n3. Point three.\\n4. Point four.\\n5. Point five.",
  "cons": "1. Point one...\\n2. Point two.\\n3. Point three.\\n4. Point four.\\n5. Point five.",
  "mvp": "Multi-line MVP description 1. Point one.\\n2. Point two.\\n3. Point three.\\n4. Point four.\\n5. Point five.",
  "monetization": "Detailed monetization strategies.1. Point one.\\n2. Point two.\\n3. Point three.\\n4. Point four.\\n5. Point five.",
  "competitors": "List of competitors with small description. 1. Point one...\\n2. Point two.\\n3. Point three.\\n4. Point four.\\n5. Point five."
}
No extra text or commentary.
    `;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });

    const apiJson = await res.json();

    // ✅ Check OpenRouter API errors first
    if (apiJson?.error) {
      console.error("❌ OpenRouter API Error:", apiJson.error.message);
      return NextResponse.json({
        error: apiJson.error.message,
        fallback: {
          pros: "⚠️ AI returned an error.",
          cons: "⚠️ Unable to process cons due to AI error.",
          mvp: "⚠️ Failed to generate MVP.",
          monetization: "⚠️ Monetization data not available.",
          competitors: "⚠️ Competitor info unavailable.",
        }
      });
    }

    // ✅ Extract AI message
    const content = apiJson?.choices?.[0]?.message?.content;

    if (!content) {
      console.error("❌ No AI content found:", apiJson);
      return NextResponse.json({
        error: "No valid AI response content found.",
        fallback: {
          pros: "⚠️ Missing AI content.",
          cons: "⚠️ Missing AI content.",
          mvp: "⚠️ Missing AI content.",
          monetization: "⚠️ Missing AI content.",
          competitors: "⚠️ Missing AI content.",
        }
      });
    }

    // ✅ Try parsing JSON content
    let data;
    try {
      data = JSON.parse(content);
    } catch (err) {
      console.error("❌ JSON parse failed:", err);
      console.error("Broken Content:", content);
      return NextResponse.json({
        error: "AI returned invalid JSON.",
        fallback: {
          pros: "⚠️ Could not parse pros.",
          cons: "⚠️ Could not parse cons.",
          mvp: "⚠️ Could not parse MVP.",
          monetization: "⚠️ Could not parse monetization.",
          competitors: "⚠️ Could not parse competitors.",
        }
      });
    }

    // ✅ Ensure required keys exist
    const requiredKeys = ["pros", "cons", "mvp", "monetization", "competitors"];
    const missing = requiredKeys.filter((key) => !(key in data));

    if (missing.length > 0) {
      console.warn("⚠️ Missing keys:", missing);
      return NextResponse.json({
        error: "Some keys missing from AI response.",
        missing,
        fallback: {
          pros: data.pros || "⚠️ Pros missing.",
          cons: data.cons || "⚠️ Cons missing.",
          mvp: data.mvp || "⚠️ MVP missing.",
          monetization: data.monetization || "⚠️ Monetization missing.",
          competitors: data.competitors || "⚠️ Competitors missing.",
        }
      });
    }

    // ✅ Success
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("🔥 Server Error:", err);
    return NextResponse.json({
      error: err?.message || "Unknown server error",
      fallback: {
        pros: "⚠️ Internal error occurred.",
        cons: "⚠️ Internal error occurred.",
        mvp: "⚠️ Internal error occurred.",
        monetization: "⚠️ Internal error occurred.",
        competitors: "⚠️ Internal error occurred.",
      }
    });
  }
}
