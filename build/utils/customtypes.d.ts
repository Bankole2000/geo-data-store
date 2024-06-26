import { city, country, region, state, subregion } from "../db/schema";
import { EarthRadius } from "../geolocationFxns";
export interface GeoPoint {
    lat: number;
    lng: number;
}
export type DistanceUnit = keyof typeof EarthRadius;
export interface BoundingBox {
    topLeft: GeoPoint;
    bottomRight: GeoPoint;
}
export interface Vector {
    angle: number;
    distance: number;
    unit: DistanceUnit;
    unitInWords?: string;
}
export type BaseFilter = {
    operation?: 'and' | 'or';
    subfilters?: BaseFilter[];
    suboperation?: 'and' | 'or';
};
export type City = typeof city.$inferSelect;
export interface CityQueryOptions {
    filter?: CityFilter;
    sort?: CitySort;
    include?: CityInclude;
}
export type CityFilter = BaseFilter & {
    id?: number;
    name?: string;
    state_id?: number;
    state_code?: string;
    state_name?: string;
    country_id?: number;
    country_code?: string;
    country_name?: string;
    wikiDataId?: string;
    subfilters?: CityFilter[];
};
export interface CityInclude {
    state?: boolean;
    country?: boolean;
}
export interface CitySort {
    field: keyof City;
    direction: 'asc' | 'desc';
}
export type State = typeof state.$inferSelect;
export type StateFilter = BaseFilter & {
    id?: number;
    name?: string;
    country_id?: number;
    country_code?: string;
    country_name?: string;
    state_code?: string;
    type?: string;
    subfilters?: StateFilter[];
};
export interface StateQueryOptions {
    filter?: StateFilter;
    sort?: StateSort;
    include?: StateInclude;
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
export type Country = typeof country.$inferSelect;
export type CountryFilter = BaseFilter & {
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
    subfilters?: CountryFilter[];
};
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
export interface CountryQueryOptions {
    filter?: CountryFilter;
    sort?: CountrySort;
    include?: CountryInclude;
}
export type Region = typeof region.$inferSelect;
export type RegionFilter = BaseFilter & {
    id?: number;
    name?: string;
    wikiDataId?: string;
    subfilters?: RegionFilter[];
};
export interface RegionInclude {
    subregions?: boolean;
    countries?: boolean;
    count?: boolean;
}
export interface RegionSort {
    field: keyof Region;
    direction: 'asc' | 'desc';
}
export interface RegionQueryOptions {
    filter?: RegionFilter;
    sort?: RegionSort;
    include?: RegionInclude;
}
export type Subregion = typeof subregion.$inferSelect;
export type SubregionFilter = BaseFilter & {
    id?: string;
    name?: string;
    wikiDataId?: string;
    region_id?: number;
    operation?: 'and' | 'or';
    subfilters?: SubregionFilter[];
};
export interface SubregionInclude {
    region?: boolean;
    countries?: boolean;
    count?: boolean;
}
export interface SubregionSort {
    field: keyof Subregion;
    direction: 'asc' | 'desc';
}
export interface SubregionQueryOptions {
    filter?: SubregionFilter;
    sort?: SubregionSort;
    include?: SubregionInclude;
}
export type TRegionTranslation = {
    kr?: string;
    "pt-BR"?: string;
    pt?: string;
    nl?: string;
    hr?: string;
    fa?: string;
    de?: string;
    es?: string;
    fr?: string;
    ja?: string;
    it?: string;
    cn?: string;
    tr?: string;
};
export type TTranslation = {
    kr?: string;
    "pt-BR"?: string;
    pt?: string;
    fa?: string;
    de?: string;
    fr?: string;
    it?: string;
    cn?: string;
    tr?: string;
    nl?: string | undefined;
    hr?: string;
    es?: string;
    ja?: string;
};
export type TTimezone = {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
};
