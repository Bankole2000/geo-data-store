/**
 * Convert an angle in degrees into an angle in radians
 * @param {number} angle   An angle in degrees
 * @return {number} Returns an angle in radians
 */
export const degToRad =  (angle: number): number => {
  return angle * Math.PI / 180
}

/**
 * Convert an angle in radians into an angle in degrees
 * @param {number} angle  An angle in radians
 * @return {number} Returns an angle in degrees
 */
export const radToDeg =  (angle: number): number => {
  return angle * 180 / Math.PI
}

/**
 * Convert a speed in knots into a speed in meter per second
 * 1 knot is 0.514444 m/s
 * @param {number} knots 
 * @return {number} Returns speed in m/s
 */
export const knotsToMeterPerSecond = (knots: number): number => {
  return knots * 0.514444
}

/**
 * Convert a speed in meter per second into a speed in knots
 * 1 knot is 0.514444 m/s
 * @param {number} knots 
 * @return {number} Returns speed in m/s
 */
export const meterPerSecondToKnots = (meterPerSecond: number): number => {
  return meterPerSecond / 0.514444
}

/**
 * Convert a speed in knots into a speed in kilometer per hour
 * 1 knot is 1.852 kilometer per hour
 * @param {number} knots   A speed in knots
 * @return {number} Returns speed in km/h
 */
export const knotsToKmPerHour =  (knots: number): number => {
  return knots * 1.852
}

/**
 * Convert a speed in kilometer per hour into a speed in knots
 * 1 knot is 1.852 kilometer per hour
 * @param {number} kmPerHour   A speed in km/h
 * @return {number} Returns speed in knots
 */
export const kmPerHourToKnots = (kmPerHour: number): number => {
  return kmPerHour / 1.852
}

/**
 * calculate the sum of a list with numbers
 * @param {number[]} values 
 * @return {number} Returns the sum
 */
export const sum = (values: number[]) => {
  return values.reduce((a, b) => a + b, 0) 
}

/**
 * Calculate the average of a list with numbers
 * @param {number[]} values 
 * @return {number}
 */
export const avg = (values: number[]) => {
  return sum(values) / values.length
}

export const normalizeAngle = (angle: number) => {
  let normalized = angle % 360

  if (normalized < 0) {
    normalized += 360
  }

  if (normalized >= 360) {
    normalized -= 360
  }

  return normalized
}

export const normalizeLat = (lat: number) => {
  return Math.asin(Math.sin((lat / 180) * Math.PI)) * (180 / Math.PI);
}

export function normalizeLng (lng: number) {
  let normalized = lng % 360

  if (normalized > 180) {
    normalized -= 360
  }

  if (normalized <= -180) {
    normalized += 360
  }

  return normalized
}
