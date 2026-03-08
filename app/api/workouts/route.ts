import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  baseURL: 'https://models.github.ai/inference',  // This is current & correct in 2026
  apiKey: process.env.GITHUB_MODELS_TOKEN,
  defaultHeaders: {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, model = 'openai/gpt-4o-mini' } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `You are FitAI, the official AI trainer of 1FitGym.
Respond ONLY with valid JSON, no extra text, markdown, or explanations. Use exactly this structure:
{
  "title": "Short catchy title",
  "duration": "e.g. 45 min",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "calories": number (estimated kcal burn),
  "trainer": "FitAI"
}
Create a safe, realistic, personalized workout plan based on the user's description. Use reasonable defaults if info is missing. Output ONLY the JSON object.`
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || '{}';

    // Optional: log for debugging (remove in production)
    console.log('AI raw reply:', reply);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('GitHub Models API error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      response: error.response?.data || error.response,
    });

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit reached. Try again in a few minutes.' },
        { status: 429 }
      );
    }

    if (error?.status === 404 || error?.status === 400) {
      return NextResponse.json(
        { error: 'Invalid model or endpoint. Check model name.' },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate workout. Please try again or check server logs.' },
      { status: 500 }
    );
  }
}