"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEntitiesWithinRadius = exports.findClosestCities = exports.findClosestCity = exports.haversine = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("./db");
const schema_1 = require("./db/schema");
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
const haversine = (point1, point2) => {
    const { lat: lat1, lng: lon1 } = point1;
    const { lat: lat2, lng: lon2 } = point2;
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
exports.haversine = haversine;
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
function findClosestCity(point) {
    const { lat: latitude, lng: longitude } = point;
    // Find closest cities
    const closestCity = db_1.db.select({
        id: schema_1.city.id,
        name: schema_1.city.name,
        state_id: schema_1.city.state_id,
        state_code: schema_1.city.state_code,
        state_name: schema_1.city.state_name,
        country_id: schema_1.city.country_id,
        country_code: schema_1.city.country_code,
        country_name: schema_1.city.country_name,
        latitude: schema_1.city.latitude,
        longitude: schema_1.city.longitude,
        state: schema_1.state,
        country: schema_1.country,
        distance: (0, drizzle_orm_1.sql) `(6371 * acos(cos(radians(${latitude})) * cos(radians(${schema_1.city.latitude})) * cos(radians(${schema_1.city.longitude}) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(${schema_1.city.latitude}))))`.as('distance')
    }).from(schema_1.city).orderBy((0, drizzle_orm_1.sql) `distance`).limit(1).leftJoin(schema_1.state, (0, drizzle_orm_1.eq)(schema_1.state.id, schema_1.city.state_id)).leftJoin(schema_1.country, (0, drizzle_orm_1.eq)(schema_1.country.id, schema_1.city.country_id)).all();
    const _a = closestCity[0], { state: inState, country: inCountry } = _a, nearCity = __rest(_a, ["state", "country"]);
    return Object.assign(Object.assign(Object.assign({}, (nearCity ? { city: nearCity } : {})), (inState ? { state: inState } : {})), (inCountry ? { country: inCountry } : {}));
}
exports.findClosestCity = findClosestCity;
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
function findClosestCities(point, limit) {
    const { lat: latitude, lng: longitude } = point;
    // Find closest cities
    const closestCities = db_1.db.select({
        id: schema_1.city.id,
        name: schema_1.city.name,
        state_id: schema_1.city.state_id,
        state_code: schema_1.city.state_code,
        state_name: schema_1.city.state_name,
        country_id: schema_1.city.country_id,
        country_code: schema_1.city.country_code,
        country_name: schema_1.city.country_name,
        latitude: schema_1.city.latitude,
        longitude: schema_1.city.longitude,
        state: schema_1.state,
        country: schema_1.country,
        distance: (0, drizzle_orm_1.sql) `(6371 * acos(cos(radians(${latitude})) * cos(radians(${schema_1.city.latitude})) * cos(radians(${schema_1.city.longitude}) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(${schema_1.city.latitude}))))`.as('distance')
    }).from(schema_1.city).orderBy((0, drizzle_orm_1.sql) `distance`).limit(limit).leftJoin(schema_1.state, (0, drizzle_orm_1.eq)(schema_1.state.id, schema_1.city.state_id)).leftJoin(schema_1.country, (0, drizzle_orm_1.eq)(schema_1.country.id, schema_1.city.country_id)).all();
    const states = [...new Set(closestCities.map(({ state }) => state).map(state => JSON.stringify(state)))].map(x => JSON.parse(x));
    const countries = [...new Set(closestCities.map(({ country }) => country).map(country => JSON.stringify(country)))].map(x => JSON.parse(x));
    const cities = closestCities.map((_a) => {
        var { state: _, country: __ } = _a, city = __rest(_a, ["state", "country"]);
        return city;
    });
    return { cities, states, countries };
}
exports.findClosestCities = findClosestCities;
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
const findEntitiesWithinRadius = (point, radius) => {
    const { lat: latitude, lng: longitude } = point;
    // Find cities within radius
    const cities = db_1.db.select({
        id: schema_1.city.id,
        name: schema_1.city.name,
        state_id: schema_1.city.state_id,
        state_code: schema_1.city.state_code,
        state_name: schema_1.city.state_name,
        country_id: schema_1.city.country_id,
        country_code: schema_1.city.country_code,
        country_name: schema_1.city.country_name,
        latitude: schema_1.city.latitude,
        longitude: schema_1.city.longitude,
        state: schema_1.state,
        country: schema_1.country,
        distance: (0, drizzle_orm_1.sql) `(6371 * acos(cos(radians(${latitude})) * cos(radians(${schema_1.city.latitude})) * cos(radians(${schema_1.city.longitude}) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(${schema_1.city.latitude}))))`.as('distance')
    }).from(schema_1.city).where((0, drizzle_orm_1.sql) `distance <= ${radius}`).orderBy((0, drizzle_orm_1.sql) `distance`).leftJoin(schema_1.state, (0, drizzle_orm_1.eq)(schema_1.state.id, schema_1.city.state_id)).leftJoin(schema_1.country, (0, drizzle_orm_1.eq)(schema_1.country.id, schema_1.city.country_id)).all();
    const states = [...new Set(cities.map(({ state }) => state).map(state => JSON.stringify(state)))].map(x => JSON.parse(x));
    const countries = [...new Set(cities.map(({ country }) => country).map(country => JSON.stringify(country)))].map(x => JSON.parse(x));
    const foundCities = cities.map((_a) => {
        var { state: _, country: __ } = _a, city = __rest(_a, ["state", "country"]);
        return city;
    });
    return { cities: foundCities, states, countries };
};
exports.findEntitiesWithinRadius = findEntitiesWithinRadius;
