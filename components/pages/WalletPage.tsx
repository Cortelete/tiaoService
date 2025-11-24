
import React from 'react';
import type { User, Transaction } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { WalletIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, SparklesIcon } from '../icons';

interface WalletPageProps {
  user: User;
  onAddFunds: () => void;
  onWithdraw: () => void;
  onExchange: () => void;
}

const TransactionRow: React.FC<{ tx: Transaction, userId: number }> = ({ tx, userId }) => {
    const isCredit = tx.type === 'deposit' || tx.type === 'payment_received' || tx.type === 'bonus';
    const isExchange = tx.type === 'exchange';
    
    // Logic for amount display
    let amountDisplay = '';
    let amountClass = '';

    if (isExchange) {
        amountClass = 'text-blue-600';
        amountDisplay = '⟲'; // Symbol for exchange
        if (tx.amountTC && tx.amountTC > 0) amountDisplay = `+ TC$ ${tx.amountTC.toFixed(2)}`;
        else if (tx.amountBRL && tx.amountBRL > 0) amountDisplay = `+ R$ ${tx.amountBRL.toFixed(2)}`;
        else amountDisplay = 'Troca';
    } else {
         const sign = isCredit ? '+' : '-';
         const color = isCredit ? 'text-green-600' : 'text-red-600';
         amountClass = color;
         
         if (tx.amountTC && tx.amountTC !== 0) amountDisplay = `${sign} TC$ ${Math.abs(tx.amountTC).toFixed(2)}`;
         else if (tx.amountBRL && tx.amountBRL !== 0) amountDisplay = `${sign} R$ ${Math.abs(tx.amountBRL).toFixed(2)}`;
    }

    const Icon = isExchange ? SparklesIcon : (isCredit ? ArrowUpCircleIcon : ArrowDownCircleIcon);

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${isExchange ? 'text-blue-500' : (isCredit ? 'text-green-600' : 'text-red-600')}`} />
                <div>
                    <p className="font-semibold text-gray-800">{tx.description}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString('pt-BR')}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-bold text-lg ${amountClass}`}>{amountDisplay}</p>
            </div>
        </div>
    );
};


export const WalletPage: React.FC<WalletPageProps> = ({ user, onAddFunds, onWithdraw, onExchange }) => {
  const balanceTC = user.walletBalanceTC || 0;
  const balanceBRL = user.walletBalanceBRL || 0;
  
  return (
    <div className="space-y-6">
        {/* Balance and Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <WalletIcon className="w-8 h-8 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-700">Minha Carteira</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* TiãoCoin Balance */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-100 relative overflow-hidden shadow-sm">
                 <div className="absolute top-0 right-0 p-3"><SparklesIcon className="w-5 h-5 text-orange-400 opacity-50"/></div>
                 <p className="text-xs font-bold text-orange-400 tracking-widest uppercase mb-1">SALDO TIÃOCOIN</p>
                 <p className="text-4xl font-extrabold text-slate-800">
                    <span className="text-orange-500 text-2xl align-top mr-1">TC$</span>{balanceTC.toFixed(2)}
                 </p>
                 <p className="text-xs text-slate-400 mt-2 font-medium">✨ Sem taxas em serviços</p>
              </div>

              {/* BRL Balance */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 relative shadow-sm">
                 <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">SALDO EM REAIS</p>
                 <p className="text-4xl font-extrabold text-slate-800">
                    <span className="text-slate-400 text-2xl align-top mr-1">R$</span>{balanceBRL.toFixed(2)}
                 </p>
                 <p className="text-xs text-slate-400 mt-2 font-medium">⚠️ Sujeito a taxas</p>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AnimatedButton onClick={onAddFunds} className="!bg-green-600 hover:!bg-green-700 shadow-green-500/20">
              Adicionar Saldo
            </AnimatedButton>
            <button 
                onClick={onExchange}
                className="py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
            >
                Converter Moedas
            </button>
            {user.role === 'professional' && (
                <button onClick={onWithdraw} className="py-3.5 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition-all">
                    Sacar
                </button>
            )}
          </div>
        </div>
        
        {/* Transaction History */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Histórico de Transações</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
                {user.transactions && user.transactions.length > 0 ? (
                    [...user.transactions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(tx => (
                        <TransactionRow key={tx.id} tx={tx} userId={user.id} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic py-6">Nenhuma transação encontrada.</p>
                )}
            </div>
        </div>
    </div>
  );
};
