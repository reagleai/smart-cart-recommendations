import { CartItem, Product } from './types';
import { PRODUCT_DB } from './constants';
import { CONTEXT_DEFINITIONS } from './contextEngine';

// Interface for our AI Brain's internal knowledge
interface ContextMetadata {
  copy: string[];
  keywords: string[]; // Specific search terms for product retrieval
}

// 1. The "Witty Copy" & Keyword Database
const AI_CONTEXT_DATA: Record<string, ContextMetadata> = {
  party: {
    copy: [
      "Party starter pack! Don't forget the ice and mixers.",
      "Chill vibes loading... Add some crunchy snacks to the mix?",
      "This combo screams fun night! Maybe grab some extra tissues?",
      "Hosting duties calling? You might need these last-minute saves."
    ],
    keywords: ['ice', 'soda', 'chip', 'dip', 'nacho', 'thums', 'sprite', 'coke', 'cup', 'tissue']
  },
  breakfast: {
    copy: [
      "Classic desi breakfast! How about some fresh juice to complete it?",
      "Morning sorted. Need some biscuits for that chai?",
      "Breakfast of champions loading... Don't let the toast burn!",
      "Rise and shine (and dine). Don't forget the butter!"
    ],
    keywords: ['bread', 'butter', 'jam', 'egg', 'coffee', 'milk', 'tea', 'juice', 'corn', 'flake']
  },
  biryani: {
    copy: [
      "It's not a Biryani feast without extra Raita and Coke!",
      "Spice levels critical! Add some sweets to cool down.",
      "The royal treatment requires these add-ons. Salan ready?",
      "Biryani night? Mandatory Thums Up check."
    ],
    keywords: ['curd', 'raita', 'thums', 'coke', 'onion', 'lemon', 'spice', 'rice']
  },
  sick: {
    copy: [
      "Get well soon! We've got soups and juices to help you recover.",
      "Rest mode activated. Grab some tissues and balm for comfort.",
      "Healing essentials. Don't miss out on hydration.",
      "Sending virtual hugs (and these essential supplies)..."
    ],
    keywords: ['soup', 'juice', 'water', 'tea', 'honey', 'fruit', 'tissue', 'balm', 'rub', 'vicks']
  },
  movie: {
    copy: [
      "Movie marathon pending? Don't hit pause on the snacks.",
      "The cinema experience, now at home. Popcorn ready?",
      "Crunch time! Literally. Don't forget the cold drinks.",
      "Binge-watching essentials detected. Add these for the finale."
    ],
    keywords: ['popcorn', 'coke', 'pepsi', 'chip', 'nacho', 'chocolate', 'candy', 'ice cream']
  },
  chai: {
    copy: [
      "Chai break approved. Dipping mechanics require these biscuits.",
      "The perfect evening requires a sip and a bite. Rusk anyone?",
      "Brewing happiness? Add these to your tea time.",
      "Chai pe charcha needs some snacks on the side."
    ],
    keywords: ['biscuit', 'rusk', 'cookie', 'milk', 'sugar', 'ginger', 'cardamom']
  },
  pancake: {
    copy: [
      "Flipping fantastic! Do you have the syrup and honey?",
      "Sunday morning ritual identified. Make it a stack to remember.",
      "Sweet tooth alert! Don't forget the whipped cream.",
      "Breakfast or Dessert? Why not both with these add-ons."
    ],
    keywords: ['honey', 'syrup', 'fruit', 'chocolate', 'butter', 'cream', 'berry']
  },
  italian: {
    copy: [
      "Mamma Mia! You forgot the cheese and oregano.",
      "Pasta night isn't complete without garlic bread and coke.",
      "Bon Appétit! Add these for the full authentic taste.",
      "Cheesy goodness loading. Don't forget the seasoning."
    ],
    keywords: ['cheese', 'sauce', 'oregano', 'flake', 'oil', 'olive', 'coke', 'garlic']
  },
  baking: {
    copy: [
      "Whisking up a storm? Check your pantry for vanilla essence.",
      "Baking therapy in progress. Sweet treats require precise ingredients.",
      "The secret ingredient might be here. Choco chips maybe?",
      "Chef mode activated! Grab these for pro results."
    ],
    keywords: ['sugar', 'butter', 'chocolate', 'cocoa', 'vanilla', 'milk', 'cream']
  },
  salad: {
    copy: [
      "Clean eating streak? Keep it going with these toppers.",
      "The salad bowl looks lonely. Add some crunch!",
      "Wellness check! Don't forget the dressing and seasoning.",
      "Healthy living goals! Add these to the mix."
    ],
    keywords: ['oil', 'lemon', 'pepper', 'salt', 'yogurt', 'cheese', 'paneer']
  },
  gym: {
    copy: [
      "Gains incoming. Fuel up with protein and oats.",
      "Post-workout recovery starts here. Hydration check?",
      "Fitness beast! Don't skip the healthy snacks.",
      "Protein mode: ON. Stack up on these essentials."
    ],
    keywords: ['egg', 'chicken', 'banana', 'oats', 'peanut', 'water', 'milk']
  },
  lunch: {
    copy: [
      "Office lunch upgrade available. Don't settle for boring food.",
      "Mid-day hunger pangs? Solved with these quick bites.",
      "Power through the afternoon with some yogurt or juice.",
      "Quick, easy, and delicious. Lunch sorted."
    ],
    keywords: ['juice', 'yogurt', 'fruit', 'snack', 'chocolate', 'drink']
  },
  latenight: {
    copy: [
      "Midnight hunger? Try adding some chocolates or chips.",
      "The 2 AM survival guide: Noodles and caffeine.",
      "Late night munchies detected! How about a cold drink?",
      "Don't let the hunger win. Stock up for the night."
    ],
    keywords: ['maggie', 'noodle', 'coffee', 'red bull', 'chip', 'chocolate', 'coke']
  },
  cleaning: {
    copy: [
      "Sparkle and shine time. Don't forget the gloves.",
      "Deep cleaning made easier. Fight the grime with these.",
      "Home refresh in progress. Add some fragrance?",
      "Cleaning spree? You might need these extra supplies."
    ],
    keywords: ['cloth', 'sponge', 'bag', 'bucket', 'glove', 'brush']
  },
  pet: {
    copy: [
      "Treats for the good boy/girl. Tail wags guaranteed.",
      "Purr-fect additions to your cart. Don't forget the toys.",
      "Pet pampering session? Grab these essentials.",
      "For your furry friend. They deserve a treat too!"
    ],
    keywords: ['treat', 'toy', 'biscuit', 'milk', 'chicken']
  },
  puja: {
    copy: [
      "For a divine atmosphere. Agarbatti and flowers check?",
      "Blessings and essentials. Complete your prayer thali.",
      "Festive vibes loading... Don't forget the camphor.",
      "Puja preparation made easy. Add these to your list."
    ],
    keywords: ['oil', 'match', 'flower', 'fruit', 'sweet', 'milk', 'ghee']
  },
  hair: {
    copy: [
      "Good hair day pending... Don't forget the serum.",
      "Self-care Sunday essentials. Lather, rinse, repeat.",
      "For that salon finish. Conditioner check?",
      "Hair care routine sorted. Add these for extra shine."
    ],
    keywords: ['comb', 'oil', 'shampoo', 'conditioner', 'color', 'gel']
  },
  laundry: {
    copy: [
      "Fresh clothes, fresh vibe. Stain remover needed?",
      "Laundry day made bearable. Don't forget fabric conditioner!",
      "Stain removal squad. Keep your whites white.",
      "Washing machine ready? Add these for the best wash."
    ],
    keywords: ['brush', 'clip', 'bucket', 'liquid', 'powder']
  },
  sandwich: {
    copy: [
      "The ultimate sandwich stack. Cheese and mayo check?",
      "Layers of flavor incoming. Don't forget the ketchup.",
      "Bread is just the beginning. Add veggies for crunch.",
      "Snack time hero. Make it a club sandwich?"
    ],
    keywords: ['sauce', 'mayo', 'cheese', 'butter', 'vegetable', 'chicken']
  },
  bbq: {
    copy: [
      "Grill master essentials. Marinade and spices check?",
      "Fire up the flavor. Don't forget the sides.",
      "Weekend BBQ sorted. Add some cold drinks.",
      "Smoky vibes loading. Sauce check?"
    ],
    keywords: ['sauce', 'butter', 'oil', 'spice', 'chicken', 'paneer', 'coke']
  },
  taco: {
    copy: [
      "It's Taco time! Crunch, spice, and salsa check?",
      "Fiesta in a cart. Don't spill the beans (or cheese).",
      "Mexican night sorted. Add some nachos on the side?",
      "Taco Tuesday essentials. Sour cream missing?"
    ],
    keywords: ['sauce', 'cheese', 'vegetable', 'chicken', 'coke', 'pepsi']
  },
  curry: {
    copy: [
      "Simmering perfection needs this. Roti or Rice?",
      "Desi flavors unlocked. Don't forget the pickle.",
      "Spicing things up? Add some curd to cool down.",
      "Curry night essentials. Coriander for garnish?"
    ],
    keywords: ['rice', 'atta', 'oil', 'ghee', 'coriander', 'chilli']
  },
  smoothie: {
    copy: [
      "Blend it like a pro. Sip your vitamins.",
      "The refreshing hit you need. Honey and nuts check?",
      "Smooth operator essentials. Add some chia seeds?",
      "Breakfast in a glass. Don't forget the milk base."
    ],
    keywords: ['milk', 'honey', 'fruit', 'oats', 'nut', 'seed']
  },
  baby: {
    copy: [
      "For the little one. Wipes and lotion check?",
      "Baby care basics. Gentle care for delicate skin.",
      "Parenting wins start here. Stock up on diapers.",
      "Softness guaranteed. Don't forget the baby oil."
    ],
    keywords: ['wipes', 'soap', 'lotion', 'powder', 'oil', 'cotton']
  },
  hygiene: {
    copy: [
      "Stay fresh, stay safe. Handwash check?",
      "Daily essentials check. Toothpaste running low?",
      "Hygiene first! Don't forget the sanitizer.",
      "Personal care top-ups. Freshness loading..."
    ],
    keywords: ['tissue', 'soap', 'brush', 'paste', 'wash']
  }
};

// 2. Logic: Analyze Cart Context
const analyzeCartContext = (cart: CartItem[]): { id: string; confidence: number } | null => {
  if (cart.length === 0) return null;

  let bestContextId = '';
  let maxScore = 0;

  // Normalize cart names for matching
  const cartNames = cart.map(item => item.name.toLowerCase());

  // Iterate through definitions from contextEngine (source of truth for triggers)
  for (const def of CONTEXT_DEFINITIONS) {
    if (!AI_CONTEXT_DATA[def.id]) continue; // Skip if we don't have copy for this context

    let matchCount = 0;
    let matchValue = 0;

    for (const trigger of def.triggers) {
      const triggerLower = trigger.toLowerCase();
      // Find all items in cart matching this trigger (partial match allowed)
      const matchingItems = cart.filter(item => item.name.toLowerCase().includes(triggerLower));
      
      if (matchingItems.length > 0) {
        matchCount += 1; // Count number of triggers satisfied.
        
        // Sum up the value of matching items
        matchValue += matchingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    }

    // SCORING FORMULA: (Matches * 10) + (Value * 0.1)
    const score = (matchCount * 10) + (matchValue * 0.1);

    if (score > maxScore) {
      maxScore = score;
      bestContextId = def.id;
    }
  }

  // Threshold: Need at least a score of 10
  if (maxScore < 10) return null;

  return { id: bestContextId, confidence: maxScore };
};

// 3. Logic: Generate Response (Deterministic)
const generateAIResponse = (contextId: string, cart: CartItem[]): string => {
  const data = AI_CONTEXT_DATA[contextId];
  if (!data) return "You might also like these...";

  // Create a stable string from sorted item IDs to hash
  // This ensures the message doesn't change when quantity changes, only when items are added/removed
  const cartSignature = cart
    .map(item => item.id)
    .sort()
    .join('|');

  // Simple hash function for the signature
  let hash = 0;
  for (let i = 0; i < cartSignature.length; i++) {
    hash = ((hash << 5) - hash) + cartSignature.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % data.copy.length;
  const basePhrase = data.copy[index];

  // Dynamic Injection (Deterministic based on parity)
  // Only inject if index is even, to provide stability
  if (cart.length > 0 && index % 2 === 0) {
    const heroItem = [...cart].sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))[0];
    
    if (heroItem && heroItem.name.length < 25) {
        // Simple heuristic to ensure the sentence flows
        return `That ${heroItem.name.split(' ').slice(0, 2).join(' ')} looks lonely. ${basePhrase}`;
    }
  }

  return basePhrase;
};

// 4. Logic: Get Relevant Products (Smart Ranking)
const getRelevantProducts = (contextId: string, cart: CartItem[]): Product[] => {
  // Get Context Triggers from the source of truth
  const contextDef = CONTEXT_DEFINITIONS.find(c => c.id === contextId);
  const contextTriggers = contextDef ? contextDef.triggers : [];

  // Calculate Average Cart Price (Value of unique items / count of unique items)
  // Using sum of unit prices of items in cart to get an "average item value"
  const totalUnitPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const avgCartPrice = cart.length > 0 ? totalUnitPrice / cart.length : 100;

  const cartCategories = new Set(cart.map(item => item.categoryId));
  const cartIds = new Set(cart.map(item => item.id));

  // Score each product in the DB
  const scoredProducts = PRODUCT_DB
    .filter(product => !cartIds.has(product.id)) // Exclude items already in cart
    .map(product => {
      let score = 0;
      
      // 1. Category Match (+100 points)
      // Boost items from the same aisles the user is already shopping in
      if (product.categoryId && cartCategories.has(product.categoryId)) {
        score += 100;
      }
      
      // 2. Context Match (+50 points)
      // Check if product name matches any of the active context triggers
      const productNameLower = product.name.toLowerCase();
      if (contextTriggers.some(trigger => productNameLower.includes(trigger.toLowerCase()))) {
        score += 50;
      }
      
      // 3. Price Affinity (+30 points) & Proximity (+10 points)
      const priceRatio = product.price / avgCartPrice;
      if (priceRatio >= 0.5 && priceRatio <= 2.0) {
        score += 30;
      } else if (priceRatio >= 0.2 && priceRatio <= 5.0) {
        score += 10;
      }
      
      return { product, score };
    });

  // Sort by score descending, then by price descending (as tie-breaker)
  const sortedProducts = scoredProducts
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.product.price - a.product.price;
    })
    .map(item => item.product);

  return sortedProducts.slice(0, 6);
};

// --- MAIN EXPORT ---

export interface AIState {
  active: boolean;
  contextId: string | null;
  message: string;
  suggestions: Product[];
}

export const getAIState = (cart: CartItem[]): AIState => {
  // 1. Analyze Context
  const analysis = analyzeCartContext(cart);

  if (!analysis) {
    return {
      active: false,
      contextId: null,
      message: '',
      suggestions: []
    };
  }

  // 2. Get Suggestions
  const suggestions = getRelevantProducts(analysis.id, cart);

  // If no suggestions found despite context match, disable AI
  if (suggestions.length === 0) {
    return {
        active: false,
        contextId: null,
        message: '',
        suggestions: []
    };
  }

  // 3. Generate Copy
  const message = generateAIResponse(analysis.id, cart);

  return {
    active: true,
    contextId: analysis.id,
    message,
    suggestions
  };
};