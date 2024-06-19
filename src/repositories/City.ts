import { like, eq, sql, asc, desc, count, and, or, relations, SQLWrapper } from "drizzle-orm";
import { QueryBuilder, SQLiteSelectQueryBuilder, SQLiteSelectQueryBuilderBase } from "drizzle-orm/sqlite-core";
import { db } from "../db";
import { city, country, region, state } from "../db/schema";
import { CommonSQLite } from "./Common";

interface City {
  id: number;
  name: string;
  state_id: number;
  state_code: string;
  state_name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  wikiDataId: string | null;
}

interface CityFilter {
  id?: number;
  name?: string;
  state_id?: number;
  state_code?: string;
  state_name?: string;
  country_id?: number;
  country_code?: string;
  country_name?: string;
  wikiDataId?: string;
  operation?: 'and' | 'or'
}

interface CityInclude {
  state?: boolean;
  country?: boolean;
}

interface CitySort {
  field: keyof City;
  direction: 'asc' | 'desc';
}

export class CityRepository extends CommonSQLite {
  db = db
  table = city
  
  /**
   * Creates a new city.
   * @param {string} name - The name of the city.
   * @param {string} translations - JSON string of translations for the city.
   * @param {string} wikiDataId - The WikiData ID for the city.
   * @returns {Promise<City>} The newly created city.
   * @example
   * const newCity = await cityRepository.createCity('City Name', '{}', 'wikiDataId1');
   * console.log('New City:', newSubcity);
   */
  async createCity(name: string, state_id: number, country_id: number, state_code: string, state_name: string, country_code: string, country_name: string, latitude: number, longitude: number, wikiDataId: string | null = null): Promise<City> {
    const [newCity] = await this.db.insert(this.table).values({ name, state_id, country_id, country_code, country_name, state_code, state_name, wikiDataId, latitude, longitude }).returning();
    return newCity;
  }

  /**
   * Retrieves a paginated list of citys.
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of citys per page.
   * @param {CityFilter} [filter] - Filtering parameters.
   * @param {CitySort} [sort] - Sorting parameters.
   * @param {CityInclude} [include] - Sorting parameters.
   * @param {boolean} [include.citys=false] - Whether to include related citys.
   * @param {boolean} [include.countries=false] - Whether to include related countries.
   * @returns {Promise<City[]>} The list of citys.
   * @example
   * const paginatedCitys = await cityRepository.getCitys(1, 10, { name: 'City' }, { field: 'name', direction: 'asc' }, true, true);
   * console.log('Paginated Citys:', paginatedCitys);
   */
  async getCitys({page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {}} :
    {
      page?: number,
      limit?: number,
      filter?: CityFilter,
      sort?: CitySort,
      include?: CityInclude
    }
  ) {
    const qb = this.db;
    let query = qb.select({
      city: {
        ...this.table,
        // countryCount: sql<number>`cast(count('${country.city_id}') as int)`,
        ...(include?.state ? {state} : {}),
        ...(include?.country ? {country} : {})
      },
    }).from(this.table).$dynamic();
    if (filter) {
      query = this.addFilters(query, filter)
    }
    if(include?.country){
      query = query.leftJoin(country, eq(city.country_id, country.id))
    }
    if(include?.state){
      query = query.leftJoin(state, eq(city.state_id, state.id))
    }
    query = this.addPagination(query, page, limit)
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(city[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {data: (await query).map(({city}) => city), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
    // const result = {data: include?.count ? (await query).map(({city}) => city) : (await query).map(({city}) => city), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
    return result
  }

  async getAllCitys({filter={}, sort = {field: 'id', direction: 'asc'}, include = {}}: 
  {
    filter?: CityFilter,
    sort?: CitySort,
    include?: CityInclude
  }){
    const qb = this.db;
    let query = qb.select({
      city: {
        ...this.table, 
        ...(include?.country ? {country} : {}), 
        ...(include?.state ? {state} : {}) 
      }
    }).from(this.table).$dynamic();
    if (filter) {
      query = this.addFilters(query, filter)
    }
    if(include?.country){
      query = query.leftJoin(country, eq(city.country_id, country.id))
    }
    if(include?.state){
      query = query.leftJoin(state, eq(city.state_id, state.id))
    }
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(this.table[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {data: (await query).map(({city}) => city), meta: {filter, orderBy: sort, total, rawsql}}
    return result
  }

  async findCityById(id: string | number, include?: CityInclude){

  }

    /**
   * Updates a city.
   * @param {number} id - The ID of the city to update.
   * @param {Partial<Omit<City, 'id'>>} updates - The updates to apply to the city.
   * @returns {Promise<void>}
   * @example
   * await cityRepository.updateCity(1, { name: 'Updated City Name' });
   */
    async updateCity(id: number, updates: Partial<Omit<City, 'id'>>): Promise<void> {
      await db.update(this.table).set(updates).where(eq(this.table.id, id));
    }

      /**
   * Deletes a city.
   * @param {number} id - The ID of the city to delete.
   * @returns {Promise<void>}
   * @example
   * await cityRepository.deleteCity(1);
   */
  async deleteCity(id: number): Promise<void> {
    await db.delete(this.table).where(eq(this.table.id, id));
  }

  addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: CityFilter){
    const whereOptions = this.getWhereOptions(filter);
    if (whereOptions) {
      return qb.where(whereOptions)
    }
    return qb
  }

  getWhereOptions(filter: CityFilter){
    const filterOperation = filter?.operation === 'or' ? or : and
    const conditions: SQLWrapper[] = []
    if (filter.name) conditions.push(like(city.name, `%${filter.name}%`))
    if (filter.state_name) conditions.push(like(city.state_name, `%${filter.state_name}%`))
    if (filter.country_name) conditions.push(like(city.country_name, `%${filter.country_name}%`))
    if (filter.wikiDataId) conditions.push(like(city.wikiDataId, `%${filter.wikiDataId}%`))
    if (filter.id) conditions.push(eq(city.id, filter.id))
    if (filter.country_id) conditions.push(eq(city.country_id, filter.country_id))
    if (filter.state_id) conditions.push(eq(city.state_id, filter.state_id))
    if (filter.state_code) conditions.push(eq(city.state_code, filter.state_code))
    if (filter.country_code) conditions.push(eq(city.country_code, filter.country_code))
    return conditions.length ? filterOperation(...conditions) : null;
  }

  // /**
  //  * Counts the number of related citys and countries for a given city.
  //  * @param {number} cityId - The ID of the city.
  //  * @returns {Promise<{ citysCount: number, countriesCount: number }>} The count of related citys and countries.
  //  * @example
  //  * const counts = await cityRepository.countRelatedEntities(1);
  //  * console.log('Related Entities Count:', counts);
  //  */
  // async countRelatedEntities(regionId: number): Promise<{ citysCount: number, countriesCount: number }> {
  //   const citysCount = await db.select(subcity).where(eq(city.region_id, cityId)).count();
  //   const countriesCount = await db.select(country).where(eq(country.region_id, cityId)).count();

  //   return { citysCount, countriesCount };
  // }

/**
 * Counts the number of related citys and countries for a given city.
 * @param {number} cityId - The ID of the city.
 * @returns {Promise<{ citysCount: number, countriesCount: number }>} The count of related citys and countries.
 * @example
 * const counts = cityRepository.countRelatedEntities({region_id: 1});
 * console.log('Related Entities Count:', counts);
 */
  // countRelatedEntities({id, ...rest}: {id: number}) {
  //   const countryCountResult = db
  //     .select({ count: sql`COUNT(*)` })
  //     .from(country)
  //     .where(eq(country.city_id, id))
  //     .all();
  //   const countryCount = countryCountResult[0].count;
  //   return { id, ...rest, countryCount };
  // }

  // includeRelatedEntities({id, ...rest}: {id: number}){
  //   const countries = db
  //     .select()
  //     .from(country)
  //     .where(eq(country.region_id, id))
  //     .all();
  //   return { id, ...rest, countries };
  // }
}

export const cityRepository = new CityRepository()
