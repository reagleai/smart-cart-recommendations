import React from 'react';
import { ArrowLeft, Search, SlidersHorizontal, Plus, Minus, ChevronDown } from 'lucide-react';
import { PRODUCT_DB, CATEGORIES_DB } from '../constants';
import { ScreenType, CartItem } from '../types';

interface ProductListingPageProps {
    categoryId: string;
    setScreen: (screen: ScreenType) => void;
    addToCart: (item: any) => void;
    cart: CartItem[];
    updateQuantity: (id: string, delta: number) => void;
}

const ProductListingPage: React.FC<ProductListingPageProps> = ({ categoryId, setScreen, addToCart, cart, updateQuantity }) => {

    // Find Subcategory Name logic
    let categoryName = 'Products';
    const main = CATEGORIES_DB.find(c => c.id === categoryId);
    if (main) categoryName = main.name;

    const products = PRODUCT_DB.filter(p => p.categoryId === categoryId);

    return (
        <div className="flex flex-col h-full bg-[#F4F5F7] relative">
            {/* Header */}
            <div className="bg-white p-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm border-b border-gray-100">
                <button onClick={() => setScreen('category')} className="p-1 -ml-1">
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-lg font-black text-gray-800 capitalize flex-1 truncate">{categoryName}</h1>

                <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                        <span className="text-[10px] font-bold text-gray-600">Sort</span>
                        <ChevronDown size={12} className="text-gray-600" />
                    </div>
                    <SlidersHorizontal size={18} className="text-gray-800" />
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-3 pb-24">
                {products.length > 0 ? products.map(product => {
                    const cartItem = cart.find(c => c.id === product.id);
                    return (
                        <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col aspect-[4/5] justify-between relative">
                            {/* Image Section (60%) */}
                            <div className="h-[55%] bg-white relative flex items-center justify-center p-4">
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                {product.discount && (
                                    <div className="absolute top-0 left-0 bg-[#2563EB] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm z-10">
                                        {product.discount}
                                    </div>
                                )}
                            </div>

                            {/* Details Section (40%) */}
                            <div className="h-[45%] p-3 flex flex-col justify-between bg-white border-t border-gray-50">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-800 leading-tight line-clamp-2 mb-1">{product.name}</h3>
                                    <p className="text-[10px] text-gray-500">{product.weight}</p>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col">
                                        {product.discount && <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>}
                                        <span className="text-sm font-black text-gray-900">₹{product.price}</span>
                                    </div>

                                    {cartItem ? (
                                        <div className="flex items-center gap-2 bg-green-50 border border-green-600 rounded-lg px-2 py-1 h-7">
                                            <button onClick={() => updateQuantity(product.id, -1)} className="text-green-700">
                                                <Minus size={12} strokeWidth={3} />
                                            </button>
                                            <span className="text-xs font-bold text-green-700">{cartItem.quantity}</span>
                                            <button onClick={() => updateQuantity(product.id, 1)} className="text-green-700">
                                                <Plus size={12} strokeWidth={3} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => addToCart({ ...product, quantity: 1 })}
                                            className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-md active:scale-95 transition-all uppercase hover:shadow-lg"
                                        >
                                            ADD
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-2 flex flex-col items-center justify-center pt-20 opacity-50">
                        <Search size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-400 text-sm font-medium">No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListingPage;