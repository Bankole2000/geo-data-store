import { sql, eq } from "drizzle-orm";
import { db } from "./db";
import { city, state, country } from "./db/schema";
import { GeoPoint } from "./utils/customtypes";

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
export const haversine = (point1: GeoPoint, point2: GeoPoint): number => {
  const {lat: lat1, lng: lon1} = point1
  const {lat: lat2, lng: lon2} = point2
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
export function findClosestCity(point: GeoPoint): { city?: any, state?: any, country?: any } {
  const {lat: latitude, lng: longitude} = point
  // Find closest cities
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
    distance: sql`(6371 * acos(cos(radians(${latitude})) * cos(radians(${city.latitude})) * cos(radians(${city.longitude}) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(${city.latitude}))))`.as('distance')
  }).from(city).orderBy(sql`distance`).limit(1).leftJoin(state, eq(state.id, city.state_id)).leftJoin(country, eq(country.id, city.country_id)).all();

  const {state: inState, country: inCountry, ...nearCity} = closestCity[0]

  return {
    ...(nearCity ? {city: nearCity} : {}),
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
export function findClosestCities(point: GeoPoint, limit: number) {
  const {lat: latitude, lng: longitude} = point
  // Find closest cities
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
    distance: sql`(6371 * acos(cos(radians(${latitude})) * cos(radians(${city.latitude})) * cos(radians(${city.longitude}) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(${city.latitude}))))`.as('distance')
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
 export const findEntitiesWithinRadius = (point: GeoPoint, radius: number) => {
  const {lat: latitude, lng: longitude} = point;
  // Find cities within radius
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
    distance: sql`(6371 * acos(cos(radians(${latitude})) * cos(radians(${city.latitude})) * cos(radians(${city.longitude}) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(${city.latitude}))))`.as('distance')
  }).from(city).where(sql`distance <= ${radius}`).orderBy(sql`distance`).leftJoin(state, eq(state.id, city.state_id)).leftJoin(country, eq(country.id, city.country_id)).all();
  const states = [...new Set(cities.map(({state}) => state).map(state => JSON.stringify(state)))].map(x => JSON.parse(x))
  const countries = [...new Set(cities.map(({country}) => country).map(country => JSON.stringify(country)))].map(x => JSON.parse(x))
  const foundCities = cities.map(({state: _, country: __, ...city}) => city)

  return { cities: foundCities, states, countries };
}


