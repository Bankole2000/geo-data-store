import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { CommonSQLite } from "./Common";
import { Country, CountryFilter, CountryInclude, CountrySort } from "../utils/customtypes";
export declare class CountryRepository extends CommonSQLite {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("../db/schema")>;
    table: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "country";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "id";
                tableName: "country";
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
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            iso3: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "iso3";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            iso2: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "iso2";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            numeric_code: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "numeric_code";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            phone_code: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "phone_code";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            capital: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "capital";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            currency: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "currency";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            currency_name: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "currency_name";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            currency_symbol: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "currency_symbol";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            tld: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "tld";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            native: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "native";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            region_id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "region_id";
                tableName: "country";
                dataType: "number";
                columnType: "SQLiteInteger";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            subregion_id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "subregion_id";
                tableName: "country";
                dataType: "number";
                columnType: "SQLiteInteger";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            nationality: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "nationality";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            timezones: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "timezones";
                tableName: "country";
                dataType: "json";
                columnType: "SQLiteTextJson";
                data: import("../utils/customtypes").TTimezone[];
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            translations: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "translations";
                tableName: "country";
                dataType: "json";
                columnType: "SQLiteTextJson";
                data: import("../utils/customtypes").TTranslation;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            latitude: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "latitude";
                tableName: "country";
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
                tableName: "country";
                dataType: "number";
                columnType: "SQLiteReal";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            emoji: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "emoji";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            emojiU: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "emojiU";
                tableName: "country";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
        };
        dialect: "sqlite";
    }>;
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
    createCountry(countryData: Omit<Country, 'id'>): Promise<Country>;
    /**
     * Retrieves a paginated list of countrys.
     * @param {number} page - The page number to retrieve.
     * @param {number} limit - The number of countrys per page.
     * @param {CountryFilter} [filter] - Filtering parameters.
     * @param {CountrySort} [sort] - Sorting parameters.
     * @param {CountryInclude} [include] - Sorting parameters.
     * @param {boolean} [include.countrys=false] - Whether to include related countrys.
     * @param {boolean} [include.countries=false] - Whether to include related countries.
     * @returns {Promise<Country[]>} The list of countrys.
     * @example
     * const paginatedCountrys = await countryRepository.getCountrys(1, 10, { name: 'Country' }, { field: 'name', direction: 'asc' }, true, true);
     * console.log('Paginated Countrys:', paginatedCountrys);
     */
    getCountrys({ page, limit, filter, sort, include }: {
        page?: number;
        limit?: number;
        filter?: CountryFilter;
        sort?: CountrySort;
        include?: CountryInclude;
    }): Promise<{
        data: {
            states: {
                id: number;
                name: string;
                state_code: string;
                country_id: number;
                country_code: string;
                country_name: string;
                latitude: number;
                longitude: number;
                type: string | null;
            }[];
            cities: {
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
            id: number;
        }[];
        meta: {
            filter: CountryFilter;
            orderBy: CountrySort;
            page: number;
            limit: number;
            total: number;
            pages: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
    getAllCountrys({ filter, sort, include }: {
        filter?: CountryFilter;
        sort?: CountrySort;
        include?: CountryInclude;
    }): Promise<{
        data: {
            states: {
                id: number;
                name: string;
                state_code: string;
                country_id: number;
                country_code: string;
                country_name: string;
                latitude: number;
                longitude: number;
                type: string | null;
            }[];
            cities: {
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
            id: number;
        }[];
        meta: {
            filter: CountryFilter;
            orderBy: CountrySort;
            total: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
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
    findCountryById(id: number, include?: CountryInclude): Promise<{
        data: {
            states: {
                id: number;
                name: string;
                state_code: string;
                country_id: number;
                country_code: string;
                country_name: string;
                latitude: number;
                longitude: number;
                type: string | null;
            }[];
            cities: {
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
            id: number;
        }[];
        meta: {
            rawsql: import("drizzle-orm").Query;
        };
    }>;
    /**
   * Updates a country.
   * @param {number} id - The ID of the country to update.
   * @param {Partial<Omit<Country, 'id'>>} updates - The updates to apply to the country.
   * @returns {Promise<void>}
   * @example
   * await countryRepository.updateCountry(1, { name: 'Updated Country Name' });
   */
    updateCountry(id: number, updates: Partial<Omit<Country, 'id'>>): Promise<void>;
    /**
 * Deletes a country.
 * @param {number} id - The ID of the country to delete.
 * @returns {Promise<void>}
 * @example
 * await countryRepository.deleteCountry(1);
 */
    deleteCountry(id: number): Promise<void>;
    addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: CountryFilter): T;
    getWhereOptions(filter: CountryFilter): import("drizzle-orm").SQL<unknown> | null | undefined;
    /**
     * Counts the number of related countrys and countries for a given country.
     * @param {number} countryId - The ID of the country.
     * @returns {Promise<{ countrysCount: number, countriesCount: number }>} The count of related countrys and countries.
     * @example
     * const counts = countryRepository.countRelatedEntities({region_id: 1});
     * console.log('Related Entities Count:', counts);
     */
    countRelatedEntities({ id, ...rest }: {
        id: number;
    }): {
        stateCount: unknown;
        cityCount: unknown;
        id: number;
    };
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
    includeRelatedEntities({ id, ...rest }: {
        id: number;
    }, include?: CountryInclude): {
        states: {
            id: number;
            name: string;
            state_code: string;
            country_id: number;
            country_code: string;
            country_name: string;
            latitude: number;
            longitude: number;
            type: string | null;
        }[];
        cities: {
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
        id: number;
    };
}
export declare const countryRepository: CountryRepository;
