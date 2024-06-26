import { like, eq, sql, asc, desc, count, and, or, SQLWrapper } from "drizzle-orm";
import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { db } from "../db";
import { region, country, subregion } from "../db/schema";
import { CommonSQLite } from "./Common";
import { Region, RegionFilter, RegionInclude, RegionQueryOptions, RegionSort, TRegionTranslation } from "../utils/customtypes";

export class RegionRepository extends CommonSQLite<typeof region> {
  db = db
  table = region
  
  /**
   * Creates a new region.
   * @param {string} name - The name of the region.
   * @param {string} translations - JSON string of translations for the region.
   * @param {string} wikiDataId - The WikiData ID for the region.
   * @returns {Promise<Region>} The newly created region.
   * @example
   * const newRegion = await regionRepository.createRegion('Region Name', '{}', 'wikiDataId1');
   * console.log('New Region:', newRegion);
   */
  async createRegion(name: string, translations: TRegionTranslation, wikiDataId: string) {
    const [newRegion] = await this.db.insert(this.table).values({ name, translations, wikiDataId }).returning();
    return newRegion;
  }

  /**
   * Retrieves a paginated list of regions.
   * @async (new {@link RegionRepository}).{@link getRegions}({})
   * @param {RegionQueryOptions & { page?: number, limit?: number,}} [options] - Region query options and pagination parameters.
   * @param {number} [options.page] - The page number to retrieve.
   * @param {number} [options.limit] - The number of regions per page.
   * @param {RegionFilter} [options.filter] - Filtering parameters.
   * @param {RegionSort} [options.sort] - Sorting parameters.
   * @param {RegionInclude} [options.include] - Resources to include.
   * @param {boolean} [include.subregions=false] - Whether to include related subregions.
   * @param {boolean} [include.countries=false] - Whether to include related countries.
   * @returns {Promise<{data: any[], meta: any}>} Promise<{data: Region[], meta: any}> The list of regions.
   * @example
   * const paginatedRegions = await regionRepository.getRegions(1, 10, { name: 'Region' }, { field: 'name', direction: 'asc' }, true, true);
   * console.log('Paginated Regions:', paginatedRegions);
   */
  async getRegions({page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {}} :
    {
      page?: number,
      limit?: number,
    } & RegionQueryOptions
  ) {
    const qb = this.db;
    let query = qb.select({
      region: {
        ...this.table, 
      }
    }).from(this.table).$dynamic();
    if (Object.keys(filter).length) {
      query = this.addFilters(query, filter)
    }
    query = this.addPagination(query, page, limit)
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(this.table[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {data: include?.count && total ? (await query).map(({region}) => this.countRelatedEntities) : (await query), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
    return result
  }

/**
 * Retrieves all regions with optional filtering, sorting, and inclusion of related entities.
 * @async (new {@link RegionRepository}).{@link getAllRegions}({})
 * @param {Object} [options] - {@link RegionQueryOptions} Options for filtering, sorting, and including related entities.
 * @param {RegionFilter} [options.filter={}] - {@link RegionFilter} Filtering parameters.
 * @param {RegionSort} [options.sort={field: 'id', direction: 'asc'}] - {@link RegionSort} Sorting parameters.
 * @param {RegionInclude} [options.include={}] - {@link RegionInclude} Parameters to include related entities.
 * @returns {Promise<{ data: any[], meta: { filter: RegionFilter, orderBy: RegionSort, total: number, rawsql: string } }>} The region data along with metadata including filter, order, total count, and raw SQL query.
 * @example
 * const rr = new RegionRepository();
 * const regions = await rr.getAllRegions({ filter: { name: 'Region' }, sort: { field: 'name', direction: 'asc' }, include: { count: true } });
 * // returns { data: Region[], meta: { filter: RegionFilter, orderBy: RegionSort, total: number, rawsql: string } }
 */
  async getAllRegions({filter={}, sort = {field: 'id', direction: 'asc'}, include = {}}: RegionQueryOptions){
    const qb = this.db;
    let query = qb.select({
      region: {
        ...this.table
      }
    }).from(this.table).$dynamic();
    if (Object.keys(filter).length) {
      query = this.addFilters(query, filter)
    }
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(this.table[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {data: include?.count && total ? (await query).map(({region}) => this.countRelatedEntities(region)).map(region => this.includeRelatedEntities(region, include)) : (await query).map(({region}) => this.includeRelatedEntities(region, include)), meta: {filter, orderBy: sort, total, rawsql}}
    return result
  }

  /**
 * Finds a region by its ID with optional related entities.
 * @async {@link findRegionById}
 * @param {number} id - The ID of the region to find.
 * @param {RegionInclude} [include] - {@link RegionInclude} Optional parameter to include related entities.
 * @returns {Promise<{ data: any[], meta: { rawsql: string } }>} The region data along with optional related entities and raw SQL query.
 * @example
 * const rr = new RegionRepository();
 * const region = await rr.findRegionById(1);
 * // returns { data: Region[], meta: {rawsql: string}}
 * const regionWithIncludesAndCounts = await rr.findRegionById(1, { count: true });
 * // returns { data: RegionWithIncludesAndCount[], meta: {rawsql: string}}
 */
  async findRegionById(id: number, include?: RegionInclude){
    const qb = this.db;
    let query = qb.select({
      region: {
        ...this.table,
      }
    }).from(this.table).where(eq(region.id, id)).$dynamic();
    const rawsql = query.toSQL()
    const result = {data: include?.count ? (await query).map(({region}) => this.countRelatedEntities(region)).map(region => this.includeRelatedEntities(region, include)) : (await query).map(({region}) => this.includeRelatedEntities(region, include)), meta: {rawsql}}
    return result
  }

    /**
   * Updates a region.
   * @param {number} id - The ID of the region to update.
   * @param {Partial<Omit<Region, 'id'>>} updates - The updates to apply to the region.
   * @returns {Promise<void>}
   * @example
   * await regionRepository.updateRegion(1, { name: 'Updated Region Name' });
   */
    async updateRegion(id: number, updates: Partial<Omit<Region, 'id'>>): Promise<void> {
      await db.update(region).set(updates).where(eq(region.id, id));
    }

      /**
   * Deletes a region.
   * @param {number} id - The ID of the region to delete.
   * @returns {Promise<void>}
   * @example
   * await regionRepository.deleteRegion(1);
   */
  async deleteRegion(id: number): Promise<void> {
    await db.delete(region).where(eq(region.id, id));
  }

  addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: RegionFilter){
    const whereOptions = this.getWhereOptions(filter);
    if (whereOptions) {
      return qb.where(whereOptions)
    }
    return qb
  }

  // getWhereOptions(filter: RegionFilter){
  //   const filterOperation = filter?.operation === 'or' ? or : and
  //   const conditions: SQLWrapper[] = []
  //   if (filter.name) conditions.push(like(region.name, `%${filter.name}%`))
  //   if (filter.wikiDataId) conditions.push(eq(region.wikiDataId, filter.wikiDataId))
  //   return filterOperation(...conditions);
  // }

  /**
   * Counts the number of related subregions and countries for a given region.
   * @param {number} regionId - The ID of the region.
   * @returns {Promise<{ subregionsCount: number, countriesCount: number }>} The count of related subregions and countries.
   * @example
   * const counts = regionRepository.countRelatedEntities({region_id: 1});
   * console.log('Related Entities Count:', counts);
   */
    countRelatedEntities({id, ...rest}: {id: number}) {
      const subregionCountResult = db
        .select({ count: sql`COUNT(*)` })
        .from(subregion)
        .where(eq(subregion.region_id, id))
        .all();
      const countryCountResult = db
        .select({ count: sql`COUNT(*)` })
        .from(country)
        .where(eq(country.region_id, id))
        .all();
  
      const subregionCount = subregionCountResult[0].count;
      const countryCount = countryCountResult[0].count;
  
      return { id, ...rest, subregionCount, countryCount };
    }

    includeRelatedEntities({id, ...rest} : {id: number}, include?: RegionInclude){
      const subregions = include?.subregions ? db
        .select()
        .from(subregion)
        .where(eq(subregion.region_id, id))
        .all() : [];
      const countries = include?.countries ? db
        .select()
        .from(country)
        .where(eq(country.region_id, id))
        .all() : [];
      return { id, ...rest, ...(include?.subregions ? {subregions} : {}), ...(include?.countries ? {countries} : {}) };
    }

}

export const regionRepository = new RegionRepository()
