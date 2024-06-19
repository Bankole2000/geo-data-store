import { count, eq, sql } from 'drizzle-orm';
import { db } from './db';
import { city, country, region, subregion } from './db/schema';
import { regionRepository } from './repositories/Region';
import { subregionRepository } from './repositories/Subregion';
import { countryRepository } from './repositories/Country';
import { stateRepository } from './repositories/State';
import { cityRepository } from './repositories/City';

export { eq, lt, lte, gt, gte, ne, sql, not, asc, desc, count, countDistinct, avg, avgDistinct, and, like, arrayContains, arrayOverlaps, inArray, notInArray, arrayContained, between, createMany, createOne, exists, notExists, notBetween, notLike, notIlike, ilike, isNotNull, isNull, max, min, or, sum, sumDistinct } from 'drizzle-orm';
export { db } from './db';
export { region, city, cityRelations, country, countryRelations, regionRelations, state, stateRelations, subregion, subregionRelations } from './db/schema';
export { regionRepository, RegionRepository } from './repositories/Region';
export { subregionRepository, SubregionRepository } from './repositories/Subregion';
export { countryRepository, CountryRepository } from './repositories/Country';
export { stateRepository, StateRepository } from './repositories/State';
export { cityRepository, CityRepository } from './repositories/City';
// import {TCityWithIncludes, cities, getCityById, findCitiesByFxn} from './cities';
// export {TCountry, TCountryWithIncludes, countries, getCountryById} from './countries';
// export {TRegion, TSubregion, regions, subregions, getRegionById, getSubregionById} from './regions';
// export {TState, TStateWithIncludes, getStateById, states} from './states';

// const result = getCityById(1, {country: false, state: false})
// console.log({something: 1});

// import { like } from 'drizzle-orm';
// import regionsJSON from './data/regions.json';
// import { setupDefaults } from './utils/helperFxns';
(async () => {
  // const rr = regionRepository
  // const ss = subregionRepository
  // const cr = countryRepository
  // const sr = stateRepository
  const ctr = cityRepository
  // const endResult = await cr.getAllCountrys({filter: {id: 65}, include: {count: true, states: true, region: true, subregion: true, cities: true}})
  // const endResult = await rr.getAllRegions({filter: {name: 'afri', wikiDataId: 'Q828', operation: 'or'}, include: {count: true, subregions: true}})
  // const endResult = await sr.getAllStates({filter: {name: 'lagos'}, include: {count: true, country: true, cities: true}})
  const endResult = await ctr.getCitys({page: 1, limit: 1, include: {}})
  const sample = endResult.data[0]
  console.log({sample, meta: endResult.meta});

  // console.log(await ss.getSubregions({include: {region: true, count: true}}))
  try {
    
  // const result = await db
  //     .select({ count:  sql`COUNT(*)` })
  //     .from(city)
  //     .where(eq(city.country_id, 3))
  // const result = db
  // .select({ count: sql`COUNT(*)` })
  // .from(country)
  // .where(eq(country.subregion_id, 6))
  // .all();
  //     console.log({result});
  } catch (error: any) {
    console.log({error});
  }
  // console.log(await db.select({ subregion: {...subregion, region} }).from(subregion).leftJoin(region, eq(subregion.region_id, region.id)))

  // console.log(rr.countRelatedEntities({id: 1}));
//   // const result = await db.query.region.findFirst({with: {countries: true, subregions: true}})
//   // console.log({result});
//   // await insertNewRegion()
//   await setupDefaults()
//   // console.log({region: Object.keys(region)})
})()
