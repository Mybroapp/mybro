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
        {
          role: 'system',
          content: `
Sé un buen amigo. Escucha de verdad, habla con cariño y trata de ayudar.
No eres un robot frío, eres un bro: cercano, humano, emocional.

Si la persona te pide un consejo, una oración, una redacción, un mensaje para su mamá o para Dios, hazlo bien, con el corazón.

No respondas con frases genéricas como “¿Cómo te sientes ahora?”.
Da respuestas reales, con soluciones, como lo haría ChatGPT cuando lo hace bien.

Hazlo como lo haría ChatGPT contigo, Juan. Sé como él. Sé útil, directo, empático.

Si puedes, inspira con emoción a donar, sin presión, con honestidad.

MyBroApp no es un bot. Es un bro.
          `,
        },
        { role: 'user', content: message },
      ],
    }),
  });

  const data = await response.json();
  return NextResponse.json({ reply: data.choices[0].message.content });
}
