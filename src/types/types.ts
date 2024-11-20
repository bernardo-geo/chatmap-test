export type BaseMap = {
  url: string;
  attribution: string;
};

export type BaseMaps = {
  [key: string]: BaseMap;
};