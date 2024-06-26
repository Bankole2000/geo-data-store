import { like, eq, sql, asc, desc, count, and, or, SQLWrapper } from "drizzle-orm";
import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { db } from "../db";
import { state, country, city } from "../db/schema";
import { CommonSQLite } from "./Common";
import { State, StateFilter, StateSort, StateInclude, StateQueryOptions } from "../utils/customtypes";

export class StateRepository extends CommonSQLite<typeof state> {
  db = db
  table = state
  
  /**
   * Creates a new state.
   * @param {string} name - The name of the state.
   * @param {string} translations - JSON string of translations for the state.
   * @param {string} wikiDataId - The WikiData ID for the state.
   * @returns {Promise<State>} The newly created state.
   * @example
   * const newState = await stateRepository.createState('State Name', '{}', 'wikiDataId1');
   * console.log('New State:', newSubstate);
   */
  async createState(name: string, country_id: number, state_code: string, latitude: number, longitude: number, type?: string ): Promise<State> {
    const foundCountry = await this.db.query.country.findFirst({where: eq(country.id, country_id)})
    if (!foundCountry) throw new Error(`Country with id '${country_id}' not found`);
    const {iso2: country_code, name: country_name} = foundCountry
    const [newState] = await this.db.insert(this.table).values({ name, country_id, country_code, country_name, state_code, latitude, longitude, type }).returning();
    return newState;
  }

  /**
   * Retrieves a paginated list of states.
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of states per page.
   * @param {StateFilter} [filter] - Filtering parameters.
   * @param {StateSort} [sort] - Sorting parameters.
   * @param {StateInclude} [include] - Sorting parameters.
   * @param {boolean} [include.states=false] - Whether to include related states.
   * @param {boolean} [include.countries=false] - Whether to include related countries.
   * @returns {Promise<State[]>} The list of states.
   * @example
   * const paginatedStates = await stateRepository.getStates(1, 10, { name: 'State' }, { field: 'name', direction: 'asc' }, true, true);
   * console.log('Paginated States:', paginatedStates);
   */
  async getStates({page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {}} :
    {
      page?: number,
      limit?: number,
    } & StateQueryOptions
  ) {
    const qb = this.db;
    let query = qb.select({
      state: {
        ...this.table,
        ...(include?.country ? {country} : {})
      },
    }).from(this.table).$dynamic();
    if (Object.keys(filter).length) {
      query = this.addFilters(query, filter)
    }
    if(include?.country){
      query = query.leftJoin(country, eq(state.country_id, country.id))
    }
    query = this.addPagination(query, page, limit)
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(state[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {
      data: include?.count ? (await query).map(({state}) => this.countRelatedEntities(state)) : (await query).map(({state}) => state), 
      meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}
    }
    // const result = {data: include?.count ? (await query).map(({state}) => state) : (await query).map(({state}) => state), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
    return result
  }

/**
 * Retrieves all states with optional filtering, sorting, and inclusion of related entities.
 * @async await (new {@link StateRepository}()).{@link getAllStates}({})
 * @param {StateQueryOptions} options - {@link StateQueryOptions} Options for filtering, sorting, and including related entities.
 * @param {StateFilter} [options.filter={}] - {@link StateFilter} Filtering parameters.
 * @param {StateSort} [options.sort={field: 'id', direction: 'asc'}] - {@link StateSort} Sorting parameters.
 * @param {StateInclude} [options.include={}] - {@link StateInclude} Parameters to include related entities (country).
 * @returns {Promise<{ data: any[], meta: { filter: StateFilter, orderBy: StateSort, total: number, rawsql: string } }>} The state data along with metadata including filter, order, total count, and raw SQL query.
 * @example
 * const sr = new StateRepository();
 * const states = await sr.getAllStates({ filter: { name: 'State' }, sort: { field: 'name', direction: 'asc' }, include: { country: true, count: true } });
 * // returns { data: State[], meta: { filter: StateFilter, orderBy: StateSort, total: number, rawsql: string } }
 */
  async getAllStates({filter={}, sort = {field: 'id', direction: 'asc'}, include = {}}: StateQueryOptions){
    const qb = this.db;
    let query = qb.select({
      state: {
        ...this.table, 
        ...(include?.country ? {country} : {}) 
      }
    }).from(this.table).$dynamic();
    if (Object.keys(filter).length) {
      query = this.addFilters(query, filter)
    }
    if(include?.country){
      query = query.leftJoin(country, eq(state.country_id, country.id))
    }
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(this.table[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {
      data: include?.count ? (await query).map(({state}) => this.countRelatedEntities(state)).map(state => this.includeRelatedEntities(state, include)) : (await query).map(({state}) => this.includeRelatedEntities(state, include)), 
      meta: {filter, orderBy: sort, total, rawsql}
    }
    return result
  }

/**
 * Finds a state by its ID with optional related entities.
 * @async {@link findStateById}
 * @param {number} id - The ID of the state to find.
 * @param {StateInclude} [include] - {@link StateInclude} Optional parameter to include related entities (country).
 * @returns {Promise<{ data: any[], meta: { rawsql: string } }>} The state data along with optional related entities and raw SQL query.
 * @example
 * const sr = new StateRepository();
 * const state = await sr.findStateById(1);
 * // returns { data: State[], meta: {rawsql: string}}
 * const stateWithIncludesAndCounts = await sr.findStateById(1, { country: true, count: true });
 * // returns { data: StateWithIncludesAndCount[], meta: {rawsql: string}}
 */
  async findStateById(id: number, include?: StateInclude){
    const qb = this.db;
    let query = qb.select({
      state: {
        ...this.table, 
        ...(include?.country ? {country} : {}) 
      }
    }).from(this.table).where(eq(state.id, id)).$dynamic();
    if(include?.country){
      query = query.leftJoin(country, eq(state.country_id, country.id))
    }
    const rawsql = query.toSQL()
    const result = {data: include?.count ? (await query).map(({state}) => this.countRelatedEntities(state)).map(state => this.includeRelatedEntities(state, include)) : (await query).map(({state}) => this.includeRelatedEntities(state, include)), meta: {rawsql}}
    return result
  }

    /**
   * Updates a state.
   * @param {number} id - The ID of the state to update.
   * @param {Partial<Omit<State, 'id'>>} updates - The updates to apply to the state.
   * @returns {Promise<void>}
   * @example
   * await stateRepository.updateState(1, { name: 'Updated State Name' });
   */
    async updateState(id: number, updates: Partial<Omit<State, 'id'>>): Promise<void> {
      await db.update(this.table).set(updates).where(eq(this.table.id, id));
    }

  /**
   * Deletes a state.
   * @param {number} id - The ID of the state to delete.
   * @returns {Promise<void>}
   * @example
   * await stateRepository.deleteState(1);
   */
  async deleteState(id: number): Promise<void> {
    await db.delete(this.table).where(eq(this.table.id, id));
  }

  addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: StateFilter){
    const whereOptions = this.getWhereOptions(filter);
    if (whereOptions) {
      return qb.where(whereOptions)
    }
    return qb
  }

  // getWhereOptions(filter: StateFilter){
  //   const filterOperation = filter?.operation === 'or' ? or : and
  //   const conditions: SQLWrapper[] = []
  //   if (filter.id) conditions.push(eq(state.id, filter.id))
  //   if (filter.name) conditions.push(like(state.name, `%${filter.name}%`))
  //   if (filter.country_id) conditions.push(eq(state.country_id, filter.country_id))
  //   if (filter.country_code) conditions.push(eq(state.country_code, filter.country_code))
  //   if (filter.country_name) conditions.push(like(state.country_name, `%${filter.country_name}%`))
  //   if (filter.state_code) conditions.push(eq(state.state_code, filter.state_code))
  //   if (filter.type) conditions.push(like(state.type, `%${filter.type}%`))
  //   return conditions.length ? filterOperation(...conditions) : null;
  // }

/**
 * Counts the number of related states and countries for a given state.
 * @param {number} stateId - The ID of the state.
 * @returns {Promise<{ statesCount: number, countriesCount: number }>} The count of related states and countries.
 * @example
 * const counts = stateRepository.countRelatedEntities({region_id: 1});
 * console.log('Related Entities Count:', counts);
 */
  countRelatedEntities({id, ...rest}: {id: number}) {
    const cityCountResult = db
      .select({ count: sql`COUNT(*)` })
      .from(city)
      .where(eq(city.state_id, id))
      .all();
    const cityCount = cityCountResult[0].count;
    return { id, ...rest, cityCount };
  }

  includeRelatedEntities({id, ...rest}: {id: number}, include?: StateInclude){
    const cities = include?.cities ? db
      .select()
      .from(city)
      .where(eq(city.state_id, id))
      .all() : [];
    return { id, ...rest, cities };
  }
}

export const stateRepository = new StateRepository()
