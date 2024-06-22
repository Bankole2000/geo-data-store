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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityRepository = exports.CityRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const Common_1 = require("./Common");
class CityRepository extends Common_1.CommonSQLite {
    constructor() {
        super(...arguments);
        this.db = db_1.db;
        this.table = schema_1.city;
        // getWhereOptions(filter: CityFilter | CityFilter[]){
        //   if (!Array.isArray(filter)){
        //     const filterOperation = filter?.operation === 'or' ? or : and
        //     const conditions: SQLWrapper[] = []
        //     if (filter.name) conditions.push(like(city.name, `%${filter.name}%`))
        //     if (filter.state_name) conditions.push(like(city.state_name, `%${filter.state_name}%`))
        //     if (filter.country_name) conditions.push(like(city.country_name, `%${filter.country_name}%`))
        //     if (filter.wikiDataId) conditions.push(like(city.wikiDataId, `%${filter.wikiDataId}%`))
        //     if (filter.id) conditions.push(eq(city.id, filter.id))
        //     if (filter.country_id) conditions.push(eq(city.country_id, filter.country_id))
        //     if (filter.state_id) conditions.push(eq(city.state_id, filter.state_id))
        //     if (filter.state_code) conditions.push(eq(city.state_code, filter.state_code))
        //     if (filter.country_code) conditions.push(eq(city.country_code, filter.country_code))
        //     if (filter.subfilters) conditions.push(this.getWhereOptions(filter.subfilters)!)
        //     return filterOperation(...conditions);
        //   } else {
        //     filter.forEach(f => {
        //     })
        //   }
        // }
    }
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
    createCity(name_1, state_id_1, latitude_1, longitude_1) {
        return __awaiter(this, arguments, void 0, function* (name, state_id, latitude, longitude, wikiDataId = null) {
            const foundState = yield this.db.query.state.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.state.id, state_id) });
            if (!foundState)
                throw new Error(`State with id '${state_id}' not found`);
            const { country_code, country_id, country_name, state_code, name: state_name } = foundState;
            const [newCity] = yield this.db.insert(this.table).values({ name, state_id, country_id, country_code, country_name, state_code, state_name, wikiDataId, latitude, longitude }).returning();
            return newCity;
        });
    }
    /**
     * Retrieves a paginated list of cities.
     * @async (new {@link CityRepository}()).{@link getCities}({})
     * @param {Object} options - Options for pagintion, filtering, sorting, and including related entities.
     * @param {number} [options.limit] - The number of cities per page.
     * @param {CityFilter} [options.filter] - {@link CityFilter} Filtering parameters.
     * @param {CitySort} [options.sort] - {@link CitySort} Sorting parameters.
     * @param {CityInclude} [options.include] - {@link CityInclude} Whether to include related resources.
     * @param {boolean} [include.state=false] - Whether to include related state.
     * @param {boolean} [include.country=false] - Whether to include related country.
     * @returns {Promise<City[]>} - {data: City[], meta: any} - The list of cities.
     * @example
     * // Get cities in US whose name contains 'New'
     * // Paginate and include Country + state data
     * const paginatedCities = await cityRepository.getCities({
     *    page: 1, limit: 10,
     *    filter: { name: 'New', country_code: 'US' },
     *    sort = { field: 'name', direction: 'asc' },
     *    include: {country: true, state: true}
     * });
     */
    getCities(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                city: Object.assign(Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.state) ? { state: schema_1.state } : {})), ((include === null || include === void 0 ? void 0 : include.country) ? { country: schema_1.country } : {})),
            }).from(this.table).$dynamic();
            if (Object.keys(filter).length) {
                query = this.addFilters(query, filter);
            }
            if (include === null || include === void 0 ? void 0 : include.country) {
                query = query.leftJoin(schema_1.country, (0, drizzle_orm_1.eq)(schema_1.city.country_id, schema_1.country.id));
            }
            if (include === null || include === void 0 ? void 0 : include.state) {
                query = query.leftJoin(schema_1.state, (0, drizzle_orm_1.eq)(schema_1.city.state_id, schema_1.state.id));
            }
            query = this.addPagination(query, page, limit);
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(schema_1.city[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = { data: (yield query).map(({ city }) => city), meta: { filter, orderBy: sort, page, limit, total, pages: Math.ceil(total / limit), rawsql } };
            return result;
        });
    }
    /**
     * Retrieves all cities with optional filtering, sorting, and inclusion of related entities.
     * @async new {@link CityRepository}.{@link getAllCities}({})
     * @param {CityQueryOptions} options - {@link CityQueryOptions} Options for filtering, sorting, and including related entities.
     * @param {CityFilter} [options.filter={}] - {@link CityFilter} Filtering parameters.
     * @param {CitySort} [options.sort={field: 'id', direction: 'asc'}] - {@link CitySort} Sorting parameters.
     * @param {CityInclude} [options.include={}] - {@link CityInclude} Parameters to include related entities (country and/or state).
     * @returns {Promise<{ data: any[], meta: { filter: CityFilter, orderBy: CitySort, total: number, rawsql: string } }>} The city data along with metadata including filter, order, total count, and raw SQL query.
     * @example
     * const cr = new CityRepository();
     * const cities = await cr.getAllCities({ filter: { name: 'City' }, sort: { field: 'name', direction: 'asc' }, include: { country: true, state: true } });
     * // returns { data: City[], meta: { filter: CityFilter, orderBy: CitySort, total: number, rawsql: string } }
     */
    getAllCities(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                city: Object.assign(Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.country) ? { country: schema_1.country } : {})), ((include === null || include === void 0 ? void 0 : include.state) ? { state: schema_1.state } : {}))
            }).from(this.table).$dynamic();
            if (Object.keys(filter).length) {
                query = this.addFilters(query, filter);
            }
            if (include === null || include === void 0 ? void 0 : include.country) {
                query = query.leftJoin(schema_1.country, (0, drizzle_orm_1.eq)(schema_1.city.country_id, schema_1.country.id));
            }
            if (include === null || include === void 0 ? void 0 : include.state) {
                query = query.leftJoin(schema_1.state, (0, drizzle_orm_1.eq)(schema_1.city.state_id, schema_1.state.id));
            }
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(this.table[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = { data: (yield query).map(({ city }) => city), meta: { filter, orderBy: sort, total, rawsql } };
            return result;
        });
    }
    /**
     * Finds a city by its ID with optional related entities.
     * @async {@link findCityById}
     * @param {number} id - The ID of the city to find.
     * @param {CityInclude} [include] - {@link CityInclude} Optional parameter to include related entities (country and/or state).
     * @returns {Promise<{ data: any[], meta: { rawsql: string } }>} The city data along with optional related entities and raw SQL query.
     * @example
     * const cr = new CityRepository();
     * const city = await cr.findCityById(1);
     * // returns { data: City[], meta: {rawsql: string}}
     * const cityWithIncludes = await cr.findCityById(1, { country: true, state: true });
     * // returns { data: CityWithIncludes[], meta: {rawsql: string}}
     */
    findCityById(id, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = this.db;
            let query = qb.select({
                city: Object.assign(Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.country) ? { country: schema_1.country } : {})), ((include === null || include === void 0 ? void 0 : include.state) ? { state: schema_1.state } : {}))
            }).from(this.table).where((0, drizzle_orm_1.eq)(schema_1.city.id, id)).$dynamic();
            if (include === null || include === void 0 ? void 0 : include.country) {
                query = query.leftJoin(schema_1.country, (0, drizzle_orm_1.eq)(schema_1.city.country_id, schema_1.country.id));
            }
            if (include === null || include === void 0 ? void 0 : include.state) {
                query = query.leftJoin(schema_1.state, (0, drizzle_orm_1.eq)(schema_1.city.state_id, schema_1.state.id));
            }
            const rawsql = query.toSQL();
            const result = { data: (yield query).map(({ city }) => city), meta: { rawsql } };
            return result;
        });
    }
    /**
   * Updates a city.
   * @param {number} id - The ID of the city to update.
   * @param {Partial<Omit<City, 'id'>>} updates - The updates to apply to the city.
   * @returns {Promise<void>}
   * @example
   * await cityRepository.updateCity(1, { name: 'Updated City Name' });
   */
    updateCity(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.update(this.table).set(updates).where((0, drizzle_orm_1.eq)(this.table.id, id));
        });
    }
    /**
 * Deletes a city.
 * @param {number} id - The ID of the city to delete.
 * @returns {Promise<void>}
 * @example
 * await cityRepository.deleteCity(1);
 */
    deleteCity(id) {
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
}
exports.CityRepository = CityRepository;
exports.cityRepository = new CityRepository();
