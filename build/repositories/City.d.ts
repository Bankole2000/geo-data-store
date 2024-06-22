import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { city } from "../db/schema";
import { CommonSQLite } from "./Common";
import { City, CityFilter, CityInclude, CityQueryOptions, CitySort } from "../utils/customtypes";
export declare class CityRepository extends CommonSQLite<typeof city> {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("../db/schema")>;
    table: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "city";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "id";
                tableName: "city";
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
                tableName: "city";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            state_id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "state_id";
                tableName: "city";
                dataType: "number";
                columnType: "SQLiteInteger";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            state_code: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "state_code";
                tableName: "city";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            state_name: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "state_name";
                tableName: "city";
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
                tableName: "city";
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
                tableName: "city";
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
                tableName: "city";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            latitude: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "latitude";
                tableName: "city";
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
                tableName: "city";
                dataType: "number";
                columnType: "SQLiteReal";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            wikiDataId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "wikiDataId";
                tableName: "city";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
        };
        dialect: "sqlite";
    }>;
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
    createCity(name: string, state_id: number, latitude: number, longitude: number, wikiDataId?: string | null): Promise<City>;
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
    getCities({ page, limit, filter, sort, include }: {
        page?: number;
        limit?: number;
    } & CityQueryOptions): Promise<{
        data: {
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
        meta: {
            filter: CityFilter;
            orderBy: CitySort;
            page: number;
            limit: number;
            total: number;
            pages: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
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
    getAllCities({ filter, sort, include }: CityQueryOptions): Promise<{
        data: {
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
        meta: {
            filter: CityFilter;
            orderBy: CitySort;
            total: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
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
    findCityById(id: number, include?: CityInclude): Promise<{
        data: {
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
        meta: {
            rawsql: import("drizzle-orm").Query;
        };
    }>;
    /**
   * Updates a city.
   * @param {number} id - The ID of the city to update.
   * @param {Partial<Omit<City, 'id'>>} updates - The updates to apply to the city.
   * @returns {Promise<void>}
   * @example
   * await cityRepository.updateCity(1, { name: 'Updated City Name' });
   */
    updateCity(id: number, updates: Partial<Omit<City, 'id'>>): Promise<void>;
    /**
 * Deletes a city.
 * @param {number} id - The ID of the city to delete.
 * @returns {Promise<void>}
 * @example
 * await cityRepository.deleteCity(1);
 */
    deleteCity(id: number): Promise<void>;
    addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: CityFilter): T;
}
export declare const cityRepository: CityRepository;
