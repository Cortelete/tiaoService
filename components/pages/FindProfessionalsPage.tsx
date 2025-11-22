
import React, { useMemo, useState, useEffect } from 'react';
import type { User } from '../../types';
import { ProfessionalCard } from '../ProfessionalCard';
import { BackButton } from '../BackButton';
import { MapPinIcon } from '../icons';

interface FindProfessionalsPageProps {
  category: string;
  onViewProfessional: (professional: User) => void;
  professionals: User[];
  currentUser: User | null;
  onBack: () => void;
}

// Helper function to calculate distance in km (Haversine formula)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

export const FindProfessionalsPage: React.FC<FindProfessionalsPageProps> = ({ category, onViewProfessional, professionals, currentUser, onBack }) => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error getting location: ", error);
          setLocationError("Não foi possível obter sua localização para ordenar por proximidade.");
        }
      );
    }
  }, []);

  const filteredProfessionals = useMemo(() => {
    let categoryFiltered = professionals.filter(p => p.services?.includes(category));
    
    // Calculate distance if user location is available
    let professionalsWithDistance = categoryFiltered.map(p => {
        if (userLocation && p.latitude && p.longitude) {
            return {
                ...p,
                distance: getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude)
            };
        }
        return p;
    });

    // Sort Logic
    if (userLocation) {
        // Sort by distance if available
        professionalsWithDistance.sort((a: any, b: any) => {
            if (a.distance !== undefined && b.distance !== undefined) {
                return a.distance - b.distance;
            }
            return 0;
        });
    } else if (currentUser) {
        // Fallback: Sort by region if user is logged in but no geo
        const localProfessionals = professionalsWithDistance.filter(p => p.regionId === currentUser.regionId);
        const otherProfessionals = professionalsWithDistance.filter(p => p.regionId !== currentUser.regionId);
        professionalsWithDistance = [...localProfessionals, ...otherProfessionals];
    }

    return professionalsWithDistance;
  }, [category, professionals, currentUser, userLocation]);

  const localCount = currentUser ? filteredProfessionals.filter(p => p.regionId === currentUser.regionId).length : 0;

  return (
    <div>
      <BackButton onClick={onBack} />
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
        Profissionais de <span className="text-orange-500">{category}</span>
      </h1>
      
      <div className="text-center mb-8">
        {userLocation ? (
            <p className="text-green-600 flex items-center justify-center gap-2">
                <MapPinIcon className="w-5 h-5"/>
                Ordenando por profissionais mais próximos de você
            </p>
        ) : (
            currentUser && localCount > 0 ? (
                 <p className="text-gray-600">
                    Encontramos <span className="font-bold">{localCount}</span> profissional(is) na sua região cadastrada!
                </p>
            ) : (
                 <p className="text-gray-600">Encontramos os melhores para você!</p>
            )
        )}
      </div>
      
      {filteredProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfessionals.map(prof => (
            <ProfessionalCard 
              key={prof.id} 
              professional={prof}
              distance={(prof as any).distance} // Pass the calculated distance
              onViewDetails={() => onViewProfessional(prof)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700">Nenhum profissional encontrado</h3>
            <p className="mt-2 text-gray-500">
              Ainda não temos profissionais de <span className="font-semibold">{category}</span> nesta região. Tente outra categoria ou volte mais tarde!
            </p>
        </div>
      )}
    </div>
  );
};