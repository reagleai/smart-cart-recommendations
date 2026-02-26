import { GoogleGenAI, Type, Schema } from "@google/genai";

export const config = {
  runtime: 'edge',
};

// Initialize the client with the server-side environment variable
const apiKey = process.env.API_KEY;

export default async function handler(req: Request) {
  // 1. CORS Headers
  const allowedOrigins = ['http://localhost:3000']; // Add your production URL here later
  const origin = req.headers.get('origin') || '';

  const headers = new Headers();
  if (allowedOrigins.includes(origin) || !origin) {
    headers.set('Access-Control-Allow-Origin', origin || '*');
  } else {
    headers.set('Access-Control-Allow-Origin', 'null');
  }

  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
  }

  // 2. Security: Validate API Key Existence
  if (!apiKey) {
    console.error("Server Error: API_KEY is missing.");
    return new Response(JSON.stringify({ error: "Server misconfiguration." }), { status: 500, headers });
  }

  // 3. Receive ONLY data, not the prompt
  const body = await req.json();
  const { signals, contextStr, cartSummary, candidateList } = body;

  if (!cartSummary || !candidateList) {
    return new Response(JSON.stringify({ error: "Missing cart data" }), { status: 400, headers });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 4. Construct Prompt SERVER-SIDE (Secure)
    // The user cannot edit this string to trick the AI.
    const promptText = `
      ROLE: Senior Recommendation Engine for Instamart.
      GOAL: Identify the User's Intent (Context) and prevent missed essentials (Retention).

      INPUT DATA:
      - Time: ${signals.timeBucket.toUpperCase()} (Hour: ${signals.hourLocal})
      - Occasion: ${signals.occasion || 'None'} (${signals.occasionType})
      - Payday Window: ${signals.isMonthStart || signals.isMonthEnd}
      - Detected Contexts: [ ${contextStr} ]
      - Cart Items: [ ${cartSummary} ]

      CANDIDATE POOL:
      ${candidateList}

      CRITICAL RULES:
      1. **DO NOT default to Breakfast.** Only use "Breakfast" framing IF "Breakfast Prep" is the top detected context OR if the time is Morning (5AM-11AM) AND the cart contains dairy/bread/eggs.
      2. **Respect Detected Context.** If the top detected context is "Cleaning Day" (e.g., Harpic, Lizol), suggest cleaning add-ons (Sponges, Bin Bags), NOT food.
      3. **Late Night Logic.** If time is Late Night, prioritize snacks/beverages over cooking ingredients.
      4. **Mixed Cart.** If no strong context is detected, default to "Weekly Restock" or "Kitchen Essentials" and suggest bridging items (Oil, Onions, Spices).

      INSTRUCTIONS:
      1. Select 6-10 items with the highest relevance to the Primary Context.
      2. "reason" must be short: "Pairs with Chips", "Cleaning Essential", "Puja Must-have".
      3. Return JSON matching schema.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        context: { type: Type.STRING, description: "Display title, e.g., 'Movie Night Essentials'" },
        message: { type: Type.STRING, description: "Helpful reminder, not salesy." },
        type: { type: Type.STRING, enum: ["retention", "upsell"] },
        primaryContextId: { type: Type.STRING },
        contextConfidence: { type: Type.NUMBER },
        suggestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              reason: { type: Type.STRING, description: "Max 3 words, specific to context." }
            },
            required: ["id", "reason"]
          }
        },
      },
      required: ["context", "message", "type", "suggestions"],
    };

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: promptText }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    return new Response(JSON.stringify({ text: result.text }), { status: 200, headers });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}
