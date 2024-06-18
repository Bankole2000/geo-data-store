"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subregionRelations = exports.subregion = exports.stateRelations = exports.state = exports.regionRelations = exports.countryRelations = exports.country = exports.cityRelations = exports.city = exports.region = exports.db = exports.sumDistinct = exports.sum = exports.or = exports.min = exports.max = exports.isNull = exports.isNotNull = exports.ilike = exports.notIlike = exports.notLike = exports.notBetween = exports.notExists = exports.exists = exports.createOne = exports.createMany = exports.between = exports.arrayContained = exports.notInArray = exports.inArray = exports.arrayOverlaps = exports.arrayContains = exports.like = exports.and = exports.avgDistinct = exports.avg = exports.countDistinct = exports.count = exports.desc = exports.asc = exports.not = exports.sql = exports.ne = exports.gte = exports.gt = exports.lte = exports.lt = exports.eq = void 0;
var drizzle_orm_1 = require("drizzle-orm");
Object.defineProperty(exports, "eq", { enumerable: true, get: function () { return drizzle_orm_1.eq; } });
Object.defineProperty(exports, "lt", { enumerable: true, get: function () { return drizzle_orm_1.lt; } });
Object.defineProperty(exports, "lte", { enumerable: true, get: function () { return drizzle_orm_1.lte; } });
Object.defineProperty(exports, "gt", { enumerable: true, get: function () { return drizzle_orm_1.gt; } });
Object.defineProperty(exports, "gte", { enumerable: true, get: function () { return drizzle_orm_1.gte; } });
Object.defineProperty(exports, "ne", { enumerable: true, get: function () { return drizzle_orm_1.ne; } });
Object.defineProperty(exports, "sql", { enumerable: true, get: function () { return drizzle_orm_1.sql; } });
Object.defineProperty(exports, "not", { enumerable: true, get: function () { return drizzle_orm_1.not; } });
Object.defineProperty(exports, "asc", { enumerable: true, get: function () { return drizzle_orm_1.asc; } });
Object.defineProperty(exports, "desc", { enumerable: true, get: function () { return drizzle_orm_1.desc; } });
Object.defineProperty(exports, "count", { enumerable: true, get: function () { return drizzle_orm_1.count; } });
Object.defineProperty(exports, "countDistinct", { enumerable: true, get: function () { return drizzle_orm_1.countDistinct; } });
Object.defineProperty(exports, "avg", { enumerable: true, get: function () { return drizzle_orm_1.avg; } });
Object.defineProperty(exports, "avgDistinct", { enumerable: true, get: function () { return drizzle_orm_1.avgDistinct; } });
Object.defineProperty(exports, "and", { enumerable: true, get: function () { return drizzle_orm_1.and; } });
Object.defineProperty(exports, "like", { enumerable: true, get: function () { return drizzle_orm_1.like; } });
Object.defineProperty(exports, "arrayContains", { enumerable: true, get: function () { return drizzle_orm_1.arrayContains; } });
Object.defineProperty(exports, "arrayOverlaps", { enumerable: true, get: function () { return drizzle_orm_1.arrayOverlaps; } });
Object.defineProperty(exports, "inArray", { enumerable: true, get: function () { return drizzle_orm_1.inArray; } });
Object.defineProperty(exports, "notInArray", { enumerable: true, get: function () { return drizzle_orm_1.notInArray; } });
Object.defineProperty(exports, "arrayContained", { enumerable: true, get: function () { return drizzle_orm_1.arrayContained; } });
Object.defineProperty(exports, "between", { enumerable: true, get: function () { return drizzle_orm_1.between; } });
Object.defineProperty(exports, "createMany", { enumerable: true, get: function () { return drizzle_orm_1.createMany; } });
Object.defineProperty(exports, "createOne", { enumerable: true, get: function () { return drizzle_orm_1.createOne; } });
Object.defineProperty(exports, "exists", { enumerable: true, get: function () { return drizzle_orm_1.exists; } });
Object.defineProperty(exports, "notExists", { enumerable: true, get: function () { return drizzle_orm_1.notExists; } });
Object.defineProperty(exports, "notBetween", { enumerable: true, get: function () { return drizzle_orm_1.notBetween; } });
Object.defineProperty(exports, "notLike", { enumerable: true, get: function () { return drizzle_orm_1.notLike; } });
Object.defineProperty(exports, "notIlike", { enumerable: true, get: function () { return drizzle_orm_1.notIlike; } });
Object.defineProperty(exports, "ilike", { enumerable: true, get: function () { return drizzle_orm_1.ilike; } });
Object.defineProperty(exports, "isNotNull", { enumerable: true, get: function () { return drizzle_orm_1.isNotNull; } });
Object.defineProperty(exports, "isNull", { enumerable: true, get: function () { return drizzle_orm_1.isNull; } });
Object.defineProperty(exports, "max", { enumerable: true, get: function () { return drizzle_orm_1.max; } });
Object.defineProperty(exports, "min", { enumerable: true, get: function () { return drizzle_orm_1.min; } });
Object.defineProperty(exports, "or", { enumerable: true, get: function () { return drizzle_orm_1.or; } });
Object.defineProperty(exports, "sum", { enumerable: true, get: function () { return drizzle_orm_1.sum; } });
Object.defineProperty(exports, "sumDistinct", { enumerable: true, get: function () { return drizzle_orm_1.sumDistinct; } });
var db_1 = require("./db");
Object.defineProperty(exports, "db", { enumerable: true, get: function () { return db_1.db; } });
var schema_1 = require("./db/schema");
Object.defineProperty(exports, "region", { enumerable: true, get: function () { return schema_1.region; } });
Object.defineProperty(exports, "city", { enumerable: true, get: function () { return schema_1.city; } });
Object.defineProperty(exports, "cityRelations", { enumerable: true, get: function () { return schema_1.cityRelations; } });
Object.defineProperty(exports, "country", { enumerable: true, get: function () { return schema_1.country; } });
Object.defineProperty(exports, "countryRelations", { enumerable: true, get: function () { return schema_1.countryRelations; } });
Object.defineProperty(exports, "regionRelations", { enumerable: true, get: function () { return schema_1.regionRelations; } });
Object.defineProperty(exports, "state", { enumerable: true, get: function () { return schema_1.state; } });
Object.defineProperty(exports, "stateRelations", { enumerable: true, get: function () { return schema_1.stateRelations; } });
Object.defineProperty(exports, "subregion", { enumerable: true, get: function () { return schema_1.subregion; } });
Object.defineProperty(exports, "subregionRelations", { enumerable: true, get: function () { return schema_1.subregionRelations; } });
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
