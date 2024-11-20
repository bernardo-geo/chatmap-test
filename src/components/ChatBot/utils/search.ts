import { pois } from '../../../data/pois';
import { POI, POICategory } from '../../../types/poi';
import { SearchResult } from '../types';

interface LocationQuery {
  category: POICategory;
  location: string;
}

export function parseQuery(query: string): LocationQuery[] {
  const queries: LocationQuery[] = [];
  
  // Common categories and their variations
  const categoryMappings = {
    'restaurante': 'restaurantes' as POICategory,
    'comer': 'restaurantes' as POICategory,
    'museu': 'museus' as POICategory,
    'castelo': 'castelos' as POICategory,
    'praia': 'praias fluviais' as POICategory,
    'aldeia': ['aldeias de calcário', 'aldeias do xisto'] as POICategory[],
    'hiking': 'percursos e rotas' as POICategory,
    'caminhada': 'percursos e rotas' as POICategory,
    'miradouro': 'miradouros' as POICategory,
  };

  // Common locations in the region
  const locations = [
    'coimbra', 'lousã', 'penela', 'miranda do corvo', 'vila nova de poiares',
    'góis', 'arganil', 'oliveira do hospital', 'tábua', 'pampilhosa da serra'
  ];

  const queryLower = query.toLowerCase();

  // Find all location mentions
  locations.forEach(location => {
    if (queryLower.includes(location)) {
      // Find associated categories for this location
      Object.entries(categoryMappings).forEach(([key, value]) => {
        if (queryLower.includes(key)) {
          if (Array.isArray(value)) {
            value.forEach(v => {
              queries.push({ category: v, location });
            });
          } else {
            queries.push({ category: value, location });
          }
        }
      });
    }
  });

  return queries;
}

export async function searchLocalData(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const locationQueries = parseQuery(query);

  // If we have specific location queries, use them
  if (locationQueries.length > 0) {
    locationQueries.forEach(({ category, location }) => {
      const matchingPOIs = pois.filter(poi => 
        poi.category === category &&
        poi.project.toLowerCase().includes(location.toLowerCase())
      );

      matchingPOIs.forEach(poi => {
        results.push({
          type: 'poi',
          name: poi.name,
          category: poi.category,
          description: poi.description,
          location: poi.project,
          url: poi.url,
          coordinates: poi.coordinates,
          image: poi.image
        });
      });
    });
  } else {
    // Fallback to general search if no specific location queries found
    const searchTerms = query.toLowerCase().split(' ');
    
    pois.forEach(poi => {
      const matchesSearch = searchTerms.some(term =>
        poi.name.toLowerCase().includes(term) ||
        poi.description.toLowerCase().includes(term) ||
        poi.category.toLowerCase().includes(term) ||
        poi.project.toLowerCase().includes(term)
      );

      if (matchesSearch) {
        results.push({
          type: 'poi',
          name: poi.name,
          category: poi.category,
          description: poi.description,
          location: poi.project,
          url: poi.url,
          coordinates: poi.coordinates,
          image: poi.image
        });
      }
    });
  }

  return results;
}