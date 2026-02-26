import { CartItem } from './types';

export interface ContextDefinition {
  id: string;
  title: string;
  triggers: string[];
  suggestions: any[]; // Placeholder for future suggestion items
}

// 1. The Data Structure (Context Definitions)
export const CONTEXT_DEFINITIONS: ContextDefinition[] = [
  { id: 'party', title: 'Party Mode', triggers: ['coca', 'coke', 'pepsi', 'thums', 'chips', 'lays', 'pringles', 'bingo', 'kurkure', 'cornitos', 'nacho', 'bhujia', 'namkeen', 'ferrero', 'celebrations', 'chocolate', 'red bull', 'bira', 'beer', 'ginger ale', 'sparkling'], suggestions: [] },
  { id: 'breakfast', title: 'Breakfast Prep', triggers: ['bread', 'egg', 'milk', 'butter', 'jam', 'coffee', 'nescafe', 'tea', 'tata tea', 'corn flakes', 'kellogg', 'oats', 'quaker', 'muesli', 'idli', 'dosa', 'batter', 'parle-g', 'rusk'], suggestions: [] },
  { id: 'biryani', title: 'Biryani Night', triggers: ['basmati', 'rice', 'daawat', 'curd', 'yogurt', 'biryani', 'masala', 'everest', 'chicken', 'licious', 'paneer', 'ginger garlic', 'onion', 'mint', 'coriander', 'saffron', 'cardamom', 'cinnamon'], suggestions: [] },
  { id: 'sick', title: 'Sick Day', triggers: ['vicks', 'dettol', 'paracetamol', 'soup', 'knorr', 'electoral', 'ors', 'tulsi', 'honey', 'dabur', 'eucalyptus', 'tissue', 'juice', 'activ'], suggestions: [] },
  { id: 'movie', title: 'Movie Marathon', triggers: ['popcorn', 'act ii', 'pringles', 'chips', 'snickers', 'cadbury', 'chocolate', 'm&m', 'kinder', 'ice cream', 'cornetto', 'coke', 'pepsi', 'thums'], suggestions: [] },
  { id: 'chai', title: 'Chai Time', triggers: ['tea', 'tata', 'taj mahal', 'society', 'wagh bakri', 'chai', 'ginger', 'green tea', 'girnar', 'parle', 'britannia', 'biscuit', 'cookie', 'good day', 'hide seek', 'marie', 'digestive', 'rusk'], suggestions: [] },
  { id: 'pancake', title: 'Pancake Sunday', triggers: ['pancake', 'betty crocker', 'pillsbury', 'maple', 'syrup', 'wingreens', 'nutella', 'hershey', 'strawberry', 'blueberry', 'cream', 'honey'], suggestions: [] },
  { id: 'italian', title: 'Italian Dinner', triggers: ['pasta', 'barilla', 'del monte', 'spaghetti', 'olive oil', 'borges', 'oregano', 'basil', 'cheese', 'mozzarella', 'pizza', 'sauce', 'oetker', 'chili flakes'], suggestions: [] },
  { id: 'baking', title: 'Baking Spree', triggers: ['maida', 'flour', 'aashirvaad', 'sugar', 'baking powder', 'weikfield', 'cocoa', 'blue bird', 'vanilla', 'essence', 'condensed milk', 'eagle', 'brownie', 'choco chips'], suggestions: [] },
  { id: 'salad', title: 'Salad Cleanse', triggers: ['lettuce', 'cucumber', 'tomato', 'bell pepper', 'spinach', 'olive oil', 'vinegar', 'mayo', 'yogurt', 'epigamia', 'honey', 'quinoa'], suggestions: [] },
  { id: 'gym', title: 'Gym Rat', triggers: ['protein', 'whey', 'muscleblaze', 'protinex', 'oats', 'peanut butter', 'yoga bar', 'pintola', 'banana', 'kiwi', 'almond', 'granola', 'bar', 'fast&up'], suggestions: [] },
  { id: 'lunch', title: 'Office Lunch', triggers: ['sandwich', 'bread', 'cheese', 'juice', 'yogurt', 'buttermilk', 'paratha', 'dal', 'tata sampann', 'biscuit', 'namkeen'], suggestions: [] },
  { id: 'latenight', title: 'Late Night', triggers: ['maggi', 'noodles', 'yippee', 'ching', 'chips', 'lays', 'chocolate', 'cadbury', '5 star', 'coke', 'ice cream', 'jim jam'], suggestions: [] },
  { id: 'cleaning', title: 'Cleaning Day', triggers: ['lizol', 'harpic', 'colin', 'vim', 'dishwash', 'scrub', 'scotch', 'dettol', 'domex', 'cleaner', 'odonil', 'hit', 'surf', 'ariel', 'detergent', 'comfort'], suggestions: [] },
  { id: 'pet', title: 'Pet Pampering', triggers: ['pedigree', 'whiskas', 'dog', 'cat', 'food', 'drools', 'himalaya', 'shampoo', 'pet', 'treat', 'toy', 'kong'], suggestions: [] },
  { id: 'puja', title: 'Puja Essentials', triggers: ['agarbatti', 'incense', 'camphor', 'kapur', 'gangajal', 'lamp', 'wick', 'moli', 'sandalwood', 'matchbox', 'marigold', 'ghee'], suggestions: [] },
  { id: 'hair', title: 'Hair Care', triggers: ['shampoo', 'loreal', 'tresemme', 'conditioner', 'hair oil', 'parachute', 'indulekha', 'serum', 'livon', 'head shoulders', 'dove', 'mamaearth', 'pantene', 'hair gel', 'wax'], suggestions: [] },
  { id: 'laundry', title: 'Laundry Day', triggers: ['surf', 'ariel', 'detergent', 'tide', 'rin', 'comfort', 'fabric', 'vanish', 'stain', 'ezee', 'ujala', 'clips', 'sanitizer'], suggestions: [] },
  { id: 'sandwich', title: 'Sandwich Station', triggers: ['bread', 'cheese', 'salami', 'zorabian', 'mayo', 'veeba', 'ketchup', 'kissan', 'lettuce', 'olive', 'jalapeno', 'cucumber'], suggestions: [] },
  { id: 'bbq', title: 'BBQ/Grill', triggers: ['chicken', 'salami', 'tikka', 'sausage', 'paneer', 'barbeque', 'tandoori', 'mushroom', 'pepper', 'paprika', 'onion', 'capsicum'], suggestions: [] },
  { id: 'taco', title: 'Taco Tuesday', triggers: ['taco', 'tortilla', 'salsa', 'jalapeno', 'beans', 'cheese', 'mexican', 'avocado', 'sour cream', 'coriander', 'lemon'], suggestions: [] },
  { id: 'curry', title: 'Indian Curry', triggers: ['masala', 'turmeric', 'chilli', 'mdh', 'everest', 'garam', 'jeera', 'cumin', 'dal', 'toor', 'moong', 'atta', 'rice', 'oil', 'tomato', 'garlic', 'ginger', 'pickle'], suggestions: [] },
  { id: 'smoothie', title: 'Smoothie Station', triggers: ['yogurt', 'epigamia', 'oats', 'chia', 'peanut butter', 'honey', 'blueberry', 'strawberry', 'banana', 'almond milk', 'coconut water'], suggestions: [] },
  { id: 'baby', title: 'Baby Care', triggers: ['pampers', 'huggies', 'diaper', 'wipes', 'johnson', 'cerelac', 'baby', 'lotion', 'powder', 'oil', 'himalaya', 'mamaearth'], suggestions: [] },
  { id: 'hygiene', title: 'Hygiene Check', triggers: ['dettol', 'savlon', 'sanitizer', 'soap', 'lifebuoy', 'pears', 'toothpaste', 'colgate', 'mouthwash', 'listerine', 'sanitary', 'whisper', 'stayfree', 'razor', 'gillette', 'tissue'], suggestions: [] },
];

// 2. The Logic Function getBestContext(cart)
export const getBestContext = (cart: CartItem[]): ContextDefinition | null => {
  if (!cart || cart.length === 0) return null;

  let bestContext: ContextDefinition | null = null;
  let maxScore = 0;

  for (const context of CONTEXT_DEFINITIONS) {
    let uniqueTriggerMatches = 0;
    
    // 1. Calculate unique trigger matches (How many KEYWORDS match?)
    for (const trigger of context.triggers) {
      const triggerLower = trigger.toLowerCase();
      // Check if any item in cart matches this specific trigger
      if (cart.some(item => item.name.toLowerCase().includes(triggerLower))) {
        uniqueTriggerMatches++;
      }
    }

    // 2. Calculate total quantity of matching items (How HEAVY is the intent?)
    let contextTotalQuantity = 0;
    cart.forEach(item => {
        const name = item.name.toLowerCase();
        // If this item belongs to the context (matches ANY trigger)
        if (context.triggers.some(trigger => name.includes(trigger.toLowerCase()))) {
            contextTotalQuantity += item.quantity;
        }
    });

    // 3. New Weighted Formula
    // Score = (Unique Keywords * 2) + (Total Quantity of Items)
    // Example: 10 Cokes (1 trigger match, 10 quantity) -> (1*2) + 10 = 12
    // Example: 1 Milk + 1 Bread (2 trigger matches, 2 quantity) -> (2*2) + 2 = 6
    // This allows bulk purchases to dominate context vs variety.
    const score = (uniqueTriggerMatches * 2) + contextTotalQuantity;

    if (score > 0 && score > maxScore) {
      maxScore = score;
      bestContext = context;
    }
  }

  return bestContext;
};
