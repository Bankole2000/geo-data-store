/**
 * Convert an angle in degrees into an angle in radians
 * @param {number} angle   An angle in degrees
 * @return {number} Returns an angle in radians
 */
export declare const degToRad: (angle: number) => number;
/**
 * Convert an angle in radians into an angle in degrees
 * @param {number} angle  An angle in radians
 * @return {number} Returns an angle in degrees
 */
export declare const radToDeg: (angle: number) => number;
/**
 * Convert a speed in knots into a speed in meter per second
 * 1 knot is 0.514444 m/s
 * @param {number} knots
 * @return {number} Returns speed in m/s
 */
export declare const knotsToMeterPerSecond: (knots: number) => number;
/**
 * Convert a speed in meter per second into a speed in knots
 * 1 knot is 0.514444 m/s
 * @param {number} knots
 * @return {number} Returns speed in m/s
 */
export declare const meterPerSecondToKnots: (meterPerSecond: number) => number;
/**
 * Convert a speed in knots into a speed in kilometer per hour
 * 1 knot is 1.852 kilometer per hour
 * @param {number} knots   A speed in knots
 * @return {number} Returns speed in km/h
 */
export declare const knotsToKmPerHour: (knots: number) => number;
/**
 * Convert a speed in kilometer per hour into a speed in knots
 * 1 knot is 1.852 kilometer per hour
 * @param {number} kmPerHour   A speed in km/h
 * @return {number} Returns speed in knots
 */
export declare const kmPerHourToKnots: (kmPerHour: number) => number;
/**
 * calculate the sum of a list with numbers
 * @param {number[]} values
 * @return {number} Returns the sum
 */
export declare const sum: (values: number[]) => number;
/**
 * Calculate the average of a list with numbers
 * @param {number[]} values
 * @return {number}
 */
export declare const avg: (values: number[]) => number;
export declare const normalizeAngle: (angle: number) => number;
export declare const normalizeLat: (lat: number) => number;
export declare function normalizeLng(lng: number): number;
