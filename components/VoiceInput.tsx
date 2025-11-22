
import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon, StopIcon } from './icons';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, className = '', disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission if inside a form
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Function to analyze text and trigger phone calls if emergency keywords are detected
  const checkEmergencyCommand = (text: string) => {
      const t = text.toLowerCase();
      const actionKeywords = ['ligar', 'chamar', 'telefonar', 'discar', 'contactar'];
      
      // Must contain an action verb to trigger the call, to avoid accidental dials when just describing a story
      const hasAction = actionKeywords.some(k => t.includes(k));
      
      // If no action verb is found, we don't auto-dial, unless it's extremely explicit like just the number
      if (!hasAction) return;

      let numberToCall = '';

      if (t.includes('bombeiro') || t.includes('siate') || t.includes('fogo') || t.includes('incêndio') || t.includes('193')) {
        numberToCall = '193';
      } else if (t.includes('samu') || t.includes('ambulância') || t.includes('ambulancia') || t.includes('médico') || t.includes('192')) {
        numberToCall = '192';
      } else if (t.includes('polícia civil') || t.includes('civil') || t.includes('197')) {
        numberToCall = '197';
      } else if (t.includes('polícia') || t.includes('policia') || t.includes('190') || t.includes('ladrão') || t.includes('assalto')) {
        numberToCall = '190';
      }

      if (numberToCall) {
        console.log(`Comando de voz de emergência detectado. Ligando para ${numberToCall}...`);
        window.open(`tel:${numberToCall}`, '_self');
      }
  };

  const startListening = () => {
    if (!isSupported) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
    }
    
    try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            
            // First, update the UI/Input with the text
            onTranscript(transcript);
            
            // Then, check if we need to auto-dial
            checkEmergencyCommand(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`rounded-full p-2 transition-all duration-300 flex items-center justify-center focus:outline-none ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.7)]' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-orange-500'
      } ${className}`}
      title={isListening ? "Parar de ouvir" : "Falar com a IA"}
    >
      {isListening ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
    </button>
  );
};
