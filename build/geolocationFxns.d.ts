import { BoundingBox, DistanceUnit, GeoPoint, Vector } from "./utils/customtypes";
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
/**
 * Calculates the bounding box for a given set of geographical points with an optional margin.
 * @function {@link getBoundingBox}
 * @param {GeoPoint[]} locations - [{@link GeoPoint}] An array of GeoPoint objects representing the locations.
 * @param {number} [margin=0] - The margin to add to the bounding box (default is 0).
 * @param {DistanceUnit} [unit='m'] - The unit for the margin ('m' for meters, 'km' for kilometers, etc.).
 * @returns {BoundingBox} - {@link BoundingBox} An object containing the top-left and bottom-right points of the bounding box.
 * @example
 * const locations = [
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 34.0522, lng: -118.2437 },
 *   { lat: 41.8781, lng: -87.6298 }
 * ];
 * const boundingBox = getBoundingBox(locations, 10, 'km');
 * console.log(boundingBox);
 * // { topLeft: { lat: 41.8781, lng: -118.2437 }, bottomRight: { lat: 34.0522, lng: -74.0060 } }
 */
export declare const getBoundingBox: (locations: GeoPoint[], margin?: number, unit?: DistanceUnit) => {
    topLeft: null;
    bottomRight: null;
} | {
    topLeft: GeoPoint;
    bottomRight: GeoPoint;
};
/**
 * Moves a geographical point by a specified vector (angle and distance).
 * @function {@link moveCoordsTo}
 * @param {GeoPoint} origin - {@link GeoPoint} The original geographical point.
 * @param {Vector} [vector={angle: 0, distance: 0, unit: 'm'}] - {@link Vector} The vector defining the movement (angle in degrees, distance, and unit).
 * @returns {GeoPoint} - {@link GeoPoint} The new geographical point after moving by the specified vector.
 * @example
 * const origin = { lat: 40.7128, lng: -74.0060 };
 * const vector = { angle: 45, distance: 100, unit: 'km' };
 * const destination = moveCoordsTo(origin, vector);
 * console.log(destination);
 * // { lat: 41.3196, lng: -72.9822 }
 */
export declare const moveCoordsTo: (origin: GeoPoint, vector?: Vector) => GeoPoint;
/**
 * Calculates the vector distance (angle and distance) between two geographical points.
 * @function {@link calculateVectorDistance}
 * @param {GeoPoint} origin - {@link GeoPoint} The starting geographical point.
 * @param {GeoPoint} destination - {@link GeoPoint} The ending geographical point.
 * @param {DistanceUnit} [unit='m'] - The unit for the distance ('m' for meters, 'km' for kilometers, etc.).
 * @returns {Vector} - {@link Vector} The vector distance including angle, distance, and unit.
 * @example
 * const origin = { lat: 40.7128, lng: -74.0060 };
 * const destination = { lat: 34.0522, lng: -118.2437 };
 * const vectorDistance = calculateVectorDistance(origin, destination, 'km');
 * console.log(vectorDistance);
 * // { angle: -65.4232, distance: 3940.069, unit: 'km', unitInWords: 'kilometers' }
 */
export declare const calculateVectorDistance: (origin: GeoPoint, destination: GeoPoint, unit?: DistanceUnit) => Vector;
/**
 * Checks if a given point is inside a specified bounding box.
 * @function {@link isWithinBoundingBox}
 * @param {GeoPoint} point - {@link GeoPoint} The geographical point to check.
 * @param {BoundingBox} boundingBox - {@link BoundingBox} The bounding box defined by top-left and bottom-right points.
 * @returns {boolean} True if the point is inside the bounding box, false otherwise.
 * @example
 * const point = { lat: 40.7128, lng: -74.0060 };
 * const boundingBox = {
 *   topLeft: { lat: 41.0, lng: -75.0 },
 *   bottomRight: { lat: 40.0, lng: -73.0 }
 * };
 * const isInside = isWithinBoundingBox(point, boundingBox);
 * console.log(isInside); // true or false
 */
export declare const isWithinBoundingBox: (point: GeoPoint, boundingBox: BoundingBox) => boolean;
/**
 * Calculates the midway point for a given set of geographical locations.
 * @function {@link getMidwayPoint}
 * @param {GeoPoint[]} locations - {@link GeoPoint} An array of GeoPoint objects representing the locations.
 * @returns {GeoPoint | null} The geographical point representing the midway point, or null if the input is invalid.
 * @example
 * const locations = [
 *   { lat: 40.7128, lng: -74.0060 },
 *   { lat: 34.0522, lng: -118.2437 },
 *   { lat: 41.8781, lng: -87.6298 }
 * ];
 * const midwayPoint = getMidwayPoint(locations);
 * console.log(midwayPoint);
 * // { lat: 38.21436666666667, lng: -92.29323333333334 }
 */
export declare const getMidwayPoint: (locations: GeoPoint[]) => GeoPoint | null;
/**
 * Checks if a given point is within a specified radius from a center point.
 * @function {@link isWithinRadius}
 * @param {GeoPoint} point - {@link GeoPoint} The geographical point to check.
 * @param {GeoPoint} center - {@link GeoPoint} The center geographical point.
 * @param {number} [radius=0] - The radius to check within (default is 0).
 * @param {DistanceUnit} [unit='m'] - The unit for the radius ('m' for meters, 'km' for kilometers, or 'mi' for miles.).
 * @returns {boolean} True if the point is within the specified radius from the center point, false otherwise.
 * @example
 * const point = { lat: 40.7128, lng: -74.0060 };
 * const center = { lat: 40.730610, lng: -73.935242 };
 * const radius = 10; // in kilometers
 * const isInside = isWithinRadius(point, center, radius, 'km');
 * console.log(isInside); // true or false
 */
export declare const isWithinRadius: (point: GeoPoint, center: GeoPoint, radius?: number, unit?: DistanceUnit) => boolean;
/**
 * Converts a GeoPoint object to a latitude-longitude tuple.
 * @function {@link geoPointToTuple}
 * @param {GeoPoint} point - The GeoPoint object with latitude and longitude properties.
 * @returns {[number, number]} A tuple containing the latitude and longitude.
 * @example
 * const point = { lat: 40.7128, lng: -74.0060 };
 * const tuple = geoPointToTuple(point);
 * console.log(tuple); // [40.7128, -74.0060]
 */
export declare const geoPointToTuple: (point: GeoPoint) => number[];
/**
 * Converts a latitude-longitude tuple to a GeoPoint object.
 * @function {@link tupleToGeoPoint}
 * @param {number[]} point - An array containing the latitude and longitude as numbers.
 * @returns {GeoPoint} - {@link GeoPoint} The GeoPoint object with latitude and longitude properties.
 * @example
 * const tuple = [40.7128, -74.0060];
 * const geoPoint = tupleToGeoPoint(tuple);
 * console.log(geoPoint);
 * // { lat: 40.7128, lng: -74.0060 }
 */
export declare const tupleToGeoPoint: (point: number[]) => GeoPoint;
/**
 * Checks if a given point is within a specified polygon.
 * @function {@link isWithinPolygon}
 * @param {GeoPoint} point - {@link GeoPoint} The point to check.
 * @param {GeoPoint[]} polygon - [{@link GeoPoint}] The polygon defined by an array of GeoPoints.
 * @returns {boolean} True if the point is within the polygon, false otherwise.
 * @throws {TypeError} If the polygon is not an array of GeoPoints or has fewer than 3 points.
 * @example
 * const point = { lat: 40.7128, lng: -74.0060 };
 * const polygon = [
 *   { lat: 40.7127, lng: -74.0059 },
 *   { lat: 40.7129, lng: -74.0059 },
 *   { lat: 40.7129, lng: -74.0061 },
 *   { lat: 40.7127, lng: -74.0061 }
 * ];
 * const result = isWithinPolygon(point, polygon);
 * console.log(result); // true or false
 */
export declare const isWithinPolygon: (point: GeoPoint, polygon: GeoPoint[]) => boolean;
