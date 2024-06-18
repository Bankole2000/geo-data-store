export { eq, lt, lte, gt, gte, ne, sql, not, asc, desc, count, countDistinct, avg, avgDistinct, and, like, arrayContains, arrayOverlaps, inArray, notInArray, arrayContained, between, createMany, createOne, exists, notExists, notBetween, notLike, notIlike, ilike, isNotNull, isNull, max, min, or, sum, sumDistinct } from 'drizzle-orm';
export { db } from './db';
export { region, city, cityRelations, country, countryRelations, regionRelations, state, stateRelations, subregion, subregionRelations } from './db/schema';
// import {TCityWithIncludes, cities, getCityById, findCitiesByFxn} from './cities';
// export {TCountry, TCountryWithIncludes, countries, getCountryById} from './countries';
// export {TRegion, TSubregion, regions, subregions, getRegionById, getSubregionById} from './regions';
// export {TState, TStateWithIncludes, getStateById, states} from './states';

// const result = getCityById(1, {country: false, state: false})
// console.log({something: 1});

// import { like } from 'drizzle-orm';
// import regionsJSON from './data/regions.json';

// import { setupDefaults } from './utils/helperFxns';
// (async () => {
//   // const result = await db.query.region.findFirst({with: {countries: true, subregions: true}})
//   // console.log({result});
//   // await insertNewRegion()
//   await setupDefaults()
//   // console.log({region: Object.keys(region)})
// })()
