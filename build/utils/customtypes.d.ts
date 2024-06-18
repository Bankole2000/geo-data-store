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
export type TCountry = {
    id: number | string;
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
    native: string | null;
    region: string;
    region_id: string | null;
    subregion: string;
    subregion_id: string | null;
    nationality: string;
    timezones?: Array<TTimezone> | null;
    translations: TTranslaction;
    latitude: string;
    longitude: string;
    emoji: string;
    emojiU: string;
};
export type TRegion = {
    id: number;
    name: string;
    translations: TRegionTranslation;
    wikiDataId: string;
};
export type TSubregion = {
    id: number;
    name: string;
    region_id: number;
    translations: TSubregionTranslation;
    wikiDataId: string;
};
export type TCountryWithIncludes = TCountry & {
    regionData?: TRegion;
    subregionData?: TSubregion;
};
export type TState = {
    id: number;
    name: string;
    country_id: number;
    country_code: string;
    country_name: string;
    state_code: string;
    type: string;
    latitude: number;
    longitude: number;
};
export type TStateWithIncludes = TState & {
    country?: TCountryWithIncludes;
};
export type TSubregionTranslation = {
    korean: string;
    portuguese: string;
    dutch: string;
    croatian: string;
    persian: string;
    german: string;
    spanish: string;
    french: string;
    japanese: string;
    italian: string;
    chinese: string;
};
export type TTranslaction = {
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
export type TCity = {
    id: number;
    name: string;
    state_id: number;
    state_code: string;
    state_name: string;
    country_id: number;
    country_code: string;
    country_name: string;
    latitude: string;
    longitude: string;
    wikiDataId: string;
};
export type TCityWithIncludes = TCity & {
    state?: TStateWithIncludes;
    country?: TCountryWithIncludes;
};
