import { GeoPoint } from "./utils/customtypes";
export declare const EarthRadius: {
    readonly km: 6371;
    readonly m: 6371000;
    readonly mi: 3958.8;
};
export declare const UnitToWords: {
    readonly km: "kilometers";
    readonly m: "meters";
    readonly mi: "miles";
};
/**
 * Calculates the distance (in meters) between two points on the Earth's surface using the Haversine formula.
 * @function {@link haversine}
 * @param {GeoPoint} point1 -  {@link GeoPoint} Geolocation coordinate point.
 * @param {GeoPoint} point2 - Second Geolocation coordinate point.
 * @param {number} point1.lat1 - The latitude of the first point.
 * @param {number} point1.lon1 - The longitude of the first point.
 * @param {number} point2.lat2 - The latitude of the second point.
 * @param {number} point2.lon2 - The longitude of the second point.
 * @returns {number} The distance between the two points in meters.
 * @example
 * const distance = haversine(
 * {lat: 51.509865, lng: -0.118092}, {lat: 48.8566, lng: 2.3522}
 * );
 * console.log(`Distance: ${distance} m`);
 * // returns Distance: 343.37 km (approx)
 */
export declare const haversine: (point1: GeoPoint, point2: GeoPoint, unit?: DistanceUnit) => {
    distance: number;
    unit: string;
    unitInWords: string;
};
/**
 * Finds the closest city, state, and country given a latitude and longitude.
 * @function {@link findClosestCity}
 * @param {GeoPoint} point - {@link GeoPoint} Geolocation coordinates.
 * @param {number} point.lat - The latitude of the coordinate.
 * @param {number} point.lng - The longitude of the coordinate.
 * @returns {Promise<{ city: any, state: any, country: any }>} The closest city, state, and country.
 * @example
 * // get closes city to the coordinate
 * const point = {lat: 7.733406989546727,
 * lng: 4.572850734146746}
 * const {city, country, state} = findClosestCity(point)
 * console.log({city, country, state});
 */
export declare function findClosestCity(point: GeoPoint, unit?: DistanceUnit): {
    city?: any;
    state?: any;
    country?: any;
};
/**
 * Finds the closest city, state, and country given a latitude and longitude.
 * @function {@link findClosestCities}
 * @param {GeoPoint} point - {@link GeoPoint} Geolocation coordinates.
 * @param {number} point.lat - The latitude of the coordinate.
 * @param {number} point.lng - The longitude of the coordinate.
 * @param {number} limit - The Number of cities to get.
 * @returns {Promise<{ city: any, state: any, country: any }>} The closest city, state, and country.
 * @example
 * // get 5 cities closes to the coordinate
 * const point = {lat: 7.733406989546727,
 * lng: 4.572850734146746}
 * const {cities, countries, states} = findClosestCities(point, 5)
 * // returns City[5], State[], Country[]
 */
export declare function findClosestCities(point: GeoPoint, limit: number, unit?: DistanceUnit): {
    cities: {
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
        unitInWords: unknown;
        unit: unknown;
        distance: unknown;
    }[];
    states: any[];
    countries: any[];
};
/**
 * Finds all cities, states, and countries within a given radius of a coordinate.
 * @function {@link findEntitiesWithinRadius}
 * @param {GeoPoint} point - {@link GeoPoint} Geolocation coordinates.
 * @param {number} point.lat - The latitude of the coordinate.
 * @param {number} point.lng - The longitude of the coordinate.
 * @param {number} radius - The radius in kilometers.
 * @returns {Promise<{ cities: any[], states: any[], countries: any[] }>} The entities within the radius.
 * @example
 * // cities, states, and countries in a 30km radius
 * const { cities, states, countries } = findEntitiesWithinRadius({lat: 1, lng: 1}, 30)
 */
export declare const findEntitiesWithinRadius: (point: GeoPoint, radius: number, unit?: DistanceUnit) => {
    cities: {
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
        unitInWords: unknown;
        unit: unknown;
        distance: unknown;
    }[];
    states: any[];
    countries: any[];
};
