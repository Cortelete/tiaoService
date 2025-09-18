import React, { useState, useMemo } from 'react';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon } from '../icons';

interface WithdrawModalProps {
  onClose: () => void;
  onWithdraw: (amountTC: number, fee: number) => void;
  currentBalanceTC: number;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose, onWithdraw, currentBalanceTC }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  
  const WITHDRAWAL_FEE_PERCENTAGE = 0.02; // 2%

  const numericAmount = useMemo(() => parseFloat(amount) || 0, [amount]);
  const fee = useMemo(() => numericAmount * WITHDRAWAL_FEE_PERCENTAGE, [numericAmount]);
  const finalAmountBRL = useMemo(() => numericAmount - fee, [numericAmount, fee]);

  const handleWithdraw = () => {
    setError('');
    if (numericAmount <= 0) {
      setError('Por favor, insira um valor válido.');
      return;
    }
    if (numericAmount > currentBalanceTC) {
      setError('Valor de saque maior que o saldo disponível.');
      return;
    }
    onWithdraw(numericAmount, fee);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Sacar Saldo</h2>
        </div>
        <div className="px-8 pb-8 space-y-4">
          <p className="text-center text-gray-600">
            Saldo disponível: <span className="font-bold">TC$ {currentBalanceTC.toFixed(2)}</span>
          </p>
          {error && <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
          <div>
            <label htmlFor="withdraw-amount" className="text-sm font-bold text-gray-600 block mb-2">Valor do Saque (TC$)</label>
            <input 
              type="number" 
              id="withdraw-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Ex: 100.00"
              autoFocus
            />
          </div>
          {numericAmount > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg text-sm space-y-2 border">
                <div className="flex justify-between">
                    <span className="text-gray-600">Valor do saque:</span>
                    <span className="font-semibold text-gray-800">TC$ {numericAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                    <span className="">Taxa de transação (2%):</span>
                    <span className="font-semibold">- TC$ {fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span className="text-gray-800">Você recebe (R$):</span>
                    <span className="text-green-600">R$ {finalAmountBRL.toFixed(2)}</span>
                </div>
            </div>
          )}
          <AnimatedButton onClick={handleWithdraw} className="w-full !py-3 text-lg" disabled={numericAmount <= 0}>
            Confirmar Saque
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
