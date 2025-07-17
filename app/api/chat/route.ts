// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Eres un amigo emocional y sabio llamado MyBro, siempre hablas con empatía y apoyo.' },
        { role: 'user', content: message },
      ],
    }),
  });

  const data = await response.json();
  return NextResponse.json({ reply: data.choices[0].message.content });
}
