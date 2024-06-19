import { like, eq, sql, asc, desc, count, and, or, SQLWrapper } from "drizzle-orm";
import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { db } from "../db";
import { region, country, subregion } from "../db/schema";
import { CommonSQLite } from "./Common";
import { Region, TRegionTranslation } from "../utils/customtypes";

interface RegionFilter {
  name?: string;
  wikiDataId?: string;
  operation?: 'and' | 'or'
}

interface RegionInclude {
  subregions?: boolean;
  countries?: boolean;
  count?: boolean;
}

interface RegionSort {
  field: keyof Region;
  direction: 'asc' | 'desc';
}

export class RegionRepository extends CommonSQLite {
  db = db
  table = region
  select = { 
    id: region.id, 
    name: region.name,
    wikiDataId: region.wikiDataId,
    translation: region.translations,
    // countryCount: sql<number>`cast(count('${country.region_id}') as int)`,
    // total: count(region.id),
  }
  
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
  async createRegion(name: string, translations: TRegionTranslation, wikiDataId: string): Promise<Region> {
    const [newRegion] = await this.db.insert(this.table).values({ name, translations, wikiDataId }).returning();
    return newRegion;
  }

  /**
   * Retrieves a paginated list of regions.
   * @param {number} page - The page number to retrieve.
   * @param {number} limit - The number of regions per page.
   * @param {RegionFilter} [filter] - Filtering parameters.
   * @param {RegionSort} [sort] - Sorting parameters.
   * @param {RegionInclude} [include] - Sorting parameters.
   * @param {boolean} [include.subregions=false] - Whether to include related subregions.
   * @param {boolean} [include.countries=false] - Whether to include related countries.
   * @returns {Promise<Region[]>} The list of regions.
   * @example
   * const paginatedRegions = await regionRepository.getRegions(1, 10, { name: 'Region' }, { field: 'name', direction: 'asc' }, true, true);
   * console.log('Paginated Regions:', paginatedRegions);
   */
  async getRegions({page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {}} :
    {
      page?: number,
      limit?: number,
      filter?: RegionFilter,
      sort?: RegionSort,
      include?: RegionInclude
    }
  ) {
    const qb = this.db;
    let query = qb.select({
      ...this.select, 
    }).from(this.table).$dynamic();
    if (filter) {
      query = this.addFilters(query, filter)
    }
    query = this.addPagination(query, page, limit)
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(this.table[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    const result = {data: include?.count && total ? (await query).map(this.countRelatedEntities) : (await query), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
    return result
  }

  async getAllRegions({filter={}, sort = {field: 'id', direction: 'asc'}, include = {}}: 
  {
    filter?: RegionFilter,
    sort?: RegionSort,
    include?: RegionInclude
  }){
    const qb = this.db;
    let query = qb.select({
      ...this.select, 
    }).from(this.table).$dynamic();
    if (filter) {
      query = this.addFilters(query, filter)
    }
    const direction = sort.direction === 'asc' ? asc : desc
    query = query.orderBy(direction(this.table[sort.field]));
    const total = (filter ? await db.select({count: count()}).from(this.table).where(this.getWhereOptions(filter)!) : await db.select({count: count()}).from(this.table))[0].count
    const rawsql = query.toSQL()
    // let data = include?.count ? (await query).map(this.countRelatedEntities) : (await query)
    // if(include?.countries || include?.subregions){
    //   data = data.map(x => this.includeRelatedEntities(x, include))
    // }
    const result = {data: include?.count && total ? (await query).map(this.countRelatedEntities).map(x => this.includeRelatedEntities(x, include)) : (await query).map(x => this.includeRelatedEntities(x, include)), meta: {filter, orderBy: sort, total, rawsql}}
    return result
  }

  async findRegionById(id: string | number, include?: RegionInclude){

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

  getWhereOptions(filter: RegionFilter){
    const filterOperation = filter?.operation === 'or' ? or : and
    const conditions: SQLWrapper[] = []
    if (filter.name) conditions.push(like(region.name, `%${filter.name}%`))
    if (filter.wikiDataId) conditions.push(eq(region.wikiDataId, filter.wikiDataId))
    return conditions.length ? filterOperation(...conditions) : null;
  }

  // /**
  //  * Counts the number of related subregions and countries for a given region.
  //  * @param {number} regionId - The ID of the region.
  //  * @returns {Promise<{ subregionsCount: number, countriesCount: number }>} The count of related subregions and countries.
  //  * @example
  //  * const counts = await regionRepository.countRelatedEntities(1);
  //  * console.log('Related Entities Count:', counts);
  //  */
  // async countRelatedEntities(regionId: number): Promise<{ subregionsCount: number, countriesCount: number }> {
  //   const subregionsCount = await db.select(subregion).where(eq(subregion.region_id, regionId)).count();
  //   const countriesCount = await db.select(country).where(eq(country.region_id, regionId)).count();

  //   return { subregionsCount, countriesCount };
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
