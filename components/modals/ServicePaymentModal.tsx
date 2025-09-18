import React from 'react';
import type { User, ServiceRequest } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon, WalletIcon, CreditCardIcon } from '../icons';

interface ServicePaymentModalProps {
  onClose: () => void;
  onPayWithTiaoCoin: (costInTiaoCoin: number) => void;
  onPayWithCard: (costInBRL: number) => void;
  request: ServiceRequest;
  client: User;
  professional: User;
}

export const ServicePaymentModal: React.FC<ServicePaymentModalProps> = ({ onClose, onPayWithTiaoCoin, onPayWithCard, request, client, professional }) => {
  const serviceCostBRL = request.price || 0;
  const serviceFeeBRL = serviceCostBRL * 0.05; // 5% fee
  const costWithFeeBRL = serviceCostBRL + serviceFeeBRL;

  // As per the business rule, paying with TiãoCoin waives the fee.
  // The cost in TiãoCoin is the service price minus the fee value.
  const costInTiaoCoin = serviceCostBRL - serviceFeeBRL;
  
  const canAffordWithTiaoCoin = (client.walletBalanceTC || 0) >= costInTiaoCoin;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Efetuar Pagamento</h2>
        </div>
        <div className="px-8 pb-8 space-y-4">
            <div className="text-center">
                <p className="font-semibold text-lg text-orange-600">{request.service}</p>
                <p className="text-sm text-gray-500">para {professional.name}</p>
            </div>

            <div className="text-center bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-600">VALOR DO SERVIÇO</p>
                <p className="text-4xl font-extrabold text-gray-800">
                R$ {serviceCostBRL.toFixed(2).replace('.', ',')}
                </p>
            </div>
            
            {/* Option 1: Pay with TiãoCoin */}
            <div className={`p-4 rounded-lg border-2 ${canAffordWithTiaoCoin ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-100'}`}>
                <div className="flex items-center gap-2 mb-2">
                    <WalletIcon className="w-6 h-6 text-green-600"/>
                    <h3 className="font-bold text-lg text-green-800">Pagar com TiãoCoin</h3>
                </div>
                <p className="text-sm text-gray-600">Pague com seu saldo e economize a taxa de serviço!</p>
                <p className="font-bold text-2xl text-center my-3 text-green-700">
                    TC$ {costInTiaoCoin.toFixed(2)}
                </p>
                <p className="text-center text-xs text-gray-500">
                    Seu saldo: TC$ {(client.walletBalanceTC || 0).toFixed(2)}
                </p>
                {!canAffordWithTiaoCoin && <p className="text-red-600 text-xs text-center mt-1">Saldo insuficiente.</p>}
                 <AnimatedButton 
                    onClick={() => onPayWithTiaoCoin(costInTiaoCoin)} 
                    className="w-full mt-3 !bg-green-500 hover:!bg-green-600" 
                    disabled={!canAffordWithTiaoCoin}
                >
                    Pagar {costInTiaoCoin.toFixed(2)} TC$
                </AnimatedButton>
            </div>

             {/* Option 2: Pay with Card/Pix */}
            <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                    <CreditCardIcon className="w-6 h-6 text-gray-600"/>
                    <h3 className="font-bold text-lg text-gray-800">Outros Meios (Simulado)</h3>
                </div>
                <p className="text-sm text-gray-600">Valor + taxa de segurança de 5% (R$ {serviceFeeBRL.toFixed(2)}).</p>
                 <p className="font-bold text-2xl text-center my-3 text-gray-700">
                    R$ {costWithFeeBRL.toFixed(2)}
                </p>
                 <AnimatedButton onClick={() => onPayWithCard(costWithFeeBRL)} className="w-full mt-3">
                    Pagar R$ {costWithFeeBRL.toFixed(2)}
                </AnimatedButton>
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
