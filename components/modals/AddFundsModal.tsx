import React from 'react';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon } from '../icons';

interface AddFundsModalProps {
  onClose: () => void;
  onAddFunds: (amountBRL: number, bonusTC: number) => void;
}

const fundPackages = [
    { brl: 50, tc: 52, bonus: 2, popular: false },
    { brl: 100, tc: 105, bonus: 5, popular: true },
    { brl: 200, tc: 215, bonus: 15, popular: false },
];

export const AddFundsModal: React.FC<AddFundsModalProps> = ({ onClose, onAddFunds }) => {

  const handleAdd = (brl: number, bonus: number) => {
    onAddFunds(brl, bonus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Adicionar Saldo</h2>
           <p className="text-center text-gray-600 mt-2">
            Compre TiãoCoins (TC$) para pagar por serviços com desconto!
          </p>
        </div>
        <div className="px-8 pb-8 space-y-4">
            {fundPackages.map(pkg => (
                 <button 
                    key={pkg.brl}
                    onClick={() => handleAdd(pkg.brl, pkg.bonus)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all relative"
                >
                    {pkg.popular && <div className="absolute top-0 right-4 -mt-3 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">POPULAR</div>}
                    <p className="font-bold text-gray-800 text-lg">Pague R$ {pkg.brl.toFixed(2)}</p>
                    <p className="text-green-600 font-semibold">Receba TC$ {pkg.tc.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">+ TC$ {pkg.bonus.toFixed(2)} de bônus!</p>
                </button>
            ))}
             <p className="text-center text-xs text-gray-500 pt-4">
                Ao clicar, o valor será adicionado à sua carteira (simulação).
            </p>
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
