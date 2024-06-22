import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { subregion } from "../db/schema";
import { CommonSQLite } from "./Common";
import { Subregion, SubregionFilter, SubregionSort, SubregionInclude, SubregionQueryOptions } from "../utils/customtypes";
export declare class SubregionRepository extends CommonSQLite<typeof subregion> {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("../db/schema")>;
    table: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "subregion";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "id";
                tableName: "subregion";
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
                tableName: "subregion";
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
                tableName: "subregion";
                dataType: "number";
                columnType: "SQLiteInteger";
                data: number;
                driverParam: number;
                notNull: true;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            translations: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "translations";
                tableName: "subregion";
                dataType: "json";
                columnType: "SQLiteTextJson";
                data: unknown;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                enumValues: undefined;
                baseColumn: never;
            }, object>;
            wikiDataId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "wikiDataId";
                tableName: "subregion";
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
     * Creates a new subregion.
     * @param {string} name - The name of the subregion.
     * @param {string} translations - JSON string of translations for the subregion.
     * @param {string} wikiDataId - The WikiData ID for the subregion.
     * @returns {Promise<Subregion>} The newly created subregion.
     * @example
     * const newSubregion = await subregionRepository.createSubregion('Subregion Name', '{}', 'wikiDataId1');
     * console.log('New Subregion:', newSubsubregion);
     */
    createSubregion(name: string, region_id: number, translations: unknown, wikiDataId: string): Promise<Subregion>;
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
    getSubregions({ page, limit, filter, sort, include }: {
        page?: number;
        limit?: number;
    } & SubregionQueryOptions): Promise<{
        data: {
            countries: {
                id: number;
                name: string;
                iso3: string;
                iso2: string;
                numeric_code: string;
                phone_code: string;
                capital: string;
                currency: string;
                currency_name: string;
                currency_symbol: string;
                tld: string;
                native: string;
                region_id: number;
                translations: import("../utils/customtypes").TTranslation | null;
                subregion_id: number;
                nationality: string;
                timezones: import("../utils/customtypes").TTimezone[] | null;
                latitude: number;
                longitude: number;
                emoji: string;
                emojiU: string;
            }[];
            id: number;
        }[];
        meta: {
            filter: SubregionFilter;
            orderBy: SubregionSort;
            page: number;
            limit: number;
            total: number;
            pages: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
    /**
     * Retrieves all subregions with optional filtering, sorting, and inclusion of related entities.
     * @async await (new {@link SubregionRepository}()).{@link getAllSubregions}({})
     * @param {SubregionQueryOptions} options - {@link SubregionQueryOptions} Options for filtering, sorting, and including related entities.
     * @param {SubregionFilter} [options.filter={}] - {@link SubregionFilter} Filtering parameters.
     * @param {SubregionSort} [options.sort={field: 'id', direction: 'asc'}] - {@link SubregionSort} Sorting parameters.
     * @param {SubregionInclude} [options.include={}] - {@link SubregionInclude} Parameters to include related entities (region).
     * @returns {Promise<{ data: any[], meta: { filter: SubregionFilter, orderBy: SubregionSort, total: number, rawsql: string } }>} The subregion data along with metadata including filter, order, total count, and raw SQL query.
     * @example
     * const sr = new SubregionRepository();
     * const subregions = await sr.getAllSubregions({ filter: { name: 'Subregion' }, sort: { field: 'name', direction: 'asc' }, include: { region: true, count: true } });
     * // returns { data: Subregion[], meta: { filter: SubregionFilter, orderBy: SubregionSort, total: number, rawsql: string } }
     */
    getAllSubregions({ filter, sort, include }: SubregionQueryOptions): Promise<{
        data: {
            countries: {
                id: number;
                name: string;
                iso3: string;
                iso2: string;
                numeric_code: string;
                phone_code: string;
                capital: string;
                currency: string;
                currency_name: string;
                currency_symbol: string;
                tld: string;
                native: string;
                region_id: number;
                translations: import("../utils/customtypes").TTranslation | null;
                subregion_id: number;
                nationality: string;
                timezones: import("../utils/customtypes").TTimezone[] | null;
                latitude: number;
                longitude: number;
                emoji: string;
                emojiU: string;
            }[];
            id: number;
        }[];
        meta: {
            filter: SubregionFilter;
            orderBy: SubregionSort;
            total: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
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
    findSubregionById(id: number, include?: SubregionInclude): Promise<{
        data: {
            countries: {
                id: number;
                name: string;
                iso3: string;
                iso2: string;
                numeric_code: string;
                phone_code: string;
                capital: string;
                currency: string;
                currency_name: string;
                currency_symbol: string;
                tld: string;
                native: string;
                region_id: number;
                translations: import("../utils/customtypes").TTranslation | null;
                subregion_id: number;
                nationality: string;
                timezones: import("../utils/customtypes").TTimezone[] | null;
                latitude: number;
                longitude: number;
                emoji: string;
                emojiU: string;
            }[];
            id: number;
        }[];
        meta: {
            rawsql: import("drizzle-orm").Query;
        };
    }>;
    /**
   * Updates a subregion.
   * @param {number} id - The ID of the subregion to update.
   * @param {Partial<Omit<Subregion, 'id'>>} updates - The updates to apply to the subregion.
   * @returns {Promise<void>}
   * @example
   * await subregionRepository.updateSubregion(1, { name: 'Updated Subregion Name' });
   */
    updateSubregion(id: number, updates: Partial<Omit<Subregion, 'id'>>): Promise<void>;
    /**
 * Deletes a subregion.
 * @param {number} id - The ID of the subregion to delete.
 * @returns {Promise<void>}
 * @example
 * await subregionRepository.deleteSubregion(1);
 */
    deleteSubregion(id: number): Promise<void>;
    addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: SubregionFilter): T;
    /**
     * Counts the number of related subregions and countries for a given subregion.
     * @param {number} subregionId - The ID of the subregion.
     * @returns {Promise<{ subregionsCount: number, countriesCount: number }>} The count of related subregions and countries.
     * @example
     * const counts = subregionRepository.countRelatedEntities({region_id: 1});
     * console.log('Related Entities Count:', counts);
     */
    countRelatedEntities({ id, ...rest }: {
        id: number;
    }): {
        countryCount: unknown;
        id: number;
    };
    includeRelatedEntities({ id, ...rest }: {
        id: number;
    }, include?: SubregionInclude): {
        countries: {
            id: number;
            name: string;
            iso3: string;
            iso2: string;
            numeric_code: string;
            phone_code: string;
            capital: string;
            currency: string;
            currency_name: string;
            currency_symbol: string;
            tld: string;
            native: string;
            region_id: number;
            translations: import("../utils/customtypes").TTranslation | null;
            subregion_id: number;
            nationality: string;
            timezones: import("../utils/customtypes").TTimezone[] | null;
            latitude: number;
            longitude: number;
            emoji: string;
            emojiU: string;
        }[];
        id: number;
    };
}
export declare const subregionRepository: SubregionRepository;
