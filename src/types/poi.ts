export type POICategory = 
  | 'aldeias de calcário' 
  | 'aldeias do xisto' 
  | 'alojamento' 
  | 'animação turística'
  | 'arqueologia'
  | 'baloiços'
  | 'barragens'
  | 'cascatas' 
  | 'castelos' 
  | 'enoturismo'
  | 'espeleologia' 
  | 'grutas e buracas' 
  | 'miradouros' 
  | 'moinhos de vento' 
  | 'museus' 
  | 'parque de campismo'
  | 'parques temáticos'
  | 'passadiços'
  | 'património mundial'
  | 'percursos e rotas'
  | 'praias fluviais'
  | 'queijarias'
  | 'restaurantes'
  | 'visitar'
  ;

export interface Route {
  id: string;
  subCategory: string;
  url: string;
}

export interface RouteGroup {
  id: string;
  name: string;
  routes: Route[];
}

export interface POI {
  id: string;
  project: string;
  name: string;
  description: string;
  url: string;
  category: POICategory;
  image: string;
  coordinates: [number, number];
  googleMapsUrl?: string;
  hasMoedaId?: boolean;
  routeIds?: string[];
}