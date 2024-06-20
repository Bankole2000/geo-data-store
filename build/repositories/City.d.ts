import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { CommonSQLite } from "./Common";
import { City, CityFilter, CityInclude, CitySort } from "../utils/customtypes";
export declare class CityRepository extends CommonSQLite {
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
     * Retrieves a paginated list of citys.
     * @param {number} page - The page number to retrieve.
     * @param {number} limit - The number of citys per page.
     * @param {CityFilter} [filter] - Filtering parameters.
     * @param {CitySort} [sort] - Sorting parameters.
     * @param {CityInclude} [include] - Sorting parameters.
     * @param {boolean} [include.citys=false] - Whether to include related citys.
     * @param {boolean} [include.countries=false] - Whether to include related countries.
     * @returns {Promise<City[]>} The list of citys.
     * @example
     * const paginatedCitys = await cityRepository.getCitys(1, 10, { name: 'City' }, { field: 'name', direction: 'asc' }, true, true);
     * console.log('Paginated Citys:', paginatedCitys);
     */
    getCitys({ page, limit, filter, sort, include }: {
        page?: number;
        limit?: number;
        filter?: CityFilter;
        sort?: CitySort;
        include?: CityInclude;
    }): Promise<{
        data: {
            id: number;
            name: string;
            state_id: number;
            state_code: string;
            state_name: string;
            country_id: number;
            country_code: string;
            country_name: string;
            latitude: number;
            longitude: number;
            wikiDataId: string | null;
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
    getAllCitys({ filter, sort, include }: {
        filter?: CityFilter;
        sort?: CitySort;
        include?: CityInclude;
    }): Promise<{
        data: {
            id: number;
            name: string;
            state_id: number;
            state_code: string;
            state_name: string;
            country_id: number;
            country_code: string;
            country_name: string;
            latitude: number;
            longitude: number;
            wikiDataId: string | null;
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
            state_code: string;
            state_name: string;
            country_id: number;
            country_code: string;
            country_name: string;
            latitude: number;
            longitude: number;
            wikiDataId: string | null;
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
    getWhereOptions(filter: CityFilter): import("drizzle-orm").SQL<unknown> | null | undefined;
}
export declare const cityRepository: CityRepository;
