import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { CartItem, Product } from '../types';
import { getAIState } from '../recommendationEngine';
import { fetchGeminiSuggestions, SuggestedItem } from '../services/geminiService';
import { PRODUCT_DB } from '../constants';

// Extended Product Type for UI
export interface AIProduct extends Product {
  reasonTag?: string; // The "Why?" from Gemini
}

interface GlobalAIState {
  active: boolean;
  source: 'rules' | 'gemini';
  context: string;
  message: string;
  suggestions: AIProduct[];
}

interface SuggestionSession {
  isActive: boolean;
  suggestionIds: string[];
  cartSnapshotAtGeneration: CartItem[];
}

interface AIContextType {
  aiData: GlobalAIState;
  isAnalyzing: boolean;
  analysisStep: number; // 0, 1, 2 for text cycling
  refreshAI: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ cart: CartItem[]; children: React.ReactNode }> = ({ cart, children }) => {
  // --- STATE ---
  const [aiData, setAiData] = useState<GlobalAIState>({
    active: false,
    source: 'rules',
    context: '',
    message: '',
    suggestions: []
  });

  const [suggestionSession, setSuggestionSession] = useState<SuggestionSession>({
    isActive: false,
    suggestionIds: [],
    cartSnapshotAtGeneration: []
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // --- REFS ---
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevCartRef = useRef<CartItem[]>([]);

  // --- UTILITY: Thinking Animation ---
  useEffect(() => {
    if (isAnalyzing) {
      setAnalysisStep(0);
      stepInterval.current = setInterval(() => {
        setAnalysisStep(prev => (prev + 1) % 3);
      }, 1200);
    } else {
      if (stepInterval.current) clearInterval(stepInterval.current);
      setAnalysisStep(0);
    }
    return () => { if (stepInterval.current) clearInterval(stepInterval.current); };
  }, [isAnalyzing]);

  // --- CORE LOGIC: Trigger AI ---
  const triggerAIAnalysis = async (currentCart: CartItem[]) => {
    // Force analyzing state explicitly when function starts
    setIsAnalyzing(true);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    try {
      const geminiResult = await fetchGeminiSuggestions(currentCart);

      if (geminiResult && geminiResult.suggestions?.length > 0) {
        // Hydrate product data & Filter out items already in cart
        const hydratedProducts = geminiResult.suggestions
          .map((item: SuggestedItem): AIProduct | null => {
            const product = PRODUCT_DB.find(p => p.id === item.id);
            if (!product) return null;
            return { ...product, reasonTag: item.reason };
          })
          .filter((p): p is AIProduct => !!p && !currentCart.some(c => c.id === p.id));

        if (hydratedProducts.length > 0) {
          // Update Display
          setAiData({
            active: true,
            source: 'gemini',
            context: geminiResult.context || "Forgot something?",
            message: geminiResult.message,
            suggestions: hydratedProducts
          });

          // Start New Session
          setSuggestionSession({
            isActive: true,
            suggestionIds: hydratedProducts.map(p => p.id),
            cartSnapshotAtGeneration: currentCart
          });
        }
      } else {
        // Fallback to rules if geminiResult is null/empty
        const ruleState = getAIState(currentCart);
        setAiData({
          active: true,
          source: 'rules',
          context: "Smart Suggestions",
          message: ruleState.message || "Here are some recommendations",
          suggestions: ruleState.suggestions
        });
      }
    } catch (error) {
      // Fallback to Rules on Error
      const ruleState = getAIState(currentCart);
      setAiData({
        active: true,
        source: 'rules',
        context: "Smart Suggestions",
        message: ruleState.message || "Here are some recommendations",
        suggestions: ruleState.suggestions
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- CORE LOGIC: Manual Refresh ---
  const refreshAI = () => {
    if (cart.length === 0) return;

    // 1. Cancel any pending auto-analysis
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // 2. Set visual loading state
    setIsAnalyzing(true);

    // 3. Trigger immediately
    triggerAIAnalysis(cart);
  };

  // --- CORE LOGIC: Handle Suggestion Click ---
  const handleSuggestionItemAdded = (currentCart: CartItem[]) => {
    // 1. Visually remove added items from the suggestion list
    const remainingSuggestions = aiData.suggestions.filter(
      sug => !currentCart.some(cartItem => cartItem.id === sug.id)
    );

    // 2. Update UI instantly
    setAiData(prev => ({
      ...prev,
      suggestions: remainingSuggestions
    }));

    // 3. Update Session State
    setSuggestionSession(prev => ({
      ...prev,
      cartSnapshotAtGeneration: currentCart,
      suggestionIds: remainingSuggestions.map(s => s.id)
    }));

    // 4. Decide Next Step
    if (remainingSuggestions.length === 0) {
      // List exhausted -> Trigger AI immediately to get more
      triggerAIAnalysis(currentCart);
    } else {
      // List still has items -> Keep quiet unless user interacts again
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        triggerAIAnalysis(currentCart);
      }, 10000); // 10s quiet period after taking a suggestion
    }
  };

  // --- MAIN EFFECT: The Brain ---
  useEffect(() => {
    const prevCart = prevCartRef.current;

    // 1. Handle Empty Cart (Reset All)
    if (cart.length === 0) {
      setAiData({ active: false, source: 'rules', context: '', message: '', suggestions: [] });
      setSuggestionSession({ isActive: false, suggestionIds: [], cartSnapshotAtGeneration: [] });
      setIsAnalyzing(false);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      prevCartRef.current = cart;
      return;
    }

    // 2. Check for "Optimistic Add" (User clicked a suggestion)
    // Only applies if items were ADDED and they match existing suggestions
    const newItems = cart.filter(item => !prevCart.some(prev => prev.id === item.id));

    const addedFromSuggestions = suggestionSession.isActive && newItems.length > 0 && newItems.every(newItem =>
      suggestionSession.suggestionIds.includes(newItem.id)
    );

    if (addedFromSuggestions) {
      // CASE A: User followed advice -> Visual update only, no big spinner
      handleSuggestionItemAdded(cart);
    } else {
      // CASE B: Any other change (Quantity update, Item Removal, Browse Add)
      // 1. Immediate Feedback
      setIsAnalyzing(true);

      // 2. Reset Timer
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      // 3. Wait 3 seconds before actually asking AI (Debounce)
      debounceTimer.current = setTimeout(() => {
        triggerAIAnalysis(cart);
      }, 3000);
    }

    // Update Ref
    prevCartRef.current = cart;
  }, [cart]);

  return (
    <AIContext.Provider value={{ aiData, isAnalyzing, analysisStep, refreshAI }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
