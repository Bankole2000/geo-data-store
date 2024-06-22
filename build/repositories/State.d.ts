import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { state } from "../db/schema";
import { CommonSQLite } from "./Common";
import { State, StateFilter, StateSort, StateInclude, StateQueryOptions } from "../utils/customtypes";
export declare class StateRepository extends CommonSQLite<typeof state> {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("../db/schema")>;
    table: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "state";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "id";
                tableName: "state";
                dataType: "number";
                columnType: "SQLiteInteger";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: true;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            name: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "name";
                tableName: "state";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            country_id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "country_id";
                tableName: "state";
                dataType: "number";
                columnType: "SQLiteInteger";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            country_code: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "country_code";
                tableName: "state";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            country_name: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "country_name";
                tableName: "state";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            state_code: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "state_code";
                tableName: "state";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            type: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "type";
                tableName: "state";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            latitude: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "latitude";
                tableName: "state";
                dataType: "number";
                columnType: "SQLiteReal";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            longitude: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "longitude";
                tableName: "state";
                dataType: "number";
                columnType: "SQLiteReal";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
        };
        dialect: "sqlite";
    }>;
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
    createState(name: string, country_id: number, state_code: string, latitude: number, longitude: number, type?: string): Promise<State>;
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
    getStates({ page, limit, filter, sort, include }: {
        page?: number;
        limit?: number;
    } & StateQueryOptions): Promise<{
        data: {
            id: number;
            name: string;
            country_id: number;
            latitude: number;
            longitude: number;
            country_code: string;
            country_name: string;
            state_code: string;
            type: string | null;
        }[] | {
            cityCount: unknown;
            id: number;
        }[];
        meta: {
            filter: StateFilter;
            orderBy: StateSort;
            page: number;
            limit: number;
            total: number;
            pages: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
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
    getAllStates({ filter, sort, include }: StateQueryOptions): Promise<{
        data: {
            cities: {
                id: number;
                name: string;
                state_id: number;
                country_id: number;
                wikiDataId: string | null;
                latitude: number;
                longitude: number;
                country_code: string;
                country_name: string;
                state_code: string;
                state_name: string;
            }[];
            id: number;
        }[];
        meta: {
            filter: StateFilter;
            orderBy: StateSort;
            total: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
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
    findStateById(id: number, include?: StateInclude): Promise<{
        data: {
            cities: {
                id: number;
                name: string;
                state_id: number;
                country_id: number;
                wikiDataId: string | null;
                latitude: number;
                longitude: number;
                country_code: string;
                country_name: string;
                state_code: string;
                state_name: string;
            }[];
            id: number;
        }[];
        meta: {
            rawsql: import("drizzle-orm").Query;
        };
    }>;
    /**
   * Updates a state.
   * @param {number} id - The ID of the state to update.
   * @param {Partial<Omit<State, 'id'>>} updates - The updates to apply to the state.
   * @returns {Promise<void>}
   * @example
   * await stateRepository.updateState(1, { name: 'Updated State Name' });
   */
    updateState(id: number, updates: Partial<Omit<State, 'id'>>): Promise<void>;
    /**
     * Deletes a state.
     * @param {number} id - The ID of the state to delete.
     * @returns {Promise<void>}
     * @example
     * await stateRepository.deleteState(1);
     */
    deleteState(id: number): Promise<void>;
    addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: StateFilter): T;
    /**
     * Counts the number of related states and countries for a given state.
     * @param {number} stateId - The ID of the state.
     * @returns {Promise<{ statesCount: number, countriesCount: number }>} The count of related states and countries.
     * @example
     * const counts = stateRepository.countRelatedEntities({region_id: 1});
     * console.log('Related Entities Count:', counts);
     */
    countRelatedEntities({ id, ...rest }: {
        id: number;
    }): {
        cityCount: unknown;
        id: number;
    };
    includeRelatedEntities({ id, ...rest }: {
        id: number;
    }, include?: StateInclude): {
        cities: {
            id: number;
            name: string;
            state_id: number;
            country_id: number;
            wikiDataId: string | null;
            latitude: number;
            longitude: number;
            country_code: string;
            country_name: string;
            state_code: string;
            state_name: string;
        }[];
        id: number;
    };
}
export declare const stateRepository: StateRepository;
