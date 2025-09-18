
import React from 'react';
// Fix: Corrected the import path for types.
import type { JobPost, User } from '../types';
import { MapPinIcon } from './icons';
import { AnimatedButton } from './AnimatedButton';

interface JobPostCardProps {
  post: JobPost;
  client: User;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `há ${Math.floor(interval)} anos`;
    interval = seconds / 2592000;
    if (interval > 1) return `há ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `há ${Math.floor(interval)} dias`;
    interval = seconds / 3600;
    if (interval > 1) return `há ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `há ${Math.floor(interval)} minutos`;
    return "agora mesmo";
};

export const JobPostCard: React.FC<JobPostCardProps> = ({ post, client }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-start gap-6 transition-all duration-300 hover:shadow-xl hover:border-orange-200 border border-transparent">
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{client.name}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                        <MapPinIcon className="w-4 h-4 mr-1.5" />
                        {client.neighborhood}, {client.city}
                    </div>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{timeAgo(post.createdAt)}</span>
            </div>
            
            <p className="mt-4 text-gray-700 leading-relaxed">
                {post.description}
            </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto">
            <AnimatedButton onClick={() => alert(`Entre em contato com ${client.name} pelo telefone: ${client.phone}`)} className="w-full md:w-auto">
                Ver Contato
            </AnimatedButton>
        </div>
    </div>
  );
};
