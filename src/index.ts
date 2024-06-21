import { db } from './db';
import { cityRepository } from './repositories/City';
import { RegionRepository } from './repositories/Region';

export { eq as EQ, lt as LT, lte as LTE, gt as GT, gte as GTE, ne as NE, sql as SQL, not as NOT, asc as ASC, desc as DESC, count as COUNT, countDistinct as COUNTDISTINCT, avg as AVG, avgDistinct as AVGDISTINCT, and as AND, like as LIKE, arrayContains as ARRAYCONTAINS, arrayOverlaps as ARRAYOVERLAPS, inArray as INARRAY, notInArray as NOTINARRAY, arrayContained as ARRAYCONTAINED, between as BETWEEN, createMany as CREATEMANY, createOne as CREATEONE, exists as EXISTS, notExists as NOTEXISTS, notBetween as NOTBETWEEN, notLike as NOTLIKE, notIlike as NOTILIKE, ilike as ILIKE, isNotNull as ISNOTNULL, isNull as ISNULL, max as MAX, min as MIN, or as OR, sum as SUM, sumDistinct as SUMDISTINCT } from 'drizzle-orm';
export { db } from './db';
export { region, city, cityRelations, country, countryRelations, regionRelations, state, stateRelations, subregion, subregionRelations } from './db/schema';
export { regionRepository, RegionRepository } from './repositories/Region';
export { subregionRepository, SubregionRepository } from './repositories/Subregion';
export { countryRepository, CountryRepository } from './repositories/Country';
export { stateRepository, StateRepository } from './repositories/State';
export { cityRepository, CityRepository } from './repositories/City';
export { findClosestCities, findClosestCity, findEntitiesWithinRadius, haversine as calculateDistanceBetweenPoints } from './geolocationFxns';
export * from './utils/customtypes'
(async() => {
  // get all regions, counting subregions and countries in each region
//  const regRepo = new RegionRepository()
//  const regions = await regRepo.getAllRegions({include: {count: true}})
//  const citiesInTheUK = await cityRepository.getCities({
//   filter: {country_code: 'GB'}, 
//   sort: {field: 'name', direction: 'desc'},
//   include: {country: true, state: true}
//   })
  const citiesInTheUK = await cityRepository.getCities({})
  console.log(citiesInTheUK)
})()