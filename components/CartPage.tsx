import React, { useState, useRef, useEffect } from 'react';
import { Home, ChevronDown, Zap, Plus, Minus, Check, X, Star, Timer, ShoppingBag, Info, ChevronsRight, Loader2, AlertTriangle, Sparkles, ArrowLeft, RotateCw } from 'lucide-react';
import { CartItem, ScreenType } from '../types';
import { useAI } from '../context/AIContext';

interface CartPageProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  addToCart: (item: any) => void;
  setScreen: (screen: ScreenType) => void;
  onPlaceOrder: (amount: number) => void;
}

// Utility for stable ratings
const getStableRating = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const rating = 3.8 + (Math.abs(hash) % 13) / 10;
  return Math.min(5, rating).toFixed(1);
};

const CartPage: React.FC<CartPageProps> = ({ cart, updateQuantity, addToCart, setScreen, onPlaceOrder }) => {
  const { aiData, isAnalyzing, analysisStep, refreshAI } = useAI();
  const [addingIds, setAddingIds] = useState<Record<string, boolean>>({});
  
  // Dynamic Thinking Text
  const thinkingStates = [
      "Analyzing cart...",
      "Checking for missed essentials...",
      "Identifying flavor pairings..."
  ];

  // --- Calculations ---
  const itemTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalMRP = cart.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0);
  const smallCartFee = itemTotal < 100 ? 30 : 0;
  const deliveryFee = itemTotal >= 250 ? 0 : 30;
  const handlingFee = 5;
  const toPay = itemTotal + smallCartFee + deliveryFee + handlingFee;
  const originalPayable = totalMRP + smallCartFee + 30 + handlingFee;
  const totalSavings = originalPayable - toPay;
  const hasSavings = totalSavings > 0;

  const renderFee = (amount: number) => {
      if (amount === 0) return <span className="text-green-600 font-bold">FREE</span>;
      return <span>₹{amount}</span>;
  };

  const handleSmartAdd = (item: any) => {
    setAddingIds(prev => ({ ...prev, [item.id]: true }));
    addToCart({ ...item, quantity: 1 });
    setTimeout(() => {
        setAddingIds(prev => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  // --- Swipe To Pay Logic ---
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const handleWidth = 56;
  const padding = 4;

  const handleDragStart = () => { if (!isCompleted) setIsDragging(true); };
  
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !trackRef.current || isCompleted) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const trackRect = trackRef.current.getBoundingClientRect();
    let newX = clientX - trackRect.left - (handleWidth / 2) - padding;
    const maxDragDistance = trackRect.width - handleWidth - (padding * 2);
    newX = Math.max(0, Math.min(newX, maxDragDistance));
    setDragX(newX);
  };

  const handleDragEnd = () => {
    if (!isDragging || !trackRef.current || isCompleted) return;
    const trackWidth = trackRef.current.clientWidth;
    const maxDragDistance = trackWidth - handleWidth - (padding * 2);
    if (dragX >= maxDragDistance * 0.85) {
      setDragX(maxDragDistance);
      setIsCompleted(true);
      setIsDragging(false);
      setTimeout(() => onPlaceOrder(toPay), 600);
    } else {
      setIsDragging(false);
      setDragX(0);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragX]);

  // --- Empty Cart ---
  if (cart.length === 0) {
    return (
      <div className="flex flex-col h-full bg-white animate-in fade-in zoom-in duration-300">
         {/* Header for Empty Cart */}
         <div className="bg-white p-4 flex items-center gap-3 shadow-sm border-b border-gray-100 sticky top-0 z-10">
            <button onClick={() => setScreen('home')} className="p-1 -ml-1">
                <ArrowLeft size={24} className="text-gray-800" />
            </button>
            <h1 className="text-lg font-black text-gray-800">Cart</h1>
         </div>

         {/* Content */}
         <div className="flex-1 flex flex-col items-center justify-center p-6">
             <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                 <ShoppingBag size={48} className="text-[#2563EB]" />
             </div>
             <h2 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Your Cart is Empty</h2>
             <p className="text-gray-500 text-center text-sm mb-8 px-8 leading-relaxed">Let's stock up!</p>
             <button onClick={() => setScreen('category')} className="bg-[#2563EB] text-white font-bold py-4 px-12 rounded-xl shadow-lg active:scale-95 transition-transform uppercase tracking-wide text-sm">
                Start Shopping
             </button>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#F4F5F7] relative">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full bg-white z-50 shadow-sm">
        <div className="p-4 pb-2">
            <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setScreen('home')} className="p-1 hover:bg-gray-50 rounded-full transition-colors"><ChevronDown className="rotate-90 text-gray-800" size={24} /></button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2"><Home size={16} className="text-gray-800 font-bold" strokeWidth={3} /><span className="text-base font-black text-gray-800">HOME</span></div>
                    <span className="text-xs text-gray-500 font-medium truncate max-w-[250px]">Ahilya Sadan, 626, MG Rd, Khajuri Bazar...</span>
                </div>
            </div>
            <div className="bg-gray-100 p-1 rounded-xl flex relative">
                <div className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg text-center text-xs font-bold shadow-md">CART</div>
                <div className="flex-1 text-gray-400 py-2.5 rounded-lg text-center text-xs font-bold flex items-center justify-center gap-1">MAXXSAVER <span className="bg-orange-100 text-orange-600 text-[8px] px-1 rounded">NEW</span></div>
            </div>
        </div>
      </div>

      <div className="h-full overflow-y-auto no-scrollbar pt-[130px] pb-[180px]">
        {/* Savings & Timer */}
        <div className="bg-[#E7F7F0] mx-4 mt-4 p-3 rounded-lg border border-[#C6EAD8] flex items-start gap-3">
             <div className="w-5 h-5 bg-[#00AD68] rounded-full flex items-center justify-center shrink-0 mt-0.5"><Zap size={12} fill="white" className="text-white" /></div>
             <div>{hasSavings ? (<><p className="text-xs font-bold text-[#006039]">₹{totalSavings} saved!</p><p className="text-[10px] text-[#006039] font-medium leading-tight mt-0.5">Best price guaranteed.</p></>) : (<><p className="text-xs font-bold text-[#006039]">Superfast Delivery</p><p className="text-[10px] text-[#006039] font-medium leading-tight mt-0.5">Add items worth ₹{Math.max(0, 250 - itemTotal)} more to save delivery fee.</p></>)}</div>
        </div>
        <div className="flex items-center gap-2 mx-4 mt-6 mb-2"><Timer size={14} className="text-gray-900" /><span className="text-xs font-bold text-gray-900">Delivery in 8 Mins</span></div>

        {/* Product List */}
        <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm space-y-6">
            {cart.map((item) => {
                const displayImage = item.image || `https://placehold.co/300x300/f3f4f6/9ca3af?text=${item.name.substring(0, 3).toUpperCase()}`;
                return (
                    <div key={item.id} className="flex gap-4 relative">
                        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center p-1 border border-gray-100 shrink-0">
                            <img src={displayImage} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div><h3 className="text-sm font-semibold text-gray-800 leading-tight pr-8">{item.name}</h3><span className="text-[10px] text-gray-400 font-medium">{item.weight}</span></div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                                <div className="flex items-center gap-3 bg-white border border-green-600 rounded-lg px-2 py-1 shadow-sm">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="text-green-700 font-bold"><Minus size={14} strokeWidth={3} /></button>
                                    <span className="text-xs font-bold text-green-700 w-3 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="text-green-700 font-bold"><Plus size={14} strokeWidth={3} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* AI SUGGESTIONS SECTION */}
        {/* We show this block if AI is active OR if we are analyzing, so users see the loading state immediately */}
        {(aiData.active || isAnalyzing) && (
            <div className={`mt-8 mx-4 relative rounded-2xl border transition-all duration-500 overflow-hidden shadow-sm
                ${isAnalyzing 
                    ? 'bg-blue-50 border-blue-100' 
                    : aiData.source === 'gemini' 
                        ? 'bg-amber-50 border-amber-200' 
                        : 'bg-white border-gray-200'
                }`}>
                
                {/* Header */}
                <div className="flex justify-between items-start p-4 pb-0 relative z-10">
                    <div className="flex-1 pr-2">
                        {/* Status / Title */}
                        <div className="flex items-center gap-2 mb-1">
                             {isAnalyzing ? (
                                <Loader2 size={16} className="text-blue-600 animate-spin" />
                             ) : aiData.source === 'gemini' ? (
                                <AlertTriangle size={16} className="text-amber-600 fill-amber-600" />
                             ) : (
                                <Sparkles size={16} className="text-blue-500 fill-blue-500" />
                             )}
                             <h3 className={`text-sm font-bold uppercase tracking-wider ${isAnalyzing ? 'text-blue-700' : aiData.source === 'gemini' ? 'text-amber-800' : 'text-gray-800'}`}>
                                {isAnalyzing ? 'Analyzing Cart...' : aiData.context}
                             </h3>
                        </div>

                        {/* Message Text */}
                        <p className={`text-xs font-medium leading-relaxed ${isAnalyzing ? 'text-blue-600/80' : 'text-amber-900'} min-h-[20px] transition-all duration-300`}>
                            {isAnalyzing ? (
                                <span className="animate-pulse">{thinkingStates[analysisStep]}</span>
                            ) : aiData.message}
                        </p>
                    </div>
                    {/* Recalibrate Button - Always visible to allow manual refresh */}
                    <button 
                        onClick={refreshAI} 
                        className={`p-1.5 rounded-full transition-all active:scale-90 shadow-sm
                            ${isAnalyzing 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                        title="Recalibrate Suggestions"
                    >
                        <RotateCw size={14} className={isAnalyzing ? "animate-spin-reverse opacity-50" : ""} />
                    </button>
                </div>

                {/* Suggestions List (Horizontal Scroll) */}
                {/* Pointer events disabled during analysis to prevent adding while state is fluctuating */}
                <div className={`flex gap-3 overflow-x-auto subtle-scrollbar p-4 snap-x transition-opacity duration-300
                    ${isAnalyzing ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                    
                    {/* If we are analyzing for the first time and have no suggestions, show skeletons or nothing */}
                    {aiData.suggestions.length === 0 && isAnalyzing ? (
                        <div className="w-full flex justify-center py-4 text-xs text-blue-400 font-medium">Gathering insights...</div>
                    ) : (
                        aiData.suggestions.map((suggestion) => {
                            const isAdding = addingIds[suggestion.id];
                            const displayImage = suggestion.image || `https://placehold.co/160x160?text=${suggestion.name.substring(0,3)}`;
                            const rating = getStableRating(suggestion.id);
                            
                            return (
                                <div key={suggestion.id} className="min-w-[150px] w-[150px] snap-start bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2 shrink-0 relative group">
                                    {/* Reason Tag (If Gemini) */}
                                    {suggestion.reasonTag && (
                                        <div className="absolute top-2 left-2 z-10 bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-amber-200">
                                            {suggestion.reasonTag}
                                        </div>
                                    )}

                                    <div className="h-28 bg-gray-50 rounded-lg relative overflow-hidden flex items-center justify-center p-2 mt-4">
                                        <img src={displayImage} alt={suggestion.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                            <span className="text-[10px] font-bold text-gray-600">{rating}</span>
                                        </div>
                                        <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 mb-2 min-h-[32px]">{suggestion.name}</p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-gray-900">₹{suggestion.price}</span>
                                            </div>
                                            <button onClick={() => handleSmartAdd(suggestion)} disabled={isAdding}
                                                className={`h-7 px-3 rounded-md font-bold text-[10px] uppercase tracking-wide shadow-sm transition-all flex items-center justify-center gap-1 ${isAdding ? 'bg-green-600 text-white w-16' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}>
                                                {isAdding ? <Check size={12} strokeWidth={4} /> : 'ADD'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        )}

        {/* Bill Details */}
        <div className="mx-4 mt-6">
            <h3 className="text-xs font-bold text-gray-500 mb-3 tracking-wider">BILL DETAILS</h3>
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between text-xs text-gray-600"><span>Item Total</span><span>₹{itemTotal}</span></div>
                <div className="flex justify-between text-xs text-gray-600"><span className="flex items-center gap-1 underline decoration-dotted">Small Cart Fee<Info size={10} className="text-gray-400" /></span>{renderFee(smallCartFee)}</div>
                <div className="flex justify-between text-xs text-gray-600"><span className="flex items-center gap-1 underline decoration-dotted">Handling Fee</span>{renderFee(handlingFee)}</div>
                <div className="flex justify-between text-xs text-gray-600"><span className="flex items-center gap-1 underline decoration-dotted">Delivery Fee</span>{renderFee(deliveryFee)}</div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between text-sm font-bold text-gray-900"><span>To Pay</span><span>₹{toPay}</span></div>
            </div>
        </div>
        <div className="mx-4 mt-4 bg-gray-100 rounded-xl p-3 mb-4"><p className="text-[10px] text-gray-500 leading-relaxed"><span className="font-bold text-gray-600">Cancellation Policy:</span> Orders cannot be cancelled once packed.</p></div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-white p-4 pb-8 border-t border-gray-100 rounded-t-3xl shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.1)] z-50">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex flex-col"><span className="text-[10px] text-gray-400 font-bold mb-0.5">TOTAL TO PAY</span><div className="flex items-baseline gap-2"><span className="text-2xl font-black text-gray-900 leading-none">₹{toPay}</span>{hasSavings && <span className="text-xs text-gray-400 line-through">₹{originalPayable}</span>}</div></div>
                <div className="text-right">{hasSavings ? <div className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-green-100">You saved ₹{totalSavings}</div> : <div className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-lg">Inclusive of taxes</div>}</div>
            </div>
            <div className="flex justify-center mb-2"><p className={`text-[10px] font-semibold text-gray-400 transition-opacity duration-300 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>👉 Slide to confirm payment</p></div>
            <div ref={trackRef} className="relative w-full h-[65px] bg-gray-100 rounded-full overflow-hidden select-none touch-none shadow-inner">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 transition-all ease-linear" style={{ width: `${dragX + handleWidth + padding}px`, transitionDuration: isDragging ? '0ms' : '300ms' }}></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">{isCompleted ? <span className="text-white font-bold text-lg tracking-wide animate-in zoom-in duration-300">Processing...</span> : <span className="text-gray-500 font-bold text-sm tracking-widest uppercase transition-opacity duration-100" style={{ opacity: 1 - (dragX / 200) }}>Swipe to Pay ₹{toPay}</span>}</div>
                <div className={`absolute top-1 bottom-1 w-[56px] bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex items-center justify-center cursor-grab active:cursor-grabbing z-20 group ${!isDragging && !isCompleted ? 'animate-pulse' : ''}`} style={{ left: `${padding}px`, transform: `translateX(${dragX}px) scale(${isDragging ? 1.05 : 1})`, transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1)' }} onMouseDown={handleDragStart} onTouchStart={handleDragStart}>
                    {isCompleted ? <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-in zoom-in spin-in-90 duration-300"><Check size={20} className="text-white stroke-[4]" /></div> : <ChevronsRight size={24} className={`text-green-600 transition-all duration-300 ${isDragging ? 'translate-x-1' : ''}`} strokeWidth={3} />}
                </div>
            </div>
      </div>
    </div>
  );
};

export default CartPage;
