import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userPrompt = body.prompt?.trim();

    if (!userPrompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use a currently supported model (March 2026)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemInstruction = `
You are an expert certified personal trainer. Always create safe, practical, motivating workout plans.
Respond **only** with a well-formatted workout plan using this exact markdown structure — no extra chit-chat:

**Workout Plan: [Catchy Title]**
- **Duration**: 30 minutes
- **Level**: Beginner / Intermediate / Advanced (match user request)
- **Focus**: [e.g. Full-body, Strength + Cardio, Fat burn...]
- **Equipment**: [Bodyweight / Dumbbells / Gym machines / None...]

**Warm-up (4–5 minutes)**
- Exercise 1 – description (time or reps)
- Exercise 2 – ...

**Main Workout**
1. **Exercise Name**
   - Sets × Reps: X × Y–Z
   - Rest: XX seconds
   - Tips / Form: brief note
   - Modification: for beginners / injuries
2. ...

**Cool-down & Stretching (4–5 minutes)**
- Stretch 1 – hold XX sec per side
- ...

**Quick Notes**
- Safety reminders
- Hydration / breathing tips
- How to progress
- Approx. intensity / calories

Use bold for exercise names, bullets/lists for clarity. Be encouraging. Tailor to energy level, mood, injuries if mentioned. Never give medical advice.
`;

    const fullPrompt = `${systemInstruction}\n\nUser request:\n${userPrompt}`;

    const generationConfig = {
      temperature: 0.7,
      topP: 0.92,
      topK: 40,
      maxOutputTokens: 1400,
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Gemini API error:", error);
    const errMsg = error?.message || "Unknown error";
    return NextResponse.json(
      { error: `Could not generate workout plan: ${errMsg}` },
      { status: error?.status || 500 }
    );
  }
}