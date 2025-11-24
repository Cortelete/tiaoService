
import React, { useState } from 'react';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon, WalletIcon, CreditCardIcon } from '../icons';

interface AddFundsModalProps {
  onClose: () => void;
  onAddFunds: (amount: number, currency: 'BRL' | 'TC') => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ onClose, onAddFunds }) => {
  const [activeTab, setActiveTab] = useState<'TC' | 'BRL'>('TC');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    const val = parseFloat(amount);
    if (val > 0) {
        onAddFunds(val, activeTab);
    }
  };

  const calculateReceive = (val: number) => {
      if (activeTab === 'TC') return val;
      return val * 0.98; // 2% Fee
  };

  const receiveAmount = calculateReceive(parseFloat(amount) || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-2xl font-extrabold text-center text-gray-800">Adicionar Fundos</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('TC')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'TC' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Comprar TiãoCoin (TC$)
            </button>
            <button 
                onClick={() => setActiveTab('BRL')}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'BRL' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Depositar Reais (R$)
            </button>
        </div>

        <div className="p-8 space-y-6">
            <div className="text-center">
                {activeTab === 'TC' ? (
                    <div className="inline-flex items-center gap-2 text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-xs font-bold mb-4">
                        <WalletIcon className="w-4 h-4"/> Sem taxas administrativas
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-2 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-xs font-bold mb-4">
                        <CreditCardIcon className="w-4 h-4"/> Taxa de 2% no depósito
                    </div>
                )}
                
                <p className="text-gray-600 mb-2">Quanto deseja adicionar?</p>
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-center text-3xl font-bold text-gray-800 border-b-2 border-gray-200 focus:border-orange-500 outline-none py-2"
                    placeholder="0,00"
                    autoFocus
                />
            </div>

            {amount && parseFloat(amount) > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Você paga:</span>
                        <span>R$ {parseFloat(amount).toFixed(2)}</span>
                    </div>
                    {activeTab === 'BRL' && (
                        <div className="flex justify-between text-sm text-red-500">
                            <span>Taxa (2%):</span>
                            <span>- R$ {(parseFloat(amount) * 0.02).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-200">
                        <span>Você recebe:</span>
                        <span className={activeTab === 'TC' ? 'text-orange-600' : 'text-blue-600'}>
                            {activeTab === 'TC' ? 'TC$' : 'R$'} {receiveAmount.toFixed(2)}
                        </span>
                    </div>
                </div>
            )}

            <AnimatedButton onClick={handleAdd} className={`w-full !py-3 text-lg ${activeTab === 'BRL' ? '!bg-blue-600 hover:!bg-blue-700' : ''}`}>
               {activeTab === 'TC' ? 'Comprar TC$' : 'Depositar R$'}
            </AnimatedButton>
        </div>
      </div>
       <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
