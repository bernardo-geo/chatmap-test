import L from 'leaflet';
import { POICategory } from '../types/poi';
import { categories } from '../config/categories';

export const categoryIcons: Record<POICategory, L.Icon> = Object.fromEntries(
  categories.map(category => [
    category.id,
    new L.Icon({
      iconUrl: category.icon,
      iconSize: [30, 30],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [10, 10]
    })
  ])
) as Record<POICategory, L.Icon>;