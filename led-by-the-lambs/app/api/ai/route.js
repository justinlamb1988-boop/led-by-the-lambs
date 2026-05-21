import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { client: clientData, prompt } = await request.json();

    if (!prompt || !clientData) {
      return Response.json({ error: 'Missing prompt or client data' }, { status: 400 });
    }

    const systemPrompt = `You are an expert luxury travel planner assistant helping a boutique travel planning company called "The Roaming Lamb Travel Co.," run by Justin and Casondra Lamb based in Knoxville, Tennessee. You help them research and plan exceptional trips for their clients. Be specific, expert, and inspiring. Use your deep knowledge of destinations, hotels, restaurants, and experiences to give genuinely useful, detailed recommendations.`;

    const userPrompt = `Client profile:
- Name: ${clientData.first} ${clientData.last}
- Destination: ${clientData.dest}
- Travel style: ${clientData.style}
- Dates: ${clientData.depart} to ${clientData.ret}
- Travelers: ${clientData.travelers}
- Budget: ${clientData.budget} per person
- Special notes: ${clientData.notes || 'None'}

Request: ${prompt}`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    return Response.json({ text });

  } catch (error) {
    console.error('AI API error:', error);
    return Response.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
