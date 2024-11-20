import { RouteGroup } from '../types/poi';

export const routeColors: Record<string, string> = {
  'wine-routes': '#D946EF', // Vibrant purple for wine routes
  'roman-routes': '#EA580C', // Burnt orange for roman routes
  'medieval-routes': '#854D0E', // Brown for medieval routes
  'nature-routes': '#16A34A'  // Green for nature routes
};

export const routeGroups: RouteGroup[] = [
  {
    id: 'wine-routes',
    name: 'Wine Routes',
    routes: [
      {
        id: 'wine-route-1',
        subCategory: 'Douro Valley Wine Route',
        url: 'https://exploreid.pt/rotas/douro-valley-wine'
      },
      {
        id: 'wine-route-2',
        subCategory: 'Alentejo Wine Route',
        url: 'https://exploreid.pt/rotas/alentejo-wine'
      }
    ]
  }
];