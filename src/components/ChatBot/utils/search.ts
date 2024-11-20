import { pois } from '../../../data/pois';
import { POI, POICategory } from '../../../types/poi';
import { SearchResult } from '../types';
import { calculateDistance, getUserLocation } from './location';

// Define common query patterns and their corresponding categories
const categoryMappings: Record<string, POICategory | POICategory[]> = {
  'praia': 'praias fluviais',
  'praias': 'praias fluviais',
  'fluvial': 'praias fluviais',
  'restaurante': 'restaurantes',
  'comer': 'restaurantes',
  'gastronomia': 'restaurantes',
  'museu': 'museus',
  'castelo': 'castelos',
  'fortaleza': 'castelos',
  'aldeia': ['aldeias de calcário', 'aldeias do xisto'],
  'xisto': 'aldeias do xisto',
  'calcário': 'aldeias de calcário',
  'hiking': 'percursos e rotas',
  'caminhada': 'percursos e rotas',
  'trilho': 'percursos e rotas',
  'percurso': 'percursos e rotas',
  'miradouro': 'miradouros',
  'vista': 'miradouros',
  'paisagem': 'miradouros',
  'alojamento': 'alojamento',
  'dormir': 'alojamento',
  'hotel': 'alojamento',
  'camping': 'parque de campismo',
  'campismo': 'parque de campismo',
  'vinho': 'enoturismo',
  'adega': 'enoturismo',
  'queijo': 'queijarias',
  'gruta': 'grutas e buracas',
  'caverna': 'grutas e buracas',
  'buraca': 'grutas e buracas',
  'cascata': 'cascatas',
  'queda': 'cascatas',
  'waterfall': 'cascatas'
};

// Define common locations in the region
const locations = [
  'coimbra',
  'lousã',
  'penela',
  'miranda do corvo',
  'vila nova de poiares',
  'góis',
  'arganil',
  'oliveira do hospital',
  'tábua',
  'pampilhosa da serra',
  'condeixa',
  'soure',
  'figueira da foz',
  'montemor',
  'cantanhede'
];

// Number words mapping
const numberWords: Record<string, number> = {
  'um': 1, 'uma': 1,
  'dois': 2, 'duas': 2,
  'três': 3, 'tres': 3,
  'quatro': 4,
  'cinco': 5,
  'seis': 6,
  'sete': 7,
  'oito': 8,
  'nove': 9,
  'dez': 10
};

interface QueryPart {
  category?: POICategory;
  location?: string;
  keywords: string[];
  quantity?: number;
  nearby?: boolean;
  originalText: string;
}

function extractQuantity(text: string): number | undefined {
  // Check for numeric digits
  const numericMatch = text.match(/\d+/);
  if (numericMatch) {
    return parseInt(numericMatch[0], 10);
  }

  // Check for number words
  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (numberWords[word]) {
      return numberWords[word];
    }
  }

  return undefined;
}

function isNearbyQuery(text: string): boolean {
  const nearbyKeywords = [
    'perto', 'próximo', 'próxima', 'próximas', 'próximos', 
    'cerca', 'nearby', 'near', 'me', 'mim'
  ];
  return nearbyKeywords.some(keyword => text.toLowerCase().includes(keyword));
}

function parseQueryParts(query: string): QueryPart[] {
  const queryLower = query.toLowerCase();
  const parts: QueryPart[] = [];
  
  // Split query into parts based on conjunctions and punctuation
  const querySegments = queryLower
    .split(/(?:,|\se\s|depois|então|seguida|também|\.|;)+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const segment of querySegments) {
    const part: QueryPart = {
      keywords: [],
      quantity: extractQuantity(segment),
      nearby: isNearbyQuery(segment),
      originalText: segment
    };
    
    // Check for locations
    for (const location of locations) {
      if (segment.includes(location)) {
        part.location = location;
        break;
      }
    }

    // Check for categories
    let foundCategory = false;
    for (const [keyword, category] of Object.entries(categoryMappings)) {
      if (segment.includes(keyword)) {
        if (Array.isArray(category)) {
          // For categories like 'aldeia' that map to multiple types,
          // create a separate query part for each type
          category.forEach(cat => {
            parts.push({
              ...part,
              category: cat,
              quantity: part.quantity // Maintain the same quantity for each type
            });
          });
          foundCategory = true;
        } else {
          part.category = category;
          foundCategory = true;
        }
        break;
      }
    }

    if (!foundCategory) {
      // Collect remaining keywords for general search
      part.keywords = segment
        .split(' ')
        .filter(word => 
          word.length > 3 && 
          !locations.includes(word) && 
          !Object.keys(numberWords).includes(word)
        );
      parts.push(part);
    } else if (!Array.isArray(categoryMappings[part.category as string])) {
      // Only add the part if it wasn't already added in the array case
      parts.push(part);
    }
  }

  return parts;
}

async function findMatchingPOIs(queryPart: QueryPart): Promise<SearchResult[]> {
  let results = pois
    .filter(poi => {
      const matchesCategory = !queryPart.category || poi.category === queryPart.category;
      const matchesLocation = !queryPart.location || 
        poi.project.toLowerCase().includes(queryPart.location);
      const matchesKeywords = queryPart.keywords.length === 0 || 
        queryPart.keywords.some(keyword =>
          poi.name.toLowerCase().includes(keyword) ||
          poi.description.toLowerCase().includes(keyword)
        );

      return matchesCategory && matchesLocation && matchesKeywords;
    })
    .map(poi => ({
      type: 'poi' as const,
      name: poi.name,
      category: poi.category,
      description: poi.description,
      location: poi.project,
      url: poi.url,
      coordinates: poi.coordinates,
      image: poi.image,
      distance: undefined as number | undefined,
      queryContext: queryPart.originalText // Store the original query context
    }));

  // Handle nearby search
  if (queryPart.nearby) {
    try {
      const userLocation = await getUserLocation();
      
      // Calculate distances and add to results
      results = results.map(result => ({
        ...result,
        distance: calculateDistance(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          result.coordinates[0],
          result.coordinates[1]
        )
      }));

      // Sort by distance
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } catch (error) {
      console.error('Error getting user location:', error);
      // Continue without distance sorting if geolocation fails
    }
  }

  // Apply quantity limit if specified
  if (queryPart.quantity && queryPart.quantity > 0) {
    return results.slice(0, queryPart.quantity);
  }

  // Default limit to prevent overwhelming responses
  return results.slice(0, 5);
}

export async function searchLocalData(query: string): Promise<SearchResult[]> {
  const queryParts = parseQueryParts(query);
  const results: SearchResult[] = [];
  
  // Process each query part independently
  for (const part of queryParts) {
    const partResults = await findMatchingPOIs(part);
    results.push(...partResults);
  }

  // Remove duplicates while preserving distance information and query context
  return Array.from(
    new Map(
      results.map(item => [item.name, item])
    ).values()
  );
}