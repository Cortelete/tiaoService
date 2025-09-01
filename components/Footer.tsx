import React from 'react';

interface FooterProps {
  onOpenCtaModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCtaModal }) => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
          <div className="order-2 md:order-1">
            <p className="font-semibold">
              Desenvolvido por{' '}
              <a 
                href="https://www.instagram.com/inteligenciarte.ia" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500 hover:opacity-80 transition-opacity"
              >
                InteligenciArte.IA ✨
              </a>
            </p>
            <p className="text-sm text-gray-400 mt-1">© {new Date().getFullYear()} TiãoService. Todos os direitos reservados.</p>
          </div>
          <div className="order-1 md:order-2">
            <button
              onClick={onOpenCtaModal}
              className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg animated-gradient bg-gradient-to-r from-orange-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-50"
            >
              Quer um site incrível como esse? Fale comigo! 🚀
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
