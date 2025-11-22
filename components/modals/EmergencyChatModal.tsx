
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import { XMarkIcon, PaperAirplaneIcon, ShieldExclamationIcon } from '../icons';
import { VoiceInput } from '../VoiceInput';

interface EmergencyChatModalProps {
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (text: string) => void;
  isSending: boolean;
}

export const EmergencyChatModal: React.FC<EmergencyChatModalProps> = ({ messages, onClose, onSendMessage, isSending }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isSending) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col animate-fade-in-up border-4 border-red-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-red-600 text-white flex justify-between items-center flex-shrink-0 rounded-t-lg sm:rounded-t-xl">
            <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                     <ShieldExclamationIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <p className="font-bold text-lg">Assistente de Emergência</p>
                    <p className="text-xs opacity-90">Acompanhando seu caso</p>
                </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-red-700 rounded-full p-1 transition-colors" aria-label="Fechar chat">
                <XMarkIcon className="w-7 h-7" />
            </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-red-50 p-3 grid grid-cols-3 gap-2 border-b border-red-100">
             <a href="tel:193" className="bg-white border border-red-200 text-red-700 font-bold py-2 rounded text-center text-sm hover:bg-red-100">
                🔥 193<br/>Bombeiros
             </a>
             <a href="tel:192" className="bg-white border border-red-200 text-red-700 font-bold py-2 rounded text-center text-sm hover:bg-red-100">
                🚑 192<br/>SAMU
             </a>
             <a href="tel:190" className="bg-white border border-red-200 text-red-700 font-bold py-2 rounded text-center text-sm hover:bg-red-100">
                🚓 190<br/>Polícia
             </a>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, index) => {
                const isUser = msg.senderId !== -1; // -1 is Mia (AI) in this context
                return (
                    <div key={index} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                       {!isUser && (
                           <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                               MIA
                           </div>
                       )}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-lg shadow-sm'}`}>
                           <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                );
            })}
             {isSending && (
                 <div className="flex items-end gap-2 justify-start">
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                           MIA
                       </div>
                     <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white border border-gray-200 text-gray-800 rounded-bl-lg shadow-sm">
                         <div className="flex items-center gap-1">
                             <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                             <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                             <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                         </div>
                     </div>
                 </div>
             )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleFormSubmit} className="p-4 border-t border-gray-200 flex items-center gap-2 flex-shrink-0 bg-white rounded-b-xl">
            <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-3 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                placeholder="Digite aqui..."
                disabled={isSending}
            />
            <VoiceInput 
                onTranscript={(text) => setNewMessage(prev => prev + (prev ? ' ' : '') + text)} 
                disabled={isSending}
                className="!bg-red-100 !text-red-600 hover:!bg-red-200"
            />
            <button type="submit" className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors disabled:bg-red-300" disabled={isSending || !newMessage.trim()}>
                <PaperAirplaneIcon className="w-6 h-6"/>
            </button>
        </form>
      </div>
      <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @media (min-width: 640px) {
            @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(20px) scale(0.95); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
