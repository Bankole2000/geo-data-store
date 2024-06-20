import { SQLiteSelectQueryBuilder } from "drizzle-orm/sqlite-core";
import { CommonSQLite } from "./Common";
import { Region, RegionFilter, RegionInclude, RegionSort, TRegionTranslation } from "../utils/customtypes";
export declare class RegionRepository extends CommonSQLite {
    db: import("drizzle-orm/better-sqlite3").BetterSQLite3Database<typeof import("../db/schema")>;
    table: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
        name: "region";
        schema: undefined;
        columns: {
            id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "id";
                tableName: "region";
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
                tableName: "region";
                dataType: "string";
                columnType: "SQLiteText";
                data: string;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
            }, object>;
            translations: import("drizzle-orm/sqlite-core").SQLiteColumn<{
                name: "translations";
                tableName: "region";
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
                tableName: "region";
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
     * Creates a new region.
     * @param {string} name - The name of the region.
     * @param {string} translations - JSON string of translations for the region.
     * @param {string} wikiDataId - The WikiData ID for the region.
     * @returns {Promise<Region>} The newly created region.
     * @example
     * const newRegion = await regionRepository.createRegion('Region Name', '{}', 'wikiDataId1');
     * console.log('New Region:', newRegion);
     */
    createRegion(name: string, translations: TRegionTranslation, wikiDataId: string): Promise<Region>;
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
    getRegions({ page, limit, filter, sort, include }: {
        page?: number;
        limit?: number;
        filter?: RegionFilter;
        sort?: RegionSort;
        include?: RegionInclude;
    }): Promise<{
        data: {
            region: {
                id: number;
                name: string;
                wikiDataId: string | null;
                translations: unknown;
            };
        }[] | (({ id, ...rest }: {
            id: number;
        }) => {
            subregionCount: unknown;
            countryCount: unknown;
            id: number;
        })[];
        meta: {
            filter: RegionFilter;
            orderBy: RegionSort;
            page: number;
            limit: number;
            total: number;
            pages: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
    getAllRegions({ filter, sort, include }: {
        filter?: RegionFilter;
        sort?: RegionSort;
        include?: RegionInclude;
    }): Promise<{
        data: {
            countries?: {
                id: number;
                name: string;
                latitude: number;
                longitude: number;
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
                subregion_id: number;
                nationality: string;
                timezones: import("../utils/customtypes").TTimezone[] | null;
                translations: import("../utils/customtypes").TTranslation | null;
                emoji: string;
                emojiU: string;
            }[] | undefined;
            subregions?: {
                id: number;
                name: string;
                wikiDataId: string | null;
                region_id: number;
                translations: unknown;
            }[] | undefined;
            id: number;
        }[];
        meta: {
            filter: RegionFilter;
            orderBy: RegionSort;
            total: number;
            rawsql: import("drizzle-orm").Query;
        };
    }>;
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
    findRegionById(id: number, include?: RegionInclude): Promise<{
        data: {
            countries?: {
                id: number;
                name: string;
                latitude: number;
                longitude: number;
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
                subregion_id: number;
                nationality: string;
                timezones: import("../utils/customtypes").TTimezone[] | null;
                translations: import("../utils/customtypes").TTranslation | null;
                emoji: string;
                emojiU: string;
            }[] | undefined;
            subregions?: {
                id: number;
                name: string;
                wikiDataId: string | null;
                region_id: number;
                translations: unknown;
            }[] | undefined;
            id: number;
        }[];
        meta: {
            rawsql: import("drizzle-orm").Query;
        };
    }>;
    /**
   * Updates a region.
   * @param {number} id - The ID of the region to update.
   * @param {Partial<Omit<Region, 'id'>>} updates - The updates to apply to the region.
   * @returns {Promise<void>}
   * @example
   * await regionRepository.updateRegion(1, { name: 'Updated Region Name' });
   */
    updateRegion(id: number, updates: Partial<Omit<Region, 'id'>>): Promise<void>;
    /**
 * Deletes a region.
 * @param {number} id - The ID of the region to delete.
 * @returns {Promise<void>}
 * @example
 * await regionRepository.deleteRegion(1);
 */
    deleteRegion(id: number): Promise<void>;
    addFilters<T extends SQLiteSelectQueryBuilder>(qb: T, filter: RegionFilter): T;
    getWhereOptions(filter: RegionFilter): import("drizzle-orm").SQL<unknown> | null | undefined;
    /**
     * Counts the number of related subregions and countries for a given region.
     * @param {number} regionId - The ID of the region.
     * @returns {Promise<{ subregionsCount: number, countriesCount: number }>} The count of related subregions and countries.
     * @example
     * const counts = regionRepository.countRelatedEntities({region_id: 1});
     * console.log('Related Entities Count:', counts);
     */
    countRelatedEntities({ id, ...rest }: {
        id: number;
    }): {
        subregionCount: unknown;
        countryCount: unknown;
        id: number;
    };
    includeRelatedEntities({ id, ...rest }: {
        id: number;
    }, include?: RegionInclude): {
        countries?: {
            id: number;
            name: string;
            latitude: number;
            longitude: number;
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
            subregion_id: number;
            nationality: string;
            timezones: import("../utils/customtypes").TTimezone[] | null;
            translations: import("../utils/customtypes").TTranslation | null;
            emoji: string;
            emojiU: string;
        }[] | undefined;
        subregions?: {
            id: number;
            name: string;
            wikiDataId: string | null;
            region_id: number;
            translations: unknown;
        }[] | undefined;
        id: number;
    };
}
export declare const regionRepository: RegionRepository;
