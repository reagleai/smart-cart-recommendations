import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Minus, SlidersHorizontal, ArrowLeft, X } from 'lucide-react';
import { CATEGORIES_DB, PRODUCT_DB } from '../constants';
import { ScreenType, CartItem } from '../types';

interface CategoryPageProps {
  setScreen: (screen: ScreenType) => void;
  setSelectedCategory: (id: string) => void;
  addToCart: (item: any) => void;
  updateQuantity: (id: string, delta: number) => void;
  cart: CartItem[];
}

const CategoryPage: React.FC<CategoryPageProps> = ({ setScreen, setSelectedCategory, addToCart, cart = [], updateQuantity }) => {
  const [activeTabId, setActiveTabId] = useState<string>('snacks');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Search Logic
  let displayedProducts = PRODUCT_DB.filter(p => p.categoryId === activeTabId);
  const activeCategory = CATEGORIES_DB.find(c => c.id === activeTabId) || CATEGORIES_DB[0];

  if (isSearching && searchQuery.length > 0) {
      displayedProducts = PRODUCT_DB.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm min-h-[60px]">
            {isSearching ? (
                <div className="flex items-center gap-2 w-full animate-in fade-in slide-in-from-right duration-200">
                    <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="p-1">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2 flex items-center">
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Search in all categories..."
                            className="bg-transparent w-full text-sm outline-none text-gray-800 placeholder-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery.length > 0 && (
                            <button onClick={() => setSearchQuery('')}>
                                <X size={14} className="text-gray-500" />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setScreen('home')} className="p-1 -ml-1">
                            <ArrowLeft size={20} className="text-gray-800" />
                        </button>
                        <h1 className="text-xl font-black text-gray-800 tracking-tight">Categories</h1>
                    </div>
                    <button 
                        onClick={() => setIsSearching(true)}
                        className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
                    >
                        <Search size={20} className="text-gray-600" />
                    </button>
                </>
            )}
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Hide when searching to give full width to results */}
            {!isSearching && (
                <div className="w-[85px] bg-gray-50 h-full overflow-y-auto no-scrollbar pb-32 border-r border-gray-100 shrink-0">
                    {CATEGORIES_DB.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeTabId === cat.id;
                        return (
                            <div 
                                key={cat.id}
                                onClick={() => setActiveTabId(cat.id)}
                                className={`flex flex-col items-center justify-center py-4 px-1 cursor-pointer transition-all relative ${isActive ? 'bg-white' : ''}`}
                            >
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FC8019] rounded-r-md"></div>}
                                
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1.5 transition-transform ${isActive ? 'bg-orange-50 scale-105' : 'bg-gray-100'}`}>
                                    <Icon size={24} className={isActive ? 'text-[#FC8019]' : 'text-gray-500'} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-[10px] font-bold text-center leading-tight px-1 w-full break-words ${isActive ? 'text-[#FC8019]' : 'text-gray-500'}`}>
                                    {cat.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Right Content Area (Product Grid) */}
            <div className="flex-1 h-full overflow-y-auto no-scrollbar bg-white pb-32 p-3">
                
                {/* Section Header (Hide if searching) */}
                {!isSearching && (
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 py-2 border-b border-gray-50">
                        <h2 className="text-base font-bold text-gray-800 leading-tight">{activeCategory.name}</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                                <span className="text-[10px] font-bold text-gray-600">Sort</span>
                                <ChevronDown size={12} className="text-gray-600" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Results Header */}
                {isSearching && searchQuery.length > 0 && (
                     <div className="mb-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                         Found {displayedProducts.length} results for "{searchQuery}"
                     </div>
                )}

                {/* Product Grid */}
                <div className={`grid ${isSearching ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
                    {displayedProducts.map((product) => {
                        const cartItem = cart.find((c: any) => c.id === product.id);
                        const fallbackImage = `https://placehold.co/300x300/f3f4f6/9ca3af?text=${product.name.substring(0, 3).toUpperCase()}`;
                        
                        return (
                            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border border-gray-100 h-full relative group">
                                {/* Image */}
                                <div className="aspect-square bg-white p-4 flex items-center justify-center relative">
                                    <img 
                                        src={product.image || fallbackImage} 
                                        alt={product.name} 
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105" 
                                    />
                                    {product.discount && (
                                         <div className="absolute top-0 left-0 bg-[#2563EB] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm z-10">
                                             {product.discount}
                                         </div>
                                     )}
                                </div>
                                
                                {/* Info */}
                                <div className="p-3 flex flex-col justify-between flex-1 bg-white border-t border-gray-50">
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-800 leading-tight line-clamp-2 mb-1">{product.name}</h3>
                                        <p className="text-[10px] text-gray-500">{product.weight}</p>
                                    </div>
                                    
                                    <div className="flex items-end justify-between mt-2">
                                        <div className="flex flex-col">
                                            {product.discount && <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>}
                                            <span className="text-sm font-black text-gray-900">₹{product.price}</span>
                                        </div>

                                        {/* Add Button */}
                                        {cartItem ? (
                                             <div className="flex items-center gap-2 bg-green-50 border border-green-600 rounded-lg px-2 py-1 h-7">
                                                 <button onClick={() => updateQuantity && updateQuantity(product.id, -1)} className="text-green-700">
                                                     <Minus size={12} strokeWidth={3} />
                                                 </button>
                                                 <span className="text-xs font-bold text-green-700">{cartItem.quantity}</span>
                                                 <button onClick={() => updateQuantity && updateQuantity(product.id, 1)} className="text-green-700">
                                                     <Plus size={12} strokeWidth={3} />
                                                 </button>
                                             </div>
                                         ) : (
                                             <button 
                                                 onClick={() => addToCart && addToCart({ ...product, quantity: 1 })}
                                                 className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-md active:scale-95 transition-all uppercase hover:shadow-lg"
                                             >
                                                 ADD
                                             </button>
                                         )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Empty State */}
                {displayedProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center pt-20 opacity-50">
                        <Search size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-400 text-sm font-medium">No products found</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default CategoryPage;