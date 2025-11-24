
import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, XMarkIcon, ChevronRightIcon } from './icons';
import { AnimatedButton } from './AnimatedButton';

export interface TourStep {
  targetId?: string; // ID of the DOM element to highlight. If undefined, shows centered modal.
  title: string;
  content: string;
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ steps, onComplete, onSkip }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const currentStep = steps[currentStepIndex];

  // Mobile detection listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate position of the target element
  useEffect(() => {
    const updatePosition = () => {
      if (currentStep.targetId) {
        const element = document.getElementById(currentStep.targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTargetRect(element.getBoundingClientRect());
          return;
        }
      }
      setTargetRect(null); // Center mode if no target or target not found
    };

    // Small delay to ensure DOM is ready and transitions finished
    const timer = setTimeout(updatePosition, 500);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStepIndex, currentStep.targetId]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* SVG Overlay/Mask for Spotlight Effect */}
      {targetRect ? (
        <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 ease-in-out">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect 
                x={targetRect.x - 10} 
                y={targetRect.y - 10} 
                width={targetRect.width + 20} 
                height={targetRect.height + 20} 
                rx="12" 
                fill="black" 
              />
            </mask>
          </defs>
          <rect 
            x="0" 
            y="0" 
            width="100%" 
            height="100%" 
            fill="rgba(0,0,0,0.7)" 
            mask="url(#spotlight-mask)" 
          />
          {/* Animated border around target */}
          <rect 
             x={targetRect.x - 10} 
             y={targetRect.y - 10} 
             width={targetRect.width + 20} 
             height={targetRect.height + 20} 
             rx="12"
             fill="none"
             stroke="orange"
             strokeWidth="2"
             className="animate-pulse"
          />
        </svg>
      ) : (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500"></div>
      )}

      {/* Mia's Dialogue Box */}
      <div 
        className={`absolute transition-all duration-500 ease-out flex flex-col items-center justify-center
          ${(!targetRect || isMobile) ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}
        `}
        style={(!isMobile && targetRect) ? {
           top: targetRect.bottom + 20 + 250 > window.innerHeight ? 'auto' : targetRect.bottom + 30,
           bottom: targetRect.bottom + 20 + 250 > window.innerHeight ? window.innerHeight - targetRect.top + 30 : 'auto',
           left: Math.min(Math.max(20, targetRect.left + targetRect.width / 2 - 200), window.innerWidth - 420), // Keep roughly centered but within bounds
        } : {}}
      >
        <div className="w-[90vw] max-w-md bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
           {/* Header with Mia Icon */}
           <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-1">
             <div className="bg-white/95 p-4 rounded-t-[1.3rem] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                        <SparklesIcon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-800">Mia</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Guia TiãoService</p>
                    </div>
                </div>
                <button onClick={onSkip} className="text-slate-400 hover:text-slate-600 text-sm font-semibold">
                    Pular
                </button>
             </div>
           </div>

           {/* Content */}
           <div className="p-6 pt-4">
              <h2 className="text-xl font-bold text-slate-800 mb-2">{currentStep.title}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {currentStep.content}
              </p>

              {/* Progress and Buttons */}
              <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                      {steps.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStepIndex ? 'w-6 bg-orange-500' : 'w-1.5 bg-slate-200'}`}
                          ></div>
                      ))}
                  </div>
                  
                  <AnimatedButton onClick={handleNext} className="!px-6 !py-2.5 !text-sm flex items-center gap-2">
                      {isLastStep ? 'Começar!' : 'Próximo'}
                      {!isLastStep && <ChevronRightIcon className="w-4 h-4" />}
                  </AnimatedButton>
              </div>
           </div>
        </div>
      </div>
      
       <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
    </div>
  );
};
