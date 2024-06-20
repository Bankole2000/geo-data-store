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
exports.subregionRepository = exports.SubregionRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const Common_1 = require("./Common");
class SubregionRepository extends Common_1.CommonSQLite {
    constructor() {
        super(...arguments);
        this.db = db_1.db;
        this.table = schema_1.subregion;
    }
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
    createSubregion(name, region_id, translations, wikiDataId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newSubregion] = yield this.db.insert(this.table).values({ name, translations, region_id, wikiDataId }).returning();
            return newSubregion;
        });
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
    getSubregions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                subregion: Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.region) ? { region: schema_1.region } : {})),
            }).from(this.table).$dynamic();
            if (filter) {
                query = this.addFilters(query, filter);
            }
            if (include === null || include === void 0 ? void 0 : include.region) {
                query = query.leftJoin(schema_1.region, (0, drizzle_orm_1.eq)(schema_1.subregion.region_id, schema_1.region.id));
            }
            query = this.addPagination(query, page, limit);
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(schema_1.subregion[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = {
                data: (include === null || include === void 0 ? void 0 : include.count) && total ? (yield query).map(({ subregion }) => this.countRelatedEntities(subregion)).map(subregion => this.includeRelatedEntities(subregion, include)) : (yield query).map(({ subregion }) => this.includeRelatedEntities(subregion, include)),
                meta: { filter, orderBy: sort, page, limit, total, pages: Math.ceil(total / limit), rawsql }
            };
            // const result = {data: include?.count ? (await query).map(({subregion}) => subregion) : (await query).map(({subregion}) => subregion), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
            return result;
        });
    }
    getAllSubregions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                subregion: Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.region) ? { region: schema_1.region } : {}))
            }).from(this.table).$dynamic();
            if (filter) {
                query = this.addFilters(query, filter);
            }
            if (include === null || include === void 0 ? void 0 : include.region) {
                query = query.leftJoin(schema_1.region, (0, drizzle_orm_1.eq)(schema_1.subregion.region_id, schema_1.region.id));
            }
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(this.table[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = { data: (include === null || include === void 0 ? void 0 : include.count) && total ? (yield query).map(({ subregion }) => this.countRelatedEntities(subregion)).map(subregion => this.includeRelatedEntities(subregion, include)) : (yield query).map(({ subregion }) => this.includeRelatedEntities(subregion, include)), meta: { filter, orderBy: sort, total, rawsql } };
            return result;
        });
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
    findSubregionById(id, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = this.db;
            let query = qb.select({
                subregion: Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.region) ? { region: schema_1.region } : {}))
            }).from(this.table).where((0, drizzle_orm_1.eq)(schema_1.subregion.id, id)).$dynamic();
            if (include === null || include === void 0 ? void 0 : include.region) {
                query = query.leftJoin(schema_1.region, (0, drizzle_orm_1.eq)(schema_1.subregion.region_id, schema_1.region.id));
            }
            const rawsql = query.toSQL();
            const result = { data: (include === null || include === void 0 ? void 0 : include.count) ? (yield query).map(({ subregion }) => this.countRelatedEntities(subregion)).map(subregion => this.includeRelatedEntities(subregion, include)) : (yield query).map(({ subregion }) => this.includeRelatedEntities(subregion, include)), meta: { rawsql } };
            return result;
        });
    }
    /**
   * Updates a subregion.
   * @param {number} id - The ID of the subregion to update.
   * @param {Partial<Omit<Subregion, 'id'>>} updates - The updates to apply to the subregion.
   * @returns {Promise<void>}
   * @example
   * await subregionRepository.updateSubregion(1, { name: 'Updated Subregion Name' });
   */
    updateSubregion(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.update(this.table).set(updates).where((0, drizzle_orm_1.eq)(this.table.id, id));
        });
    }
    /**
 * Deletes a subregion.
 * @param {number} id - The ID of the subregion to delete.
 * @returns {Promise<void>}
 * @example
 * await subregionRepository.deleteSubregion(1);
 */
    deleteSubregion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.delete(this.table).where((0, drizzle_orm_1.eq)(this.table.id, id));
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
            conditions.push((0, drizzle_orm_1.like)(schema_1.subregion.name, `%${filter.name}%`));
        if (filter.wikiDataId)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.subregion.wikiDataId, filter.wikiDataId));
        if (filter.region_id)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.subregion.region_id, filter.region_id));
        return conditions.length ? filterOperation(...conditions) : null;
    }
    /**
     * Counts the number of related subregions and countries for a given subregion.
     * @param {number} subregionId - The ID of the subregion.
     * @returns {Promise<{ subregionsCount: number, countriesCount: number }>} The count of related subregions and countries.
     * @example
     * const counts = subregionRepository.countRelatedEntities({region_id: 1});
     * console.log('Related Entities Count:', counts);
     */
    countRelatedEntities(_a) {
        var { id } = _a, rest = __rest(_a, ["id"]);
        const countryCountResult = db_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.country)
            .where((0, drizzle_orm_1.eq)(schema_1.country.subregion_id, id))
            .all();
        const countryCount = countryCountResult[0].count;
        return Object.assign(Object.assign({ id }, rest), { countryCount });
    }
    includeRelatedEntities(_a, include) {
        var { id } = _a, rest = __rest(_a, ["id"]);
        const countries = (include === null || include === void 0 ? void 0 : include.countries) ? db_1.db
            .select()
            .from(schema_1.country)
            .where((0, drizzle_orm_1.eq)(schema_1.country.region_id, id))
            .all() : [];
        return Object.assign(Object.assign({ id }, rest), { countries });
    }
}
exports.SubregionRepository = SubregionRepository;
exports.subregionRepository = new SubregionRepository();
