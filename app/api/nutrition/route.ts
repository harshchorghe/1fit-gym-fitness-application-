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
You are a certified nutritionist and dietitian. Create personalized, safe, and effective meal plans.
Respond **only** with valid JSON, no extra text, markdown, or explanations. Use exactly this structure:

{
  "title": "Short catchy title for the meal plan",
  "calories": number (total daily calories),
  "protein": number (grams),
  "carbs": number (grams),
  "fats": number (grams),
  "meals": [
    {
      "name": "Breakfast",
      "time": "8:00 AM",
      "items": ["Food item 1 (portion)", "Food item 2 (portion)"],
      "calories": number,
      "macros": {"protein": number, "carbs": number, "fats": number}
    },
    {
      "name": "Lunch",
      "time": "12:00 PM",
      "items": ["Food item 1 (portion)", "Food item 2 (portion)"],
      "calories": number,
      "macros": {"protein": number, "carbs": number, "fats": number}
    },
    {
      "name": "Dinner",
      "time": "7:00 PM",
      "items": ["Food item 1 (portion)", "Food item 2 (portion)"],
      "calories": number,
      "macros": {"protein": number, "carbs": number, "fats": number}
    },
    {
      "name": "Snacks",
      "time": "As needed",
      "items": ["Snack 1 (portion)", "Snack 2 (portion)"],
      "calories": number,
      "macros": {"protein": number, "carbs": number, "fats": number}
    }
  ],
  "notes": ["Brief nutrition tips", "Hydration reminder", "Any special instructions"]
}

Create a realistic, balanced meal plan based on the user's description. Use reasonable portions and common foods.`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nUser request: ${userPrompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000,  // Increased from 2000
      },
    });

    const reply = result.response.text().trim();

    // Clean the response - remove markdown code blocks if present
    let cleanReply = reply;
    if (cleanReply.startsWith('```json')) {
      cleanReply = cleanReply.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanReply.startsWith('```')) {
      cleanReply = cleanReply.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Additional cleaning - remove any remaining backticks or language identifiers
    cleanReply = cleanReply.replace(/```/g, '').trim();

    // Try to find JSON object boundaries
    const jsonStart = cleanReply.indexOf('{');
    const jsonEnd = cleanReply.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanReply = cleanReply.substring(jsonStart, jsonEnd + 1);
    }

    // Optional: log for debugging (remove in production)
    console.log('Gemini raw reply:', reply);
    console.log('Cleaned reply:', cleanReply);

    // Validate JSON before returning
    try {
      JSON.parse(cleanReply);
    } catch (parseError) {
      console.error("Invalid JSON from Gemini:", cleanReply);
      return NextResponse.json(
        { error: "AI returned invalid JSON format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply: cleanReply });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate nutrition plan" },
      { status: 500 }
    );
  }
}