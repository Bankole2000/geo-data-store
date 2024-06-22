import pointInPolygon from 'point-in-polygon'
import { sql, eq } from "drizzle-orm";
import { db } from "./db";
import { city, state, country } from "./db/schema";
import { BoundingBox, DistanceUnit, GeoPoint, Vector } from "./utils/customtypes";
import { avg, degToRad, normalizeLat, normalizeLng, radToDeg } from "./utils/utilityFxns";

const UnitMultiplier = {
  m: 1,
  km: 1000,
  mi: 1609.34
} as const

export const EarthRadius = {
  km: 6371,
  m: 6371000,
  mi: 3958.8,
} as const

export const UnitToWords = {
  km: 'kilometers',
  m: 'meters',
  mi: 'miles'
} as const
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
export const haversine = (point1: GeoPoint, point2: GeoPoint, unit: DistanceUnit = 'm'): {distance: number, unit: string, unitInWords: string} => {
  const {lat: lat1, lng: lon1} = point1
  const {lat: lat2, lng: lon2} = point2
  const R = EarthRadius[unit]; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return {distance: R * c, unit, unitInWords: UnitToWords[unit]};
}

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
export function findClosestCity(point: GeoPoint, unit: DistanceUnit = 'm'): { city?: any, state?: any, country?: any } {
  const {lat: latitude, lng: longitude} = point
  // Find closest cities
  const R = EarthRadius[unit];
  const closestCity = db.select({
    id: city.id,
    name: city.name,
    state_id: city.state_id,
    state_code: city.state_code,
    state_name: city.state_name,
    country_id: city.country_id,
    country_code: city.country_code,
    country_name: city.country_name,
    latitude: city.latitude,
    longitude: city.longitude,
    state,
    country,
    unitInWords: sql`${UnitToWords[unit]}`,
    unit: sql`${unit}`,
    distance: sql`(${R} * acos(cos(radians(${latitude})) * cos(radians(${city.latitude})) * cos(radians(${city.longitude}) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(${city.latitude}))))`.as('distance')
  }).from(city).orderBy(sql`distance`).limit(1).leftJoin(state, eq(state.id, city.state_id)).leftJoin(country, eq(country.id, city.country_id)).all();

  const {state: inState, country: inCountry, ...nearCity} = closestCity[0]

  return {
    ...nearCity,
    ...(inState ? {state: inState} : {}),
    ...(inCountry ? {country: inCountry} : {}),
  };
}

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
export function findClosestCities(point: GeoPoint, limit: number, unit: DistanceUnit = 'm') {
  const {lat: latitude, lng: longitude} = point
  // Find closest cities
  const R = EarthRadius[unit];
  const closestCities = db.select({
    id: city.id,
    name: city.name,
    state_id: city.state_id,
    state_code: city.state_code,
    state_name: city.state_name,
    country_id: city.country_id,
    country_code: city.country_code,
    country_name: city.country_name,
    latitude: city.latitude,
    longitude: city.longitude,
    state,
    country,
    unitInWords: sql`${UnitToWords[unit]}`,
    unit: sql`${unit}`,
    distance: sql`(${R} * acos(cos(radians(${latitude})) * cos(radians(${city.latitude})) * cos(radians(${city.longitude}) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(${city.latitude}))))`.as('distance')
  }).from(city).orderBy(sql`distance`).limit(limit).leftJoin(state, eq(state.id, city.state_id)).leftJoin(country, eq(country.id, city.country_id)).all();

  const states = [...new Set(closestCities.map(({state}) => state).map(state => JSON.stringify(state)))].map(x => JSON.parse(x))
  const countries = [...new Set(closestCities.map(({country}) => country).map(country => JSON.stringify(country)))].map(x => JSON.parse(x))
  const cities = closestCities.map(({state: _, country: __, ...city}) => city)

  return { cities, states, countries };
}

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
 export const findEntitiesWithinRadius = (point: GeoPoint, radius: number, unit: DistanceUnit = 'm') => {
  const {lat: latitude, lng: longitude} = point;
  // Find cities within radius
  const R = EarthRadius[unit];
  const cities = db.select({
    id: city.id,
    name: city.name,
    state_id: city.state_id,
    state_code: city.state_code,
    state_name: city.state_name,
    country_id: city.country_id,
    country_code: city.country_code,
    country_name: city.country_name,
    latitude: city.latitude,
    longitude: city.longitude,
    state,
    country,
    unitInWords: sql`${UnitToWords[unit]}`,
    unit: sql`${unit}`,
    distance: sql`(${R} * acos(cos(radians(${latitude})) * cos(radians(${city.latitude})) * cos(radians(${city.longitude}) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(${city.latitude}))))`.as('distance')
  }).from(city).where(sql`distance <= ${radius}`).orderBy(sql`distance`).leftJoin(state, eq(state.id, city.state_id)).leftJoin(country, eq(country.id, city.country_id)).all();
  const states = [...new Set(cities.map(({state}) => state).map(state => JSON.stringify(state)))].map(x => JSON.parse(x))
  const countries = [...new Set(cities.map(({country}) => country).map(country => JSON.stringify(country)))].map(x => JSON.parse(x))
  const foundCities = cities.map(({state: _, country: __, ...city}) => city)

  return { cities: foundCities, states, countries };
}

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
export const getBoundingBox = (locations: GeoPoint[], margin = 0, unit: DistanceUnit = 'm') => {
  if (!Array.isArray(locations) || locations.length === 0) {
    return {
      topLeft: null, 
      bottomRight: null
    }
  }

  const topLeftLat = Math.max(...locations.map(({lat}) => lat))
  const topLeftLon = Math.min(...locations.map(({lng}) => lng))
  const bottomRightLat = Math.min(...locations.map(({lat}) => lat))
  const bottomRightLon = Math.max(...locations.map(({lng}) => lng))

  const topLeft: GeoPoint = {lat: normalizeLat(topLeftLat), lng: normalizeLng(topLeftLon)};
  const bottomRight: GeoPoint = {lat: normalizeLat(bottomRightLat), lng: normalizeLng(bottomRightLon)}

  if(!margin) {
    return {topLeft, bottomRight}
  } else {
    const distance = (Math.SQRT2 * margin)
    return {
      topLeft: moveCoordsTo(topLeft, {angle: 315, distance, unit}),
      bottomRight: moveCoordsTo(bottomRight, {angle: 315, distance, unit})
    }
  }
}

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
export const moveCoordsTo = (origin: GeoPoint, vector: Vector = {angle: 0, distance: 0, unit: 'm'}) => {
  const {lat, lng} = origin
  const {angle, distance, unit} = vector
  const dLat = distance * Math.cos(degToRad(angle)) / EarthRadius[unit]
  const dLon = distance * Math.sin(degToRad(angle)) / (EarthRadius[unit] * Math.cos(degToRad(lat)))
  const destination: GeoPoint = {
    lat: lat + radToDeg(dLat),
    lng: lng + radToDeg(dLon)
  }
  return destination
}

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
export const calculateVectorDistance = (origin: GeoPoint, destination: GeoPoint, unit: DistanceUnit = 'm') => {
  const {lat: fromLat, lng: fromLon} = origin
  const {lat: toLat, lng: toLon} = destination
  const lat1 = degToRad(fromLat)
  const lat2 = degToRad(toLat)
  const dlat = degToRad(toLat - fromLat)
  const dlon = degToRad(toLon - fromLon)

  const a = Math.sin(dlat/2) * Math.sin(dlat/2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2) * Math.sin(dlon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = EarthRadius[unit] * c

  const y = Math.sin(dlon) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon)
  const angle = radToDeg(Math.atan2(y, x))
  const vectorDistance: Vector = {angle, distance, unit, unitInWords: UnitToWords[unit as string as keyof typeof UnitToWords]}
  return vectorDistance
}

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
export const isWithinBoundingBox = (point: GeoPoint, boundingBox: BoundingBox) => {
  const {lat, lng} = point;

  const {topLeft: {lat: topLeftLat, lng: topLeftLon}, bottomRight: {lat: bottomRightLat, lng: bottomRightLon}} = boundingBox
  const minLat = Math.min(topLeftLat, bottomRightLat)
  const maxLat = Math.max(topLeftLat, bottomRightLat)
  const minLon = Math.min(topLeftLon, bottomRightLon)
  const maxLon = Math.max(topLeftLon, bottomRightLon)

  return lng >= minLon && lng <= maxLon && lat >= minLat && lat <= maxLat
}

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
export const getMidwayPoint = (locations: GeoPoint[]) => {
  if (!Array.isArray(locations) || locations.length === 0) {
    return null
  }

  const midway: GeoPoint = {
    lat: avg(locations.map(({lat}) => lat)),
    lng: avg(locations.map(({lng}) => lng))
  }
  return midway
}

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
export const isWithinRadius = (point: GeoPoint, center: GeoPoint, radius = 0, unit: DistanceUnit = 'm') => {
  return calculateVectorDistance(point, center, unit).distance <= radius
}

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
export const geoPointToTuple = (point: GeoPoint) => {
  const {lat, lng} = point;
  return [lat, lng]
}

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
export const tupleToGeoPoint = (point: number[]) => {
  const [lat, lng] = point
  return {lat, lng} as GeoPoint
}

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
export const isWithinPolygon = (point: GeoPoint, polygon: GeoPoint[]) => {
  if (!polygon || !Array.isArray(polygon)) {
    throw new TypeError('Invalid polygon. Array with GeoPoints expected')
  }
  if (polygon.length < 3) {
    throw new TypeError('Invalid polygon. Expected at least 3 points')
  }

  return pointInPolygon(geoPointToTuple(point), polygon.map(geoPointToTuple)) 
}

