import React, { useState } from 'react';
import { User, Search, MapPin, Mic, Snowflake, Gift, Plane, Heart, LayoutGrid, Plus, Minus, X } from 'lucide-react';
import { PRODUCT_DB } from '../constants';
import { CartItem } from '../types';

interface HeaderProps {
    cart: CartItem[];
    addToCart: (item: any) => void;
    updateQuantity: (id: string, delta: number) => void;
}

const Header: React.FC<HeaderProps> = ({ cart, addToCart, updateQuantity }) => {
  const [query, setQuery] = useState('');
  
  // Search Logic
  const results = query.length > 2 
    ? PRODUCT_DB.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="bg-gradient-to-b from-[#0C1E5B] to-[#254589] pt-14 pb-4 px-4 rounded-b-[24px] shadow-md relative z-20">
      
      {/* Top Row: Time & Profile */}
      <div className="flex justify-between items-start mb-5 text-white/90">
        <div className="flex flex-col text-white">
            <h1 className="text-4xl font-black tracking-tighter leading-none mb-1">
                9 mins
            </h1>
            <div className="flex items-center gap-1 opacity-90">
                <span className="text-xs font-medium truncate max-w-[250px]">
                    To Home: Ahilya Sadan, 626, MG Rd, Khajuri...
                </span>
                <MapPin size={10} />
            </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <User size={20} className="text-white" />
        </button>
      </div>

      {/* Search Bar Container - SPOTLIGHTED */}
      <div className="relative group mb-6 z-30">
        <div className="w-full bg-white rounded-xl py-3.5 pl-11 pr-10 shadow-lg ring-4 ring-orange-400/50 flex items-center relative z-20 opacity-100 transform transition-transform hover:scale-[1.02]">
            <input 
              type="text" 
              placeholder="Search for 'Chips'" 
              className="w-full bg-transparent text-slate-900 placeholder-slate-500 outline-none font-bold text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
        </div>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500 z-20 font-bold" size={20} strokeWidth={2.5} />
        
        {query.length > 0 ? (
            <button 
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 p-1 bg-gray-200 rounded-full"
            >
                <X size={12} className="text-gray-600" />
            </button>
        ) : (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-3 border-l border-slate-200 pl-3 z-20">
                <Mic size={18} className="text-orange-500" />
            </div>
        )}

        {/* Search Results Dropdown */}
        {query.length > 2 && (
            <div className="absolute top-[calc(100%-10px)] left-0 w-full bg-white rounded-b-xl rounded-t-lg shadow-xl pt-4 pb-2 z-10 max-h-[400px] overflow-y-auto border border-gray-100">
                {results.length > 0 ? (
                    <div className="flex flex-col">
                        <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Found {results.length} items
                        </div>
                        {results.map(product => {
                            const cartItem = cart.find(c => c.id === product.id);
                            const fallbackImage = `https://placehold.co/300x300/f3f4f6/9ca3af?text=${product.name.substring(0, 3).toUpperCase()}`;

                            return (
                                <div key={product.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                    {/* Image */}
                                    <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg shrink-0 p-0.5">
                                        <img src={product.image || fallbackImage} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-gray-800 truncate">{product.name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-gray-500">{product.weight}</span>
                                            <span className="text-[10px] font-bold text-gray-900">₹{product.price}</span>
                                        </div>
                                    </div>

                                    {/* Add Button */}
                                    <div className="shrink-0">
                                        {cartItem ? (
                                             <div className="flex items-center gap-2 bg-green-50 border border-green-600 rounded-md px-1.5 py-1 h-6">
                                                 <button onClick={() => updateQuantity(product.id, -1)} className="text-green-700">
                                                     <Minus size={10} strokeWidth={3} />
                                                 </button>
                                                 <span className="text-[10px] font-bold text-green-700 w-2 text-center">{cartItem.quantity}</span>
                                                 <button onClick={() => updateQuantity(product.id, 1)} className="text-green-700">
                                                     <Plus size={10} strokeWidth={3} />
                                                 </button>
                                             </div>
                                         ) : (
                                             <button 
                                                 onClick={() => addToCart({ ...product, quantity: 1 })}
                                                 className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-[9px] px-3 py-1 rounded-md shadow-md active:scale-95 uppercase hover:shadow-lg transform transition-all"
                                             >
                                                 ADD
                                             </button>
                                         )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-6 flex flex-col items-center justify-center text-gray-400">
                        <Search size={24} className="mb-2 opacity-50" />
                        <span className="text-xs font-medium">No products found</span>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Categories Tabs - Restored Interaction */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-1 text-white/80">
        <CategoryTab icon={<LayoutGrid size={18} />} label="All" active />
        <CategoryTab icon={<Snowflake size={18} />} label="Winter" />
        <CategoryTab icon={<Gift size={18} />} label="Christmas" />
        <CategoryTab icon={<Plane size={18} />} label="Travel" />
        <CategoryTab icon={<Heart size={18} />} label="Wedding" />
      </div>
    </div>
  );
};

interface CategoryTabProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ icon, label, active }) => (
    <div className={`flex flex-col items-center gap-1 min-w-[50px] cursor-pointer transition-all hover:text-white ${active ? 'opacity-100' : 'opacity-80 hover:opacity-100 hover:scale-105'}`}>
        <div className={`p-2 rounded-full ${active ? 'bg-white/20 text-white shadow-sm' : 'text-white'}`}>
            {icon}
        </div>
        <span className={`text-[10px] font-semibold text-white ${active ? 'underline underline-offset-4 decoration-2 decoration-orange-400' : ''}`}>
            {label}
        </span>
    </div>
);

export default Header;