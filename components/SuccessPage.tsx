import React, { useEffect } from 'react';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { ScreenType } from '../types';

interface SuccessPageProps {
  setScreen: (screen: ScreenType) => void;
  orderDetails: { id: string; amount: number } | null;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ setScreen, orderDetails }) => {
  useEffect(() => {
    // Optional: Trigger confetti or sound here
  }, []);

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-green-50 to-white z-0"></div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 relative">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm animate-[bounce_1s_ease-out]">
            <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-green-400 rounded-full flex items-center justify-center shadow-lg">
                <Check size={32} className="text-white stroke-[4]" />
            </div>
        </div>

        <h1 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Order Received!</h1>
        <p className="text-gray-500 font-medium mb-8 text-center">
            Yay! Your fridge is about to get happy.
        </p>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full shadow-lg shadow-gray-100/50 mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                <span className="text-sm font-bold text-gray-800 font-mono">{orderDetails?.id || 'ORD-ERROR'}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount Paid</span>
                <span className="text-xl font-black text-gray-900">₹{orderDetails?.amount || 0}</span>
            </div>
        </div>

        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full mb-10">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold">Packers are finding your items...</span>
        </div>
      </div>

      <div className="p-4 pb-8 z-10">
        <button 
          onClick={() => setScreen('home')}
          className="w-full bg-gray-900 text-white font-bold h-14 rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-black"
        >
            <span>Continue Shopping</span>
            <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;