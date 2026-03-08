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
Respond **only** with valid JSON, no extra text, markdown, or explanations. Use exactly this structure:

{
  "title": "Short catchy title",
  "duration": "e.g. 45 min",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "calories": number (estimated kcal burn),
  "trainer": "FitAI",
  "equipment": "Bodyweight / Dumbbells / Gym machines / None",
  "focus": "Full-body, Strength + Cardio, Fat burn...",
  "warmup": ["Exercise 1 – description", "Exercise 2 – ..."],
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": "X",
      "reps": "Y–Z",
      "rest": "XX seconds",
      "tips": "brief form note",
      "modification": "for beginners/injuries"
    }
  ],
  "cooldown": ["Stretch 1 – hold XX sec", "Stretch 2 – ..."],
  "notes": ["Safety reminders", "Hydration tips", "Progression advice"]
}

Create a safe, realistic, personalized workout plan based on the user's description. Use reasonable defaults if info is missing. Output ONLY the JSON object.`;

    const fullPrompt = `${systemInstruction}\n\nUser request:\n${userPrompt}`;

    const generationConfig = {
      temperature: 0.7,
      topP: 0.92,
      topK: 40,
      maxOutputTokens: 4000,  // Increased from 1400
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text().trim();

    // Clean the response - remove markdown code blocks if present
    let cleanText = text;
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Additional cleaning - remove any remaining backticks or language identifiers
    cleanText = cleanText.replace(/```/g, '').trim();

    // Try to find JSON object boundaries
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
    }

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", cleanText);
      console.error("Parse error:", parseError);
      return NextResponse.json(
        { error: "AI returned invalid JSON format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply: JSON.stringify(parsed) });

  } catch (error: any) {
    console.error("Gemini API error:", error);
    const errMsg = error?.message || "Unknown error";
    return NextResponse.json(
      { error: `Could not generate workout plan: ${errMsg}` },
      { status: error?.status || 500 }
    );
  }
}