import React, { useState } from 'react';
import type { User, FormField, ServicePeriod, ServiceRequestFormData } from '../../types';
import { serviceRequestFormFields } from '../../constants';
import { AnimatedButton } from '../AnimatedButton';
import { XMarkIcon } from '../icons';

interface ServiceRequestModalProps {
  professional: User;
  service: string;
  onClose: () => void;
  onSubmit: (formData: ServiceRequestFormData) => void;
}

const DynamicFormField: React.FC<{ field: FormField, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }> = ({ field, value, onChange }) => {
    const commonProps = {
        id: field.name,
        name: field.name,
        value: value,
        onChange: onChange,
        className: "w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400",
        placeholder: field.placeholder || ''
    };

    if (field.type === 'select') {
        return (
            <select {...commonProps}>
                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        );
    }
    
    if (field.type === 'textarea') {
        return <textarea {...commonProps} rows={3} />;
    }
    
    return <input type="text" {...commonProps} />;
};


export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ professional, service, onClose, onSubmit }) => {
    const today = new Date().toISOString().split('T')[0];
    const [preferredDate, setPreferredDate] = useState(today);
    const [preferredPeriod, setPreferredPeriod] = useState<ServicePeriod>('Manhã');
    const [description, setDescription] = useState('');
    const dynamicFieldsConfig = serviceRequestFormFields[service] || [];
    const initialDynamicState = Object.fromEntries(dynamicFieldsConfig.map(f => [f.name, f.type === 'select' ? (f.options?.[0] || '') : '']));
    const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<string, string>>(initialDynamicState);
    const [error, setError] = useState('');

    const handleDynamicFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDynamicFieldValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!preferredDate || !description.trim()) {
            setError('Por favor, preencha a data e a descrição do problema.');
            return;
        }

        onSubmit({
            preferredDate,
            preferredPeriod,
            description,
            dynamicFields: dynamicFieldValues
        });
    };
  
    return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" aria-label="Fechar modal">
            <XMarkIcon className="w-8 h-8" />
          </button>
          <h2 className="text-3xl font-extrabold text-center text-gray-800">Solicitar Serviço</h2>
          <p className="text-center text-gray-600 mt-2">
            Preencha os detalhes para <span className="font-bold text-orange-500">{professional.name}</span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center">{error}</p>}
            
            {/* Date and Period */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                 <h3 className="text-lg font-bold text-gray-700 mb-3">Quando você precisa do serviço?</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="preferredDate" className="text-sm font-bold text-gray-600 block mb-1">Data Preferida</label>
                        <input 
                            type="date" 
                            id="preferredDate"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            min={today}
                            className="w-full p-3 text-gray-700 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                     </div>
                     <div>
                        <label className="text-sm font-bold text-gray-600 block mb-1">Período</label>
                        <div className="flex gap-2">
                            {(['Manhã', 'Tarde', 'Noite'] as ServicePeriod[]).map(period => (
                                <button
                                    type="button"
                                    key={period}
                                    onClick={() => setPreferredPeriod(period)}
                                    className={`w-full p-3 text-sm rounded-lg font-bold transition-colors ${preferredPeriod === period ? 'bg-orange-500 text-white' : 'bg-white hover:bg-orange-50 text-gray-700 border border-gray-300'}`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                     </div>
                 </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="text-sm font-bold text-gray-600 block mb-1">Descrição Detalhada do Problema</label>
              <textarea 
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder={`Descreva o que você precisa para o serviço de ${service}...`}
              />
            </div>

            {/* Dynamic Fields */}
            {dynamicFieldsConfig.length > 0 && (
                 <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 space-y-4">
                    <h3 className="text-lg font-bold text-orange-700">Detalhes Específicos para {service}</h3>
                    {dynamicFieldsConfig.map(field => (
                        <div key={field.name}>
                            <label htmlFor={field.name} className="text-sm font-bold text-gray-600 block mb-1">{field.label}</label>
                            <DynamicFormField field={field} value={dynamicFieldValues[field.name]} onChange={handleDynamicFieldChange} />
                        </div>
                    ))}
                 </div>
            )}


            <AnimatedButton onClick={() => {}} className="w-full !py-3 text-lg">
              Enviar Solicitação
            </AnimatedButton>
        </form>
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
