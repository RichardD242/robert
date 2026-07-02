import { NextRequest, NextResponse } from "next/server";
import { mockBudgetData } from "@/lib/mock-data";

const CATEGORY_IDS = mockBudgetData.categories.map((c) => c.id);

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  }

  const { image, mediaType } = await req.json();
  if (!image || !mediaType) {
    return NextResponse.json({ error: "missing image" }, { status: 400 });
  }

  const prompt = `You are reading a screenshot of a bank or payments app (e.g. Revolut). Extract every transaction visible in the image.

Return ONLY a JSON array, no prose, no markdown fences. Each item must match this shape:
{ "merchant": string, "amount": number (positive, absolute value), "date": string (YYYY-MM-DD if visible, else ""), "categoryId": one of ${JSON.stringify(CATEGORY_IDS.concat("other"))} }

Pick the closest categoryId based on the merchant name. If nothing is readable, return [].`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inline_data: { mime_type: mediaType, data: image } },
              { text: prompt },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json({ error: "gemini request failed", detail }, { status: 502 });
  }

  const data = await response.json();

  if (data.promptFeedback?.blockReason) {
    return NextResponse.json(
      { error: `image was blocked: ${data.promptFeedback.blockReason}` },
      { status: 502 }
    );
  }

  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    return NextResponse.json(
      { error: `gemini returned no result (${candidate?.finishReason ?? "unknown"})` },
      { status: 502 }
    );
  }

  const jsonMatch = text.match(/\[[\s\S]*\]/);

  let transactions = [];
  try {
    transactions = JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch {
    return NextResponse.json({ error: "could not parse model output" }, { status: 502 });
  }

  return NextResponse.json({ transactions });
}
