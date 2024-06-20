"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionRepository = exports.RegionRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const Common_1 = require("./Common");
class RegionRepository extends Common_1.CommonSQLite {
    constructor() {
        super(...arguments);
        this.db = db_1.db;
        this.table = schema_1.region;
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
    createRegion(name, translations, wikiDataId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newRegion] = yield this.db.insert(this.table).values({ name, translations, wikiDataId }).returning();
            return newRegion;
        });
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
    getRegions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                region: Object.assign({}, this.table)
            }).from(this.table).$dynamic();
            if (filter) {
                query = this.addFilters(query, filter);
            }
            query = this.addPagination(query, page, limit);
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(this.table[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = { data: (include === null || include === void 0 ? void 0 : include.count) && total ? (yield query).map(({ region }) => this.countRelatedEntities) : (yield query), meta: { filter, orderBy: sort, page, limit, total, pages: Math.ceil(total / limit), rawsql } };
            return result;
        });
    }
    getAllRegions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                region: Object.assign({}, this.table)
            }).from(this.table).$dynamic();
            if (filter) {
                query = this.addFilters(query, filter);
            }
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(this.table[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = { data: (include === null || include === void 0 ? void 0 : include.count) && total ? (yield query).map(({ region }) => this.countRelatedEntities(region)).map(region => this.includeRelatedEntities(region, include)) : (yield query).map(({ region }) => this.includeRelatedEntities(region, include)), meta: { filter, orderBy: sort, total, rawsql } };
            return result;
        });
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
    findRegionById(id, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = this.db;
            let query = qb.select({
                region: Object.assign({}, this.table)
            }).from(this.table).where((0, drizzle_orm_1.eq)(schema_1.region.id, id)).$dynamic();
            const rawsql = query.toSQL();
            const result = { data: (include === null || include === void 0 ? void 0 : include.count) ? (yield query).map(({ region }) => this.countRelatedEntities(region)).map(region => this.includeRelatedEntities(region, include)) : (yield query).map(({ region }) => this.includeRelatedEntities(region, include)), meta: { rawsql } };
            return result;
        });
    }
    /**
   * Updates a region.
   * @param {number} id - The ID of the region to update.
   * @param {Partial<Omit<Region, 'id'>>} updates - The updates to apply to the region.
   * @returns {Promise<void>}
   * @example
   * await regionRepository.updateRegion(1, { name: 'Updated Region Name' });
   */
    updateRegion(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.update(schema_1.region).set(updates).where((0, drizzle_orm_1.eq)(schema_1.region.id, id));
        });
    }
    /**
 * Deletes a region.
 * @param {number} id - The ID of the region to delete.
 * @returns {Promise<void>}
 * @example
 * await regionRepository.deleteRegion(1);
 */
    deleteRegion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.delete(schema_1.region).where((0, drizzle_orm_1.eq)(schema_1.region.id, id));
        });
    }
    addFilters(qb, filter) {
        const whereOptions = this.getWhereOptions(filter);
        if (whereOptions) {
            return qb.where(whereOptions);
        }
        return qb;
    }
    getWhereOptions(filter) {
        const filterOperation = (filter === null || filter === void 0 ? void 0 : filter.operation) === 'or' ? drizzle_orm_1.or : drizzle_orm_1.and;
        const conditions = [];
        if (filter.name)
            conditions.push((0, drizzle_orm_1.like)(schema_1.region.name, `%${filter.name}%`));
        if (filter.wikiDataId)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.region.wikiDataId, filter.wikiDataId));
        return conditions.length ? filterOperation(...conditions) : null;
    }
    /**
     * Counts the number of related subregions and countries for a given region.
     * @param {number} regionId - The ID of the region.
     * @returns {Promise<{ subregionsCount: number, countriesCount: number }>} The count of related subregions and countries.
     * @example
     * const counts = regionRepository.countRelatedEntities({region_id: 1});
     * console.log('Related Entities Count:', counts);
     */
    countRelatedEntities(_a) {
        var { id } = _a, rest = __rest(_a, ["id"]);
        const subregionCountResult = db_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.subregion)
            .where((0, drizzle_orm_1.eq)(schema_1.subregion.region_id, id))
            .all();
        const countryCountResult = db_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.country)
            .where((0, drizzle_orm_1.eq)(schema_1.country.region_id, id))
            .all();
        const subregionCount = subregionCountResult[0].count;
        const countryCount = countryCountResult[0].count;
        return Object.assign(Object.assign({ id }, rest), { subregionCount, countryCount });
    }
    includeRelatedEntities(_a, include) {
        var { id } = _a, rest = __rest(_a, ["id"]);
        const subregions = (include === null || include === void 0 ? void 0 : include.subregions) ? db_1.db
            .select()
            .from(schema_1.subregion)
            .where((0, drizzle_orm_1.eq)(schema_1.subregion.region_id, id))
            .all() : [];
        const countries = (include === null || include === void 0 ? void 0 : include.countries) ? db_1.db
            .select()
            .from(schema_1.country)
            .where((0, drizzle_orm_1.eq)(schema_1.country.region_id, id))
            .all() : [];
        return Object.assign(Object.assign(Object.assign({ id }, rest), ((include === null || include === void 0 ? void 0 : include.subregions) ? { subregions } : {})), ((include === null || include === void 0 ? void 0 : include.countries) ? { countries } : {}));
    }
}
exports.RegionRepository = RegionRepository;
exports.regionRepository = new RegionRepository();
