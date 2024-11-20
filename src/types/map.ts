export type BaseMap = {
  url: string;
  attribution: string;
};

export type BaseMaps = {
  [key: string]: BaseMap;
};

export const baseMaps: BaseMaps = {
  standard: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&style=feature:poi|visibility:off&style=feature:poi.business|visibility:off&style=feature:administrative|element:labels|visibility:on&style=feature:road|element:labels|visibility:on',
    attribution: '&copy; <a href="https://www.google.com/permissions/geoguidelines/">Google Maps</a>'
  }
};