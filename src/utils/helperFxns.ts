// import regionJSON from '../data/regions.json'
// import subregionJSON from '../data/subregions.json';
// import countryJSON from '../data/countries.json';
// import stateJSON from '../data/states.json';
// import cityJSON from '../data/cities.json';
// import {TCityWithIncludes} from './customtypes';
// import { count } from "drizzle-orm"
// import { db } from "../db"
// import { city, state, country, subregion, region } from "../db/schema"

// type TFilterFxn<T> = (a: T, i?: number, arr?: T[]) => T[]

// export { TFilterFxn }

// const extractFieldData = (fields: string[], data: any) => {
//   const d: {[key: string]: any} = {}
//   fields.forEach(f => {
//     d[f] = data[f]
//   })
//   return d
// }

// const initialize = async(table: any, name: string) => {
//   let defaultData
//   switch (name) {
//     case "region":
//       defaultData = regionJSON;
//       break;
//     case "subregion":
//       defaultData = subregionJSON;
//       break;
//     case "country":
//       defaultData = countryJSON;
//       break;
//     case "state":
//       defaultData = stateJSON;
//       break;
//     case "city":
//       defaultData = cityJSON as Array<TCityWithIncludes>;
//       break;
//     default:
//       defaultData = regionJSON;
//   }
//   let finalResult = 0
//   const firstResult = (await db.select({ count: count() }).from(table))[0].count
//   const needsUpdate = firstResult < defaultData.length
//   console.log({needsUpdate, firstResult, default: defaultData.length})
//   if (needsUpdate) {
//     await db.delete(table);
//     const fields = Object.keys(table);
//     console.log({fields})
//     const sanitized = defaultData.map((d) => extractFieldData(fields, d))
//     console.log({sample: sanitized[0]})
//     let i = 0, max = sanitized.length, limit = 500
//     if(max > limit){

//       while(i < max){
//         await db.insert(table).values([...sanitized.filter((_, j) => j >= i && j < i + limit)])
//         i += limit;
//       }
//     } else {
//       await db.insert(table).values([...sanitized])
//     }
//     finalResult = (await db.select({ count: count() }).from(table))[0].count
//   }
//   console.log(`Default ${name} data OK: ${needsUpdate ? finalResult : firstResult}`)
// }

// export const setupDefaults = async () => {
//   await initialize(region, "region")
//   await initialize(subregion, "subregion")
//   await initialize(country, "country")
//   await initialize(state, "state")
//   await initialize(city, "city")
// }