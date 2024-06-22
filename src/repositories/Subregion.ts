import { like, eq, sql, asc, desc, count, and, or, SQLWrapper } from "drizzle-orm";
import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { db } from "../db";
import { subregion, country, region } from "../db/schema";
import { CommonSQLite } from "./Common";
import { Subregion, SubregionFilter, SubregionSort, SubregionInclude, SubregionQueryOptions } from "../utils/customtypes";

export class SubregionRepository extends CommonSQLite<typeof subregion> {
  db = db
  table = subregion
  
  /**
   * Creates a new subregion.
   * @param {string} name - The name of the subregion.
   * @param {string} translations - JSON string of translations for the subregion.
   * @param {string} wikiDataId - The WikiData ID for the subregion.
   * @returns {Promise<Subregion>} The newly created subregion.
   * @example
   * const newSubregion = await subregionRepository.createSubregion('Subregion Name', '{}', 'wikiDataId1');
   * console.log('New Subregion:', newSubsubregion);
   */
  async createSubregion(name: string, region_id: number, translations: unknown, wikiDataId: string): Promise<Subregion> {
    const [newSubregion] = await this.db.insert(this.table).values({ name, translations, region_id, wikiDataId }).returning();
    return newSubregion;
  }

  /**
   * Retrieves a paginated list of subregions.
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of subregions per page.
   * @param {SubregionFilter} [filter] - Filtering parameters.
   * @param {SubregionSort} [sort] - Sorting parameters.
   * @param {SubregionInclude} [include] - Sorting parameters.
   * @param {boolean} [include.subregions=false] - Whether to include related subregions.
   * @param {boolean} [include.countries=false] - Whether to include related countries.
   * @returns {Promise<Subregion[]>} The list of subregions.
   * @example
   * const paginatedSubregions = await subregionRepository.getSubregions(1, 10, { name: 'Subregion' }, { field: 'name', direction: 'asc' }, true, true);
   * console.log('Paginated Subregions:', paginatedSubregions);
   */
  async getSubregions({page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {}} :
    {
      page?: number,
      limit?: number,
    } & SubregionQueryOptions
  ) {
    const qb = this.db;
    let query = qb.select({
      subregion: {
        ...this.table,
        ...(include?.region ? {region} : {})
      },
    }).from(this.table).$dynamic();
    if (Object.keys(filter).length) {
      query = this.addFilters(query, filter)
    }
    if(include?.region){
      query = query.leftJoin(region, eq(subregion.region_id, region.id))
    }
    query = this.addPagination(query, page, limit)
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(subregion[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {
      data: include?.count && total ? (await query).map(({subregion}) => this.countRelatedEntities(subregion)).map(subregion => this.includeRelatedEntities(subregion, include)) : (await query).map(({subregion}) => this.includeRelatedEntities(subregion, include)), 
      meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}
    }
    // const result = {data: include?.count ? (await query).map(({subregion}) => subregion) : (await query).map(({subregion}) => subregion), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
    return result
  }

/**
 * Retrieves all subregions with optional filtering, sorting, and inclusion of related entities.
 * @async await (new {@link SubregionRepository}()).{@link getAllSubregions}({})
 * @param {SubregionQueryOptions} options - {@link SubregionQueryOptions} Options for filtering, sorting, and including related entities.
 * @param {SubregionFilter} [options.filter={}] - {@link SubregionFilter} Filtering parameters.
 * @param {SubregionSort} [options.sort={field: 'id', direction: 'asc'}] - {@link SubregionSort} Sorting parameters.
 * @param {SubregionInclude} [options.include={}] - {@link SubregionInclude} Parameters to include related entities (region).
 * @returns {Promise<{ data: any[], meta: { filter: SubregionFilter, orderBy: SubregionSort, total: number, rawsql: string } }>} The subregion data along with metadata including filter, order, total count, and raw SQL query.
 * @example
 * const sr = new SubregionRepository();
 * const subregions = await sr.getAllSubregions({ filter: { name: 'Subregion' }, sort: { field: 'name', direction: 'asc' }, include: { region: true, count: true } });
 * // returns { data: Subregion[], meta: { filter: SubregionFilter, orderBy: SubregionSort, total: number, rawsql: string } }
 */
  async getAllSubregions({filter={}, sort = {field: 'id', direction: 'asc'}, include = {}}: SubregionQueryOptions){
    const qb = this.db;
    let query = qb.select({
      subregion: {
        ...this.table, 
        ...(include?.region ? {region} : {}) 
      }
    }).from(this.table).$dynamic();
    if (Object.keys(filter).length) {
      query = this.addFilters(query, filter)
    }
    if(include?.region){
      query = query.leftJoin(region, eq(subregion.region_id, region.id))
    }
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(this.table[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {data: include?.count && total ? (await query).map(({subregion}) => this.countRelatedEntities(subregion)).map(subregion => this.includeRelatedEntities(subregion, include)) : (await query).map(({subregion}) => this.includeRelatedEntities(subregion, include)), meta: {filter, orderBy: sort, total, rawsql}}
    return result
  }

/**
 * Finds a subregion by its ID with optional related entities.
 * @async {@link findSubregionById}
 * @param {number} id - The ID of the subregion to find.
 * @param {SubregionInclude} [include] - {@link SubregionInclude} Optional parameter to include related entities (region).
 * @returns {Promise<{ data: any[], meta: { rawsql: string } }>} The subregion data along with optional related entities and raw SQL query.
 * @example
 * const sr = new SubregionRepository();
 * const subregion = await sr.findSubregionById(1);
 * // returns { data: Subregion[], meta: {rawsql: string}}
 * const subregionWithIncludesAndCounts = await sr.findSubregionById(1, { region: true, count: true });
 * // returns { data: SubregionWithIncludesAndCount[], meta: {rawsql: string}}
 */
  async findSubregionById(id: number, include?: SubregionInclude){
    const qb = this.db;
    let query = qb.select({
      subregion: {
        ...this.table, 
        ...(include?.region ? {region} : {}) 
      }
    }).from(this.table).where(eq(subregion.id, id)).$dynamic();
    if(include?.region){
      query = query.leftJoin(region, eq(subregion.region_id, region.id))
    }
    const rawsql = query.toSQL()
    const result = {data: include?.count ? (await query).map(({subregion}) => this.countRelatedEntities(subregion)).map(subregion => this.includeRelatedEntities(subregion, include)) : (await query).map(({subregion}) => this.includeRelatedEntities(subregion, include)), meta: {rawsql}}
    return result
  }

    /**
   * Updates a subregion.
   * @param {number} id - The ID of the subregion to update.
   * @param {Partial<Omit<Subregion, 'id'>>} updates - The updates to apply to the subregion.
   * @returns {Promise<void>}
   * @example
   * await subregionRepository.updateSubregion(1, { name: 'Updated Subregion Name' });
   */
    async updateSubregion(id: number, updates: Partial<Omit<Subregion, 'id'>>): Promise<void> {
      await db.update(this.table).set(updates).where(eq(this.table.id, id));
    }

      /**
   * Deletes a subregion.
   * @param {number} id - The ID of the subregion to delete.
   * @returns {Promise<void>}
   * @example
   * await subregionRepository.deleteSubregion(1);
   */
  async deleteSubregion(id: number): Promise<void> {
    await db.delete(this.table).where(eq(this.table.id, id));
  }

  addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: SubregionFilter){
    const whereOptions = this.getWhereOptions(filter);
    if (whereOptions) {
      return qb.where(whereOptions)
    }
    return qb
  }

  // getWhereOptions(filter: SubregionFilter){
  //   const filterOperation = filter?.operation === 'or' ? or : and
  //   const conditions: SQLWrapper[] = []
  //   if (filter.name) conditions.push(like(subregion.name, `%${filter.name}%`))
  //   if (filter.wikiDataId) conditions.push(eq(subregion.wikiDataId, filter.wikiDataId))
  //   if (filter.region_id) conditions.push(eq(subregion.region_id, filter.region_id))
  //   return conditions.length ? filterOperation(...conditions) : null;
  // }

/**
 * Counts the number of related subregions and countries for a given subregion.
 * @param {number} subregionId - The ID of the subregion.
 * @returns {Promise<{ subregionsCount: number, countriesCount: number }>} The count of related subregions and countries.
 * @example
 * const counts = subregionRepository.countRelatedEntities({region_id: 1});
 * console.log('Related Entities Count:', counts);
 */
  countRelatedEntities({id, ...rest}: {id: number}) {
    const countryCountResult = db
      .select({ count: sql`COUNT(*)` })
      .from(country)
      .where(eq(country.subregion_id, id))
      .all();
    const countryCount = countryCountResult[0].count;
    return { id, ...rest, countryCount };
  }

  includeRelatedEntities({id, ...rest}: {id: number}, include?: SubregionInclude){
    const countries = include?.countries ? db
      .select()
      .from(country)
      .where(eq(country.region_id, id))
      .all() : [];
    return { id, ...rest, countries };
  }
}

export const subregionRepository = new SubregionRepository()
