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
exports.stateRepository = exports.StateRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const Common_1 = require("./Common");
class StateRepository extends Common_1.CommonSQLite {
    constructor() {
        super(...arguments);
        this.db = db_1.db;
        this.table = schema_1.state;
    }
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
    createState(name, country_id, state_code, latitude, longitude, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundCountry = yield this.db.query.country.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.country.id, country_id) });
            if (!foundCountry)
                throw new Error(`Country with id '${country_id}' not found`);
            const { iso2: country_code, name: country_name } = foundCountry;
            const [newState] = yield this.db.insert(this.table).values({ name, country_id, country_code, country_name, state_code, latitude, longitude, type }).returning();
            return newState;
        });
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
    getStates(_a) {
        return __awaiter(this, arguments, void 0, function* ({ page = 1, limit = 10, filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                state: Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.country) ? { country: schema_1.country } : {})),
            }).from(this.table).$dynamic();
            if (filter) {
                query = this.addFilters(query, filter);
            }
            if (include === null || include === void 0 ? void 0 : include.country) {
                query = query.leftJoin(schema_1.country, (0, drizzle_orm_1.eq)(schema_1.state.country_id, schema_1.country.id));
            }
            query = this.addPagination(query, page, limit);
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(schema_1.state[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = {
                data: (include === null || include === void 0 ? void 0 : include.count) ? (yield query).map(({ state }) => this.countRelatedEntities(state)) : (yield query).map(({ state }) => state),
                meta: { filter, orderBy: sort, page, limit, total, pages: Math.ceil(total / limit), rawsql }
            };
            // const result = {data: include?.count ? (await query).map(({state}) => state) : (await query).map(({state}) => state), meta: {filter, orderBy: sort, page, limit, total, pages: Math.ceil(total/limit), rawsql}}
            return result;
        });
    }
    getAllStates(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filter = {}, sort = { field: 'id', direction: 'asc' }, include = {} }) {
            const qb = this.db;
            let query = qb.select({
                state: Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.country) ? { country: schema_1.country } : {}))
            }).from(this.table).$dynamic();
            if (filter) {
                query = this.addFilters(query, filter);
            }
            if (include === null || include === void 0 ? void 0 : include.country) {
                query = query.leftJoin(schema_1.country, (0, drizzle_orm_1.eq)(schema_1.state.country_id, schema_1.country.id));
            }
            const direction = sort.direction === 'asc' ? drizzle_orm_1.asc : drizzle_orm_1.desc;
            query = query.orderBy(direction(this.table[sort.field]));
            const total = (filter ? yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table).where(this.getWhereOptions(filter)) : yield db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(this.table))[0].count;
            const rawsql = query.toSQL();
            const result = {
                data: (include === null || include === void 0 ? void 0 : include.count) ? (yield query).map(({ state }) => this.countRelatedEntities(state)).map(state => this.includeRelatedEntities(state, include)) : (yield query).map(({ state }) => this.includeRelatedEntities(state, include)),
                meta: { filter, orderBy: sort, total, rawsql }
            };
            return result;
        });
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
    findStateById(id, include) {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = this.db;
            let query = qb.select({
                state: Object.assign(Object.assign({}, this.table), ((include === null || include === void 0 ? void 0 : include.country) ? { country: schema_1.country } : {}))
            }).from(this.table).where((0, drizzle_orm_1.eq)(schema_1.state.id, id)).$dynamic();
            if (include === null || include === void 0 ? void 0 : include.country) {
                query = query.leftJoin(schema_1.country, (0, drizzle_orm_1.eq)(schema_1.state.country_id, schema_1.country.id));
            }
            const rawsql = query.toSQL();
            const result = { data: (include === null || include === void 0 ? void 0 : include.count) ? (yield query).map(({ state }) => this.countRelatedEntities(state)).map(state => this.includeRelatedEntities(state, include)) : (yield query).map(({ state }) => this.includeRelatedEntities(state, include)), meta: { rawsql } };
            return result;
        });
    }
    /**
   * Updates a state.
   * @param {number} id - The ID of the state to update.
   * @param {Partial<Omit<State, 'id'>>} updates - The updates to apply to the state.
   * @returns {Promise<void>}
   * @example
   * await stateRepository.updateState(1, { name: 'Updated State Name' });
   */
    updateState(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.db.update(this.table).set(updates).where((0, drizzle_orm_1.eq)(this.table.id, id));
        });
    }
    /**
     * Deletes a state.
     * @param {number} id - The ID of the state to delete.
     * @returns {Promise<void>}
     * @example
     * await stateRepository.deleteState(1);
     */
    deleteState(id) {
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
        if (filter.id)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.state.id, filter.id));
        if (filter.name)
            conditions.push((0, drizzle_orm_1.like)(schema_1.state.name, `%${filter.name}%`));
        if (filter.country_id)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.state.country_id, filter.country_id));
        if (filter.country_code)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.state.country_code, filter.country_code));
        if (filter.country_name)
            conditions.push((0, drizzle_orm_1.like)(schema_1.state.country_name, `%${filter.country_name}%`));
        if (filter.state_code)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.state.state_code, filter.state_code));
        if (filter.type)
            conditions.push((0, drizzle_orm_1.like)(schema_1.state.type, `%${filter.type}%`));
        return conditions.length ? filterOperation(...conditions) : null;
    }
    /**
     * Counts the number of related states and countries for a given state.
     * @param {number} stateId - The ID of the state.
     * @returns {Promise<{ statesCount: number, countriesCount: number }>} The count of related states and countries.
     * @example
     * const counts = stateRepository.countRelatedEntities({region_id: 1});
     * console.log('Related Entities Count:', counts);
     */
    countRelatedEntities(_a) {
        var { id } = _a, rest = __rest(_a, ["id"]);
        const cityCountResult = db_1.db
            .select({ count: (0, drizzle_orm_1.sql) `COUNT(*)` })
            .from(schema_1.city)
            .where((0, drizzle_orm_1.eq)(schema_1.city.state_id, id))
            .all();
        const cityCount = cityCountResult[0].count;
        return Object.assign(Object.assign({ id }, rest), { cityCount });
    }
    includeRelatedEntities(_a, include) {
        var { id } = _a, rest = __rest(_a, ["id"]);
        const cities = (include === null || include === void 0 ? void 0 : include.cities) ? db_1.db
            .select()
            .from(schema_1.city)
            .where((0, drizzle_orm_1.eq)(schema_1.city.state_id, id))
            .all() : [];
        return Object.assign(Object.assign({ id }, rest), { cities });
    }
}
exports.StateRepository = StateRepository;
exports.stateRepository = new StateRepository();
