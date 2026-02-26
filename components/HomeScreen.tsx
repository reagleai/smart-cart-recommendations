import React from 'react';
import { ChevronRight } from 'lucide-react';
import { INSTA_WOW_ITEMS, PREVIOUS_ORDERS } from '../constants';
import { ScreenType, CartItem } from '../types';
import Header from './Header';

interface HomeScreenProps {
  setScreen: (screen: ScreenType) => void;
  cart: CartItem[];
  addToCart: (item: any) => void;
  updateQuantity: (id: string, delta: number) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ setScreen, cart, addToCart, updateQuantity }) => {
  return (
    <div className="flex flex-col min-h-full bg-[#F4F5F7]">
      <Header cart={cart} addToCart={addToCart} updateQuantity={updateQuantity} />
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Content Container - Fully Interactive */}
        <div className="transition-all duration-300">
            
            {/* Insta-Wow Banner */}
            <div className="mx-4 mt-6 relative h-40 rounded-2xl overflow-hidden shadow-sm group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                    <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest mb-2 shadow-sm">
                        Sale is Live
                    </span>
                    <h2 className="text-3xl font-black text-white italic tracking-tighter drop-shadow-md leading-none mb-1">
                        INSTA<span className="text-yellow-300">WOOOOW</span>
                    </h2>
                    <p className="text-white/90 font-medium text-sm tracking-wide border-t border-white/20 pt-2 mt-1">
                        50% OFF ON GROCERIES
                    </p>
                </div>
                
                {/* 3D Elements Mock */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-pink-500 rounded-full blur-xl opacity-60"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-400 rounded-full blur-xl opacity-60"></div>
            </div>

            {/* Blue Grid Cards */}
            <div className="grid grid-cols-4 gap-2 mx-4 mt-6">
                {INSTA_WOW_ITEMS.map((item, idx) => (
                    <div key={idx} className="bg-[#2563EB] rounded-xl p-2 min-h-[100px] flex flex-col justify-between relative overflow-hidden shadow-sm group active:scale-95 transition-transform hover:shadow-md cursor-pointer">
                        {/* Background Pattern */}
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-white/10 rounded-full"></div>
                        
                        <span className="text-white text-[10px] font-bold leading-tight z-10 pr-1">
                            {item.title}
                        </span>
                        
                        <div className="mt-2 self-center w-full flex justify-center">
                            {/* Placeholder for item image */}
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors"></div>
                        </div>

                        <div className="mt-2 bg-red-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full self-start truncate max-w-full">
                            {item.discount}
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Again Section */}
            <div className="mt-8">
                <div className="flex items-center justify-between mx-4 mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Ajay, order again</h3>
                    <ChevronRight size={18} className="text-gray-400" />
                </div>

                <div className="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar">
                    {PREVIOUS_ORDERS.map((order) => (
                        <div 
                            key={order.id} 
                            className="bg-white rounded-2xl p-3 min-w-[150px] shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer hover:border-gray-200"
                            onClick={() => order.title === 'Most Ordered' ? setScreen('category') : null}
                        >
                            <div className="grid grid-cols-2 gap-1.5 mb-3">
                                {order.items.slice(0, 4).map((img, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg aspect-square overflow-hidden">
                                        <img src={img} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-700">{order.title}</span>
                                {order.count > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500">
                                        +{order.count}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        
        </div>
        
        {/* Spacer for bottom nav */}
        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default HomeScreen;