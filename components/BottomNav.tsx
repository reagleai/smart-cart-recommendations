import React from 'react';
import { Home, LayoutGrid, RotateCw, ShoppingBag } from 'lucide-react';
import { ScreenType, CartItem } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  cart: CartItem[];
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setScreen, cart }) => {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (screen: ScreenType) => currentScreen === screen;

  return (
    <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 pb-8 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {/* Home Button - Highlighted */}
      <button 
        className={`flex flex-col items-center gap-1.5 transition-all duration-300 p-2 rounded-xl ${isActive('home') ? 'bg-orange-50 -translate-y-2 shadow-sm ring-1 ring-orange-100' : 'hover:bg-gray-50'}`}
        onClick={() => setScreen('home')}
      >
        <Home size={22} color={isActive('home') ? "#fc8019" : "#9CA3AF"} strokeWidth={isActive('home') ? 3 : 2} />
        <span className={`text-[10px] font-bold ${isActive('home') ? 'text-[#fc8019]' : 'text-gray-400'}`}>Home</span>
        {isActive('home') && <div className="w-1 h-1 bg-[#fc8019] rounded-full"></div>}
      </button>

      {/* Categories */}
      <button 
        className={`flex flex-col items-center gap-1.5 transition-transform active:scale-95 ${isActive('category') ? 'text-gray-900' : 'text-gray-400'}`}
        onClick={() => setScreen('category')}
      >
        <LayoutGrid size={22} color={isActive('category') ? "#111827" : "#9CA3AF"} strokeWidth={2} />
        <span className={`text-[10px] font-bold ${isActive('category') ? 'text-gray-900' : 'text-gray-400'}`}>Categories</span>
      </button>

      {/* Reorder */}
      <button 
        className={`flex flex-col items-center gap-1.5 transition-transform active:scale-95 ${isActive('reorder') ? 'text-gray-900' : 'text-gray-400'}`}
        onClick={() => setScreen('reorder')}
      >
        <RotateCw size={22} color={isActive('reorder') ? "#111827" : "#9CA3AF"} strokeWidth={2} />
        <span className={`text-[10px] font-bold ${isActive('reorder') ? 'text-gray-900' : 'text-gray-400'}`}>Reorder</span>
      </button>

      {/* Cart */}
      <button 
        className={`flex flex-col items-center gap-1.5 transition-transform active:scale-95 ${isActive('cart') ? 'text-gray-900' : 'text-gray-400'}`}
        onClick={() => setScreen('cart')}
      >
        <div className="relative">
             <ShoppingBag size={22} color={isActive('cart') ? "#111827" : "#9CA3AF"} strokeWidth={2} />
             {/* Dynamic Badge */}
             {cartCount > 0 && (
                 <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white">
                     {cartCount}
                 </div>
             )}
        </div>
        <span className={`text-[10px] font-bold ${isActive('cart') ? 'text-gray-900' : 'text-gray-400'}`}>Cart</span>
      </button>
    </div>
  );
};

export default BottomNav;