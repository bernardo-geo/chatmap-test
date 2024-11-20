import { POICategory } from '../types/poi';

export interface CategoryConfig {
  id: POICategory;
  name: string;
  description: string;
  icon: string;
  group: 'ponto-interesse' | 'embaixador';
}

export const categories: CategoryConfig[] = [
  {
    id: 'aldeias de calcário',
    name: 'Aldeias de Calcário',
    description: 'Aldeia de calcário',
    icon: '/icons/icone-aldeias-de-calcário.png',
    group: 'ponto-interesse'
  },
  {
    id: 'aldeias do xisto',
    name: 'Aldeias do Xisto',
    description: 'Medieval castles and fortifications',
    icon: '/icons/icone-aldeias-do-xisto.png',
    group: 'ponto-interesse'
  },
  {
    id: 'alojamento',
    name: 'Alojamento',
    description: 'Alojamentos',
    icon: '/icons/AL.png',
    group: 'embaixador'
  },
  {
    id: 'animação turística',
    name: 'Animação Turística',
    description: 'Animação Turística',
    icon: '/icons/Animação túristica.png',
    group: 'embaixador'
  },
  {
    id: 'arqueologia',
    name: 'Arqueologia',
    description: 'Arqueologia',
    icon: '/icons/icone-arqueologia.png',
    group: 'ponto-interesse'
  },
  {
    id: 'baloiços',
    name: 'Baloiços',
    description: 'Baloiços',
    icon: '/icons/icone-baloiços.png',
    group: 'ponto-interesse'
  },
  {
    id: 'barragens',
    name: 'Barragens',
    description: 'Barragens',
    icon: '/icons/icone-barragens.png',
    group: 'ponto-interesse'
  },
  {
    id: 'cascatas',
    name: 'Cascatas',
    description: 'Cascatas',
    icon: '/icons/icone-cascatas.png',
    group: 'ponto-interesse'
  },
  {
    id: 'castelos',
    name: 'Castelos',
    description: 'Castelos',
    icon: '/icons/icone-castelos.png',
    group: 'ponto-interesse'
  },
  {
    id: 'enoturismo',
    name: 'Enoturismo',
    description: 'Enoturismo',
    icon: '/icons/Enoturismo.png',
    group: 'embaixador'
  },
  {
    id: 'espeleologia',
    name: 'Espeleologia',
    description: 'Espeleologia',
    icon: '/icons/Espeleologia.png',
    group: 'embaixador'
  },
  {
    id: 'grutas e buracas',
    name: 'Grutas e Buracas',
    description: 'Grutas e Buracas',
    icon: '/icons/icone-grutas.png',
    group: 'ponto-interesse'
  },
  {
    id: 'miradouros',
    name: 'Miradouros',
    description: 'Miradouros',
    icon: '/icons/icone-miradouros.png',
    group: 'ponto-interesse'
  },
  {
    id: 'moinhos de vento',
    name: 'Moinhos de Vento',
    description: 'Moinhos de Vento',
    icon: '/icons/icone-moinhos.png',
    group: 'ponto-interesse'
  },
  {
    id: 'museus',
    name: 'Museus',
    description: 'Museus',
    icon: '/icons/museus.png',
    group: 'ponto-interesse'
  },
  {
    id: 'parque de campismo',
    name: 'Parque de Campismo',
    description: 'Parque de Campismo',
    icon: '/icons/Parques de Campismo.png',
    group: 'ponto-interesse'
  },
  {
    id: 'parques temáticos',
    name: 'Parques Temáticos',
    description: 'Parques Temáticos',
    icon: '/icons/icone-parques.png',
    group: 'ponto-interesse'
  },
  {
    id: 'passadiços',
    name: 'Passadiços',
    description: 'Passadiços',
    icon: '/icons/icone-passadiços.png',
    group: 'ponto-interesse'
  },
  {
    id: 'património mundial',
    name: 'Património Mundial',
    description: 'Património Mundial',
    icon: '/icons/icone-unesco.png',
    group: 'ponto-interesse'
  },
  {
    id: 'percursos e rotas',
    name: 'Percursos e Rotas',
    description: 'Percursos e Rotas',
    icon: '/icons/icone-percursos-pedestres.png',
    group: 'ponto-interesse'
  },
  {
    id: 'praias fluviais',
    name: 'Praias Fluviais',
    description: 'Praias Fluviais',
    icon: '/icons/icone-praias-fluviais.png',
    group: 'ponto-interesse'
  },
  {
    id: 'queijarias',
    name: 'Queijarias',
    description: 'Queijarias',
    icon: '/icons/Queijarias.png',
    group: 'embaixador'
  },
  {
    id: 'restaurantes',
    name: 'Restaurantes',
    description: 'Restaurantes',
    icon: '/icons/restaurantes.png',
    group: 'embaixador'
  },
  {
    id: 'visitar',
    name: 'Visitar',
    description: 'Visitar',
    icon: '/icons/Observar.png',
    group: 'embaixador'
  }
];