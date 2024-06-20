import { like, eq, sql, asc, desc, count, and, or, SQLWrapper } from "drizzle-orm";
import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { db } from "../db";
import { city, country, region, state, subregion } from "../db/schema";
import { CommonSQLite } from "./Common";
import { Country, CountryFilter, CountryInclude, CountrySort } from "../utils/customtypes";

export class CountryRepository extends CommonSQLite {
  db = db
  table = country
  
  /**
   * Creates a new country.
   * @param {string} name - The name of the country.
   * @param {string} translations - JSON string of translations for the country.
   * @param {string} wikiDataId - The WikiData ID for the country.
   * @returns {Promise<Country>} The newly created country.
   * @example
   * const newCountry = await countryRepository.createCountry('Country Name', '{}', 'wikiDataId1');
   * console.log('New Country:', newSubcountry);
   */
  async createCountry(countryData: Omit<Country, 'id'>): Promise<Country> {
    const [newCountry] = await db.insert(country).values(countryData).returning();
    return newCountry;
  }

  /**
   * Retrieves a paginated list of countrys.
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of countrys per page.
   * @param {CountryFilter} [filter] - Filtering parameters.
   * @param {CountrySort} [sort] - Sorting parameters.
   * @param {CountryInclude} [include] - Sorting parameters.
   * @param {boolean} [include.countrys=false] - Whether to include related countrys.
   * @param {boolean} [include.countries=false] - Whether to include related countries.
   * @returns {Promise<Country[]>} The list of countrys.
   * @example
   * const paginatedCountrys = await countryRepository.getCountrys(1, 10, { name: 'Country' }, { field: 'name', direction: 'asc' }, true, true);
   * console.log('Paginated Countrys:', paginatedCountrys);
   */
  async getCountrys({page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {}} :
    {
      page?: number,
      limit?: number,
      filter?: CountryFilter,
      sort?: CountrySort,
      include?: CountryInclude
    }
  ) {
    const qb = this.db;
    let query = qb.select({
      country: {
        ...this.table,
        ...(include?.region ? {region} : {}),
        ...(include?.subregion ? {subregion} : {})
      },
    }).from(this.table).$dynamic();
    if (filter) {
      query = this.addFilters(query, filter)
    }
    if(include?.region){
      query = query.leftJoin(region, eq(country.region_id, region.id))
    }
    query = this.addPagination(query, page, limit)
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(country[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {
      data: include?.count ? (await query).map(({country}) => this.countRelatedEntities(country)).map(country => this.includeRelatedEntities(country, include)) : (await query).map(({country}) => this.includeRelatedEntities(country, include)),
      meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
    // const result = {data: include?.count ? (await query).map(({country}) => country) : (await query).map(({country}) => country), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
    return result
  }

  async getAllCountrys({filter={}, sort = {field: 'id', direction: 'asc'}, include = {}}: 
  {
    filter?: CountryFilter,
    sort?: CountrySort,
    include?: CountryInclude
  }){
    const qb = this.db;
    let query = qb.select({
      country: {
        ...this.table, 
        ...(include?.region ? {region} : {}),
        ...(include?.subregion ? {subregion} : {}) 
      }
    }).from(this.table).$dynamic();
    if (filter) {
      query = this.addFilters(query, filter)
    }
    if(include?.region){
      query = query.leftJoin(region, eq(country.region_id, region.id))
    }
    if(include?.subregion){
      query = query.leftJoin(subregion, eq(country.subregion_id, subregion.id))
    }
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(this.table[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {
      data: include?.count ? (await query).map(({country}) => this.countRelatedEntities(country)).map(country => this.includeRelatedEntities(country, include)) : (await query).map(({country}) => this.includeRelatedEntities(country, include)), 
      meta: {filter, orderBy: sort, total, rawsql}
    }
    return result
  }

  /**
 * Finds a country by its ID with optional related entities.
 * @async {@link findCountryById}
 * @param {number} id - The ID of the country to find.
 * @param {CountryInclude} [include] - {@link CountryInclude} Optional parameter to include related entities (region and/or subregion).
 * @returns {Promise<{ data: any[], meta: { rawsql: string } }>} The country data along with optional related entities and raw SQL query.
 * @example
 * const cr = new CountryRepository()
 * const country = await cr.findCountryById(1);
 * // returns { data: Country[], meta: {rawsql: string}}
 * const countryWithIncludesAndCounts = await cr
 * .findCountryById(1, { region: true, subregion: true, count: true })
 * // returns { data: CountryWithIncludesAndCount[], meta: {rawsql: string}}
 */
  async findCountryById(id: number, include?: CountryInclude){
    const qb = this.db;
    let query = qb.select({
      country: {
        ...this.table, 
        ...(include?.region ? {region} : {}),
        ...(include?.subregion ? {subregion} : {}) 
      }
    }).from(this.table).where(eq(country.id, id)).$dynamic();
    if(include?.region){
      query = query.leftJoin(region, eq(country.region_id, region.id))
    }
    if(include?.subregion){
      query = query.leftJoin(subregion, eq(country.subregion_id, subregion.id))
    }
    const rawsql = query.toSQL()
    const result = {data: include?.count ? (await query).map(({country}) => this.countRelatedEntities(country)).map(country => this.includeRelatedEntities(country, include)) : (await query).map(({country}) => this.includeRelatedEntities(country, include)), meta: {rawsql}}
    return result
  }

    /**
   * Updates a country.
   * @param {number} id - The ID of the country to update.
   * @param {Partial<Omit<Country, 'id'>>} updates - The updates to apply to the country.
   * @returns {Promise<void>}
   * @example
   * await countryRepository.updateCountry(1, { name: 'Updated Country Name' });
   */
    async updateCountry(id: number, updates: Partial<Omit<Country, 'id'>>): Promise<void> {
      await db.update(this.table).set(updates).where(eq(this.table.id, id));
    }

      /**
   * Deletes a country.
   * @param {number} id - The ID of the country to delete.
   * @returns {Promise<void>}
   * @example
   * await countryRepository.deleteCountry(1);
   */
  async deleteCountry(id: number): Promise<void> {
    await db.delete(this.table).where(eq(this.table.id, id));
  }

  addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: CountryFilter){
    const whereOptions = this.getWhereOptions(filter);
    if (whereOptions) {
      return qb.where(whereOptions)
    }
    return qb
  }

  getWhereOptions(filter: CountryFilter){
    const filterOperation = filter?.operation === 'or' ? or : and
    const conditions: SQLWrapper[] = []
    if (filter.name) conditions.push(like(country.name, `%${filter.name}%`));
    if (filter.nationality) conditions.push(like(country.nationality, `%${filter.nationality}%`));
    if (filter.currency_name) conditions.push(like(country.currency_name, `%${filter.currency_name}%`));
    if (filter.native) conditions.push(like(country.native, `%${filter.native}%`));
    if (filter.capital) conditions.push(like(country.capital, `%${filter.capital}%`));
    if (filter.iso2) conditions.push(eq(country.iso2, filter.iso2));
    if (filter.iso3) conditions.push(eq(country.iso3, filter.iso3));
    if (filter.numeric_code) conditions.push(eq(country.numeric_code, filter.numeric_code));
    if (filter.currency) conditions.push(eq(country.currency, filter.currency));
    if (filter.currency_symbol) conditions.push(eq(country.currency_symbol, filter.currency_symbol));
    if (filter.tld) conditions.push(eq(country.tld, filter.tld));
    if (filter.region_id) conditions.push(eq(country.region_id, filter.region_id));
    if (filter.subregion_id) conditions.push(eq(country.subregion_id, filter.subregion_id));
    if (filter.region_id) conditions.push(eq(country.region_id, filter.region_id));
    if (filter.id) conditions.push(eq(country.id, filter.id));
    return conditions.length ? filterOperation(...conditions) : null;
  }

/**
 * Counts the number of related countrys and countries for a given country.
 * @param {number} countryId - The ID of the country.
 * @returns {Promise<{ countrysCount: number, countriesCount: number }>} The count of related countrys and countries.
 * @example
 * const counts = countryRepository.countRelatedEntities({region_id: 1});
 * console.log('Related Entities Count:', counts);
 */
  countRelatedEntities({id, ...rest}: {id: number}) {
    const cityCountResult = db
    .select({ count: sql`COUNT(*)` })
      .from(city)
      .where(eq(city.country_id, id))
      .all();
    const stateCountResult = db
      .select({ count: sql`COUNT(*)` })
      .from(state)
      .where(eq(state.country_id, id))
      .all();
      const stateCount = stateCountResult[0].count;
      const cityCount = cityCountResult[0].count;
      console.log(stateCount, cityCount);
    return { id, ...rest, stateCount, cityCount };
  }

  /**
 * Includes related entities (states and cities) for a given country.
 * @param {{ id: number }} country - The country object with ID.
 * @param {CountryInclude} [include] - {@link CountryInclude} Optional parameter to include related entities (states and/or cities).
 * @returns {{ id: number, states: any[], cities: any[] }} The country object with included related entities.
 * @example
 * const cr = new CountryRepository();
 * const countryWithRelatedEntities = cr.includeRelatedEntities({ id: 1, name: 'Country' }, { states: true, cities: true });
 * // returns { id: 1, name: 'Country', states: State[], cities: City[] }
 */
  includeRelatedEntities({id, ...rest}: {id: number}, include?: CountryInclude){
    const states = include?.states ? db
      .select()
      .from(state)
      .where(eq(state.country_id, id))
      .all(): [];
    const cities = include?.cities ? db
      .select()
        .from(city)
        .where(eq(city.country_id, id))
        .all(): [];
    return { id, ...rest, states, cities };
  }
}

export const countryRepository = new CountryRepository()
