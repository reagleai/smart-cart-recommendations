import React from 'react';
import { Check } from 'lucide-react';
import { ScreenType } from '../types';

interface OrderConfirmationPageProps {
  setScreen: (screen: ScreenType) => void;
  orderDetails: { id: string; amount: number } | null;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ setScreen, orderDetails }) => {
  return (
    <div className="flex flex-col h-full bg-white relative">
        {/* Main Content Area - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            
            {/* Big Blue Check Circle */}
            <div className="w-24 h-24 bg-[#0057FF] rounded-full flex items-center justify-center mb-8 shadow-blue-200/50 shadow-xl animate-[bounce_0.5s_ease-out]">
                <Check className="text-white w-12 h-12 stroke-[5]" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Yay! Order Received
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-[280px] mb-10">
                Your order will be delivered shortly. Keep exploring great deals on Instamart!
            </p>

            {/* Order Details Card - Subtle & Clean */}
            {orderDetails && (
                <div className="bg-gray-50 rounded-2xl p-5 w-full max-w-[300px] border border-gray-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order Reference</span>
                        <span className="text-sm font-bold text-gray-800 font-mono tracking-wide">{orderDetails.id}</span>
                    </div>
                    
                    <div className="w-full h-px bg-gray-200/60"></div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Amount Paid</span>
                        <span className="text-xl font-black text-gray-900">₹{orderDetails.amount}</span>
                    </div>
                </div>
            )}
        </div>

        {/* Bottom Action Button */}
        <div className="p-6 w-full bg-white">
            <button 
                onClick={() => setScreen('home')}
                className="w-full bg-[#0057FF] hover:bg-blue-700 text-white font-bold h-14 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all text-sm uppercase tracking-wide"
            >
                Continue Shopping
            </button>
        </div>
    </div>
  );
};

export default OrderConfirmationPage;