"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLng = exports.normalizeLat = exports.normalizeAngle = exports.avg = exports.sum = exports.kmPerHourToKnots = exports.knotsToKmPerHour = exports.meterPerSecondToKnots = exports.knotsToMeterPerSecond = exports.radToDeg = exports.degToRad = void 0;
/**
 * Convert an angle in degrees into an angle in radians
 * @param {number} angle   An angle in degrees
 * @return {number} Returns an angle in radians
 */
const degToRad = (angle) => {
    return angle * Math.PI / 180;
};
exports.degToRad = degToRad;
/**
 * Convert an angle in radians into an angle in degrees
 * @param {number} angle  An angle in radians
 * @return {number} Returns an angle in degrees
 */
const radToDeg = (angle) => {
    return angle * 180 / Math.PI;
};
exports.radToDeg = radToDeg;
/**
 * Convert a speed in knots into a speed in meter per second
 * 1 knot is 0.514444 m/s
 * @param {number} knots
 * @return {number} Returns speed in m/s
 */
const knotsToMeterPerSecond = (knots) => {
    return knots * 0.514444;
};
exports.knotsToMeterPerSecond = knotsToMeterPerSecond;
/**
 * Convert a speed in meter per second into a speed in knots
 * 1 knot is 0.514444 m/s
 * @param {number} knots
 * @return {number} Returns speed in m/s
 */
const meterPerSecondToKnots = (meterPerSecond) => {
    return meterPerSecond / 0.514444;
};
exports.meterPerSecondToKnots = meterPerSecondToKnots;
/**
 * Convert a speed in knots into a speed in kilometer per hour
 * 1 knot is 1.852 kilometer per hour
 * @param {number} knots   A speed in knots
 * @return {number} Returns speed in km/h
 */
const knotsToKmPerHour = (knots) => {
    return knots * 1.852;
};
exports.knotsToKmPerHour = knotsToKmPerHour;
/**
 * Convert a speed in kilometer per hour into a speed in knots
 * 1 knot is 1.852 kilometer per hour
 * @param {number} kmPerHour   A speed in km/h
 * @return {number} Returns speed in knots
 */
const kmPerHourToKnots = (kmPerHour) => {
    return kmPerHour / 1.852;
};
exports.kmPerHourToKnots = kmPerHourToKnots;
/**
 * calculate the sum of a list with numbers
 * @param {number[]} values
 * @return {number} Returns the sum
 */
const sum = (values) => {
    return values.reduce((a, b) => a + b, 0);
};
exports.sum = sum;
/**
 * Calculate the average of a list with numbers
 * @param {number[]} values
 * @return {number}
 */
const avg = (values) => {
    return (0, exports.sum)(values) / values.length;
};
exports.avg = avg;
const normalizeAngle = (angle) => {
    let normalized = angle % 360;
    if (normalized < 0) {
        normalized += 360;
    }
    if (normalized >= 360) {
        normalized -= 360;
    }
    return normalized;
};
exports.normalizeAngle = normalizeAngle;
const normalizeLat = (lat) => {
    return Math.asin(Math.sin((lat / 180) * Math.PI)) * (180 / Math.PI);
};
exports.normalizeLat = normalizeLat;
function normalizeLng(lng) {
    let normalized = lng % 360;
    if (normalized > 180) {
        normalized -= 360;
    }
    if (normalized <= -180) {
        normalized += 360;
    }
    return normalized;
}
exports.normalizeLng = normalizeLng;
