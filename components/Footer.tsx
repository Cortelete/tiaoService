import React from 'react';

interface FooterProps {
  // onOpenCtaModal prop is no longer needed
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center text-center">
          <div>
            <p className="font-semibold">
              Desenvolvido pela Equipe DevOps com apoio de{' '}
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
        </div>
      </div>
    </footer>
  );
};