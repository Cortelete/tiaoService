
import React from 'react';
import type { User, ServiceRequest } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon, WalletIcon, CreditCardIcon, SparklesIcon } from '../icons';

interface ServicePaymentModalProps {
  onClose: () => void;
  onPayWithTiaoCoin: (costInTiaoCoin: number) => void;
  onPayWithBRL: (costInBRL: number) => void;
  onAddFunds: () => void;
  request: ServiceRequest;
  client: User;
  professional: User;
}

export const ServicePaymentModal: React.FC<ServicePaymentModalProps> = ({ onClose, onPayWithTiaoCoin, onPayWithBRL, onAddFunds, request, client, professional }) => {
  const basePrice = request.price || 0;
  const adminFeePercentage = 0.05;
  const adminFeeValue = basePrice * adminFeePercentage;
  
  const costInBRL = basePrice + adminFeeValue;
  const costInTiaoCoin = basePrice;
  
  const savings = costInBRL - costInTiaoCoin;
  
  const canAffordWithTC = (client.walletBalanceTC || 0) >= costInTiaoCoin;
  const canAffordWithBRL = (client.walletBalanceBRL || 0) >= costInBRL;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-lg animate-fade-in-up overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-slate-100 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-2xl font-extrabold text-center text-slate-800">Finalizar Contratação</h2>
          <p className="text-center text-slate-500 text-sm mt-1">
            Profissional: <span className="font-bold text-slate-700">{professional.name}</span>
          </p>
        </div>

        <div className="p-8 space-y-6">
            <div className="text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Valor Base do Serviço</p>
                <p className="text-4xl font-extrabold text-slate-800">
                R$ {basePrice.toFixed(2).replace('.', ',')}
                </p>
            </div>
            
            <div className="grid gap-4">
                {/* Option 1: Pay with TiãoCoin */}
                <div className={`relative p-5 rounded-2xl border-2 transition-all duration-300 shadow-sm overflow-hidden group ${canAffordWithTC ? 'border-orange-400 bg-white ring-4 ring-orange-500/10' : 'border-slate-200 bg-slate-50 opacity-80'}`}>
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                        RECOMENDADO
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${canAffordWithTC ? 'bg-orange-100' : 'bg-slate-200'}`}>
                                <WalletIcon className={`w-6 h-6 ${canAffordWithTC ? 'text-orange-600' : 'text-slate-500'}`}/>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">TiãoCoin</h3>
                                <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                                    <SparklesIcon className="w-3 h-3"/>
                                    Isento de taxas (5% OFF)
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="font-extrabold text-2xl text-orange-600">TC$ {costInTiaoCoin.toFixed(2)}</p>
                             <p className="text-xs text-slate-400 line-through">R$ {costInBRL.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200 my-3 pt-2">
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Saldo atual:</span>
                            <span className="font-bold text-slate-700">TC$ {(client.walletBalanceTC || 0).toFixed(2)}</span>
                         </div>
                    </div>

                     <AnimatedButton 
                        onClick={() => onPayWithTiaoCoin(costInTiaoCoin)} 
                        className={`w-full mt-1 !py-3 !text-base ${!canAffordWithTC ? '!bg-slate-300 !text-slate-500 !shadow-none cursor-not-allowed' : '!bg-gradient-to-r !from-orange-500 !to-yellow-500'}`} 
                        disabled={!canAffordWithTC}
                    >
                        {canAffordWithTC ? `Pagar TC$ ${costInTiaoCoin.toFixed(2)}` : 'Saldo Insuficiente'}
                    </AnimatedButton>
                </div>

                 {/* Option 2: Pay with BRL Balance */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-slate-100">
                                <CreditCardIcon className="w-6 h-6 text-slate-600"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-700">Saldo em Reais</h3>
                                <p className="text-xs text-slate-500">Saldo: R$ {(client.walletBalanceBRL || 0).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-xl text-slate-700">R$ {costInBRL.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-100 p-2 rounded-lg mt-3 mb-3 text-xs space-y-1">
                         <div className="flex justify-between text-slate-500">
                            <span>Valor do Serviço:</span>
                            <span>R$ {basePrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Taxa Administrativa (5%):</span>
                            <span>R$ {adminFeeValue.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between font-bold text-slate-700 border-t border-slate-200 pt-1">
                            <span>Total a pagar:</span>
                            <span>R$ {costInBRL.toFixed(2)}</span>
                        </div>
                    </div>

                     <button 
                        onClick={canAffordWithBRL ? () => onPayWithBRL(costInBRL) : onAddFunds} 
                        className={`w-full py-3 border-2 font-bold rounded-xl transition-all ${canAffordWithBRL ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800' : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'}`}
                    >
                        {canAffordWithBRL ? `Pagar R$ ${costInBRL.toFixed(2)}` : 'Recarregar Reais'}
                    </button>
                    {!canAffordWithBRL && (
                        <p className="text-center text-xs text-slate-400 mt-2">Dica: Recarregue em TiãoCoin para não pagar taxas.</p>
                    )}
                </div>
            </div>
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
