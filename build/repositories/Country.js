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
exports.countryRepository = exports.CountryRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const Common_1 = require("./Common");
class CountryRepository extends Common_1.CommonSQLite {
    constructor() {
        super(...arguments);
        this.db = db_1.db;
        this.table = schema_1.country;
    }
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
    createCountry(countryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newCountry] = yield db_1.db.insert(schema_1.country).values(countryData).returning();
            return newCountry;
        });
    }
    /**
     * Retrieves a paginated list of countries.
     * @param {number} page - The page number to retrieve.
     * @param {number} limit - The number of countries per page.
     * @param {CountryFilter} [filter] - Filtering parameters.
     * @param {CountrySort} [sort] - Sorting parameters.
     * @param {CountryInclude} [include] - Sorting parameters.
     * @param {boolean} [include.states=false] - Whether to include related countries.
     * @param {boolean} [include.cities=false] - Whether to include related countries.
     * @returns {Promise<Country[]>} The list of countries.
     * @example
     * const paginatedCountries = await countryRepository.getCountries(1, 10, { name: 'Country' }, { field: 'name', direction: 'asc' }, true, true);
     * console.log('Paginated Countries:', paginatedCountries);
     */
    getCountries(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                country: Object.assign(Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.region) ? { region: schema_1.region } : {})), ((include === null || include === void 0 ? void 0 : include.subregion) ? { subregion: schema_1.subregion } : {})),
            }).from(this.table).$dynamic();
            if (Object.keys(filter).length) {
                query = this.addFilters(query, filter);
            }
            if (include === null || include === void 0 ? void 0 : include.region) {
                query = query.leftJoin(schema_1.region, (0, drizzle_orm_1.eq)(schema_1.country.region_id, schema_1.region.id));
            }
            query = this.addPagination(query, page, limit);
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(schema_1.country[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = {
                data: (include === null || include === void 0 ? void 0 : include.count) ? (yield query).map(({ country }) => this.countRelatedEntities(country)).map(country => this.includeRelatedEntities(country, include)) : (yield query).map(({ country }) => this.includeRelatedEntities(country, include)),
                meta: { filter, orderBy: sort, page, limit, total, pages: Math.ceil(total / limit), rawsql }
            };
            // const result = {data: include?.count ? (await query).map(({country}) => country) : (await query).map(({country}) => country), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
            return result;
        });
    }
    /**
     * Retrieves all countries with optional filtering, sorting, and inclusion of related entities.
     * @async await (new {@link CountryRepository}()).{@link getAllCountries}({})
     * @param {CountryQueryOptions} options - {@link CountryQueryOptions} Options for filtering, sorting, and including related entities.
     * @param {CountryFilter} [options.filter={}] - {@link CountryFilter} Filtering parameters.
     * @param {CountrySort} [options.sort={field: 'id', direction: 'asc'}] - {@link CountrySort} Sorting parameters.
     * @param {CountryInclude} [options.include={}] - {@link CountryInclude} Parameters to include related entities (region and/or subregion).
     * @returns {Promise<{ data: any[], meta: { filter: CountryFilter, orderBy: CountrySort, total: number, rawsql: string } }>} The country data along with metadata including filter, order, total count, and raw SQL query.
     * @example
     * const cr = new CountryRepository();
     * const countries = await cr.getAllCountries({ filter: { name: 'Country' }, sort: { field: 'name', direction: 'asc' }, include: { region: true, subregion: true, count: true } });
     * // returns { data: Country[], meta: { filter: CountryFilter, orderBy: CountrySort, total: number, rawsql: string } }
     */
    getAllCountries(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                country: Object.assign(Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.region) ? { region: schema_1.region } : {})), ((include === null || include === void 0 ? void 0 : include.subregion) ? { subregion: schema_1.subregion } : {}))
            }).from(this.table).$dynamic();
            if (Object.keys(filter).length) {
                query = this.addFilters(query, filter);
            }
            if (include === null || include === void 0 ? void 0 : include.region) {
                query = query.leftJoin(schema_1.region, (0, drizzle_orm_1.eq)(schema_1.country.region_id, schema_1.region.id));
            }
            if (include === null || include === void 0 ? void 0 : include.subregion) {
                query = query.leftJoin(schema_1.subregion, (0, drizzle_orm_1.eq)(schema_1.country.subregion_id, schema_1.subregion.id));
            }
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(this.table[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = {
                data: (include === null || include === void 0 ? void 0 : include.count) ? (yield query).map(({ country }) => this.countRelatedEntities(country)).map(country => this.includeRelatedEntities(country, include)) : (yield query).map(({ country }) => this.includeRelatedEntities(country, include)),
                meta: { filter, orderBy: sort, total, rawsql }
            };
            return result;
        });
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
    findCountryById(id, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = this.db;
            let query = qb.select({
                country: Object.assign(Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.region) ? { region: schema_1.region } : {})), ((include === null || include === void 0 ? void 0 : include.subregion) ? { subregion: schema_1.subregion } : {}))
            }).from(this.table).where((0, drizzle_orm_1.eq)(schema_1.country.id, id)).$dynamic();
            if (include === null || include === void 0 ? void 0 : include.region) {
                query = query.leftJoin(schema_1.region, (0, drizzle_orm_1.eq)(schema_1.country.region_id, schema_1.region.id));
            }
            if (include === null || include === void 0 ? void 0 : include.subregion) {
                query = query.leftJoin(schema_1.subregion, (0, drizzle_orm_1.eq)(schema_1.country.subregion_id, schema_1.subregion.id));
            }
            const rawsql = query.toSQL();
            const result = { data: (include === null || include === void 0 ? void 0 : include.count) ? (yield query).map(({ country }) => this.countRelatedEntities(country)).map(country => this.includeRelatedEntities(country, include)) : (yield query).map(({ country }) => this.includeRelatedEntities(country, include)), meta: { rawsql } };
            return result;
        });
    }
    /**
   * Updates a country.
   * @param {number} id - The ID of the country to update.
   * @param {Partial<Omit<Country, 'id'>>} updates - The updates to apply to the country.
   * @returns {Promise<void>}
   * @example
   * await countryRepository.updateCountry(1, { name: 'Updated Country Name' });
   */
    updateCountry(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.update(this.table).set(updates).where((0, drizzle_orm_1.eq)(this.table.id, id));
        });
    }
    /**
 * Deletes a country.
 * @param {number} id - The ID of the country to delete.
 * @returns {Promise<void>}
 * @example
 * await countryRepository.deleteCountry(1);
 */
    deleteCountry(id) {
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
    /**
     * Counts the number of related countries and countries for a given country.
     * @param {number} countryId - The ID of the country.
     * @returns {Promise<{ countriesCount: number, countriesCount: number }>} The count of related countries and countries.
     * @example
     * const counts = countryRepository.countRelatedEntities({region_id: 1});
     * console.log('Related Entities Count:', counts);
     */
    countRelatedEntities(_a) {
        var { id } = _a, rest = __rest(_a, ["id"]);
        const cityCountResult = db_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.city)
            .where((0, drizzle_orm_1.eq)(schema_1.city.country_id, id))
            .all();
        const stateCountResult = db_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.state)
            .where((0, drizzle_orm_1.eq)(schema_1.state.country_id, id))
            .all();
        const stateCount = stateCountResult[0].count;
        const cityCount = cityCountResult[0].count;
        return Object.assign(Object.assign({ id }, rest), { stateCount, cityCount });
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
    includeRelatedEntities(_a, include) {
        var { id } = _a, rest = __rest(_a, ["id"]);
        const states = (include === null || include === void 0 ? void 0 : include.states) ? db_1.db
            .select()
            .from(schema_1.state)
            .where((0, drizzle_orm_1.eq)(schema_1.state.country_id, id))
            .all() : [];
        const cities = (include === null || include === void 0 ? void 0 : include.cities) ? db_1.db
            .select()
            .from(schema_1.city)
            .where((0, drizzle_orm_1.eq)(schema_1.city.country_id, id))
            .all() : [];
        return Object.assign(Object.assign({ id }, rest), { states, cities });
    }
}
exports.CountryRepository = CountryRepository;
exports.countryRepository = new CountryRepository();
