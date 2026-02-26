
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Product, CartItem } from "../types";
import { PRODUCT_DB } from "../constants";
import { CONTEXT_DEFINITIONS, ContextDefinition } from "../contextEngine";

// --- TYPES ---
export interface SuggestedItem {
  id: string;
  reason: string;
}

interface GeminiResponse {
  context: string;
  message: string;
  type: 'retention' | 'upsell';
  primaryContextId?: string;
  contextConfidence?: number;
  suggestions: SuggestedItem[];
}

interface DetectedContext {
  id: string;
  title: string;
  matchCount: number;
  matchedTriggers: string[];
  confidence: number;
  weightedScore: number;
}

interface RichSignals {
  timeBucket: 'morning' | 'afternoon' | 'evening' | 'late_night';
  hourLocal: number;
  dayOfWeek: number;
  isWeekend: boolean;
  dateString: string;
  isMonthStart: boolean;
  isMonthEnd: boolean;
  occasion: string | null;
  occasionType: 'holiday' | 'weekend' | 'none';
}

// --- PART A: CONTEXT DETECTION HELPER ---
const detectTopContexts = (cart: CartItem[], definitions: ContextDefinition[], topK = 3): { contexts: DetectedContext[], hasStrongContext: boolean } => {
  if (cart.length === 0) return { contexts: [], hasStrongContext: false };

  const cartItemNames = cart.map(i => ({ name: i.name.toLowerCase(), quantity: i.quantity }));

  const scoredContexts = definitions.map(def => {
    const matchedTriggers: string[] = [];
    let totalMatchingQty = 0;

    def.triggers.forEach(trigger => {
      const tLower = trigger.toLowerCase();
      if (cartItemNames.some(item => item.name.includes(tLower))) {
        matchedTriggers.push(trigger);
      }
    });

    cartItemNames.forEach(item => {
      if (def.triggers.some(trigger => item.name.includes(trigger.toLowerCase()))) {
        totalMatchingQty += item.quantity;
      }
    });

    const uniqueMatches = [...new Set(matchedTriggers)];
    const matchCount = uniqueMatches.length;
    const denominator = Math.max(3, Math.min(10, def.triggers.length));
    const confidence = matchCount > 0 ? parseFloat((matchCount / denominator).toFixed(2)) : 0;
    const weightedScore = (matchCount * 2) + (totalMatchingQty * 0.5);

    return {
      id: def.id,
      title: def.title,
      matchCount,
      matchedTriggers: uniqueMatches,
      confidence,
      weightedScore
    };
  });

  scoredContexts.sort((a, b) => {
    if (b.weightedScore !== a.weightedScore) return b.weightedScore - a.weightedScore;
    return b.confidence - a.confidence;
  });

  const validContexts = scoredContexts.filter(c => c.matchCount > 0).slice(0, topK);
  const hasStrongContext = validContexts.length > 0 && (validContexts[0].weightedScore >= 4.0 || validContexts[0].confidence >= 0.4);

  return { contexts: validContexts, hasStrongContext };
};

// --- PART B: RICH SIGNALS HELPER ---
const getRichSignals = (): RichSignals => {
  const now = new Date();
  const hour = now.getHours();
  const date = now.getDate();
  const day = now.getDay();
  const month = now.getMonth() + 1;

  let timeBucket: RichSignals['timeBucket'] = 'late_night';
  if (hour >= 5 && hour < 11) timeBucket = 'morning';
  else if (hour >= 11 && hour < 16) timeBucket = 'afternoon';
  else if (hour >= 16 && hour < 22) timeBucket = 'evening';

  const mmdd = `${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
  const holidays: Record<string, string> = {
    "01-01": "New Year",
    "01-14": "Makar Sankranti",
    "01-26": "Republic Day",
    "08-15": "Independence Day",
    "10-02": "Gandhi Jayanti",
    "12-25": "Christmas",
    "02-14": "Valentine's Day"
  };

  const fixedHoliday = holidays[mmdd];
  const isWeekend = day === 0 || day === 6;

  let occasion = null;
  let occasionType: RichSignals['occasionType'] = 'none';

  if (fixedHoliday) {
    occasion = fixedHoliday;
    occasionType = 'holiday';
  } else if (isWeekend) {
    occasion = "Weekend";
    occasionType = 'weekend';
  }

  return {
    timeBucket,
    hourLocal: hour,
    dayOfWeek: day,
    isWeekend,
    dateString: now.toISOString().split('T')[0],
    isMonthStart: date <= 3,
    isMonthEnd: date >= 25,
    occasion,
    occasionType
  };
};

// --- PART C: CANDIDATE SELECTION ---
const getCandidateProducts = (
  cart: CartItem[],
  allProducts: Product[],
  detectedContexts: DetectedContext[],
  signals: RichSignals,
  hasStrongContext: boolean
): Product[] => {
  const cartIds = new Set(cart.map((c) => c.id));
  const cartCategories = new Set(cart.map((c) => c.categoryId || ""));

  const associations: Record<string, string[]> = {
    staples_flours: ["pantry_spices_sauces", "dairy", "fresh_produce"],
    snacks: ["beverages", "sweets_chocolates"],
    beverages: ["snacks", "bakery_biscuits"],
    dairy: ["bakery_biscuits", "meat_eggs", "fresh_produce"],
    home_cleaning: ["personal_hygiene", "pantry_spices_sauces"],
    meat_eggs: ["pantry_spices_sauces", "staples_flours"],
    bakery_biscuits: ["dairy", "beverages"],
    fresh_produce: ["pantry_spices_sauces", "dairy"],
    personal_hygiene: ["home_cleaning", "health_wellness"],
    baby_care: ["personal_hygiene", "home_cleaning"],
    pet_care: ["home_cleaning"],
    puja_essentials: ["fresh_produce", "sweets_chocolates", "dairy"],
    sweets_chocolates: ["sweets_chocolates", "snacks"]
  };

  const targetCategories = new Set<string>();

  const contextCategoryMap: Record<string, string[]> = {
    party: ['beverages', 'snacks', 'sweets_chocolates', 'home_cleaning'],
    breakfast: ['dairy', 'bakery_biscuits', 'beverages', 'meat_eggs', 'fresh_produce'],
    biryani: ['meat_eggs', 'dairy', 'pantry_spices_sauces', 'beverages'],
    cleaning: ['home_cleaning', 'personal_hygiene'],
    puja: ['puja_essentials', 'fresh_produce', 'dairy'],
    sick: ['health_wellness', 'beverages', 'fresh_produce'],
    movie: ['snacks', 'beverages', 'sweets_chocolates'],
    italian: ['dairy', 'pantry_spices_sauces', 'beverages'],
    gym: ['health_wellness', 'meat_eggs', 'fresh_produce'],
    latenight: ['snacks', 'beverages', 'sweets_chocolates'],
    baby: ['baby_care', 'personal_hygiene']
  };

  if (hasStrongContext && detectedContexts.length > 0) {
    const primaryId = detectedContexts[0].id;
    const relevantCats = contextCategoryMap[primaryId] || [];
    relevantCats.forEach(c => targetCategories.add(c));
  }

  if (!hasStrongContext) {
    if (signals.timeBucket === 'morning') {
      targetCategories.add('dairy');
      targetCategories.add('bakery_biscuits');
      targetCategories.add('meat_eggs');
    } else if (signals.timeBucket === 'late_night') {
      targetCategories.add('snacks');
      targetCategories.add('beverages');
      targetCategories.add('sweets_chocolates');
    } else {
      targetCategories.add('fresh_produce');
      targetCategories.add('snacks');
    }
  }

  cartCategories.forEach((cat) => {
    const related = associations[cat] || [];
    related.forEach((r) => targetCategories.add(r));
    targetCategories.add(cat);
  });

  const candidates = allProducts
    .filter((p) => !cartIds.has(p.id) && p.categoryId && targetCategories.has(p.categoryId));

  return candidates.sort(() => 0.5 - Math.random()).slice(0, 80);
};

// --- CACHE LAYER ---
// Store up to 50 recent queries to prevent redundant LLM calls when users toggle items
const responseCache = new Map<string, GeminiResponse>();

// Helper to generate a stable, order-independent cart signature for caching
const generateCartSignature = (cart: CartItem[]): string => {
  return cart
    .map(c => `${c.id}:${c.quantity}`)
    .sort()
    .join('|');
};

// --- MAIN SERVICE FUNCTION ---
export const fetchGeminiSuggestions = async (
  cart: CartItem[]
): Promise<GeminiResponse | null> => {
  if (cart.length === 0) return null;

  // 0. Cache Check
  const cartSig = generateCartSignature(cart);
  if (responseCache.has(cartSig)) {
    console.log("Gemini Cache Hit for:", cartSig);
    return responseCache.get(cartSig) || null;
  }

  try {
    // 1. Compute Signals & Contexts (Client-Side)
    const signals = getRichSignals();
    const { contexts: detectedContexts, hasStrongContext } = detectTopContexts(cart, CONTEXT_DEFINITIONS);

    // 2. Prepare Candidates (Client-Side)
    const candidates = getCandidateProducts(cart, PRODUCT_DB, detectedContexts, signals, hasStrongContext);
    const candidateList = candidates.map(p => `ID:${p.id} | Name:${p.name} | Cat:${p.categoryId} | Price:${p.price}`).join("\n");

    // 3. Format Context String
    const contextStr = detectedContexts.length > 0
      ? detectedContexts.map(c => `${c.title} (Score:${c.weightedScore}, Conf:${c.confidence})`).join(", ")
      : "No specific context detected (Mixed Bag)";

    const cartSummary = cart.map(item => `"${item.quantity}x ${item.name}"`).join(", ");

    // 4. Call Vercel API Endpoint instead of Client-Side Gemini
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signals,
        contextStr,
        cartSummary,
        candidateList
      })
    });

    if (!response.ok) {
      console.warn("API request failed with status:", response.status);
      return null;
    }

    const result = await response.json();
    const responseText = result.text;

    if (!responseText) return null;

    // Robust JSON parsing
    const firstIndex = responseText.indexOf('{');
    const lastIndex = responseText.lastIndexOf('}');

    if (firstIndex !== -1 && lastIndex !== -1) {
      const parsedResponse = JSON.parse(responseText.substring(firstIndex, lastIndex + 1)) as GeminiResponse;

      // Store in cache
      if (responseCache.size > 50) {
        const firstKey = responseCache.keys().next().value;
        if (firstKey) responseCache.delete(firstKey);
      }
      responseCache.set(cartSig, parsedResponse);

      return parsedResponse;
    }

    return null;

  } catch (error) {
    console.error("Gemini Service Error:", error);
    return null;
  }
};
