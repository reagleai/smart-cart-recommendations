import React, { useState } from 'react';
import { LayoutGrid, RotateCw, ArrowLeft } from 'lucide-react';
import HomeScreen from './components/HomeScreen';
import BottomNav from './components/BottomNav';
import CartPage from './components/CartPage';
import CategoryPage from './components/CategoryPage';
import ProductListingPage from './components/ProductListingPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import { ScreenType, CartItem } from './types';
import { AIProvider } from './context/AIContext';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<{id: string, amount: number} | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const addToCart = (newItem: any) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === newItem.id);
      if (existing) {
        return prev.map(p => p.id === newItem.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, newItem];
    });
  };

  const handlePlaceOrder = (amount: number) => {
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newOrderId = `ORD-${randomCode}`;
    setOrderDetails({ id: newOrderId, amount: amount });
    setCart([]);
    setCurrentScreen('success');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen setScreen={setCurrentScreen} cart={cart} addToCart={addToCart} updateQuantity={updateQuantity} />;
      case 'category':
        return <CategoryPage setScreen={setCurrentScreen} setSelectedCategory={setSelectedCategory} addToCart={addToCart} updateQuantity={updateQuantity} cart={cart} />;
      case 'plp':
        return <ProductListingPage categoryId={selectedCategory} setScreen={setCurrentScreen} addToCart={addToCart} cart={cart} updateQuantity={updateQuantity} />;
      case 'cart':
        return <CartPage cart={cart} updateQuantity={updateQuantity} addToCart={addToCart} setScreen={setCurrentScreen} onPlaceOrder={handlePlaceOrder} />;
      case 'success':
        return <OrderConfirmationPage setScreen={setCurrentScreen} orderDetails={orderDetails} />;
      case 'reorder':
         return (
           <div className="flex flex-col h-full bg-[#F4F5F7] animate-in slide-in-from-bottom duration-300">
             {/* Header */}
             <div className="bg-white p-4 flex items-center gap-3 shadow-sm border-b border-gray-100">
                <button onClick={() => setCurrentScreen('home')} className="p-1 -ml-1">
                    <ArrowLeft size={24} className="text-gray-800" />
                </button>
                <h1 className="text-lg font-black text-gray-800">Reorder</h1>
             </div>
             
             {/* Content */}
             <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-600 shadow-sm"><RotateCw size={32} /></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Recent Orders</h2>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <button onClick={() => setCurrentScreen('home')} className="px-6 py-2.5 bg-[#2563EB] text-white border-none rounded-xl font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all">Browse Home</button>
             </div>
          </div>
        );
      default:
        return <HomeScreen setScreen={setCurrentScreen} cart={cart} addToCart={addToCart} updateQuantity={updateQuantity} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-black flex justify-center items-center p-4 sm:p-8">
      <div className="w-[375px] h-[812px] bg-[#F4F5F7] rounded-[40px] overflow-hidden shadow-2xl relative border-[8px] border-gray-900 flex flex-col">
        {/* PROVIDER WRAPPED HERE */}
        <AIProvider cart={cart}>
            <div className="flex-1 overflow-hidden relative bg-[#F4F5F7]">
                {renderScreen()}
            </div>
            {currentScreen !== 'cart' && currentScreen !== 'plp' && currentScreen !== 'success' && (
                <BottomNav currentScreen={currentScreen} setScreen={setCurrentScreen} cart={cart} />
            )}
        </AIProvider>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full z-[60] opacity-90"></div>
      </div>
    </div>
  );
};

export default App;