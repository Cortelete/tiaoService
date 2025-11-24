
import React from 'react';

interface FooterProps {
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-slate-900 text-white mt-12 border-t border-slate-800 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="flex flex-col justify-center items-center text-center">
          <div>
            <div className="flex items-center justify-center gap-3 mb-6">
                 <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl shadow-lg shadow-orange-500/20">
                    <span className="text-2xl">✨</span>
                 </div>
                <span className="text-3xl font-extrabold tracking-tight">Tião<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">Service</span></span>
            </div>
            
            <p className="font-medium text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              A plataforma definitiva para conectar você aos melhores profissionais do mercado, com segurança, agilidade e elegância.
            </p>

            <div className="flex gap-4 justify-center mb-8">
                 {/* Social placeholders or links could go here */}
            </div>
            
            <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mx-auto mb-8"></div>

            <p className="font-medium text-slate-500 text-sm">
              Desenvolvido com 🧡 pela Equipe DevOps com apoio de{' '}
              <a 
                href="https://www.instagram.com/inteligenciarte.ia" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold text-white hover:text-orange-400 transition-colors"
              >
                InteligenciArte.IA
              </a>
            </p>
            <p className="text-xs text-slate-600 mt-4">© {new Date().getFullYear()} TiãoService. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
