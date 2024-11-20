import { type FC } from 'react';
import { ExternalLink, MapPin, Building2 } from 'lucide-react';
import { type POI } from '../types/poi';
import { routeGroups, routeColors } from '../data/routes';

interface POIPopupProps {
  poi: POI;
  iconUrl: string;
}

const formatCategoryName = (category: string): string => {
  const articles = ['De', 'Do', 'da', 'dos', 'das', 'e', 'os', 'as'];
  return category
    .split(' ')
    .map((word, index) => {
      const lowerWord = word.toLowerCase();
      // Keep articles and prepositions in lowercase unless they're the first word
      return index === 1 || !articles.includes(lowerWord)
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : lowerWord;
    })
    .join(' ');
};

const POIPopup: FC<POIPopupProps> = ({ poi, iconUrl }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${poi.coordinates[0]},${poi.coordinates[1]}`;

  const routeInfo = poi.routeIds?.map(routeId => {
    const group = routeGroups.find(g => g.routes.some(r => r.id === routeId));
    const route = group?.routes.find(r => r.id === routeId);
    return {
      groupId: group?.id || '',
      groupName: group?.name || '',
      routeName: route?.subCategory || '',
      color: group ? routeColors[group.id] : '',
      url: route?.url || ''
    };
  });
  
  return (
    <div className="w-[260px] sm:w-[300px] overflow-hidden">
      <img
        src={poi.image}
        alt={poi.name}
        className="w-full h-50 object-contain" /*full h-40 object-cover*/
      />
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <img 
            src={iconUrl}
            alt={poi.category}
            className="w-5 h-5 object-contain"
          />
          <span className="text-xs font-medium capitalize text-blue-600">
            {formatCategoryName(poi.category)}
          </span>
        </div>
        <h3 className="font-bold text-base sm:text-lg mb-1.5 text-gray-900">
          {poi.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-2">
          <Building2 size={14} className="text-gray-400" />
          <span className="text-xs font-medium text-gray-500">
            {poi.project}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mb-3">
          {poi.description}
        </p>
        
        {routeInfo && routeInfo.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Rota:</h4>
            <div className="space-y-2">
              {routeInfo.map((info, index) => (
                <div 
                  key={index}
                  className="flex flex-col gap-1.5 p-2 rounded-lg bg-gray-50 ring-1 ring-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: info.color }}
                    />
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-800">{info.groupName}</div>
                      <div className="text-xs text-gray-600">{info.routeName}</div>
                    </div>
                  </div>
                  <a
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1.5"
                  >
                    Vê detalhes da rota
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <a
            href={poi.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 
              hover:text-blue-800 transition-colors bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100"
          >
            Sabe mais
            <ExternalLink size={14} />
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-green-600 
              hover:text-green-800 transition-colors bg-green-50 px-3 py-2 rounded-lg hover:bg-green-100"
          >
            Direções no Google Maps
            <MapPin size={14} />
          </a>
          {poi.hasMoedaId && (
            <a
              href="https://exploreid.pt/moeda-id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs font-medium text-amber-600 
                hover:text-amber-800 transition-colors bg-amber-50 px-3 py-2 rounded-lg hover:bg-amber-100 
                ring-1 ring-amber-200"
            >
              <img src="/icons/ID.png" alt="Moeda ID" className="w-6 h-6" />
              Utiliza aqui a Moeda ID e obtém 10% de desconto
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default POIPopup;