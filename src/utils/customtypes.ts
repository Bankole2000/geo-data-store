export interface GeoPoint {
  lat: number;
  lng: number;
}

// #region - city interfaces
export interface City {
  id: number;
  name: string;
  state_id: number;
  state_code: string;
  state_name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  wikiDataId: string | null;
}

export interface CityFilter {
  id?: number;
  name?: string;
  state_id?: number;
  state_code?: string;
  state_name?: string;
  country_id?: number;
  country_code?: string;
  country_name?: string;
  wikiDataId?: string;
  operation?: 'and' | 'or'
}

export interface CityInclude {
  state?: boolean;
  country?: boolean;
}

export interface CitySort {
  field: keyof City;
  direction: 'asc' | 'desc';
}
// #endregion - city interfaces

//#region - state interfaces
export interface State {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string | null;
  latitude: number;
  longitude: number;
}

export interface StateFilter {
  id?: number;
  name?: string;
  country_id?: number;
  country_code?: string;
  country_name?: string;
  state_code?: string;
  type?: string;
  operation?: 'and' | 'or'
}

export interface StateInclude {
  cities?: boolean;
  country?: boolean;
  count?: boolean;
}

export interface StateSort {
  field: keyof State;
  direction: 'asc' | 'desc';
}
//#endregion

//#region - country interfaces
export interface Country {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region_id: number;
  subregion_id: number;
  nationality: string;
  timezones: Array<TTimezone> | null;
  translations: TTranslation | null;
  latitude: number;
  longitude: number;
  emoji: string;
  emojiU: string;
}

export interface CountryFilter {
  id?: number;
  name?: string;
  iso3?: string;
  iso2?: string;
  numeric_code?: string;
  phone_code?: string;
  capital?: string;
  currency?: string;
  currency_name?: string;
  currency_symbol?: string;
  tld?: string;
  native?: string;
  region_id?: number;
  subregion_id?: number;
  nationality?: string;
  latitude?: number;
  longitude?: number;
  operation?: 'and' | 'or';
}

export interface CountrySort {
  field: keyof Country;
  direction: 'asc' | 'desc';
}

export interface CountryInclude {
  region?: boolean;
  subregion?: boolean;
  states?: boolean;
  cities?: boolean;
  count?: boolean;
}
//#endregion

//#region - region interfaces
export interface RegionFilter {
  name?: string;
  wikiDataId?: string;
  operation?: 'and' | 'or'
}

export interface RegionInclude {
  subregions?: boolean;
  countries?: boolean;
  count?: boolean;
}

export interface RegionSort {
  field: keyof Region;
  direction: 'asc' | 'desc';
}
//#endregion

//#region - subregion interfaces
export interface Subregion {
  id: number;
  name: string;
  translations: unknown;
  region_id: number;
  wikiDataId: string | null;
}

export interface SubregionFilter {
  id?: string;
  name?: string;
  wikiDataId?: string;
  region_id?: number;
  operation?: 'and' | 'or'
}

export interface SubregionInclude {
  region?: boolean;
  countries?: boolean;
  count?: boolean;
}

export interface SubregionSort {
  field: keyof Subregion;
  direction: 'asc' | 'desc';
}
//#endregion

export type TRegionTranslation = {
  kr?: string,
  "pt-BR"?: string,
  pt?: string,
  nl?: string,
  hr?: string,
  fa?: string,
  de?: string,
  es?: string,
  fr?: string,
  ja?: string,
  it?: string,
  cn?: string,
  tr?: string
}

export interface Region {
  id: number;
  name: string;
  translations: unknown;
  wikiDataId: string | null;
}

export type TTranslation = { kr?: string; "pt-BR"?: string; pt?: string; fa?: string; de?: string; fr?: string; it?: string; cn?: string; tr?: string; nl?: string | undefined; hr?: string; es?: string; ja?: string; }

export type TTimezone = {
  zoneName: string,
  gmtOffset: number,
  gmtOffsetName: string,
  abbreviation: string,
  tzName: string
}
