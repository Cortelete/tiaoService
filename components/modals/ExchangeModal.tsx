
import React, { useState } from 'react';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon } from '../icons';

interface ExchangeModalProps {
  onClose: () => void;
  onExchange: (fromCurrency: 'BRL' | 'TC', amount: number) => void;
  balanceTC: number;
  balanceBRL: number;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({ onClose, onExchange, balanceTC, balanceBRL }) => {
  const [direction, setDirection] = useState<'BRL_TO_TC' | 'TC_TO_BRL'>('BRL_TO_TC');
  const [amount, setAmount] = useState('');
  
  const val = parseFloat(amount) || 0;
  
  const handleExchange = () => {
      if (val <= 0) return;
      if (direction === 'BRL_TO_TC' && val > balanceBRL) return;
      if (direction === 'TC_TO_BRL' && val > balanceTC) return;

      onExchange(direction === 'BRL_TO_TC' ? 'BRL' : 'TC', val);
  };

  const getReceiveAmount = () => {
      if (direction === 'BRL_TO_TC') return val; // 1 to 1, no fee
      return val * 0.98; // 2% Fee
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-2xl font-extrabold text-center text-gray-800">Converter Moedas</h2>
        </div>

        <div className="px-8 pb-8 space-y-6">
            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                    onClick={() => setDirection('BRL_TO_TC')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${direction === 'BRL_TO_TC' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
                >
                    R$ ➝ TC$
                </button>
                <button 
                    onClick={() => setDirection('TC_TO_BRL')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${direction === 'TC_TO_BRL' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                >
                    TC$ ➝ R$
                </button>
            </div>

            <div className="text-center">
                 <p className="text-sm text-gray-500 mb-2">Saldo disponível: <span className="font-bold">{direction === 'BRL_TO_TC' ? `R$ ${balanceBRL.toFixed(2)}` : `TC$ ${balanceTC.toFixed(2)}`}</span></p>
                 <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full text-center text-4xl font-bold text-gray-800 border-b-2 border-gray-200 focus:border-orange-500 outline-none py-2"
                    placeholder="0,00"
                    autoFocus
                 />
                 <p className="text-xs text-gray-400 mt-2">
                     {direction === 'BRL_TO_TC' ? 'Taxa: 0% (Grátis)' : 'Taxa de conversão: 2%'}
                 </p>
            </div>

            {val > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Você recebe:</span>
                    <span className={`text-xl font-bold ${direction === 'BRL_TO_TC' ? 'text-orange-600' : 'text-blue-600'}`}>
                        {direction === 'BRL_TO_TC' ? 'TC$' : 'R$'} {getReceiveAmount().toFixed(2)}
                    </span>
                </div>
            )}

            <AnimatedButton onClick={handleExchange} className="w-full !py-3 text-lg" disabled={val <= 0 || (direction === 'BRL_TO_TC' ? val > balanceBRL : val > balanceTC)}>
                Confirmar Conversão
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
