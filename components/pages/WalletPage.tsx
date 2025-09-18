import React from 'react';
import type { User, Transaction } from '../../types';
import { AnimatedButton } from '../AnimatedButton';
import { WalletIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '../icons';

interface WalletPageProps {
  user: User;
  onAddFunds: () => void;
  onWithdraw: () => void;
}

const TransactionRow: React.FC<{ tx: Transaction, userId: number }> = ({ tx, userId }) => {
    const isCredit = tx.type === 'deposit' || tx.type === 'payment_received' || tx.type === 'bonus';
    const sign = isCredit ? '+' : '-';
    const color = isCredit ? 'text-green-600' : 'text-red-600';
    const Icon = isCredit ? ArrowUpCircleIcon : ArrowDownCircleIcon;

    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center gap-3">
                <Icon className={`w-8 h-8 ${color}`} />
                <div>
                    <p className="font-semibold text-gray-800">{tx.description}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString('pt-BR')}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`font-bold text-lg ${color}`}>{sign} TC$ {tx.amountTC.toFixed(2)}</p>
                {tx.brlAmount && (
                    <p className="text-xs text-gray-500">R$ {tx.brlAmount.toFixed(2)}</p>
                )}
            </div>
        </div>
    );
};


export const WalletPage: React.FC<WalletPageProps> = ({ user, onAddFunds, onWithdraw }) => {
  const TC_TO_BRL_RATE = 1.0; // Assuming 1 TC = 1 BRL for display

  return (
    <div className="space-y-6">
        {/* Balance and Actions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <WalletIcon className="w-8 h-8 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-700">Minha Carteira TiãoCoin</h2>
          </div>
          <div className="my-6 text-center bg-gray-100 p-6 rounded-lg">
            <p className="text-sm font-semibold text-gray-600">SALDO ATUAL (TC$)</p>
            <p className="text-4xl font-extrabold text-gray-800">
              {(user.walletBalanceTC || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
                ≈ R$ {((user.walletBalanceTC || 0) * TC_TO_BRL_RATE).toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatedButton onClick={onAddFunds} className="!bg-green-500 hover:!bg-green-600">
              Adicionar Saldo
            </AnimatedButton>
            {user.role === 'professional' && (
                <AnimatedButton onClick={onWithdraw} className="!bg-blue-500 hover:!bg-blue-600">
                    Sacar
                </AnimatedButton>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Histórico de Transações</h3>
            <div className="space-y-2">
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
