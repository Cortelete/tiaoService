import React, { useState, useEffect, useRef } from 'react';
import type { User, ChatMessage } from '../../types';
import { XMarkIcon, PaperAirplaneIcon } from '../icons';

interface ChatModalProps {
  currentUser: User;
  professional: User;
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (text: string) => void;
  isSending: boolean;
}

export const ChatModal: React.FC<ChatModalProps> = ({ currentUser, professional, messages, onClose, onSendMessage, isSending }) => {
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
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-lg h-[85vh] sm:h-auto sm:max-h-[80vh] flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
                <img src={professional.imageUrl || `https://i.pravatar.cc/150?u=${professional.id}`} alt={professional.name} className="w-10 h-10 rounded-full object-cover"/>
                <div>
                    <p className="font-bold text-gray-800">{professional.name}</p>
                    <p className="text-sm text-green-500 font-semibold flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                        Online
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors" aria-label="Fechar chat">
                <XMarkIcon className="w-7 h-7" />
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, index) => {
                const isCurrentUser = msg.senderId === currentUser.id;
                return (
                    <div key={index} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                       {!isCurrentUser && <img src={professional.imageUrl || `https://i.pravatar.cc/150?u=${professional.id}`} alt={professional.name} className="w-6 h-6 rounded-full object-cover self-start"/>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-orange-500 text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 rounded-bl-lg'}`}>
                           <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                );
            })}
             {isSending && (
                 <div className="flex items-end gap-2 justify-start">
                     <img src={professional.imageUrl || `https://i.pravatar.cc/150?u=${professional.id}`} alt={professional.name} className="w-6 h-6 rounded-full object-cover self-start"/>
                     <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-lg">
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
        <form onSubmit={handleFormSubmit} className="p-4 border-t border-gray-200 flex items-center gap-2 flex-shrink-0">
            <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-3 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Digite sua mensagem..."
                disabled={isSending}
            />
            <button type="submit" className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors disabled:bg-orange-300" disabled={isSending || !newMessage.trim()}>
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
